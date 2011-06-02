
/*
Copyright 2011 Sleepless Software Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 

*/

// ==================================================
// json daemon (server code)
// ==================================================

var fs = require("fs"),
	url = require("url"),
	util = require("util"),
	http = require("http")


var log = console.log

var j2o = function(j) { return JSON.parse(j) }
var o2j = function(o) { return JSON.stringify(o) }


var fail = function(res, err) {
	var msg = o2j({error:err.message})
	res.writeHead(500, {
		"Content-Type": "text/plain",
		"Content-Length": msg.length,
	})
	res.end(msg)
}

function r404(res) {
	var msg = "FILE NOT FOUND"
	res.writeHead(404, {
		"Content-Type": "text/plain",
		"Content-Length": msg.length,
	})
	res.end(msg)
}


var post = function(req, res) {
	log("POST "+req.url)
	var jsonIn = ""
	req.setEncoding("utf8")
	req.on("data", function(d) {
		jsonIn += d
	})
	req.on("error", function(e) {
		fail(res, e)
	})
	req.on("end", function() {
		try {
			var objIn = j2o(jsonIn)
			msgHandler(objIn, function(objOut) {
				var jsonOut = o2j(objOut)
				res.writeHead(200, {
					"Content-Type": "text/plain",
					"Content-Length": jsonOut.length,
				})
				res.end(jsonOut)
			})
		}
		catch(e) {
			fail(res, e)
		}
	})
}


var isReadableFile = function(path) {
	try {
		if(fs.statSync(path).isFile()) {
			fs.close(fs.openSync(path, "r"))
			return true;
		}
	}
	catch(e) { }
	return false
}

var get = function(req, res) {
	log("GET "+req.url)
	var u = url.parse(req.url, true),
		path = u.pathname
	if(!/\.\./.test(req.path)) {
		if(path == "/")
			path = "/index.html"
		path = "docroot"+path
		if(isReadableFile(path)) {
			util.pump(fs.createReadStream(path), res, function(e) {
				res.end("end")
			})
			return
		}
	}
	r404(res)		// check for mischievous path
}


exports.createServer = function(msgHandler) {

	return http.createServer(function(req, res) {
		switch(req.method) {
		case "POST":
			post(req, res)
			break
		case "GET":
			get(req, res)
			break
		default:
			fail(res, new Error("BAD METHOD: "+req.method))
		}
	})
}



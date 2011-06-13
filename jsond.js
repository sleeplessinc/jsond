
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


var fs = require("fs"),
	url = require("url"),
	util = require("util"),
	http = require("http"),
	l = console.log
	
function j2o(j) { try { return JSON.parse(j) } catch(e) { return null } }
function o2j(o) { return JSON.stringify(o) }


function r500(res, s) {
	if(!s)
		s = "ERROR"
	res.writeHead(500, {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "text/plain",
		"Content-Length": s.length,
	})
	res.end(s)
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


function finish(res, s) {
	res.writeHead(200, {
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "text/plain",
		"Content-Length": s.length,
	})
	res.end(s)
}


var readBody = function(req, res, cb) {
	var body = ""

	req.setEncoding("utf8")
	req.on("data", function(d) {
		body += d
	})
	req.on("error", function(e) {
		r500(res, "error reading input")
	})
	req.on("end", function() {
		cb(body)
	})
}


function streamOut(res, path) {
	path = "docroot"+path
	if(!/\.\./.test(path)) {
		if(isReadableFile(path)) {
			util.pump(fs.createReadStream(path), res, function(e) {
				res.end("end")
			})
			return
		}
	}
	r500(res, "file not found")
}

function www(tx) {
	var res = tx.res,
		m = tx.req.method,
		u = tx.u,
		path = u.pathname
	
	if(m == "GET") {
		if(path == "/")
			path = "/index.html"
		streamOut(res, path)
		return;
	}

	r500(res, "unsupported method: "+m)
}


function api(tx, msgHandler) {
	var res = tx.res,
		req = tx.req,
		m = tx.req.method,
		json = tx.u.query.j

	if(m == "POST") {
		readBody(req, res, function(json) {
			msgHandler(tx, j2o(json), function(msgOut) {
				finish(res, o2j(msgOut))
			})
		})
		return
	}

	if(m == "GET") {
		if(json) {
			msgHandler(tx, j2o(json), function(msgOut) {
				finish(res, o2j(msgOut)) // finish(res, "jsond.recv("+o2j(msgOut)+");\n")
			})
		}
		else {
			streamOut(res, "/api.js")
		}
		return
	}

	r500(res, "unsupported method: "+m)
}


exports.createServer = function(msgHandler) {
	return http.createServer(function(req, res) {
		var u = url.parse(req.url, true),
			tx = { req:req, res:res, u:u }

		l(req.method+" "+req.url)

		if(req.method == "OPTIONS") {
			res.writeHead(200, {
				"Access-Control-Allow-Origin": "*",
			})
		}
		else {
			if(/^\/api\/?$/.test(u.pathname))
				api(tx, msgHandler)
			else
				www(tx)
		}

	})
}




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

var url = require("url"),
	http = require("http"),
	log = require("log5")


var j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }
var o2j = function(o) { return JSON.stringify(o) }
var millis = function() { return new Date().getTime() }
var time = function() { return Math.floor(millis() / 1000) }

var nop = function(){}


function messageEnd(tx, msgOut) {
	var json = o2j(msgOut)

	log3("<<< "+json)

	tx.res.writeHead(200, {
		"Cache-Control": "no-cache",
		"Content-Type": "text/plain",
		"Content-Length": ""+json.length,
	})

	tx.res.end(json)
}


function messageStart(tx, json) {
	var msg = j2o(json)

	log3(">>> "+json)

	tx.json = json
	tx.msg = msg
	if(!msg) 
		return fail(tx, "bad message")

	tx.cb(msg, function(msgOut) { messageEnd(tx, msgOut) }, tx)
}


function fail(tx, why) {
	var rc = 500

	why = why || "mystery"
	log3("FAIL: "+why)
	s = "ERROR "+rc
	tx.res.writeHead(rc, {
		"Content-Type": "text/plain",
		"Content-Length": s.length
	})
	tx.res.end(s)
}

function messageInit(tx) {
	var m = tx.req.method,
		json = tx.query.j

	if(!json) {

		// json message absent

		if(m == "GET") {
			// special case: "GET /api/ HTTP/1.x" - return the api.js boot strap file
			tx.req.url = "/api.js"
			www(tx.req, tx.res)
			return
		}
		fail(tx, "no message")
		return
	}

	// json message present

	if(m == "GET") {
		messageStart(tx, json)
		return
	}

	if(m == "POST") {
		tx.req.pause()		// necessary?
		messageStart(tx, json)
		return
	}

	fail(tx, "bad method "+m)
}


// Static pages delivered using paperboy
boy = require("paperboy")
function www(req, res) {
	boy
		.deliver("docroot", req, res)
		.before(function() {
		})
		.after(function() {
			log3("PB OK "+req.method+req.url)
		})
		.error(function() {
			wwwErr(req, res, 500) 
		})
		.otherwise(function() {
			wwwErr(req, res, 404) 
		})
}
function wwwErr(req, res, r) {
	res.writeHead(r, {'Content-Type': 'text/plain'})
	res.end("Error "+r)
	log3(r+" "+req.method+req.url)
}


// Every request starts here
function accept(req, res, cb) {
	var u = url.parse(req.url, true),
		path = u.pathname

	if(/^\/api\/?$/.test(path)) {
		messageInit({cb:(cb || nop), req:req, res:res, path:path, query:u.query, u:u})
		return;
	}

	if(req.method == "OPTIONS") {
		res.writeHead(200, {
			"Access-Control-Allow-Origin": "*",	// to support cross-domain script execution of our api
			"Access-Control-Max-Age": "0",
		})
		res.end()
		return;
	}

	www(req, res)					// everything else handled by paperboy
}

exports.createServer = function(cb) {
	return http.createServer(function(req, res) {
		accept(req, res, cb)
	}) 
}


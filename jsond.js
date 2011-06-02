
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

var o2j = function(o) { return JSON.stringify(o) }
var j2o = function(j) { return JSON.parse(j) }

try{ navigator

	// ==================================================
	// browser code
	// ==================================================

	(function(){
		var doc = document,
			loc = doc.location,
			j = {}
		j.nop = function(){}
		j.proto = /^https?:$/.test(loc.protocol) || "http:"
		j.host = loc.host || "127.0.0.1"
		j.port = 3333
		j.url = j.proto+"//"+j.host+":"+j.port+"/"
		j.send = function(objOut, cb) {
			var cb = cb || nop,
				r = new XMLHttpRequest()
			r.open("POST", j.url, true);
			r.onreadystatechange = function() {
				if(r.readyState == 4) {
					try {
						cb(j2o(r.responseText))
					}
					catch(e) {
						cb({error:e.message})
					}
					r.onreadystatechange = nop
				}
			}
			r.send(JSON.stringify(objOut));
		}
		json.connect = function(opts) {
			for(k in opts) 
				j[k] = opts[k]
		}
		jsond = j
	})()

}
catch(e) {

	// ==================================================
	// server code
	// ==================================================

	var fail = function(res, err) {
		var msg = o2j({error:err.message})
		res.writeHead(500, {
			"Content-Type": "text/plain",
			"Content-Length": msg.length,
		})
		res.end(msg)
	}

	exports.createServer = function(msgHandler) {

		return require("http").createServer(function(req, res) {
			var jsonIn = ""
			req.setEncoding("utf8")
			if(req.method != "POST") {
				fail(res, new Error("BAD METHOD: "+req.method))
			}
			else { 
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
		})
	}

}


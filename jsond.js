
var msgd = require("msgd")

var o2j = function(o) { return JSON.stringify(o) }
var j2o = function(j) { return JSON.parse(j) }

exports.createServer = function(msgHandler) {

	return msgd.createServer(function(jsonIn, cb) {
		try {
			var objIn = j2o(jsonIn)
			msgHandler(objIn, function(objOut) {
				cb(o2j(objOut))
			})
		}
		catch(e) {
			cb(o2j({error:e.message}))
		}
	})

/*
	return http.createServer(function(req, res) {
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
					var msgIn = JSON.parse(jsonIn)
					msgHandler(msgIn, function(msgOut) {
						var jsonOut = JSON.stringify(msgOut)
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
*/
}



var http = require("http")

var fail = function(res, err) {
	var jsonOut = JSON.stringify({error:err.message+"\n"})
	res.writeHead(500, {
		"Content-Type": "text/plain",
		"Content-Length": jsonOut.length,
	})
	res.end(jsonOut)
}

exports.createServer = function(msgHandler) {

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
}


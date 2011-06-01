
var msgd = require("node-msgd")

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

}



var jsond = require("./jsond")

var log = console.log

function msgHandler(msg, cb) {
	log("incoming msg: "+JSON.stringify(msg));
	msg = {r:"You said: "+msg.m}
	log("sending response: "+JSON.stringify(msg));
	cb(msg)
}

jsond.createServer(msgHandler).listen(30304)

log("listening");


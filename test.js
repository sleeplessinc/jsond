
var jsond = require("./jsond.js"),
	l = console.log

function msgHandler(tx, msg, cb) {
	l("incoming msg: "+JSON.stringify(msg));
	msg = {r:"You said: "+msg.m}
	l("sending response: "+JSON.stringify(msg));
	cb(msg)
}

jsond.createServer(msgHandler).listen(50505)

l("listening");


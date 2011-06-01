
var jsond = require("./jsond")

function msgHandler(msg, cb) {
	cb({r:msg.m});
}

jsond.createServer(msgHandler).listen(3333)


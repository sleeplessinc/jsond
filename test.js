
var jsond = require("./jsond")

function msgHandler(msg, cb) {
	console.log("incoming msg="+JSON.stringify(msg));
	cb({r:"You said: "+msg.m});
}

jsond.createServer(msgHandler).listen(30304)

console.log("listening");


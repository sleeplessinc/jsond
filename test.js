
var jsond = require("./jsond")

function msgHandler(msg, cb) {
	console.log("msg="+JSON.stringify(msg));
	cb({r:msg.m+" ..."});
}

jsond.createServer(msgHandler).listen(3333)

console.log("listening");


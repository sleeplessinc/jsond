
# node-jsond

Implements a simple server for sending and receiving JSON messages over HTTP.


## Example Use Case

An example use case would be a web page using AJAX calls to send msgs to a
server using a custom protocol.

### Starting a msg handling server 

	var jsond = require("./jsond")

	function msgHandler(msg, cb) {
		console.log("msg="+JSON.stringify(msg));
		cb({r:msg.m+" ..."});
	}

	jsond.createServer(msgHandler).listen(3333)

	console.log("listening");


### Sending msgs to the server from the browser

	<html>
	<body>
	<h1>node-jsond test page</h1>

	Send: <input onchange="changed(this.value)"><p>
	Rcvd: <textarea id=rcvd></textarea><p>

	<script src=jsonc.js></script>

	<script>
		
		var rcvd = document.getElementById("rcvd")

		function changed(v) {
			var msg = {m:v}
			jsond.send(msg, function(response) {
				rcvd.value = "Response: "+o2j(response);
			})
		}

	</script>





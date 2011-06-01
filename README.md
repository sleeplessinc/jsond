
# node-jsond

Implements a simple server for sending and receiving JSON messages over HTTP.


## Example Use Case

An example use case would be a web page using AJAX calls to send msgs to a
server using a custom protocol.
This is demonstrated below.

###Server code:

	var jsond = require("./jsond")

	function msgHandler(msg, cb) {
		cb({r:msg.m});
	}

	jsond.createServer(msgHandler).listen(3333)


###HTML page:

	<html>
	<body>

	Send: <input onchange="changed(this.value)"><p>
	Received: <textarea id=rcvd></textarea><p>

	<script>

		function changed(v) {
			var r = new XMLHttpRequest();
			r.open("POST", "http://127.0.0.1:3333/", true);
			r.onreadystatechange = function() {
				if(r.readyState == 4) {
					document.getElementById("rcvd").value = JSON.parse(r.responseText).r
					r.onreadystatechange = function() {}
				}
			}
			r.send(JSON.stringify({m:v}));
		}

	</script>


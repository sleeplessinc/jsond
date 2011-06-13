
# jsond

Implements a simple server for sending and receiving JSON messages over HTTP.


In the browser page:

	<input onchange="send(this.value)">
	<script>
		function send(val) {
			var msgOut = {m:val}
			alert("sending to server: "+msgOut.val)
			jsond.send(msgOut, function(msgIn) {
				alert("received from server: "+msgIn.r)
			})
		}
		$(document).ready(function docReady() {
			var d = document, e = d.createElement('script')
			e.async = false
			e.src = "http://localhost:50505/api/"
			e.onload = function() {
				alert("jsond is loaded and ready to use")
			}
			d.body.appendChild(e)
		})
	</script>


Your server code:

	var jsond = require("./jsond.js")

	jsond.createServer(function(tx, msg, cb) {
		msg = {r:"You said: "+msg.m}
		cb(msg)
	}).listen(50505)




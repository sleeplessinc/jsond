
# jsond

Implements a simple server for sending and receiving JSON messages over HTTP.

## Example

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

	jsond.createServer(function(msg, cb) {
		msg = {r:"You said: "+msg.m}
		cb(msg)
	}).listen(50505)


## Notes

Any request coming into the server for a path that starts with "/api" is treated as 
a message passing request.  A parameter named "j" is expected and must contain a JSON
object. 

Something like:

	GET /api?j={"foo":"bar"} 

Noting of course that the actual JSON text must be URI encoded.

When this object is received and parsed, it is passed to the callback passed into
createServer().  That callback receives it's own callback which should be used to
send a message back to the client.

Any requests for paths that do not beging with "/api" are process as static file 
requests and are handled by the node module "paperboy".




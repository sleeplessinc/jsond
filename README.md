
# node-jsond

Implements a simple server for sending and receiving JSON messages over HTTP.

## Dependencies

Requires `git@github.com:sleeplessinc/node-msgd`


## Example Use Case

An example use case would be a web page using AJAX calls to send msgs to a
server using a custom protocol.

See `test.js` and `test.html`


## Notes

The server only accepts POST method transactions.
All other methods result in an HTTP 500 response.
HTTP is used merely to provide a transport for the custom message protocol.
Therefore, there is no need to support, or utilize any of the features of HTTP
beyond just what is needed to move the messages back and forth.



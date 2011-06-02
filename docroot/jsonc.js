
/*
Copyright 2011 Sleepless Software Inc. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to
deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
sell copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE. 

*/

// ==================================================
// client (browser) code
// ==================================================

(function() {
	var doc = document,
		loc = doc.location,
		j = {}
	j.nop = function(){}
	j.proto = loc.protocol
	j.host = loc.hostname
	j.port = 30303
	j.send = function(objOut, cb) {
		var cb = cb || nop,
			url = j.proto+"//"+j.host+":"+j.port+"/"
			r = new XMLHttpRequest()
		r.open("POST", url, true);
		r.onreadystatechange = function() {
			var json = r.responseText
			if(r.readyState != 4)
				return
			if(json)
				try {
					cb(JSON.parse(json))
				}
				catch(e) {
					cb({error:e.message})
				}
			else
				cb({error:"no response"})
			r.onreadystatechange = nop
		}
		r.send(JSON.stringify(objOut));
	}
	j.opts = function(opts) {
		for(k in opts) 
			j[k] = opts[k]
	}
	jsond = j
})()



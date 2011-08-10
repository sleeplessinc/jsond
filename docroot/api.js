
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

(function() {

	var j = {},
		nop = function() {},
	
	j.j2o = function(j) { try { return JSON.parse(j) } catch(e) { return null } }
	j.o2j = function(o) { return JSON.stringify(o) }

	j.seq = 1;
	j.root = document.getElementById("jsond").src	// where this script was loaded from
	j.cross = /^http/.test(j.root.toLowerCase())	// cross domain?	// xxx make smarter

	j.root += /\/$/.test(j.root) ? "" : "/"			// ensure it ends with a slash

	j.send = function(objOut, cb) {
		var cb = cb || nop,
			loc = document.location,
			url = j.root,
			r = new XMLHttpRequest()

		objOut.seq = j.seq++;
		url = j.root+"?j="+encodeURIComponent(JSON.stringify(objOut))

		r.open("GET", url, true);
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
		r.send()
	}

	jsond = j

})()


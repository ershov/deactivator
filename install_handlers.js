"use strict";

//console.log("before any HTML is loaded...");
//console.log("document", document);
//console.log("body", document.body);

function EventHandler(e) {
	"use strict";
	if (document && document.body && document.body.getAttribute && document.body.getAttribute("deactivated")) {
		e.stopPropagation();
	}
}

function InstallHandlers() {
	"use strict";
	var a, m;
	for (a in document) {
		if (m = a.match(/^on(.*)$/)) {
			document.addEventListener(m[1], EventHandler, true);
			document.addEventListener(m[1], EventHandler, false);
		}
	}
}

InstallHandlers();


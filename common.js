"use strict";

function NodePath(n) {
	"use strict";
	return n ?
		NodePath(n.parentNode) + "/" + n.nodeName + (
			n.parentNode ?
			"(" + Array.prototype.indexOf.call(n.parentNode.childNodes, n) + ")" :
			"") :
		"";
}

function TraverseDom(element, callback) {
	"use strict";
	var stack = [element]; //Array.from(element.childNodes);
	while (stack.length > 0) {
		var node = stack.shift();
		if (callback(node)) {
			node.childNodes.forEach((node,i) => {
				stack.push(node);
			});
		} else {
			if (node.parentNode) node.parentNode.removeChild(node);
		}
	}
}

function RemoveListeners(node) {
	"use strict";
	var l = getEventListeners(node);
	var a;
	for (a in l) {
		Array.from(l[a]).forEach(aa=>{
			console.log(NodePath(node), a, aa);
			aa.remove();
		});
	}
}

function ClearAllTimeouts() {
	"use strict";
	var limit = setTimeout(";", 999999);
	var i;
	for (i = 0; i <= limit; i++) {
		clearTimeout(i);
		clearInterval(i);
	}
}

function Deactivate() {
	"use strict";
	ClearAllTimeouts();
	document.body.setAttribute("deactivated", "1");
	TraverseDom(document, (e) => {
		if (e.nodeName.match(/SCRIPT|OBJECT|EMBED|IFRAME/i)) return false;
		//RemoveListeners(e);
		var n;
		for (n in e) {
			if (n.match(/^on/)) {
				if (e.getAttribute) {
					if (e.getAttribute(n)) console.log(NodePath(e), n, e.getAttribute(n));
					e.removeAttribute(n);
				} else {
					if (e[n]) console.log(NodePath(e), n, e[n]);
					e[n] = "";
					delete e[n];
				}
			}
		}
		return true;
	});
	Array.from(document.childNodes).forEach(n => {
		document.replaceChild(n.cloneNode(true), n);
	});
}

function ShowBadge() {
	"use strict";
	if (!document.getElementById("page_inactive_reminder")) {
		document.body.insertAdjacentHTML("beforeend",
"<div id=page_inactive_reminder style='font-size:8px;text-align:center;position:fixed;z-index:1999999999;top:0;width:100%'>(Page is inactive)</div>");
	}
	document.body.insertAdjacentHTML("beforeend",
"<div id=deactivate_badge style='position:fixed;z-index:1999999999;top:50px;width:100%'><center><mark style='padding:20px'>Page DEACTIVATED</mark></center></div>");
	setTimeout("(e=>e.parentNode.removeChild(e))(document.getElementById('deactivate_badge'))", 1500);
}

function BundleScript() {
	return escape(
		[NodePath, TraverseDom, RemoveListeners, ClearAllTimeouts, Deactivate, ShowBadge].
			map(f=>f.toString()).
			join("\n"))+
			"%0ADeactivate();"+
			"%0AShowBadge();"+
			"";
}

//Deactivate();

function AddButton() {
	"use strict";
	document.body.insertAdjacentHTML("beforeend",
"<input type=button value=Deactivate id=deactivate style='position:fixed;z-index:1999999999;top:0' onclick='this.parentNode.removeChild(this);setTimeout(unescape(\""+
BundleScript()+
"\"),50)' />");
}

//setTimeout(AddButton, 1000);	// give it a while for the page to load everything


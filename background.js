"use strict";

chrome.browserAction.onClicked.addListener(function(tab) {
   chrome.tabs.executeScript(null, {code: "setTimeout('eval(unescape(\""+BundleScript()+"\"))',50);"});
});


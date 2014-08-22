// ==UserScript==
// @name            noshowborder.uc.js
// @description     无边框
// @charset			UTF-8
// @include         chrome://browser/content/browser.xul
// @id 				[8DB2CA3E]
// @startup         window.chromemargin.init();
// @shutdown        window.chromemargin.onDestroy();
// @homepageURL   	https://github.com/feiruo/userchromejs/
// @version         1.2.2
// ==/UserScript==
(function() {
	var gav = Services.wm.getEnumerator("navigator:browser");
	var inIDOMUtils = Cc["@mozilla.org/inspector/dom-utils;1"].getService(Ci.inIDOMUtils);
	while (gav.hasMoreElements()) {
		if (gav.getNext().chromemargin && !document.documentElement.outerHTML.match('chromehidden=""')) return;
	}

	if (window.chromemargin) {
		window.chromemargin.onDestroy();
		delete window.chromemargin;
	}

	window.chromemargin = {
		init: function() {
			window.addEventListener("resize", this, true);
			window.addEventListener("aftercustomization", this, false);
			window.addEventListener("customizationchange", this, false);
			document.documentElement.setAttribute("chromemargin", "0,7,7,7");
		},
		onDestroy: function() {
			window.removeEventListener("resize", this, true);
			window.removeEventListener("aftercustomization", this, false);
			window.removeEventListener("customizationchange", this, false);
			document.documentElement.setAttribute("chromemargin", "0,2,2,2");
		},
		handleEvent: function(evnet) {
			document.documentElement.setAttribute("chromemargin", "0,7,7,7");
		}
	};
	window.chromemargin.init();
})();
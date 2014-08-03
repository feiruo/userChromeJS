// ==UserScript==
// @name            noshowborder.uc.js
// @description     无边框
// @compatibility	Firefox 8.0
// @charset			UTF-8
// @include         chrome://browser/content/browser.xul
// @id 				[8DB2CA3E]
// @startup         window.chromemargin.init();
// @shutdown        window.chromemargin.onDestroy();
// @version         1.2.1
// ==/UserScript==
(function() {
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
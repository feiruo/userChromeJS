// ==UserScript==
// @name            noshowborder.uc.js
// @description     无边框
// @charset			UTF-8
// @include         chrome://browser/content/browser.xul
// @id 				[8DB2CA3E]
// @startup         window.chromemargin.init();
// @shutdown        window.chromemargin.onDestroy();
// @homepageURL   	https://github.com/feiruo/userchromejs/
// @version         1.2.3 	2015.02.18 22:00	设延迟0.1S，避免初次启动白边.
// @version         1.2.2
// ==/UserScript==
(function() {
	var gav = Services.wm.getEnumerator("navigator:browser");
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
			setTimeout(function() {
				document.documentElement.setAttribute("chromemargin", "0,7,7,7");
			}, 100);
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
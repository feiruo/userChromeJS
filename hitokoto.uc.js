// ==UserScript==
// @name            hitokoto.uc.js
// @namespace         https://github.com/feiruo/userchromejs/blob/master/hitokoto.uc.js
// @description     获取hitokoto一句话
// @note            鼠标移到地址栏显示图标，移开显示文字，左键点击图标复制内容
// @author          feiruo
// @charset      utf-8
// @include         chrome://browser/content/browser.xul
// @version         0.1
// ==/UserScript==
(function () {
location == "chrome://browser/content/browser.xul" && gBrowser.addEventListener("DOMWindowCreated", function (event) {
	var self = arguments.callee;
	if (!self.hitokoto) {
	window.addEventListener("TabSelect", self, false);
		self.hitokotos = document.querySelector("#urlbar-icons").appendChild(document.createElement("statusbarpanel"));
		self.hitokotos.id = "hitokoto-statusbarpanel";
		self.hitokotos.style.color = 'brown';
		self.hitokotos.style.margin = "0 0 -1px 0";
		self.hitokoto = document.querySelector("#urlbar-icons").appendChild(document.createElement("image"));
		self.hitokoto.id = "hitokoto-icon";
		self.hitokoto.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADbklEQVQ4jTWKW0ybZQBA/8Rnn40PvhgfNIsajTHenozTZMZb9MlF4+XBYGam28wWXBySMfkCImxcZMKADGqhgVK0XAstLRRKaQcUKLRQWqAttD8t/bmW9uP44DzJeTpHOcjnz0kphZRSNLjj4rW7S+JsQ0C8fHNE6G0zQspjkZNSZB8+UuZE7jAlpNwXUkqhqMf5ah5SNx7jzC037xmSvNUa5+2GAN0Pov9n8kA6k2IptkWTN40jAUpS00Q+f4Q8PeHusJ9HP2vmyctdvFlu5ePGWT6snaS0x8P1xkGe+Lwa04iN33pcvFgX5JnyWZRtTRNoEdDW+aXdyRtXdDRMbGCJZLGu57BuSIyBY+pdO1ztmOXBtJ22PgvPFVl4vzOFEt8/FKe7a2zNOen1q4wnwZUE2+Z/WiJ5rFFwxU9Y3NplL70Ch8tcqrzPmbI5FFVdEcdLI0z7Anh2wbUNjugptk1Jf+gEvW+XuskYo5FDdnbWOEj6ON3zc6P8T54vNKNoc2aRXnCwmJEs7Erc21kGw3s4onk65lUM8yrf66dp9u4yE02T14LAJj+3/MPTP5pRVLtepNNx1rIwqx5gj+1hCKiMRY+od4Xp8ie5ZJiiqHcRdyLHxPIqairM/lGCL6rMKAGHWfi1fTypHMPrGRrdMX4fC9Mb0Ljc5qKkd4mS1iEK6ocxL2cwrRxT2jUOchvIonhGTGIgnKHFl6TSuU5xl5syk5vW6TiFTUOUdE1hMhr5qeIe3VMhrFtQcN/LnR4HAMpMf7todYW52DXPN21efm3txzAwStVQAKPDzfWKJi58fZHHHn8dUdPGSALEUIiXrnWyEIujRGx6oR+Y5FyFjfOVgzgmxkmpIVrtPjZjAabdDj658RdPnb/NHx1DGINZKkbWeOFaN6X9ARTNrhOhlQAfVFh495aZ7uYavFYDCXUNUIE9+kedjI/b+XvKT+1kku90Hp69YuCCbg4ladMJkNwZnOfVIjPN99rIL9g4TQfQNnyo3lEIumDVSV2vhx+My7xzs4dhX5iKXh+K9JhEd0cfHxV38q3eR0F1Pwn/FGhBovoW9i095OPzRPyTfFkzyFe1Y1gmggD0eUIoxaU68cgrVzlb2M5ta4Qm4yxVOhvmqWmWPGNoc3aOVu14B9r5tKyHPucKZHPAKZmDE/4FfP05vqO/HLUAAAAASUVORK5CYII=";
		self.hitokoto.style.padding="0px 2px";
		self.isReqHash = [];
		self.hitokotoHash = [];
		var cssStr = ('\
#hitokoto-statusbarpanel,#hitokoto-icon{-moz-box-ordinal-group: 0 !important;}\
#urlbar:hover #hitokoto-statusbarpanel,#hitokoto-icon{visibility: collapse !important;}\
#urlbar:hover #hitokoto-icon,#hitokoto-statusbarpanel{visibility: visible !important;}\
#hitokoto-statusbarpanel{-moz-appearance: none !important;padding: 0px 0px 0px 0px !important;border: none !important;border-top: none !important;border-bottom: none !important;}\
');
		var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
document.insertBefore(style, document.documentElement);
self.hitokoto.addEventListener("click", function () {Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString(self.hitokoto.tooltipText);}, false);
	}
	try {
		var host = content.document.location;
    if (!self.hitokotoHash[host]) {
					self.isReqHash[host] = true;
					var req = new XMLHttpRequest();
					req.open("GET", 'http://api.hitokoto.us/rand', true);
					req.send(null);
					req.onload = function () {
						if (req.status == 200) {
						var responseObj = JSON.parse(req.responseText);
						if(responseObj.source==""){
						self.hitokotoHash[host] =responseObj.hitokoto;
						}else{
							self.hitokotoHash[host] =responseObj.hitokoto +'--《'+responseObj.source+'》';
							}
							self.hitokotos.label = self.hitokoto.tooltipText = self.hitokotoHash[host];
						}
						self.isReqHash[host] = false;
					}
				} else {
					self.hitokotos.label = self.hitokoto.tooltipText = self.hitokotoHash[host];
				}

	} catch (e) {
		(event.type == "TabSelect" || event.originalTarget == content.document) && (self.hitokotos.label = self.hitokoto.tooltipText = "hitokoto");
	}
}, false)
})();
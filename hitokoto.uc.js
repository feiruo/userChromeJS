// ==UserScript==
// @name            hitokoto.uc.js
// @description     hitokoto一句话
// @namespace         https://github.com/feiruo/userchromejs/
// @author          feiruo
// @include         chrome://browser/content/browser.xul
// @charset      utf-8
// @version         1.2
// @note            获取hitokoto一句话，左键点击图标复制内容
// @note            1.2 解决dead object 问题
// @note            1.1 解决页面内框架请求也会跟着请求的问题（一个页面内数次请求的问题）
// @note            1.0
// ==/UserScript==
(function() {
	var tip = 0; //0鼠标移到地址栏显示图标，移开显示文字;1弹出hitokoto一句话，
	location == "chrome://browser/content/browser.xul" && gBrowser.addEventListener("DOMWindowCreated", function(event) {
		var self = arguments.callee;
		if (!self.hitokoto) {
			window.addEventListener("TabSelect", self, false);
			if (tip == 0) {
				self.hitokotos = document.querySelector("#urlbar-icons").appendChild(document.createElement("statusbarpanel"));
				self.hitokotos.id = "hitokoto-statusbarpanel";
				self.hitokotos.style.color = 'brown';
				self.hitokotos.style.margin = "0 0 -1px 0";
				var cssStr = ('\
#hitokoto-statusbarpanel,#hitokoto-icon{-moz-box-ordinal-group: 0 !important;}\
#urlbar:hover #hitokoto-statusbarpanel,#hitokoto-icon{visibility: collapse !important;}\
#urlbar:hover #hitokoto-icon,#hitokoto-statusbarpanel{visibility: visible !important;}\
#hitokoto-statusbarpanel{-moz-appearance: none !important;padding: 0px 0px 0px 0px !important;border: none !important;border-top: none !important;border-bottom: none !important;}\
');
				var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
				document.insertBefore(style, document.documentElement);
			}
			self.hitokoto = document.querySelector("#urlbar-icons").appendChild(document.createElement("image"));
			self.hitokoto.id = "hitokoto-icon";
			self.hitokoto.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADbklEQVQ4jTWKW0ybZQBA/8Rnn40PvhgfNIsajTHenozTZMZb9MlF4+XBYGam28wWXBySMfkCImxcZMKADGqhgVK0XAstLRRKaQcUKLRQWqAttD8t/bmW9uP44DzJeTpHOcjnz0kphZRSNLjj4rW7S+JsQ0C8fHNE6G0zQspjkZNSZB8+UuZE7jAlpNwXUkqhqMf5ah5SNx7jzC037xmSvNUa5+2GAN0Pov9n8kA6k2IptkWTN40jAUpS00Q+f4Q8PeHusJ9HP2vmyctdvFlu5ePGWT6snaS0x8P1xkGe+Lwa04iN33pcvFgX5JnyWZRtTRNoEdDW+aXdyRtXdDRMbGCJZLGu57BuSIyBY+pdO1ztmOXBtJ22PgvPFVl4vzOFEt8/FKe7a2zNOen1q4wnwZUE2+Z/WiJ5rFFwxU9Y3NplL70Ch8tcqrzPmbI5FFVdEcdLI0z7Anh2wbUNjugptk1Jf+gEvW+XuskYo5FDdnbWOEj6ON3zc6P8T54vNKNoc2aRXnCwmJEs7Erc21kGw3s4onk65lUM8yrf66dp9u4yE02T14LAJj+3/MPTP5pRVLtepNNx1rIwqx5gj+1hCKiMRY+od4Xp8ie5ZJiiqHcRdyLHxPIqairM/lGCL6rMKAGHWfi1fTypHMPrGRrdMX4fC9Mb0Ljc5qKkd4mS1iEK6ocxL2cwrRxT2jUOchvIonhGTGIgnKHFl6TSuU5xl5syk5vW6TiFTUOUdE1hMhr5qeIe3VMhrFtQcN/LnR4HAMpMf7todYW52DXPN21efm3txzAwStVQAKPDzfWKJi58fZHHHn8dUdPGSALEUIiXrnWyEIujRGx6oR+Y5FyFjfOVgzgmxkmpIVrtPjZjAabdDj658RdPnb/NHx1DGINZKkbWeOFaN6X9ARTNrhOhlQAfVFh495aZ7uYavFYDCXUNUIE9+kedjI/b+XvKT+1kku90Hp69YuCCbg4ladMJkNwZnOfVIjPN99rIL9g4TQfQNnyo3lEIumDVSV2vhx+My7xzs4dhX5iKXh+K9JhEd0cfHxV38q3eR0F1Pwn/FGhBovoW9i095OPzRPyTfFkzyFe1Y1gmggD0eUIoxaU68cgrVzlb2M5ta4Qm4yxVOhvmqWmWPGNoc3aOVu14B9r5tKyHPucKZHPAKZmDE/4FfP05vqO/HLUAAAAASUVORK5CYII=";
			self.hitokoto.style.padding = "0px 2px";
			self.isReqHash = [];
			self.hitokotoHash = [];
			self.hitokoto.addEventListener("click", function() {
				Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString(self.hitokoto.tooltipText);
			}, false);
			if (tip == 1) {
				var xmltt = '\
        <tooltip id="hitokototip" style="opacity: 0.8 ;color: brown ;text-shadow:0 0 3px #CCC ;background: rgba(255,255,255,0.6) ;padding-bottom:3px ;border:1px solid #BBB ;border-radius: 3px ;box-shadow:0 0 3px #444 ;">\
        <label id="hitokotoPopupLabel" flex="1" />\
    		</tooltip>\
    	';
				var rangett = document.createRange();
				rangett.selectNodeContents(document.getElementById('mainPopupSet'));
				rangett.collapse(false);
				rangett.insertNode(rangett.createContextualFragment(xmltt.replace(/\n|\r/g, '')));
				rangett.detach();
			}
		}
		try {
			var host = (event.originalTarget.location || content.location).href;
			if (event.type == "DOMWindowCreated") {
				var doc = event.originalTarget,
					win = doc.defaultView;
				if (doc.body instanceof HTMLFrameSetElement || win.frameElement) return;
			}
			if (!self.hitokotoHash[host]) {
				self.isReqHash[host] = true;
				var req = new XMLHttpRequest();
				req.open("GET", 'http://api.hitokoto.us/rand', true);
				req.send(null);
				req.onload = function() {
					if (req.status == 200) {
						var responseObj = JSON.parse(req.responseText);
						if (responseObj.source == "") {
							self.hitokotoHash[host] = responseObj.hitokoto;
						} else {
							if (responseObj.source.match("《")) {
								self.hitokotoHash[host] = responseObj.hitokoto + '--' + responseObj.source;
							} else {
								self.hitokotoHash[host] = responseObj.hitokoto + '--《' + responseObj.source + '》';
							}
						}
						if (tip == 0) {
							self.hitokotos.label = self.hitokoto.tooltipText = self.hitokotoHash[host];
						} else {
							self.hitokoto.tooltipText = self.hitokotoHash[host];
							show(self.hitokotoHash[host]);
						}
					}
					self.isReqHash[host] = false;
				}
			} else {
				if (tip == 0) {
					self.hitokotos.label = self.hitokoto.tooltipText = self.hitokotoHash[host];
				} else {
					self.hitokoto.tooltipText = self.hitokotoHash[host];
					show(self.hitokotoHash[host]);
				}
			}
		} catch (e) {
			if (tip == 0) {
				(event.type == "TabSelect" || event.originalTarget == content.document) && (self.hitokotos.label = self.hitokoto.tooltipText = "hitokoto");
			} else {
				(event.type == "TabSelect" || event.originalTarget == content.document) && (self.hitokoto.tooltipText = "hitokoto");
			}
		}
		if (tip == 1) {
			function show(res) {
				var popup = document.getElementById("hitokototip");
				setValue(res);
				if (self.timer) clearTimeout(self.timer);

				if (typeof popup.openPopup != 'undefined') popup.openPopup(self.hitokoto, "overlap", 0, 0, true, false);
				else popup.showPopup(self.hitokoto, -1, -1, "popup", null, null);
				self.timer = setTimeout(function() {
					popup.hidePopup();
				}, 5000); //
			}

			function setValue(val) {
				var label = document.getElementById("hitokotoPopupLabel");
				while (label.firstChild) {
					label.removeChild(label.firstChild);
				}
				if (val != "") label.appendChild(document.createTextNode(val));
			}
		}
	}, false)
})();
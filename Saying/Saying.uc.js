// ==UserScript==
// @name            Saying.uc.js
// @description     自定义语句。
// @namespace       https://github.com/feiruo/userchromejs/
// @author          feiruo
// @include         chrome://browser/content/browser.xul
// @charset      	utf-8
// @version         1.1
// @note            地址栏显示自定义语句，根据网址切换。
// @note            目前可自动获取的有VeryCD标题上的，和hitokoto API。
// @note            每次关闭浏览器后数据库添加获取过的内容，并去重复。
// @note            左键图标复制内容，中键重新获取，右键弹出菜单。
// @note            1.1 增加地址栏文字长度设置，避免撑长地址栏。
// ==/UserScript==
location == "chrome://browser/content/browser.xul" && (function() {

	//VeryCD(名言名句)或hitokoto。
	sayingType = 'veryCD',

	//0为地址栏文字显示，1为自动弹出
	autotip = 0,

	//如果是地址栏文字，文字长度（个数，包括标点符号），留空或0则全部显示
	SayingLong = 0,

	//autotip=1时有效，设置自动弹出时，多少秒后关闭弹窗
	autotiptime = 5000,

	//是否混合随机显示
	random = true,

	//数据库文件位置
	saying_Path = 'lib\\saying.json', //此数据库为自定义数据库，不更新只读取。
	hitokoto_Path = 'lib\\hitokoto.json',
	veryCD_Path = 'lib\\veryCD.json',

	//毫秒， 延迟时间，时间内未取得hitokoto在线数据，则使用本地数据库
	Local_Delay = 2500,

	saying_lib = false,
	saying_json = [],
	hitokoto_lib = false,
	hitokoto_json = [],
	veryCD_lib = false,
	veryCD_json = [];

	window.saying = {
		isReqHash: [],
		sayingHash: [],

		init: function() {
			var self = this;

			this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("userChromeJS.saying.");
			this._prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

			if (!this._prefs.prefHasUserValue("type")) {
				this._prefs.setCharPref("type", sayingType);
			} else {
				sayingType = this._prefs.getCharPref("type");
			}

			if (!this._prefs.prefHasUserValue("random")) {
				this._prefs.setIntPref("random", random);
			} else {
				random = this._prefs.getIntPref("random");
			}

			saying_lib = this.loadFile(saying_Path);
			hitokoto_lib = this.loadFile(hitokoto_Path);
			veryCD_lib = this.loadFile(veryCD_Path);

			if (saying_lib) saying_json = JSON.parse(saying_lib);
			if (hitokoto_lib) hitokoto_json = JSON.parse(hitokoto_lib);
			if (veryCD_lib) veryCD_json = JSON.parse(veryCD_lib);

			if (autotip == 0)
				this.addlabel();

			this.addIcon();
			this.getVeryCD();
			this.onLocationChange();
			this.progressListener = {
				onLocationChange: function() {
					self.onLocationChange();
				},
				onProgressChange: function() {},
				onSecurityChange: function() {},
				onStateChange: function() {},
				onStatusChange: function() {}
			};
			window.getBrowser().addProgressListener(this.progressListener);

			window.addEventListener("unload", function() {
				saying.finsh('all');
				saying.onDestroy();
			}, false);
		},

		onDestroy: function() {
			window.getBrowser().removeProgressListener(this.progressListener);
		},

		addIcon: function() {
			this.icon = $('urlbar-icons').appendChild($C('image', {
				id: 'saying-icon',
				context: 'saying-popup',
				src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADbklEQVQ4jTWKW0ybZQBA/8Rnn40PvhgfNIsajTHenozTZMZb9MlF4+XBYGam28wWXBySMfkCImxcZMKADGqhgVK0XAstLRRKaQcUKLRQWqAttD8t/bmW9uP44DzJeTpHOcjnz0kphZRSNLjj4rW7S+JsQ0C8fHNE6G0zQspjkZNSZB8+UuZE7jAlpNwXUkqhqMf5ah5SNx7jzC037xmSvNUa5+2GAN0Pov9n8kA6k2IptkWTN40jAUpS00Q+f4Q8PeHusJ9HP2vmyctdvFlu5ePGWT6snaS0x8P1xkGe+Lwa04iN33pcvFgX5JnyWZRtTRNoEdDW+aXdyRtXdDRMbGCJZLGu57BuSIyBY+pdO1ztmOXBtJ22PgvPFVl4vzOFEt8/FKe7a2zNOen1q4wnwZUE2+Z/WiJ5rFFwxU9Y3NplL70Ch8tcqrzPmbI5FFVdEcdLI0z7Anh2wbUNjugptk1Jf+gEvW+XuskYo5FDdnbWOEj6ON3zc6P8T54vNKNoc2aRXnCwmJEs7Erc21kGw3s4onk65lUM8yrf66dp9u4yE02T14LAJj+3/MPTP5pRVLtepNNx1rIwqx5gj+1hCKiMRY+od4Xp8ie5ZJiiqHcRdyLHxPIqairM/lGCL6rMKAGHWfi1fTypHMPrGRrdMX4fC9Mb0Ljc5qKkd4mS1iEK6ocxL2cwrRxT2jUOchvIonhGTGIgnKHFl6TSuU5xl5syk5vW6TiFTUOUdE1hMhr5qeIe3VMhrFtQcN/LnR4HAMpMf7todYW52DXPN21efm3txzAwStVQAKPDzfWKJi58fZHHHn8dUdPGSALEUIiXrnWyEIujRGx6oR+Y5FyFjfOVgzgmxkmpIVrtPjZjAabdDj658RdPnb/NHx1DGINZKkbWeOFaN6X9ARTNrhOhlQAfVFh495aZ7uYavFYDCXUNUIE9+kedjI/b+XvKT+1kku90Hp69YuCCbg4ladMJkNwZnOfVIjPN99rIL9g4TQfQNnyo3lEIumDVSV2vhx+My7xzs4dhX5iKXh+K9JhEd0cfHxV38q3eR0F1Pwn/FGhBovoW9i095OPzRPyTfFkzyFe1Y1gmggD0eUIoxaU68cgrVzlb2M5ta4Qm4yxVOhvmqWmWPGNoc3aOVu14B9r5tKyHPucKZHPAKZmDE/4FfP05vqO/HLUAAAAASUVORK5CYII=',
				tooltip: 'sayingtip',
				style: 'padding: 0px 2px'
			}));

			this.icon.addEventListener("click", function(event) {
				if (event.button == 0) {
					Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString($("sayingPopupLabel").textContent);
				} else if (event.button == 1) {
					saying.onLocationChange(true);
				}
			}, false);

			var popup = $C('menupopup', {
				id: 'saying-popup',
				position: 'at_pointer'
			});

			popup.appendChild($C('menuitem', {
				label: "复制内容",
				oncommand: "saying.copy();"
			}));

			popup.appendChild($C('menuitem', {
				label: "重新获取",
				oncommand: "saying.onLocationChange(true);"
			}));

			popup.appendChild($C('menuitem', {
				label: "去重保存",
				oncommand: "saying.finsh('all');"
			}));

			popup.appendChild($C('menuseparator'));

			popup.appendChild($C('menuitem', {
				label: "hitokoto",
				id: "sayinghitokoto",
				type: "radio",
				oncommand: 'saying.lookup("set","hitokoto");'
			}));

			popup.appendChild($C('menuitem', {
				label: "名言名句",
				id: "sayingVeryCD",
				type: "radio",
				oncommand: 'saying.lookup("set","veryCD");'
			}));

			popup.appendChild($C('menuitem', {
				label: "手动设定",
				id: "sayingSaying",
				type: "radio",
				oncommand: 'saying.lookup("set","saying");'
			}));

			popup.appendChild($C('menuseparator'));

			popup.appendChild($C('menuitem', {
				label: "混合随机",
				id: "sayingRandom",
				type: "checkbox",
				oncommand: 'saying.random();'
			}));

			$('mainPopupSet').appendChild(popup);
			if (sayingType == "veryCD")
				$("sayingVeryCD").setAttribute('checked', true);
			else if (sayingType == "hitokoto")
				$("sayinghitokoto").setAttribute('checked', true);
			else if (sayingType == "saying")
				$("sayingSaying").setAttribute('checked', true);

			if (random)
				$("sayingRandom").setAttribute('checked', (($("sayingRandom").value != random) ? true : false));
			else
				$("sayingRandom").setAttribute('checked', (($("sayingRandom").value != random) ? false : true));

			var xmltt = '\
        	<tooltip id="sayingtip" style="opacity: 0.8 ;color: brown ;text-shadow:0 0 3px #CCC ;background: rgba(255,255,255,0.6) ;padding-bottom:3px ;border:1px solid #BBB ;border-radius: 3px ;box-shadow:0 0 3px #444 ;">\
        	<label id="sayingPopupLabel" flex="1" />\
    		</tooltip>\
    		';

			var rangett = document.createRange();
			rangett.selectNodeContents($('mainPopupSet'));
			rangett.collapse(false);
			rangett.insertNode(rangett.createContextualFragment(xmltt.replace(/\n|\r/g, '')));
			rangett.detach();

			this.sayingtip = $("sayingPopupLabel");
			this.sayingtip.addEventListener("click", function(e) {
				if (e.button == 0) {
					$("sayingtip").hidePopup();
				} else if (e.button == 2) {
					Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString($("sayingPopupLabel").textContent);
					$("sayingtip").hidePopup();
				}
			}, false);
		},

		copy: function() {
			Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper)
				.copyString($("sayingPopupLabel").textContent);
		},

		random: function() {
			if (random)
				random = false;
			else
				random = true;
			this._prefs.setIntPref("random", random);
		},

		addlabel: function() {
			this.sayings = $('urlbar-icons').appendChild($C('statusbarpanel', {
				id: 'saying-statusbarpanel',
				style: 'color: brown; margin: 0 0 -1px 0'
			}));
			var cssStr = ('\
			#saying-statusbarpanel,#saying-icon{-moz-box-ordinal-group: 0 !important;}\
			#urlbar:hover #saying-statusbarpanel,#saying-icon{visibility: collapse !important;}\
			#urlbar:hover #saying-icon,#saying-statusbarpanel{visibility: visible !important;}\
			#saying-statusbarpanel{-moz-appearance: none !important;padding: 0px 0px 0px 0px !important;border: none !important;border-top: none !important;border-bottom: none !important;}\
			');
			var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
			document.insertBefore(style, document.documentElement);
		},

		onLocationChange: function(forceRefresh) {
			if (forceRefresh) {
				this.forceRefresh = true;
			}
			var aLocation = window.content.document.location;
			if (aLocation && aLocation.href && !/about:blank/.test(aLocation.href)) {
				this.lookup(aLocation.href);
			}

		},

		lookup: function(host, type) {

			if (host == "set") {
				sayingType = type;
				this._prefs.setCharPref("type", sayingType);
				return;
			}

			if (random) {
				var sayingRandom = ['saying', 'veryCD', 'hitokoto'];
				sayingType = sayingRandom[Math.floor(Math.random() * sayingRandom.length)];
			}

			if (this.forceRefresh) {
				this.forceRefresh = false;
				this['lookup_' + sayingType](host);
				return;
			}
			if (this.sayingHash[host]) {
				this.updateTooltipText(this.sayingHash[host]);
			} else {
				if (!this.isReqHash[host]) {
					this['lookup_' + sayingType](host);
				}
			}
			this.isReqHash[host] = true;
		},

		lookup_saying: function(host) {
			var self = this;
			if (saying_lib) {
				var responseObj = saying_json[Math.floor(Math.random() * saying_json.length)];
				self.sayingHash[host] = responseObj;
				self.updateTooltipText(responseObj);
			} else {
				self.sayingHash[host] = "无自定义数据";
				self.updateTooltipText("无自定义数据");
			}
		},

		lookup_hitokoto: function(host) {
			var self = this;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://api.hitokoto.us/rand', true);
			req.send(null);
			var onerror = function() {
				var obj = self.locallib('hitokoto');
				self.sayingHash[host] = obj;
				self.updateTooltipText(obj);
			};
			req.onerror = onerror;
			req.timeout = Local_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var obj;
					var responseObj = JSON.parse(req.responseText);
					hitokoto_json.push(responseObj);
					if (responseObj.source == "") {
						obj = responseObj.hitokoto;
					} else if (responseObj.source.match("《")) {
						obj = responseObj.hitokoto + '--' + responseObj.source;
					} else {
						obj = responseObj.hitokoto + '--《' + responseObj.source + '》';
					}
					self.sayingHash[host] = obj;
					self.updateTooltipText(obj);
				} else {
					onerror();
				}
			};
		},

		lookup_veryCD: function(host) {
			var self = this;
			if (veryCD_lib) {
				var responseObj = veryCD_json[Math.floor(Math.random() * veryCD_json.length)];
				self.sayingHash[host] = responseObj;
				self.updateTooltipText(responseObj);
			} else {
				self.sayingHash[host] = "无VeryCD数据";
				self.updateTooltipText("无VeryCD数据");
			}
		},

		locallib: function(type) {
			var localjson;
			if (hitokoto_lib && type == 'hitokoto') {
				var responseObj = hitokoto_json[Math.floor(Math.random() * hitokoto_json.length)];
				if (responseObj.source == "") {
					localjson = responseObj.hitokoto;
				} else if (responseObj.source.match("《")) {
					localjson = responseObj.hitokoto + '--' + responseObj.source;
				} else {
					localjson = responseObj.hitokoto + '--《' + responseObj.source + '》';
				}
				return localjson;
			} else if (!hitokoto_lib && type == 'hitokoto') {
				return localjson = "hitokoto无法访问";
			}
		},

		updateTooltipText: function(val) {

			if (SayingLong && SayingLong !== 0 && val.length > SayingLong) {
				urlval = val.substr(0, SayingLong) + '.....';
			} else {
				urlval = val;
			}

			if (autotip == 0) this.sayings.label = urlval;

			else {
				var popup = $("sayingtip");
				if (this.timer) clearTimeout(this.timer);
				if (typeof popup.openPopup != 'undefined') popup.openPopup(this.icon, "overlap", 0, 0, true, false);
				else popup.showPopup(this.icon, -1, -1, "popup", null, null);
				this.timer = setTimeout(function() {
					popup.hidePopup();
				}, autotiptime);
			}
			var label = $("sayingPopupLabel");
			while (label.firstChild) {
				label.removeChild(label.firstChild);
			}
			if (val != "") label.appendChild(document.createTextNode(val));
		},

		getVeryCD: function() {
			var self = this;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://www.verycd.com/statics/title.saying', true);
			req.send(null);
			req.onerror = function() {
				self.finsh('veryCD');
			}
			req.onload = function() {
				if (req.status == 200) {
					var _VC_DocumentTitles, _VC_DocumentTitleIndex;
					eval(req.responseText);
					_VC_DocumentTitles.forEach(function(t) {
						veryCD_json.push(t)
					})
				}
				self.finsh('veryCD');
			}
		},

		finsh: function(name) {
			if (name == 'hitokoto' || name == 'all') {
				var hitokotolibs = {};
				var hitokotoInfo = [];
				hitokoto_json.forEach(function(i) {
					if (!hitokotolibs[i.hitokoto]) {
						hitokotolibs[i.hitokoto] = true;
						hitokotoInfo.push(i);
					}
				});
				this.saveFile(hitokoto_Path, JSON.stringify(hitokotoInfo));
			}

			if (name == 'veryCD' || name == 'all') {
				var veryCDlibs = {};
				var veryCDInfo = [];
				veryCD_json.forEach(function(i) {
					if (!veryCDlibs[i]) {
						veryCDlibs[i] = true;
						veryCDInfo.push(i);
					}
				});
				this.saveFile(veryCD_Path, JSON.stringify(veryCDInfo));
			}
		},

		loadFile: function(file_Path) {
			var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
			aFile.appendRelativePath(file_Path);
			if (!aFile.exists() || !aFile.isFile()) return null;
			var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
			var sstream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);
			fstream.init(aFile, -1, 0, 0);
			sstream.init(fstream);
			var data = sstream.read(sstream.available());
			try {
				data = decodeURIComponent(escape(data));
			} catch (e) {}
			sstream.close();
			fstream.close();
			return data;
		},

		saveFile: function(name, data) {
			var file;
			if (typeof name == "string") {
				var file = Services.dirsvc.get('UChrm', Ci.nsILocalFile);
				file.appendRelativePath(name);
			} else {
				file = name;
			}

			var suConverter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
			suConverter.charset = 'UTF-8';
			data = suConverter.ConvertFromUnicode(data);

			var foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
			foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);
			foStream.write(data, data.length);
			foStream.close();
		},
	};

	window.saying.init();

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
})()
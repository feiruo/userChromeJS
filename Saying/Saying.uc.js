// ==UserScript==
// @name            Saying
// @description     地址栏自定义语句
// @author          feiruo
// @compatibility	Firefox 16
// @charset      	UTF-8
// @include         chrome://browser/content/browser.xul
// @id 				[09BD42EC]
// @startup         window.Saying.init();
// @shutdown        window.Saying.onDestroy(true);
// @optionsURL		about:config?filter=Saying.
// @reviewURL		http://bbs.kafan.cn/thread-1654067-1-1.html
// @homepageURL     https://github.com/feiruo/userChromeJS/tree/master/Saying
// @note            地址栏显示自定义语句，根据网址切换。
// @note            目前可自动获取的有VeryCD标题上的，和hitokoto API。
// @note            每次关闭浏览器后数据库添加获取过的内容，并去重复。
// @note            左键图标复制内容，中键重新获取，右键弹出菜单。
// @version         1.2
// @version         1.1 增加地址栏文字长度设置，避免撑长地址栏。
// ==/UserScript==
location == "chrome://browser/content/browser.xul" && (function() {
	if (window.Saying) {
		window.Saying.onDestroy();
		delete window.Saying;
	}

	var Saying = {
		//VeryCD(名言名句)或hitokoto。
		SayingType: 'VeryCD',

		//是否自动弹出文字
		autotip: false,

		//如果是地址栏文字，文字长度（个数，包括标点符号），留空或0则全部显示
		SayingLong: 0,

		//autotip=true时有效，设置自动弹出时，多少秒后关闭弹窗
		autotiptime: 5000,

		//是否混合随机显示
		Random: true,

		//毫秒， 延迟时间，时间内未取得在线数据，则使用本地数据库
		Local_Delay: 2500,

		//数据库文件位置		
		hitokoto_Path: 'lib\\hitokoto.json',
		VeryCD_Path: 'lib\\VeryCD.json',
		Saying_Path: 'lib\\Saying.json', //此数据库为自定义数据库，不更新只读取。

		debug: true,
		isFirestRun: true,
		hitokoto_lib: null,
		VeryCD_lib: null,
		Saying_lib: null,
		hitokoto_json: [],
		VeryCD_json: [],
		Saying_json: [],
		SayingHash: [],
		isReqHash: [],
	};
	Saying.init = function() {
		this.getPrefs();
		this.addIcon();
		this.getVeryCD();
		this.onLocationChange();

		if (!this.autotip)
			this.addlabel();

		if (this.isFirestRun) {
			this.hitokoto_lib = this.loadFile(this.hitokoto_Path);
			if (this.hitokoto_lib) this.hitokoto_json = JSON.parse(this.hitokoto_lib);

			this.VeryCD_lib = this.loadFile(this.VeryCD_Path);
			if (this.VeryCD_lib) this.veryCD_json = JSON.parse(this.VeryCD_lib);

			this.Saying_lib = this.loadFile(this.Saying_Path);
			if (this.Saying_lib) this.Saying_json = JSON.parse(this.Saying_lib);
		}

		Saying.progressListener = {
			onLocationChange: function() {
				Saying.onLocationChange();
			},
			onProgressChange: function() {},
			onSecurityChange: function() {},
			onStateChange: function() {},
			onStatusChange: function() {}
		};
		window.getBrowser().addProgressListener(Saying.progressListener);

		window.addEventListener("unload", function() {
			Saying.finsh('all');
			Saying.onDestroy();
		}, false);
	};
	Saying.onDestroy = function(isAlert) {
		window.getBrowser().removeProgressListener(Saying.progressListener);
		if (isAlert) {
			Saying.finsh('all');
			$("Saying-popup").parentNode.removeChild($("Saying-popup"));
			$("Saying-icon").parentNode.removeChild($("Saying-icon"));
			$("SayingTip").parentNode.removeChild($("SayingTip"));
			$("Saying-statusbarpanel").parentNode.removeChild($("Saying-statusbarpanel"));
		}
	};
	Saying.getPrefs = function() {
		this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("userChromeJS.Saying.");
		this._prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

		if (!this._prefs.prefHasUserValue("SayingType") || this._prefs.getPrefType("SayingType") != Ci.nsIPrefBranch.PREF_STRING)
			this._prefs.setCharPref("SayingType", this.SayingType);

		if (!this._prefs.prefHasUserValue("Random") || this._prefs.getPrefType("Random") != Ci.nsIPrefBranch.PREF_BOOL)
			this._prefs.setBoolPref("Random", this.Random)

		this.SayingType = this._prefs.getCharPref("SayingType");
		this.Random = this._prefs.getBoolPref("Random");
	};
	Saying.addIcon = function() {
		this.icon = $('urlbar-icons').appendChild($C('image', {
			id: 'Saying-icon',
			context: 'Saying-popup',
			src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADbklEQVQ4jTWKW0ybZQBA/8Rnn40PvhgfNIsajTHenozTZMZb9MlF4+XBYGam28wWXBySMfkCImxcZMKADGqhgVK0XAstLRRKaQcUKLRQWqAttD8t/bmW9uP44DzJeTpHOcjnz0kphZRSNLjj4rW7S+JsQ0C8fHNE6G0zQspjkZNSZB8+UuZE7jAlpNwXUkqhqMf5ah5SNx7jzC037xmSvNUa5+2GAN0Pov9n8kA6k2IptkWTN40jAUpS00Q+f4Q8PeHusJ9HP2vmyctdvFlu5ePGWT6snaS0x8P1xkGe+Lwa04iN33pcvFgX5JnyWZRtTRNoEdDW+aXdyRtXdDRMbGCJZLGu57BuSIyBY+pdO1ztmOXBtJ22PgvPFVl4vzOFEt8/FKe7a2zNOen1q4wnwZUE2+Z/WiJ5rFFwxU9Y3NplL70Ch8tcqrzPmbI5FFVdEcdLI0z7Anh2wbUNjugptk1Jf+gEvW+XuskYo5FDdnbWOEj6ON3zc6P8T54vNKNoc2aRXnCwmJEs7Erc21kGw3s4onk65lUM8yrf66dp9u4yE02T14LAJj+3/MPTP5pRVLtepNNx1rIwqx5gj+1hCKiMRY+od4Xp8ie5ZJiiqHcRdyLHxPIqairM/lGCL6rMKAGHWfi1fTypHMPrGRrdMX4fC9Mb0Ljc5qKkd4mS1iEK6ocxL2cwrRxT2jUOchvIonhGTGIgnKHFl6TSuU5xl5syk5vW6TiFTUOUdE1hMhr5qeIe3VMhrFtQcN/LnR4HAMpMf7todYW52DXPN21efm3txzAwStVQAKPDzfWKJi58fZHHHn8dUdPGSALEUIiXrnWyEIujRGx6oR+Y5FyFjfOVgzgmxkmpIVrtPjZjAabdDj658RdPnb/NHx1DGINZKkbWeOFaN6X9ARTNrhOhlQAfVFh495aZ7uYavFYDCXUNUIE9+kedjI/b+XvKT+1kku90Hp69YuCCbg4ladMJkNwZnOfVIjPN99rIL9g4TQfQNnyo3lEIumDVSV2vhx+My7xzs4dhX5iKXh+K9JhEd0cfHxV38q3eR0F1Pwn/FGhBovoW9i095OPzRPyTfFkzyFe1Y1gmggD0eUIoxaU68cgrVzlb2M5ta4Qm4yxVOhvmqWmWPGNoc3aOVu14B9r5tKyHPucKZHPAKZmDE/4FfP05vqO/HLUAAAAASUVORK5CYII=',
			tooltip: 'SayingTip',
			style: 'padding: 0px 2px'
		}));

		this.icon.addEventListener("click", function(event) {
			if (event.button == 0) {
				Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString($("SayingPopupLabel").textContent);
			} else if (event.button == 1) {
				Saying.onLocationChange(true);
			}
		}, false);

		var popup = $C('menupopup', {
			id: 'Saying-popup',
			position: 'at_pointer'
		});

		popup.appendChild($C('menuitem', {
			label: "复制内容",
			oncommand: "Saying.copy();"
		}));

		popup.appendChild($C('menuitem', {
			label: "重新获取",
			oncommand: "Saying.onLocationChange(true);"
		}));

		popup.appendChild($C('menuitem', {
			label: "去重保存",
			oncommand: "Saying.finsh('all');"
		}));

		popup.appendChild($C('menuseparator'));

		popup.appendChild($C('menuitem', {
			label: "hitokoto",
			id: "Saying-look-hitokoto",
			type: "radio",
			oncommand: 'Saying.sets("set","hitokoto");'
		}));

		popup.appendChild($C('menuitem', {
			label: "名言名句",
			id: "Saying-look-VeryCD",
			type: "radio",
			oncommand: 'Saying.sets("set","VeryCD");'
		}));

		popup.appendChild($C('menuitem', {
			label: "手动设定",
			id: "Saying-look-Saying",
			type: "radio",
			oncommand: 'Saying.sets("set","Saying");'
		}));

		popup.appendChild($C('menuseparator'));

		popup.appendChild($C('menuitem', {
			label: "混合随机",
			id: "Saying-Random",
			type: "checkbox",
			oncommand: 'Saying.sets("Random");'
		}));

		$('mainPopupSet').appendChild(popup);

		$("Saying-look-" + this.SayingType).setAttribute('checked', true);
		$("Saying-Random").setAttribute('checked', this.Random);

		var xmltt = '\
        	<tooltip id="SayingTip" style="opacity: 0.8 ;color: brown ;text-shadow:0 0 3px #CCC ;background: rgba(255,255,255,0.6) ;padding-bottom:3px ;border:1px solid #BBB ;border-radius: 3px ;box-shadow:0 0 3px #444 ;">\
        	<label id="SayingPopupLabel" flex="1" />\
    		</tooltip>\
    		';

		var rangett = document.createRange();
		rangett.selectNodeContents($('mainPopupSet'));
		rangett.collapse(false);
		rangett.insertNode(rangett.createContextualFragment(xmltt.replace(/\n|\r/g, '')));
		rangett.detach();

		this.SayingTip = $("SayingPopupLabel");
		this.SayingTip.addEventListener("click", function(e) {
			if (e.button == 0) {
				$("SayingTip").hidePopup();
			} else if (e.button == 2) {
				Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString($("SayingPopupLabel").textContent);
				$("SayingTip").hidePopup();
			}
		}, false);
	};
	Saying.addlabel = function() {
		this.Sayings = $('urlbar-icons').appendChild($C('statusbarpanel', {
			id: 'Saying-statusbarpanel',
			style: 'color: brown; margin: 0 0 -1px 0'
		}));
		var cssStr = ('\
			#Saying-statusbarpanel,#Saying-icon{-moz-box-ordinal-group: 0 !important;}\
			#urlbar:hover #Saying-statusbarpanel,#Saying-icon{visibility: collapse !important;}\
			#urlbar:hover #Saying-icon,#Saying-statusbarpanel{visibility: visible !important;}\
			#Saying-statusbarpanel{-moz-appearance: none !important;padding: 0px 0px 0px 0px !important;border: none !important;border-top: none !important;border-bottom: none !important;}\
			');
		var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
		document.insertBefore(style, document.documentElement);
	};
	Saying.onLocationChange = function(forceRefresh) {
		if (forceRefresh) {
			this.forceRefresh = true;
		}
		var aLocation = window.content.document.location;
		if (aLocation && aLocation.href && !/about:blank/.test(aLocation.href)) {
			this.lookup(aLocation.href);
		}
	};
	Saying.sets = function(type, val) {
		if (type == "set") {
			this.SayingType = val;
			this._prefs.setCharPref("SayingType", this.SayingType);
		}
		if (type == "Random") {
			this.Random = !this.Random;
			this._prefs.setBoolPref("Random", this.Random)
		}
		this.onLocationChange(true)
	};
	Saying.lookup = function(host, type) {
		var site = this.SayingType
		if (this.Random) {
			var Randoms = ['Saying', 'VeryCD', 'hitokoto'];
			site = Randoms[Math.floor(Math.random() * Randoms.length)];
		}

		if (this.forceRefresh) {
			this.forceRefresh = false;
			this['lookup_' + site](host);
			return;
		}

		if (this.SayingHash[host]) {
			this.updateTooltipText(this.SayingHash[host]);
		}

		if (!this.isReqHash[host]) {
			this['lookup_' + site](host);

		}
		this.isReqHash[host] = true;
	};
	Saying.lookup_hitokoto = function(host) {
		var self = Saying;
		var req = new XMLHttpRequest();
		req.open("GET", 'http://api.hitokoto.us/rand', true);
		req.send(null);
		var onerror = function() {
			var obj = self.locallib('hitokoto');
			self.SayingHash[host] = obj;
			self.updateTooltipText(obj);
		};
		req.onerror = onerror;
		req.timeout = Saying.Local_Delay;
		req.ontimeout = onerror;
		req.onload = function() {
			if (req.status == 200) {
				var obj;
				var responseObj = JSON.parse(req.responseText);
				Saying.hitokoto_json.push(responseObj);
				if (responseObj.source == "") {
					obj = responseObj.hitokoto;
				} else if (responseObj.source.match("《")) {
					obj = responseObj.hitokoto + '--' + responseObj.source;
				} else {
					obj = responseObj.hitokoto + '--《' + responseObj.source + '》';
				}
				self.SayingHash[host] = obj;
				self.updateTooltipText(obj);
			} else {
				onerror();
			}
		};
	};
	Saying.lookup_VeryCD = function(host) {
		if (Saying.VeryCD_lib) {
			var responseObj = Saying.veryCD_json[Math.floor(Math.random() * Saying.veryCD_json.length)];
			Saying.SayingHash[host] = responseObj;
			Saying.updateTooltipText(responseObj);
		} else {
			Saying.SayingHash[host] = "无VeryCD数据";
			Saying.updateTooltipText("无VeryCD数据");
		}
	};
	Saying.lookup_Saying = function(host) {
		if (Saying.Saying_lib) {
			var responseObj = Saying.Saying_json[Math.floor(Math.random() * Saying.Saying_json.length)];
			Saying.SayingHash[host] = responseObj;
			Saying.updateTooltipText(responseObj);
		} else {
			Saying.SayingHash[host] = "无自定义数据";
			Saying.updateTooltipText("无自定义数据");
		}
	};
	Saying.locallib = function(type) {
		var localjson;
		if (Saying.hitokoto_lib && type == 'hitokoto') {
			var responseObj = Saying.hitokoto_json[Math.floor(Math.random() * Saying.hitokoto_json.length)];
			if (responseObj.source == "") {
				localjson = responseObj.hitokoto;
			} else if (responseObj.source.match("《")) {
				localjson = responseObj.hitokoto + '--' + responseObj.source;
			} else {
				localjson = responseObj.hitokoto + '--《' + responseObj.source + '》';
			}
			return localjson;
		} else if (!hitokoto_lib && this.SayingType == 'hitokoto') {
			return "hitokoto无法访问";
		}
	};
	Saying.updateTooltipText = function(val) {
		if (this.SayingLong && this.SayingLong !== 0 && val.length > this.SayingLong) {
			val = val.substr(0, SayingLong) + '.....';
		} else {
			val = val;
		}

		if (!this.autotip)
			this.Sayings.label = val;
		else {
			var popup = $("SayingTip");
			if (this.timer) clearTimeout(this.timer);
			if (typeof popup.openPopup != 'undefined') popup.openPopup(this.icon, "overlap", 0, 0, true, false);
			else popup.showPopup(this.icon, -1, -1, "popup", null, null);
			this.timer = setTimeout(function() {
				popup.hidePopup();
			}, this.autotiptime);
		}

		var label = $("SayingPopupLabel");
		while (label.firstChild) {
			label.removeChild(label.firstChild);
		}
		if (val != "") label.appendChild(document.createTextNode(val));
	};
	Saying.copy = function() {
		Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper)
			.copyString($("SayingPopupLabel").textContent);
	};
	Saying.getVeryCD = function() {
		var self = Saying;
		var req = new XMLHttpRequest();
		req.open("GET", 'http://www.VeryCD.com/statics/title.Saying', true);
		req.send(null);
		req.onerror = function() {
			self.finsh('VeryCD');
		}
		req.onload = function() {
			if (req.status == 200) {
				var _VC_DocumentTitles, _VC_DocumentTitleIndex;
				eval(req.responseText);
				_VC_DocumentTitles.forEach(function(t) {
					self.VeryCD_json.push(t)
				})
			}
			self.finsh('VeryCD');
		}
	};
	Saying.finsh = function(name) {
		if (name == 'hitokoto' || name == 'all') {
			var hitokotolibs = {};
			var hitokotoInfo = [];
			this.hitokoto_json.forEach(function(i) {
				if (!hitokotolibs[i.hitokoto]) {
					hitokotolibs[i.hitokoto] = true;
					hitokotoInfo.push(i);
				}
			});
			this.saveFile(this.hitokoto_Path, JSON.stringify(hitokotoInfo));
		}
		if (name == 'VeryCD' || name == 'all') {
			var veryCDlibs = {};
			var veryCDInfo = [];
			this.veryCD_json.forEach(function(i) {
				if (!veryCDlibs[i]) {
					veryCDlibs[i] = true;
					veryCDInfo.push(i);
				}
			});
			this.saveFile(this.VeryCD_Path, JSON.stringify(veryCDInfo));
		}
	};
	Saying.loadFile = function(file_Path) {
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
	};
	Saying.saveFile = function(name, data) {
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
	};

	function log() {
		if (Saying.debug) Application.console.log('[Saying DEBUG] ' + Array.slice(arguments));
	}

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	Saying.init();
	window.Saying = Saying;
})()
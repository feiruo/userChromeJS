// ==UserScript==
// @name            Saying
// @description     地址栏自定义语句
// @author          feiruo
// @compatibility	Firefox 16
// @charset      	UTF-8
// @include         chrome://browser/content/browser.xul
// @id 				[09BD42EC]
// @startup         window.Saying.init();
// @shutdown        window.Saying.onDestroy();
// @optionsURL		about:config?filter=Saying.
// @reviewURL		http://bbs.kafan.cn/thread-1654067-1-1.html
// @homepageURL     https://github.com/feiruo/userChromeJS/tree/master/Saying
// @note            地址栏显示自定义语句，根据网址切换。
// @note            目前可自动获取的有VeryCD标题上的，和hitokoto API。
// @note            每次关闭浏览器后数据库添加获取过的内容，并去重复。
// @note            左键图标复制内容，中键重新获取，右键弹出菜单。
// @version         1.2.2 	2015.02.14 21:00	对VeryCD没办法，转为本地数据并合并到自定义数据里。选项调整。
// @version         1.2.1 	VeryCD网站原因，取消VeryCD在线获取。请下载Github上的VeryCD.json数据库
// @version         1.1 	增加地址栏文字长度设置，避免撑长地址栏。
// ==/UserScript==
location == "chrome://browser/content/browser.xul" && (function() {
	if (!window.Saying) {
		window.Saying = {
			init: function() {
				if (!this.dirs) {
					for (var i = 0; i < userChrome_js.scripts.length; i++) {
						if (userChrome_js.scripts[i].id == '[09BD42EC]' || userChrome_js.scripts[i].description == '地址栏自定义语句') {
							this.dirs = userChrome_js.scripts[i].file.path;
							break;
						}
					}
				}
				userChrome.import(this.dirs);
			},
			onDestroy: function(isAlert) {
				try {
					window.getBrowser().removeProgressListener(window.SayingS.progressListener);
					SayingS.finsh('all');
					$("Saying-popup").parentNode.removeChild($("Saying-popup"));
					$("Saying-icon").parentNode.removeChild($("Saying-icon"));
					$("SayingTip").parentNode.removeChild($("SayingTip"));
					$("Saying-statusbarpanel").parentNode.removeChild($("Saying-statusbarpanel"));
				} catch (e) {
					log(e);
				}

				delete window.RuleS;
				Services.obs.notifyObservers(null, "startupcache-invalidate", "");
			},
		};
		window.addEventListener("unload", function() {
			Saying.onDestroy();
		}, false);
	}

	if (window.SayingS) window.Saying.onDestroy();

	var SayingS = {

		SayingLong: 0, //地址栏文字长度（个数，包括标点符号），留空或0则全部显示
		autotiptime: 5000, //自动弹出文字文字的延时，毫秒
		Local_Delay: 2500, //网络获取延时，超过这个设定时间还未获得就使用本地数据

		//数据库文件位置		
		hitokoto_Path: 'lib\\hitokoto.json',
		Saying_Path: 'lib\\Saying.json', //此数据库为自定义数据库，不更新只读取。

		debug: true,
		isFirestRun: true,
		hitokoto_lib: null,
		Saying_lib: null,
		hitokoto_json: [],
		Saying_json: [],
		SayingHash: [],
		isReqHash: [],
	};

	SayingS.init = function() {
		this.getPrefs();
		this.addIcon();
		this.onLocationChange();

		if (this.isFirestRun) {
			this.hitokoto_lib = this.loadFile(this.hitokoto_Path);
			if (this.hitokoto_lib) this.hitokoto_json = JSON.parse(this.hitokoto_lib);

			this.Saying_lib = this.loadFile(this.Saying_Path);
			if (this.Saying_lib) this.Saying_json = JSON.parse(this.Saying_lib);
		}

		SayingS.progressListener = {
			onLocationChange: function() {
				SayingS.onLocationChange();
			},
			onProgressChange: function() {},
			onSecurityChange: function() {},
			onStateChange: function() {},
			onStatusChange: function() {}
		};
		window.getBrowser().addProgressListener(SayingS.progressListener);
	};

	SayingS.getPrefs = function() {
		this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("userChromeJS.Saying.");
		this._prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

		if (!this._prefs.prefHasUserValue("SayingType") || this._prefs.getPrefType("SayingType") != Ci.nsIPrefBranch.PREF_STRING)
			this._prefs.setCharPref("SayingType", 'hitokoto,Saying');

		if (!this._prefs.prefHasUserValue("autotip") || this._prefs.getPrefType("autotip") != Ci.nsIPrefBranch.PREF_BOOL)
			this._prefs.setBoolPref("autotip", false)
			/*
					if (!this._prefs.prefHasUserValue("SayingLong") || this._prefs.getPrefType("SayingLong") != Ci.nsIPrefBranch.PREF_STRING)
						this._prefs.setCharPref("SayingLong", 0);

					if (!this._prefs.prefHasUserValue("autotiptime") || this._prefs.getPrefType("autotiptime") != Ci.nsIPrefBranch.PREF_STRING)
						this._prefs.setCharPref("autotiptime", 5000);

					if (!this._prefs.prefHasUserValue("Local_Delay") || this._prefs.getPrefType("Local_Delay") != Ci.nsIPrefBranch.PREF_STRING)
						this._prefs.setCharPref("Local_Delay", 2500);
			*/
		this.SayingType = this._prefs.getCharPref("SayingType");
		this.autotip = this._prefs.getBoolPref("autotip");
		//this.SayingLong = this._prefs.getCharPref("SayingLong");
		//this.autotiptime = this._prefs.getCharPref("autotiptime");
		//this.Local_Delay = this._prefs.getCharPref("Local_Delay");
	};

	SayingS.addIcon = function() {
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
				SayingS.onLocationChange(true);
			}
		}, false);

		var popup = $C('menupopup', {
			id: 'Saying-popup',
			position: 'at_pointer'
		});

		popup.appendChild($C('menuitem', {
			label: "复制内容",
			oncommand: "SayingS.copy();"
		}));

		popup.appendChild($C('menuitem', {
			label: "重新获取",
			oncommand: "SayingS.onLocationChange(true);"
		}));

		popup.appendChild($C('menuitem', {
			label: "去重保存",
			oncommand: "SayingS.finsh('all');"
		}));

		popup.appendChild($C('menuseparator'));

		popup.appendChild($C('menuitem', {
			label: "hitokoto",
			id: "Saying-look-hitokoto",
			type: "checkbox",
			oncommand: 'SayingS.sets("set","hitokoto");'
		}));

		popup.appendChild($C('menuitem', {
			label: "本地数据",
			id: "Saying-look-Saying",
			type: "checkbox",
			oncommand: 'SayingS.sets("set","Saying");'
		}));

		popup.appendChild($C('menuseparator'));

		popup.appendChild($C('menuitem', {
			label: "自动弹出",
			id: "Saying-autotip",
			type: "checkbox",
			tooltiptext: "是否自动弹出文字，否则地址栏显示",
			oncommand: 'SayingS.sets("autotip");'
		}));
		/*
				popup.appendChild($C('menuitem', {
					label: "文字长度",
					id: "Saying-SayingLong",
					type: "checkbox",
					hidden: this.autotip,
					tooltiptext: "文字长度（个数，包括标点符号），留空或0则全部显示",
					oncommand: 'SayingS.sets("SayingLong");'
				}));
				popup.appendChild($C('menuitem', {
					label: "弹出延时",
					id: "Saying-autotiptime",
					type: "checkbox",
					tooltiptext: "自动弹出文字文字的延时，毫秒",
					hidden: !this.autotip,
					oncommand: 'SayingS.sets("autotiptime");'
				}));

		*/
		$('mainPopupSet').appendChild(popup);

		$("Saying-look-hitokoto").setAttribute('checked', this.SayingType.match('hitokoto') ? true : false);
		$("Saying-look-Saying").setAttribute('checked', this.SayingType.match('Saying') ? true : false);
		$("Saying-autotip").setAttribute('checked', this.autotip);

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

		this.SayingLabel = $('urlbar-icons').appendChild($C('statusbarpanel', {
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

	SayingS.onLocationChange = function(forceRefresh) {
		if (forceRefresh) {
			this.forceRefresh = true;
		}
		var aLocation = window.content.document.location;
		if (aLocation && aLocation.href && !/about:blank/.test(aLocation.href)) {
			this.lookup(aLocation.href);
		}
	};

	SayingS.sets = function(type, val) {
		if (type == "set") {
			if (this.SayingType.match(val))
				this.SayingType = this.SayingType.replace(val, '');
			else
				this.SayingType = this.SayingType + ',' + val;
			if (this.SayingType.length !== 0) {
				var arr = this.SayingType.split(','),
					newarr = [];
				for (var i = arr.length - 1; i >= 0; i--) {
					if (!arr[i] == '')
						newarr = newarr.concat(arr[i]);
				}
				this.SayingType = newarr.join(',');
			}
			this._prefs.setCharPref("SayingType", this.SayingType);
		}
		if (type == "autotip") {
			this.autotip = !this.autotip;
			this._prefs.setBoolPref("autotip", this.autotip)
		}
		/*
				if (type == "autotiptime") {
					this.autotiptime = val;
					this._prefs.setCharPref("autotiptime", this.autotiptime);
				}*/
		//$("Saying-SayingLong").hidden = this.autotip
		//$("Saying-autotiptime").hidden = !this.autotip
		$("Saying-autotip").setAttribute('checked', this.autotip);
		this.onLocationChange(true)
	};

	/*****************************************************************************************/

	SayingS.lookup = function(host, type) {
		if (this.SayingType.length == 0) return;
		var site = this.SayingType.split(",");
		site = site[Math.floor(Math.random() * site.length)];

		if (this.forceRefresh) {
			this.forceRefresh = false;
			this['lookup_' + site](host);
			return;
		}

		if (this.SayingHash[host])
			this.updateTooltipText(this.SayingHash[host]);

		if (!this.isReqHash[host])
			this['lookup_' + site](host);

		this.isReqHash[host] = true;
	};

	SayingS.lookup_hitokoto = function(host) {
		var self = SayingS;
		var req = new XMLHttpRequest();
		req.open("GET", 'http://api.hitokoto.us/rand', true);
		req.send(null);
		var onerror = function() {
			var obj = self.locallib('hitokoto');
			self.SayingHash[host] = obj;
			self.updateTooltipText(obj);
		};
		req.onerror = onerror;
		req.timeout = self.Local_Delay;
		req.ontimeout = onerror;
		req.onload = function() {
			if (req.status == 200) {
				var obj;
				var responseObj = JSON.parse(req.responseText);
				self.hitokoto_json.push(responseObj);
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

	SayingS.lookup_Saying = function(host) {
		if (this.Saying_lib) {
			var responseObj = this.Saying_json[Math.floor(Math.random() * this.Saying_json.length)];
			this.SayingHash[host] = responseObj;
			this.updateTooltipText(responseObj);
		} else {
			this.SayingHash[host] = "无本地数据";
			this.updateTooltipText("无本地数据");
		}
	};

	SayingS.locallib = function(type) {
		var localjson;
		if (this.hitokoto_lib && type == 'hitokoto') {
			var responseObj = this.hitokoto_json[Math.floor(Math.random() * this.hitokoto_json.length)];
			if (responseObj.source == "") {
				localjson = responseObj.hitokoto;
			} else if (responseObj.source.match("《")) {
				localjson = responseObj.hitokoto + '--' + responseObj.source;
			} else {
				localjson = responseObj.hitokoto + '--《' + responseObj.source + '》';
			}
			return localjson;
		} else if (!this.hitokoto_lib && this.SayingType == 'hitokoto') {
			return "hitokoto无法访问";
		}
	};

	/*****************************************************************************************/

	SayingS.updateTooltipText = function(val) {
		if (this.SayingLong > 0 && val.length > this.SayingLong) {
			val = val.substr(0, this.SayingLong) + '.....';
		} else {
			val = val;
		}

		this.SayingLabel.hidden = this.autotip;
		this.SayingLabel.label = val;
		if (this.autotip) {
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

	SayingS.copy = function() {
		Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper)
			.copyString($("SayingPopupLabel").textContent);
	};

	SayingS.finsh = function(name) {
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
	};

	SayingS.loadFile = function(file_Path) {
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

	SayingS.saveFile = function(name, data) {
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

	/*****************************************************************************************/
	function log() {
		if (SayingS.debug) Application.console.log('[Saying DEBUG] ' + Array.slice(arguments));
	}

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	SayingS.init();
	window.SayingS = SayingS;
})()
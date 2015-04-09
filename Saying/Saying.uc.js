// ==UserScript==
// @name			Saying
// @description		地址栏自定义语句
// @author			feiruo
// @compatibility	Firefox 16
// @charset			UTF-8
// @include			chrome://browser/content/browser.xul
// @id				[09BD42EC]
// @inspect			window.Saying
// @startup			window.Saying.init();
// @shutdown		window.Saying.onDestroy();
// @optionsURL		about:config?filter=Saying.
// @reviewURL		http://bbs.kafan.cn/thread-1654067-1-1.html
// @homepageURL		https://github.com/feiruo/userChromeJS/tree/master/Saying
// @downloadURL		https://github.com/feiruo/userChromeJS/raw/master/Saying/Saying.uc.js
// @note			地址栏显示自定义语句，根据网址切换。
// @note			目前可自动获取的有VeryCD标题上的，和hitokoto API。
// @note			每次关闭浏览器后数据库添加获取过的内容，并去重复。
// @note			左键图标复制内容，中键重新获取，右键弹出菜单。
// @version			1.4.0 	2015.03.29 19:00	修改机制。
// @version			1.3.0 	2015.03.09 19:00	Rebuild。
// @version			1.2.2 	2015.02.14 21:00	对VeryCD没办法，转为本地数据并合并到自定义数据里。选项调整。
// @version			1.2.1 	VeryCD网站原因，取消VeryCD在线获取。请下载Github上的VeryCD.json数据库
// @version			1.1 	增加地址栏文字长度设置，避免撑长地址栏。
// ==/UserScript==
location == "chrome://browser/content/browser.xul" && (function() {

	if (window.Saying) {
		window.Saying.onDestroy();
		delete window.Saying;
	}

	if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");

	var Saying = {

		//数据库文件位置		
		hitokoto_Path: 'lib\\hitokoto.json',
		Saying_Path: 'lib\\Saying.json', //此数据库为自定义数据库，不更新只读取。

		Saying_json: [],
		hitokoto_json: [],
		SayingHash: [],
		isReqHash: [],

		get currentURI() {
			var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"]
				.getService(Ci.nsIWindowMediator);
			var topWindowOfType = windowMediator.getMostRecentWindow("navigator:browser");
			if (topWindowOfType)
				return topWindowOfType.document.getElementById("content").currentURI;
			return null;
		},
		get wm() {
			delete this.wm;
			return this.wm = Cc["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
		},
		get prefs() {
			delete this.prefs;
			return this.prefs = Services.prefs.getBranch("userChromeJS.Saying.");
		},

		init: function() {
			var Saying_lib = this.getData(this.Saying_Path);
			if (Saying_lib) {
				if (this.Saying_json) delete this.Saying_json;
				this.Saying_json = JSON.parse(Saying_lib);
			}

			var hitokoto_lib = this.getData(this.hitokoto_Path);
			if (hitokoto_lib) {
				if (this.hitokoto_json) delete this.hitokoto_json;
				this.hitokoto_json = JSON.parse(hitokoto_lib);
			}

			this.loadSetting();
			this.addIcon();
			this.option = this.option();

			this.onLocationChange();

			this.progressListener = {
				onLocationChange: function() {
					Saying.onLocationChange();
				},
				onProgressChange: function() {},
				onSecurityChange: function() {},
				onStateChange: function() {},
				onStatusChange: function() {}
			};

			window.getBrowser().addProgressListener(Saying.progressListener);

			this.prefs.addObserver('', this.PrefKey, false);

			window.addEventListener("unload", function() {
				Saying.onDestroy();
				Saying.prefs.removeObserver('', Saying.PrefKey, false);
			}, false);
		},

		onDestroy: function() {
			try {
				window.getBrowser().removeProgressListener(window.Saying.progressListener);
				this.prefs.removeObserver('', this.PrefKey, false);
				Saying.finsh('all');
				$("Saying-popup").parentNode.removeChild($("Saying-popup"));
				$("Saying-icon").parentNode.removeChild($("Saying-icon"));
				$("SayingTip").parentNode.removeChild($("SayingTip"));
				$("Saying-statusbarpanel").parentNode.removeChild($("Saying-statusbarpanel"));
			} catch (e) {}
			win = this.wm.getMostRecentWindow("Saying:Preferences");
			if (win) win.close();
			Services.obs.notifyObservers(null, "startupcache-invalidate", "");
		},

		option: function() {
			let xul = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
				<prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
					id="Saying_Settings"\
					ignorekeys="true"\
					title="Saying 设置"\
					onload="Change();"\
					buttons="accept, cancel, extra1"\
					ondialogextra1="reset();"\
					windowtype="Saying:Preferences">\
					<prefpane id="main" flex="1">\
						<preferences>\
							<preference id="ShowType" type="int" name="userChromeJS.Saying.ShowType"/>\
							<preference id="SayingLong" type="int" name="userChromeJS.Saying.SayingLong"/>\
							<preference id="AutoTipTime" type="int" name="userChromeJS.Saying.AutoTipTime"/>\
							<preference id="Local_Delay" type="int" name="userChromeJS.Saying.Local_Delay"/>\
							<preference id="Online" type="bool" name="userChromeJS.Saying.Online"/>\
						</preferences>\
						<script>\
							function reset() {\
								$("ShowType").value = "0";\
								$("SayingLong").value = "0";\
								$("AutoTipTime").value = "5000";\
								$("Local_Delay").value = "2500";\
								$("Online").value = true;\
								Change();\
							}\
							function Change() {\
								$("SayingLong").disabled = !$("ShowTypeU").selected;\
								$("AutoTipTime").disabled = !$("AutoTip").selected;\
								$("Local_Delay").disabled = !$("Onliner").checked;\
							}\
							function $(id) document.getElementById(id);\
						</script>\
						<vbox>\
							<groupbox>\
							<caption label="显示类型" align="center"/>\
							<grid>\
							<rows>\
								<radiogroup id="ShowType" preference="ShowType">\
									<radio label="地址栏文字" id="ShowTypeU" value="0" oncommand="Change();"/>\
									<row align="center">\
										<label value="文字长度："/>\
										<textbox id="SayingLong" type="number" preference="SayingLong" tooltiptext="地址栏文字长度（个数，包括标点符号），0则全部显示"/>\
									</row>\
									<radio label="自动弹出" id="AutoTip" value="0" oncommand="Change();"/>\
									<row align="center">\
										<label value="显示时间："/>\
										<textbox id="AutoTipTime" type="number" preference="AutoTipTime"  tooltiptext="自动弹出文字文字的显示时间，毫秒"/>\
									</row>\
								</radiogroup>\
							</rows>\
							</grid>\
							</groupbox>\
							<groupbox>\
								<checkbox id="Onliner" label="在线查询，可能会影响脚本效率！" preference="Online" oncommand="Change();"/>\
								<row align="center" class="indent">\
									<label value="查询延时：" tooltiptext="网络获取延时，超过这个设定时间还未获得就使用本地数据，单位“毫秒”！"/>\
									<textbox id="Local_Delay" type="number" preference="Local_Delay" style="width:125px" tooltiptext="请注意，如果网络不流畅或者查询API出现问题，延迟过大可能会使脚本无响应！"/>\
								</row>\
							</groupbox>\
						</vbox>\
						<hbox flex="1">\
							<button dlgtype="extra1" label="还原默认值" />\
							<spacer flex="1" />\
							<button dlgtype="accept"/>\
							<button dlgtype="cancel"/>\
						</hbox>\
					</prefpane>\
				</prefwindow>\
            ';
			return encodeURIComponent(xul);
		},

		openPref: function() {
			var win;
			win = this.wm.getMostRecentWindow("Saying:Preferences");
			if (win)
				win.focus();
			else
				window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + this.option, '', 'chrome,titlebar,toolbar,centerscreen,dialog=no');
		},

		PrefKey: function(subject, topic, data) {
			if (topic == 'nsPref:changed') {
				switch (data) {
					case 'SayingLong':
					case 'AutoTipTime':
					case 'Local_Delay':
					case 'SayingType':
					case 'ShowType':
					case 'online':
						Saying.loadSetting(data);
						break;
				}
			}
		},

		loadSetting: function(type) {
			if (!type || type === "SayingType") {
				var SayingType = this.getPrefs(2, "SayingType", 'hitokoto,Saying,FireFoxFan');
				if (this.SayingType === SayingType) return;
				this.SayingType = SayingType;
				this.onLocationChange(true);
			}

			if (!type || type === "online") {
				this.online = this.getPrefs(0, "online", true);
				this.onLocationChange(true);
			}

			if (!type || type === "ShowType") {
				this.ShowType = this.getPrefs(1, "ShowType", 0);
				this.onLocationChange();
			}

			if (!type || type === "SayingLong") {
				this.SayingLong = this.getPrefs(1, "SayingLong", 0);
				this.onLocationChange();
			}

			if (!type || type === "AutoTipTime")
				this.AutoTipTime = this.getPrefs(1, "AutoTipTime", 5000);

			if (!type || type === "Local_Delay")
				this.Local_Delay = this.getPrefs(1, "Local_Delay", 2500);
		},

		getPrefs: function(type, name, val) {
			if (type === 0) {
				if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_BOOL)
					this.prefs.setBoolPref(name, val);
				return this.prefs.getBoolPref(name);
			}
			if (type === 1) {
				if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_INT)
					this.prefs.setIntPref(name, val);
				return this.prefs.getIntPref(name);
			}
			if (type === 2) {
				if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING)
					this.prefs.setCharPref(name, val);
				return this.prefs.getCharPref(name);
			}
		},

		getData: function(path, isAlert) {
			var data, afile;
			path = path.replace(/\//g, '\\');
			if (/(\\)$/.test(path))
				path.substring(path.lastIndexOf("\\") + 1)
			afile = FileUtils.getFile("UChrm", path.split('\\'));
			if (afile && afile.exists() && afile.isFile()) {
				if (isAlert)
					data = afile;
				else
					data = this.loadFile(afile);
			}
			return data;
		},

		addIcon: function(isAlert) {
			this.icon = $('urlbar-icons').appendChild($C('image', {
				id: 'Saying-icon',
				context: 'Saying-popup',
				src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADbklEQVQ4jTWKW0ybZQBA/8Rnn40PvhgfNIsajTHenozTZMZb9MlF4+XBYGam28wWXBySMfkCImxcZMKADGqhgVK0XAstLRRKaQcUKLRQWqAttD8t/bmW9uP44DzJeTpHOcjnz0kphZRSNLjj4rW7S+JsQ0C8fHNE6G0zQspjkZNSZB8+UuZE7jAlpNwXUkqhqMf5ah5SNx7jzC037xmSvNUa5+2GAN0Pov9n8kA6k2IptkWTN40jAUpS00Q+f4Q8PeHusJ9HP2vmyctdvFlu5ePGWT6snaS0x8P1xkGe+Lwa04iN33pcvFgX5JnyWZRtTRNoEdDW+aXdyRtXdDRMbGCJZLGu57BuSIyBY+pdO1ztmOXBtJ22PgvPFVl4vzOFEt8/FKe7a2zNOen1q4wnwZUE2+Z/WiJ5rFFwxU9Y3NplL70Ch8tcqrzPmbI5FFVdEcdLI0z7Anh2wbUNjugptk1Jf+gEvW+XuskYo5FDdnbWOEj6ON3zc6P8T54vNKNoc2aRXnCwmJEs7Erc21kGw3s4onk65lUM8yrf66dp9u4yE02T14LAJj+3/MPTP5pRVLtepNNx1rIwqx5gj+1hCKiMRY+od4Xp8ie5ZJiiqHcRdyLHxPIqairM/lGCL6rMKAGHWfi1fTypHMPrGRrdMX4fC9Mb0Ljc5qKkd4mS1iEK6ocxL2cwrRxT2jUOchvIonhGTGIgnKHFl6TSuU5xl5syk5vW6TiFTUOUdE1hMhr5qeIe3VMhrFtQcN/LnR4HAMpMf7todYW52DXPN21efm3txzAwStVQAKPDzfWKJi58fZHHHn8dUdPGSALEUIiXrnWyEIujRGx6oR+Y5FyFjfOVgzgmxkmpIVrtPjZjAabdDj658RdPnb/NHx1DGINZKkbWeOFaN6X9ARTNrhOhlQAfVFh495aZ7uYavFYDCXUNUIE9+kedjI/b+XvKT+1kku90Hp69YuCCbg4ladMJkNwZnOfVIjPN99rIL9g4TQfQNnyo3lEIumDVSV2vhx+My7xzs4dhX5iKXh+K9JhEd0cfHxV38q3eR0F1Pwn/FGhBovoW9i095OPzRPyTfFkzyFe1Y1gmggD0eUIoxaU68cgrVzlb2M5ta4Qm4yxVOhvmqWmWPGNoc3aOVu14B9r5tKyHPucKZHPAKZmDE/4FfP05vqO/HLUAAAAASUVORK5CYII=',
				tooltip: 'SayingTip',
				onclick: 'if (event.button == 0) {Saying.Copy();} else if (event.button == 1) {Saying.onLocationChange(true);}',
				//hidden: true,
				style: 'padding: 0px 2px'
			}));

			let xml = '\
				<menupopup id="Saying-popup">\
				<menuitem label="复制内容" id="Saying-Copy" oncommand="Saying.Copy();" />\
				<menuitem label="重新获取" id="Saying-Reload" oncommand="Saying.onLocationChange(true);"/>\
				<menuseparator id="Saying-sepalator0"/>\
				<menuitem label="Hitokoto" id="Saying-hitokoto" type="checkbox"  oncommand="Saying.setPerfs(\'hitokoto\')" />\
				<menuitem label="自定摘录" id="Saying-Saying" type="checkbox"  oncommand="Saying.setPerfs(\'Saying\')" />\
				<menuseparator id="Saying-sepalator1"/>\
				<menuitem label="脚本设置" id="Saying-Reload" oncommand="Saying.openPref();"/>\
				</menupopup>\
				<tooltip id="SayingTip" style="opacity: 0.8;color: brown;text-shadow:0 0 3px #CCC;background: rgba(255,255,255,0.6);padding-bottom:3px;border:1px solid #BBB;border-radius: 3px ;box-shadow:0 0 3px #444 ;">\
        		<label id="SayingPopupLabel" flex="1" />\
    			</tooltip>\
				';
			let range = document.createRange();
			range.selectNodeContents(document.getElementById("mainPopupSet"));
			range.collapse(false);
			range.insertNode(range.createContextualFragment(xml.replace(/\n|\t/g, "")));
			range.detach();

			$("SayingPopupLabel").addEventListener("click", function(e) {
				if (e.button == 0) {
					$("SayingTip").hidePopup();
				} else if (e.button == 2) {
					Saying.Copy();
					$("SayingTip").hidePopup();
				}
			}, false);

			$('urlbar-icons').appendChild($C('statusbarpanel', {
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

			$("Saying-hitokoto").setAttribute('checked', this.SayingType.match("hitokoto") ? true : false);
			$("Saying-Saying").setAttribute('checked', this.SayingType.match("Saying") ? true : false);
		},

		setPerfs: function(type, val) {
			if (this.SayingType.match(type))
				this.SayingType = this.SayingType.replace(type, '');
			else
				this.SayingType = this.SayingType + ',' + type;
			if (this.SayingType.length !== 0) {
				var arr = this.SayingType.split(','),
					newarr = [];
				for (var i = arr.length - 1; i >= 0; i--) {
					if (!arr[i] == '')
						newarr = newarr.concat(arr[i]);
				}
				this.SayingType = newarr.join(',');
			}
			this.prefs.setCharPref("SayingType", this.SayingType);
			$("Saying-" + type).setAttribute('checked', this.SayingType.match(type) ? true : false);
			this.onLocationChange(true);
		},

		/*****************************************************************************************/
		onLocationChange: function(forceRefresh) {
			if (forceRefresh)
				this.forceRefresh = true;

			var aLocation = this.currentURI;
			if (aLocation && aLocation.spec && !/about:blank/.test(aLocation.spec)) {
				this.lookup(aLocation.spec);
			}
		},

		resetState: function() {
			var label = $("SayingPopupLabel");
			if (label) {
				while (label.firstChild) {
					label.removeChild(label.firstChild);
				}
				label.appendChild(document.createTextNode(""));
			}
			try {
				$('Saying-statusbarpanel').label = "";
				$('Saying-icon').hidden = true;
			} catch (e) {}
		},

		/*****************************************************************************************/
		lookup: function(url) {
			this.resetState();
			if (this.SayingType.length == 0) return;

			var type = this.SayingType.split(",");
			type = type[Math.floor(Math.random() * type.length)];
			if (this.forceRefresh) {
				if (this.online)
					this.SayingOnLine(url, type);
				else
					this.SayingLocal(url, type);
				this.forceRefresh = false;
				return;
			}
			if (this.SayingHash[url])
				this.updateSaying(this.SayingHash[url]);

			if (!this.isReqHash[url]) {
				if (this.online)
					this.SayingOnLine(url, type);
				else
					this.SayingLocal(url, type);
			}
			this.isReqHash[url] = true;
		},

		SayingOnLine: function(url, type) {
			var self = Saying;
			if (type == 'Saying') {
				self.SayingLocal(url, 'Saying');
				var req = new XMLHttpRequest();
				req.open("GET", 'http://www.verycd.com/statics/title.saying', true);
				req.send(null);
				var onerror = function() {
					self.SayingLocal(url, 'Saying');
				};
				req.onerror = onerror;
				req.timeout = self.SayingLocal_Delay;
				req.ontimeout = onerror;
				req.onload = function() {
					if (req.status == 200) {
						var _VC_DocumentTitles, _VC_DocumentTitleIndex, val;
						eval(req.responseText);
						_VC_DocumentTitles.forEach(function(t) {
							self.Saying_json.push(t);
						})
						val = _VC_DocumentTitles[Math.floor(Math.random() * _VC_DocumentTitles.length)];
						self.SayingHash[url] = val;
						self.updateSaying(val);
					} else {
						onerror();
					}
				};
			}
			if (type == 'hitokoto') {
				var req = new XMLHttpRequest();
				req.open("GET", 'http://api.hitokoto.us/rand', true);
				req.send(null);
				var onerror = function() {
					self.SayingLocal(url, 'hitokoto');
				};
				req.onerror = onerror;
				req.timeout = self.SayingLocal_Delay;
				req.ontimeout = onerror;
				req.onload = function() {
					if (req.status == 200) {
						var isjson = typeof(req.responseText) == "object" && Object.prototype.toString.call(req.responseText).toLowerCase() == "[object object]" && !req.responseText.length;
						if (isjson) {
							var val;
							var responseObj = JSON.parse(req.responseText);
							self.hitokoto_json.push(responseObj);
							if (responseObj.source == "") {
								val = responseObj.hitokoto;
							} else if (responseObj.source.match("《")) {
								val = responseObj.hitokoto + '--' + responseObj.source;
							} else {
								val = responseObj.hitokoto + '--《' + responseObj.source + '》';
							}
							self.SayingHash[url] = val;
							self.updateSaying(val);
						} else
							onerror();
					} else
						onerror();
				};
			}
		},

		SayingLocal: function(url, type) {
			var localjson = "";
			if (this.Saying_json && type == 'Saying') {
				localjson = this.Saying_json[Math.floor(Math.random() * this.Saying_json.length)];
			}
			if (this.hitokoto_json && type == 'hitokoto') {
				localjson = this.hitokoto_json[Math.floor(Math.random() * this.hitokoto_json.length)];
				if (localjson) {
					if (localjson.source == "") {
						localjson = localjson.hitokoto;
					} else if (localjson.source.match("《")) {
						localjson = localjson.hitokoto + '--' + localjson.source;
					} else {
						localjson = localjson.hitokoto + '--《' + localjson.source + '》';
					}
				}
			}
			this.SayingHash[url] = localjson;
			this.updateSaying(localjson);
		},

		updateSaying: function(val) {
			if (!val) return this.resetState();
			try {
				$('Saying-icon').hidden = false;
				$('Saying-statusbarpanel').hidden = (this.ShowType === 0 ? false : true);
			} catch (e) {}

			if (this.ShowType === 1) {
				var popup = $("SayingTip");
				if (this.timer) clearTimeout(this.timer);
				if (typeof popup.openPopup != 'undefined') popup.openPopup($('Saying-icon'), "overlap", 0, 0, true, false);
				else popup.showPopup($('Saying-icon'), -1, -1, "popup", null, null);
				this.timer = setTimeout(function() {
					popup.hidePopup();
				}, this.AutoTipTime);
			}

			var label = $("SayingPopupLabel");
			if (label) {
				while (label.firstChild) {
					label.removeChild(label.firstChild);
				}
				label.appendChild(document.createTextNode(val));
			}

			if (this.SayingLong > 0 && val.length > this.SayingLong)
				val = val.substr(0, this.SayingLong) + '.....';
			try {
				$('Saying-statusbarpanel').label = val;
			} catch (e) {}

		},

		/*****************************************************************************************/
		copy: function() {
			Cc['@mozilla.org/widget/clipboardhelper;1']
				.createInstance(Ci.nsIClipboardHelper)
				.copyString($("SayingPopupLabel").textContent);
		},

		finsh: function(name) {
			var Path, data;
			if (name == 'hitokoto' || name == 'all') {
				var hitokotolibs = {};
				var hitokotoInfo = [];
				this.hitokoto_json.forEach(function(i) {
					if (!hitokotolibs[i.hitokoto]) {
						hitokotolibs[i.hitokoto] = true;
						hitokotoInfo.push(i);
					}
				});
				Path = this.hitokoto_Path;
				data = hitokotoInfo;
			}

			if (name == 'Saying' || name == 'all') {
				var infos = {};
				var newInfo = [];
				this.Saying_json.forEach(function(i) {
					if (!infos[i]) {
						infos[i] = true;
						newInfo.push(i);
					}
				});
				Path = this.Saying_Path;
				data = newInfo;
			}
			this.saveFile(this.getData(Path, true), JSON.stringify(data));
		},

		saveFile: function(file, data) {
			var suConverter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
			suConverter.charset = 'UTF-8';
			data = suConverter.ConvertFromUnicode(data);

			var foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
			foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);
			foStream.write(data, data.length);
			foStream.close();
		},

		loadFile: function(aFile) {
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

		alert: function(aString, aTitle) {
			Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "Saying", aString, false, "", null);
		},
	};
	/*****************************************************************************************/
	function log() {
		Application.console.log('[Saying] ' + Array.slice(arguments));
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
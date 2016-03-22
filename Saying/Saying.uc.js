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
// @version			1.5.0 	2016.03.22 17:00	逻辑修改，增加配置，外置配置;
// @version			1.4.3 	2015.05.17 13:00	Add FireFoxFan and Urlbar AutoTip;
// @version			1.4.2 	2015.04.18 10:00	Fix Online,Icon,Label;
// @version			1.4.1 	2015.04.10 19:00	修改图标机制。
// @version			1.4.0 	2015.03.29 19:00	修改机制。
// @version			1.3.0 	2015.03.09 19:00	Rebuild。
// @version			1.2.2 	2015.02.14 21:00	对VeryCD没办法，转为本地数据并合并到自定义数据里。选项调整。
// @version			1.2.1 	VeryCD网站原因，取消VeryCD在线获取。请下载Github上的VeryCD.json数据库
// @version			1.1 	增加地址栏文字长度设置，避免撑长地址栏。
// ==/UserScript==
location == "chrome://browser/content/browser.xul" && (function(CSS) {
	let {
		classes: Cc,
		interfaces: Ci,
		utils: Cu,
		results: Cr
	} = Components;
	if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");


	if (typeof window.Saying != 'undefined') {
		window.Saying.onDestroy();
		delete window.Saying;
	}

	var Saying = {
		SayingHash: {},
		isReqHash: {},
		DefaultSayingType: [],
		LibFile_ModifiedTime: {},
		Prefs: Services.prefs.getBranch("userChromeJS.Saying."),
		FireFoxVer: (parseInt(Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo).version.substr(0, 3) * 10, 10) / 10),
		get SetWindow() {
			return Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator).getMostRecentWindow("Saying:Preferences")
		},
		get ConfFile() {
			let aFile = FileUtils.getFile("UChrm", ["lib", '_Saying.js']);
			try {
				this.ConfFile_ModifiedTime = aFile.lastModifiedTime;
			} catch (e) {}
			delete this.ConfFile;
			return this.ConfFile = aFile;
		},
		get CurrentURI() {
			var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
			var topWindowOfType = windowMediator.getMostRecentWindow("navigator:browser");
			if (topWindowOfType)
				return topWindowOfType.document.getElementById("content").currentURI;
			return null;
		},
		progressListener: {
			QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener", "nsISupportsWeakReference"]),
			onLocationChange: function(aProgress, aRequest, aURI, aFlags) {
				Saying.onLocationChange(aURI);
			},
			onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {},
			onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
			onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) {},
			onSecurityChange: function(aWebProgress, aRequest, aState) {}
		},

		init: function() {
			this.CreatePopup(true);
			this.CreateIcon(true);
			this.Rebuild();
			this.Prefs.addObserver('', this.PrefObs, false);
			gBrowser.addProgressListener(Saying.progressListener);
			window.addEventListener("unload", function() {
				Saying.onDestroy();
			}, false);
		},

		onDestroy: function() {
			this.DefaultSayingType.forEach(type => {
				this.CheckDuplicate(type);
			});
			this.CreatePopup();
			this.CreateIcon();
			var win = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator).getMostRecentWindow("Saying:Preferences");
			if (win) win.close();
			this.Prefs.removeObserver('', this.PrefObs, false);
			gBrowser.removeProgressListener(Saying.progressListener);
			Services.appinfo.invalidateCachesOnRestart();
			Services.obs.notifyObservers(null, "startupcache-invalidate", "");
		},

		Rebuild: function(isAlert) {
			var data = this.LoadFile(this.ConfFile);
			var sandbox = new Cu.Sandbox(new XPCNativeWrapper(window));
			sandbox.Components = Components;
			sandbox.Cc = Cc;
			sandbox.Ci = Ci;
			sandbox.Cr = Cr;
			sandbox.Cu = Cu;
			sandbox.Services = Services;
			sandbox.locale = Services.prefs.getCharPref("general.useragent.locale");
			try {
				var lineFinder = new Error();
				Cu.evalInSandbox(data, sandbox, "1.8");
			} catch (e) {
				let line = e.lineNumber - lineFinder.lineNumber - 1;
				var errmsg = 'Error: ' + e + "\n请重新检查【" + this.ConfFile.leafName + "】文件第 " + line + " 行";
				log(errmsg);
				if (isAlert)
					alert(errmsg);
			}

			if (!!this.DefaultSayingType) {
				this.DefaultSayingType.forEach(type => {
					this.CheckDuplicate(type);
				});
			}
			this.SayingTypes = sandbox.SayingTypes || [];
			this.Lib_Saying = sandbox.SayingData || [];
			this.SayingTypes.Saying = {
				Name: 'Saying',
				Word: 'Saying',
				Source: 'Source'
			}
			this.DefaultSayingType = [];
			for (var i in this.SayingTypes) {
				var tps = this.SayingTypes[i];
				this.DefaultSayingType.push(i);
				if (!tps.ReadFunc) {
					(function(i) {
						Saying.SayingTypes[i].ReadFunc = function(req) {
							var res;
							try {
								res = JSON.parse(req);
							} catch (ex) {
								return null;
							}
							Saying.LibPush(i.toString(), res);
							return res;
						};
					})(i);
				} else {
					var funstr = tps.ReadFunc.toString().replace(/^function.*{|}$/g, "");
					(function(i, funstr) {
						Saying.SayingTypes[i].ReadFunc = Function("req", funstr);
					})(i, funstr);
				}

				if (!tps.ShowFunc) {
					(function(i, Word, Source) {
						Saying.SayingTypes[i].ShowFunc = function(res) {
							if (res[Source] == "")
								val = res[Word];
							else if (res[Source] && res[Source].match("《"))
								val = res[Word] + '--' + res[Source];
							else
								val = res[Word] + '--《' + res[Source] + '》';
							return val;
						};
					})(i, tps.Word, tps.Source);
				} else {
					var funstr = tps.ShowFunc.toString().replace(/^function.*{|}$/g, "");
					(function(i, funstr) {
						Saying.SayingTypes[i].ShowFunc = Function("res", funstr);
					})(i, funstr);
				}
			}

			this.DefaultSayingType.forEach(type => {
				if (type != 'Saying') {
					var data = this.LoadFile(this.GetLibFile(type));
					this["Lib_" + type] = [];
					try {
						this["Lib_" + type] = JSON.parse(data);
					} catch (ex) {}
				}
			})
			this.LoadSetting();
			if (isAlert) alert('重载完毕!');
		},

		/*****************************************************************************************/
		CreateIcon: function(isAlert) {
			var icon = $("Saying_icon");
			var statusbarpanel = $("Saying_statusbarpanel");
			if (icon) icon.parentNode.removeChild(icon);
			if (statusbarpanel) statusbarpanel.parentNode.removeChild(statusbarpanel);
			delete icon;
			delete statusbarpanel;
			if (!isAlert) return;
			this.icon = $C('image', {
				id: 'Saying_icon',
				context: 'Saying_Popup',
				src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADbklEQVQ4jTWKW0ybZQBA/8Rnn40PvhgfNIsajTHenozTZMZb9MlF4+XBYGam28wWXBySMfkCImxcZMKADGqhgVK0XAstLRRKaQcUKLRQWqAttD8t/bmW9uP44DzJeTpHOcjnz0kphZRSNLjj4rW7S+JsQ0C8fHNE6G0zQspjkZNSZB8+UuZE7jAlpNwXUkqhqMf5ah5SNx7jzC037xmSvNUa5+2GAN0Pov9n8kA6k2IptkWTN40jAUpS00Q+f4Q8PeHusJ9HP2vmyctdvFlu5ePGWT6snaS0x8P1xkGe+Lwa04iN33pcvFgX5JnyWZRtTRNoEdDW+aXdyRtXdDRMbGCJZLGu57BuSIyBY+pdO1ztmOXBtJ22PgvPFVl4vzOFEt8/FKe7a2zNOen1q4wnwZUE2+Z/WiJ5rFFwxU9Y3NplL70Ch8tcqrzPmbI5FFVdEcdLI0z7Anh2wbUNjugptk1Jf+gEvW+XuskYo5FDdnbWOEj6ON3zc6P8T54vNKNoc2aRXnCwmJEs7Erc21kGw3s4onk65lUM8yrf66dp9u4yE02T14LAJj+3/MPTP5pRVLtepNNx1rIwqx5gj+1hCKiMRY+od4Xp8ie5ZJiiqHcRdyLHxPIqairM/lGCL6rMKAGHWfi1fTypHMPrGRrdMX4fC9Mb0Ljc5qKkd4mS1iEK6ocxL2cwrRxT2jUOchvIonhGTGIgnKHFl6TSuU5xl5syk5vW6TiFTUOUdE1hMhr5qeIe3VMhrFtQcN/LnR4HAMpMf7todYW52DXPN21efm3txzAwStVQAKPDzfWKJi58fZHHHn8dUdPGSALEUIiXrnWyEIujRGx6oR+Y5FyFjfOVgzgmxkmpIVrtPjZjAabdDj658RdPnb/NHx1DGINZKkbWeOFaN6X9ARTNrhOhlQAfVFh495aZ7uYavFYDCXUNUIE9+kedjI/b+XvKT+1kku90Hp69YuCCbg4ladMJkNwZnOfVIjPN99rIL9g4TQfQNnyo3lEIumDVSV2vhx+My7xzs4dhX5iKXh+K9JhEd0cfHxV38q3eR0F1Pwn/FGhBovoW9i095OPzRPyTfFkzyFe1Y1gmggD0eUIoxaU68cgrVzlb2M5ta4Qm4yxVOhvmqWmWPGNoc3aOVu14B9r5tKyHPucKZHPAKZmDE/4FfP05vqO/HLUAAAAASUVORK5CYII=',
				tooltip: 'Saying_TipBox',
				class: "",
				onclick: 'if (event.button == 0) {Saying.CopyStr();} else if (event.button == 1) {Saying.onLocationChange(true);}'
			});

			var ins = $('urlbar-icons');
			if ($("star-button"))
				ins.insertBefore(this.icon, $("star-button"));
			else if ($("reader-mode-button"))
				ins.insertBefore(this.icon, $("reader-mode-button"));
			else
				ins.insertBefore(this.icon, ins.firstChild);

			this.statusbarpanel = $C('statusbarpanel', {
				id: 'Saying_statusbarpanel',
			});
			ins.insertBefore(this.statusbarpanel, ins.firstChild);
		},

		CreatePopup: function(enable) {
			var Popup = $("Saying_Popup");
			var TipBox = $("Saying_TipBox");
			if (Popup) Popup.parentNode.removeChild(Popup);
			if (TipBox) TipBox.parentNode.removeChild(TipBox);
			this.Popup = null;
			this.TipBox = null;
			delete Popup;
			delete TipBox;
			if (!enable) return;
			this.Popup = $C("menupopup", {
				id: "Saying_Popup",
				position: "bottomcenter topright",
				onpopupshowing: "Saying.PopupShowing(event);"
			});
			this.Popup.appendChild($C("menuitem", {
				id: "Saying_Copy",
				label: "复制内容",
				oncommand: "Saying.CopyStr();"
			}));
			this.Popup.appendChild($C("menuitem", {
				id: "Saying_Reload",
				label: "重新获取",
				oncommand: "Saying.onLocationChange(true);"
			}));
			$('mainPopupSet').appendChild(this.Popup);
			this.TipBox = $C("tooltip", {
				id: "Saying_TipBox"
			});
			this.TipLabel = $C("label", {
				id: "Saying_TipLabel",
				flex: 1
			});
			this.TipBox.appendChild(this.TipLabel);
			$('mainPopupSet').appendChild(this.TipBox);
			$("Saying_TipLabel").addEventListener("click", function(e) {
				if (e.button == 0) {
					$("Saying_TipBox").hidePopup();
				} else if (e.button == 2) {
					Saying.CopyStr();
					$("Saying_TipBox").hidePopup();
				}
			}, false);

			this.style = addStyle(CSS);
		},

		SectType: function(type, val) {
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
			this.Prefs.setCharPref("SayingType", this.SayingType);
			$("SayingType_" + type).setAttribute('checked', this.SayingType.match(type) ? true : false);
			this.onLocationChange(true);
		},

		PopupShowing: function(event) {
			if (event.target != Saying.Popup || event.target != event.currentTarget) return;
			var SayingType = Saying.DefaultSayingType;
			$$(".Saying_TypeItem").forEach(function(e) {
				e.parentNode.removeChild(e);
			});
			if (SayingType.length > 0) {
				Saying.Popup.appendChild($C("menuseparator", {
					id: "Saying_Sepalator0",
					class: "Saying_TypeItem"
				}));
				for (var i = 0; i < SayingType.length; i++) {
					if (!SayingType[i]) continue;
					var str = (SayingType[i] == 'Saying') ? "自定摘录" : SayingType[i];
					Saying.Popup.appendChild($C("menuitem", {
						id: "SayingType_" + SayingType[i],
						label: str,
						type: "checkbox",
						checked: Saying.SayingType.match(SayingType[i]) ? true : false,
						tooltiptext: "显示【" + str + "】的摘录",
						class: "Saying_TypeItem",
						onclick: "Saying.SectType('" + SayingType[i] + "');"
					}));
				}
			}
			Saying.Popup.appendChild($C("menuseparator", {
				id: "Saying_Sepalator1",
				class: "Saying_TypeItem"
			}));
			Saying.SetMenuitem = $C("menuitem", {
				id: "Saying_SetPref",
				label: "脚本设置",
				class: "Saying menuitem-iconic Saying_TypeItem",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYElEQVQ4jY3TO0/VQRAF8F9yTUB6QMCCZ6KJBq4JNIQKCkoopAWMsabhC1ho5SOYaO2j0AQ+gYKPS/BeaDD0kPhJLP7nbzZA0ElOsjvnzOzOziyX2yjO8Ds4i++/bRgdzAUdjFwVMIkNDASP8QuDwXF8Nb+RGHAdb3GC72jhIxZxLViMbx/fon2XWKv4inHcx6OaQH8A3eFWot3DmmT8jImipF48y21aeI6+gp9IzA+Ywmu0k7mBF9jBDKaxjZfhxqN9k1hULepgLI90gHvFic34BqJtR6tM0D6XYKrgJ/FT1ZFa+3cu7mALR6mtkf2n3KKZ9auihMPs79aPuIvbxYn9SbIfbOFGwd/CF1XbPVC1ZARL2XdFOIihrLuwjuVod/EQevBeNXmt1P8BC6ohamA+moNojqPpqa/UxCZuBk8iKkf5abihaMsuXbBh1UvPBm3/+EznbRSnqm9c49Lv/AcsoU6W+qo3pgAAAABJRU5ErkJggg==",
				onclick: "Saying.OpenPref(event);"
			});
			Saying.Popup.appendChild(Saying.SetMenuitem);
		},

		/*****************************************************************************************/
		PrefObs: function(subject, topic, data) {
			if (topic == 'nsPref:changed') {
				switch (data) {
					case 'SayingLong':
					case 'AutoTipTime':
					case 'Local_Delay':
					case 'FireFoxFanType':
					case 'SayingType':
					case 'ShowType':
					case 'UpdateJson':
					case 'Online':
						Saying.LoadSetting(data);
						break;
				}
			}
		},

		LoadSetting: function(type) {
			if (!type || type === "SayingType") {
				var SayingType = this.GetPrefs(2, "SayingType", '');
				if (this.SayingType != SayingType)
					this.SayingType = SayingType;
				if (type) this.onLocationChange(true);
			}

			if (!type || type === "Online") {
				this.Online = this.GetPrefs(0, "Online", true);
				if (type) this.onLocationChange(true);
			}

			if (!type || type === "ShowType") {
				this.ShowType = this.GetPrefs(1, "ShowType", 0);
				if (type) this.onLocationChange();
			}

			if (!type || type === "SayingLong") {
				this.SayingLong = this.GetPrefs(1, "SayingLong", 0);
				if (type) this.onLocationChange();
			}

			if (!type || type === "AutoTipTime")
				this.AutoTipTime = this.GetPrefs(1, "AutoTipTime", 2000);

			if (!type || type === "TipPos")
				this.TipPos = this.GetPrefs(2, "TipPos", "Saying_icon");

			if (!type || type === "Local_Delay")
				this.Local_Delay = this.GetPrefs(1, "Local_Delay", 2500);
		},

		/*****************************************************************************************/
		onLocationChange: function(forceRefresh) {
			if (typeof forceRefresh == 'boolean' && !!forceRefresh)
				this.forceRefresh = true;
			var aLocation = (forceRefresh && forceRefresh.spec) ? forceRefresh : this.CurrentURI;
			if (aLocation && aLocation.spec && !/^(about:blank)/.test(aLocation.spec)) {
				this.lookup(aLocation.spec);
			}
		},

		ResetState: function() {
			var label = $("SayingPopupLabel");
			if (label) {
				while (label.firstChild) {
					label.removeChild(label.firstChild);
				}
				label.appendChild(document.createTextNode(""));
			}
			this.icon.setAttribute("class", "")
			this.statusbarpanel.label = "";
		},

		/*****************************************************************************************/
		lookup: function(url) {
			this.ResetState();
			if (this.SayingType.length == 0) return;

			var type = this.SayingType.split(",");
			type = type[Math.floor(Math.random() * type.length)];

			if (this.forceRefresh) {
				if (this.Online)
					this.SayingOnLine(url, type);
				else
					this.SayingLocal(url, type);
				this.forceRefresh = false;
				return;
			}
			if (this.SayingHash[url])
				this.UpdateSaying(this.SayingHash[url]);

			if (!this.isReqHash[url]) {
				if (this.Online)
					this.SayingOnLine(url, type);
				else
					this.SayingLocal(url, type);
			}
			this.isReqHash[url] = true;
		},

		SayingOnLine: function(url, type) {
			var Cust = this.SayingTypes[type];
			if (type == 'Saying' || !Cust)
				return this.SayingLocal(url, type);
			this.XRequest({
				url: Cust.API
			}).then(request => {
				if (request.status === 200) {
					try {
						var val = Cust.ShowFunc(Cust.ReadFunc(request.responseText));
						this.SayingHash[url] = val;
						this.UpdateSaying(val);
					} catch (ex) {
						this.SayingLocal(url, type);
					}
				} else
					this.SayingLocal(url, type);
			}, error => {
				this.SayingLocal(url, type);
			});
		},

		SayingLocal: function(url, type) {
			var json = this["Lib_" + type];
			if (!json) return;
			var Rjson = json[Math.floor(Math.random() * json.length)];
			if (!Rjson) return;
			var val = this.SayingTypes[type].ShowFunc(Rjson);
			this.SayingHash[url] = val;
			this.UpdateSaying(val);
			if (type == 'Saying' && Rjson.CustFunc) {
				var funstr = Rjson.CustFunc.toString().replace(/^function.*{|}$/g, "");
				(Function("url", funstr))(url);
			}
		},

		UpdateSaying: function(val) {
			if (!val)
				return this.ResetState();

			if (this.TipBox && this.ShowType === 1) {
				this.icon.classList.remove("Saying_icon_Autohide");
				this.statusbarpanel.hidden = true;

				var Pos = $(this.TipPos) || $("Saying_icon") || this.icon;
				if (this.timer)
					clearTimeout(this.timer);
				if (typeof this.TipBox.openPopup != 'undefined')
					this.TipBox && this.TipBox.openPopup(Pos, "overlap", 0, 0, true, false);
				else
					this.TipBox.showPopup(Pos, -1, -1, "popup", null, null);
				this.timer = setTimeout(function() {
					Saying.TipBox.hidePopup();
				}, this.AutoTipTime);
			} else {
				this.icon.classList.add("Saying_icon_Autohide");
				this.statusbarpanel.hidden = false;
			}

			if (this.TipLabel) {
				while (this.TipLabel.firstChild) {
					this.TipLabel.removeChild(this.TipLabel.firstChild);
				}
				this.TipLabel.appendChild(document.createTextNode(val));
			}

			if (this.SayingLong > 0 && val.length > this.SayingLong)
				val = val.substr(0, this.SayingLong) + '.....';
			this.statusbarpanel.label = val;
		},

		LibPush: function(type, res) {
			this['Lib_' + type] = this['Lib_' + type] || [];
			this['Lib_' + type].push(res);
			return res;
		},

		/*****************************************************************************************/
		CheckDuplicate: function(type) {
			var Info = this["Lib_" + type];
			if (!Info || type == 'Saying') return;
			var obj = {};
			var newInfo = [];
			var leixing = Info[0];
			var key = this.SayingTypes[type].Word;
			Info.forEach(function(i) {
				switch (typeof i) {
					case 'object':
						if (!obj[i[key]]) {
							obj[i[key]] = true;
							newInfo.push(i);
						}
						break;
					case 'string':
						if (!obj[i]) {
							obj[i] = true;
							newInfo.push(i);
						}
						break;
					case 'undefined':
						break;
					default:
						break;
				}
			});
			this.StrToFile(type, newInfo);
		},

		GetLibFile: function(type) {
			let aFile = FileUtils.getFile("UChrm", ["lib", ('Saying_' + type + '.json')]);
			try {
				this.LibFile_ModifiedTime[type] = aFile.lastModifiedTime;
			} catch (e) {}
			delete this[type + '_lib'];
			return this[type + '_lib'] = aFile;
		},

		LoadFile: function(aFile, isAlert) {
			if (!aFile || !aFile.exists() || !aFile.isFile())
				return null;
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
			if (!data) {
				var errmsg = "Load :【" + aFile.leafName + "】文件无数据";
				log(errmsg);
				if (isAlert)
					alert(errmsg);
				return [];
			}
			return data;
		},

		StrToFile: function(type, data) {
			if (typeof data == 'object')
				data = JSON.stringify(data);
			var suConverter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
			suConverter.charset = 'UTF-8';
			data = suConverter.ConvertFromUnicode(data);
			var aFile = this.GetLibFile(type);
			var foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
			foStream.init(aFile, 0x02 | 0x08 | 0x20, 0664, 0);
			foStream.write(data, data.length);
			foStream.close();
		},

		GetPrefs: function(type, name, val) {
			switch (type) { //https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Preferences
				case 0:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_BOOL)
						this.Prefs.setBoolPref(name, val ? val : false);
					return this.Prefs.getBoolPref(name);
				case 1:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_INT)
						this.Prefs.setIntPref(name, val ? val : 0);
					return this.Prefs.getIntPref(name);
				case 2:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING)
						this.Prefs.setCharPref(name, val ? val : "");
					return this.Prefs.getCharPref(name);
				case 3:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING)
						this.Prefs.setComplexValue(name, Ci.nsILocalFile, makeURI(val).QueryInterface(Ci.nsIFileURL).file);
					return this.Prefs.getComplexValue(name, Ci.nsILocalFile);
				case 4:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING) {
						var aFile = Cc["@mozilla.org/pref-relativefile;1"].createInstance(Ci.nsIRelativeFilePref);
						aFile.relativeToKey = "UChrm";
						var path = Services.io.newFileURI(FileUtils.getDir("UChrm", '')).spec + val.replace(/^(\/\/|\\)/i, '').replace(/\\/ig, '/');
						aFile.file = makeURI(path).QueryInterface(Ci.nsIFileURL).file;
						this.Prefs.setComplexValue(name, Ci.nsIRelativeFilePref, aFile || this[name]);
					}
					return this.Prefs.getComplexValue(name, Ci.nsIRelativeFilePref).file;
				default:
					break;
			}
		},

		XRequest: function(obj) {
			return new Promise(function(resolve, reject) {
				var request = new XMLHttpRequest();
				request.open(obj.method || 'GET', obj.url, obj.async || true, obj.bstrUser || null, obj.bstrPassword || null);
				if (obj.responseType) //返回类型
					request.responseType = obj.responseType;
				request.timeout = obj.timeout || 3500; //延迟时间，毫秒
				request.ontimeout = onerror;
				if (obj.onreadystatechange)
					request.onreadystatechange = obj.onreadystatechange; //存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数。
				if (obj.overrideMimeType)
					request.overrideMimeType = obj.overrideMimeType; //覆盖发送给服务器的头部，强制 overrideMimeType 作为 mime-type。
				if (obj.setRequestHeader) { //自定义HTTP头部信息。需在open()方法之后和send()之前调用，才能成功发送请求头部信息。
					for (let [key, val] in Iterator(obj.setRequestHeader)) {
						request.setRequestHeader(key, val);
					}
				}
				request.onload = function() {
					resolve(request);
				};
				request.onerror = function(event) {
					reject(event);
				};
				request.send(obj.SendString || null); //将请求发送到服务器。参数string仅用于POST请求；对于GET请求的参数写在url后面，所以string参数传递null。
				if (obj.getResponseHeader && obj.getResponseHeader.length > 0) { //获取指定的相应头部信息
					if (obj.getResponseHeader[0] == "All")
						request.getAllResponseHeaders();
					else {
						var hdarry = [];
						obj.getResponseHeader.forEach(hd => {
							hdarry.push(request.getResponseHeader(hd));
						})
					}
				}
			});
		},

		CopyStr: function(str) {
			str = str || $("Saying_TipBox").textContent.replace(/ /ig, "") || this.icon.tooltipText.replace(/ /ig, "");
			if (!str) return;
			Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString(str);
			this.ShowStatus = "已复制: " + str;
		},

		ShowStatus: function(str, time) {
			XULBrowserWindow.statusTextField.label = '[Saying]' + str;
			setTimeout(function() {
				XULBrowserWindow.statusTextField.label = '';
			}, time || 1500)
		},

		OpenPref: function(event) {
			if (event.target != event.currentTarget) return;
			event.stopPropagation();
			event.preventDefault();
			switch (event.button) {
				case 0:
					var win = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator).getMostRecentWindow("Saying:Preferences");
					if (win)
						win.focus();
					else {
						window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + this.OptionWin(), '', 'chrome,titlebar,toolbar,centerscreen,dialog=no');
					}
					break;
				case 1:
					break;
				case 2:
					this.Rebuild(true);
					break;
			}
		},

		OptionWin: function() {
			let xul = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
				<prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
					id="Saying_Settings"\
					ignorekeys="true"\
					title="Saying 设置"\
					onload="opener.Saying.OptionScript.init();"\
					buttons="accept, cancel, extra1"\
					ondialogextra1="opener.Saying.OptionScript.reset();"\
					windowtype="Saying:Preferences">\
					<prefpane id="main" flex="1">\
						<preferences>\
							<preference id="TipPos" type="string" name="userChromeJS.Saying.TipPos"/>\
							<preference id="ShowType" type="int" name="userChromeJS.Saying.ShowType"/>\
							<preference id="SayingLong" type="int" name="userChromeJS.Saying.SayingLong"/>\
							<preference id="AutoTipTime" type="int" name="userChromeJS.Saying.AutoTipTime"/>\
							<preference id="Local_Delay" type="int" name="userChromeJS.Saying.Local_Delay"/>\
							<preference id="Online" type="bool" name="userChromeJS.Saying.Online"/>\
						</preferences>\
						<vbox>\
							<groupbox>\
							<caption label="显示类型" align="center"/>\
							<grid>\
							<columns>\
									<column/>\
									<column/>\
							</columns>\
							<rows>\
								<radiogroup id="ShowType" preference="ShowType">\
									<radio label="地址栏文字" id="ShowTypeU" value="0" oncommand="opener.Saying.OptionScript.Change();"/>\
									<row align="center">\
										<label value="文字长度："/>\
										<textbox id="SayingLong" type="number" preference="SayingLong" tooltiptext="地址栏文字长度（个数，包括标点符号），0则全部显示"/>\
									</row>\
									<radio label="自动弹出" id="AutoTip" value="1" oncommand="opener.Saying.OptionScript.Change();"/>\
									<row align="center">\
										<label value="显示时间："/>\
										<textbox id="AutoTipTime" type="number" preference="AutoTipTime"  tooltiptext="自动弹出文字文字的显示时间，毫秒"/>\
									</row>\
								</radiogroup>\
							</rows>\
							</grid>\
							</groupbox>\
							<groupbox>\
								<caption/>\
									<checkbox id="Onliner" label="在线查询，可能会影响脚本效率！" preference="Online" oncommand="opener.Saying.OptionScript.Change();"/>\
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
		}
	};

	Saying.OptionScript = {
		init: function() {
			this.Change();
		},

		reset: function() {
			_$("ShowType").value = 0;
			_$("SayingLong").value = 0;
			_$("AutoTipTime").value = 2000;
			_$("Local_Delay").value = 2500;
			_$("Online").value = false;
			this.Change();
		},

		Change: function() {
			_$("SayingLong").disabled = !_$("ShowTypeU").selected;
			_$("AutoTipTime").disabled = !_$("AutoTip").selected;
			_$("Local_Delay").disabled = !_$("Onliner").checked;
		},
	};

	/*****************************************************************************************/
	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}

	function log() {
		console.log('[Saying] ' + Array.slice(arguments));
	}

	function alert(aString, aTitle) {
		Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "Saying", aString, false, "", null);
	}

	function $$(exp, doc) {
		return Array.prototype.slice.call((doc || document).querySelectorAll(exp));
	}

	function _$(id) {
		return Saying.SetWindow.document.getElementById(id) || null;
	}

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	Saying.init();
	window.Saying = Saying;
})('\
#Saying-icon {\
    padding: 0px 2px;\
}\
#urlbar:hover #Saying_statusbarpanel,.Saying_icon_Autohide {\
    visibility: collapse;\
}\
#urlbar:hover .Saying_icon_Autohide,#Saying_statusbarpanel {\
    visibility: visible;\
}\
#Saying_statusbarpanel {\
    -moz-appearance: none;\
    padding: 0px 0px 0px 0px;\
    border: none;\
    border-top: none;\
    color: brown;\
    margin: 0 0 -1px 0;\
    border-bottom: none;\
}\
#Saying_TipBox {\
    opacity: 0.8;\
    color: brown;\
    text-shadow: 0 0 3px #CCC;\
    background: rgba(255,255,255,0.6);\
    padding-bottom: 3px;\
    border: 1px solid #BBB;\
    border-radius: 3px;\
    box-shadow: 0 0 3px #444;\
}\
'.replace(/\n|\t/g, ''));
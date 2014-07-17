// ==UserScript==
// @name            showFlagS.uc.js
// @description     显示国旗与IP
// @author          ywzhaiqi、feiruo
// @homepage       https://github.com/feiruo/userchromejs/
// @include         chrome://browser/content/browser.xul
// @charset         UTF-8
// @version         1.5.5
// @note            Begin 2013-12-16
// @note            左键点击复制，右键弹出菜单。需要 countryflags.js 数据文件
// @note            1.5.5 增加flagfox扩展国旗图标库，相对路径profile\chrome\lib\flagfoxflags下，直接存放图标,支持实时切换。
// @note            1.5 增加右键菜单外部配置，配置方式和anoBtn一样，具体请参考配置文件。
// @note            1.4 增加几个详细信息；服务器没给出的就不显示；去除图标大小调整，避免撑高，拉宽地址栏，请自行使用样式调整。
// @note            1.3 增加淘宝查询源，修复不显示图标，刷新、切换查询源时可能出现的图标提示消失等BUG
// @note            1.2.1 修复identity-box时page-proxy-favicon的问题
// @note            1.2 位置为identity-box时自动隐藏page-proxy-favicon，https显示
// @note            1.1 设置延迟，增加本地文件图标。
// ==/UserScript==

/**
 * 参考 Show Location 扩展、Flagfox 扩展、http://files.cnblogs.com/ziyunfei/showFlag.uc.js
 */

location == "chrome://browser/content/browser.xul" && (function() {

	// 显示国旗图标/IP位置 urlbar-icons	identity-box addon-bar status-bar 等等
	var showLocationPos = "identity-box";

	// 是否启用flagfox扩展国旗图标,perfs
	var isFlagFoxFlags = true;

	// flagfox扩展国旗图标库，相对路径： profile\chrome\lib\flagfoxflags  注意格式
	var flagFoxFlags = "/lib/flagfoxflags/";

	// 菜单配置文件，相对路径： profile\chrome\lib\_showFlagS.js
	var showFlagSitemFile = "lib\\_showFlagS.js";

	// 打开查询网站是否激活
	var TAB_ACTIVE = true;

	//毫秒,延迟时间，时间内未取得所选择查询源数据，就使用新浪查询源
	var Inquiry_Delay = 3500;

	// 本地国旗图标库，相对路径： profile\chrome\lib\countryflags.js
	var localFlagPath = "lib\\countryflags.js";

	// 备用国旗地址
	var BAK_FLAG_PATH = 'http://www.razerzone.com/asset/images/icons/flags/';
	// var BAK_FLAG_PATH = 'http://www.1108.hk/images/ext/';

	//是否使用备用图标(如果本地找不到则使用在线图标),perfs
	var NetSrc = true;

	//默认API，perfs
	var site = 'CZ';

	// 等待时国旗图标
	var DEFAULT_Flag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=";

	// 未知国旗图标
	var Unknown_Flag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVQ4jZWRMahScRjFL40REW9ojqaGhoaGprg0eL3//3fkj0pCDrYp2hARmRItjk4ND0EuSFMgSEQIiuMjEjdnwUGIvLdF+bxc/j6ut8X3eM9X7z3P+vE7nPMdw9gRgPdEdCSlPJRS3t+9Xyrbtp8A4FqtFmQyGQbARHRERAXLsg6uNADwMZ1O83q9jpbLZdjtdnW5XPa3Rksi+iqEeA7g5j8NFosFu64bRjuaz+dhu93WhULBB8AAXCll3TTNO6fweDx+qLWOwvACf06TySR0HCdQSjGAt2fjKwA8m83+6zCdTsNWqxXkcjkG4Nq2/ezUgIg+ZbNZ3mw25yDP88JOp6NLpdLJL/4AaAkhnu4+cFyv14MoiiJmjvr9vq5Wq34ikeBt7+8AXpimeevC8+Lx+D0APBgMdK/X08lk8gT6KaV8HYvF7l46nxDiJQD2PC+sVCo+Ef0A8ODK3c/0/5zP5/0gCCKlFBPRu2vD2/6/ms1mMBqNjgGwEOLxtWEhxCMAPBwOjx3H0UT02zCMG/vEf6OU4tVqFRWLRZ+IvuwVn4g+pFIpbjQawXbnV3sZWJZ1IKU8BDAhom+2bd/eh/8LEFU+M9Rx2boAAAAASUVORK5CYII=";

	//本地文件图标
	var File_Flag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACf0lEQVQ4jX3S3UtTYQDH8QP9GV31T0TXKmLFiBGjmlPLt6RSyZc0kFCLcqEhXRQSeBNaDXFqw7em29yc23Fbvswdt7mztzPn5Gnu5cyxF/t1ERw8LvrBc/d8PzwXD0VRFMVz7+b5w+Eiz40gFVAiyQ4h6VPixPsacfdLEKYfx3t9iG73sBF7Vzd1fiqV7FImOoLC6SzOCjHwx2P45X+DA3sv8hktzvJrwsnx8wg7Olnq4jLRERSyGhSyGgBFAEUENluwZ36B0/g0ijkdCtkfyPML4OxP8V/gLwL4LA3Y1vcgsjOAPL+AXGoW2ZMphGzt/wAOLwJFeEy12FrtRPhnH7InU8iQCaRj4wjSraVAOvJWiHOZGfw+48Ho78GhbUXQ1o10bBypyEckQqPwWx+VAqnwkBBnkyoU80dwrshgX3qIgLUdidAo4qwSxDOIkK0NPlPzBxGQCLwSYp58xmnSjJ1lKTbn74M1t4B4BnHMPMfRbgcOt57gYL1R/Io4OyDEiegnkOB7bC1IYJ2T42CtXgg5exMIIfAa68UA8faJ4iOvEg7NdVjUt+HRVYOzNyFM1yG4IQchBJ61B2Igtt8rijlnP2xzlTBPSeDWyhDckCOwLoPfKAUhBG5DnRiIOrtEccDxDPRMBUzfqrC/LIXfKAVrkIA1SKBY8mFfXyMGuO12UeyztoFWl8P0tQLMokSIWYMEVRO7YHQKMRB0PBbFHlMzaHU5jJNlJYDPcAvOFblXBPg2GrVuYy1cegVcuhq4dHWg1eUwTN6Ac1EGRl8DRqeAa7UazpW73h3tnY6Sz2T+Lru8qbnZQM9UzFqmy9KasWuWL8NXWwyqyisll8/tD6KEcRuPWHf/AAAAAElFTkSuQmCC";

	window.showFlagS = {
		dnsCache: [],
		isReqHash: [],
		isReqHash_tooltip: [],
		showFlagHash: [],
		showFlagTooltipHash: [],

		init: function() {
			var self = this;

			this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("userChromeJS.showFlagS.");
			this._prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

			if (!this._prefs.prefHasUserValue("SourceSite")) {
				this._prefs.setCharPref("SourceSite", site);
			} else {
				site = this._prefs.getCharPref("SourceSite");
			}

			if (!this._prefs.prefHasUserValue("NetSrc")) {
				this._prefs.setIntPref("NetSrc", NetSrc);
			} else {
				NetSrc = this._prefs.getIntPref("NetSrc");
			}

			if (!this._prefs.prefHasUserValue("isFlagFoxFlags")) {
				this._prefs.setIntPref("isFlagFoxFlags", isFlagFoxFlags);
			} else {
				isFlagFoxFlags = this._prefs.getIntPref("isFlagFoxFlags");
			}

			this.importLib();
			this.addIcon();
			this.reloadShowFlagSitem();
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
				self.onDestroy();
			}, false);
		},
		onDestroy: function() {
			window.getBrowser().removeProgressListener(this.progressListener);
		},
		importLib: function() {
			localFlagPath = localFlagPath.replace(/\//g, '\\');
			var fullPath = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties)
				.get("UChrm", Ci.nsILocalFile).path;
			if (/^(\\)/.test(localFlagPath)) {
				fullPath = fullPath + localFlagPath;
			} else {
				fullPath = fullPath + "\\" + localFlagPath;
			}

			var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
			file.initWithPath(fullPath);
			if (file.exists()) {
				userChrome.import(localFlagPath, "UChrm");
			}
		},
		addIcon: function() {
			var self = this;

			if (showLocationPos == 'identity-box' || showLocationPos == 'urlbar-icons') {
				this.icon = $(showLocationPos).appendChild($C('image', {
					id: 'showFlagS-icon',
					context: 'showFlagS-popup'
				}));
			} else {
				this.icon = $(showLocationPos).appendChild($C("statusbarpanel", {
					id: "showFlagS-icon",
					class: "statusbarpanel-iconic",
					context: "showFlagS-popup",
				}));
			}

			if (showLocationPos == "identity-box") {
				this.icon.style.marginLeft = "4px";
				this.icon.style.marginRight = "2px";
			}
			this.icon.style.width = "16px";

			this.icon.src = DEFAULT_Flag;

			// 点击复制
			this.icon.addEventListener("click", function(event) {
				if (event.button == 0) {
					showFlagS.copy();
				} else if (event.button == 1) {
					showFlagS.onLocationChange(true);
				}
			}, false);
		},
		reloadShowFlagSitem: function(isAlert) {
			var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
			aFile.appendRelativePath(showFlagSitemFile);
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
			if (!data) return;
			var sandbox = new Cu.Sandbox(new XPCNativeWrapper(window));
			sandbox.Components = Components;
			sandbox.Cc = Cc;
			sandbox.Ci = Ci;
			sandbox.Cr = Cr;
			sandbox.Cu = Cu;
			sandbox.Services = Services;
			sandbox.locale = Services.prefs.getCharPref("general.useragent.locale");
			try {
				Cu.evalInSandbox(data, sandbox, "1.8");
			} catch (e) {
				this.alert('Error: ' + e + '\n请重新检查配置文件');
				return;
			}
			try {
				var obj = this.showFlagS[i];
				$("main-menubar").insertBefore($(obj.id), $("main-menubar").childNodes[7]);
			} catch (e) {}
			try {
				$("mainPopupSet").removeChild($("showFlagS-popup"));
			} catch (e) {}
			this.showFlagSitem = sandbox.showFlagSitem;
			this.buildMenupopup();
			if (isAlert) this.alert('配置已经重新载入');
		},
		buildMenupopup: function() {
			var popup = $C('menupopup', {
				id: 'showFlagS-popup',
				position: 'at_pointer'
			});

			popup.appendChild($C('menuitem', {
				label: "复制信息",
				oncommand: "showFlagS.copy();"
			}));

			popup.appendChild($C('menuitem', {
				label: "刷新信息",
				oncommand: "showFlagS.onLocationChange(true);"
			}))

			popup.appendChild($C('menuseparator'));

			var obj, menuitem;
			for (var i = 0; i < this.showFlagSitem.length; i++) {
				obj = this.showFlagSitem[i];
				menuitem = $(obj.id);
				if (menuitem) {
					for (let [key, val] in Iterator(obj)) {
						if (typeof val == "function") obj[key] = val = "(" + val.toSource() + ").call(this, event);";
						menuitem.setAttribute(key, val);
					}
					menuitem.classList.add("showFlagS");
					menuitem.classList.add("menu-iconic");
				} else {
					menuitem = obj.child ? this.newMenu(obj) : this.newMenuitem(obj);
				}
				popup.appendChild(menuitem);
			}

			popup.appendChild($C('menuseparator', {
				id: "flagsSetLookCZ-menuseparator"
			}));

			var twmenu = popup.appendChild($C('menu', {
				id: "showFlagS-Select",
				label: "查询源选择",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAABlElEQVQ4jaXUSWtUQRQF4M9hYTuEuDAmGl0Yp0QkcQBFRFEXQhB3ATf+gKziwrU/wr8RcK04EY04JuBSQXQRhziEhEDAdDe6qKqkuuiHAQsOvHte3Vv3nlPvwRLqaKCZofEP/jOGxKCJb5jJ8BW/2/BfYs4sjokVv+MS9mU4gze4XPCn8BE/UoFmPG2/1rULkzhc8F14167AwWJjbywwUPDdeL+WDnoqOthRdtCIwTCOZLiIaVwt+PP4lBeoC2q/xpMML7EgCJnzLwTrW1yYxdnYdsJxvIon5vwgPrTT4EAxa3Khv+C7qkT8bxf6io09eIpDBd/WhZ8YEW5ZwhW8xbWCHxau9Jyg04oLz/EQjyKeYV5QPecfC+LeT90lF05ie4aBmHw6xp3Zu050YEOuQenCbqsurENNxVqLCxtxC6PYWVWgdKFbq403BL2m4vNerE8a/MJ1XMgwEjeni3RU+G8sYgK3cQ7+RNSxnKEeE9LXuAl3cQfbsBVb4B4eVGAce7KxxnCz1KCGzRWopTnj6seJPPkvhrmYqehLVdcAAAAASUVORK5CYII=",
				class: "showFlagS menu-iconic"
			}));

			var twpopup = twmenu.appendChild(document.createElement("menupopup"));

			twpopup.appendChild($C('menuitem', {
				label: "纯真 查询源",
				id: "flagsSetLookCZ",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","CZ");'
			}));

			twpopup.appendChild($C('menuitem', {
				label: "MyIP 查询源",
				id: "flagsSetLookMyip",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","myip");'
			}));

			twpopup.appendChild($C('menuitem', {
				label: "纯真2 查询源",
				id: "flagsSetLookCZedu",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","CZedu");'
			}));

			twpopup.appendChild($C('menuitem', {
				label: "新浪 查询源",
				id: "flagsSetLookSina",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","sina");'
			}));

			twpopup.appendChild($C('menuitem', {
				label: "淘宝 查询源",
				id: "flagsSetLookTaobao",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","taobao");'
			}));

			twpopup.appendChild($C('menuseparator', {
				id: "flagsNetSrc-menuseparator"
			}));

			twpopup.appendChild($C('menuitem', {
				label: "在线图标",
				id: "flagsNetSrc",
				type: "checkbox",
				oncommand: 'showFlagS.flagsStyle("NetSrc");'
			}));

			twpopup.appendChild($C('menuitem', {
				label: "FlagFox扩展图标",
				id: "useflagFoxFlag",
				type: "checkbox",
				oncommand: 'showFlagS.flagsStyle("isFlagFoxFlags");'
			}));

			popup.appendChild($C('menuitem', {
				label: "菜单配置",
				id: "showFlagSitemFile",
				tooltiptext: "左键：重载配置\n右键：编辑配置",
				onclick: "if(event.button == 0){showFlagS.reloadShowFlagSitem(true);}else if (event.button == 2) {showFlagS.editFile();}"
			}));

			$('mainPopupSet').appendChild(popup);

			if (site == "myip")
				$("flagsSetLookMyip").setAttribute('checked', true);
			else if (site == "CZ")
				$("flagsSetLookCZ").setAttribute('checked', true);
			else if (site == "CZedu")
				$("flagsSetLookCZedu").setAttribute('checked', true);
			else if (site == "sina")
				$("flagsSetLookSina").setAttribute('checked', true);
			else if (site == "taobao")
				$("flagsSetLookTaobao").setAttribute('checked', true);
			if (NetSrc)
				$("flagsNetSrc").setAttribute('checked', (($("flagsNetSrc").value != NetSrc) ? true : false));
			else
				$("flagsNetSrc").setAttribute('checked', (($("flagsNetSrc").value != NetSrc) ? false : true));
			if (isFlagFoxFlags)
				$("useflagFoxFlag").setAttribute('checked', (($("useflagFoxFlag").value != NetSrc) ? true : false));
			else
				$("useflagFoxFlag").setAttribute('checked', (($("useflagFoxFlag").value != NetSrc) ? false : true));
		},
		newMenu: function(menuObj) {
			var menu = document.createElement("menu");
			var popup = menu.appendChild(document.createElement("menupopup"));
			for (let [key, val] in Iterator(menuObj)) {
				if (key === "child") continue;
				if (typeof val == "function") menuObj[key] = val = "(" + val.toSource() + ").call(this, event);"
				menu.setAttribute(key, val);
			}

			menuObj.child.forEach(function(obj) {
				popup.appendChild(this.newMenuitem(obj));
			}, this);
			let cls = menu.classList;
			cls.add("showFlagS");
			cls.add("menu-iconic");
			return menu;
		},
		newMenuitem: function(obj) {
			var menuitem;
			if (obj.label === "separator" || (!obj.label && !obj.text && !obj.oncommand && !obj.command))
				menuitem = document.createElement("menuseparator");
			else
				menuitem = document.createElement("menuitem");

			for (let [key, val] in Iterator(obj)) {
				if (typeof val == "function") obj[key] = val = "(" + val.toSource() + ").call(this, event);";
				menuitem.setAttribute(key, val);
			}
			var cls = menuitem.classList;
			cls.add("showFlagS");
			cls.add("menuitem-iconic");

			if (obj.oncommand || obj.command) return menuitem;

			if (obj.exec) {
				obj.exec = this.handleRelativePath(obj.exec);
			}

			menuitem.setAttribute("oncommand", "showFlagS.onCommand(event);");
			this.setIcon(menuitem, obj);
			return menuitem;
		},
		setIcon: function(menu, obj) {
			if (menu.hasAttribute("src") || menu.hasAttribute("image") || menu.hasAttribute("icon")) return;

			if (obj.exec) {
				var aFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
				try {
					aFile.initWithPath(obj.exec);
				} catch (e) {
					return;
				}
				if (!aFile.exists()) {
					menu.setAttribute("disabled", "true");
				} else {
					let fileURL = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler).getURLSpecFromFile(aFile);
					menu.setAttribute("image", "moz-icon://" + fileURL + "?size=16");
				}
				return;
			}
		},

		onCommand: function(event) {
			var menuitem = event.target;
			var text = menuitem.getAttribute("text") || "";
			var exec = menuitem.getAttribute("exec") || "";
			if (exec) this.exec(exec, this.convertText(text));
		},

		convertText: function(text) {
			text = text.toLocaleLowerCase().replace("%u", content.location.href);
			return text;
		},

		exec: function(path, arg) {
			var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
			var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
			try {
				var a = (typeof arg == 'string' || arg instanceof String) ? arg.split(/\s+/) : [arg];
				file.initWithPath(path);

				if (!file.exists()) {
					Cu.reportError('File Not Found: ' + path);
					return;
				}

				if (file.isExecutable()) {
					process.init(file);
					process.run(false, a, a.length);
				} else {
					file.launch();
				}

			} catch (e) {
				log(e);
			}
		},

		handleRelativePath: function(path) {
			if (path) {
				path = path.replace(/\//g, '\\').toLocaleLowerCase();
				var profD = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get("ProfD", Ci.nsILocalFile);
				if (/^(\\)/.test(path)) {
					if (path.startsWith('\\..\\')) {
						return profD.parent.path + path.replace('\\..', '');
					}
					return profD.path + path;
				} else {
					return path;
				}
			}
		},
		editFile: function() {
			var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
			aFile.appendRelativePath(showFlagSitemFile);
			if (!aFile || !aFile.exists() || !aFile.isFile()) return;
			var editor;
			try {
				editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
			} catch (e) {
				this.alert("请设置编辑器的路径。\nview_source.editor.path");
				toOpenWindowByType('pref:pref', 'about:config?filter=view_source.editor.path');
				return;
			}
			var UI = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
			UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0 ? "gbk" : "UTF-8";
			var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);

			try {
				var path = UI.ConvertFromUnicode(aFile.path);
				var args = [path];
				process.init(editor);
				process.run(false, args, args.length);
			} catch (e) {
				this.alert("编辑器不正确！")
			}
		},
		flagsStyle: function(val) {
			if (val == "NetSrc") {
				if (NetSrc)
					NetSrc = false;
				else
					NetSrc = true;
				this._prefs.setIntPref("NetSrc", NetSrc);
			} else if (val == "isFlagFoxFlags") {
				if (isFlagFoxFlags)
					isFlagFoxFlags = false;
				else
					isFlagFoxFlags = true;
				this._prefs.setIntPref("isFlagFoxFlags", isFlagFoxFlags);
			}
		},
		copy: function(str) {
			str || (str = this.icon.tooltipText)

			Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper)
				.copyString(str);
		},
		open: function(url, type) {
			var host = this.contentDoc.location.host,
				ip = this.dnsCache[host];

			if (type == 'host') {
				url += host;
			} else if (type == 'ip' && ip) {
				url += ip
			}

			var tab = gBrowser.addTab(url);
			if (TAB_ACTIVE) {
				gBrowser.selectedTab = tab;
			}
		},
		onLocationChange: function(forceRefresh) {
			if (forceRefresh) {
				this.forceRefresh = true;
			}

			try {
				var aLocation = this.contentDoc.location;
				if (showLocationPos == 'identity-box') {
					if ((aLocation.protocol !== "about:") && (aLocation.protocol !== "chrome:"))
						$('page-proxy-favicon').style.visibility = 'collapse';
					else
						$('page-proxy-favicon').style.visibility = 'visible';
					this.icon.hidden = ((aLocation.protocol == "about:") || (aLocation.protocol == "chrome:"));
				}
				if (aLocation && aLocation.host && /tp/.test(aLocation.protocol)) {
					this.updateState(aLocation.host);
				} else if (aLocation && /file/.test(aLocation.protocol)) {
					this.icon.src = File_Flag;
					this.icon.tooltipText = '本地文件' + "\n" + aLocation;
				} else {
					this.resetState();
				}
			} catch (e) {
				this.resetState();
			}
		},
		updateState: function(host) {
			if (!this.forceRefresh && this.dnsCache[host]) {
				this.lookupIP(this.dnsCache[host], host);
				return;
			}

			var self = this;
			var dns_listener = {
				onLookupComplete: function(request, nsrecord, status) {
					var s_ip; //server ip
					if (status != 0 || !nsrecord.hasMore())
						s_ip = "0";
					else
						s_ip = nsrecord.getNextAddrAsString();
					self.dnsCache[host] = s_ip;
					self.lookupIP(s_ip, host);
				}
			};
			try {
				this.dns.asyncResolve(host, 0, dns_listener, this.eventqueue);
			} catch (e) {}

			// 提前重置，防止 DNS 查找很久而造成的图标延迟
			this.resetState();
		},
		resetState: function() {
			this.icon.src = DEFAULT_Flag;
			this.icon.tooltipText = '';
			if (showLocationPos == 'identity-box') {
				this.icon.hidden = true;
				$('page-proxy-favicon').style.visibility = 'visible';
			}
		},
		lookupIP: function(ip, host) {
			if (ip == "0") {
				this.resetState();
				return;
			}

			var self = this;

			if (ip == "set") {
				site = host;
				this._prefs.setCharPref("SourceSite", site);
				return;
			}

			var func = self['lookupIP_' + site];

			var flagFunc = function(checkCache) {
				if (checkCache && self.showFlagHash[host]) {
					self.updateIcon(host, self.showFlagHash[host]);
					return;
				}

				// 防止重复获取
				if (checkCache && self.isReqHash[host]) return;
				self.isReqHash[host] = true;
				if (site == 'myip' || site == 'taobao')
					return;
				else
					self.lookupIP_taobao(ip, host);
			};

			var tooltipFunc = function(checkCache) {
				if (checkCache && self.showFlagTooltipHash[host]) {
					self.updateTooltipText(ip, host, self.showFlagTooltipHash[host]);
					return;
				}

				// 防止重复获取
				if (checkCache && self.isReqHash_tooltip[host]) return;
				self.isReqHash_tooltip[host] = true;
				func(ip, host);
			};

			flagFunc(!this.forceRefresh);
			tooltipFunc(!this.forceRefresh);
			this.forceRefresh = false;
		},
		lookupIP_taobao: function(ip, host, other) {
			var self = showFlagS;

			var req = new XMLHttpRequest();
			req.open("GET", 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.icon.src = Unknown_Flag;
				if (other || site == 'taobao')
					self.icon.tooltipText = '无法查询，请刷新！';
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var responseObj = JSON.parse(req.responseText);
					if (responseObj.code == 0) {
						var country_id = responseObj.data.country_id.toLocaleLowerCase();
						var addr = responseObj.data.country + responseObj.data.area + '\n' + responseObj.data.region + responseObj.data.city + responseObj.data.county + responseObj.data.isp;
						var obj = {
							taobao: addr
						};
						if (other || site == 'taobao') {
							self.showFlagTooltipHash[host] = obj;
							self.updateTooltipText(ip, host, obj);
						}
						self.showFlagHash[host] = country_id;
						self.updateIcon(host, country_id, responseObj.data.country);
					} else {
						onerror();
					}
				}
			};
		},
		lookupIP_CZ: function(ip, host) {
			var self = showFlagS;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://www.cz88.net/ip/index.aspx?ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var s_local, myip, myAddr;

					var addr_pos = req.responseText.indexOf("AddrMessage");
					s_local = req.responseText.substring(addr_pos + 13);
					s_local = s_local.substring(0, s_local.indexOf("<"));

					var myip_pos = req.responseText.indexOf("cz_ip");
					myip = req.responseText.substring(myip_pos + 7);
					myip = myip.substring(0, myip.indexOf("<"));

					var myAddr_pos = req.responseText.indexOf("cz_addr");
					myAddr = req.responseText.substring(myAddr_pos + 9);
					myAddr = myAddr.substring(0, myAddr.indexOf("<"));

					s_local = s_local.replace(/ +CZ88.NET ?/g, "");

					var obj = {
						CZ: s_local
					};
					if (s_local) {
						if (myip) obj.myip = myip;
						if (myAddr) obj.myAddr = myAddr;

						self.showFlagTooltipHash[host] = obj;
						self.updateTooltipText(ip, host, obj);
					} else {
						onerror();
					}
				} else {
					onerror();
				}
			};
		},
		lookupIP_CZedu: function(ip, host) {
			var self = showFlagS;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://phyxt8.bu.edu/iptool/qqwry.php?ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var s_local;
					s_local = req.responseText;
					s_local = s_local.replace(/ +CZ88.NET ?/g, "");

					var obj = {
						CZedu: s_local
					};
					if (s_local) {
						self.showFlagTooltipHash[host] = obj;
						self.updateTooltipText(ip, host, obj);
					} else {
						onerror();
					}
				} else {
					onerror();
				}
			};
		},
		lookupIP_myip: function(ip, host) {
			var req = new XMLHttpRequest();
			req.open("GET", 'http://www.myip.cn/' + ip, true);
			req.send(null);
			var self = showFlagS;
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var myip_addr, myip_flag;
					var addr_pos = req.responseText.indexOf("来自");
					myip_addr = req.responseText.substring(addr_pos + 4);
					myip_addr = myip_addr.substring(0, myip_addr.indexOf("."));
					if (myip_addr.indexOf("&nbsp;") !== -1)
						myip_addr = myip_addr.substring(0, myip_addr.indexOf("&nbsp;"));
					if (myip_addr.indexOf("<") !== -1)
						myip_addr = myip_addr.substring(0, myip_addr.indexOf("<"));
					if (myip_addr.indexOf("\r\n\t\t") !== -1)
						myip_addr = myip_addr.substring(0, myip_addr.indexOf("\r\n\t\t"));

					var myflag = req.responseText.indexOf("res_ipen_0");
					flagSrc = req.responseText.substring(myflag + 39);
					flagSrc = "http://www.myip.cn/" + flagSrc.substring(0, flagSrc.indexOf(">"));

					var obj = {
						myipS: myip_addr
					};

					self.showFlagHash[host] = flagSrc;
					self.updateIcon(host, flagSrc);

					self.showFlagTooltipHash[host] = obj;
					self.updateTooltipText(ip, host, obj);
				} else {
					onerror();
				}
			};
		},
		lookupIP_sina: function(ip, host) {
			var self = showFlagS;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var responseObj = JSON.parse(req.responseText);
					if (responseObj.ret == 1) {
						if (responseObj.isp !== '' || responseObj.type !== '' || responseObj.desc !== '')
							var addr = responseObj.country + responseObj.province + responseObj.city + responseObj.district + '\n' + responseObj.isp + responseObj.type + responseObj.desc;
						else
							var addr = responseObj.country + responseObj.province + responseObj.city + responseObj.district;
						var obj = {
							sina: addr
						};
						self.showFlagTooltipHash[host] = obj;
						self.updateTooltipText(ip, host, obj);
						return;
					} else {
						onerror();
					}
				}
			};
		},
		updateIcon: function(host, countryCode, countryName) {
			// 跳过后台获取的情况
			if (host == this.contentDoc.location.host) {
				this.icon.hidden = false;
				var aLocation = this.contentDoc.location;
				if (showLocationPos == 'identity-box') {
					if (aLocation.protocol !== 'https:')
						$('page-proxy-favicon').style.visibility = 'collapse';
					else
						$('page-proxy-favicon').style.visibility = 'visible';
				}
				var src;
				if (countryCode.indexOf('http://') == 0) {
					if (countryCode.indexOf('http://www.myip.cn/images/country_icons/') == 0)
						src = countryCode;
					else
						src = Unknown_Flag;
				} else if (countryCode === 'iana') {
					src = Unknown_Flag;
				} else {
					//  如果 countryCode 无法找到图标，再次用 countryName 查找					
					if (window.CountryFlags || isFlagFoxFlags) {
						if (isFlagFoxFlags)
							src = getFlagFoxIconPath(countryCode);
						else
							src = CountryFlags[countryCode];
						if (!src && countryName) {
							contryCode = window.CountryNames && CountryNames[countryName];
							if (contryCode in CountryFlags) {
								src = CountryFlags[contryCode];
								this.showFlagHash[host] = contryCode;
							}
						}
					} else if (NetSrc) {
						src = src || (BAK_FLAG_PATH + countryCode + ".gif");
					} else {
						src = Unknown_Flag;
					}

					src = src;
				}
				this.icon.src = src;
			}
		},
		updateTooltipText: function(ip, host, obj) { // obj 为 sina 等获取到的数据
			// 跳过后台获取的情况
			if (host != this.contentDoc.location.host) return;

			obj || (obj = {});
			var tooltipArr = [];
			if (!obj.server) obj.server = this.contentDocServer;
			if (!obj.powered) obj.powered = this.powered;
			if (!obj.generator) obj.generator = this.generator;
			if (!obj.contentType) obj.contentType = this.contentType;
			tooltipArr.push("域名：" + host);
			tooltipArr.push("网站IP：" + ip);
			if (obj.contentType !== '未知类型') {
				tooltipArr.push("网站编码：" + obj.contentType);
			}
			if (obj.server !== '未知类型') {
				tooltipArr.push("服务器：" + obj.server);
			}
			if (obj.powered !== '未知类型') {
				tooltipArr.push("网站语言：" + obj.powered);
			}
			if (obj.generator !== '未知类型') {
				tooltipArr.push("网站程序：" + obj.generator);
			}


			if (obj.taobao)
				tooltipArr.push(obj.taobao);

			if (obj.CZ) {
				tooltipArr.push(obj.CZ);
				tooltipArr.push('我的IP：' + obj.myip);
				tooltipArr.push('我的地址：' + obj.myAddr);
			}

			if (obj.CZedu)
				tooltipArr.push(obj.CZedu);

			if (obj.myipS)
				tooltipArr.push(obj.myipS);

			if (obj.sina)
				tooltipArr.push(obj.sina);

			this.icon.tooltipText = tooltipArr.join('\n');
		},
		alert: function(aString, aTitle) {
			Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "showFlagS", aString, false, "", null);
		},
		get contentDoc() {
			return window.content.document;
		},
		get contentDocServer() {
			var server;
			try {
				server = gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Ci.nsIHttpChannel).getResponseHeader("Server").split("\n", 1)[0];
			} catch (e) {}
			return server || '未知类型';
		},
		get powered() {
			var powered;
			try {
				powered = gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Ci.nsIHttpChannel).getResponseHeader("X-Powered-By").split("\n", 1)[0];
			} catch (e) {}
			return powered || '未知类型';
		},
		get generator() {
			var generator;
			try {
				generator = gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Ci.nsIHttpChannel).getResponseHeader("X-Generator").split("\n", 1)[0];
			} catch (e) {}
			return generator || '未知类型';
		},
		get contentType() {
			var contentType;
			try {
				contentType = gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Ci.nsIHttpChannel).getResponseHeader("Content-Type").split("\n", 1)[0];
				if (contentType.match("=")) {
					contentType = contentType.replace(/text\/html; charset=/ig, "").toUpperCase();
				} else contentType = "未知类型";

			} catch (e) {}
			return contentType || '未知类型';
		},
		get dns() {
			return Cc["@mozilla.org/network/dns-service;1"]
				.getService(Components.interfaces.nsIDNSService);
		},
		get eventqueue() {
			return Cc["@mozilla.org/thread-manager;1"].getService().mainThread;
		},
	};

	showFlagS.init();

	function getFlagFoxIconPath(filename) {
		var Path = "file:///" + Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties).
		get('UChrm', Ci.nsILocalFile).path + flagFoxFlags;
		return Path + filename + ".png";
	}

	function log() {
		Application.console.log("[showFlagS] " + Array.slice(arguments));
	}

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

})()
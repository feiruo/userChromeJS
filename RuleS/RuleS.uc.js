// ==UserScript==
// @name 			RulesS.uc.js
// @description		简单规则
// @author			feiruo
// @compatibility	Firefox 16
// @charset			UTF-8
// @include			chrome://browser/content/browser.xul
// @id 				[8E7644D6]
// @startup         window.RuleSimple.init();
// @shutdown        window.RuleSimple.onDestroy(true);
// @homepageURL		https://github.com/feiruo/userChromeJS/tree/master/RuleS
// @note            目前只支持简单的切换规则
// @note            规则外置，支持重载
// @version         0.1 		Begin 2014-08-25
// ==/UserScript==
location == "chrome://browser/content/browser.xul" && (function() {

	if (!window.RuleSimple) {
		window.RuleSimple = {
			init: function() {
				for (var i = 0; i < userChrome_js.scripts.length; i++) {
					if (userChrome_js.scripts[i].id == '[8E7644D6]' || userChrome_js.scripts[i].description == '简单规则') {
						var name = userChrome_js.scripts[i].filename;
						var dir = userChrome_js.scripts[i].dir;
						if (dir == 'root')
							dir = FileUtils.getFile("UChrm", [name]).path;
						else
							dir = FileUtils.getFile("UChrm", [dir, name]).path;
					}
				}
				userChrome.import(dir);
			},
			onDestroy: function(isAlert) {
				window.RuleS.resetState();
				window.RuleS.removeMenu();
				$("RuleS-icon").parentNode.removeChild($("RuleS-icon"));
				$("RuleS-popup").parentNode.removeChild($("RuleS-popup"));
				window.getBrowser().removeProgressListener(window.RuleS.progressListener);
				delete window.RuleS;
				Services.obs.notifyObservers(null, "startupcache-invalidate", "");
			},
		};
		window.addEventListener("unload", function() {
			RuleSimple.onDestroy();
		}, false);
	}

	if (window.RuleS) window.RuleSimple.onDestroy();

	var RuleS = {
		debug: true,
		urlCheck: [],
		urlEnable: [],
		RuleStata: [],
		isRules: [],
		get contentDoc() {
			return window.content.document;
		},
	};

	RuleS.init = function() {
		this.addIcon();
		this.reload();
		this.onLocationChange();
		RuleS.progressListener = {
			onLocationChange: function() {
				RuleS.onLocationChange();
			},
			onProgressChange: function() {},
			onSecurityChange: function() {},
			onStateChange: function() {},
			onStatusChange: function() {}
		};
		window.getBrowser().addProgressListener(RuleS.progressListener);
	};

	RuleS.addIcon = function(iconPref) {
		this.icon = $('urlbar-icons').appendChild($C('image', {
			id: 'RuleS-icon',
			context: 'RuleS-popup',
			src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAYAAACZZ43PAAABZklEQVQ4jaXUMUscURQF4C8bYS0CkoCiRaoUFhYhbbqtUwppUthpmgQUEbQXJATSCEtI/kEgv8HOPm5lSiGNxo2LS1iSdS3mJIyzO9Xeauade869771zHyziEOe4wCcsGY+lYBfJPQxXG3/RxSWG+ICZEnkma8PkdMNpy08fq3iBHk7/qScWs9ZLzmo4XfiBAfawjd/oYL4kMI+TYNvJHYRrJ8o3abGPLTRKAg1sBhsmtxeuJl7iLOAuZicc4ixe4xq/sBbu/2hjhHeV6uV4HoEOHlXBFn7iCm8wV8Ef4kuKfHb3lsD9EPv4gyO8x3rEV3CAYzyb1N49PMGrJA1SbZTv42CPa7anhW/Yx3L+19PFUbrq4226vRNNfE21j3hQweeyvSvFObWqAgv4rriepzUdNhQ3NBILl6uvRf0aG+p9sKvwypnCO00mO3HTuBO31Dhx0iycGJ+FjppZmHoap34PpnqRbgGdL4gddwCpdgAAAABJRU5ErkJggg==",
		}));

		this.icon.addEventListener("click", function(event) {
			if (event.button == 0) {
				document.getElementById('RuleS-popup').openPopup(null, null, event.clientX, event.clientY);
			}
		}, false);

		let xml = '\
				<menupopup id="RuleS-popup">\
				<menuseparator hidden="true" id="RuleS-sepalator1"/>\
					<menuitem label="规则配置" id="RuleS-set-setMenu" tooltiptext="左键：重载配置\r\n右键：编辑配置" onclick="if(event.button == 0){RuleS.reload(true);}else if (event.button == 2) {RuleS.Edit();}" class="RuleS menuitem-iconic" image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYElEQVQ4jY3TO0/VQRAF8F9yTUB6QMCCZ6KJBq4JNIQKCkoopAWMsabhC1ho5SOYaO2j0AQ+gYKPS/BeaDD0kPhJLP7nbzZA0ElOsjvnzOzOziyX2yjO8Ds4i++/bRgdzAUdjFwVMIkNDASP8QuDwXF8Nb+RGHAdb3GC72jhIxZxLViMbx/fon2XWKv4inHcx6OaQH8A3eFWot3DmmT8jImipF48y21aeI6+gp9IzA+Ywmu0k7mBF9jBDKaxjZfhxqN9k1hULepgLI90gHvFic34BqJtR6tM0D6XYKrgJ/FT1ZFa+3cu7mALR6mtkf2n3KKZ9auihMPs79aPuIvbxYn9SbIfbOFGwd/CF1XbPVC1ZARL2XdFOIihrLuwjuVod/EQevBeNXmt1P8BC6ohamA+moNojqPpqa/UxCZuBk8iKkf5abihaMsuXbBh1UvPBm3/+EznbRSnqm9c49Lv/AcsoU6W+qo3pgAAAABJRU5ErkJggg=="/>\
				</menupopup>\
				';
		let range = document.createRange();
		range.selectNodeContents(document.getElementById("mainPopupSet"));
		range.collapse(false);
		range.insertNode(range.createContextualFragment(xml.replace(/\n|\t/g, "")));
		range.detach();
	};

	RuleS.reload = function(isAlert) {
		var aFile, data, libFile, libData, err, errMsg = [];
		aFile = Services.dirsvc.get('UChrm', Ci.nsILocalFile);
		aFile.appendRelativePath('lib');
		aFile.appendRelativePath('_RuleS.js');
		if (!aFile || !aFile.exists() || !aFile.isFile()) {
			if (isAlert) this.alert('配置文件不存在');
			return log('配置文件不存在');
		}
		this.configFile = aFile;
		data = this.loadFile(aFile);
		if (isAlert && (!data)) return this.alert('ReLoad Error: 配置文件错误');

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
			this.alert('ReLoad Error: ' + e + '\n请重新检查配置文件');
			return;
		}
		this.resetState();
		this.removeMenu();
		this.Rules = sandbox.Rules;

		this.buildPopup(this.Rules);
		this.onLocationChange();
		if (isAlert) this.alert('配置已经重新载入');
	};

	RuleS.removeMenu = function() {
		let menuitems = document.querySelectorAll("menuitem[id^='RuleS-item-']");
		if (!menuitems) return;
		for (let i = 0; i < menuitems.length; i++) {
			menuitems[i].parentNode.removeChild(menuitems[i]);
		}
	};

	RuleS.buildPopup = function(menu) {
		var popup = $("RuleS-popup");
		var obj, menuitem;
		for (var i = 0; i < menu.length; i++) {
			this.RuleStata[i] = false;
			this.isRules[i] = menu[i].isRules || true;
			obj = menu[i];
			if (obj.label === "separator" || (!obj.label && !obj.ctype && !obj.url && !obj.cval))
				menuitem = document.createElement("menuseparator");
			else
				menuitem = document.createElement("menuitem");

			menuitem.setAttribute("label", obj.label);
			menuitem.setAttribute("id", "RuleS-item-" + i);
			menuitem.setAttribute("type", "checkbox");
			menuitem.setAttribute("class", "RuleS-item");
			menuitem.setAttribute('checked', this.isRules[i]);
			menuitem.setAttribute("oncommand", "RuleS.toggle('" + i + "');");
			popup.insertBefore(menuitem, $("RuleS-sepalator1"));
			$("RuleS-sepalator1").hidden = false;
		}
	};

	RuleS.toggle = function(i) {
		if (i == 0 || i) {
			this.resetState();
			this.isRules[i] = !this.isRules[i];
			$("RuleS-item-" + i).setAttribute('checked', this.isRules[i]);
		}
		this.onLocationChange();
	};

	RuleS.Edit = function() {
		var aFile = this.configFile;
		if (!aFile || !aFile.exists() || !aFile.isFile()) return this.alert('配置文件不存在');
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
	};
	/*****************************************************************************************/
	RuleS.onLocationChange = function() {
		if (this.Rules) {
			var contentUrl = this.contentDoc.URL;
			if (!this.urlCheck[contentUrl]) {
				this.urlCheck[contentUrl] = true;
				this.urlEnable[contentUrl] = [];
				for (var i = 0; i < this.Rules.length; i++) {
					for (var j = 0; j < this.Rules[i].url.length; j++) {
						if (new RegExp(this.Rules[i].url[j]).test(contentUrl)) {
							this.urlEnable[contentUrl].push(i);
						}
					}
				}
			}
			this.changeRuleState(this.urlEnable[contentUrl]);
		}
	};

	RuleS.changeRuleState = function(list) {
		if (list && list.length !== 0) {
			for (var i = 0; i < list.length; i++) {
				var n = list[i];
				if (!this.RuleStata[n]) {
					this.docommand(n);
					this.RuleStata[n] = true;
				}
				for (var j = 0; j < this.RuleStata.length; j++) {
					if (j !== n && this.RuleStata[j]) {
						this.docommand(j);
						this.RuleStata[j] = false;
					}
				}
			}
		} else
			this.resetState();
	};

	RuleS.resetState = function() {
		for (var i = 0; i < this.RuleStata.length; i++) {
			if (this.RuleStata[i]) {
				this.docommand(i);
				this.RuleStata[i] = false;
			}
		}
	};

	RuleS.docommand = function(i) {
		if ((i == 0 || i) && this.isRules[i]) {
			var ctype = this.Rules[i].ctype,
				cval = this.Rules[i].cval;
			if (ctype == 'id')
				$(cval).click();
			else if (ctype == 'command')
				cval();
			else if (ctype == 'label')
				document.querySelectorAll("menuitem[label^='" + cval + "']")[0].click();
		}
	};
	/*****************************************************************************************/
	RuleS.alert = function(aString, aTitle) {
		Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "RuleS", aString, false, "", null);
	};

	RuleS.loadFile = function(aFile) {
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

	function log(str) {
		if (RuleS.debug) Application.console.log("[RuleS] " + Array.slice(arguments));
	}

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	RuleS.init();
	window.RuleS = RuleS;
})()
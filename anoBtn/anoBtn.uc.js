// ==UserScript==
// @name				AnotherButton
// @description			可移动的按钮菜单
// @author				feiruo
// @compatibility 		Firefox 8.0
// @charset 			UTF-8
// @include				main
// @id 					[A26C02CA]
// @startup        		window.anobtnS.init();
// @shutdown       		window.anobtnS.onDestroy(true);
// @reviewURL			http://bbs.kafan.cn/thread-1657589-1-1.html
// @homepageURL	 		https://github.com/feiruo/userChromeJS/tree/master/anoBtn
// @note         	  	支持菜单和脚本设置重载
// @note          		需要 _anoBtn.js 配置文件
// @version		 		1.3.3	2015.02.18 22:00	调整代码。
// @version		 		1.3.2	2015.02.13 23:00	Fix exec。
// @version		 		1.3.1	2014.09.18 19:00	Fix Path indexof '\\' or '//'。
// @version		 		1.3.0	2014.08.12 19:00	支持多级菜单，不限制菜单级数。
// @version		 		1.2.1
// @version 			1.2 	修复按钮移动之后重载残留问题，增加菜单弹出位置选择。
// @version 			1.1 	解决编辑器中文路径问题，修改菜单，提示等文字。
// @version 			1.0
// ==/UserScript==
(function() {

	if (!window.anobtnS) {
		window.anobtnS = {
			init: function() {
				if (!this.dirs) {
					for (var i = 0; i < userChrome_js.scripts.length; i++) {
						if (userChrome_js.scripts[i].id == '[A26C02CA]' || userChrome_js.scripts[i].description == '可移动的按钮菜单') {
							this.dirs = userChrome_js.scripts[i].file.path;
							break;
						}
					}
				}
				userChrome.import(this.dirs);
			},
			onDestroy: function(isAlert) {
				try {
					window.anobtn.unint(isAlert);
				} catch (e) {
					log(e);
				}
				delete window.anobtn;
				Services.obs.notifyObservers(null, "startupcache-invalidate", "");
			},
		};
		window.addEventListener("unload", function() {
			anobtnS.onDestroy();
		}, false);
	}

	if (window.anobtn) window.anobtnS.onDestroy();


	window.anobtn = {
		get file() {
			let aFile;
			aFile = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
			aFile.appendRelativePath("lib");
			aFile.appendRelativePath("_anoBtn.js");
			delete this.file;
			return this.file = aFile;
		},

		init: function() {
			var ins;
			ins = $("devToolsSeparator");
			ins.parentNode.insertBefore($C("menuitem", {
				id: "anobtn_set",
				label: "AnotherButton",
				tooltiptext: "左键：重载配置\n右键：编辑配置",
				oncommand: "setTimeout(function(){ anobtn.reload(true); }, 10);",
				class: "menuitem-iconic",
				onclick: "if (event.button == 2) { event.preventDefault(); closeMenus(event.currentTarget);anobtn.edit(anobtn.file); }",
			}), ins);
			this.reload();
			this.reload();//再次重载以解决某些不能的问题
		},

		reload: function(isAlert) {
			var aFile = this.file;
			var data = this.loadFile(this.file);
			if (!aFile || !aFile.exists() || !aFile.isFile() || !data) return this.alert('Load Error: 配置文件不存在');

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
				this.alert('Error: ' + e + "\n请重新检查配置文件第 " + line + " 行");
				return;
			}
			try {
				this.unint();
			} catch (e) {}
			this.anomenu = sandbox.anomenu;
			this.anobtnset = sandbox.anobtnset;
			this.makebtn();
			if (isAlert) this.alert('配置已经重新载入');
		},

		unint: function(real) {
			for (var i = 0; i < this.anomenu.length; i++) {
				var obj = this.anomenu[i];
				if (obj.id && !obj.clone)
					$("main-menubar").insertBefore($(obj.id), $("main-menubar").childNodes[7]);
			}
			$("anobtn").removeChild($("anobtn_popup"));
			$("anobtn").parentNode.removeChild($("anobtn"));
			if (real) {
				$("anobtn_set").parentNode.removeChild($("anobtn_set"));
			}
		},

		makebtn: function() {
			var iconInTag = this.anobtnset.intags ? this.anobtnset.intags : "tabbrowser-tabs";
			var iconImage = this.anobtnset.image ? this.anobtnset.image : "chrome://branding/content/icon32.png";
			var intags = $(iconInTag);
			var orientation = this.anobtnset.orientation ? this.anobtnset.orientation : 'before';
			var anoButton = $C("toolbarbutton", {
				id: "anobtn",
				label: "AnoBtn",
				class: "toolbarbutton-1 chromeclass-toolbar-additional",
				type: "menu",
				removable: "true",
				image: iconImage,
			});

			$('anobtn_set').setAttribute('image', iconImage);

			if (orientation == 'before')
				intags.parentNode.insertBefore(anoButton, intags);
			else if (orientation == 'after') {
				var parentEl = intags.parentNode;
				if (parentEl.lastChild == intags) {
					parentEl.appendChild(anoButton);
				} else {
					parentEl.insertBefore(anoButton, intags.nextSibling);
				}
			}

			var popup = document.createElement("menupopup");
			popup.setAttribute("id", "anobtn_popup");
			popup.setAttribute('position', this.anobtnset.position);

			this.anomenu.forEach(function(obj) {
				popup.appendChild(this.newMenuitem(obj));
			}, this);

			anoButton.appendChild(popup);
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
			cls.add("anobtn");
			cls.add("menu-iconic");
			return menu;
		},

		newMenuitem: function(obj) {
			var menuitem;
			if (obj.id && (menuitem = $(obj.id))) {
				menuitem = obj.clone ? menuitem.cloneNode(true) : menuitem;
				for (let [key, val] in Iterator(obj)) {
					if (typeof val == "function") obj[key] = val = "(" + val.toSource() + ").call(this, event);";
					menuitem.setAttribute(key, val);
				}

				let type = menuitem.nodeName,
					cls = menuitem.classList;
				if (type == 'menuitem' || type == 'menu' && (!cls.contains(type + '-iconic')))
					cls.add(type + '-iconic');

				return menuitem;
			}

			if (obj.child) return this.newMenu(obj);

			if (obj.label === "separator" || (!obj.label && !obj.image && !obj.text && !obj.url && !obj.oncommand && !obj.command))
				menuitem = document.createElement("menuseparator");
			else if (obj.oncommand || obj.command) {
				let org = obj.command ? document.getElementById(obj.command) : null;
				if (org && org.localName === "menuseparator") {
					menuitem = document.createElement("menuseparator");
				} else {
					menuitem = document.createElement("menuitem");
					if (obj.command)
						menuitem.setAttribute("command", obj.command);
					if (!obj.label)
						obj.label = obj.command || obj.oncommand;
				}
			} else {
				menuitem = document.createElement("menuitem");

				if (!obj.label)
					obj.label = obj.exec || obj.url || obj.text;

				if (obj.exec) {
					obj.exec = this.handleRelativePath(obj.exec);
				}
			}

			for (let [key, val] in Iterator(obj)) {
				if (key === "command") continue;
				if (typeof val == "function")
					obj[key] = val = "(" + val.toSource() + ").call(this, event);";
				menuitem.setAttribute(key, val);
			}
			var cls = menuitem.classList;
			cls.add("anobtn");
			cls.add("menuitem-iconic");

			if (menuitem.localName == "menuseparator")
				return menuitem;

			if (!obj.onclick)
				menuitem.setAttribute("onclick", "checkForMiddleClick(this, event)");

			if (obj.oncommand || obj.command)
				return menuitem;

			menuitem.setAttribute("oncommand", "anobtn.onCommand(event);");

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
				var a;
				if (typeof arg == 'string' || arg instanceof String) {
					a = arg.split(/\s+/)
				} else if (Array.isArray(arg)) {
					a = arg;
				} else {
					a = [arg];
				}

				file.initWithPath(path);
				if (!file.exists()) {
					Cu.reportError('File Not Found: ' + path);
					return;
				}

				if (file.isExecutable()) {
					process.init(file);
					process.runw(false, a, a.length);
				} else {
					file.launch();
				}
			} catch (e) {
				this.log(e);
			}
		},

		handleRelativePath: function(path) {
			if (path) {
				path = path.replace(/\//g, '\\').toLocaleLowerCase();
				var ffdir = Cc['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile).path;
				if (/^(\\)/.test(path)) {
					return ffdir + path;
				} else {
					return path;
				}
			}
		},

		alert: function(aString, aTitle) {
			Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "Another Button", aString, false, "", null);
		},

		edit: function(aFile) {
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
	}
	window.anobtn.init()

	function $(id) {
		return document.getElementById(id);
	}

	function log() {
		Application.console.log("[Another Button] " + Array.slice(arguments));
	}

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
})();
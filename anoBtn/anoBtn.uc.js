// ==UserScript==
// @name			AnotherButton
// @description		可移动的按钮菜单
// @author	        feiruo
// @charset       	UTF-8
// @include			main
// @id              [A26C02CA]
// @inspect         window.anoBtn
// @startup         window.anoBtn.init();
// @shutdown        window.anoBtn.onDestroy();
// @config 			window.anoBtn.edit(anoBtn.file);
// @reviewURL		http://bbs.kafan.cn/thread-1657589-1-1.html
// @homepageURL		https://github.com/feiruo/userChromeJS/tree/master/anoBtn
// @downloadURL		https://github.com/feiruo/userChromeJS/raw/master/anoBtn/anoBtn.uc.js
// @note			支持菜单和脚本设置重载
// @note			需要 _anoBtn.js 配置文件
// @version			1.3.5 	2015.04.25 	10:00	为可移动菜单。
// @version			1.3.4 	2015.03.27 	09:00	调整代码。
// @version			1.3.3 	2015.02.18 	22:00	调整代码。
// @version			1.3.2 	2015.02.13 	23:00	Fix exec。
// @version			1.3.1 	2014.09.18 	19:00	Fix Path indexof '\\' or '//'。
// @version			1.3.0 	2014.08.12 	19:00	支持多级菜单，不限制菜单级数。
// @version			1.2.1
// @version			1.2 	修复按钮移动之后重载残留问题，增加菜单弹出位置选择。
// @version			1.1 	解决编辑器中文路径问题，修改菜单，提示等文字。
// @version			1.0
// ==/UserScript==
(function(CSS) {
	let {
		classes: Cc,
		interfaces: Ci,
		utils: Cu,
		results: Cr
	} = Components;
	if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");

	if (window.anoBtn) {
		window.anoBtn.onDestroy();
		delete window.anoBtn;
	}

	window.anoBtn = {
		get file() {
			let aFile;
			aFile = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
			aFile.appendRelativePath("lib");
			aFile.appendRelativePath("_anoBtn.js");
			delete this.file;
			return this.file = aFile;
		},

		init: function() {
			var ins = $("menu_ToolsPopup").firstChild;
			ins.parentNode.insertBefore($C("menuitem", {
				id: "anoBtn_set",
				label: "AnotherButton",
				tooltiptext: "左键：重载配置\n右键：编辑配置",
				oncommand: "anoBtn.rebuild(true);",
				class: "menuitem-iconic",
				onclick: "if (event.button == 2) { event.preventDefault(); closeMenus(event.currentTarget);anoBtn.Edit(anoBtn.file); }",
			}), ins);

			this.rebuild();
			this.rebuild(); //again for webDeveloperMenu

			window.addEventListener("unload", function() {
				anoBtn.onDestroy();
			}, false);
		},

		onDestroy: function() {
			this.RemoveByID();
			this.SetBtn();
			this.SetPopup();
			if ($("anoBtn_set"))
				$("anoBtn_set").parentNode.removeChild($("anoBtn_set"));
			Services.obs.notifyObservers(null, "startupcache-invalidate", "");
		},

		RemoveByID: function() {
			if (this.anomenu) {
				for (var i = 0; i < this.anomenu.length; i++) {
					var obj = this.anomenu[i];
					if (obj.id && !obj.clone)
						$("main-menubar").insertBefore($(obj.id), $("main-menubar").childNodes[7]);
				}
			}
		},

		rebuild: function(isAlert) {
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
			this.RemoveByID();
			this.anomenu = sandbox.anomenu;
			this.anobtnset = sandbox.anobtnset;
			this.SetBtn(true);
			this.SetPopup(true);
			if (isAlert) this.alert('配置已经重新载入');
		},

		SetBtn: function(isAlert) {
			var icon = $("anoBtn_Icon");
			if (icon) icon.parentNode.removeChild(icon);
			delete icon;
			if (!isAlert) return;
			var iconInTag = this.anobtnset.intags ? this.anobtnset.intags : "tabbrowser-tabs";
			var iconImage = this.anobtnset.image ? this.anobtnset.image : "chrome://branding/content/icon16.png";
			var intags = $(iconInTag);
			var orientation = this.anobtnset.orientation ? this.anobtnset.orientation : 'before';
			var IconType = 'toolbarbutton',
				IconClass = 'toolbarbutton-1 chromeclass-toolbar-additional';
			if (this.anobtnset.IconSstatusBarPanel) {
				IconType = 'statusbarpanel';
				IconClass = 'statusbarpanel-iconic';
			}
			this.icon = $C(IconType, {
				id: "anoBtn_Icon",
				label: "AnoBtn",
				type: "menu",
				class: IconClass,
				removable: "true",
				image: iconImage,
			});
			$('anoBtn_set').setAttribute('image', iconImage);

			if (this.anobtnset.Icon_Pos == 0)
				ToolbarManager.addWidget(window, this.icon, true);
			else if (this.anobtnset.Icon_Pos == 1)
				$('urlbar-icons').appendChild(this.icon);
			else {
				if (orientation == 'before')
					intags.parentNode.insertBefore(this.icon, intags);
				else if (orientation == 'after') {
					var parentEl = intags.parentNode;
					if (parentEl.lastChild == intags) {
						parentEl.appendChild(this.icon);
					} else {
						parentEl.insertBefore(this.icon, intags.nextSibling);
					}
				}
			}

			this.style = addStyle(CSS);
		},

		SetPopup: function(isAlert) {
			var popup = $("anoBtn_popup");
			if (popup) popup.parentNode.removeChild(popup);
			delete popup;
			if (!isAlert || !this.anomenu) return;

			var popup = $C("menupopup", {
				id: "anoBtn_popup",
				position: this.anobtnset.position,
			});

			this.anomenu.forEach(function(obj) {
				popup.appendChild(this.newMenuitem(obj));
			}, this);

			this.icon.appendChild(popup);
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
			cls.add("anoBtn");
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
			cls.add("anoBtn");
			cls.add("menuitem-iconic");

			if (menuitem.localName == "menuseparator")
				return menuitem;

			if (!obj.onclick)
				menuitem.setAttribute("onclick", "checkForMiddleClick(this, event)");

			if (obj.oncommand || obj.command)
				return menuitem;

			menuitem.setAttribute("oncommand", "anoBtn.onCommand(event);");

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
			text = text.toLocaleLowerCase().replace("%u", gBrowser.currentURI.spec);
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

		openScriptInScratchpad: function(parentWindow, file) {
			let spWin = (parentWindow.Scratchpad || Services.wm.getMostRecentWindow("navigator:browser").Scratchpad)
				.openScratchpad();

			spWin.addEventListener("load", function spWinLoaded() {
				spWin.removeEventListener("load", spWinLoaded, false);

				let Scratchpad = spWin.Scratchpad;
				Scratchpad.setFilename(file.path);
				Scratchpad.addObserver({
					onReady: function() {
						Scratchpad.removeObserver(this);
						Scratchpad.importFromFile.call(Scratchpad, file);
					}
				});
			}, false);
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

		Edit: function(aFile, aLineNumber) {
			if (!aFile)
				aFile = this.file;

			if (typeof(aFile) == "string") {
				var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
				var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
				aFile = file.initWithPath(aFile);
			}

			if (!aFile || !aFile.exists() || !aFile.isFile())
				return alert("文件不存在:\n" + aFile.path);

			var editor;
			try {
				editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
			} catch (e) {
				alert("请先设置编辑器的路径!!!\nview_source.editor.path");
			}

			if (!editor || !editor.exists()) {
				this.openScriptInScratchpad(window, aFile);
				return;
			}
			var aURL = userChrome.getURLSpecFromFile(aFile);
			var aDocument = null;
			var aCallBack = null;
			var aPageDescriptor = null;
			if (/aLineNumber/.test(gViewSourceUtils.openInExternalEditor.toSource()))
				gViewSourceUtils.openInExternalEditor(aURL, aPageDescriptor, aDocument, aLineNumber, aCallBack);
			else
				gViewSourceUtils.openInExternalEditor(aURL, aPageDescriptor, aDocument, aCallBack);
		},

		loadFile: function(aFile) {
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
	};
	// 来自 User Agent Overrider 扩展
	const ToolbarManager = (function() {

		/**
		 * Remember the button position.
		 * This function Modity from addon-sdk file lib/sdk/widget.js, and
		 * function BrowserWindow.prototype._insertNodeInToolbar
		 */
		let layoutWidget = function(document, button, isFirstRun) {

			// Add to the customization palette
			let toolbox = document.getElementById('navigator-toolbox');
			toolbox.palette.appendChild(button);

			// Search for widget toolbar by reading toolbar's currentset attribute
			let container = null;
			let toolbars = document.getElementsByTagName('toolbar');
			let id = button.getAttribute('id');
			for (let i = 0; i < toolbars.length; i += 1) {
				let toolbar = toolbars[i];
				if (toolbar.getAttribute('currentset').indexOf(id) !== -1) {
					container = toolbar;
				}
			}

			// if widget isn't in any toolbar, default add it next to searchbar
			if (!container) {
				if (isFirstRun) {
					container = document.getElementById('nav-bar');
				} else {
					return;
				}
			}

			// Now retrieve a reference to the next toolbar item
			// by reading currentset attribute on the toolbar
			let nextNode = null;
			let currentSet = container.getAttribute('currentset');
			let ids = (currentSet === '__empty') ? [] : currentSet.split(',');
			let idx = ids.indexOf(id);
			if (idx !== -1) {
				for (let i = idx; i < ids.length; i += 1) {
					nextNode = document.getElementById(ids[i]);
					if (nextNode) {
						break;
					}
				}
			}

			// Finally insert our widget in the right toolbar and in the right position
			container.insertItem(id, nextNode, null, false);

			// Update DOM in order to save position
			// in this toolbar. But only do this the first time we add it to the toolbar
			if (ids.indexOf(id) === -1) {
				container.setAttribute('currentset', container.currentSet);
				document.persist(container.id, 'currentset');
			}
		};

		let addWidget = function(window, widget, isFirstRun) {
			try {
				layoutWidget(window.document, widget, isFirstRun);
			} catch (error) {
				console.log(error);
			}
		};

		let removeWidget = function(window, widgetId) {
			try {
				let widget = window.document.getElementById(widgetId);
				widget.parentNode.removeChild(widget);
			} catch (error) {
				console.log(error);
			}
		};

		let exports = {
			addWidget: addWidget,
			removeWidget: removeWidget,
		};
		return exports;
	})();

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

	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}

	anoBtn.init();
	window.anoBtn = anoBtn;
})('\
#anoBtn_Icon dropmarker {\
    display: none;\
}\
'.replace(/\n|\t/g, ''));
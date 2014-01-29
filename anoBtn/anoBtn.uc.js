// ==UserScript==
// @name		 anoBtn.uc.js
// @description	 AnotherButton
// @homepage	 https://github.com/feiruo/userchromejs/
// @author		 feiruo
// @include		 main
// @charset 	 utf-8
// @version		 1.2
// @note 		 超感谢 ywzhaiqi  
// @note 		 按钮菜单，外置配置文件.......
// @note 		 1.2修复按钮移动之后重载残留问题，增加菜单弹出位置选择。
// @note 		 1.1解决编辑器中文路径问题，修改菜单，提示等文字。
// @note 		 1.0
// ==/UserScript==
(function() {
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
				tooltiptext: "左键重载 ；右键编辑",
				oncommand: "setTimeout(function(){ anobtn.reload(true); }, 10);",
				onclick: "if (event.button == 2) { event.preventDefault(); closeMenus(event.currentTarget);anobtn.edit(anobtn.file); }",
			}), ins);
			this.reload();
		},

		reload: function(isAlert) {
			var aFile = this.file;
			var data = loadFile(this.file);
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
				Cu.evalInSandbox(data, sandbox, "1.8");
			} catch (e) {
				this.alert('Error: ' + e + '\n请重新检查配置文件');
				return;
			}
			try {
				this.unint();
			} catch (e) {}
			this.anomenu = sandbox.anomenu;
			this.anobtnset = sandbox.anobtnset;
			this.makebtn();
			$("anobtn").appendChild(this.makepopup());
			if (isAlert) this.alert('配置已经重新载入');
		},

		makebtn: function() {
			var intags;
			intags = $(this.anobtnset.intags);
			intags.parentNode.insertBefore($C("toolbarbutton", {
				id: "anobtn",
				label: "AnoBtn",
				class: "toolbarbutton-1 chromeclass-toolbar-additional",
				type: "menu",
				removable: "true",
				image: this.anobtnset.image,
			}), intags);
		},

		makepopup: function() {
			var popup = document.createElement("menupopup");
			popup.setAttribute("id", "anobtn_popup");
			popup.setAttribute('position', this.anobtnset.position);
			var obj, menuitem;
			for (var i = 0; i < this.anomenu.length; i++) {
				obj = this.anomenu[i];
				menuitem = $(obj.id);
				if (menuitem) {
					for (let[key, val] in Iterator(obj)) {
						if (typeof val == "function") obj[key] = val = "(" + val.toSource() + ").call(this, event);";
						menuitem.setAttribute(key, val);
					}
					menuitem.classList.add("anobtn");
					menuitem.classList.add("menu-iconic");
				} else {
					menuitem = obj.child ? this.newMenu(obj) : this.newMenuitem(obj);
				}
				popup.appendChild(menuitem);
			}
			return popup;
		},

		unint: function() {
			for (var i = 0; i < this.anomenu.length; i++) {
				var obj = this.anomenu[i];
				try {
					$("main-menubar").insertBefore($(obj.id), $("main-menubar").childNodes[7]);
				} catch (e) {}
			}
			$("anobtn").removeChild($("anobtn_popup"));
			$("anobtn").parentNode.removeChild($("anobtn"));
		},

		newMenu: function(menuObj) {
			var menu = document.createElement("menu");
			var popup = menu.appendChild(document.createElement("menupopup"));
			for (let[key, val] in Iterator(menuObj)) {
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
			if (obj.label === "separator" || (!obj.label && !obj.text && !obj.oncommand && !obj.command)) {
				menuitem = document.createElement("menuseparator");
			} else {
				menuitem = document.createElement("menuitem");
			}

			for (let[key, val] in Iterator(obj)) {
				if (typeof val == "function") obj[key] = val = "(" + val.toSource() + ").call(this, event);";
				menuitem.setAttribute(key, val);
			}
			var cls = menuitem.classList;
			cls.add("anobtn");
			cls.add("menuitem-iconic");

			if (obj.oncommand || obj.command) return menuitem;

			if (obj.exec) {
				obj.exec = this.handleRelativePath(obj.exec);
			}

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

	function loadFile(aFile) {
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
	}
})();
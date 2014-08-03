// ==UserScript==
// @name			UserCSSLoader
// @description		和Stylish一样用来管理用户样式
// @note				Stylish みたいなもの
// @namespace		http://d.hatena.ne.jp/Griever/
// @author			Griever
// @note				==forked by iwo - Mozest.com==
// @note				CSS-Stylish管理器_火狐橙菜单+可拖动按钮版20130126，version 0.0.4.2，适用于Fx21+
// @note             转载请注明以下出处！
// @note             脚本主页@Mozest论坛 http://g.mozest.com/thread-43097-1-1
// @note				=============================================================
// @note             Thanks "build draggable Fx button" by 风飘零@a936468
// @note             thread http://blog.bitcp.com/archives/452
// @note				CSS-Stylish管理器_火狐橙菜单+扩展栏按钮版20130112，version 0.0.4.1，适用于Fx20+
// @include			main
// @license			MIT License
// @compatibility	Firefox 4
// @charset			UTF-8
// @version			0.0.4.2
// @note				0.0.4.1
// @note				version  0.0.4
// @note				0.0.4 Remove E4X
// @note				version 0.0.3.1
// @note				2012-9-1添加扩展栏按钮
// @note				CSSEntry クラスを作った
// @note				スタイルのテスト機能を作り直した
// @note				ファイルが削除された場合 rebuild 時に CSS を解除しメニューを消すようにした
// @note				uc で読み込まれた .uc.css の再読み込みに仮対応
// ==/UserScript==

/****** 使用方法 ******

在菜单“CSS-Stylish管理”菜单中：
左键点击各CSS项目，切换各项目的“应用与否”；
中键点击各CSS项目，也是切换各项目的“应用与否”，但不退出菜单，即可连续操作;
右键点击各CSS项目，则是调用编辑器对其进行编辑；

在about:config里修改 "view_source.editor.path" 以指定编辑器
在about:config里修改"UserCSSLoader.FOLDER" 指定存放文件夹

类似滚动条css的浏览器chrome样式，请改成以"xul-"为开头，或以".as.css"为结尾的文件名，才能正常载入
——以上Mozest论坛的牛君nightson针对以下日文说的
——虽不明，却觉厉

chrome フォルダに CSS フォルダが作成されるのでそこに .css をぶち込むだけ。
ファイル名が "xul-" で始まる物、".as.css" で終わる物は AGENT_SHEET で、それ以外は USER_SHEET で読み込む。
ファイルの内容はチェックしないので @namespace 忘れに注意。

メニューバーに CSS メニューが追加される
メニューを左クリックすると ON/OFF
          中クリックするとメニューを閉じずに ON/OFF
          右クリックするとエディタで開く

エディタは "view_source.editor.path" に指定されているものを使う
フォルダは "UserCSSLoader.FOLDER" にパスを入れれば変更可能

 **** 説明終わり ****/

(function() {

	let {
		classes: Cc,
		interfaces: Ci,
		utils: Cu,
		results: Cr
	} = Components;
	if (!window.Services)
		Cu.import("resource://gre/modules/Services.jsm");

	// 起動時に他の窓がある（２窓目の）場合は抜ける
	let list = Services.wm.getEnumerator("navigator:browser");
	let inIDOMUtils = Cc["@mozilla.org/inspector/dom-utils;1"].getService(Ci.inIDOMUtils);
	while (list.hasMoreElements()) {
		if (list.getNext() != window) return;
	}

	if (window.UCL) {
		window.UCL.destroy();
		delete window.UCL;
	}

	window.UCL = {
		USE_UC: "UC" in window,
		AGENT_SHEET: Ci.nsIStyleSheetService.AGENT_SHEET,
		USER_SHEET: Ci.nsIStyleSheetService.USER_SHEET,
		readCSS: {},
		UCLdisable: false,
		disabled_listTmp: {},
		get disabled_list() {
			let obj = [];
			try {
				obj = this.prefs.getComplexValue("disabled_list", Ci.nsISupportsString).data.split("|");
			} catch (e) {}
			delete this.disabled_list;
			return this.disabled_list = obj;
		},
		get prefs() {
			delete this.prefs;
			return this.prefs = Services.prefs.getBranch("UserCSSLoader.")
		},
		get styleSheetServices() {
			delete this.styleSheetServices;
			return this.styleSheetServices = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
		},
		get FOLDER() {
			let aFolder;
			try {
				// UserCSSLoader.FOLDER があればそれを使う
				let folderPath = this.prefs.getCharPref("FOLDER");
				aFolder = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile)
				aFolder.initWithPath(folderPath);
			} catch (e) {
				aFolder = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
				aFolder.appendRelativePath("CSS"); //指定用户css文件夹名称，若不存在会自动创建
			}
			if (!aFolder.exists() || !aFolder.isDirectory()) {
				aFolder.create(Ci.nsIFile.DIRECTORY_TYPE, 0664);
			}
			delete this.FOLDER;
			return this.FOLDER = aFolder;
		},
		getFocusedWindow: function() {
			let win = document.commandDispatcher.focusedWindow;
			if (!win || win == window) win = content;
			return win;
		},
		init: function() {
			//增加按钮
			var navBar = document.getElementById("TabsToolbar");
			if (!navBar) return;

			var menubtn = document.createElement("toolbarbutton");
			menubtn.id = "usercssloader_menubtn";
			menubtn.setAttribute("label", "UserCSSLoader");
			menubtn.setAttribute("tooltiptext", "UserCSSLoader"); //CSS-Stylish管理器
			menubtn.setAttribute("type", "menu"); /* 下拉菜单,若需要右键菜单请替换为*/ /*"context", "_child" */
			menubtn.setAttribute("class", "toolbarbutton-1 chromeclass-toolbar-additional"); //toolbarbutton-1 chromeclass-toolbar-additional
			menubtn.setAttribute("removable", "true");
			menubtn.style.listStyleImage = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAKzSURBVDhPbZPbSxRhGMY3Lc+GFZheTLs7u+OcD3uY2Z2ddT3sqqlpgkaIGJREZV0EQlEQeCGBBUJo0uEiISmIgsir6KIuAiuKwLvopqAuguxfeHq/WdnY9OJlho/v+c3zPu87AY7jZkOhEMI8TxVBKCog1CYhKKkIyjqCikFPDSFRQUgQEY5E/LtMw7SBCB2IoghZUSEbJqSYDcH2EHW7EPEKiGR7EM10Q3CyEOMOZDMGSdUgShKYNsDEmq7DiCegORnI2TyE/DBapufReH0N9QuvcWBmGeGhE5C9bqi2W7xLGqYNyLIMw4rBSnvQcj3gR0+jcvUbAs/+bKvGGy+huTmYdgqmZYFpA4qiwIjFYbjtkLoGUbv0fku4iarlT6he/ohqOqu6+xkNBFDT7SUA024BEjAyObR1D6Hi8U8fULnyFQfHzqN1bBrc4CT4wgjEXB+0dHYnQBw6kYXOAex+8KXkoPbmKzSfvIZDI1Pg+49DJIea1wnLcf0W/jmgDMyUB6m9gJbJSwTYLO//6W/U3P4AoW8MakcvTDfrt10CMJppp6FmOhDNHUbz5GXsubeBXU9+lYGq7m9ALAxD97poEslygOWkobMgc73g8yPg+sfROjyFfWfnUbH6vQQKjp6BSk71hANFVYshMgcMYNCIhCMTECiw8MA4OOq99dgFNI+eKwH2z9yBTOPWk/8BWAsatVB36y0qHv1A3cIbNF1ZQcPc8zIH3NFTUGjZtjnwM3CLgJ2WiJ3Vz72AQBmp5JRtY1mIFlliq9zmdtLcJ7D36kPULK6jevEd1TqaLi6Bz/ZCpo8YNEa2vT6AraNpUgaJJIxkCqrjQUzTNLy8LwhT8V4PBPqhZNoVJrYStq/xV5l+iFlN0/wDnagam2/chpRIQUy6xaJ3hVLXYgn/DrvLNEz7FxcLzlUFZIR8AAAAAElFTkSuQmCC)';

			navBar.appendChild(menubtn);

			var xml_menubtn = '\
				<menupopup id="usercssloader_menubtn_popup">\
					<menuitem label="CSS已启用"\
						  id="usercssloader_enableUCL"\
						  class="menuitem-iconic"\
				          oncommand="UCL.enableUCL();" />\
					<menuitem label="打开样式目录"\
						  class="menuitem-iconic"\
				          oncommand="UCL.openFolder();" />\
					<menuitem label="重载全部样式"\
				          accesskey="R"\
						  class="menuitem-iconic"\
				          acceltext="Alt + R"\
						  oncommand="UCL.rebuild();" />\
					<menuitem label="userChrome.css"\
						  tooltiptext="左键：重载\n右键：编辑"\
						  class="menuitem-iconic"\
						  onclick="UCL.userC(event,\'userChrome.css\');" />\
					<menuitem label="userContent.css"\
						  tooltiptext="左键：重载\n右键：编辑"\
						  class="menuitem-iconic"\
						  onclick="UCL.userC(event,\'userContent.css\');" />\
					<menuitem label="为本站搜索样式(userstyles.org)"\
						  class="menuitem-iconic"\
				          oncommand="UCL.searchStyle();" />\
					<menuseparator />\
					<menuitem label="编写浏览器新样式(Chrome)"\
				          id="usercssloader-test-chrome"\
				          oncommand="UCL.styleTest(window);" />\
					<menuitem label="编写当前页新样式(Web)"\
				          id="usercssloader-test-content"\
				          oncommand="UCL.styleTest();" />\
					<menu label=".uc.css" accesskey="U" hidden="' + !UCL.USE_UC + '">\
						<menupopup id="usercssloader_menubtn_ucmenupopup">\
							<menuitem label="Rebuild(.uc.js)"\
							          oncommand="UCL.UCrebuild();" />\
						</menupopup>\
					</menu>\
					<menuseparator id="ucl_menubtn_separator"/>\
				</menupopup>\
		';

			var range_menubtn = document.createRange();
			range_menubtn.selectNodeContents($('usercssloader_menubtn'));
			range_menubtn.collapse(false);
			range_menubtn.insertNode(range_menubtn.createContextualFragment(xml_menubtn.replace(/\n|\t/g, '')));
			range_menubtn.detach();

			//access key register
			$("mainKeyset").appendChild($C("key", {
				id: "usercssloader-rebuild-key",
				oncommand: "UCL.rebuild();",
				key: "R",
				modifiers: "alt",
			}));

			this.rebuild();
			this.initialized = true;
			if (UCL.USE_UC) {
				setTimeout(function() {
					UCL.UCcreateMenuitem();
				}, 1000);
			}
			window.addEventListener("unload", this, false);
			gBrowser.mPanelContainer.addEventListener('DOMContentLoaded', this.userstylesInstall, true);
		},
		uninit: function() {
			var dis = [x
				for (x in this.readCSS)
					if (!this.readCSS[x].enabled)
			];
			var str = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
			str.data = dis.join("|");
			this.prefs.setComplexValue("disabled_list", Ci.nsISupportsString, str);
			window.removeEventListener("unload", this, false);
		},
		destroy: function() {
			var i = document.getElementById("usercssloader-rebuild-key");
			if (i) i.parentNode.removeChild(i);
			this.uninit();
		},
		handleEvent: function(event) {
			switch (event.type) {
				case "unload":
					this.uninit();
					break;
			}
		},
		enableUCL: function() {
			if (!UCL.UCLdisable) {
				for (let [leafName, CSS] in Iterator(this.readCSS)) {
					CSS.enabled = false;
					delete this.readCSS[leafName];
				}
				UCL.UCLdisable = !UCL.UCLdisable;
				$("usercssloader_enableUCL").setAttribute("label", "已禁用");
				XULBrowserWindow.statusTextField.label = "UserCSSLoader已禁用";
			} else {
				this.rebuild();
				UCL.UCLdisable = !UCL.UCLdisable;
				$("usercssloader_enableUCL").setAttribute("label", "已启用");
				XULBrowserWindow.statusTextField.label = "UserCSSLoader已启用";
			}
		},
		rebuild: function() {
			let ext = /\.css$/i;
			let not = /\.uc\.css/i;
			let files = this.FOLDER.directoryEntries.QueryInterface(Ci.nsISimpleEnumerator);

			while (files.hasMoreElements()) {
				let file = files.getNext().QueryInterface(Ci.nsIFile);
				if (!ext.test(file.leafName) || not.test(file.leafName)) continue;
				let CSS = this.loadCSS(file);
				CSS.flag = true;
			}
			for (let [leafName, CSS] in Iterator(this.readCSS)) {
				if (!CSS.flag) {
					CSS.enabled = false;
					delete this.readCSS[leafName];
				}
				delete CSS.flag;
				this.rebuildMenu(leafName);
			}
			if (this.initialized)
				XULBrowserWindow.statusTextField.label = "重新加载CSS成功";
			else
				XULBrowserWindow.statusTextField.label = "重新加载CSS成功";
		},
		loadCSS: function(aFile) {
			var CSS = this.readCSS[aFile.leafName];
			if (!CSS) {
				CSS = this.readCSS[aFile.leafName] = new CSSEntry(aFile);
				if (this.disabled_list.indexOf(CSS.leafName) === -1) {
					CSS.enabled = true;
				}
			} else if (CSS.enabled) {
				CSS.enabled = true;
			}
			return CSS;
		},
		//按钮css列表子菜单start
		rebuildMenu: function(aLeafName) {
			var CSS = this.readCSS[aLeafName];
			var btnmenuitem = document.getElementById("btnusercssloader-" + aLeafName); //

			if (!CSS) {
				if (btnmenuitem)
					btnmenuitem.parentNode.removeChild(btnmenuitem);
				return;
			}

			if (!btnmenuitem) {
				btnmenuitem = document.createElement("menuitem"); //按钮css列表子菜单
				btnmenuitem.setAttribute("label", aLeafName);
				btnmenuitem.setAttribute("id", "btnusercssloader-" + aLeafName);
				btnmenuitem.setAttribute("class", "usercssloader-item " + (CSS.SHEET == this.AGENT_SHEET ? "AGENT_SHEET" : "USER_SHEET"));
				btnmenuitem.setAttribute("type", "checkbox");
				btnmenuitem.setAttribute("autocheck", "false");
				btnmenuitem.setAttribute("oncommand", "UCL.toggle('" + aLeafName + "');");
				btnmenuitem.setAttribute("onclick", "UCL.itemClick(event);");
				document.getElementById("usercssloader_menubtn_popup").appendChild(btnmenuitem);
			}
			btnmenuitem.setAttribute("checked", CSS.enabled);
		},
		//按钮css列表子菜单end
		toggle: function(aLeafName) {
			var CSS = this.readCSS[aLeafName];
			if (!CSS) return;
			CSS.enabled = !CSS.enabled;
			this.rebuildMenu(aLeafName);
		},
		itemClick: function(event) {
			if (event.button == 0) return;

			event.preventDefault();
			event.stopPropagation();
			let label = event.currentTarget.getAttribute("label");

			if (event.button == 1) {
				this.toggle(label);
			} else if (event.button == 2) {
				closeMenus(event.target);
				this.edit(this.getFileFromLeafName(label));
			}
		},
		getFileFromLeafName: function(aLeafName) {
			let f = this.FOLDER.clone();
			f.QueryInterface(Ci.nsILocalFile); // use appendRelativePath
			f.appendRelativePath(aLeafName);
			return f;
		},
		styleTest: function(aWindow) {
			aWindow || (aWindow = this.getFocusedWindow());
			new CSSTester(aWindow, function(tester) {
				if (tester.saved)
					UCL.rebuild();
			});
		},
		searchStyle: function() {
			let win = this.getFocusedWindow();
			let word = win.location.host || win.location.href;
			openLinkIn("https://userstyles.org/styles/browse?category=" + word, "tab", {}); //http://userstyles.org/styles/browse/site/
		},
		openFolder: function() {
			this.FOLDER.launch();
		},
		editUserCSS: function(aLeafName) {
			let file = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
			file.appendRelativePath(aLeafName);
			this.edit(file);
		},
		edit: function(aFile) {
			var editor = Services.prefs.getCharPref("view_source.editor.path");
			if (!editor) return alert("\u672a\u8bbe\u5b9a\u7f16\u8f91\u5668\u8def\u5f84\uff0c\u8bf7\u8bbe\u5b9aview_source.editor.path\u7684\u503c\u4e3a\u8def\u5f84"); //未指定外部编辑器的路径。\n 请在about：config中设置view_source.editor.path
			try {
				var UI = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
				UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0 ? "GB2312" : "UTF-8"; //Shift_JIS
				var path = UI.ConvertFromUnicode(aFile.path);
				var app = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
				app.initWithPath(editor);
				var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
				process.init(app);
				process.run(false, [path], 1);
			} catch (e) {}
		},
		UCrebuild: function() {
			let re = /^file:.*\.uc\.css(?:\?\d+)?$/i;
			let query = "?" + new Date().getTime();
			Array.slice(document.styleSheets).forEach(function(css) {
				if (!re.test(css.href)) return;
				if (css.ownerNode) {
					css.ownerNode.parentNode.removeChild(css.ownerNode);
				}
				let pi = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="' + css.href.replace(/\?.*/, '') + query + '"');
				document.insertBefore(pi, document.documentElement);
			});
			UCL.UCcreateMenuitem();
		},
		UCcreateMenuitem: function() {
			let sep = $("usercssloader_ucsepalator");
			let popup = sep.parentNode;
			if (sep.nextSibling) {
				let range = document.createRange();
				range.setStartAfter(sep);
				range.setEndAfter(popup.lastChild);
				range.deleteContents();
				range.detach();
			}

			let re = /^file:.*\.uc\.css(?:\?\d+)?$/i;
			Array.slice(document.styleSheets).forEach(function(css) {
				if (!re.test(css.href)) return;
				let fileURL = decodeURIComponent(css.href).split("?")[0];
				let aLeafName = fileURL.split("/").pop();
				let m = document.createElement("menuitem");
				m.setAttribute("label", aLeafName);
				m.setAttribute("tooltiptext", fileURL);
				m.setAttribute("id", "usercssloader-" + aLeafName);
				m.setAttribute("type", "checkbox");
				m.setAttribute("autocheck", "false");
				m.setAttribute("checked", "true");
				m.setAttribute("oncommand", "this.setAttribute('checked', !(this.css.disabled = !this.css.disabled));");
				m.setAttribute("onclick", "UCL.UCItemClick(event);");
				m.css = css;
				popup.appendChild(m);
			});
		},
		UCItemClick: function(event) {
			if (event.button == 0) return;
			event.preventDefault();
			event.stopPropagation();

			if (event.button == 1) {
				event.target.doCommand();
			} else if (event.button == 2) {
				closeMenus(event.target);
				let fileURL = event.currentTarget.getAttribute("tooltiptext");
				let file = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler).getFileFromURLSpec(fileURL);
				this.edit(file);
			}
		},
		userC: function(event, str) {
			if (event.button == 0) {
				UCL.reloadUserCSS(str);
			} else if (event.button == 2) {
				event.preventDefault();
				UCL.editUserCSS(str);
			}
		},
		reloadUserCSS: function(str) {
			var aFile = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
			aFile.appendRelativePath(str);
			var fileURL = Services.io.getProtocolHandler("file")
				.QueryInterface(Ci.nsIFileProtocolHandler)
				.getURLSpecFromFile(aFile);
			if (str == "userChrome.css") {
				var rule = UCL.getStyleSheet(document.documentElement, fileURL);
				if (!rule) return;
				inIDOMUtils.parseStyleSheet(rule, UCL.loadText(aFile));
				rule.insertRule(":root{}", rule.cssRules.length);
				var w = window.open("", "", "width=10, height=10");
				w.close();
			}
			if (str == "userContent.css") {
				var rule = UCL.getStyleSheet(content.document.documentElement, fileURL);
				if (!rule) return;
				inIDOMUtils.parseStyleSheet(rule, UCL.loadText(aFile));
				rule.insertRule(":root{}", rule.cssRules.length);
				// 再描画处理
				var s = gBrowser.markupDocumentViewer;
				s.authorStyleDisabled = !s.authorStyleDisabled;
				s.authorStyleDisabled = !s.authorStyleDisabled;
			}

			XULBrowserWindow.statusTextField.label = "重新加载" + str + "已完成 ";
		},
		getStyleSheet: function(aElement, cssURL) {
			var rules = inIDOMUtils.getCSSStyleRules(aElement);
			var count = rules.Count();
			if (!count) return null;

			for (var i = 0; i < count; ++i) {
				var rule = rules.GetElementAt(i).parentStyleSheet;
				if (rule && rule.href === cssURL)
					return rule;
			};
			return null;
		},
		loadText: function(aFile) {
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
		userstylesInstall: function(event) {
			switch (event.type) {
				case "DOMContentLoaded":
					var doc = event.target,
						win = doc.defaultView;

					if (win && win.location.href.match(/userstyles.org\/styles/)) {
						try {
							var url = win.document.querySelector('link[rel="canonical"]').href + ".css";
							win.document.getElementById("style-install-mozilla-no-stylish").innerHTML = '<a id="download-button" class = "alternate-install" style="text-decoration:none;" href="' + url + '">Install</button>';
							win.document.getElementById("download-button").addEventListener('click', function(event) {
								if (event.button == 0) {
									var fileDir = FileUtils.getDir('UChrm', ['CSS'], true),
										targetFile = fileDir.clone(),
										filename = url.match(/[^\/]+$/)[0],
										uri = NetUtil.newURI(url),
										persist = Cc["@mozilla.org/embedding/browser/nsWebBrowserPersist;1"].createInstance(Ci.nsIWebBrowserPersist);
									if (FileUtils.getFile('UChrm', ['CSS', filename]).exists())
										filename = win.document.querySelector('link[rel="canonical"]').href.match(/[^\/]+$/)[0] + '_2.CSS';

									targetFile.append(filename);
									persist.persistFlags = persist.PERSIST_FLAGS_FROM_CACHE | persist.PERSIST_FLAGS_REPLACE_EXISTING_FILES;

									persist.progressListener = {
										onProgressChange: function(progress, request, aCurSelfProgress, aMaxSelfProgress, aCurTotalProgress, aMaxTotalProgress) {},
										onStateChange: function(progress, request, flags, status) {},
									};
									persist.saveURI(uri, null, null, null, "", targetFile, null);
									Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", "UserCSSLoader", '【' + filename + '】已下载到【' + fileDir.path + '】，请重新载入[Alt+R]查看效果', false, "", null);
								}
							}, false);
						} catch (e) {}
					}
					break;
			}
		},
	};

	function CSSEntry(aFile) {
		this.path = aFile.path;
		this.leafName = aFile.leafName;
		this.lastModifiedTime = 1;
		this.SHEET = /^xul-|\.as\.css$/i.test(this.leafName) ?
			Ci.nsIStyleSheetService.AGENT_SHEET :
			Ci.nsIStyleSheetService.USER_SHEET;
	}
	CSSEntry.prototype = {
		sss: Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
		_enabled: false,
		get enabled() {
			return this._enabled;
		},
		set enabled(isEnable) {
			var aFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile)
			aFile.initWithPath(this.path);

			var isExists = aFile.exists(); // ファイルが存在したら true
			var lastModifiedTime = isExists ? aFile.lastModifiedTime : 0;
			var isForced = this.lastModifiedTime != lastModifiedTime; // ファイルに変更があれば true

			var fileURL = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler).getURLSpecFromFile(aFile);
			var uri = Services.io.newURI(fileURL, null, null);

			if (this.sss.sheetRegistered(uri, this.SHEET)) {
				// すでにこのファイルが読み込まれている場合
				if (!isEnable || !isExists) {
					this.sss.unregisterSheet(uri, this.SHEET);
				} else if (isForced) {
					// 解除後に登録し直す
					this.sss.unregisterSheet(uri, this.SHEET);
					this.sss.loadAndRegisterSheet(uri, this.SHEET);
				}
			} else {
				// このファイルは読み込まれていない
				if (isEnable && isExists) {
					this.sss.loadAndRegisterSheet(uri, this.SHEET);
				}
			}
			if (this.lastModifiedTime !== 1 && isEnable && isForced) {
				log(this.leafName + " 的更新已检查。"); //の更新を確認しました。
			}
			this.lastModifiedTime = lastModifiedTime;
			return this._enabled = isEnable;
		},
	};

	function CSSTester(aWindow, aCallback) {
		this.win = aWindow || window;
		this.doc = this.win.document;
		this.callback = aCallback;
		this.init();
	}
	CSSTester.prototype = {
		sss: Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService),
		preview_code: "",
		saved: false,
		init: function() {
			this.dialog = openDialog(
				"data:text/html;charset=utf8," + encodeURIComponent('<!DOCTYPE HTML><html lang="ja"><head><title>CSSTester</title></head><body></body></html>'),
				"",
				"width=550,height=400,dialog=no");
			this.dialog.addEventListener("load", this, false);
		},
		destroy: function() {
			this.preview_end();
			this.dialog.removeEventListener("unload", this, false);
			this.previewButton.removeEventListener("click", this, false);
			this.saveButton.removeEventListener("click", this, false);
			this.closeButton.removeEventListener("click", this, false);
		},
		handleEvent: function(event) {
			switch (event.type) {
				case "click":
					if (event.button != 0) return;
					if (this.previewButton == event.currentTarget) {
						this.preview();
					} else if (this.saveButton == event.currentTarget) {
						this.save();
					} else if (this.closeButton == event.currentTarget) {
						this.dialog.close();
					}
					break;
				case "load":
					var doc = this.dialog.document;
					doc.body.innerHTML = '\
					<style type="text/css">\
						:not(input):not(select) { padding: 0px; margin: 0px; }\
						table { border-spacing: 0px; }\
						body, html, #main, #textarea { width: 100%; height: 100%; }\
						#textarea { font-family: monospace; }\
					</style>\
					<table id="main">\
						<tr height="100%">\
							<td colspan="4"><textarea id="textarea"></textarea></td>\
						</tr>\
						<tr height="40">\
							<td><input type="button" value="Preview" /></td>\
							<td><input type="button" value="Save" /></td>\
							<td width="80%"><span class="log"></span></td>\
							<td><input type="button" value="Close" /></td>\
						</tr>\
					</table>\
				';
					this.textbox = doc.querySelector("textarea");
					this.previewButton = doc.querySelector('input[value="Preview"]');
					this.saveButton = doc.querySelector('input[value="Save"]');
					this.closeButton = doc.querySelector('input[value="Close"]');
					this.logField = doc.querySelector('.log');

					var code = "@namespace url(" + this.doc.documentElement.namespaceURI + ");\n";
					code += this.win.location.protocol.indexOf("http") === 0 ?
						"@-moz-document domain(" + this.win.location.host + ") {\n\n\n\n}" :
						"@-moz-document url(" + this.win.location.href + ") {\n\n\n\n}";
					this.textbox.value = code;
					this.dialog.addEventListener("unload", this, false);
					this.previewButton.addEventListener("click", this, false);
					this.saveButton.addEventListener("click", this, false);
					this.closeButton.addEventListener("click", this, false);

					this.textbox.focus();
					let p = this.textbox.value.length - 3;
					this.textbox.setSelectionRange(p, p);

					break;
				case "unload":
					this.destroy();
					this.callback(this);
					break;
			}
		},
		preview: function() {
			var code = this.textbox.value;
			if (!code || !/\:/.test(code))
				return;
			code = "data:text/css;charset=utf-8," + encodeURIComponent(this.textbox.value);
			if (code == this.preview_code)
				return;
			this.preview_end();
			var uri = Services.io.newURI(code, null, null);
			this.sss.loadAndRegisterSheet(uri, Ci.nsIStyleSheetService.AGENT_SHEET);
			this.preview_code = code;
			this.log("Preview");
		},
		preview_end: function() {
			if (this.preview_code) {
				let uri = Services.io.newURI(this.preview_code, null, null);
				this.sss.unregisterSheet(uri, Ci.nsIStyleSheetService.AGENT_SHEET);
				this.preview_code = "";
			}
		},
		save: function() {
			var data = this.textbox.value;
			if (!data) return;

			var fp = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
			fp.init(window, "", Ci.nsIFilePicker.modeSave);
			fp.appendFilter("CSS Files", "*.css");
			fp.defaultExtension = "css";
			if (window.UCL)
				fp.displayDirectory = UCL.FOLDER;
			var res = fp.show();
			if (res != fp.returnOK && res != fp.returnReplace) return;

			var suConverter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
			suConverter.charset = "UTF-8";
			data = suConverter.ConvertFromUnicode(data);
			var foStream = Cc["@mozilla.org/network/file-output-stream;1"].createInstance(Ci.nsIFileOutputStream);
			foStream.init(fp.file, 0x02 | 0x08 | 0x20, 0664, 0);
			foStream.write(data, data.length);
			foStream.close();
			this.saved = true;
		},
		log: function() {
			this.logField.textContent = new Date().toLocaleFormat("%H:%M:%S") + ": " + $A(arguments);
		}
	};

	UCL.init();

	function $(id) {
		return document.getElementById(id);
	}

	function $A(arr) Array.slice(arr);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	function log() {
		Application.console.log(Array.slice(arguments));
	}

	// 通过手动更新 toolbar 的 currentSet 特性来添加按钮到 toolbar 里，使得按钮可拖动
	var updateToolbar = {
		runOnce: function() {
			var toolbars = document.querySelectorAll("toolbar"); //toolbar//无需改为"addon-bar"
			Array.slice(toolbars).forEach(function(toolbar) {
				var currentset = toolbar.getAttribute("currentset");
				if (currentset.split(",").indexOf("usercssloader_menubtn" /* 按钮 ID */ ) < 0) return;
				toolbar.currentSet = currentset;
				try {
					BrowserToolboxCustomizeDone(true);
				} catch (ex) {}
			});
		},
	}
	updateToolbar.runOnce();
})();
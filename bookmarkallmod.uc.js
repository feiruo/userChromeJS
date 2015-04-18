// ==UserScript==
// @name			bookmarkallmod.uc.js
// @description		浏览器退出时保存所有页面
// @compatibility	Firefox16
// @modby 			feiruo
// @charset 		UTF-8
// @include 		chrome://browser/content/browser.xul
// @id 				[77E1FF6F]
// @inspect 		window.BookmarkAll
// @startup 		window.BookmarkAll.init();
// @shutdown 		window.BookmarkAll.onDestroy();
// @optionsURL		about:config?filter=BookmarkAll.
// @config 			window.BookmarkAll.openPref();
// @reviewURL		http://bbs.kafan.cn/thread-1640643-1-1.html
// @homepageURL		https://github.com/feiruo/userChromeJS/
// @downloadURL		https://github.com/feiruo/userChromeJS/blob/master/bookmarkallmod.uc.js
// @version 		1.3.1 	2015.04.18 	20:00 	修复创建文件夹逻辑问题。
// @version 		1.3 	2015.04.12 	10:00 	重建、优化代码。
// @version 		1.2.1 	
// @version 		1.2 	修改动作方式，可以通过函数调用实时启用禁用和实时保存
// @version 		1.1 	修复在没有书签保存的情况下仍然创建一个时间文件夹的问题
// @version 		1.0 
// @note 			保存所有页面为书签
// @note			注意：对于未载入标签，存入的书签名是URL，只有载入之后才能获取标题
// ==/UserScript==
/**
 * 参考bookmark_all_onclose(https://j.mozest.com/zh-CN/ucscript/script/58)
 */
location == "chrome://browser/content/browser.xul" && (function() {
	if (window.BookmarkAll) {
		window.BookmarkAll.onDestroy();
		delete window.BookmarkAll;
	}
	var BookmarkAll = {
		get BMSV() {
			return Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
		},
		get Time() {
			var now = new Date();
			return now.toLocaleFormat(this.DateParse);
		},

		get prefs() {
			delete this.prefs;
			return this.prefs = Services.prefs.getBranch("userChromeJS.BookmarkAll.");
		},

		get Window() {
			var windowsMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
			return windowsMediator.getMostRecentWindow("BookmarkAll:Preferences");
		},

		init: function() {
			var ins = $("devToolsSeparator");
			ins.parentNode.insertBefore($C("menuitem", {
				id: "BookmarkAll_set",
				label: "BookmarkAll配置",
				oncommand: "BookmarkAll.openPref();",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAVCAYAAABPPm7SAAABLklEQVQ4je3UQSuEURgF4MdsLCwsWFBs0PwaykIpTYok/A47/AYre9spNRZWLGWhpKSwUJhsNMZYzFHfDBkWdm6dxXvuOee+9/Z+H/RjFWd4QasHXqJdjdc6HrPZxGsPNKN9jNd5iAPMY7YH5qNtxauRYsXP10o8DYW7Lf0iYKng+w/4q4A+lDEdlMP9KGAYm9rjehKchRv+LmAR49jHMWYwFMyE28dYtB0Bb9jWHtEqpnLSQCBcNZrteDoC6tjDCEbT8lGwGW4kmnp3QAu7GMRETur+jKvZG4z20xtUMIla6ifsBE/hatFUvnqDLRymfsAaSsFauFY0W8UrvAXPIe6xHOPHKoW7j+Y5niZcF9q5TXtFczGkgruC/pL2b+kKp5jTOXHdqw8LuMANNt4Bftqn5GqcsQAAAAAASUVORK5CYII=",
				class: "menuitem-iconic",
			}), ins);

			this.loadSetting();
			this.prefs.addObserver('', this.PrefsObs, false);
			window.addEventListener("unload", BookmarkAll.Bookmark, false);
		},

		onDestroy: function() {
			window.removeEventListener("unload", BookmarkAll.Bookmark, false);
		},

		PrefsObs: function(subject, topic, data) {
			if (topic == 'nsPref:changed') {
				switch (data) {
					case 'Enable':
					case 'ToolbarFolder':
					case 'Index':
					case 'DateParse':
					case 'Dirs':
					case 'Exclude':
						BookmarkAll.loadSetting(data);
						break;
				}
			}
		},

		loadSetting: function(type) {
			if (!type || type === "Enable")
				this.Enable = this.getPrefs(0, "Enable", false);

			if (!type || type === "ToolbarFolder")
				this.ToolbarFolder = this.getPrefs(0, "ToolbarFolder", false);

			if (!type || type === "Index")
				this.Index = this.getPrefs(1, "Index", 15);

			if (!type || type === "DateParse")
				this.DateParse = this.getPrefs(2, "DateParse", "%Y/%m/%d %H:%M:%S");

			if (!type || type === "Dirs") {
				var Dirs = this.getPrefs(2, "Dirs", "Conversations");
				Dirs = Dirs.replace(/\//g, '\\').split('\\');;
				this.Dirs = Dirs;
			}

			if (!type || type === "Exclude") {
				var Exclude = this.getPrefs(2, "Exclude", "chrome://, resource://, about:, http://www.baidu.com/baidu?, http://www.baidu.com/s?");
				Exclude = Exclude.trim();
				if (Exclude.indexOf(',') != -1)
					Exclude = Exclude.replace(/,\s*/g, '\n');
				this.prefs.setCharPref("Exclude", Exclude);
				Exclude = Exclude.split(/\n+/).map(function(s) s.trim());
				this.Exclude = Exclude;
			}
		},

		/*****************************************************************************************/
		Bookmark: function(isAlert) {
			var that = BookmarkAll;

			if (!that.Enable) return;

			if (that.toolbarFolder)
				TF = that.BMSV.toolbarFolder;
			else
				TF = that.BMSV.bookmarksMenuFolder;

			var historyService = Cc["@mozilla.org/browser/nav-history-service;1"].getService(Ci.nsINavHistoryService),
				options = historyService.getNewQueryOptions(),
				query = historyService.getNewQuery();

			query.setFolders([TF], 1);
			var result = historyService.executeQuery(query, options),
				rootNode = result.root;

			rootNode.containerOpen = true;
			var TTF = that.FindFolders(rootNode);
			rootNode.containerOpen = false;

			var Tid = TTF.itemId,
				nu = TTF.nu;

			if (TTF.itemId)
				TF = TTF.itemId;

			if (TTF.nu != that.Dirs.length) {
				for (var i in that.Dirs) {
					if (i < TTF.nu) continue;
					TF = that.BMSV.createFolder(TF, that.Dirs[i], 0);
				}
			}

			var TFT = that.BMSV.createFolder(TF, that.Time, 0);

			var isTF = that.Exce(TFT);

			if (!isTF)
				that.BMSV.removeItem(TFT);
			that.DelOld(TF);
		},

		FindFolders: function(TF, dir) {
			let itemId, nu = 0;

			function FindFolder(TF, Dirs) {
				for (var i = 0; i < TF.childCount; i++) {
					var node = TF.getChild(i);
					if (node.type != 6) continue;
					if (node instanceof Ci.nsINavHistoryContainerResultNode) {
						if (node.title != Dirs[nu]) continue;
						nu = nu + 1;
						itemId = node.itemId;
						if (!Dirs[nu]) break;
						var oldOpen = node.containerOpen;
						node.containerOpen = true;
						FindFolder(node, Dirs);
						node.containerOpen = oldOpen;
						break;
					}
				}
			}

			FindFolder(TF, this.Dirs);
			return {
				itemId: itemId,
				nu: nu
			};
		},

		Exce: function(TFT) {
			var that = BookmarkAll;
			var isTF;
			var browsers = document.getElementById('content').browsers;
			for (var i = 0; i < browsers.length; ++i) {
				var webNav = browsers[i].webNavigation;
				var url = webNav.currentURI.spec;
				var title = "";
				try {
					var doc = webNav.document;
					title = doc.title || url;
				} catch (e) {
					title = url;
				}
				for (var j in that.Exclude) {
					var rex = new RegExp(that.Exclude[j]);
					if (rex.test(url))
						var isEx = true;
				}
				if (isEx) continue;
				isTF = true;
				that.BMSV.insertBookmark(TFT, webNav.currentURI, -1, title);
			}
			return isTF;
		},

		DelOld: function(TF) {
			var Old = [];
			for (var i = 0;
				(this.BMSV.getIdForItemAt(TF, i) != -1); i++) {
				var temp_folder = this.BMSV.getIdForItemAt(TF, i);
				Old.push(temp_folder);
			}
			if (Old.length <= this.Index) return;
			for (var j = this.Index; j < Old.length; j++) {
				this.BMSV.removeItem(Old[j]);
			}
		},
		/*****************************************************************************************/
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

		openPref: function() {
			if (this.Window)
				this.Window.focus();
			else {
				var option = this.option();
				window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + option, '', 'chrome,titlebar,toolbar,centerscreen,dialog=no');
			}
		},
		option: function() {
			xul = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
				<prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
				id="BookmarkAll_Settings"\
				ignorekeys="true"\
				title="BookmarkAll 配置"\
				buttons="accept,cancel,extra1"\
				ondialogextra1="Resets();"\
				windowtype="BookmarkAll:Preferences">\
					<prefpane id="main" flex="1">\
						<preferences>\
							<preference id="Enable" type="bool" name="userChromeJS.BookmarkAll.Enable"/>\
							<preference id="ToolbarFolder" type="bool" name="userChromeJS.BookmarkAll.ToolbarFolder"/>\
							<preference id="Index" type="int" name="userChromeJS.BookmarkAll.Index"/>\
							<preference id="DateParse" type="string" name="userChromeJS.BookmarkAll.DateParse"/>\
							<preference id="Dirs" type="string" name="userChromeJS.BookmarkAll.Dirs"/>\
							<preference id="Exclude" type="string" name="userChromeJS.BookmarkAll.Exclude"/>\
						</preferences>\
						<script>\
							function Resets() {\
								$("Enable").value = false;\
								$("ToolbarFolder").value = false;\
								$("Index").value = 15;\
								$("DateParse").value = "%Y/%m/%d %H:%M:%S";\
								$("Dirs").value = "Conversations";\
								$("Exclude").value = "chrome://\\nresource://\\nabout:\\nhttp://www.baidu.com/baidu?\\nhttp://www.baidu.com/s?";\
							}\
							function $(id) document.getElementById(id);\
						</script>\
						<groupbox>\
							<checkbox id="Enable" label="是否启用关闭窗口后自动保存" preference="Enable"/>\
							<checkbox id="ToolbarFolder" label="保存在书签工具栏,否则保存在书签菜单" preference="ToolbarFolder"/>\
						</groupbox>\
						<groupbox>\
							<grid>\
								<rows>\
									<row align="center">\
										<label value="条目限制"/>\
										<textbox id="Index" type="number" preference="Index"  tooltiptext="保存次数的上限，多余限制数目会自动删除旧的"/>\
									</row>\
									<row align="center">\
										<label value="日期格式："/>\
										<textbox id="DateParse" tooltiptext="可以有空格之类的，年：%Y，月：%m，日：%d,，时：%H，分：%M，秒：%S" preference="DateParse"/>\
									</row>\
									<row align="center">\
										<label value="书签保存目录："/>\
										<textbox id="Dirs" preference="Dirs" tooltiptext="多级请用 / 分割，如：目录1/子目录" style="width:400px;"/>\
									</row>\
								</rows>\
							</grid>\
						</groupbox>\
						<groupbox>\
							<caption label="排除列表，支持部分正则"/>\
							<vbox flex="1" style="height:200px;">\
								<textbox flex="1" preference="Exclude" tooltiptext="一行一个" multiline="true" cols="60"/>\
							</vbox>\
						</groupbox>\
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
	};
	/*****************************************************************************************/
	function $(id) {
		return document.getElementById(id);
	}

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	BookmarkAll.init();
	window.BookmarkAll = BookmarkAll;
})();
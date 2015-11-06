// ==UserScript==
// @name         	  	starClickMod.uc.js
// @description   		多功能收藏按钮
// @author        		feiruo
// @compatibility		Firefox 40
// @charset				UTF-8
// @include       		chrome://browser/content/browser.xul
// @id 					[77DDE674]
// @startup        		window.starClick.init();
// @shutdown      		window.starClick.onDestroy(true);
// @reviewURL			http://bbs.kafan.cn/thread-1657336-1-1.html
// @homepageURL			https://github.com/feiruo/userChromeJS
// @note      		  	参考star Click（http://g.mozest.com/viewthread.php?tid=41377）
// @note      		 	为编辑面板增加更多功能
// @note      		 	左键弹出书签添加编辑面板，中键打开书签侧栏，右键删除当前书签
// @version    		    1.8.4 	全面修复，仅支持40Up。设置放入about:config中，即时生效。
// @version    		    1.8.3 	40Up。
// @version    		    1.8.2 	building 部分功能可以自定义。
// @version    		    1.8.1 	去除Holly，删掉多余的动作（修改五角星位置等）。
// @version     		1.8 	修正重启后可能按键失效的问题。
// @version     		1.7 	修复右键报错，Australis重整UI后失效问题,增加 中键 打开/隐藏 书签侧栏。
// @version      		1.6 	Australis 添加书签按钮移动至地址栏。
// @version      		1.5 	支持 Nightly Holly.
// @version      		1.4 	支持 firefox 24 以下版本.
// @version      		1.3 	修复了可能出现的文件夹列表不能自动展开和获取上次文件夹的问题.
// @version      		1.2 	修正因 firefox 26 添加了 bookmarks-menu-button 导致的判断出错.
// @version      		1.1 	修正因 Nightly Australis 没有删除 star-button 导致的判断出错.
// ==/UserScript== 
location == "chrome://browser/content/browser.xul" && (function() {

	if (window.starClick) {
		window.starClick.onDestroy();
		delete window.starClick;
	}

	var starClick = {
		Default_PlacesCommandHook_bookmarkCurrentPage: PlacesCommandHook.bookmarkCurrentPage.toString(),
		get prefs() {
			delete this.prefs;
			return this.prefs = Services.prefs.getBranch("userChromeJS.starClickMod.");
		},
		get StarBtn() {
			var version = Services.appinfo.version.split(".")[0];
			if (version < 29)
				return $('star-button');
			else {
				var NodeList = document.getAnonymousNodes($('bookmarks-menu-button'));
				for (var i in NodeList) {
					if (!NodeList[i].className) continue;
					if (NodeList[i].className != "box-inherit toolbarbutton-menubutton-button") continue;
					return NodeList[i];
				}
			}
		},

		init: function() {
			this.AddListener(true);
			this.Enable(true);
			this.loadSetting();
			this.prefs.addObserver('', this.PrefsObs, false);
		},

		onDestroy: function() {
			this.AddListener(false);
			this.Enable(false);
			this.prefs.removeObserver('', this.PrefsObs, false);
		},

		PrefsObs: function(subject, topic, data) {
			switch (topic) {
				case 'nsPref:changed':
					switch (data) {
						case 'isAutoPopup':
						case 'isLastFolder':
							starClick.loadSetting(data);
							break;
					}
					break;
			}
		},

		loadSetting: function(type) {
			if (!type || type === "isAutoPopup")
				this.isAutoPopup = this.getPrefs(0, "isAutoPopup", true);

			if (!type || type === "isLastFolder")
				this.isLastFolder = this.getPrefs(0, "isLastFolder", true);
		},

		OpenPanel: function(isAlert) {
			if (!isAlert) return;
			setTimeout(function() {
				gEditItemOverlay.toggleFolderTreeVisibility();
				//gEditItemOverlay.toggleTagsSelector();
			}, 50);
			let folderTree = document.getElementById("editBMPanel_folderTreeRow");
			folderTree.height = 300;
			//let tagsSelector = document.getElementById("editBMPanel_tagsSelectorRow");
			//tagsSelector.height = 75;
			document.getAnonymousNodes($('editBMPanel_tagsSelector'))[1].lastChild.style.display = 'inline-block';
		},

		GetLastFolderId: function() {
			var LAST_USED_ANNO = "bookmarkPropertiesDialog/folderLastUsed";
			var annos = PlacesUtils.annotations;
			var folderIds = annos.getItemsWithAnnotation(LAST_USED_ANNO);
			var _recentFolders = [];
			for (var i = 0; i < folderIds.length; i++) {
				var lastUsed = annos.getItemAnnotation(folderIds[i], LAST_USED_ANNO);
				_recentFolders.push({
					folderId: folderIds[i],
					lastUsed: lastUsed
				});
			}
			_recentFolders.sort(function(a, b) {
				if (b.lastUsed < a.lastUsed) return -1;
				if (b.lastUsed > a.lastUsed) return 1;
				return 0;
			});
			return _recentFolders.length > 0 ? _recentFolders[0].folderId : PlacesUtils.unfiledBookmarksFolderId;
		},

		AddListener: function(isAlert) {
			this.StarBtn.removeEventListener("click", starClick.Click, false);

			if (!this.StarBtn || !isAlert) return;

			this.StarBtn.addEventListener("click", starClick.Click, false);
		},

		Enable: function(isAlert) {
			eval('PlacesCommandHook.bookmarkCurrentPage =' + this.Default_PlacesCommandHook_bookmarkCurrentPage);
			if (!isAlert) return;
			var hook = this.hook.toString();
			eval('PlacesCommandHook.bookmarkCurrentPage =' + hook);
		},

		hook: function PCH_bookmarkCurrentPage(aShowEditUI, aParent) {
			var isParent = starClick.GetLastFolderId(starClick.isLastFolder);
			this.bookmarkPage(gBrowser.selectedBrowser, isParent ? isParent : aParent, starClick.isAutoPopup);
			starClick.OpenPanel(starClick.isAutoPopup);
		},

		Click: function(event) {
			if (event.button == 0) {

			} else if (event.button == 1) {
				toggleSidebar('viewBookmarksSidebar');
				event.stopPropagation();
			} else if (event.button == 2) {
				var uri = gBrowser.selectedBrowser.currentURI;
				var itemId = PlacesUtils.getMostRecentBookmarkForURI(uri);
				if (itemId == -1) return;
				event.preventDefault();
				try {
					Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService).removeItem(itemId);
				} catch (ex) {
					console.log(ex)
				}
				event.stopPropagation();
			}
		},

		getPrefs: function(type, name, val) {
			switch (type) {
				case 0:
					if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_BOOL)
						this.prefs.setBoolPref(name, val ? val : false);
					return this.prefs.getBoolPref(name);
					break;
				case 1:
					if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_INT)
						this.prefs.setIntPref(name, val ? val : 0);
					return this.prefs.getIntPref(name);
					break;
				case 2:
					if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING)
						this.prefs.setCharPref(name, val ? val : "");
					return this.prefs.getCharPref(name);
					break;
			}
		},
	};

	function $(id) document.getElementById(id);

	starClick.init();
	window.starClick = starClick;
})();
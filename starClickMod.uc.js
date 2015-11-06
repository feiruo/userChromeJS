// ==UserScript==
// @name         	  	starClickMod.uc.js
// @description   		多功能收藏按钮
// @author        		feiruo
// @compatibility		Firefox 16
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
// @version    		    1.8.3 	兼容40up,去除定位到最后一次使用的文件夹功能。
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
		isAutoPopup: true, //自动出编辑面板？
		//isLast: true, //自动获取最后一次使用的文件夹？否则“未分类书签”；
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
		},

		onDestroy: function() {
			this.AddListener(false);
		},

		OpenPanel: function(isAlert) {
			if (!isAlert) return;
			gEditItemOverlay.toggleFolderTreeVisibility();
			document.getAnonymousNodes($('editBMPanel_tagsSelector'))[1].lastChild.style.display = 'inline-block';
			$('editBMPanel_tagsSelector').style.cssText = 'max-height:50px !important; width:300px !important';
			$('editBMPanel_folderTree').style.cssText = 'min-height:200px !important; max-width:300px !important';
			$('editBookmarkPanel').style.maxHeight = '800px';
		},

		//SetFolder: function(isAlert) {
			//if (!isAlert) return;
			//var LastId = this.GetLastFolderId();
			//if (LastId === PlacesUtils.unfiledBookmarksFolderId) return;
			//var FolderTree = gEditItemOverlay._folderMenuList.firstChild.childNodes;
			//for (var i in FolderTree) {
				//var Folder = FolderTree[i]
				//if (!Folder.folderId) continue;
				//if (Folder.folderId != LastId) continue;
				//setTimeout(function() {
					//Folder.click();
					//Folder.setAttribute("selected", "true");
					//gEditItemOverlay._folderMenuList.selectedIndex = i;
					//gEditItemOverlay._folderMenuList.setAttribute("selectedIndex", i);
					//let item = this._getFolderMenuItem(LastId);
					//gEditItemOverlay._folderMenuList.selectedItem = item;
				//}, 100);
				//break;
			//}
		//},

		//GetLastFolderId: function() {
			//var LAST_USED_ANNO = "bookmarkPropertiesDialog/folderLastUsed";
			//var annos = PlacesUtils.annotations;
			//var folderIds = annos.getItemsWithAnnotation(LAST_USED_ANNO);
			//var _recentFolders = [];
			//for (var i = 0; i < folderIds.length; i++) {
				//var lastUsed = annos.getItemAnnotation(folderIds[i], LAST_USED_ANNO);
				//_recentFolders.push({
					//folderId: folderIds[i],
					//lastUsed: lastUsed
				//});
			//}
			//_recentFolders.sort(function(a, b) {
				//if (b.lastUsed < a.lastUsed) return -1;
				//if (b.lastUsed > a.lastUsed) return 1;
				//return 0;
			//});
			//return _recentFolders.length > 0 ? _recentFolders[0].folderId : PlacesUtils.unfiledBookmarksFolderId;
		//},

		AddListener: function(isAlert) {
			this.StarBtn.removeEventListener("click", starClick.Click, false);

			if (!this.StarBtn || !isAlert) return;

			this.StarBtn.addEventListener("click", starClick.Click, false);
		},

		Click: function(event) {
			if (event.button == 0) {
				PlacesCommandHook.bookmarkCurrentPage();
				starClick.OpenPanel(starClick.isAutoPopup);
				//starClick.SetFolder(starClick.isLast);
			}
			if (event.button == 1)
				toggleSidebar('viewBookmarksSidebar');
			if (event.button == 2) {
				var uri = gBrowser.selectedBrowser.currentURI;
				var itemId = PlacesUtils.getMostRecentBookmarkForURI(uri);
				if (itemId == -1) return;
				event.preventDefault();
				try {
					Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService).removeItem(itemId);
				} catch (ex) {
					console.log(ex)
				}
			}
			event.stopPropagation();
		},
	};

	function $(id) document.getElementById(id);

	starClick.init();
	window.starClick = starClick;
})();
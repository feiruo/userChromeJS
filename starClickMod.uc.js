// ==UserScript==
// @name         	  	starClickMod.uc.js
// @description   		多功能收藏按钮
// @author        		feiruo
// @compatibility		Firefox 16
// @charset				UTF-8
// @include       		chrome://browser/content/browser.xul
// @id 					[77DDE674]
// @reviewURL			http://bbs.kafan.cn/thread-1657336-1-1.html
// @homepageURL			https://github.com/feiruo/userChromeJS
// @note      		  	参考star Click（http://g.mozest.com/viewthread.php?tid=41377）
// @note      		 	为编辑面板增加更多功能
// @note      		 	左键弹出书签添加编辑面板，中键打开书签侧栏，右键删除当前书签
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
(function() {
	if (location == "chrome://browser/content/browser.xul") {
		var version = Services.appinfo.version.split(".")[0];

		window.starClick = {
			init: function() {
				this.bookmarkPageU();
				this.lastfolder();
				this.clickStar();
			},

			bookmarkPageU: function() {
				var bookmarkPage = PlacesCommandHook.bookmarkPage.toString().replace(/^function.*{|}$/g, "").replace("PlacesUtils.unfiledBookmarksFolderId", "_getLastFolderId()");
				eval("PlacesCommandHook.bookmarkPage=function PCH_bookmarkPage(aBrowser, aParent, aShowEditUI) {" + bookmarkPage + "}");
				eval("StarUI._doShowEditBookmarkPanel=" + StarUI._doShowEditBookmarkPanel.toString().replace(/hiddenRows: \[[^]*\]/, "hiddenRows: []").replace(/}$/, "setTimeout(function(){ gEditItemOverlay.toggleFolderTreeVisibility();document.getAnonymousNodes(document.getElementById('editBMPanel_tagsSelector'))[1].lastChild.style.display = 'inline-block';  document.getElementById('editBMPanel_tagsSelector').style.cssText = 'max-height:50px !important; width:300px !important'; document.getElementById('editBMPanel_folderTree').style.cssText = 'min-height:200px !important; max-width:300px !important';document.getElementById('editBookmarkPanel').style.maxHeight='800px'}, 0); $&"));
				eval("StarUI.handleEvent=" + StarUI.handleEvent.toString().replace('aEvent.target.className == "expander-up" ||', '$& aEvent.target.id == "editBMPanel_descriptionField" ||'));
			},

			lastfolder: function() {
				window._getLastFolderId = function() {
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
				};
			},

			clickStar: function() {
				if (version < 29) {
					var onClick = function(e) {
						if (e.button == 0 && !this._pendingStmt) {
							PlacesCommandHook.bookmarkCurrentPage(true);
							e.preventDefault();
							e.stopPropagation()
						}
					}.toString().replace(/^function.*{|}$/g, "");
					if (version < 23) {
						eval("PlacesStarButton.onClick=function PSB_onClick(e) {" + onClick + "}");
					} else {
						eval("BookmarkingUI.onCommand=function PSB_onClick(e) {" + onClick + "}");
					}(function(doc) {
						var starbuttonrc = doc.getElementById('star-button');
						if (!starbuttonrc) return;
						starbuttonrc.addEventListener("click", function(e) {
							if (e.button == 1) {
								toggleSidebar('viewBookmarksSidebar');
							}
							if (e.button == 2) {
								var uri = gBrowser.selectedBrowser.currentURI;
								var itemId = PlacesUtils.getMostRecentBookmarkForURI(uri);
								var navBookmarksService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
								try {
									navBookmarksService.removeItem(itemId);
								} catch (e) {}
							}
							e.preventDefault();
							e.stopPropagation();
						}, false);
					})(document);
				} else {
					var bookmarksMenuBtn = document.getElementById('bookmarks-menu-button');
					var starbutton = document.getAnonymousNodes(bookmarksMenuBtn)[1];
					starbutton.addEventListener("click", function(e) {
						if (e.button == 0) {
							PlacesCommandHook.bookmarkCurrentPage(true);
						}
						if (e.button == 1) {
							toggleSidebar('viewBookmarksSidebar');
						}
						if (e.button == 2) {
							var uri = gBrowser.selectedBrowser.currentURI;
							var itemId = PlacesUtils.getMostRecentBookmarkForURI(uri);
							var navBookmarksService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
							try {
								navBookmarksService.removeItem(itemId);
							} catch (e) {}
						}
						e.preventDefault();
						e.stopPropagation()
					}, false);
				}
			},
		};
		window.starClick.init();
		setTimeout(starClick.clickStar, 500);
		window.addEventListener("resize", starClick.clickStar, true);
		window.addEventListener("aftercustomization", starClick.clickStar, false);
		window.addEventListener("customizationchange", starClick.clickStar, false);
	}
})();
// ==UserScript==
// @name           star Click Mod
// @description    多功能收藏按钮
// @homepage       https://github.com/feiruo/userchromejs/
// @author         feiruo
// @include         chrome://browser/content/browser.xul
// @charset      utf-8
// @version      1.7
// @note        参考star Click（http://g.mozest.com/viewthread.php?tid=41377）
// @note        为编辑面板增加更多功能
// @note        右键删除当前书签
// @note        1.7 修复右键报错，Australis重整UI后失效问题,增加 中键 打开/隐藏 书签侧栏。
// @note        1.6 Australis 添加书签按钮移动至地址栏。
// @note        1.5 支持 Nightly Holly.
// @note        1.4 支持 firefox 24 以下版本.
// @note        1.3 修复了可能出现的文件夹列表不能自动展开和获取上次文件夹的问题.
// @note        1.2 修正因 firefox 26 添加了 bookmarks-menu-button 导致的判断出错.
// @note        1.1 修正因 Nightly Australis 没有删除 star-button 导致的判断出错.
// @note        1.0 
// ==/UserScript== 
(function() {
	if (location == "chrome://browser/content/browser.xul") {
		//是否移动添加书签五角星到地址栏
		var olduimod = false;

		//是否隐藏dropmarker，配合bookmarkBtn.uc.js效果更佳
		var hidedropmarker = false;

		var version = Services.appinfo.version.split(".")[0];
		window.starClick = {
			init: function() {
				this.bookmarkPageU();
				this.lastfolder();
				this.clickStar();
				this.resizeUI();
				window.addEventListener("resize", starClick.clickStar, true);
				window.addEventListener("aftercustomization", starClick.clickStar, false);
				window.addEventListener("customizationchange", starClick.clickStar, false);
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
						if (b.lastUsed >
							a.lastUsed) return 1;
						return 0;
					});
					return _recentFolders.length > 0 ? _recentFolders[0].folderId : PlacesUtils.unfiledBookmarksFolderId;
				};
			},

			clickStar: function() {
				if (version < 28) {
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
					var holly = false;
					try {
						var holly = document.getElementById('appmenu_about').label;
					} catch (e) {}
					if (holly)
						var starbutton = document.getElementById('star-button');
					else {
						var bookmarksMenuBtn = document.getElementById('bookmarks-menu-button');
						var starbutton = document.getAnonymousNodes(bookmarksMenuBtn)[1];
					}
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

			resizeUI: function() {
				if (version > 28) {
					//隐藏dropmarker配合bookmarkBtn.uc.js效果更佳
					if (hidedropmarker) {
						var cssStr = ('\
				#bookmarks-menu-button > dropmarker {display: none !important;}\
				');
						var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
						document.insertBefore(style, document.documentElement);
					}

					//Australis移动添加书签五角星到地址栏
					if (olduimod) {
						var urlIcon = document.getElementById('urlbar-icons');
						var starbutton = document.getElementById('bookmarks-menu-button');
						urlIcon.appendChild(starbutton);
						var menupopup = starbutton.firstChild;
						var cssStr = ('\
				#bookmarks-menu-button {\
  				list-style-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAtCAYAAABxsjF3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjZBNDg1MTEzOUU3QjExREY4RTNGQTY4REEwRDA4Mjk4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjZBNDg1MTE0OUU3QjExREY4RTNGQTY4REEwRDA4Mjk4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NkE0ODUxMTE5RTdCMTFERjhFM0ZBNjhEQTBEMDgyOTgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NkE0ODUxMTI5RTdCMTFERjhFM0ZBNjhEQTBEMDgyOTgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5XGR7dAAAHOUlEQVR42oxWe2xT5xU/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") !important;\
  				-moz-image-region: rect(0, 15px, 15px, 0) !important;  margin-bottom: 1px !important;\
				}\
				#bookmarks-menu-button:not([starred]):hover {-moz-image-region: rect(15px, 15px, 30px, 0) !important;}\
				#bookmarks-menu-button[starred] {-moz-image-region: rect(30px, 15px, 45px, 0) !important;}\
				#bookmarks-menu-button >toolbarbutton,\
				#bookmarks-menu-button >toolbarbutton .toolbarbutton-icon{\
				-moz-appearance:none!important;\
				border:none!important;\
				box-shadow:none!important;\
				background:none!important;\
				margin:0!important;\
				}\
				');
						var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
						document.insertBefore(style, document.documentElement);
					}
				}
			},
		};
		window.starClick.init();
	}
})();
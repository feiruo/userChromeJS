// ==UserScript==
// @name           star Click Mod
// @description    多功能收藏星星
// @homepage       https://github.com/feiruo/userchromejs/
// @author         feiruo
// @note        根据slimx大神的star Click修改 原脚本地址http://g.mozest.com/viewthread.php?tid=41377
// @note        mozilla多次修改书签的的原因，这个脚本已经改的面目全非了，于是干脆重新写了一个..
// @note        为编辑面板增加更多功能
// @note        修复右键删除当前书签
// @charset      utf-8
// @include         chrome://browser/content/browser.xul
// @version        0.5
// ==/UserScript==
(function () {
if (location == "chrome://browser/content/browser.xul") {
var bookmarkPage = PlacesCommandHook.bookmarkPage.toString().replace(/^function.*{|}$/g, "").replace("PlacesUtils.unfiledBookmarksFolderId","_getLastFolderId()");
    eval("PlacesCommandHook.bookmarkPage=function PCH_bookmarkPage(aBrowser, aParent, aShowEditUI) {"+bookmarkPage+"}");
    eval("StarUI._doShowEditBookmarkPanel="+StarUI._doShowEditBookmarkPanel.toString().replace(/hiddenRows: \[[^]*\]/,"hiddenRows: []").replace(/}$/,"setTimeout(function(){ gEditItemOverlay.toggleFolderTreeVisibility();document.getAnonymousNodes(document.getElementById('editBMPanel_tagsSelector'))[1].lastChild.style.display = 'inline-block';  document.getElementById('editBMPanel_tagsSelector').style.cssText = 'max-height:50px !important; width:300px !important'; document.getElementById('editBMPanel_folderTree').style.cssText = 'min-height:250px !important; max-width:300px !important';document.getElementById('editBookmarkPanel').style.maxHeight='800px'}, 0); $&"));
function _getLastFolderId(){
    var LAST_USED_ANNO = "bookmarkPropertiesDialog/folderLastUsed";
    var annos = PlacesUtils.annotations;
    var folderIds = annos.getItemsWithAnnotation(LAST_USED_ANNO);
    var _recentFolders = [];
    for (var i = 0; i < folderIds.length; i++) {
      var lastUsed = annos.getItemAnnotation(folderIds[i], LAST_USED_ANNO);
      _recentFolders.push({ folderId: folderIds[i], lastUsed: lastUsed });
    }
    _recentFolders.sort(function(a, b) {
      if (b.lastUsed < a.lastUsed)
        return -1;
      if (b.lastUsed > a.lastUsed)
        return 1;
      return 0;
    });
    return _recentFolders.length>0?_recentFolders[0].folderId:PlacesUtils.unfiledBookmarksFolderId;
}
try{
    var starbutton = document.getElementById('star-button');
    }catch (e) {
    var bookmarksMenuBtn = document.getElementById('bookmarks-menu-button');
    var starbutton = document.getAnonymousNodes(bookmarksMenuBtn)[1];
    }
    starbutton.addEventListener("click", function(e) {
    		if (e.button == 0) {
				PlacesCommandHook.bookmarkCurrentPage(true);
            e.preventDefault();
            e.stopPropagation();
			}else if (e.button == 2) {
				var uri = gBrowser.selectedBrowser.currentURI;
            var itemId = PlacesUtils.getMostRecentBookmarkForURI(uri);
            var navBookmarksService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
            navBookmarksService.removeItem(itemId);
            e.preventDefault();
            e.stopPropagation();
			}
    }, false);
}
})();
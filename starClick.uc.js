// ==UserScript==
// @name           star Click
// @description    多功能收藏星星
// @include         chrome://browser/content/browser.xul
// @author         slimx
// @homepage       http://g.mozest.com/viewthread.php?tid=41377
// @version        0.0.2
// @note        非AustralisUI版本
// @note        为编辑面板增加更多功能
// @note        修复右键删除当前书签
// ==/UserScript==
(function () {
    var onClick = function (aEvent) {
        if (aEvent.button == 0 && !this._pendingStmt) {
            PlacesCommandHook.bookmarkCurrentPage(true);
        }
        aEvent.stopPropagation();

    }.toString().replace(/^function.*{|}$/g, "");
    eval("BookmarkingUI.onCommand=function PSB_onClick(aEvent) {" + onClick + "}");

    var bookmarkPage = PlacesCommandHook.bookmarkPage.toString()
        .replace(/^function.*{|}$/g, "").replace("PlacesUtils.unfiledBookmarksFolderId","_getLastFolderId()");
    eval("PlacesCommandHook.bookmarkPage=function PCH_bookmarkPage(aBrowser, aParent, aShowEditUI) {"+bookmarkPage+"}");
    var clickMenu  = function(aFor,aInfo){

//此处设置是否自动弹出文件夹列表
/*var menuList = document.getElementById("editBMPanel_folderMenuList");
        if(menuList)
        {
            setTimeout(function(){
                menuList.open = true;
            },250);
        }*/
    }.toString().replace(/^function.*{|}$/g, "");
eval("StarUI._doShowEditBookmarkPanel="+StarUI._doShowEditBookmarkPanel.toString().replace(/hiddenRows: \[[^]*\]/,"hiddenRows: []").replace(/}$/,"setTimeout(function(){ gEditItemOverlay.toggleFolderTreeVisibility();/*此处为弹出更多标签gEditItemOverlay.toggleTagsSelector(); 此处为弹出更多标签*/document.getAnonymousNodes(document.getElementById('editBMPanel_tagsSelector'))[1].lastChild.style.display = 'inline-block';  document.getElementById('editBMPanel_tagsSelector').style.cssText = 'max-height:50px !important; width:300px !important'; document.getElementById('editBMPanel_folderTree').style.cssText = 'min-height:250px !important; max-width:300px !important';document.getElementById('editBookmarkPanel').style.maxHeight='800px'}, 0); $&"));


//获取上次上次存放位置
function _getLastFolderId()
{
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
if (location == "chrome://browser/content/browser.xul") {
	(function (doc) {
		var starbuttonrc = doc.getElementById('star-button');
		if (!starbuttonrc) return;
		starbuttonrc.addEventListener("click", function (e) {
			if (e.button == 2) {
				var uri = gBrowser.selectedBrowser.currentURI;
            var itemId = PlacesUtils.getMostRecentBookmarkForURI(uri);
            var navBookmarksService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
            navBookmarksService.removeItem(itemId);
            e.preventDefault();
            e.stopPropagation();
			}
        }, false);})(document);}
})();
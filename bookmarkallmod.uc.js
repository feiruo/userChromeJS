// ==UserScript==
// @name            bookmarkallmod
// @description     浏览器退出时保存所有页面
// @author          feiruo
// @compatibility   Firefox 16
// @charset         UTF-8
// @include         main
// @id              [77E1FF6F]
// @startup         window.bookmarkallmod.init();
// @shutdown        window.bookmarkallmod.onDestroy(true);
// @reviewURL       http://bbs.kafan.cn/thread-1640643-1-1.html
// @homepageURL     https://github.com/feiruo/userchromejs/
// @note            注意：对于未载入标签，存入的书签名是URL，只有载入之后才能获取标题
// @version         1.2.1
// @version         1.2 修改动作方式，可以通过函数调用实时启用禁用和实时保存
// @version         1.1 修复在没有书签保存的情况下仍然创建一个时间文件夹的问题
// @version         1.0
// ==/UserScript==

/**
 * 参考bookmark_all_onclose(https://j.mozest.com/zh-CN/ucscript/script/58)
 **/
(function() {

  if (window.bookmarkallmod) {
    window.bookmarkallmod.onDestroy();
    delete window.bookmarkallmod;
  }

  var bookmarkallmod = {
    bookmarkallon: true, // 默认是否启用关闭窗口后自动保存，设为false之后可用快捷键调用
    toolbarFolder: false, // 保存在书签工具栏为TRUE  否则保存在书签菜单里
    number: "15", //条目限制，保存次数的上限，多余限制数目会自动删除旧的
    dateParse: "%Y/%m/%d %H:%M:%S", // 日期格式,可以有空格之类的，年：%Y，月：%m，日：%d,，时：%H，分：%M，秒：%S
    //文件目录，可以中文，有节操无下限
    dirs: [
      "Conversations",

    ],
    //不保存的网站，支持部分正则，
    exclude: [
      "chrome://*",
      "resource://*",
      "about:*",
      "http://www.baidu.com/baidu?*",
      "http://www.baidu.com/s?*",
    ],
  };

  bookmarkallmod.init = function() {
    if (bookmarkallmod.bookmarkallon)
      window.addEventListener("unload", bookmarkallmod.bookmarkall, false);
  };

  bookmarkallmod.onDestroy = function() {
    window.removeEventListener("unload", bookmarkallmod.bookmarkall, false);
  };

  bookmarkallmod.bookmarkall = function() {
    var bookmarksService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
    if (bookmarkallmod.toolbarFolder == true) {
      var target_folder = bookmarksService.toolbarFolder;
    } else {
      var target_folder = bookmarksService.bookmarksMenuFolder;
    }
    for (var i = 0; i < bookmarkallmod.dirs.length; i++) {
      for (var j = 0;
        (bookmarksService.getIdForItemAt(target_folder, j) != -1); j++) {
        var temp_folder = bookmarksService.getIdForItemAt(target_folder, j);
        var temp_folder_title = bookmarksService.getItemTitle(temp_folder);
        if (temp_folder_title == bookmarkallmod.dirs[i]) {
          target_folder = temp_folder;
          var k = i;
        }
      }
    }
    if (k == undefined) {
      for (i = 0; i < bookmarkallmod.dirs.length; i++) {
        target_folder = bookmarksService.createFolder(target_folder, bookmarkallmod.dirs[i], 0);
      }
    } else {
      for (i = 1 + k; i < bookmarkallmod.dirs.length; i++) {
        target_folder = bookmarksService.createFolder(target_folder, bookmarkallmod.dirs[i], 0);
      }
    }
    var duoyu = new Array();
    for (var i = 0;
      (bookmarksService.getIdForItemAt(target_folder, i) != -1); i++) {
      var temp_folder = bookmarksService.getIdForItemAt(target_folder, i);
      var temp_folder_title = bookmarksService.getItemTitle(temp_folder);
      duoyu += temp_folder + "-";
    }
    if (i > bookmarkallmod.number - 2) {
      var duoy = duoyu.substring(0, duoyu.lastIndexOf('-'));
      var duo = duoy.split("-");
      for (var m = duo.length - 1; m > bookmarkallmod.number - 2; m--) {
        bookmarksService.removeItem(duo[m]);
      }
    }

    function getDateTime() {
      var now = new Date();
      return now.toLocaleFormat(bookmarkallmod.dateParse);
    }

    var www = new　 Array();
    var browsers = document.getElementById('content').browsers;
    for (var i = 0; i < browsers.length; ++i) {
      var webNav = browsers[i].webNavigation;
      var url = webNav.currentURI.spec;
      var name = "";
      try {
        var doc = webNav.document;
        name = doc.title || url;
      } catch (e) {
        name = url;
      }
      www += url + '::::::::::' + name + ',\n';
    }
    for (var i = 0; i < bookmarkallmod.exclude.length; i++) {
      if (bookmarkallmod.exclude[i].match(/\*/)) {
        var paichu = bookmarkallmod.exclude[i].replace(/\*/, ".*\n");
        paichu = new RegExp(paichu, "g");
      } else {
        var paichu = bookmarkallmod.exclude[i] + ".*\n";
        paichu = new RegExp(paichu, "");
      }
      if (www.match(paichu)) {
        www = www.replace(paichu, "");
      }
    }
    if (www.length != 0) {
      var duoy = www.substring(0, www.lastIndexOf(',\n')).split(',\n');
      target_folder = bookmarksService.createFolder(target_folder, getDateTime(), 0);
      for (i = 0; i < duoy.length; i++) {
        var wwww = duoy[i].substring(0, duoy[i].lastIndexOf('::::::::::'));
        var tttt = duoy[i].substring(10 + duoy[i].indexOf('::::::::::'), duoy[i].length);
        var uri = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService).newURI(wwww, null, null);
        bookmarksService.insertBookmark(target_folder, uri, -1, tttt);
      }
    }
  };

  bookmarkallmod.init();
  window.bookmarkallmod = bookmarkallmod;
})();
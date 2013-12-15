// ==UserScript==
// @name         bookmarkallmod.uc.js
// @description  浏览器退出时保存所有页面
// @homepage       https://github.com/feiruo/userchromejs/
// @author       feiruo
// @include      main
// @charset      utf-8
// @version      1.1
// @note        参考bookmark_all_onclose(https://j.mozest.com/zh-CN/ucscript/script/58)
// @note        保存位置选择和条目限制等
// @note        注意：对于未载入标签，存入的书签名是URL，只有载入之后才能获取标题
// @note        注意：因为最求功能使用了较多循环，可能造成进程延迟退出
// @note        1.1 修复在没有书签保存的情况下仍然创建一个时间文件夹的问题
// @note        1.0
// ==/UserScript==
(function () {
var pref={
bookmarkallon:true,				                        	// 默认是否启用关闭窗口后自动保存，设为false之后可用快捷键调用
toolbarFolder:false,					                         // 保存在书签工具栏为TRUE  否则保存在书签菜单里
number:"15",                                            //条目限制，保存次数的上限，多余限制数目会自动删除旧的
savekey:"shift+alt+b",                                        //立刻保存
switchkey:"shift+alt+n",                                    //实时启用禁用本次浏览保存，下次启动恢复bookmarkallon设定的值
dateParse:"%Y/%m/%d %H:%M:%S",				// 日期格式,可以有空格之类的，年：%Y，月：%m，日：%d,，时：%H，分：%M，秒：%S
//文件目录，不限制下级目录个数，没有会自动创建目录树
dirs:[
"Conversations",//一级目录
//"Session",//二级目录
//"三级目录",
//"4つのディレクトリ",//四级目录
//"五级目录",
],
//不保存的网站，支持部分正则，
exclude:[
"chrome://*",
"about:*",
"http://www.baidu.com/baidu?*",
"http://www.baidu.com/s?*",
],
/***
*   若要禁用快捷键, 请设为空字符""或数字0，或删除下面注释的行
*   用加号组合快捷键, 支持Ctrl|Alt|Shift三个组合键, 不分大小写
*   若你所设置的按键无效, 可尝试将最后一位换成按键的keyCode(数字)
*   获取keyCode的方法: 在浏览器地址栏输入以下代码并回车, 然后按下你所需的键
*   javascript:void(document.addEventListener('keydown',function(e){alert(String.fromCharCode(e.keyCode)+' : '+e.keyCode)},!1))
***/
};
savekey();//立即保存快捷键
switchkey();//实时开关快捷键
switchs();
function bookmarkall(){
var bookmarksService=Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);
if(pref.toolbarFolder==true){
   var target_folder=bookmarksService.toolbarFolder;
}else{
   var target_folder=bookmarksService.bookmarksMenuFolder;
    }
for(var i=0;i<pref.dirs.length;i++){
for(var j=0;(bookmarksService.getIdForItemAt(target_folder,j)!=-1);j++){
var temp_folder=bookmarksService.getIdForItemAt(target_folder,j);
var temp_folder_title=bookmarksService.getItemTitle(temp_folder);
if(temp_folder_title==pref.dirs[i]){
target_folder=temp_folder;
var k=i;}
}
}
if(k== undefined){
for(i=0;i<pref.dirs.length;i++){
target_folder=bookmarksService.createFolder(target_folder,pref.dirs[i],0);
}}else{
for(i=1+k;i<pref.dirs.length;i++){target_folder=bookmarksService.createFolder(target_folder,pref.dirs[i],0);
}
}
var duoyu=new Array();
for(var i=0;(bookmarksService.getIdForItemAt(target_folder,i)!=-1);i++){
    var temp_folder=bookmarksService.getIdForItemAt(target_folder,i);
    var temp_folder_title=bookmarksService.getItemTitle(temp_folder);
    duoyu+=temp_folder+"-";
 }
    if(i>pref.number-2){
var duoy=duoyu.substring(0,duoyu.lastIndexOf('-'));
var duo=duoy.split("-");
for(var m=duo.length-1; m>pref.number-2;m--){
bookmarksService.removeItem(duo[m]);
}
}
function getDateTime(){
	var now=new Date();
	return now.toLocaleFormat(pref.dateParse);
}

var www=new　Array();
var browsers=document.getElementById('content').browsers;
for(var i=0;i<browsers.length;++i){
var webNav=browsers[i].webNavigation;
var url=webNav.currentURI.spec;
var name="";
try{
var doc=webNav.document;
name=doc.title||url;
}catch(e){name=url;}
www+=url+'::::::::::'+name+',\n';
}
for(var i=0;i<pref.exclude.length;i++){
    if(pref.exclude[i].match(/\*/)){
    var paichu=pref.exclude[i].replace(/\*/,".*\n");
          paichu=new RegExp(paichu,"g");
    }else{
    var paichu=pref.exclude[i]+".*\n";
          paichu=new RegExp(paichu,"");
    }
    if(www.match(paichu)){
    www=www.replace(paichu,"");
    }
}
if(www.length!=0){
var duoy=www.substring(0,www.lastIndexOf(',\n')).split(',\n');
target_folder=bookmarksService.createFolder(target_folder,getDateTime(),0);
for(i=0;i<duoy.length;i++){
    var wwww=duoy[i].substring(0,duoy[i].lastIndexOf('::::::::::'));
    var tttt=duoy[i].substring(10+duoy[i].indexOf('::::::::::'),duoy[i].length);
var uri = Cc["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService).newURI(wwww, null, null);
bookmarksService.insertBookmark(target_folder, uri, -1, tttt);
}
}}

function savekey(){
var r=/^(?:alt|ctrl|meta|shift)$/i,keys=pref.savekey.split('+').map(function(t){return+(t=t.trim())||(t.length<3?t.toUpperCase().charCodeAt():r.test(t)?t.toLowerCase()+'Key':0)}).filter(function(t){return t});
window.addEventListener('keyup',function(e,t){
(t=e.target).contentEditable=='true'||
keys.some(function(t){return!e[t]&&t!=e.keyCode})||
(bookmarkall(),e.preventDefault(),e.stopPropagation())
}, false);
}

function switchkey(){
var r=/^(?:alt|ctrl|meta|shift)$/i,keys=pref.switchkey.split('+').map(function(t){return+(t=t.trim())||(t.length<3?t.toUpperCase().charCodeAt():r.test(t)?t.toLowerCase()+'Key':0)}).filter(function(t){return t});
window.addEventListener('keyup',function(e,t){
(t=e.target).contentEditable=='true'||
keys.some(function(t){return!e[t]&&t!=e.keyCode})||
(switchs(),e.preventDefault(),e.stopPropagation())
}, false);
}

function switchs(){
if(pref.bookmarkallon==true){
window.addEventListener("unload",bookmarkall, false);
pref.bookmarkallon=false;
}else{
window.removeEventListener("unload",bookmarkall, false);
pref.bookmarkallon=true;
}
}
})();
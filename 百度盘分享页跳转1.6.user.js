// ==UserScript==
// @name         百度盘分享页跳转
// @description 百度盘分享失效页面自动转到分享页,加密分享链接快捷键跳转到分享页
// @author       feiruo
// @version      1.6
// @updateURL      http://userscripts.org/scripts/source/180469.meta.js
// @downloadURL    http://userscripts.org/scripts/source/180469.user.js
// @include      http://pan.baidu.com/share/link?*
// @include      http://pan.baidu.com/share/init?*
// @include      http://pan.baidu.com/s/*
// @run-at       document-end
// @grant		none
// ==/UserScript==
var gethomekey = "Alt+o"; //快捷键，不限大小写支持三键 如：Shift+Alt+o；
//无效链接自动跳转到分享主页，有效连接就显示时间..............无效的短链就没办法了..
if (document.title.match("百度云 网盘-链接不存在")) {
    if (location.search.split('?')[1].match("&uk=")) {
        document.location.href = document.location.href.replace(/link\?shareid=(\d+)\&uk=(\d+)[\s\S]*/g, "home?uk=$2#category/type=0");
    } else {
        document.location.href = document.location.href.replace(/link\?uk=(\d+)\&shareid=(\d+)[\s\S]*/g, "home?uk=$1#category/type=0");
    }
}

var r=/^(?:alt|ctrl|meta|shift)$/i,keys=gethomekey.split('+').map(function(t){return+(t=t.trim())||(t.length<3?t.toUpperCase().charCodeAt():r.test(t)?t.toLowerCase()+'Key':0)}).filter(function(t){return t});
window.addEventListener('keyup',function(e,t){
(t=e.target).contentEditable=='true'||
keys.some(function(t){return!e[t]&&t!=e.keyCode})||
(gethome(),e.preventDefault(),e.stopPropagation())
}, false);
function gethome(){
if (document.title.match("请输入提取密码")){
        document.location.href = document.location.href.replace(/init\?shareid=(\d+)\&uk=(\d+)[\s\S]*/g, "home?uk=$2#category/type=0");
    } else {
document.location.href = ('http://pan.baidu.com/share/home?uk=' + document.all[0].innerHTML.match(/sysUK="(\d+)"/)[1] + '#category/type=0');
}
}
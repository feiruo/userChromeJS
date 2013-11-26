var anobtnset = {
//按钮放在哪个id之前，alltabs-button，back-button等
intags:"tabbrowser-tabs",  
//按钮图标,必须设置
image:"chrome://branding/content/icon16.png",
};
/*
child:[  ]内为当前菜单的下一级菜单配置
text 为运行参数，如果无需参数，直接删除text属性
exec 为打开路径，可以是任意文件和文件夹，支持相对路径，相对于配置文件夹；
文件夹不支持直接“\\”开头的相对路径，需要用“Services.dirsvc.get("ProfD", Ci.nsILocalFile).path”开头
oncommand 可以用function(){}；
----
除了以上属性外，可以自定义添加其他属性，如果快捷键accesskey等
----
如果设置了id属性，会尝试获取此id并移动，如果在浏览器中没有找到此id，则创建此id
*/

//下面添加菜单
var anomenu = [
 {
label: '外部程序',
image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAbklEQVQ4je3TXwqAIAzAYe+VsP32pvc/QuQx7KmIAm39eYkGwz3IB24zhCdDRBIwmVn1JDCJSFqhK8gWW6HeZVWN+3Opzayehnr5HqSq8eyAmk/zTvuHPgV59ggYDtDNT1u2UAbKBWgEsrclzZgBLQgC98zNgUMAAAAASUVORK5CYII=",
child: [
	{
		label: "测试配置1",
		text: "-no-remote -profile ProfileTest",
		exec: Services.dirsvc.get("ProfD", Ci.nsILocalFile).path + "\\..\\firefox.exe",
	},
		{
		label: "测试配置2",
		text: "-no-remote -profile ProfileTest",
		exec: "\\..\\firefox.exe",
	},
			{
		label: "配置文件夹",
		exec: Services.dirsvc.get("ProfD", Ci.nsILocalFile).path,
	},
{},// 分隔条
	{
		label: " 启动 Internet Explorer",
		exec: "C:\\Program Files\\Internet Explorer\\iexplore.exe"
	},
	{
		label: " Internet Explorer 打开此页",
		text: "%u",
		exec: "C:\\Program Files\\Internet Explorer\\iexplore.exe"
	},
	]}, 
{
label:"常用功能",
child: [
{
label: "安全模式",
oncommand: "safeModeRestart();",
image : "chrome://mozapps/skin/extensions/alerticon-warning.png",
},
]},
//移动 工具 菜单
{
id: "tools-menu", 
label: "工具菜单",
image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcElEQVQ4jdWTQQ6AIAwE+drs33gxaMIJL2oMIKnVi5v0QNIObboN4SIgAgmIwSNglVSB5AJ4f41AklQNkbvxJBVj8QnpOpCUn0Bco5oAs6QfAtqC9j107N1KR4ChY/eVLkZAb6qZvvBBeXVoh2Pbtjdof7mCLHWekwAAAABJRU5ErkJggg==",
accesskey: "",
},
{
label: "书签管理",
oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');",
image:"chrome://mozapps/skin/extensions/rating-not-won.png"
},
{
label: '谷歌站內搜索',
command: function() {
gBrowser.loadURI("javascript:q%20=%20%22%22%20+%20(window.getSelection%20?%20window.getSelection()%20:%20document.getSelection%20?%20document.getSelection()%20:%20document.selection.createRange().text);%20if%20(!q)%20q%20=%20prompt(%22%E8%AF%B7%E8%BE%93%E5%85%A5%E5%85%B3%E9%94%AE%E8%AF%8D:%22,%20%22%22);%20if%20(q!=null)%20{var%20qlocation=%22%20%22;qlocation=('http://www.google.com/search?num=30&amp;hl=zh-CN&amp;newwindow=1&amp;q='+q+'&amp;sitesearch='+location.host+'');window.open(qlocation);}%20void%200")
}
}, 
]
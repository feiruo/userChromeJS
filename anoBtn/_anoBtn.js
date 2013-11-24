var anobtnset = {
//按钮放在哪个id之前，alltabs-button，back-button等
intags:"tabbrowser-tabs",  
//按钮图标，可以是base64
image:"chrome://branding/content/icon16.png",
};

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
{},// 分隔条
	{
		label: " Internet Explorer 打开此页",
		text: "%u",
		exec: "C:\\Program Files\\Internet Explorer\\iexplore.exe"
	},
	]}, 
	
{
label:"常用功能",
image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAgUlEQVQ4jdVTwQ2AIAx0A0ZwFD/3Ilc6EqMxkiPow9SACphoTGxyj9K7a9rQYTgEGaKILlcgQzzyiwDgamLDSdQTdA1fMJBpgz1aXkPJO43SXFKLlxdEdBbROavt+TcGj0d4bPDzHdQOBoDLD817PxYEUtPd70tqqnTom5CaADjTrW77Ai0wH7nFAAAAAElFTkSuQmCC",
child: [
{
label: "打开文件",
oncommand:"BrowserOpenFileWindow();",
image : "chrome://browser/skin/places/query.png"
},
{
label: "隐私浏览",
oncommand:"OpenBrowserWindow({private: true});",
image : "chrome://browser/skin/Privacy-16.png"
},
{},
{
label: "故障排除",
oncommand: "getBrowser().selectedTab = getBrowser().addTab ('about:support')",
image:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzklEQVQ4jc1SyQnDMBDcDhSBtXqmBD8MtrQflWAICGlfLsUluASX5BJSgktwXgH5iBKCIRnQZ9kZaUYD8HeopBeEcSTkmTQvpHkh5JkwjpX0IktudGhXxO1Bnhsd2kOyUdyliwZjbwvvbOGdwdinwkZxlyXXGMrtBTWG8lCkxlCmzzQYewAAg7HPzUjzYgvvwOp43w0BYOsfAMAW3q12dbwDIU/fChDytPf2qYU0q1chVtILutyu2RBP+cZTivREJb2wKgzbKlsVhrdV/gkeMqXAlXes4XwAAAAASUVORK5CYII=" 
},
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
accesskey: "",
},
{
label: "书签管理",
oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');",
image:"chrome://mozapps/skin/extensions/rating-not-won.png"
},
{
id:"appmenu-quit",
label: "退出浏览器",
oncommand:"Application.quit();",
image:"chrome://branding/content/icon16.png"
}
]
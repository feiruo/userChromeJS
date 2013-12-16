showFlagS
============
author：ywzhaiqi、feiruo<br /> 
参考 Show Location 扩展、Flagfox 扩展、http://files.cnblogs.com/ziyunfei/showFlag.uc.js<br /> 
脚本里面可以修改图标位置等。<br /> 
本地数据库位置)<br />
Chrome\lib\countryflags.js<br />
国旗图标左键复制内容，中键刷新，右键弹出菜单。<br /> 
可选择查询地址，目前内置4个，可以自己在脚本里面添加。<br /> 
注意：<br /> 
myip地址是从myip网站获得图标，不使用本地图标，所以略有延迟；而且myip不稳定
就算选择在线图标，也是优先使用本地数据库<br /> 
脚本不带样式，推荐使用样式隐藏page-proxy-favicon，可以用下面的样式：)<br />
	#page-proxy-favicon,#identity-icon-country-label{visibility: collapse !important;}
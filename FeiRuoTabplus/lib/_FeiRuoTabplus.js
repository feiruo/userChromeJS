/******************************************************************************************
 *FeiRuoTabPlus 自定义行为
 *******************************************************************************************/
var CustomCommand = [{
	//命令的说明文字
	label: "站内搜索",
	//作用域，Tab表示在只在标签上执行该行为，TabBar表示在只在标签栏上执行该行为
	Tag: "Tab TabBar",//表示标签和标签栏上都作用
	//鼠标行为，Click表示在只在鼠标点击事件执行该行为，Scroll表示在只在鼠标滚动事件执行该行为
	Mouse: "Click Scroll",//表示点击和滚动都作用
	//gBrowser.mTabContainer，监听附着节点，请慎重
	gBrowser: "mTabContainer",//tabContainer
	//自定义行为
	Command: function(e) {//e为通过鼠标和辅助键等判断之后传回的event
		var s = prompt('站内搜索——请输入待搜索字符串', '');
		if (s.length > 0)
			gBrowser.addTab('http://www.google.com/search?q=site:' + encodeURIComponent(content.location.host) + ' ' + encodeURIComponent(s));
	}
}, {
	label: "打开chrome文件夹",
	Tag: "Tab TabBar",
	Mouse: "Click Scroll",
	gBrowser: "mTabContainer",
	Command: function(e) {
		Cc["@mozilla.org/file/directory_service;1"].
		getService(Ci.nsIProperties).
		get("UChrm", Ci.nsILocalFile).launch();
	}
}, {
	label: "复制URL和标题",
	Tag: "Tab TabBar",
	Mouse: "Click Scroll",
	gBrowser: "mTabContainer",
	Command: function(e) {
		Components.classes["@mozilla.org/widget/clipboardhelper;1"].
		getService(Components.interfaces.nsIClipboardHelper).
		copyString(content.document.title.replace(/\s-\s.*/i, "")
			.replace(/_[^\[\]【】]+$/, "") + "\n" + content.location);
	}
}];
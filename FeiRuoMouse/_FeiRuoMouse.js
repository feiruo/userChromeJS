/******************************************************************************************
 *FeiRuoMouse 自定义命令
 Image:FeiRuoMouse.DragScript.Image(event);
 Text:FeiRuoMouse.DragScript.Text(event);
 url-1:FeiRuoMouse.DragScript.Url(event);
 url-2:FeiRuoMouse.DragScript.Url2(event);
 *******************************************************************************************/
var CustomCommand = [{
	label: "页面放大重置",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		var docViewer = gBrowser.selectedBrowser.markupDocumentViewer;
		if (docViewer.fullZoom == 1) {
			docViewer.fullZoom = 1.6;
		} else {
			docViewer.fullZoom = 1;
		}
	}
}, {
	label: "新建标签", //命令的说明文字
	ActionType: "Gestures", //鼠标手势命令
	Type: "", //当ActionType有Drag(拖拽命令)时生效，拖拽的目标
	command: function(event) { //自定义命令，event为回传事件
		BrowserOpenTab();
	}
}, {
	label: "转到页面顶部", //命令的说明文字
	ActionType: "Gestures", //鼠标手势命令
	Type: "", //当ActionType有Drag(拖拽命令)时生效，拖拽的目标
	command: function(event) { //自定义命令，event为回传事件
		var doc = event.target.ownerDocument;
		var win = doc.defaultView;
		goDoCommand('cmd_scrollTop');
	}
}, {
	label: "当前标签打开图片", //命令的说明文字
	ActionType: "Drag", //鼠标拖拽命令
	Type: "Image", //当ActionType有Drag时生效，拖拽图片时的命令
	command: function(event) {
		loadURI(event.dataTransfer.getData("application/x-moz-file-promise-url"));
	}
}, {
	label: "新标签打开图片(前台)",
	ActionType: "Drag",
	Type: "Image",
	command: function(event) {
		gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("application/x-moz-file-promise-url"));
	}
}, {
	label: "当前标签打开图片链接",
	ActionType: "Drag",
	Type: "Image",
	command: function(event) {
		loadURI(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
	}
}, {
	label: "新标签打开图片链接(前台)",
	ActionType: "Drag",
	Type: "Image",
	command: function(event) {
		gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
	}
}, {
	label: "复制图片地址",
	ActionType: "Drag",
	Type: "Image",
	command: function(event) {
		Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("application/x-moz-file-promise-url"));
	}
}, {
	label: "下载图片",
	ActionType: "Drag",
	Type: "Image",
	command: function(event) {
		saveImageURL(event.dataTransfer.getData("application/x-moz-file-promise-url"), null, null, null, null, null, null, document);
	}
}, {
	label: "下载图片(不弹窗)",
	ActionType: "Drag",
	Type: "Image",
	command: function(event) {
		saveImageURL(event.dataTransfer.getData("application/x-moz-file-promise-url"), null, null, null, null, true, null, document);
	}
}, {
	label: "下载图片(指定位置不弹窗))",
	ActionType: "Drag",
	Type: "Image",
	command: function(event) {
		var path = "c:";
		var uri = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(event.dataTransfer.getData("application/x-moz-file-promise-url"), null, null)
		var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
		file.initWithPath(path);
		file.append(getDefaultFileName(null, uri));
		internalSave(null, null, null, null, null, null, null, null, {
			file: file,
			uri: uri
		}, null, internalSave.length === 12 ? document : true, internalSave.length === 12 ? true : null, null);
	}
}, {
	label: "搜索相似图片(全部引擎)",
	ActionType: "Drag",
	Type: "Image",
	command: function(event) {
		gBrowser.addTab('http://www.tineye.com/search/?pluginver=firefox-1.0&sort=size&order=desc&url=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
		gBrowser.addTab('http://stu.baidu.com/i?rt=0&rn=10&ct=1&tn=baiduimage&objurl=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
		gBrowser.addTab('http://www.google.com/searchbyimage?image_url=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
		gBrowser.addTab('http://pic.sogou.com/ris?query=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
	}
}, {
	label: "当前标签打开链接",
	ActionType: "Drag",
	Type: "Url",
	command: function(event) {
		loadURI(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
	}
}, {
	label: "新标签打开链接(前台)",
	ActionType: "Drag",
	Type: "Url",
	command: function(event) {
		gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
	}
}, {
	label: "搜索框搜索链接文字(前台)",
	ActionType: "Drag",
	Type: "Url",
	command: function(event) {
		gBrowser.selectedTab = gBrowser.addTab();
		BrowserSearch.loadSearch(event.dataTransfer.getData("text/x-moz-url").split("\n")[1], false);
	}
}, {
	label: "复制链接",
	ActionType: "Drag",
	Type: "Url",
	command: function(event) {
		Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
	}
}, {
	label: "复制链接文字",
	ActionType: "Drag",
	Type: "Url",
	command: function(event) {
		Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]);
	}
}, {
	label: "下载链接",
	ActionType: "Drag",
	Type: "Url",
	command: function(event) {
		saveImageURL(event.dataTransfer.getData("text/x-moz-url").split("\n")[0], null, null, null, null, null, null, document);
	}
}, {
	label: "下载链接(不弹窗)",
	ActionType: "Drag",
	Type: "Url",
	command: function(event) {
		saveImageURL(event.dataTransfer.getData("text/x-moz-url").split("\n")[0], null, null, null, null, true, null, document);
	}
}, {
	label: "搜索框搜索选中文字(后台)[识别URL并打开]",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		var Text = FeiRuoMouse.DragScript.Text(event);
		(FeiRuoMouse.DragScript.SeeAsURL(Text) && gBrowser.addTab(Text)) || BrowserSearch.loadSearch(Text, true);
	}
}, {
	label: "搜索框搜索选中文字(前台)[识别URL并打开]",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		var Text = FeiRuoMouse.DragScript.Text(event);
		(FeiRuoMouse.DragScript.SeeAsURL(Text) && (gBrowser.selectedTab = gBrowser.addTab(Text))) || ((gBrowser.selectedTab = gBrowser.addTab()) & BrowserSearch.loadSearch(Text, false));
	}
}, {
	label: "弹出搜索框(前台)",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		var popup = document.getAnonymousElementByAttribute(document.querySelector("#searchbar").searchButton, "anonid", "searchbar-popup");
		var text = FeiRuoMouse.DragScript.Text(event);
		var serach = function() {
			popup.removeEventListener("command", serach, false);
			popup.removeEventListener("popuphidden", closeSerach, false)
			setTimeout(function(selectedEngine) {
				gBrowser.selectedTab = gBrowser.addTab();
				BrowserSearch.loadSearch(text, false);
				popup.querySelectorAll("#" + selectedEngine.id)[0].click();
			}, 10, popup.querySelector("*[selected=true]"))
		}
		var closeSerach = function() {
			popup.removeEventListener("command", serach, false);
			popup.removeEventListener("popuphidden", closeSerach, false)
		}
		popup.addEventListener("command", serach, false)
		popup.addEventListener("popuphidden", closeSerach, false)
		popup.openPopup(null, null, event.screenX - 100, event.screenY - 100);
	}
}, {
	label: "弹出搜索框(后台)",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		var popup = document.getAnonymousElementByAttribute(document.querySelector("#searchbar").searchButton, "anonid", "searchbar-popup");
		var text = event.dataTransfer.getData("text/unicode");
		var serach = function() {
			popup.removeEventListener("command", serach, false);
			popup.removeEventListener("popuphidden", closeSerach, false)
			setTimeout(function(selectedEngine) {
				BrowserSearch.loadSearch(text, true);
				popup.querySelectorAll("#" + selectedEngine.id)[0].click();
			}, 10, popup.querySelector("*[selected=true]"))
		}
		var closeSerach = function() {
			popup.removeEventListener("command", serach, false);
			popup.removeEventListener("popuphidden", closeSerach, false)
		}
		popup.addEventListener("command", serach, false)
		popup.addEventListener("popuphidden", closeSerach, false)
		popup.openPopup(null, null, event.screenX - 100, event.screenY - 100);
	}
}, {
	label: "搜索框搜索选中文字(站内)(前台)",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		gBrowser.selectedTab = gBrowser.addTab();
		BrowserSearch.loadSearch("site:" + content.location.host + " " + event.dataTransfer.getData("text/unicode"), false);
	}
}, {
	label: "搜索框搜索选中文字(站内)(后台)",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		BrowserSearch.loadSearch("site:" + content.location.host + " " + event.dataTransfer.getData("text/unicode"), true);
	}
}, {
	label: "复制文本",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/unicode"));
	}
}, {
	label: "Google翻译文本",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		var div = content.document.documentElement.appendChild(content.document.createElement("div"));
		div.style.cssText = "position:absolute;z-index:1000;border-left:solid 0.5px #0000AA;border-top:solid 1px #0000AA;border-right:solid 2.5px #0000AA;border-bottom:solid 2px #0000AA;background-color:white;padding-left:5px;padding: 1pt 3pt 1pt 3pt;font-size: 10pt;color: black;left:" + +(event.clientX + content.scrollX + 10) + 'px;top:' + +(event.clientY + content.scrollY + 10) + "px";
		var xmlhttp = new XMLHttpRequest;
		xmlhttp.open("get", "http://translate.google.cn/translate_a/t?client=t&hl=zh-CN&sl=auto&tl=zh-CN&text=" + event.dataTransfer.getData("text/unicode"), 0);
		xmlhttp.send();
		div.textContent = eval("(" + xmlhttp.responseText + ")")[0][0][0];
		content.addEventListener("click", function() {
			content.removeEventListener("click", arguments.callee, false);
			div.parentNode.removeChild(div);
		}, false);
	}
}, {
	label: "按URL打开文本",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/unicode"));
	}
}, {
	label: "打开查找栏搜索文本",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		gFindBar._findField.value = event.dataTransfer.getData("text/unicode");
		gFindBar.open();
		gFindBar.toggleHighlight(1);
	}
}, {
	label: "不打开查找栏搜索文本",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		gFindBar._findField.value = event.dataTransfer.getData("text/unicode");
		gFindBar.toggleHighlight(1);
	}
}, {
	label: "下载文字",
	ActionType: "Drag",
	Type: "Text",
	command: function(event) {
		saveImageURL('data:text/plain;charset=UTF-8;base64,' + btoa(unescape(encodeURIComponent(event.dataTransfer.getData("text/unicode")))), event.dataTransfer.getData("text/unicode").slice(0, 5) + ".txt", null, null, null, null, null, document);
	}
}, {
	label: "转到页面底部",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		var doc = event.target.ownerDocument;
		var win = doc.defaultView;
		goDoCommand('cmd_scrollBottom');
	}
}, {
	label: "后退/上一页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		//var nav = gBrowser.webNavigation;
		//if (nav.canGoBack) nav.goBack();
		//else nextPage.next();
		var nav = gBrowser.webNavigation;
		if (nav.canGoBack) {
			nav.goBack();
		} else {
			try {
				nextPage.next();
			} catch (ex) {
				var document = window.content ? window._content.document : gBrowser.selectedBrowser.contentDocumentAsCPOW;
				var links = document.links;
				for (i = 0; i < links.length; i++) {
					if (links[i].text.match(/^上一/)) document.location = links[i].href;
					//if ((links[i].text == '上一頁') || (links[i].text == '上一页') || (links[i].text == '上一个') || (links[i].text == '<上一页') || (links[i].text == '« 上一页') || (links[i].text == '<<上一页') || (links[i].text == '[上一页]') || (links[i].text == '翻上页') || (links[i].text == '【上一页】') || (links[i].text == 'Previous') || (links[i].text == 'Prev') || (links[i].text == 'previous') || (links[i].text == 'prev') || (links[i].text == '‹‹') || (links[i].text == '<')) document.location = links[i].href;
				}
			}
		}
	}
}, {
	label: "前进/下一页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		//var nav = gBrowser.webNavigation;
		//if (nav.canGoForward) nav.goForward();
		//else nextPage.next(true);
		var nav = gBrowser.webNavigation;
		if (nav.canGoForward) {
			nav.goForward();
		} else {
			try {
				nextPage.next(true);
			} catch (ex) {
				var document = window.content ? window._content.document : gBrowser.selectedBrowser.contentDocumentAsCPOW;
				var links = document.links;
				for (i = 0; i < links.length; i++) {
					if (links[i].text.match(/^下一|^Next?|^next?/)) document.location = links[i].href;
					//if ((links[i].text == '下一頁') || (links[i].text == '下一页') || (links[i].text == '下一个') || (links[i].text == '下一页>') || (links[i].text == '下一页 »') || (links[i].text == '下一页>>') || (links[i].text == '[下一页]') || (links[i].text == '翻下页') || (links[i].text == '【下一页】') || (links[i].text == 'Next') || (links[i].text == 'next') || (links[i].text == '››') || (links[i].text == '>')) document.location = links[i].href;
				}
			}
		}
	}
}, {
	label: "转到左边标签页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		gBrowser.mTabContainer.advanceSelectedTab(-1, true);
	}
}, {
	label: "转到右边标签页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		gBrowser.mTabContainer.advanceSelectedTab(+1, true);
	}
}, {
	label: "关闭当前标签页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		gBrowser.removeCurrentTab();
	}
}, {
	label: "撤销关闭标签页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		try {
			document.getElementById('History:UndoCloseTab').doCommand();
		} catch (ex) {
			if ('undoRemoveTab' in gBrowser) gBrowser.undoRemoveTab();
			else throw "Session Restore feature is disabled."
		}
	}
}, {
	label: "最小化窗口",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		window.minimize();
	}
}, {
	label: "刷新",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		document.getElementById("Browser:Reload").doCommand();
	}
}, {
	label: "强制刷新",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		document.getElementById("Browser:ReloadSkipCache").doCommand();
	}
}, {
	label: "最大化/恢复窗口",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		window.windowState == 1 ? window.restore() : window.maximize();
	}
}, {
	label: "清除startupCache并重启浏览器",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		Services.appinfo.invalidateCachesOnRestart() || Application.restart();
	}
}, {
	label: "关闭其他标签页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		gBrowser.removeAllTabsBut(gBrowser.mCurrentTab);
	}
}, {
	label: "关闭左侧所有标签页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		var tabs = gBrowser.mTabContainer.childNodes;
		for (var i = tabs.length - 1; tabs[i] != gBrowser.mCurrentTab; i--) {}
		for (i--; i >= 0; i--) {
			gBrowser.removeTab(tabs[i]);
		}
	}
}, {
	label: "关闭右侧所有标签页",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		var tabs = gBrowser.mTabContainer.childNodes;
		for (var i = tabs.length - 1; tabs[i] != gBrowser.selectedTab; i--) {
			gBrowser.removeTab(tabs[i]);
		}
	}
}, {
	label: "重置缩放",
	ActionType: "Gestures",
	Type: "",
	command: function(event) {
		FullZoom.reset();
	}
}];
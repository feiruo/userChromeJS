/******************************************************************************************
 *FeiRuoMouse 自定义鼠标手势命令
 *支持自定义脚本，内容直接置于command 函数内;
 *******************************************************************************************/
var GesCustomCommand = [
	//示例：
	{
		label: "GrabScroll4", //命令的说明文字
		command: function(event) { //自定义命令，event为回传事件
			document.getElementById('GrabScroll_enable').click();
		}
	}, {
		label: "WHT",
		command: function(event) {
			gWHT.destroyToolbar();
		}
	}, {
		label: "后退/上一页",
		command: function(event) {
			// getWebNavigation().canGoBack && getWebNavigation().goBack();
			var nav = gBrowser.webNavigation;
			if (nav.canGoBack) {
				nav.goBack();
			} else {
				try {
					nextPage.next();
				} catch (ex) {
					var doc = event.target.ownerDocument;
					// var win = doc.defaultView;
					// var document = window.content ? window._content.document : gBrowser.selectedBrowser.contentDocumentAsCPOW;
					var links = doc.links;
					for (i = 0; i < links.length; i++) {
						if (links[i].text.match(/^(\[|【)?上一|^Prev?|^<$|^<<$|^«$/i))
							doc.location = links[i].href;
						// if (
						// 	(links[i].text == '上一頁') ||
						// 	(links[i].text == '上一页') ||
						// 	(links[i].text == '上一个') ||
						// 	(links[i].text == '<上一页') ||
						// 	(links[i].text == '« 上一页') ||
						// 	(links[i].text == '<<上一页') ||
						// 	(links[i].text == '[上一页]') ||
						// 	(links[i].text == '翻上页') ||
						// 	(links[i].text == '【上一页】') ||
						// 	(links[i].text == 'Previous') ||
						// 	(links[i].text == 'Prev') ||
						// 	(links[i].text == 'previous') ||
						// 	(links[i].text == 'prev') ||
						// 	(links[i].text == '‹‹') ||
						// 	(links[i].text == '<')
						// )
						// 	doc.location = links[i].href;
					}
				}
			}
		}
	}, {
		label: "前进/下一页",
		command: function(event) {
			// getWebNavigation().canGoForward && getWebNavigation().goForward();
			var nav = gBrowser.webNavigation;
			if (nav.canGoForward) {
				nav.goForward();
			} else {
				try {
					nextPage.next(true);
				} catch (ex) {
					var doc = event.target.ownerDocument;
					// var win = doc.defaultView;
					// var document = window.content ? window._content.document : gBrowser.selectedBrowser.contentDocumentAsCPOW;
					var links = doc.links;
					for (i = 0; i < links.length; i++) {
						if (links[i].text.match(/^(\[|【)?下一|^Next?|^>$|^>>$|^»$/i))
							doc.location = links[i].href;
						// if (
						// 	(links[i].text == '下一頁') ||
						// 	(links[i].text == '下一页') ||
						// 	(links[i].text == '下一个') ||
						// 	(links[i].text == '下一页>') ||
						// 	(links[i].text == '下一页 »') ||
						// 	(links[i].text == '下一页>>') ||
						// 	(links[i].text == '[下一页]') ||
						// 	(links[i].text == '翻下页') ||
						// 	(links[i].text == '【下一页】') ||
						// 	(links[i].text == 'Next') ||
						// 	(links[i].text == 'next') ||
						// 	(links[i].text == '››') ||
						// 	(links[i].text == '>')
						// )
						// 	doc.location = links[i].href;
					}
				}
			}
		}
	}, {
		label: "最大化/恢复窗口",
		command: function(event) {
			window.windowState == 1 ? window.restore() : window.maximize();
		}
	}, {
		label: "重置缩放",
		command: function(event) {
			FullZoom.reset();
		}
	}, {
		label: "打开新标签",
		command: function(event) {
			BrowserOpenTab();
		}
	}, {
		label: "打开主页",
		command: function(event) {
			BrowserHome();
		}
	}, {
		label: "新标签打开指定网址(前台)",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab("www.abc.com");
		}
	}, {
		label: "新标签打开指定网址(后台)",
		command: function(event) {
			gBrowser.addTab("www.abc.com");
		}
	}, {
		label: "关闭当前标签",
		command: function(event) {
			gBrowser.removeCurrentTab();
		}
	}, {
		label: '关闭左侧所有标签页',
		command: function(event) {
			var tabs = gBrowser.mTabContainer.childNodes;
			for (var i = tabs.length - 1; tabs[i] != gBrowser.mCurrentTab; i--) {}
			for (i--; i >= 0; i--) {
				gBrowser.removeTab(tabs[i]);
			}
		}
	}, {
		label: "关闭左边的标签页",
		command: function(event) {
			gBrowser.visibleTabs.indexOf(gBrowser.mCurrentTab) == 0 || gBrowser.removeTab(gBrowser.visibleTabs[gBrowser.visibleTabs.indexOf(gBrowser.mCurrentTab) - 1]);
		}
	}, {
		label: '关闭右侧所有标签页',
		command: function(event) {
			var tabs = gBrowser.mTabContainer.childNodes;
			for (var i = tabs.length - 1; tabs[i] != gBrowser.selectedTab; i--) {
				gBrowser.removeTab(tabs[i]);
			}
		}
	}, {
		label: "关闭右边的标签页",
		command: function(event) {
			gBrowser.visibleTabs.indexOf(gBrowser.mCurrentTab) + 1 < gBrowser.visibleTabs.length && gBrowser.removeTab(gBrowser.visibleTabs[gBrowser.visibleTabs.indexOf(gBrowser.mCurrentTab) + 1]);
		}
	}, {
		label: "关闭其他标签页",
		command: function(event) {
			gBrowser.removeAllTabsBut(gBrowser.mCurrentTab);
		}
	}, {
		label: "关闭其他标签页(包括其他标签页组)",
		command: function(event) {
			Array.filter(gBrowser.mTabs, function(tab) {
				return tab != gBrowser.mCurrentTab;
			}).forEach(function(tab) {
				gBrowser.removeTab(tab);
			})
		}
	}, {
		label: "关闭所有标签页",
		command: function(event) {
			gBrowser.removeAllTabsBut(gBrowser.mCurrentTab);
			gBrowser.removeCurrentTab();
		}
	}, {
		label: "关闭所有标签页(包括其他标签页组)",
		command: function(event) {
			while (gBrowser.mTabs.length > 1)
				gBrowser.removeTab(gBrowser.mTabs[0]);
			gBrowser.removeCurrentTab();
		}
	}, {
		label: "恢复关闭的标签页",
		command: function(event) {
			// undoCloseTab();
			try {
				document.getElementById('History:UndoCloseTab').doCommand();
			} catch (ex) {
				if ('undoRemoveTab' in gBrowser) gBrowser.undoRemoveTab();
				else throw "Session Restore feature is disabled."
			}
		}
	}, {
		label: "激活左边的标签页",
		command: function(event) {
			gBrowser.tabContainer.advanceSelectedTab(-1, true);
		}
	}, {
		label: "激活左边的标签页(包括其他标签页组)",
		command: function(event) {
			Array.forEach(gBrowser.mTabs, function(tab) {
				tab.removeAttribute("hidden");
			})
			gBrowser.tabContainer.advanceSelectedTab(-1, true);
			Array.forEach(gBrowser.mTabs, function(tab) {
				tab.removeAttribute("hidden");
			})
		}
	}, {
		label: "激活右边的标签页",
		command: function(event) {
			gBrowser.tabContainer.advanceSelectedTab(+1, true);
		}
	}, {
		label: "激活右边的标签页(包括其他标签页组)",
		command: function(event) {
			Array.forEach(gBrowser.mTabs, function(tab) {
				tab.removeAttribute("hidden");
			})
			gBrowser.tabContainer.advanceSelectedTab(1, true);
			Array.forEach(gBrowser.mTabs, function(tab) {
				tab.removeAttribute("hidden");
			})
		}
	}, {
		label: "激活第一个标签",
		command: function(event) {
			gBrowser.selectedTab = (gBrowser.visibleTabs || gBrowser.mTabs)[0];
		}
	}, {
		label: "激活最后一个标签",
		command: function(event) {
			gBrowser.selectedTab = (gBrowser.visibleTabs || gBrowser.mTabs)[(gBrowser.visibleTabs || gBrowser.mTabs).length - 1];
		}
	}, {
		label: "刷新当前页面",
		command: function(event) {
			// gBrowser.mCurrentBrowser.reload();
			document.getElementById("Browser:Reload").doCommand();
		}
	}, {
		label: "跳过缓存刷新当前页面",
		command: function(event) {
			// BrowserReloadSkipCache();
			document.getElementById("Browser:ReloadSkipCache").doCommand();
		}
	}, {
		label: "刷新其他所有页面",
		command: function(event) {
			Array.forEach(gBrowser.visibleTabs, function(tab) {
				tab == gBrowser.mCurrentBrowser || tab.linkedBrowser.reload();
			})
		}
	}, {
		label: "刷新其他所有页面(包括其他标签页组)",
		command: function(event) {
			Array.forEach(gBrowser.mTabs, function(tab) {
				tab == gBrowser.mCurrentBrowser || tab.linkedBrowser.reload();
			})
		}
	}, {
		label: "刷新所有页面",
		command: function(event) {
			gBrowser.reloadAllTabs();
		}
	}, {
		label: "刷新所有页面(包括其他标签页组)",
		command: function(event) {
			Array.forEach(gBrowser.mTabs, function(tab) {
				tab.linkedBrowser.reload();
			})
		}
	}, {
		label: "停止载入当前页",
		command: function(event) {
			BrowserStop();
		}
	}, {
		label: "停止载入所有页",
		command: function(event) {
			Array.map(gBrowser.browsers, function(browser) {
				browser.stop()
			});
		}
	}, {
		label: "后退",
		command: function(event) {
			getWebNavigation().canGoBack && getWebNavigation().goBack();
		}
	}, {
		label: "后退到最后",
		command: function(event) {
			getWebNavigation().gotoIndex(0);
		}
	}, {
		label: "前进",
		command: function(event) {
			getWebNavigation().canGoForward && getWebNavigation().goForward();
		}
	}, {
		label: "前进到最前",
		command: function(event) {
			getWebNavigation().gotoIndex(getWebNavigation().sessionHistory.count - 1);
		}
	}, {
		label: "转到页首",
		command: function(event) {
			var doc = event.target.ownerDocument;
			var win = doc.defaultView;
			win.scrollTo(0, 0);
			// goDoCommand("cmd_scrollTop");
		}
	}, {
		label: "转到页首(强制)",
		command: function(event) {
			content.scrollTo(0, 0);
		}
	}, {
		label: "转到页尾",
		command: function(event) {
			var doc = event.target.ownerDocument;
			var win = doc.defaultView;
			win.scrollTo(0, 10000000000);
			// goDoCommand("cmd_scrollBottom");
		}
	}, {
		label: "转到页尾(强制)",
		command: function(event) {
			content.scrollTo(0, 1e10);
		}
	}, {
		label: "向下滚动一屏",
		command: function(event) {
			content.scrollByPages(1);
		}
	}, {
		label: "向上滚动一屏",
		command: function(event) {
			content.scrollByPages(-1);
		}
	}, {
		label: "全选",
		command: function(event) {
			goDoCommand("cmd_selectAll");
		}
	}, {
		label: "复制页面全部文字",
		command: function(event) {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(content.document.documentElement.textContent);
		}
	}, {
		label: "复制选中文字",
		command: function(event) {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(content.getSelection());
		}
	}, {
		label: "搜索框搜索选中文字",
		command: function(event) {
			BrowserSearch.loadSearch(getBrowserSelection(), true);
		}
	}, {
		label: "baidu搜索选中文字",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab('http://www.baidu.com/s?wd=' + getBrowserSelection());
		}
	}, {
		label: "google搜索选中文字",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab('http://www.google.com/search?q=' + encodeURIComponent(getBrowserSelection()));
		}
	}, {
		label: "保存选中文字",
		command: function(event) {
			saveImageURL('data:text/plain;charset=UTF-8;base64,' + btoa(unescape(encodeURIComponent(content.getSelection().toString()))), content.document.title + ".txt");
		}
	}, {
		label: "打开选中链接",
		command: function(event) {
			Array.filter(content.document.links, function(link) {
				arguments.callee.uniq = arguments.callee.uniq || [];
				if ((!~arguments.callee.uniq.indexOf(link.toString())) && content.getSelection().containsNode(link, 1)) {
					arguments.callee.uniq.push(link.toString());
					return 1;
				}
			}).forEach(function(link) {
				gBrowser.addTab(link.toString());
			})
		}
	}, {
		label: "复制选中链接",
		command: function(event) {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(Array.filter(content.document.links, function(link) {
				arguments.callee.uniq = arguments.callee.uniq || [];
				if ((!~arguments.callee.uniq.indexOf(link.toString())) && content.getSelection().containsNode(link, 1)) {
					arguments.callee.uniq.push(link.toString());
					return 1;
				}
			}).map(function(link) {
				return link.toString();
			}).join("\r\n"));
		}
	}, {
		label: "下载选中图片",
		command: function(event) {
			Array.filter(content.document.images, function(image) {
				arguments.callee.uniq = arguments.callee.uniq || [];
				if ((!~arguments.callee.uniq.indexOf(image.src)) && content.getSelection().containsNode(image, 1)) {
					arguments.callee.uniq.push(image.src);
					return 1;
				}
			}).forEach(function(image) {
				saveImageURL(image.src, 0, 0, 0, 1);
			})
		}
	}, {
		label: "删除选中部分网页",
		command: function(event) {
			content.getSelection().deleteFromDocument(0);
		}
	}, {
		label: "繁化简",
		command: function(event) {
			content.document.documentElement.appendChild(content.document.createElement("script")).src = "http://tongwen.openfoundry.org/NewTongWen/tools/bookmarklet_cn2.js";
		}
	}, {
		label: "简化繁",
		command: function(event) {
			content.document.documentElement.appendChild(content.document.createElement("script")).src = "http://tongwen.openfoundry.org/NewTongWen/tools/bookmarklet_tw2.js";
		}
	}, {
		label: "页面编码GB互转UTF8",
		command: function(event) {
			BrowserSetForcedCharacterSet(gBrowser.mCurrentBrowser._docShell.charset == 'gbk' ? 'utf-8' : 'gbk');
		}
	}, {
		label: "网址向上一层",
		command: function(event) {
			loadURI(content.location.host + content.location.pathname.replace(/\/[^\/]+\/?$/, ""));
		}
	}, {
		label: "URL中的数字递增",
		command: function(event) {
			loadURI(content.location.href.replace(/(\d+)(?=\D*$)/, function($0) {
				return +$0 + 1
			}));
		}
	}, {
		label: "URL中的数字递减",
		command: function(event) {
			loadURI(content.location.href.replace(/(\d+)(?=\D*$)/, function($0) {
				return +$0 - 1 > 0 ? +$0 - 1 : 0;
			}));
		}
	}, {
		label: "打开about:config",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab("about:config");
		}
	}, {
		label: "打开Chrome目录",
		command: function(event) {
			Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("UChrm", Components.interfaces.nsILocalFile).reveal();
		}
	}, {
		label: "打开Profile目录",
		command: function(event) {
			Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile).reveal();
		}
	}, {
		label: "打开我的电脑",
		command: function(event) {
			try {
				var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("WinD", Components.interfaces.nsILocalFile);
				file.append("explorer.exe");
				var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
				process.init(file);
				process.run(false, [","], 1);

			} catch (ex) {
				alert("打开我的电脑失败!")
			}
		}
	}, {
		label: "打开音量控制器",
		command: function(event) {
			try {
				var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsILocalFile);
				file.append(/6/.test(navigator.oscpu) ? "sndvol.exe" : "sndvol32.exe");
				var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
				process.init(file);
				process.run(false, ["-f"], 1);
			} catch (ex) {
				alert("打开音量控制器失败!")
			}
		}
	}, {
		label: "打开任务管理器",
		command: function(event) {
			try {
				var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
				file.initWithPath(Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("SysD", Components.interfaces.nsILocalFile).path + "\\taskmgr.exe");
				file.launch();
			} catch (ex) {
				alert("打开任务管理器失败!")
			}
		}
	}, {
		label: "用IE打开当前页",
		command: function(event) {
			try {
				var file = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProgF", Components.interfaces.nsILocalFile);
				file.append("Internet Explorer");
				file.append("iexplore.exe");
				var process = Cc["@mozilla.org/process/util;1"].createInstance(Ci.nsIProcess);
				process.init(file);
				process.run(false, [content.location.href], 1);
			} catch (ex) {
				alert("打开IE失败!")
			}
		}
	}, {
		label: "打开选项窗口",
		command: function(event) {
			openPreferences();
		}
	}, {
		label: "打开附加组件窗口",
		command: function(event) {
			BrowserOpenAddonsMgr();
		}
	}, {
		label: "打开附加组件窗口(新窗口)",
		command: function(event) {
			window.open("about:addons", "history-pane", "chrome,resizable=yes,centerscreen").resizeTo(800, 600);
		}
	}, {
		label: "打开下载窗口",
		command: function(event) {
			BrowserDownloadsUI();
		}
	}, {
		label: "打开我的足迹窗口",
		command: function(event) {
			PlacesCommandHook.showPlacesOrganizer('History');
		}
	}, {
		label: "打开错误控制台窗口",
		command: function(event) {
			toJavaScriptConsole();
		}
	}, {
		label: "打开定制工具栏窗口",
		command: function(event) {
			BrowserCustomizeToolbar();
		}
	}, {
		label: "打开历史窗口(侧边栏)",
		command: function(event) {
			toggleSidebar('viewHistorySidebar');
		}
	}, {
		label: "打开历史窗口(新窗口)",
		command: function(event) {
			window.open("chrome://browser/content/history/history-panel.xul", "history-pane", "chrome,resizable=yes,centerscreen").resizeTo(400, 600);
		}
	}, {
		label: "打开或关闭查找栏",
		command: function(event) {
			gFindBar.open() || gFindBar.close();
		}
	}, {
		label: "打开文件菜单",
		command: function(event) {
			document.getElementById("file-menu").menupopup.openPopup(null, null, event.screenX, event.screenY);
		}
	}, {
		label: "打开工具菜单",
		command: function(event) {
			document.getElementById("tools-menu").menupopup.openPopup(null, null, event.screenX, event.screenY);
		}
	}, {
		label: "打开查看菜单",
		command: function(event) {
			document.getElementById("view-menu").menupopup.openPopup(null, null, event.screenX, event.screenY);
		}
	}, {
		label: "打开剪切板中的网址",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab(readFromClipboard());
		}
	}, {
		label: "侧边栏打开当前页面",
		command: function(event) {
			openWebPanel(content.document.title, content.location);
		}
	}, {
		label: "复制当前页面URL",
		command: function(event) {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(content.location);
		}
	}, {
		label: "复制当前页面URL+标题",
		command: function(event) {
			Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper).copyString(content.document.title + " - " + content.location);
		}
	}, {
		label: "将当前页面设为主页",
		command: function(event) {
			openHomeDialog(content.location);
		}
	}, {
		label: "添加所有标签到书签",
		command: function(event) {
			PlacesCommandHook.bookmarkCurrentPages();
		}
	}, {
		label: "查看源代码",
		command: function(event) {
			BrowserViewSourceOfDocument(content.document);
		}
	}, {
		label: "页面放大",
		command: function(event) {
			FullZoom.enlarge();
		}
	}, {
		label: "页面缩小",
		command: function(event) {
			FullZoom.reduce();
		}
	}, {
		label: "切换GIF动画循环",
		command: function(event) {
			Array.forEach(content.document.querySelectorAll("img"), function(gif) {
				try {
					gif.QueryInterface(Ci.nsIImageLoadingContent).getRequest(Ci.nsIImageLoadingContent.CURRENT_REQUEST).image.animationMode ^= 1;
				} catch (e) {}
			})
		}
	}, {
		label: "切换图片显示",
		command: function(event) {
			!/img, embed, object { visibility: hidden/.test(content.document.getElementsByTagName("head")[0].lastElementChild.innerHTML) ? content.document.getElementsByTagName("head")[0].appendChild(content.document.createElement("style")).innerHTML = "img, embed, object { visibility: hidden !important; }html * { background-image: none !important; }" : content.document.getElementsByTagName("head")[0].removeChild(content.document.getElementsByTagName("head")[0].lastElementChild);
		}
	}, {
		label: "切换css样式",
		command: function(event) {
			getMarkupDocumentViewer().authorStyleDisabled ^= 1;
		}
	}, {
		label: "切换代理(无代理<->系统代理)",
		command: function(event) {
			var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			pref.setIntPref("network.proxy.type", pref.getIntPref("network.proxy.type") == 0 ? 5 : 0);
		}
	}, {
		label: "切换代理(无代理<->手动配置代理)",
		command: function(event) {
			var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
			pref.setIntPref("network.proxy.type", pref.getIntPref("network.proxy.type") == 0 ? 1 : 0);
		}
	}, {
		label: "切换当前网页显示",
		command: function(event) {
			Application.version[0] > 3 ? getMarkupDocumentViewer().setPageMode(content.show = (typeof content.show == "undefined" || content.show == 0), {}) : ((content.show = (typeof content.show == "undefined" || content.show == 0)) ? getMarkupDocumentViewer().hide() : getMarkupDocumentViewer().show());
		}
	}, {
		label: "切换当前网页可编辑",
		command: function(event) {
			content.document.body.contentEditable = content.document.body.contentEditable == "true" ? "false" : "true";
		}
	}, {
		label: "切换菜单栏显示",
		command: function(event) {
			document.getElementById("toolbar-menubar").setAttribute("autohide", document.getElementById("toolbar-menubar").getAttribute("autohide") == "true" ? "false" : "true");
		}
	}, {
		label: "显示标签页组管理器",
		command: function(event) {
			TabView.toggle();
		}
	}, {
		label: "无动画显示标签页组管理器",
		command: function(event) {
			TabView._deck ? TabView._deck.selectedIndex ^= 1 : TabView.toggle();
		}
	}, {
		label: "临时显示所有标签页组标签",
		command: function(event) {
			Array.forEach(gBrowser.mTabs, function(tab) {
				tab.removeAttribute("hidden");
			})
		}
	}, {
		label: "切换标签页组",
		command: function(event) {
			TabView._initFrame(function() {
				let tabItem = TabView._window.GroupItems.getNextGroupItemTab();
				if (tabItem) window.gBrowser.selectedTab = tabItem.tab;
				else {
					TabView._initFrame(function() {
						var tab = gBrowser.addTab("about:newtab");
						TabView.moveTabTo(tab, null);
						gBrowser.selectedTab = tab;
					});
				}
			});
			// gBrowser.selectedTab = Array.filter(gBrowser.mTabs, function(tab) {
			// 	return tab._tPos > gBrowser.mCurrentTab._tPos && tab.getAttribute("hidden") == "true";
			// })[0] || Array.filter(gBrowser.mTabs, function(tab) {
			// 	return tab.getAttribute("hidden") == "true";
			// })[0];
		}
	}, {
		label: "将当前tab放入新标签页组",
		command: function(event) {
			TabView.moveTabTo(gBrowser.mCurrentTab);
		}
	}, {
		label: "显示所有标签页缩略图",
		command: function(event) {
			allTabs.open();
		}
	}, {
		label: "页面可见区域截图",
		command: function(event) {
			var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
			canvas.width = content.innerWidth;
			canvas.height = content.innerHeight;
			var ctx = canvas.getContext("2d");
			ctx.drawWindow(content, content.pageXOffset, content.pageYOffset, canvas.width, canvas.height, "rgb(255,255,255)");
			saveImageURL(canvas.toDataURL(), content.document.title + ".png");
		}
	}, {
		label: "页面所有区域截图",
		command: function(event) {
			var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
			canvas.width = content.document.documentElement.scrollWidth;
			canvas.height = content.document.documentElement.scrollHeight;
			var ctx = canvas.getContext("2d");
			ctx.drawWindow(content, 0, 0, canvas.width, canvas.height, "rgb(255,255,255)");
			saveImageURL(canvas.toDataURL(), content.document.title + ".png");
		}
	}, {
		label: "浏览器界面截图",
		command: function(event) {
			var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
			canvas.width = innerWidth;
			canvas.height = innerHeight;
			var ctx = canvas.getContext("2d");
			ctx.drawWindow(window, 0, 0, canvas.width, canvas.height, "rgb(255,255,255)");
			saveImageURL(canvas.toDataURL(), "Firefox.png");
		}
	}, {
		label: "复制扩展清单",
		command: function(event) {
			Application.extensions ? Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(Application.extensions.all.map(function(item, id) {
				return id + 1 + ": " + item._item.name;
			}).join("\n")) : Application.getExtensions(function(extensions) {
				Components.classes['@mozilla.org/widget/clipboardhelper;1'].getService(Components.interfaces.nsIClipboardHelper).copyString(extensions.all.map(function(item, id) {
					return id + 1 + ": " + item._item.name;
				}).join("\n"));
			})
		}
	}, {
		label: "新建隐私浏览窗口",
		command: function(event) {
			OpenBrowserWindow({
				private: true
			});
		}
	}, {
		label: "保存当前页面",
		command: function(event) {
			saveDocument(window.content.document);
		}
	}, {
		label: "最小化窗口",
		command: function(event) {
			setTimeout("minimize()", 10);
		}
	}, {
		label: "全屏窗口",
		command: function(event) {
			BrowserFullScreen();
		}
	}, {
		label: "窗口占用屏幕左半部分",
		command: function(event) {
			resizeTo(screen.availWidth / 2, screen.availHeight, moveTo(0, 0));
		}
	}, {
		label: "窗口占用屏幕右半部分",
		command: function(event) {
			resizeTo(screen.availWidth / 2, screen.availHeight, moveTo(screen.availWidth / 2, 0));
		}
	}, {
		label: "重启浏览器",
		command: function(event) {
			Application.restart();
		}
	}, {
		label: "删除启动缓存并重启",
		command: function(event) {
			Services.appinfo.invalidateCachesOnRestart() || Application.restart();
			// const appStartup = Components.classes["@mozilla.org/toolkit/app-startup;1"].getService(Components.interfaces.nsIAppStartup);

			// // Notify all windows that an application quit has been requested.
			// var os = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
			// var cancelQuit = Components.classes["@mozilla.org/supports-PRBool;1"].createInstance(Components.interfaces.nsISupportsPRBool);
			// os.notifyObservers(cancelQuit, "quit-application-requested", null);

			// // Something aborted the quit process.
			// if (cancelQuit.data) return;

			// // Notify all windows that an application quit has been granted.
			// os.notifyObservers(null, "quit-application-granted", null);

			// // Enumerate all windows and call shutdown handlers
			// var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
			// var windows = wm.getEnumerator(null);
			// var win;
			// while (windows.hasMoreElements()) {
			// 	win = windows.getNext();
			// 	if (("tryToClose" in win) && !win.tryToClose())
			// 		return;
			// }
			// let XRE = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULRuntime);
			// if (typeof XRE.invalidateCachesOnRestart == "function")
			// 	XRE.invalidateCachesOnRestart();
			// appStartup.quit(appStartup.eRestart | appStartup.eAttemptQuit);
		}
	}, {
		label: "关闭浏览器",
		command: function(event) {
			goQuitApplication();
		}
	}
];

/******************************************************************************************
 *FeiRuoMouse 自定义鼠标拖拽命令
 *Image:FeiRuoMouse.DragScript.Image(event);
 *Text:FeiRuoMouse.DragScript.Text(event);
 *url-1:FeiRuoMouse.DragScript.Url(event);
 *url-2:FeiRuoMouse.DragScript.Url2(event);
 *******************************************************************************************/
var DragCustomCommand = [
	//示例：
	/*{
		label: "搜索相似图片", //命令的说明文字
		Type: "Image", //拖拽图片时的命令
		command: function(event) { //自定义命令，event为回传事件
			var url = encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url"));
			gBrowser.addTab('http://www.tineye.com/search/?pluginver=firefox-1.0&sort=size&order=desc&url=' + url);
			gBrowser.addTab('http://stu.baidu.com/i?rt=0&rn=10&ct=1&tn=baiduimage&objurl=' + url);
			gBrowser.addTab('http://www.google.com/searchbyimage?image_url=' + url);
			gBrowser.addTab('http://pic.sogou.com/ris?query=' + url);
		}
	}, {
		label: "搜索框搜索链接文字",
		Type: "Url", //拖拽链接时的命令
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab();
			BrowserSearch.loadSearch(event.dataTransfer.getData("text/x-moz-url").split("\n")[1], false);
		}
	}, {
		label: "搜索框搜索选中文字[识别URL并打开]",
		Type: "Text", //拖拽文字时的命令
		command: function(event) {
			var Text = FeiRuoMouse.DragScript.Text(event);
			(FeiRuoMouse.DragScript.SeeAsURL(Text) && (gBrowser.selectedTab = gBrowser.addTab(Text))) || ((gBrowser.selectedTab = gBrowser.addTab()) & BrowserSearch.loadSearch(Text, false));
		}
	}, */
	/*图片*/
	{
		label: "当前标签打开图片",
		Type: "Image",
		command: function(event) {
			loadURI(event.dataTransfer.getData("application/x-moz-file-promise-url"));
		}
	}, {
		label: "新标签打开图片(前台)",
		Type: "Image",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("application/x-moz-file-promise-url"));
		}
	}, {
		label: "新标签打开图片(后台)",
		Type: "Image",
		command: function(event) {
			gBrowser.addTab(event.dataTransfer.getData("application/x-moz-file-promise-url"));
		}
	}, {
		label: "当前标签打开图片链接",
		Type: "Image",
		command: function(event) {
			loadURI(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
		}
	}, {
		label: "新标签打开图片链接(前台)",
		Type: "Image",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
		}
	}, {
		label: "新标签打开图片链接(后台)",
		Type: "Image",
		command: function(event) {
			gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
		}
	}, {
		label: "复制图片地址",
		Type: "Image",
		command: function(event) {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("application/x-moz-file-promise-url"));
		}
	}, {
		label: "复制图片",
		Type: "Image",
		command: function(event) {
			(document.popupNode = content.document.createElement('img')).src = event.dataTransfer.getData("application/x-moz-file-promise-url");
			goDoCommand('cmd_copyImageContents');
		}
	}, {
		label: "下载图片",
		Type: "Image",
		command: function(event) {
			saveImageURL(event.dataTransfer.getData("application/x-moz-file-promise-url"), null, null, null, null, null, document);
		}
	}, {
		label: "下载图片(不弹窗)",
		Type: "Image",
		command: function(event) {
			saveImageURL(event.dataTransfer.getData("application/x-moz-file-promise-url"), null, null, null, true, null, document);
		}
	}, {
		label: "下载图片(指定位置不弹窗)",
		Type: "Image",
		command: function(event) {
			var path = "c:";
			var uri = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).newURI(event.dataTransfer.getData("application/x-moz-file-promise-url"), null, null)
			var file = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(path);
			file.append(getDefaultFileName(null, uri));
			internalSave(null, null, null, null, null, null, null, {
				file: file,
				uri: uri
			}, null, internalSave.length === 12 ? document : true, internalSave.length === 12 ? true : null, null);
		}
	}, {
		label: "搜索相似图片(baidu)",
		Type: "Image",
		command: function(event) {
			gBrowser.addTab('http://stu.baidu.com/i?rt=0&rn=10&ct=1&tn=baiduimage&objurl=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
		}
	}, {
		label: "搜索相似图片(Google)",
		Type: "Image",
		command: function(event) {
			gBrowser.addTab('http://www.google.com/searchbyimage?image_url=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
		}
	}, {
		label: "搜索相似图片(sougou)",
		Type: "Image",
		command: function(event) {
			gBrowser.addTab('http://pic.sogou.com/ris?query=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
		}
	}, {
		label: "搜索相似图片(tineye)",
		Type: "Image",
		command: function(event) {
			gBrowser.addTab('http://www.tineye.com/search/?pluginver=firefox-1.0&sort=size&order=desc&url=' + encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url")));
		}
	}, {
		label: "搜索相似图片(全部引擎)",
		Type: "Image",
		command: function(event) {
			var url = encodeURIComponent(event.dataTransfer.getData("application/x-moz-file-promise-url"));
			gBrowser.addTab('http://www.tineye.com/search/?pluginver=firefox-1.0&sort=size&order=desc&url=' + url);
			gBrowser.addTab('http://stu.baidu.com/i?rt=0&rn=10&ct=1&tn=baiduimage&objurl=' + url);
			gBrowser.addTab('http://www.google.com/searchbyimage?image_url=' + url);
			gBrowser.addTab('http://pic.sogou.com/ris?query=' + url);
		}
	},
	/*链接*/
	{
		label: "当前标签打开链接",
		Type: "Url",
		command: function(event) {
			loadURI(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
		}
	}, {
		label: "新标签打开链接(前台)",
		Type: "Url",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
		}
	}, {
		label: "新标签打开链接(后台)",
		Type: "Url",
		command: function(event) {
			gBrowser.addTab(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
		}
	}, {
		label: "搜索框搜索链接文字(前台)",
		Type: "Url",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab();
			BrowserSearch.loadSearch(event.dataTransfer.getData("text/x-moz-url").split("\n")[1], false);
		}
	}, {
		label: "搜索框搜索链接文字(后台)",
		Type: "Url",
		command: function(event) {
			BrowserSearch.loadSearch(event.dataTransfer.getData("text/x-moz-url").split("\n")[1], true);
		}
	}, {
		label: "Google搜索链接文字(前台)",
		Type: "Url",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab('http://www.google.com/search?q=' + encodeURIComponent(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]));
		}
	}, {
		label: "Google搜索链接文字(后台)",
		Type: "Url",
		command: function(event) {
			gBrowser.addTab('http://www.google.com/search?q=' + encodeURIComponent(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]));
		}
	}, {
		label: "baidu搜索链接文字(前台)",
		Type: "Url",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab('http://www.baidu.com/s?wd=' + event.dataTransfer.getData("text/x-moz-url").split("\n")[1]);
		}
	}, {
		label: "baidu搜索链接文字(后台)",
		Type: "Url",
		command: function(event) {
			gBrowser.addTab('http://www.baidu.com/s?wd=' + event.dataTransfer.getData("text/x-moz-url").split("\n")[1]);
		}
	}, {
		label: "复制链接",
		Type: "Url",
		command: function(event) {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[0]);
		}
	}, {
		label: "复制链接文字",
		Type: "Url",
		command: function(event) {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/x-moz-url").split("\n")[1]);
		}
	}, {
		label: "下载链接",
		Type: "Url",
		command: function(event) {
			saveImageURL(event.dataTransfer.getData("text/x-moz-url").split("\n")[0], null, null, null, null, null, document);
		}
	}, {
		label: "下载链接(不弹窗)",
		Type: "Url",
		command: function(event) {
			saveImageURL(event.dataTransfer.getData("text/x-moz-url").split("\n")[0], null, null, null, true, null, document);
		}
	},
	/*文字*/
	{
		label: "搜索框搜索选中文字(前台)[识别URL并打开]",
		Type: "Text",
		command: function(event) {
			// (FeiRuoMouse.DragScript.SeeAsURL(event.dataTransfer.getData("text/unicode")) && (gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/unicode")))) || ((gBrowser.selectedTab = gBrowser.addTab()) & BrowserSearch.loadSearch(event.dataTransfer.getData("text/unicode"), false));
			var Text = FeiRuoMouse.DragScript.Text(event);
			(FeiRuoMouse.DragScript.SeeAsURL(Text) && (gBrowser.selectedTab = gBrowser.addTab(Text))) || ((gBrowser.selectedTab = gBrowser.addTab()) & BrowserSearch.loadSearch(Text, false));
		}
	}, {
		label: "搜索框搜索选中文字(后台)[识别URL并打开]",
		Type: "Text",
		command: function(event) {
			(FeiRuoMouse.DragScript.SeeAsURL(event.dataTransfer.getData("text/unicode")) && gBrowser.addTab(event.dataTransfer.getData("text/unicode"))) || BrowserSearch.loadSearch(event.dataTransfer.getData("text/unicode"), true);
		}
	}, {
		label: "弹出搜索框(前台)",
		Type: "Text",
		command: function(event) {
			var popup = document.getAnonymousElementByAttribute(document.querySelector("#searchbar").searchButton, "anonid", "searchbar-popup");
			var text = event.dataTransfer.getData("text/unicode");
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
		label: "Google搜索选中文字(前台)[识别URL并打开]",
		Type: "Text",
		command: function(event) {
			(FeiRuoMouse.DragScript.SeeAsURL(event.dataTransfer.getData("text/unicode")) && (gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/unicode")))) || (gBrowser.selectedTab = gBrowser.addTab('http://www.google.com/search?q=' + encodeURIComponent(event.dataTransfer.getData("text/unicode"))));
		}
	}, {
		label: "Google搜索选中文字(后台)[识别URL并打开]",
		Type: "Text",
		command: function(event) {
			(FeiRuoMouse.DragScript.SeeAsURL(event.dataTransfer.getData("text/unicode")) && gBrowser.addTab(event.dataTransfer.getData("text/unicode"))) || gBrowser.addTab('http://www.google.com/search?q=' + encodeURIComponent(event.dataTransfer.getData("text/unicode")));
		}
	}, {
		label: "baidu搜索选中文字(前台)[识别URL并打开]",
		Type: "Text",
		command: function(event) {
			(FeiRuoMouse.DragScript.SeeAsURL(event.dataTransfer.getData("text/unicode")) && (gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/unicode")))) || (gBrowser.selectedTab = gBrowser.addTab('http://www.baidu.com/s?wd=' + event.dataTransfer.getData("text/unicode")));
		}
	}, {
		label: "baidu搜索选中文字(后台)[识别URL并打开]",
		Type: "Text",
		command: function(event) {
			(FeiRuoMouse.DragScript.SeeAsURL(event.dataTransfer.getData("text/unicode")) && gBrowser.addTab(event.dataTransfer.getData("text/unicode"))) || gBrowser.addTab('http://www.baidu.com/s?wd=' + event.dataTransfer.getData("text/unicode"));
		}
	}, {
		label: "搜索框搜索选中文字(站内)(前台)",
		Type: "Text",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab();
			BrowserSearch.loadSearch("site:" + content.location.host + " " + event.dataTransfer.getData("text/unicode"), false);
		}
	}, {
		label: "搜索框搜索选中文字(站内)(后台)",
		Type: "Text",
		command: function(event) {
			BrowserSearch.loadSearch("site:" + content.location.host + " " + event.dataTransfer.getData("text/unicode"), true);
		}
	}, {
		label: "Google搜索选中文字(站内)(前台)",
		Type: "Text",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab('http://www.google.com/search?q=' + "site:" + content.location.host + " " + encodeURIComponent(event.dataTransfer.getData("text/unicode")));
		}
	}, {
		label: "Google搜索选中文字(站内)(后台)",
		Type: "Text",
		command: function(event) {
			gBrowser.addTab('http://www.google.com/search?q=' + "site:" + content.location.host + " " + encodeURIComponent(event.dataTransfer.getData("text/unicode")));
		}
	}, {
		label: "baidu搜索选中文字(站内)(前台)",
		Type: "Text",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab('http://www.baidu.com/s?wd=' + "site:" + content.location.host + " " + event.dataTransfer.getData("text/unicode"));
		}
	}, {
		label: "baidu搜索选中文字(站内)(后台)",
		Type: "Text",
		command: function(event) {
			gBrowser.addTab('http://www.baidu.com/s?wd=' + "site:" + content.location.host + " " + event.dataTransfer.getData("text/unicode"));
		}
	}, {
		label: "复制文本",
		Type: "Text",
		command: function(event) {
			Components.classes['@mozilla.org/widget/clipboardhelper;1'].createInstance(Components.interfaces.nsIClipboardHelper).copyString(event.dataTransfer.getData("text/unicode"));
		}
	}, {
		label: "Google翻译文本",
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
		Type: "Text",
		command: function(event) {
			gBrowser.selectedTab = gBrowser.addTab(event.dataTransfer.getData("text/unicode"));
		}
	}, {
		label: "打开查找栏搜索文本",
		Type: "Text",
		command: function(event) {
			gFindBar._findField.value = event.dataTransfer.getData("text/unicode");
			gFindBar.open();
			gFindBar.toggleHighlight(1);
		}
	}, {
		label: "不打开查找栏搜索文本",
		Type: "Text",
		command: function(event) {
			gFindBar._findField.value = event.dataTransfer.getData("text/unicode");
			gFindBar.toggleHighlight(1);
		}
	}, {
		label: "下载文字",
		Type: "Text",
		command: function(event) {
			saveImageURL('data:text/plain;charset=UTF-8;base64,' + btoa(unescape(encodeURIComponent(event.dataTransfer.getData("text/unicode")))), event.dataTransfer.getData("text/unicode").slice(0, 5) + ".txt", null, null, null, null, document);
		}
	}, {
		label: "下载文字(不弹窗)",
		Type: "Text",
		command: function(event) {
			saveImageURL('data:text/plain;charset=UTF-8;base64,' + btoa(unescape(encodeURIComponent(event.dataTransfer.getData("text/unicode")))), event.dataTransfer.getData("text/unicode").slice(0, 5) + ".txt", null, null, true, null, document);
		}
	}
];
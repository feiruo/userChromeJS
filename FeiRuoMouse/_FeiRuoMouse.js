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
	}, {
		label: "FGgTranslator翻译", //命令的说明文字
		command: function(event) { //自定义命令，event为回传事件
			var doc = event.target.ownerDocument;
			var win = doc.defaultView;
			(function (window, document,event){
				if(!window.FGgTranslator){
					window.FGgTranslator = {
						offset: {
							x: 50,   //翻译框出现的位置相对于鼠标手势结束时的横坐标位移
							y: 10,   //纵坐标位移, 值越大越往 上/左
						},
						google: 'https://translate.google.cn/',
						//link: 'http://173.194.127.152/', //直接使用服务器IP，
														 //可以换一个比较通畅的google翻译服务器地址或IP,
														 //注意地址或IP最后还有还有"/"。
						service: 'baidu',
						bingAppId: '',
						selectText: null,
						boxElements:null,
						player: null,
						to: 'zh',
						from: 'auto',
						checkLanguge: 'auto',
						camelCase: false,
						preSelection: [],
						originDocument: null,
						_languages:{
							'google-bing':{
								en: '英语 English',
								ja: '日语 Japanese',
								fr: '法语 French',
								ru: '俄语 Russian',
								de: '德语 German',
								ko: '韩语 Korean',
								ar: '阿拉伯语 Arabic',
								et: '爱沙尼亚语 Estonian',
								bg: '保加利亚语 Bulgarian',
								pl: '波兰语 Polish',
								fa: '波斯语 Persian',
								da: '丹麦语 Danish',
								fi: '芬兰语 Finnish',
								ht: '海地克里奥尔语 Haitian Creole',
								nl: '荷兰语 Dutch',
								ca: '加泰罗尼亚语 Catalan',
								cs: '捷克语 Czech',
								lv: '拉脱维亚语 Latvian',
								lt: '立陶宛语 Lithuanian',
								ro: '罗马尼亚语 Romanian',
								mt: '马耳他语 Maltese',
								ms: '马来语 Malay',
								no: '挪威语 Norwegian',
								pt: '葡萄牙语 Portuguese',
								sv: '瑞典语 Swedish',
								sk: '斯洛伐克语 Slovak',
								sl: '斯洛文尼亚语 Slovenian',
								th: '泰语 Thai',
								tr: '土耳其语 Turkish',
								cy: '威尔士语 Welsh',
								ur: '乌尔都语 Urdu',
								uk: '乌克兰语 Ukrainian',
								el: '希腊语 Greek',
								es: '西班牙语 Spanish',
								hu: '匈牙利语 Hungarian',
								it: '意大利语 Italian',
								hi: '印地语 Hindi',
								id: '印尼语 Indonesian',
								vi: '越南语 Vietnamese',
							},
							google: {
								'zh-TW': '中文(繁体)',
								'zh-CN': '中文(简体)',
								sq: '阿尔巴尼亚语 Albanian',
								az: '阿塞拜疆语 Azerbaijani',
								ga: '爱尔兰语 Irish',
								eu: '巴斯克语 Basque',
								be: '白俄罗斯语 Belarusian',
								is: '冰岛语 Icelandic',
								bs: '波斯尼亚语 Bosnian',
								af: '布尔语(南非荷兰语) Afrikaans',
								tl: '菲律宾语 Filipino',
								km: '高棉语 Khmer',
								ka: '格鲁吉亚语 Georgian',
								gu: '古吉拉特语 Gujarati',
								ha: '豪萨语 Hausa',
								gl: '加利西亚语 Galician',
								kn: '卡纳达语 Kannada',
								hr: '克罗地亚语 Croatian',
								la: '拉丁语 Latin',
								lo: '老挝语 Lao',
								mr: '马拉地语 Marathi',
								mk: '马其顿语 Macedonian',
								mi: '毛利语 Maori',
								mn: '蒙古语 Mongolian',
								bn: '孟加拉语 Bengali',
								hmn: '苗语 Hmong',
								zu: '南非祖鲁语 Zulu',
								ne: '尼泊尔语 Nepali',
								pa: '旁遮普语 Punjabi',
								sr: '塞尔维亚语 Serbian',
								eo: '世界语 Esperanto',
								sw: '斯瓦希里语 Swahili',
								ceb: '宿务语 Cebuano',
								so: '索马里语 Somali',
								te: '泰卢固语 Telugu',
								ta: '泰米尔语 Tamil',
								iw: '希伯来语 Hebrew',
								hy: '亚美尼亚语 Armenian',
								ig: '伊博语 Igbo',
								yi: '意第绪语 Yiddish',
								jw: '印尼爪哇语 Javanese',
								yo: '约鲁巴语 Yoruba'
							},
							bing: {
								'zh-CHT': '中文(繁体)',
								'zh-CHS': '中文(简体)',
								mww: '白苗文 Hmong Daw',
								tlh: '克林贡语 Klingon',
								he: '希伯来语 Hebrew'
							},
							baidu:{
								cht: '中文(繁体)',
								zh: '中文(简体)',
								en: '英语',
								yue: '粤语',
								wyw: '文言文',
								jp: '日语',
								de: '德语',
								ru: '俄语',
								fra: '法语',
								kor: '韩语',
								est: '爱沙尼亚语',
								ara: '阿拉伯语',
								bul: '保加利亚语',
								pl: '波兰语',
								dan: '丹麦语',
								fin: '芬兰语',
								nl: '荷兰语',
								cs: '捷克语',
								rom: '罗马尼亚语',
								pt: '葡萄牙语',
								swe: '瑞典语',
								slo: '斯洛文尼亚语',
								th: '泰语',
								spa: '西班牙语',
								el: '希腊语',
								it: '意大利语',
								hu: '匈牙利语'
							},
							langMap: [
								['zh-CN', 'zh-CHS', 'zh'],
								['zh-TW', 'zh-CHT', 'cht'],
								['ar', 'ar', 'ara'],
								['fr', 'fr', 'fra'],
								['ko', 'ko', 'kor'],
								['ja', 'ja', 'jp'],
								['es', 'es', 'spa'],
								['et', 'et', 'est'],
								['bg', 'bg', 'bul'],
								['da', 'da', 'dan'],
								['fi', 'fi', 'fin'],
								['ro', 'ro', 'rom'],
								['sv', 'sv', 'swe'],
								['sl', 'sl', 'slo']
							],
							baiduLM: {
								zh: '',
								cht: '',
								en: ['yue', 'wyw'],
								jp: ['yue', 'wyw'],
								yue: 'zh,cht',
								th: ['yue', 'wyw'],
								ara: ['yue', 'wyw'],
								est: ['yue', 'wyw'],
								bul: ['yue', 'wyw'],
								pl: ['yue', 'wyw'],
								fra: ['yue', 'wyw'],
								fin: ['yue', 'wyw'],
								spa: ['yue', 'wyw'],
								dan: ['yue', 'wyw'],
								wyw: 'zh,cht',
								kor: ['yue', 'wyw'],
								ru: ['yue', 'wyw'],
								pt: ['yue', 'wyw'],
								de: ['yue', 'wyw'],
								it: ['yue', 'wyw'],
								cs: ['yue', 'wyw'],
								rom: ['yue', 'wyw'],
								swe: ['yue', 'wyw'],
								slo: ['yue', 'wyw'],
								hu: ['yue', 'wyw'],
								el: ['yue', 'wyw'],
								nl: ['yue', 'wyw']
							}
						},

						get languages(){
							var _l = this._languages,
								s = _l[this.service];
								l = {},
								gb = 'google-bing';
							if(!!~gb.indexOf(this.service))
								for(var i in _l[gb]) l[i] = _l[gb][i];
							for(var i in s) l[i] = s[i];
							return l;
						},

						init: function(event){
							if(!document.body) return;
							this.selectText = this.getSelection(event);
							if(this.selectText.replace(/\s+/g,'') === ''){
								if(readFromClipboard && readFromClipboard().replace(/\s+/g,'') !== ''){
									this.selectText = readFromClipboard().replace(/\n+/g,'\n');
								}else{
									return;
								}
							}

							if(!this.boxElements){
								this.getTranslateBox();
								this.boxElements.box.drag = {
									status: false,
									X     : 0,
									Y     : 0
								};

								this.boxElements.style = 
										this.setStyle(this.boxElements.box);

								//nightly 41 050622 (http://whereswalden.com/2015/06/20/)
								//https://bugzilla.mozilla.org/show_bug.cgi?id=1146136
								({
									from      : this.from,
									to        : this.to,
									camelCase : this.camelCase,
									service   : this.service,
									bingAppId : this.bingAppId
								} = this.getPref());

								document.addEventListener('mousedown',this, false);
								document.addEventListener('mouseup',this, false);
								document.addEventListener('mousemove',this, false);
								document.addEventListener('keypass',this, false);
								window.addEventListener('unload',this, false);
								this.boxElements.detail.addEventListener('DOMMouseScroll', this, false);
								(this.originDocument = event.view.document).addEventListener('mousedown',this, false);
							}

							var pageXY = (function(e){
								var target = e.view,
									top = 0,
									left = 0,
									rect = null;
								while(target != null && target != window.top){
									rect = target.frameElement.getBoundingClientRect();
									top += rect.top || 0;
									left += rect.left || 0;
									target = target.parent;
								}
								return {
									x: left + e.clientX,
									y: top + e.clientY
								};
							})(event);

							this.boxElements.box.style.top = pageXY.y + window.pageYOffset - this.offset.y +'px';
							this.boxElements.box.style.left = pageXY.x + window.pageXOffset - this.offset.x +'px';

							this.setTranslateText();
						},

						googleService: function(res){
							var {strFilter: sF, title: ftt, resultText: resultText} = this.filter,
								ftt = ftt.bind(this.filter),
								resultBox = this.boxElements.resultBox;


							var text = JSON.parse(res.responseText.replace(/\[,+|,{2,}(?!\])|,+\]/g, function(str){
									return Array.prototype.join.call(str, 'null');
								})),
								rt = '',//译文
								rp = '',//注音
								languages = this.languages;

							if(!res.responseText || !text[0]){
								return this.statusAlert('未知错误');
							}

							//原文所属语言
							this.checkLanguge = text[2];

							var t = text[0];
							for(var i=0;i<t.length;i++){
								//译文
								if(!t[i][0] && !t[i][1]) continue;
								rt += ftt(t[i][0], t[i][1], 
									(languages[text[2]] + 
										' -&gt; ' + languages[this.to]));
								rp += t[i][1];
							}
							//注音
							rp = t[t.length - 1][3] ? ftt(t[t.length - 1][3], rp) : '';

							//显示翻译文本
							this.boxElements.resultText = resultText(rt);

							//显示注音
							this.boxElements.phonetic = rp;

							/*//////////////////////////////////*/
							/*
							<span class="_FgGTr-D-t1-Ci">[词性]</span>
							<ul class="_FgGTr-D-t1-Ul">
								<li class="_FgGTr-D-t1-li">
									<span>未翻译文本</span>
									<span>
										<ul>
											<li>译文1</li>
										</ul>
									</span>
								</li>
							</ul>*/

							if(text[1]){
								var t1 = text[1],
									sp = li = '';
								for(var m=0;m<t1.length;m++){
									li = '<span class="_FgGTr-D-t1-Ci">['+ sF(t1[m][0]) 
										+ '].</span><ul class="_FgGTr-D-t1-Ul">';
									for(var n=0;n<t1[m][2].length;n++){
										li += '<li class="_FgGTr-D-t1-li"><span>'
											+ sF(t1[m][2][n][0]) +'</span><span><ul>'
										for(var l=0;l<t1[m][2][n][1].length;l++){
											li += '<li>'+ sF(t1[m][2][n][1][l]) +'</li>';
										}
										li += '</ul></span></li>';
									}
									sp += li + '</ul>';
								}
								if(!!sp){
									var span = document.createElement('span');
									span.innerHTML = sp;
									this.boxElements.detail.appendChild(span);
								}
							/*//////////////////////////////////*/
							/*
							<span class="_FgGTr-D-t5-Ul"><ul>
								<li class="_FgGTr-D-t5-li1">
									<span>未翻译文本</span>
								</li>
							</ul>
							<ul>
								<li class="_FgGTr-D-t5-li2">
									<span>
										<span>译文0</span>
										<ul>
											<li>译文1</li>
										</ul>
									</span>
								</li>
							</ul></span>*/
							}else if(text[5]){
								var t5 = text[5],
									li1 = li2 = '',
									filter = {};
								for(var j=0;j<t5.length;j++){
									if(!(t5[j][0] in filter) && t5[j][2] && 
										(t5[j][2].length!=1 || (t5[j][0] != t5[j][2][0][0])) &&
										!sF(t5[j][0], t5[j][2][0][0])
									){
										li1 += '<li class="_FgGTr-D-t5-li1"><span>'+sF(t5[j][0])+'</span></li>';
										li2 += '<li class="_FgGTr-D-t5-li2"><span><span>'
											+sF(t5[j][2][0][0])+'</span><ul>';
										for(var k=0;k<t5[j][2].length;k++){
											li2 += '<li>'+sF(t5[j][2][k][0])+'</li>';
										}
										li2 += '</ul></span></li>';
										filter[t5[j][0]] = true;
									}
								}

								if(!!li1 && !!li2){
									var span = document.createElement('span');
									span.innerHTML = '<ul>'+li1+'</ul><ul>'+li2+'</ul>';
									this.boxElements.detail.appendChild(span);
									this.boxElements.detail.moreUl = span.lastChild;
								}
							}

							//设置滚动条
							this.setClassName(this.boxElements.detail, '_FgGTrDetailOverflow', false);
							if(text[1] || text[5]){
								this.setScrollbar();
							}
						},

						getGoogleTK: function(str){
							var RL = function (a, b) {
								for (var c = 0; c < b.length - 2; c += 3) {
									var d = b.charAt(c + 2),
										d = d >= 'a' ? d.charCodeAt(0) - 87 : Number(d),
										d = b.charAt(c + 1) == '+' ? a >>> d : a << d;
									a = b.charAt(c) == '+' ? a + d & 4294967295 : a ^ d
								}
								return a
							}, TL = function (a) {
								var b = 402922;
								for (var d = [], e = 0, f = 0; f < a.length; f++) {
									var g = a.charCodeAt(f);
									128 > g ? d[e++] = g : (2048 > g ? d[e++] = g >> 6 | 192 : (55296 == (g & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512) ? (g = 65536 + ((g & 1023) << 10) + (a.charCodeAt(++f) & 1023),
									d[e++] = g >> 18 | 240,
									d[e++] = g >> 12 & 63 | 128) : d[e++] = g >> 12 | 224,
									d[e++] = g >> 6 & 63 | 128),
									d[e++] = g & 63 | 128)
								}
								a = b || 0;
								for (e = 0; e < d.length; e++)
								a += d[e],
								a = RL(a, '+-a^+6');
								a = RL(a, '+-3^+b+-f');
								0 > a && (a = (a & 2147483647) + 2147483648);
								a %= 1E6;
								return (a.toString() + '.' + (a ^ b))
							}
							return TL(str);
						},

						bingService: function(res, details){
							this.statusAlert('');
							var {title: ftt, resultText: resultText} = this.filter,
								ftt = ftt.bind(this.filter),
								resultBox = this.boxElements.resultBox,
								sentRequest = this.sentRequest.bind(this),
								detailBox = this.boxElements.detail,
								bingTrantor = function(res){
									var text = res.responseText;
									if(!text || text.indexOf('onComplete') != 0){
										if(/^onError.+\'from\' must be a valid language/.test(text)){
											return this.boxElements.resultText = this.camelCaseText;
										}else{
											this.loadingAnimation();
											return this.statusAlert('未知错误');
										}
									}
									try{
										text = JSON.parse(res.responseText.replace(/^[^\(]*\(|\);/g,''));
									}catch(ex){
										this.loadingAnimation();
										return this.statusAlert('服务器响应格式错误');
									}

									//原文所属语言
									this.checkLanguge = text[0].From;

									var cText = this.camelCaseText.trim(),
										oText = cText.split('\n'), //原文
										rt = '', //译文
										languages = this.languages;

									for(var i=0;i<text.length;i++){
										//译文
										rt += ftt(text[i].TranslatedText, oText[i], 
											(languages[text[i].From] + 
												' -&gt; ' + languages[this.to]))
													.replace(/\<\/span\>/, '<br />$&');
									}

									//显示翻译文本
									this.boxElements.resultText = resultText(rt);

									//详细
									sentRequest({
										url: 'https://www.microsofttranslator.com/dictionary.ashx?oncomplete=jQuery&from='
											+ this.checkLanguge +'&to='+ this.to 
											+'&text='+ encodeURIComponent(cText) +'&_=',
										rqType: 'bingDictCallback'
									}, function(res){
										var text = res.responseText;
										text = decodeURIComponent(text.replace(/^[^\u0022]*\u0022|\u0022[^;]+;$/g,''));
										if(!text) return;
										detailBox.innerHTML = '<span class="_FgGTrDetailDictBing">'
											+ text.replace(/(\<span class\=")d(ictB"\>[^\>]+\>)\<br \/\>/g, '$1_FgGTrDetailD$2')
											+'</span>';
										//设置滚动条
										this.setClassName(detailBox, '_FgGTrDetailOverflow', false);
										this.setScrollbar();
									}.bind(this));
							}.bind(this);
							if(!this.bingAppId 
								|| /^onError.*(Invalid appId|The token is invalid\: Decryption failed|The token has expired)/
							.test(res.responseText)){
								//appid过期
								this.getBingAppId.call(this, function(appId){
									var url = details.url.replace(/appId\=%22[^%]*%22/, 'appId=%22' + appId + '%22');
									sentRequest({url: url}, bingTrantor);
								}.bind(this));
							}else{
								bingTrantor(res);
							}
						},

						getBingAppId: function(callback){
							this.sentRequest({
								url: 'https://www.bing.com/translator/dynamic/210010/js/LandingPage.js?gt=',
								rqType: 'bingGetAppId'
							}, function(res){
								var appid = res.responseText.match(/appId\:\"([^\"]+)/);
								if(appid && appid.length == 2){
									this.bingAppId = appid[1] || '';
									this.setPref.call(this, {bingAppId: this.bingAppId}); //保存bingAppId
									callback && callback.call(this, this.bingAppId);
								}else{
									this.loadingAnimation();
									this.statusAlert('错误：获取appId失败。');
								}
							}.bind(this));
						},

						baiduService: function(res, details){
							var {title: ftt, resultText: resultText, strFilter: sF} = this.filter,
								ftt = ftt.bind(this.filter),
								resultBox = this.boxElements.resultBox,
								detailBox = this.boxElements.detail,
								sentRequest = this.sentRequest.bind(this),
								setScrollbar = this.setScrollbar.bind(this),
								text = res.responseText,
								err = function(msg){
									this.loadingAnimation();
									return this.statusAlert(msg || '未知错误');
								}.bind(this);

							if(text == '') return err();
							try{
								text = JSON.parse(text);
								if(text.error != 0 && text.msg != 'success') return err(text.msg)
							}catch(ex){
								return err('服务器响应格式错误');
							}
							//原文所属语言
							this.checkLanguge = text.lan || 'auto';

							//当自动检测到为zh/en, 且翻译目标语言为zh/en时，默认翻译为 en/zh
							if(this.from == 'auto' 
								&& this.checkLanguge == this.to 
								&& ['zh', 'en', 'cht'].indexOf(this.to)>-1
							){
								this.to = ( ['zh', 'cht'].indexOf(this.to)>-1 ? 'en' : this.to);
								this.setResultLink();
								this.updateLanguages();
							}

							details.postData = 'from='+ (this.from == 'auto' ? this.checkLanguge : this.from)
										+ '&to=' + this.to + '&query=' + details.tText + '&transtype=hash&simple_means_flag=3'; //'&transtype=realtime';
							details.url = 'http://fanyi.baidu.com/v2transapi';
							//上次请求清除，重新添加
							this.loadingAnimation();
							sentRequest.call(this, details, function(res){
								clearInterval(resultBox.loading);
								var text = res.responseText,
									tRD = null,
									tDM = null,
									languages = this.languages,
									rt = '';//译文
								if(text == '') return err();
								try{
									text = JSON.parse(text);
								}catch(ex){
									return err('服务器响应格式错误');
								}

								var tt_r = text.trans_result,
									td_r = text.dict_result;

								if(tt_r){
									//重新设置原文所属语言
									this.checkLanguge = tt_r.from;

									//翻译结果
									tRD = tt_r.data;

									var ara_ru = !!~['ara', 'ru'].indexOf(this.checkLanguge);

									for(var p of tRD){
										if(!!p.result && p.dst){
											for(var ci of p.result){
												var range = ci[4][0].split('|').map(function(r){return parseInt(r, 10)});
													spr = ci[3], _spr = ci[1]; //添加 空格、换行
												spr.forEach(function(s){
													s = s.split('|');
													if(s.length){
														_spr = _spr.split('');
														_spr.splice(s[0] == '0' ? 0 : _spr.length, 0, s[1]); //0为句前，1为末尾
														_spr = _spr.join('');
													}
												});
												rt += ftt(_spr,
													this.filter.cut(p.src, range[0], range[0] + range[1], ara_ru),
													(languages[this.checkLanguge] + ' -&gt; ' + languages[this.to]));
											}
										}else{
											rt += ftt(p.dst, p.src, (languages[this.checkLanguge] + ' -&gt; ' + languages[this.to]));
										}
										if(p != tRD[tRD.length-1])
											rt = rt.replace(/(\<span title\="[^"]+?" class\=")([^"]+?)("\>[^\<]+)\<\/span\>$/,
														'$1$2 _FgGTrR-T-Span-P$3</span><br />');
									}
								}else{
									this.checkLanguge = null;
								}
								this.boxElements.resultText = 
									resultText(rt == '' ? this.camelCaseText : rt);

								var dictResult = null;
								//简单翻译
								if(td_r){
									var tSM = td_r.simple_means;
									if(tSM){
										var smUL = '',
											tSM_symbols = tSM.symbols,
											tSM_word_name = [];
										if(td_r.err_words){ //大小写区别单词
											tSM_word_name.push(tSM.word_name);
											for(var tEW of td_r.err_words){
												if(Array.isArray(tEW.symbols)){
													tSM_symbols = tSM_symbols.concat(tEW.symbols);
												}
												tSM_word_name.push(tEW.word_name);
											}
										}
										for(var p of tSM_symbols){
											var ph = [];
											if(tSM_word_name.length){
												smUL += '<b class="_FgGTr-bd-sm-WordName">' + tSM_word_name[tSM_symbols.indexOf(p)];
											}
											if(!p.word_symbol){
												p.ph_en && ph.push('[英]:['+ p.ph_en + ']');
												p.ph_am && ph.push('[美]:['+ p.ph_am + ']');
												(p.ph_en == p.ph_am) && ph.pop();
												if (ph.join(', ') != '') smUL += '<div class="_FgGTr-bd-sm-Phonetic">'+ ph.join(', ') +'</div>';
											}else{
												smUL += '<div class="_FgGTr-bd-sm-Phonetic">'+ p.word_symbol +'</div>';
											}
											if(tSM_word_name.length){
												smUL += '</b>';
											}
											for(var parts of p.parts){
												//parts.part      en->zh
												//parts.means.word_mean zh->en
												//词性 zh->en parts.part_name
												parts.part_name && (smUL += '<div class="_FgGTr-bd-sm-partsName"><b>['+ parts.part_name +']</b>');
												if(parts.part){
													smUL += '<div class="_FgGTr-bd-sm-parts"><b>'+ parts.part +'</b><ul>';
													for(var means of parts.means)
														smUL += '<li>' + means + '</li>';
													smUL += '</ul></div>';
												}else if(parts.means){
													smUL += '<ul class="_FgGTr-bd-sm-parts _FgGTr-bd-sm-parts-sg">';
													for(var means of parts.means){
														if(Array.isArray(parts.means)){
															if(typeof means == 'string'){
																smUL += '<li>' + means + '</li>';
															}else if(typeof means == 'object' && means.word_mean){
																smUL += '<li>' + means.word_mean + '</li>';
															}
														}else if(means.word_mean){
															smUL += '<li>' + means.word_mean + '</li>';
														}
													}
													smUL += '</ul>';
												}
												parts.part_name && (smUL += '</div>');
											}
										}
										//单词其他形式
										if(tSM.exchange){
											var exc = {
												'word_done': '过去分词',
												'word_past': '过去式',
												'word_ing': '现在进行时',
												'word_pl': '复数',
												'word_est': '最高级',
												'word_er': '比较级',
												'word_third': '第三人称单数'
											}, _exc = '';
											for(var wx in exc){
												if((wx in tSM.exchange) && tSM.exchange[wx]){
													_exc += '<li><i>' + exc[wx] + ':</i><span>';
													for(var wxc of tSM.exchange[wx]){
														_exc += '<a target="_blank" href="http://fanyi.baidu.com/#' 
																	+ (this.checkLanguge || this.from) +'/'+ this.to +'/'
																	+ wxc +'">' + wxc + '</a>';
													}
													_exc += '</span></li>';
												}
											}
											if(_exc !='') smUL += '<ul class="_FgGTr-bd-sm-exchange">' + _exc + '</ul>';
										}
										if(smUL != ''){
											dictResult = document.createElement('div');
											dictResult.id = '_FgGTr-bd-dict-result';
											dictResult.innerHTML = smUL;
											detailBox.appendChild(dictResult);
										}
									}

									//其他语言 jp <-> en
									var tCt = td_r.content,
										tVe = td_r.voice;
									if(tCt){
										var tcUL = '';
										for(var i of tCt){
											tcUL += '<ul>'
											for(var m of i.mean){
												tcUL += '<li class="_FgGTr-bd-sm-parts">'+ (m.pre ? '<b>'+ m.pre +'</b>' : '') + '<ul>';
												for(var c in m.cont){
													tcUL += '<li>' + c + '</li>';
												}
												tcUL += '</ul></li>';
											}
											tcUL += '</ul>'
										}
										if(tcUL != ''){
											dictResult = document.createElement('div');
											dictResult.id = '_FgGTr-bd-dict-result';
											dictResult.innerHTML = tcUL;
											detailBox.appendChild(dictResult);
										}
									}
									if(tVe){
										var _ph = {}, ph = '';
										for(var i of tVe) for(var p in i) _ph[p] = i[p];
										if(_ph.en_phonic && _ph.us_phonic){//en -> jp 读音
											ph = (_ph.en_phonic == _ph.us_phonic)
												? '[EN]:' + _ph.en_phonic
												: '[EN]:' + _ph.en_phonic + '' + ', [US]:' + _ph.us_phonic;

										}else if(_ph.phonic){//jp -> en 读音
											ph = _ph.phonic;
										}
										(ph != '') && (this.boxElements.phonetic = '<span class="_FgGTrR-T-Span">' + ph + '<span>');
									}
								}

								//其他详细翻译
								var tab = '', synthesize = '', net = '', cizu = '',
									tongfanyici = '', baike = '', tContent = '',
									zhxiyi = '', enxiyi = '';
								var setTab = function(tName){
									for(var i in tName){
										if(tName[i] != ''){
											tab += '<li>' + i + '</li>';
											tContent += '<li>' + tName[i] + '</li>';
										}
									}
									if(tContent && tab){
										tContent = '<div><ul class="_FgGTr-bd-tContent">' + tContent + '</ul></div>';
										detailBox.innerHTML += ('<ul class="_FgGTr-bd-drTab">'+ tab + '</ul>' + tContent);
									}

									var tabs = detailBox.querySelectorAll('._FgGTr-bd-drTab>li'),
										contents = detailBox.querySelectorAll('._FgGTr-bd-tContent>li');
									for(var i=0, len = tabs.length; i<len; i++){
										if(i == 0) {
											tabs[0].classList.add('_FgGTr-bd-drTab-current');
											contents[0].classList.add('_FgGTr-bd-tContent-current');
											tabs[0].parentNode.style
												.setProperty('min-width', (tabs[0].offsetWidth + 4) * len + 'px', 'important');
											//设置当前标签后才设置滚动条
											setScrollbar(contents[0].parentNode.parentNode);
										}
										tabs[i].onclick = (function(t){
											return function(){
												if(tabs[t].classList.contains('_FgGTr-bd-drTab-current')) return;

												//记录上一个的滚动位置
												var perv = detailBox.querySelector('._FgGTr-bd-tContent-current');
												if(perv){
													if(!perv.WHTB)
														perv.WHTB = {};
													perv.WHTB.T = perv.parentNode.offsetTop;
												}
												for(var i=0; i<len; i++){
													tabs[i].classList[i == t ? 'add' : 'remove']('_FgGTr-bd-drTab-current');
													contents[i].classList[i == t ? 'add' : 'remove']('_FgGTr-bd-tContent-current');
												}
												setScrollbar(contents[t].parentNode.parentNode);
											}
										})(i);
									}
								};

								//4个基础标签 & 后来新增的2个扩展标签
								if(td_r && ((typeof td_r == 'object') && !Array.isArray(td_r) || dictResult)){
									if(td_r.synthesize_means && td_r.synthesize_means.symbols 
											&& td_r.synthesize_means.symbols.length){ //汉英辞典
										for(var i of td_r.synthesize_means.symbols){
											synthesize += '<li>';
											if(i.xg != ''){
												synthesize += '<b>' + td_r.synthesize_means.word_name 
													+ ' <span>[' + i.word_symbol + ']</span></b>';
											}
											for(var cys of (i.cys.length && i.cys || i.parts.length && i.parts)){
												if(cys.part_name){
													synthesize += '<h5>[' + cys.part_name + ']</h5>';
												}
												if(cys.means && cys.means.length){
													synthesize += '<ul class="_FgGTr-bd-synthesizeCys">';
													for(means of cys.means){
														synthesize += '<li><h6>' + means.word_mean+ '</h6>';
														if(means.ljs && means.ljs.length){
															synthesize += '<ul class="_FgGTr-bd-synthesizeLjs">';
															for(var ljs of means.ljs)
																synthesize += '<li><ul><li>'+ ljs.ly + '</li><li>' + ljs.ls + '</li></ul></li>';
															synthesize += '</ul>';
														}
														synthesize += '</li>';
													}
													synthesize += '</ul>';
												}
											}
											synthesize += '</li>';
										}
										if(synthesize != '') synthesize = '<ul class="_FgGTr-bd-synthesize">' + synthesize + '</ul>';
									}
									if(td_r.net_means){ //网络析义
										for(var i of td_r.net_means)
											net += '<li><span>' + i.means + '</span></li>';
										if(net != '') net = '<ul class="_FgGTr-bd-net-means">' + net + '</ul>';
									}

									var _cizu = (td_r.cizu && td_r.cizu.length && td_r.cizu) || (td_r.cizuxiyu 
											&& td_r.cizuxiyu.cizu && td_r.cizuxiyu.cizu.length && td_r.cizuxiyu.cizu);
									if(_cizu){ //短语词组
										for(var i of _cizu){
											cizu += '<li><span>'+ (i.cz_name || i.cizu_name) +'</span>';
											if(i.jx && i.jx.length){
												cizu += '<ul class="_FgGTr-bd-czjx">';
												for(var jx of i.jx){
													cizu += '<li><span>' + (jx.jx_en || jx.jx_cn_mean) + '</span>';
													if(jx.lj && jx.lj.length){
														cizu += '<ul class="_FgGTr-bd-czlj">';
														for(var lj of jx.lj){
															cizu += '<li>'+ lj.lj_ly +'</li><li>' + lj.lj_ls + '</li>';
														}
														cizu += '</ul>';
													}
													cizu += '</li>'
												}
												cizu += '</ul>';
											}
											cizu += '</li>';
										}
										if(cizu != '') cizu = '<ul class="_FgGTr-bd-cizu">' + cizu + '</ul>';
									}

									if((td_r.tongyici && td_r.tongyici.length) //同反义词
										|| (td_r.fanyici && td_r.fanyici.length)){
										tongfanyici = (function(tfyc){
											var ul = [];
											for(var tf in tfyc){
												if(tfyc[tf]){
													var str = '';
													for(var i of tfyc[tf]){
														if(i.means){//en->zh
															str += '<li><b>'+ i.part_name +'</b><span><ul class="_FgGTr-bd-part-name">';
															for(var m of i.means){
																str += '<li><h6>' + m.word_mean + '</h6><ul class="_FgGTr-bd-word-mean">';
																for(var cis of m.cis){
																	str += '<li><a target="_blank" href="http://fanyi.baidu.com/#' 
																		+ (this.checkLanguge || this.from) +'/'+ this.to +'/'
																		+ cis.ci_name +'">' + cis.ci_name + '</a></li>';
																}
																str += '</ul></span></li>';
															}
															str += '</ul></span></li>';
														}else if(i.ci_name){//zh->en
															str += '<li><h6>' + i.ci_name + '</h6></li>';
														}
													}
													if(str != '') ul.push('<h5 class="_FgGTr-bd-tongfanyiciTitle">'+ ('同反'.charAt(tf)) 
														+'义词</h5><ul class="_FgGTr-bd-tongfanyici">' + str + '</ul>');
												}
											}
											return ul.join('');
										}).call(this, [td_r.tongyici, td_r.fanyici]);
									}

									var _baike = td_r.baike_means && td_r.baike_means.content && td_r.baike_means;
									if(_baike){//百科析义
										baike = '<div class="_FgGTr-bd-baike"><span>'+ _baike.content.replace(/\&amp;/g, '&') 
											+'</span><a title="前往百科页面" href="'+ _baike.link +'" target="_blank"></a></div>';
									}

									if(td_r.zdict){// 中中析义
										zhxiyi = (function(zdict){
											var arr = [];
											for(var zd in zdict){
												var xiyi = '';
												if(!zdict[zd] || (
													(!zdict[zd].means || !zdict[zd].means.length) && !zdict[zd].chenyu)
												) continue;

												var cyu = zdict[zd].chenyu;
												if(cyu){//成语解释
													var _cyu = {
														explain:  '解释',
														from:     '出处',
														example:  '例句',
														grammer:  '语法',
														synonyms: '同义词',
														antonym:  '反义词'
													};
													xiyi += '<div class="_FgGTr-bd-zdictTitle">成语解释</div><div class="_FgGTr-bd-zdictCyu">';
													if(cyu.pinyin) xiyi += '<b>' + td_r.zdict.word + ' <span>[' + cyu.pinyin + ']</span></b>';
													xiyi += '<ul>';
													for(var cy in _cyu){
														if(!cyu[cy]) continue;
														xiyi += '<li><b>' + _cyu[cy] + ':</b><span>' + cyu[cy] + '</span></li>';
													}
													xiyi += '</ul></div>';
													arr.push(xiyi);
													xiyi = '';
												}

												if(zdict[zd].means && zdict[zd].means.length){//字词、引证解释
													xiyi += '<div class="_FgGTr-bd-zdictTitle">'+ ['字词', '引证'][zd] + '解释</div>' 
														+ '<ul class="_FgGTr-bd-zdictMs">';
													for(var means of zdict[zd].means){
														xiyi += '<li>';
														if(means.pinyin)
															xiyi += '<b>' + td_r.zdict.word + ' <span>[' + means.pinyin + ']</span></b>';
														for(var exp of means.exp){
															if(zd == 1 && exp.pos) xiyi += '<div class="_FgGTr-bd-zdictPos"><h5>' + exp.pos + '</h5>';
															for(var des of exp.des){
																//去掉原先的序号 (1) / 1.
																xiyi += '<h6>' + des.main.replace(/^(?:\(\d+\)(?!\.)|\d+\.)/,'') + '</h6>';
																if(des.sub && des.sub.length){
																	xiyi += '<ul class="_FgGTr-bd-zdictSub">';
																	for(var sub of des.sub)
																		if(sub) xiyi += '<li>' + sub + '</li>';
																	xiyi += '</ul>';
																}
															}
															if(zd == 1 && exp.pos) xiyi += '</div>';
														}
														xiyi += '</li>';
													}
													xiyi += '</ul>';
													arr.push(xiyi);
												}
											}
											arr = arr.join('</li><li>');
											return arr ? '<ul class="_FgGTr-bd-zdict"><li>' + arr + '</li></ul>': '';
										}).call(this, [td_r.zdict.simple, td_r.zdict.detail]);
									}

									if(td_r.edict && td_r.edict.item && td_r.edict.item.length){// 英英析义
										for(var item of td_r.edict.item){
											enxiyi += '<li><h5>' + item.pos + '</h5>';
											for(var tg of item.tr_group){
												enxiyi += '<h6 class="_FgGTr-bd-edictTg">' + tg.tr + '</h6>';
												if(tg.example && tg.example.length){
													//例句
													enxiyi += '<ul class="_FgGTr-bd-edictExample">';
													for(var example of tg.example){
														enxiyi += '<li>' + example + '</li>';
													}
													enxiyi += '</ul>';
												}
												if(tg.similar_word && tg.similar_word.length){
													//同义词synonym
													enxiyi += '<h6>synonym:</h6><ul class="_FgGTr-bd-edictSynonym">';
													for(var synonym of tg.similar_word){
														enxiyi += '<li><a target="_blank" href="http://fanyi.baidu.com/#' 
																+ (this.checkLanguge || this.from) +'/'+ this.to +'/'
																+ synonym +'">' + synonym + '</a></li>';
													}
													enxiyi += '</ul>';
												}
											}
											enxiyi += '</li>';
										}
										if(enxiyi != '') enxiyi = '<ul class="_FgGTr-bd-edict">' + enxiyi + '</ul>';
									}
								}

								setTab({//标签 & 标签内容
									'中中析义': zhxiyi,
									'英英析义': enxiyi,
									'汉英辞典': synthesize,
									'短语词组': cizu,
									'同反义词': tongfanyici,
									'网络析义': net,
									'百科析义': baike
								});

								if(!tt_r && !td_r && text.error == 999 && text.from != null){
									this.checkLanguge = text.from;
									if(text.query)
										this.boxElements.resultText = text.query;
								}
							}.bind(this));
						},

						setTranslateText: function(word){
							word = (word || this.camelCaseText).trim();

							var details = {},
								callback = null,
								sentRequest = this.sentRequest,
								detailBox = this.boxElements.detail;

							//清除翻译文本
							this.boxElements.resultText = '';

							//清除状态
							this.boxElements.alertBox = '';

							//清空原来的
							while(detailBox.children.length){
								detailBox.removeChild(detailBox.firstChild);
							}
							detailBox.style.minWidth = '';
							this.setClassName(detailBox, '_FgGTrDetailOverflow', false);

							//清除注音
							this.boxElements.phonetic = '';

							//设置链接
							this.setResultLink();

							if(this.service == 'google'){
								details.url = this.google + 'translate_a/single?client=t&hl=auto&dt=bd&dt=ex&dt=ld&dt=md&sl=' + this.from + '&tl=' + this.to
													+ '&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&source=btn&srcrom=1&ssel=0&tsel=0&tk='+ this.getGoogleTK(word) +'&q='
													+ encodeURIComponent(word) + '&getTime=';
								details.timeout = 10000;
							}else if(this.service == 'bing'){
								details.url = 'https://api.microsofttranslator.com/v2/ajax.svc/TranslateArray2?appId=%22'+ this.bingAppId +'%22&texts='+ encodeURIComponent(JSON.stringify(word.split('\n'))) +'&from=%22'+ (this.from == 'auto' ? '' : this.from) +'%22&to=%22' + this.to + '%22&options=%7B%7D&oncomplete=onComplete_4&onerror=onError_4&_=';
							}else if(this.service == 'baidu'){
								details.method = 'POST';
								details.tText = encodeURIComponent(word);
								details.url = 'http://fanyi.baidu.com/langdetect';
								details.postData = 'query='+ encodeURIComponent(this.filter.cut(word, 0, 50)).replace(/%20/g, '+');
								details.headers = {
									'Content-Type': 'application\/x-www-form-urlencoded;',
									'X-Requested-With': 'XMLHttpRequest',
									'Accept':'*\/*'
								};
							}
							this.loadingAnimation();
							details.url && sentRequest.call(this, details, callback);
						},

						updateLanguages: function(both){
							var index = ['google', 'bing', 'baidu'].indexOf(this.service),
								languages = this.languages,
								updateList = {},
								lg = this._languages.langMap;

							for(var i of lg){
								for(var j of i){
									if(j == this.from)
										this.from = i[index];
									if(j == this.to)
										this.to = i[index];
								}
							}

							//如果不支持翻译的语言则设置为自动
							(!languages[this.from]) && (this.from = 'auto');
							(!languages[this.to]) && (this.to = lg[0][index]);

							if(index == 2){//baidu
								//数组为以外的语言，字符串（,）分割为只能翻译语言，空字符串为全能翻译语言。
								var _lm = this._languages.baiduLM,
									baiduLM = {};
								for(var m in _lm){
									if(typeof _lm[m] == 'string' && _lm[m] != ''){
										_lm[m].split(',').forEach(function(o){
											(baiduLM[m] || (baiduLM[m] = [])).push(o);
										});
									}else{
										for(var o in _lm){
											(_lm[m] == '' ? true : !~_lm[o].indexOf(m)) && (o != m)
												&& ((baiduLM[m] || (baiduLM[m] = [])).push(o));
										}
									}
								}

								both && (updateList.from = languages);
								var blm = baiduLM[this.from];
								if(blm){
									updateList.to = {};
									for(var i of blm){
										updateList.to[i] = languages[i];
									}
									(!~blm.indexOf(this.to)) && (this.to = blm[0]);
								}else if(this.from == 'auto'){
									updateList.to = languages;
								}
							}else{
								both && (updateList.from = languages);
								updateList.to = languages;
							}

							this.updateSelectMenu(updateList);
						},

						updateSelectMenu: function(obj){
							var o = this.boxElements,
								optionsBox = o.optionsBox,
								select = optionsBox.getElementsByClassName('_FgGTrOptionsSelect'),
								{from: fromList, to: toList} = obj;
							if(!select.length) return;

							for(var i=0;i<select.length;i++){
								if(select[i].className.indexOf('Service')<0){
									var itemsText = '', item = '',
										languages = [fromList, toList][i];
									if(languages){
										for(item in languages){
											var isZH = languages[item].indexOf('中文') == 0, //中文排在前
												option = '<option value="'+ item +'">'+ languages[item] +'</option>';
											itemsText = (isZH ? (option + itemsText) : (itemsText + option));
										}
										select[i].innerHTML = (i != 1 ? '<option value="auto">自动检测</option>' : '') + itemsText;
									}
								}
							}

							select[0].value = this.from;
							select[1].value = this.to;
						},

						sentRequest: function(details, callback){
							var resultBox = this.boxElements.resultBox;

							if(resultBox.ajaxRequest && resultBox.ajaxRequest.status !== 200){
								resultBox.ajaxRequest.abort();
							}

							var {url, method, postData, headers, rqType, timeout} = details;
							if(!url) return;

							var ld = rqType !='bingDictCallback';
							resultBox.ajaxRequest = this.ajax({
								method : method || 'GET',
								url : url + (/\=$/.test(url) ? new Date().getTime() : ''),
								timeout: timeout || 5000,
								postData: postData,
								headers: headers || {},
								onload : function(res) {
									res = res.target;
									if (res.status == 200) {
										if(callback){
											callback(res);
										}else{
											clearInterval(resultBox.loading);
											this[this.service + 'Service'](res, details);
										}
									}else if(res.status == 404 || res.status / 500 >= 1){
										ld && this.loadingAnimation();
										ld && this.statusAlert('错误：访问'+ this.service +'翻译服务器出错' 
											+ (rqType == 'bingGetAppId' ? '，获取bing AppId失败。' : '。'));
									}else if(res.status == 414 || res.status == 400){
										if(this.service == 'google'){
											this.statusAlert('错误：要翻译的文本过长。');
										}else{
											ld && this.statusAlert('错误：网络错误');
										}
										ld && this.loadingAnimation();
									}
								}.bind(this),

								ontimeout: function(e){
									ld && this.loadingAnimation();
									ld && this.statusAlert('错误：访问'+ this.service +'翻译服务器超时。');
									e.target.abort();
								}.bind(this),

								onerror: function(e){
									ld && this.loadingAnimation();
									ld && this.statusAlert('错误：访问'+ this.service +'翻译服务器发生错误' 
										+ (rqType == 'bingGetAppId' ? '，获取bing AppId失败。' : '。'));
									e.target.abort();
								}.bind(this)
							});
						},

						getTranslateBox: function (){
							var box = document.createElement('div');
							box.id = '_FgGTrMainBox';
							box.innerHTML = '\
								<div id="_FgGTrResult">\
									<div>\
										<a title="前往翻译页面" target="_blank">\
											<span class="_FgGTrResultText">loading</span>\
										</a>\
									</div>\
									<div class="_FgGTrSoundAndAlertBox">\
										<a class="_FgGTrSoundButton" title="发音"></a>\
										<span class="_FgGTrAlertBox _FgGTr-text-label"></span>\
										<span class="_FgGTrSoundPhonetic"></span>\
									</div>\
									<div class="_FgGTrDetail"></div>\
									<div class="_FgGTrOptions">\
										<a class="_FgGTrOptionsToggle" title="设置">▼</a>\
									</div>\
								</div>\
								<div class="_FgGTrOptionsBox"></div>';
							document.body.appendChild(box);

							this.boxElements = {
								box: box,
								toggleOn: false,
								style: null,
								set resultText(text) this.resultBox.innerHTML = text,
								get resultText() this.resultBox.textContent,
								set phonetic(text) this.phoneticBox.innerHTML = text,
								set alertBox(text) this.alertBox.textContent = text,
								get alertBox() this.get('AlertBox'),
								get phoneticBox() this.get('SoundPhonetic'),
								get soundButton() this.get('SoundButton'),
								get resultBox() this.get('ResultText'),
								get toggleButton() this.get('OptionsToggle'),
								get optionsBox()  this.get('OptionsBox'),
								get detail() this.get('Detail'),
								get swapButton() this.get('SwapButton'),
								get saveButton() this.get('OptionsSave'),
								get cancelButton() this.get('OptionsCancel'),
								get checkbox() this.get('OptionsCheckbox'),
								get serviceSelect() this.get('OptionsService'),
								get: function(name) {
									return this.box.querySelector('._FgGTr'+ name);
								}
							};
						},

						setResultLink: function(){
							var obj = {
								text        : encodeURIComponent(this.camelCaseText.trim()),
								from        : this.from,
								to          : this.to,
								checkLanguge: this.checkLanguge
							};
							var link = this.boxElements.resultBox.parentNode;
							if(this.service == 'google'){
								link.href = (this.google.indexOf('translate') < 0 
										//无法使用服务器IP直接连接至谷歌翻译页面
										? 'https://translate.google.com.hk/'
										: this.google) + '?text='+ obj.text +'&langpair='+ obj.from +'|'+ obj.to;
							}else if(this.service == 'bing'){
								link.href = 'https://www.bing.com/translator/default.aspx?to='+ obj.to +'&text='+ obj.text;
							}else if(this.service == 'baidu'){
								link.href = 'http://fanyi.baidu.com/#'
									+ obj.from + '/' + obj.to + '/' + obj.text;
							}
						},

						loadingAnimation: function(){
							var resultBox = this.boxElements.resultBox,
								_loading = null;
							clearInterval(resultBox.loading);
							resultBox.textContent = 'loading..';
							_loading = resultBox.loading = setInterval(function(){
								try{
									if(resultBox.textContent.length<10){
										resultBox.textContent += '.';
									}else{
										resultBox.textContent = 'loading';
									}
								}catch(ex){
									clearInterval(_loading);
								}
							}, 500);
						},

						setOptionsBox: function(){
							var o = this.boxElements;
							this.setClassName(o.toggleButton.parentNode, '_FgGTrOptionsHidden', true);
							if(o.optionsBox.children.length){
								return this.toggleHidden(o.optionsBox);
							}
							var optionsBox = o.optionsBox;
							optionsBox.innerHTML = '\
								<div>\
									<span class="_FgGTr-text-label">从:</span>\
									<select class="_FgGTrOptionsSelect _FgGTrOptionsSelectFrom"></select>\
									<a class="_FgGTrSwapButton" title="交换"></a>\
									<span class="_FgGTr-text-label">译作:</span>\
									<select class="_FgGTrOptionsSelect _FgGTrOptionsSelectTo"></select>\
								</div>\
								<div>\
									<span>\
										<span class="_FgGTr-text-label">服务:</span>\
										<select class="_FgGTrOptionsSelect _FgGTrOptionsService">\
											<option value="google">google</option>\
											<option value="bing">bing</option>\
											<option value="baidu">baidu</option>\
										</select>\
									</span>\
									<span id="_FgGTrOptionsCheckboxSpan">\
										<input type="checkbox" class="_FgGTrOptionsCheckbox" />\
										<span class="_FgGTr-text-label">驼峰式</span>\
									</span>\
									<span id="_FgGTrOptionsButtonSpan">\
										<a class="_FgGTrOptionsButton _FgGTrOptionsSave">保存</a>\
										<a class="_FgGTrOptionsButton _FgGTrOptionsCancel">取消</a>\
									</span>\
								</div>';
							var select = optionsBox.getElementsByClassName('_FgGTrOptionsSelect');

							//更新选择语言框
							this.updateLanguages(true);

							o.toggleOn = true;
							o.checkbox.checked    = this.camelCase;
							o.serviceSelect.value = this.service;

							o.optionsBox.addEventListener('change', this, false);
						},

						get getPlayList (){
							var str = this.camelCaseText;
							if(this.service == 'google'){
								var strArr = str.split(/(?=[ \u3000\n\r\t\s\,\.\?\!\！\？\。\，\u4e00-\u9fa5])/),
									strArr2 = [], strLeng = '',
									u1 = this.google + 'translate_tts?q=',
									u2 = '&tl=' + this.checkLanguge + '&prev=input&client=t';
								for(var j=0; j<strArr.length; j++){
									if((strLeng + strArr[j]).length<=100){
										strLeng += strArr[j];
									}else{
										strArr2.push(u1 + encodeURIComponent(strLeng) + u2 + '&tk=' + this.getGoogleTK(strLeng));
										strLeng = strArr[j];
									}
									if(j==strArr.length-1){
										strArr2.push(u1 + encodeURIComponent(strLeng) + u2 + '&tk=' + this.getGoogleTK(strLeng));
									}
								}
								return strArr2;
							}else if(this.service == 'bing'){
								return ['https://api.microsofttranslator.com/v2/http.svc/speak?appId='+ this.bingAppId +'&language='+this.checkLanguge +'&format=audio/mp3&options=MinSize&text='+encodeURIComponent(str)];
							}else if(this.service == 'baidu'){
								var lan = (this.checkLanguge || (this.from == 'auto' ? this.checkLanguge : this.from)),
									lan = (lan == 'cht' ? 'zh' : lan), spd = 2,
									part = '&text=' + encodeURIComponent(str) + '&spd=';
								if(lan == 'yue') lan = 'cte', spd = 5;
								else (lan == 'en' || lan == 'zh') && (spd = 2);
								return [(lan != 'zh')
										? 'http://fanyi.baidu.com/gettts?source=web&lan=' + lan + part + spd
										: 'http://tts.baidu.com/text2audio?pid=101&ie=UTF-8&lan=' + lan + part + spd
								];
							}
						},

						playSound: function(){
							var that = this,
								PL = that.getPlayList,
								PS = that.playSound;

							if(!PS.initialized){
								var header = {
									//google当使用服务器IP时要发送Host，否则返回404无法发音
									google: {
										Host: !~this.google.indexOf('google') ? 'translate.google.com' : this.google.match(/https?:\/\/([^\/]+)/)[1], 
										Referer: !~this.google.indexOf('google') ? 'https://translate.google.com/' : this.google
									},
									bing: {Host:'api.microsofttranslator.com', Referer:'https://www.bing.com/translator/'},
									baidu: {Referer:'http://fanyi.baidu.com'}
								};
								PS.get = function(idx){
									if(!that.player) return;
									this.initialized = true;
									that.getPlayList[idx] && that.ajax({
										method: 'GET',
										timeout: 5000,
										responseType: 'blob',
										url: that.getPlayList[idx],
										headers: (that.service in header) ? header[that.service] : [],
										onload: function(res) {
											res = res.target;
											if (res.status == 200) {
												var blob = res.response;
												//FF33或以下对content-type为audio/x-mpeg的音频解码有限制
												if(blob.type == 'audio/x-mpeg')
													blob = blob.slice(0, blob.size, 'audio/mpeg');
												that.player.src = window.URL.createObjectURL(blob);
												that.player.play();
											}else if(res.status == 404 || res.status / 500 >= 1){
												if(that.service == 'google' && res.status == 404){
													that.statusAlert('错误：无此语音，或文本过长。', 1000);
												}else{
													that.statusAlert('网络错误。', 1000);
												}
											}
										},
										ontimeout: function(e){
											that.statusAlert('错误：访问'+ that.service +'翻译服务器超时。');
											e.target.abort();
										}
									});
								};
							}

							if(!this.player){
								//为了突破CSP只能使用Chrome环境下的Audio构造函数
								this.player = new Audio();
								this.player.pIndex = 0;
								this.player.onended = function(){
									this.pIndex += 1;
									if(this.pIndex == PL.length){
										this.pIndex = 0;
										this.pause();
									}else{
										PS.get(this.pIndex);
									}
									window.URL.revokeObjectURL(this.src);
								};
								this.player.onloadstart = function(){
									that.statusAlert('共'+ PL.length
												+ '段语音，正在播放第' + (this.pIndex + 1) + '段。', 2500);
								};
								this.player.onerror = function(e){
									var i = that.getPlayList.indexOf(e.target.currentSrc);
									that.statusAlert('错误: 第'+ ((!!~i ? i : 0) + 1) +'段语音加载失败。', 2500);
									window.URL.revokeObjectURL(this.src);
								};
							}

							if (this.player && this.getPlayList.every(function(a, b){
									return PL[b] == a;
							})){
								PS.get(this.player.pIndex = 0);
							}
						},

						statusAlert: function(text, delay){
							clearTimeout(this.boxElements.alertBox.hideTimer);
							this.setClassName(this.boxElements.alertBox, '_FgGTrAlertBoxHide', false);
							this.boxElements.alertBox = text;
							this.boxElements.alertBox.hideTimer = setTimeout(function(){
								try{
									!delay || this.setClassName(this.boxElements.alertBox, 
																	'_FgGTrAlertBoxHide', true);
								}catch(ex){
									clearTimeout(arguments.callee);
								}
							}.bind(this), typeof delay == 'number' ? delay : 1000);
						},

						ajax: function(obj){
							var req = Cc['@mozilla.org/xmlextras/xmlhttprequest;1']
												.createInstance(Ci.nsIXMLHttpRequest);
							req.open(obj.method, obj.url, true);
							if(obj.headers){
								for(var i in obj.headers){
									req.setRequestHeader(i, obj.headers[i]);
								}
							}
							if(obj.responseType) req.responseType = obj.responseType;
							if(obj.timeout) req.timeout = obj.timeout;
							if(obj.ontimeout) req.ontimeout = obj.ontimeout;
							if(obj.onerror) req.onerror = obj.onerror;
							req.send(obj.postData && obj.method=='POST' ? obj.postData : null);
							req.onload = obj.onload;
							return req;
						},

						removeTranslateBox: function(){
							this.selectText = null;
							if(this.player && this.player.src){
								this.player.pause();
								window.URL.revokeObjectURL(this.player.src);
							}
							this.player = null;
							this.preSelection = [];
							if(this.boxElements){
								clearInterval(this.boxElements.resultBox.loading);
								this.boxElements.detail.removeEventListener('DOMMouseScroll', this, false);
								document.body.removeChild(this.boxElements.box);
								this.boxElements = null;
							}
							document.removeEventListener('mousedown',this, false);
							document.removeEventListener('mouseup',this, false);
							document.removeEventListener('mousemove',this, false);
							document.removeEventListener('keypass',this, false);
							window.removeEventListener('unload', this, false);
							this.originDocument.removeEventListener('mousedown',this, false);
						},

						setScrollbar: function(element){
							if(!this.boxElements) return;
							var detailBox = this.boxElements.detail;

							if(element && detailBox.scrollbar && detailBox.scrollbar.bar){
								try{
									//移除原来的滚动条, 由detail滚动条切换到baidu try
									element.removeChild(detailBox.scrollbar.bar);
									this.setClassName(element, '_FgGTrDetailOverflow', false);
								}catch(ex){}
								detailBox.scrollbar.bar = null;
							}
							var scrollBox = element || detailBox,
								contentBox = scrollBox.firstChild;
							scrollBox.style.minWidth = '';

							if(!contentBox) return;

							//缓存宽高
							var bdTab = detailBox.querySelector('._FgGTr-bd-tContent-current'),
								WHTB = (bdTab && bdTab.WHTB || (bdTab && (bdTab.WHTB = {}))),
								antiBlink = function(add){
									//消除伸缩闪烁
									bdTab || this.setClassName(this.boxElements.box, '_FgGTr-AntiBlink', add);
									bdTab && this.setClassName(bdTab.parentNode, '_FgGTr-AntiBlink', add);
							}.bind(this);
							antiBlink(true);

							setTimeout(function(){
								var detailHeight = 150,
									contentStyle = getComputedStyle(contentBox, null),
									contentHeight = (bdTab && (typeof WHTB.H == 'number'))
												? WHTB.H : parseInt(contentStyle.height),
									contentWidth = (bdTab && (typeof WHTB.W == 'number'))
												? WHTB.W : parseInt(contentStyle.width);

								if(bdTab && !WHTB.H){
									//如果未设置
									WHTB.H = contentHeight;
									WHTB.W = contentWidth;
								}

								if(contentHeight < 250) return antiBlink(false);
								var scrollbar = document.createElement('div'),
									thumb = document.createElement('div');
								scrollbar.className = '_FgGTr-scrollbar';
								thumb.className = '_FgGTr-thumb';

								detailBox.scrollbar = {
									scrollBox: scrollBox,
									bar: scrollbar,
									thumb: thumb,
									status: false,
									contentBox: contentBox,
									Y: 0,
									barHeight: parseInt(detailHeight),
									thumbHeight: Math.max(parseInt(detailHeight / 
												contentBox.offsetHeight * detailHeight), 10),
								};

								//上次滚动位置
								if(bdTab){
									contentBox.style.top = (!WHTB.T ? 0 : WHTB.T) + 'px';
									thumb.style.top = (!WHTB.B ? 0 : WHTB.B) + 'px';
								}

								this.setClassName(scrollBox, '_FgGTrDetailOverflow', true);

								if(contentWidth>=382){
									contentWidth = 382
								}else{
									contentWidth += 12;
								}

								scrollBox.style.setProperty('min-width', contentWidth + 'px','important');
								thumb.style.setProperty('height', detailBox.scrollbar.thumbHeight + 'px','important');

								scrollbar.appendChild(thumb);
								scrollBox.appendChild(scrollbar);

								antiBlink(false);
							}.bind(this), (bdTab && typeof WHTB.H == 'number') ? 0 : 50);
						},

						onScroll: function(event){
							var od = this.boxElements.detail,
								scroll = od.scrollbar,
								bdTab = od.querySelector('._FgGTr-bd-tContent-current');
							if(!scroll || !scroll.bar) return;
							var scrollBox = scroll.scrollBox || od,
								sbHeight = scroll.bar.offsetHeight;
							if(event.type == 'mousedown'){
								if(event.target == scroll.thumb){
									scroll.status = true;
									scroll.Y = event.clientY - scroll.thumb.offsetTop;
									return true;
								}
								return;
							}else if(event.type == 'mousemove'){
								var T = event.clientY - scroll.Y,
									Y = 0, p = 0;
								if(T <= scroll.bar.offsetTop){
									Y = scroll.bar.offsetTop;
								}else if(T >= sbHeight - scroll.thumbHeight){
									Y = sbHeight - scroll.thumbHeight;
								}else{
									Y = T;
								}
								p = (scroll.thumb.offsetTop - scroll.bar.offsetTop) / 
											(sbHeight - scroll.thumbHeight);
								if(p>=0.95){
									p = 1;
								}else if(p<0.05){
									p = 0;
								}

								scroll.contentBox.style.top = 
											parseInt((scrollBox.offsetHeight - 
												scroll.contentBox.offsetHeight) * p) + 'px';

								scroll.thumb.style.top = Y +'px';
								if(bdTab){
									if(!bdTab.WHTB)
										bdTab.WHTB = {};
									bdTab.WHTB.B = Y
								}

							}else if(event.type == 'DOMMouseScroll'){
								if(scrollBox.contains(event.target)){
									event.preventDefault();
									var s = parseInt(0 - event.detail * 4),
										ct = scroll.contentBox.offsetTop + s,
										cy = 0, p = 0, t = 0,
										outerHeight = scrollBox.offsetHeight,
										innerHeight = scroll.contentBox.offsetHeight;

									if(ct <= outerHeight - innerHeight){
										cy = outerHeight - innerHeight;
									}else if(ct>=0){
										cy = 0;
									}else{
										cy = ct;
									}
									p = cy/(outerHeight - innerHeight);

									if(p>=0.95){
										p = 1;
									}else if(p<0.05){
										p = 0;
									}

									t = parseInt((sbHeight - scroll.thumbHeight) * p);
									if(t<=0){
										t=0;
									}else if(t>= sbHeight - scroll.thumbHeight){
										t = sbHeight - scroll.thumbHeight;
									}

									scroll.thumb.style.top = parseInt(t*p) + 'px';
									scroll.contentBox.style.top = cy + 'px';

									if(bdTab){
										if(!bdTab.WHTB)
											bdTab.WHTB = {};
										bdTab.WHTB.B = parseInt(t*p);
									}
								}

								//渐变过渡
								this.setClassName(scroll.bar, '_FgGTrScrolling', true);
								if(event.type == 'DOMMouseScroll' && scroll.contentBox.contains(event.target))
									this.setClassName(scroll.contentBox, '_FgGTrScrolling', true);
								clearTimeout(scroll.scrTimer);
								scroll.scrTimer = setTimeout(function(){
									if(event.type == 'DOMMouseScroll'){
										this.setClassName(scroll.contentBox, '_FgGTrScrolling', false);
									}
									this.setClassName(scroll.bar, '_FgGTrScrolling', false);
								}.bind(this), 500);
							}
						},

						handleEvent: function(event){
							var box = this.boxElements.box;
							if(!box) return;
							var target = event.target,
								drag = box.drag,
								o = this.boxElements;
							if(!event.altKey && event.type == 'mousedown' && event.button==0){
								if(box.contains(target)){
									switch(target){
										case o.soundButton:
											this.playSound();
											break;
										case o.toggleButton:
											this.setOptionsBox();
											break;
										case o.saveButton:
											this.setPref();
											this.toggleHidden();
											break;
										case o.cancelButton:
											this.toggleHidden();
											break;
										case o.swapButton:
											this.swapLanguages();
											break;
										default:
											if(this.onScroll(event))
												break;
											var eTarget = event.explicitOriginalTarget,
												oTarget = event.originalTarget;

											if ((o.detail.contains(target) 
												|| o.resultBox.contains(target) 
												|| o.phoneticBox.contains(target))
												&& eTarget.nodeType == 3 && oTarget.nodeType == 1
												|| target.classList.contains('_FgGTrOptionsSelect')
											) return;

											drag.status = true;
											this.setClassName(o.box, '_FgGTrOptionsGrab', true);
											drag.X = event.clientX - box.offsetLeft;
											drag.Y = event.clientY - box.offsetTop;
									}
								}else{
									this.removeTranslateBox();
								}
								if(!~Array.prototype.slice.call(box.querySelectorAll('._FgGTrOptionsSelect'))
										.indexOf(target) &&
										(drag.status || (o.detail.scrollbar && o.detail.scrollbar.status))){
									event.preventDefault();
								}
							}
							if(event.type == 'mouseup' || event.type == 'keypass'){
								if(event.type == 'mouseup'){
									box.drag.status = false;
									o.detail.scrollbar && (o.detail.scrollbar.status = false);
									this.setClassName(o.box, '_FgGTrOptionsGrab _FgGTrOptionsGrabbing', false);
								}

								clearTimeout(o.selectionTimer);
								if(((o.detail.children[0] && o.detail.children[0] != target && 
												o.detail.children[0].contains(target))
											&& !(target.classList && target.classList.contains('_FgGTr-D-t1-Ci'))
									) || event.altKey || event.button!=0
								) return;
								o.selectionTimer = setTimeout(function(){
									var selection = window.getSelection();
									if(selection.focusNode 
										&& box.contains(selection.focusNode) 
										&& selection.toString().replace(/\s/g, '') !='')
										return;
									for (var i in this.preSelection){
										selection.addRange(this.preSelection[i]);
									}
								}.bind(this),50);
							}
							if(event.type == 'mousemove'){
								if(drag.status){
									this.setClassName(o.box, '_FgGTrOptionsGrabbing', true);
									this.setClassName(o.box, '_FgGTrOptionsGrab',false);
									box.style.left = event.clientX - drag.X + 'px';
									box.style.top  = event.clientY - drag.Y + 'px';
								}
								if(o.detail.scrollbar && o.detail.scrollbar.status){
									this.onScroll(event);
								}


								if(o.detail.moreUl && o.detail.moreUl.contains(target)){
									Array.prototype.forEach.call(o.detail.moreUl.children, function(li){
										if(li.contains(target)){
											li.getElementsByTagName('ul')[0].style.top 
													= li.getClientRects()[0].top + 16 +'px';
										}
									});
								}
							}

							if(event.type == 'DOMMouseScroll'){
								this.onScroll(event);
							}

							if(event.type == 'change'){
								if(box.contains(target)){
									if(target == o.checkbox){
										this.toggleCamelCase();
									}else if(target.className){
										if(/Select[^ ]/.test(target.className)){
											this.selectLanguages(event);
											if(target == o.get('OptionsSelectFrom'))
												this.updateLanguages();
										}else if(target.className.indexOf('Service')>0){
											this.toggleService();
										}
									}
								}
							}
							if(event.type == 'unload'){
								clearInterval(o.resultBox.loading);
								this.removeTranslateBox();
								window.FGgTranslator = null;
							}
						},

						toggleCamelCase: function(){
							var checked = this.boxElements.checkbox.checked;
							this.camelCase = this.camelCase != checked ?
										 checked : this.camelCase;

							this.setTranslateText();
						},

						toggleService: function(){
							this.service = this.boxElements.serviceSelect.value;
							this.updateLanguages(true);
							this.setTranslateText();
						},

						swapLanguages: function(){
							var select = this.boxElements.box.getElementsByClassName('_FgGTrOptionsSelect'),
								[from, to] = [select[0].value, select[1].value];

							//先设置form更新列表后才设置to
							select[0].value = to;
							this.from = select[0].value;
							this.updateLanguages(true);

							select[1].value = 
									Array.prototype.some.call(select[1].options, function(i){return i.value == from})
									? from : select[1].options[0].value;
							this.to = select[1].value;
							this.setTranslateText();
						},

						selectLanguages: function(event){
							var target = event.target;
							if(target.className.indexOf('SelectTo')>0){
								this.to = target.value;
							}else{
								this.from = target.value;
							}
							this.setTranslateText();
						},

						toggleHidden: function(elm){
							var o = this.boxElements,
								t = o.toggleOn,
								c = '_FgGTrOptionsHidden';
							if(elm){
								this.setClassName(elm, c, t);
							}else{
								this.setClassName(o.toggleButton.parentNode, c, !t);
								this.setClassName(o.optionsBox, c, t);
							}
							o.toggleOn = !t;
						},

						setClassName: function(elm, className, add){
							if(!elm) return;
							var classList = elm.className.split(' '),
								_classList = [];
							className = className.split(' ');

							for(var i=0;i<className.length;i++){
								var find = 0;
								for(var j=0;j<classList.length;j++){
									if(className[i] == classList[j]){
										if(!add && classList[0]!=''){
											classList.splice(j,1);
										}
									}else{
										if(add) find++;
									}
								}
								if(add && find == classList.length){
									_classList.push(className[i]);
								}
							}
							if(add){
								classList = classList[0]!='' ? classList.concat(_classList) : _classList;
							}

							classList = classList.sort().join(' ');
							if(elm.className.split(' ').sort().join(' ') != classList){
								elm.className = classList;
							}
						},

						xpPref:function(value){
							var pref = 'FireGestures.FGgTranslator.optionJSON';
							if(arguments.length==0){
								return Services.prefs.getCharPref(pref);
							}else{
								Services.prefs.setCharPref(pref, value);
								return value;
							}
						},

						getPref: function(){
							try{
								var pref = JSON.parse(this.xpPref());
								!pref.service && (pref.service = this.service);
								return pref;
							}catch(ex){
								var pref = {
									from:         this.from,
									to:           this.to,
									camelCase:    this.camelCase,
									service:      this.service,
									bingAppId:    this.bingAppId
								};
								this.xpPref(JSON.stringify(pref));
								return pref;
							}
						},

						setPref: function(json){
							if(json){
								var pref = this.getPref();
								for(var i in json)
									pref[i] = json[i];
								this.xpPref(JSON.stringify(pref));
							}else{
								this.xpPref(JSON.stringify({
									from:         this.from,
									to:           this.to,
									camelCase:    this.camelCase,
									service:      this.service,
									bingAppId:    this.bingAppId
								}));
							}
						},

						get camelCaseText() {
							return (this.camelCase 
										? this.selectText
											.replace(/([A-Z0-9])([A-Z])([a-z])/g, function(a, b, c, d){
												return b + ' ' + c.toLowerCase() + d;
											}).replace(/([a-z])([A-Z])/g, function(a, b, c){
												return b + ' ' + c.toLowerCase();
											}).replace(/([A-Za-z])\.([A-Za-z])/g, function(a, b, c){
												return b + ' ' + c.toLowerCase();
											})
										: this.selectText);
						},

						filter: {
							strFilter: function(str, num){
								num = num || 0;
								var f = [{
										'&':'&amp;',
										'\'':'&#x27;',
										'"':'&#x22;',
										'<':'&lt;',
										'>':'&gt;',
										'/':'&#47;',
									},
									' "\'“”‘’、｛｝{}[]【】.。…~·～〜，,;；:：' +
									'-=+*&＆＄$￥＊*＾^％%＃#＠@~()（）<>《》?？！!'
									],
									sF = arguments.callee;

								if(typeof num == 'number'){
									return str.replace(/./g, function(s){
											return num == 0 ? 
												(f[0][s] ? f[0][s] : s) : 
												(!!~f[1].indexOf(s) ? '' : s);
										});
								}else{
									return sF(str, 1).toLowerCase() == 
												sF(num, 1).toLowerCase();
								}
							},

							resultText: function(str){
								return str.replace(/(^\<span title\="[^"]+?" class\="[^"]+?"\>)((\<br \/\>)?[\s]?)*/,'$1')
								.replace(/\<span title\="[^"]+?" class\="[^"]+?"\>\<\/span\>/g,'')
								.replace(/(\<span title\="[^"]+?" class\=")([^"]+?)("\>[^\<]+)\<br \/\><\/span\>/g,
									'$1$2 _FgGTrR-T-Span-P$3</span><br />');
							},

							title: function(text, title, rt){
								return '<span'+(title ? (' title="' 
									+ (rt ? rt.replace(/\s[A-Za-z]+/g, '') +'\n' : '') 
									+'原文:\n\t'+ this.strFilter(title) +'"') : '')
									+' class="_FgGTrR-T-Span">'
									+ (this.strFilter(text).replace(/\n+/g,'<br />')) + '</span>';
							},

							cut: function(str, start, end, ru){
								var step = 0, string = '', i = 0, l = str.length;
								for (; i < l; i++) {
									step += (ru
										? ((/^[\u0600-\u06ff]+$/.test(str[i]) 
											|| /^[\ufb50\ufdff]+$/.test(str[i]) 
											|| /^[\ufe70-\ufefc]+$/.test(str[i]) 
											|| /^[\u0400-\u052F]+$/.test(str[i])) ? 2 : 1)
										: (/^[\u0391-\uFFE5]+$/.test(str.substr(i, 1)) ? 3 : 1));
									if (end < step)
										return string;
									else if (start < step)
										string += str.substr(i, 1);
								}
								return string;
							}
						},

						getSelection: function(event){
							var view = event.view,
								selection = view.getSelection(),
								txt = '';

							if(!this.selectText || !this.boxElements.box.contains(event.target)){
								this.preSelection = [];
								for (var i = 0; i < selection.rangeCount; i++){
									this.preSelection.push(selection.getRangeAt(i));
								}
							}

							if(event && Array.prototype.some
								.call(view.document.querySelectorAll('TEXTAREA, input'), function(item){
										return item.contains(event.target);
									})
							){
								txt = event.target.value.substr(event.target.selectionStart, 
																event.target.selectionEnd - 
																event.target.selectionStart);
							}else{
								try{
									txt = (function (elemt){
										var str = '',
											childs = elemt.childNodes;
										for (var child of childs) {
											if (child.nodeType == 1){
												var style = window.getComputedStyle(child);
												if (style.display == 'none' || style.visibility != 'visible'){
													continue;
												}else if(style.display == 'block'){
													str += arguments.callee(child) + '\n';
												}else if(child.tagName == 'BR'){
													str +=  '\n';
												}else{
													str += arguments.callee(child);
												}
											}else if (child.nodeType == 3){
												str += child.nodeValue;
											}
										}
										return str;
									})(selection.getRangeAt(0).cloneContents());
								}catch(ex){
									return '';
								}
							}

							return txt.replace(/(\&nbsp\;)/g,' ')
										.replace(/(\n\s*\n)/g,'\n')
										.replace(/\n+/g,'\n');
						},

						setStyle: function(element){
							var style = document.createElement('style'),
								cssText = (function(){/*
									#_FgGTrMainBox, 
									#_FgGTrMainBox :-moz-any(
										a, span, div, ul, li, img, b, i,
										h6, h5, input, select, option){
										margin:0;
										padding:0;
										font-size:12px;
										font-weight:normal;
										font-family:"微软雅黑";
										font-style:normal;
										text-align:left;
										line-height:16px;
										background:none;
										color:#000;
										white-space:normal;
										border:none;
										max-width: none;
										min-width: 0;
										max-height:none;
										min-height:0;
										word-wrap: break-word;
										height: auto;
										width: auto;
										vertical-align: baseline;
										box-shadow: none;
										text-shadow:none;
										outline: none;
										text-indent:0;
										box-sizing: content-box;
										float:none;
									}
									#_FgGTrMainBox #_FgGTrResult b{
										font-weight: bold;
									}
									._FgGTrOptionsSelect{
										background:#FFF;
									}
									#_FgGTrMainBox span::after,
									#_FgGTrMainBox span::before{
										display:none;
									}
									#_FgGTrMainBox {
										position:absolute;
										border: 2px solid #A2CD5A;
										border-radius: 8px;
										background:#D6E9F8;
										padding:5px;
										z-index: 10000000000;
										box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
										max-width: 400px;
										min-height: 26px;
										min-width: 71px;
									}
									#_FgGTrMainBox._FgGTrOptionsGrab{
										cursor: -moz-grab;
									}
									#_FgGTrMainBox._FgGTrOptionsGrabbing{
										cursor: -moz-grabbing;
									}
									#_FgGTrMainBox audio{
										display:none;
									}
									._FgGTrR-T-Span{
										border-bottom:1px dotted transparent;
									}
									._FgGTrResultText ._FgGTrR-T-Span{
										font-size:13px;
									}
									._FgGTrResultText,
									._FgGTrR-T-Span{
										color: #4899FF;
										cursor: pointer;
									}
									._FgGTrR-T-Span:hover{
										position: relative;
										border-color:#555;
										top:1px;
										left:1px;
									}
									._FgGTrR-T-Span._FgGTrR-T-Span-P::after{
										content:"¶";
										display:inline-block;
										width:1em;
										color:transparent;
									}
									._FgGTrR-T-Span._FgGTrR-T-Span-P:hover::after{
										color:#555;
									}
									._FgGTrSoundPhonetic:not(:empty){
										margin-bottom:5px;
										display: block;
									}
									._FgGTrSoundPhonetic >span._FgGTrR-T-Span,
									._FgGTr-bd-synthesize>li>b>span,
									._FgGTr-bd-zdictMs>li>b>span,
									._FgGTr-bd-zdictCyu>b>span,
									._FgGTr-bd-zdict h5>span,
									._FgGTr-bd-sm-Phonetic{
										color:#078723;
									}
									#_FgGTrMainBox #_FgGTrResult>div:first-child>a{
										text-decoration: none;
										outline: none;
									}
									#_FgGTrMainBox #_FgGTrResult>div:first-child{
										margin-bottom:5px;
									}
									._FgGTrDetail:not(:empty), 
									._FgGTr-bd-drTab + ._FgGTrDetailOverflow{
										position: relative;
										padding-bottom:4px;
									}

									#_FgGTrMainBox._FgGTr-AntiBlink #_FgGTrResult ._FgGTrDetail,
									._FgGTr-bd-tContent._FgGTr-AntiBlink{
										position: absolute;
										opacity:0;
										pointer-events:none;
										min-width: 382px;
									}
									._FgGTr-bd-drTab>div{
										min-height:20px;
									}

									._FgGTrDetailOverflow{
										height:150px;
										overflow-y:hidden;
										padding-right:7px;
									}
									._FgGTrDetail>span{
										display:inline-block;
									}
									._FgGTrDetailOverflow>:-moz-any(span, ._FgGTr-bd-tContent){
										position:absolute;
									}
									._FgGTr-scrollbar{
										height:calc(100% - 2px);
										position: absolute;
										right:3px;
										display: inline-block;
										width:1px;
										z-index:1000;
										background:transparent content-box;
										transition: background-color .3s ease-in-out .1s;
									}
									._FgGTr-thumb{
										border-radius:2px;
										right:-3px;
										position: absolute;
										background-color:rgba(0,0,0,.2);
										box-shadow:0 0 5px rgba(100,100,100,.3);
										width:7px;
										transition-duration: .5s;
										transition-property: background-color, box-shadow;
										transition-timing-function: ease-out;
									}
									._FgGTr-scrollbar:hover,
									._FgGTr-scrollbar._FgGTrScrolling{
										background-color:rgba(100,100,100,.3);
										transition: background-color .1s ease-in-out .1s;
									}
									._FgGTr-scrollbar>._FgGTr-thumb:hover,
									._FgGTr-scrollbar._FgGTrScrolling>._FgGTr-thumb{
										background-color: rgba(0,0,0,.8);
									}

									._FgGTrOptionsHidden {
										display:none;
									}
									._FgGTrSwapButton {
										padding:2px;
										margin-left:5px;
										display:inline-block;
										width:10px;
										height:10px;
										position:relative;
										top:3px;
										border-radius:3px;
										background:#63b8ff url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAABPSURBVBiVjZBBEoAwDALB6d/0yfZ1eCmZHMTKNQSyoSQsCQARNJoJAM7gm1SL/BDHqrP5is6/Nx596WVeKYZJENXk6i2QExPE7bO4+U4BPkLhGpcNmzyTAAAAAElFTkSuQmCC") no-repeat 2px 2px;
									}
									._FgGTrSwapButton:hover {
										background-color:#836FFF;
									}
									._FgGTrSoundButton {
										display:inline-block;
										width:16px;
										height:16px;
										background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNXG14zYAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDIvMDkvMTIDX+muAAAAmElEQVQ4ja2TYRGDMAxGHyjAAVaQhAQcTAISkLA5mAYUIOHjx1ou69KOHry7HqFtHrnSNJK4RIVgA6af3IJgTt6fgIA30P0TzGFzyhjml5IgJudKe4S1wRPYZLtwlB2eG7BYgTIjIj5n8PUhSbSZMj0GE68xqBG41AheJu6P6K5DzEk8ir8xlaScukhWYqm6yh5uMzVX23kHcuJ5DR7Q8gwAAAAASUVORK5CYII=") no-repeat;
									}

									._FgGTr-D-t1-Ci{
										color: #666;
										font-weight: bold;
										display:block;
									}
									._FgGTr-bd-zdictCyu>ul,
									._FgGTr-D-t1-Ul{
										display:table;
									}
									._FgGTr-bd-zdictCyu>ul>li,
									._FgGTr-D-t1-li{
										display:table-row;
									}
									._FgGTr-bd-zdictCyu>ul>li>:-moz-any(b, span),
									._FgGTr-D-t1-li>span {
										display:table-cell;
									}
									._FgGTr-D-t1-li>span:first-child{
										color: #D2691E;
										padding-right:15px;
										white-space:pre;
										vertical-align:middle;
									}
									._FgGTr-D-t1-li>span:last-child{
										max-width: 360px;
									}
									._FgGTr-D-t1-li>span:last-child>ul:hover{
										background:#ccc;
									}
									._FgGTr-bd-edictSynonym>li,
									._FgGTr-D-t1-li>span:last-child>ul>li{
										display:inline-block;
										color: #336FB8;
									}
									._FgGTr-bd-edictSynonym>li:not(:last-child)::after,
									._FgGTr-D-t1-li>span:last-child>ul>li:not(:last-child)::after{
										content:",";
										color:#000;
										display:inline-block;
										margin-right:2px;
									}

									#_FgGTrMainBox :-moz-any(._FgGTrSoundButton,._FgGTrOptionsButton,._FgGTrOptionsToggle){
										position:relative;
										color: #EE9A49;
										cursor: pointer;
										font-size: 10px;
										text-decoration: none;
										opacity:.5;
									}
									#_FgGTrMainBox :-moz-any(._FgGTrSoundButton,._FgGTrOptionsButton):active{
										opacity:1;
									}
									#_FgGTrMainBox :-moz-any(._FgGTrSoundButton,._FgGTrOptionsButton):hover{
										left:1px;
										top:1px;
										color:#A020F0;
									}
									._FgGTrOptionsToggle{
										opacity:1;
										top:-7px;
										left:2px;
										-moz-user-select: none;
									}
									._FgGTrOptionsToggle:hover{
										color:#A020F0;
										top:-6px;
										left:3px;
									}
									._FgGTrOptions{
										text-align:right;
										height:2px;
									}
									._FgGTrOptionsBox:not(:empty){
										background-color: #F0FFFF;
										border-radius: 0 0 7px 7px;
										line-height: 24px;
										min-height: 48px;
										text-align: center;
										min-width:255px;
										padding-top: 2px;
									}
									._FgGTrOptionsBox>div{
										text-align: center;
									}
									._FgGTrOptionsBox>div:last-child{
										padding: 4px 0;
									}
									._FgGTrOptionsSelect{
										font-family:"微软雅黑";
										font-size: 12px;
										text-align:left;
										border: 1px solid #ccc;
										margin: 0;
										padding: 0;
										width: 88px;
										height: 24px;
										color:#000;
										outline: 0;
									}
									._FgGTrOptionsService{
										width: 65px;
									}
									._FgGTrOptionsCheckbox{
										position: relative;
										top: 2px;
										vertical-align: baseline;
									}
									._FgGTrOptionsCheckbox+span{
										margin-right:15px;
									}
									._FgGTrOptionsButton{
										-moz-user-select: none;
										background:#FFFFF0;
										border: 1px solid #CCCCCC;
										border-radius: 4px;
										color: #FFA500;
										height: 19px;
										padding: 0px 5px 0;
										font-size:12px;
										opacity:1;
									}
									._FgGTr-text-label{
										pointer-events: none;
										-moz-user-select: none;
									}
									#_FgGTrMainBox ul{
										list-style:none;
										display:inline-block;
									}
									#_FgGTrMainBox li{
										height:16px;
										list-style:none;
										line-height:16px;
									}
									._FgGTrDetailDictBing{
										color: #1F4072;
									}
									._FgGTrDetailDictB{
										font-weight: bold;
										display: block;
									}
									#_FgGTrMainBox :-moz-any(._FgGTr-D-t5-li1, ._FgGTr-D-t5-li2) :-moz-any(span,li){
										white-space: pre;
									}
									._FgGTr-D-t5-li1{
										margin-right:15px;
									}
									._FgGTr-D-t5-li1 >span{
										color: #D2691E;
									}
									._FgGTr-D-t5-li2>span{
										position:relative;
									}
									._FgGTr-D-t5-li2 >span>span{
										color: #336FB8;
										padding:0 4px;
										border: 2px solid transparent;
									}
									._FgGTr-D-t5-li2>span>ul>li{
										color: #336FB8;
									}
									._FgGTr-D-t5-li2>span>ul>li:not(:first-child){
										border-top: 1px dotted #555;
									}
									._FgGTr-D-t5-li2 >span>span:hover,
									._FgGTr-D-t5-li2>span>ul>li:hover{
										background:#ccc;
									}
									._FgGTr-D-t5-li2>span>ul{
										position:fixed;
										display:none;
										padding:4px 4px;
										margin-top:-22px;
										border: 2px solid #A2CD5A;
										border-radius: 8px;
										background:#D6E9F8;
										z-index: 10000;
										box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
									}
									._FgGTr-D-t5-li2:hover >span>ul{
										display:block;
									}
									._FgGTr-bd-sm-partsName{
										display: flex;
									}
									._FgGTr-bd-sm-partsName>b{
										color: #D2691E;
										white-space: pre;
									}
									._FgGTr-bd-sm-parts li{
										display: inline-block;
										margin-left: 10px;
										color: #1373B0;
									}
									._FgGTr-bd-sm-parts li:not(:last-child)::after{
										content: ';';
										color: #000;
									}
									._FgGTr-bd-sm-parts:not(._FgGTr-bd-sm-parts-sg) {
										height: auto;
										display: flex;
									}
									._FgGTr-bd-sm-parts._FgGTr-bd-sm-parts-sg>li,
									._FgGTr-bd-sm-WordName > div{
										margin:0 0 0 5px;
										word-wrap: normal;
									}
									._FgGTr-bd-sm-exchange>li>span,
									._FgGTr-bd-sm-exchange>li,
									._FgGTr-bd-sm-exchange{
										display: flex;
									}
									._FgGTr-bd-sm-exchange>li>span,
									._FgGTr-bd-sm-exchange>li{
										flex-direction: column;
									}
									._FgGTr-bd-sm-exchange>li{
										border-right: 1px dashed #AAA;
									}
									._FgGTr-bd-sm-exchange>li:last-child{
										border-right: none;
									}
									._FgGTr-bd-edict h6:not([class]),
									._FgGTr-bd-sm-exchange>li>i{
										font-style:italic;
										padding: 0 2px;
										font-size:90%;
										color: #888;
									}
									._FgGTr-bd-sm-exchange>li>i{
										border-bottom:1px dashed #AAA;
										padding-bottom: 2px;
										text-align: center;
									}
									._FgGTr-bd-sm-exchange>li>i+span{
										padding: 0 2px;
									}
									._FgGTr-bd-edictSynonym>li>a,
									._FgGTr-bd-sm-exchange>li>span>a{
										text-align: center;
										color: #08008B;
									}

									._FgGTrDetailOverflow>span._FgGTrScrolling ._FgGTr-D-t5-li2 >span>ul{
										display:none;
									}
									._FgGTrAlertBox{
										color: #F60;
										opacity: 1;
										display:inline-block;
										position:relative;
										top:-3px;
										height:16px;
										transition: opacity .2s ease-in-out .2s;
									}
									._FgGTrAlertBox._FgGTrAlertBoxHide{
										opacity: 0;
										transition: opacity .3s ease-in-out .5s;
									}

									._FgGTr-bd-drTab-current{
										background-color: #D7E3E9;
										font-weight: bold;
									}
									._FgGTr-bd-drTab+div{
										border:2px solid #A2CD5A;
										min-height: 16px;
									}
									._FgGTr-bd-drTab>li {
										display: inline-block;
										padding: 2px 4px;
										margin: 1px 2px -2px;
										border: 2px solid #A2CD5A;
										border-radius: 5px 5px 0 0;
										border-bottom: 2px solid #D7E3E9;
										cursor: pointer;
										-moz-user-select: none;
										position: relative;
										z-index:1;
									}

									._FgGTr-bd-drTab>li:first-child{
										margin-left: 0;
									}
									._FgGTr-bd-drTab>li:not(._FgGTr-bd-drTab-current){
										color: #666;
									}
									._FgGTr-bd-drTab>li::after{
										display: block;
										width: calc(100% + 2px);
										height: 1px;
										content: '';
										position: absolute;
										bottom: -2px;
										left: -1px;
										background-color: #A2CD5A;
									}
									._FgGTr-bd-drTab>li._FgGTr-bd-drTab-current::after{
										width: 1px;
									}
									._FgGTr-bd-tContent>li:not(._FgGTr-bd-tContent-current){
										display:none;
									}
									._FgGTr-bd-net-means>li {
										padding:0px 5px;
										list-style: inside decimal;
										font-size: 90%;
										color:#777;
									}
									._FgGTr-bd-net-means>li:hover {
										background-color: #ccc;
									}
									._FgGTr-bd-net-means>li>span {
										color: #1373B0;
									}
									._FgGTr-bd-tContent>li {
										display: block;
										height: auto;
										margin: 5px 0;
									}
									._FgGTr-bd-tongfanyici li {
										height: auto;
									}
									._FgGTr-bd-tContent :-moz-any(h5, h6, b) {
										font-weight: bold;
									}
									._FgGTr-bd-tContent h5 {
										margin-left:5px;
										color: #000;
										font-size: 12px;
									}
									._FgGTr-bd-zdictCyu>ul>li>b,
									._FgGTr-bd-sm-WordName,
									._FgGTr-bd-tContent h6 {
										color: #0E4780;
									}
									._FgGTr-bd-tongfanyici>li {
										display: flex;
									}
									._FgGTr-bd-tongfanyici>li>b {
										position: absolute;
										padding-left: 10px;
									}
									._FgGTr-bd-tongfanyici>li>b:not(:empty)+span{
										margin-top: 16px;
									}
									._FgGTr-bd-sm-WordName > div,
									._FgGTr-bd-word-mean>li {
										display: inline-block;
									}
									._FgGTr-bd-word-mean>li>a{
										color: #1373B0;
										text-decoration: none;
										padding: 0 2px;
									}
									._FgGTr-bd-edictSynonym>li>a,
									._FgGTr-bd-sm-exchange>li>span>a,
									._FgGTr-bd-word-mean>li>a{
										text-decoration: none;
									}
									._FgGTr-bd-edictSynonym>li>a:hover,
									._FgGTr-bd-sm-exchange>li>span>a:hover,
									._FgGTr-bd-word-mean>li>a:hover{
										text-decoration: underline;
										background-color: #ccc;
										border-radius: 3px;
										box-shadow:inset 0 0 4px rgba(0,0,0,.3);
										transition: background-color 200ms, box-shadow 200ms;
									}
									._FgGTr-bd-word-mean>li:not(:last-child)::after {
										content:',';
										color:#666;
									}
									._FgGTr-bd-tongfanyici h6 {
										margin:0;
									}
									._FgGTr-bd-cizu li{
										height:auto;
									}

									._FgGTr-bd-tContent {
										background-color: #D7E3E9;
										width: 100%;
									}
									._FgGTr-bd-synthesize>li>b + ._FgGTr-bd-synthesizeCys,
									._FgGTr-bd-synthesize>li>h5 + ._FgGTr-bd-synthesizeCys,
									._FgGTr-bd-zdictMs>li>:-moz-any(h6, ul),
									._FgGTr-bd-edict>li>:-moz-any(h6, ul),
									._FgGTr-bd-tongfanyici>li>b+span,
									._FgGTr-bd-tongfanyici>li>h6,
									._FgGTr-bd-czjx>li {
										margin-left: 20px;
									}
									._FgGTr-bd-zdictPos{
										margin-left: 25px;
									}
									._FgGTr-bd-zdictMs ._FgGTr-bd-zdictPos>h5,
									._FgGTr-bd-synthesize>li>h5{
										color: #D2691E;
										margin-left: -20px;
									}
									._FgGTr-bd-zdictCyu>:-moz-any(ul, b),
									._FgGTr-bd-synthesize>li>h5,
									._FgGTr-bd-synthesizeCys{
										margin-left:10px;
									}
									._FgGTr-bd-synthesize ._FgGTr-bd-synthesizeCys{
										width: calc(100% - 10px);
									}
									._FgGTr-bd-synthesize>li>h5 + ._FgGTr-bd-synthesizeCys,
									._FgGTr-bd-synthesize>li>b + ._FgGTr-bd-synthesizeCys{
										width: calc(100% - 20px);
									}
									._FgGTr-bd-synthesize>li>b,
									._FgGTr-bd-cizu>li>span,
									._FgGTr-bd-zdictMs>li>b,
									._FgGTr-bd-edict>li>h5,
									._FgGTr-bd-zdict h5{
										font-size: 12px;
										display: block;
										font-weight: bold;
										margin-left: 5px;
										color: #0E4780;
									}
									._FgGTr-bd-zdictTitle,
									._FgGTr-bd-tongfanyiciTitle{
										font-weight: bold;
										font-style: italic;
										color:#333;
										text-shadow:0 0 2px #fff;
									}
									._FgGTr-bd-zdictCyu>ul>li>b{
										vertical-align: middle;
										text-align: right;
										padding-right:2px;
									}

									._FgGTr-bd-synthesizeCys,
									._FgGTr-bd-tongfanyici,
									._FgGTr-bd-part-name,
									._FgGTr-bd-edict>li,
									._FgGTr-bd-zdictPos,
									._FgGTr-bd-zdictMs,
									._FgGTr-bd-czjx {
										counter-reset: bd-czjx;
									}
									._FgGTr-bd-synthesize>li>b,
									._FgGTr-bd-czjx>li>span,
									._FgGTr-bd-zdictMs>li>b,
									._FgGTr-bd-edict>li>h6,
									._FgGTr-bd-tContent b,
									._FgGTr-bd-sm-parts b,
									._FgGTr-bd-zdict h5{
										font-weight: bold;
										color: #124DF6;
									}
									._FgGTr-bd-tContent b,
									._FgGTr-bd-sm-parts b{
										white-space: pre;
									}

									._FgGTr-bd-tongfanyici>li>b:not(:empty)+span
										>._FgGTr-bd-part-name>li>h6:not(:empty)::before,
									._FgGTr-bd-synthesizeCys>li>h6:not(:empty)::before,
									._FgGTr-bd-tongfanyici>li>h6:not(:empty)::before,
									._FgGTr-bd-zdictMs>li>h6:not(:empty)::before,
									._FgGTr-bd-czjx>li>span:not(:empty)::before,
									._FgGTr-bd-zdictPos>h6:not(:empty)::before,
									._FgGTr-bd-edictTg:not(:empty)::before {
										content: counter(bd-czjx)". ";
										counter-increment: bd-czjx;
										display: inline-block;
										margin-right:3px;
										color: #777;
										font-size:90%;
									}
									._FgGTr-bd-synthesizeLjs>li>ul,
									._FgGTr-bd-synthesizeLjs,
									._FgGTr-bd-synthesize ul,
									._FgGTr-bd-tongfanyici,
									._FgGTr-bd-synthesize,
									._FgGTr-bd-net-means,
									._FgGTr-bd-zdictMs,
									._FgGTr-bd-drTab,
									._FgGTr-bd-czjx,
									._FgGTr-bd-cizu,
									._FgGTr-bd-czlj{
										display: block;
										width: 100%;
									}

									._FgGTr-bd-synthesizeLjs>li:not(:last-child){
										border-bottom:1px dashed #888;
									}

									._FgGTr-bd-synthesizeLjs>li>ul>li:last-child,
									._FgGTr-bd-czlj>li:nth-child(2n),
									._FgGTr-bd-zdictCyu>ul>li>span,
									._FgGTr-bd-tongfanyici>li>h6,
									._FgGTr-bd-edictExample>li{
										color: #1373B0;
										width: 100%;
									}
									._FgGTr-bd-zdictSub>li{
										color: #1373B0;
									}
									._FgGTr-bd-zdictSub:empty{
										display:none;
									}
									._FgGTr-bd-sm-WordName ~ ._FgGTr-bd-sm-parts,
									._FgGTr-bd-edictExample,
									._FgGTr-bd-zdictSub{
										display: block;
									}
									._FgGTr-bd-tContent ._FgGTr-bd-synthesizeLjs>li>ul>li,
									._FgGTr-bd-tContent ._FgGTr-bd-czlj>li,
									._FgGTr-bd-edictExample>li,
									._FgGTr-bd-zdictSub>li{
										list-style: outside none circle;
										margin-left: 1em;
										width: calc(100% - 1em);
									}
									._FgGTr-bd-tContent ._FgGTr-bd-czlj>li:-moz-any(:nth-child(4n+3), :nth-child(4n+4)),
									._FgGTr-bd-tContent ._FgGTr-bd-synthesizeLjs>li:nth-child(2n)>ul>li{
										list-style: outside none square;
									}
									._FgGTr-bd-synthesizeLjs>li>ul>li:hover,
									._FgGTr-bd-zdictCyu>ul>li>span:hover,
									._FgGTr-bd-tongfanyici>li>h6:hover,
									._FgGTr-bd-edictExample>li:hover,
									._FgGTr-bd-zdictSub>li:hover,
									._FgGTr-bd-czlj>li:hover{
										background-color: #F5ECD4;
										transition: background-color 200ms;
									}

									._FgGTr-bd-baike{
										text-indent: 2em;
										margin-left:5px;
										margin-right: 5px;
										position: relative;
									}
									._FgGTr-bd-baike>span{
										vertical-align: text-top;
										text-decoration: none;
										color: #1373B0;
									}
									._FgGTr-bd-baike>span+a{
										position: absolute;
										width: 12px;
										height:12px;
										display: inline-block;
										background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMS8yMy8xNAID5ZwAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzbovLKMAAABI0lEQVQYlV2Qu0qcURSF19lnn+vPPzLgH7AJzitYDFhZBHwAEZ9AbCzTBVKFELuQiC9g4w3yIAGL2IiCjyB2wuDssyzMwOAHq103kMSyutJdqihVlN55Ro0v45XxhSMJAOhK98E5l81saK0dt9Y28R/xMpf1j+urNdffZnZtZt+HYbh3zj1gCZubuprrP2tmbPzlvb9rrX02s128J/jAWuo3kiipfF30U1FGjVdR418VpQAAiAQAzrlbJ+4ZAETkz2Qy2Q8hHMYYz98cc/2xWF1L3ckxf8kpb5VUTrvSrZEEokaWVI7e35RD3kshPfZdP5CEppROZrPZdknFi4gBEIIE8ElEzlT1CQBwsH/gRv3oZ/CBKsrgA4MPLLncTDem/SLhFW8KhG0rqnVmAAAAAElFTkSuQmCC') no-repeat 0 1px;
										opacity: 0.4;
										bottom: -3px;
										right: -3px;
									}
									._FgGTr-bd-baike>span+a:hover{
										opacity: 0.6;
									}
								*/}).toString().replace(/^.+\s|.+$/g,'')
									.replace(/\/\/.*/g,'')
									.replace(/;\n/g,' !important;\n')
									.replace(/\n\t+\./g,'\n#_FgGTrMainBox .');
							style.textContent = cssText
									.replace(/\n\t+\$[^;]+;\$/g,'').replace(/\&/g,'&amp;');
							element.appendChild(style);
							return style;
						},
					}
				}
				window.FGgTranslator.init(event);
			})(win, doc,event);
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
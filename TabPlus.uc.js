// ==UserScript==
// @name				TabPlus
// @description			标签管理
// @modby	          	feiruo
// @charset       		UTF-8
// @include				chrome://browser/content/browser.xul
// @include				chrome://browser/content/bookmarks/bookmarksPanel.xul
// @include				chrome://browser/content/history/history-panel.xul
// @include				chrome://browser/content/places/places.xul
// @id              	[5C5BB610]
// @startup       		window.TabPlus_mod.init();
// @shutdown      		window.TabPlus_mod.onDestroy(true);
// @homepageURL   		https://github.com/feiruo/userchromejs/
// @version      		0.1
// @note 				新しいタブで開く（空白タブを利用）
// @note 				新标签打开（智能利用空白标签）
// @note				必要なものだけ使って不要であれば削除するなりコメントアウトして下さい
// @note				不需要的功能请自行注释掉
// ==/UserScript==
(function() {
	if (window.TabPlus_mod) {
		window.TabPlus_mod.onDestroy();
		delete window.TabPlus_mod;
	}
	var TabPlus_mod = {
		gURLBar: null,
		openLinkIn: null,
		whereToOpenLink: null,
	};
	TabPlus_mod.init = function() {
		this.urlbarNewTab(true); // 地址栏新标签打开
		this.historyNewTab(true); //新标签打开书签，历史和搜索栏
		this.whereToOpen(true); // 中クリックでフォーカスを反転
		this.ldblclickC(true); //左键双击标签关闭
		this.mouseScroll(true); //滚轮切换标签
		this.rclickC(true); //标签上点击鼠标右键关闭标签
		//this.mMousedownR(true); //标签栏空白部分中间恢复关闭的标签
		//this.mMousedownP(true); //中键锁定标签
		//this.ldblclickR(true); //双击标签刷新
		//this.ldblclickRU(true); //未加载标签上双击刷新
		//this.nearTab(true); //紧邻当前标签新建标签页
		//this.cOLTab(true); //关闭标签聚焦左侧标签
	};
	TabPlus_mod.onDestroy = function(isOk) {
		this.urlbarNewTab(false);
		this.historyNewTab(false);
		this.whereToOpen(false);
		this.ldblclickC(false);
		this.mouseScroll(false);
		this.rclickC(false);
		//this.mMousedownR(false);
		//this.mMousedownP(false);
		//this.ldblclickR(false);
		//this.ldblclickRU(false);
		this.nearTab(false);
	};
	TabPlus_mod.urlbarNewTab = function(isOk) {
		if (isOk) {
			try {
				this.gURLBar = gURLBar.handleCommand.toString();
				location == "chrome://browser/content/browser.xul" && eval("gURLBar.handleCommand=" + gURLBar.handleCommand.toString().replace(/^\s*(load.+);/gm, "if(/^javascript:/.test(url)||isTabEmpty(gBrowser.selectedTab)){loadCurrent();}else{this.handleRevert();gBrowser.loadOneTab(url, {postData: postData, inBackground: false, allowThirdPartyFixup: true});}"));
			} catch (e) {}
		} else {
			try {
				location == "chrome://browser/content/browser.xul" && eval("gURLBar.handleCommand=" + this.gURLBar);
			} catch (e) {}
		}
	};
	TabPlus_mod.historyNewTab = function(isOk) {
		if (isOk) {
			try {
				this.openLinkIn = openLinkIn.toString();
				eval('openLinkIn=' + openLinkIn.toString().replace('w.gBrowser.selectedTab.pinned', '(!w.isTabEmpty(w.gBrowser.selectedTab) || $&)').replace(/&&\s+w\.gBrowser\.currentURI\.host != uriObj\.host/, ''));
			} catch (e) {}
		} else {
			try {
				eval('openLinkIn=' + this.openLinkIn);
			} catch (e) {}
		}
	};
	TabPlus_mod.whereToOpen = function(isOk) {
		if (isOk) {
			try {
				this.whereToOpenLink = whereToOpenLink.toString();
				eval('whereToOpenLink=' + whereToOpenLink.toString().replace(' || middle && middleUsesTabs', '').replace('if (alt', 'if (middle && middleUsesTabs) return shift ? "tab" : "tabshifted"; $&'));
			} catch (e) {}
		} else {
			try {
				eval('whereToOpenLink=' + this.whereToOpenLink);
			} catch (e) {}
		}
	};
	TabPlus_mod.ldblclickC = function(isOk) {
		function acction(event) {
			if (event.target.localName == 'tab' && event.button == 0)
				gBrowser.removeTab(event.target);
		}

		if (isOk) {
			gBrowser.mTabContainer.addEventListener('dblclick', acction, true);
		} else {
			gBrowser.mTabContainer.removeEventListener('dblclick', acction, true);
		}
	};
	TabPlus_mod.mouseScroll = function(isOk) {
		function acction(event) {
			this.advanceSelectedTab(event.detail > 0 ? +1 : -1, true);
		}

		if (isOk) {
			gBrowser.mTabContainer.addEventListener('DOMMouseScroll', acction, true);
		} else {
			gBrowser.mTabContainer.removeEventListener('DOMMouseScroll', acction, true);
		}
	};
	TabPlus_mod.rclickC = function(isOk) {
		function acction(event) {
			if (event.target.localName == "tab" && event.button == 2 && !event.ctrlKey) {
				gBrowser.removeTab(event.target);
				event.stopPropagation();
				event.preventDefault();
			}
		}

		if (isOk) {
			gBrowser.mTabContainer.addEventListener('click', acction, true);
		} else {
			gBrowser.mTabContainer.removeEventListener('click', acction, true);
		}
	};
	// -------------------------------------------------------------------------
	TabPlus_mod.mMousedownR = function(isOk) {
		function acction(event) {
			if (event.target.localName != 'tab' && event.button == 1) {
				document.getElementById('History:UndoCloseTab').doCommand();
			}
		}

		if (isOk) {
			gBrowser.mTabContainer.addEventListener('mousedown', acction, false);
		} else {
			gBrowser.mTabContainer.removeEventListener('mousedown', acction, false);
		}
	};
	TabPlus_mod.mMousedownP = function(isOk) {
		function acction(event) {
			if (event.target.localName == "tab" && event.button == 1 && !event.ctrlKey) {
				var subTab = event.originalTarget;
				while (subTab.localName != "tab") {
					subTab = subTab.parentNode;
				}
				if (subTab.pinned) {
					gBrowser.unpinTab(subTab);
				} else {
					gBrowser.pinTab(subTab);
				}
				event.stopPropagation();
				event.preventDefault();
			}
		}
		if (isOk) {
			gBrowser.mTabContainer.addEventListener('click', acction, true);
		} else {
			gBrowser.mTabContainer.removeEventListener('click', acction, true);
		}
	};
	TabPlus_mod.ldblclickR = function(isOk) {
		function acction(event) {
			if (event.target.localName == 'tab' && event.button == 0) {
				getBrowser().getBrowserForTab(event.target).reload();
			}
		}
		if (isOk) {
			gBrowser.mTabContainer.addEventListener('dblclick', acction, true);
		} else {
			gBrowser.mTabContainer.removeEventListener('dblclick', acction, true);
		}
	};
	TabPlus_mod.ldblclickRU = function(isOk) {
		function acction(event) {
			if (event.target.localName == 'tab' && event.button == 0) {
				if (event.target.hasAttribute("busy")) {
					document.getElementById('cmd_close').doCommand();
				} else {
					getBrowser().getBrowserForTab(event.target).reload();
				}
			}
		}
		if (isOk) {
			gBrowser.mTabContainer.addEventListener('dblclick', acction, false);
		} else {
			gBrowser.mTabContainer.removeEventListener('dblclick', acction, false);
		}
	};
	TabPlus_mod.nearTab = function(isOk) {
		try {
			if (!gBrowser) return;
		} catch (e) {
			return;
		}

		function tabOpenHandler(event) {
			var tab = event.target;
			gBrowser.moveTabTo(tab, gBrowser.mCurrentTab._tPos + 1);
		}
		if (isOk) {
			gBrowser.tabContainer.addEventListener("TabOpen", tabOpenHandler, false);
		} else {
			gBrowser.tabContainer.removeEventListener("TabOpen", tabOpenHandler, false);
		}
	};
	TabPlus_mod.cOLTab = function(isOk) {
		try {
			if (!gBrowser) return;
		} catch (e) {
			return;
		}

		function tabCloseHandler(event) {
			var tab = event.target;
			if (tab.linkedBrowser.contentDocument.URL == 'about:blank') return;
			if (tab._tPos <= gBrowser.mTabContainer.selectedIndex) {
				if (tab.previousSibling) {
					gBrowser.mTabContainer.selectedIndex--;
				}
			}
		}
		if (isOk) {
			gBrowser.tabContainer.addEventListener("TabClose", tabCloseHandler, false);
		} else {
			gBrowser.tabContainer.removeEventListener("TabClose", tabCloseHandler, false);
		}
	};
	TabPlus_mod.init();
	window.TabPlus_mod = TabPlus_mod;
})();
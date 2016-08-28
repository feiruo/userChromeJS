// ==UserScript==
// @name			BookmarkBtn
// @description		可移动书签菜单按钮
// @author			feiruo
// @compatibility	Firefox 16+
// @charset			UTF-8
// @include			chrome://browser/content/browser.xul
// @id				[56BB527D]
// @inspect			window.BookmarkBtn
// @startup			window.BookmarkBtn.init();
// @shutdown		window.BookmarkBtn.onDestroy();
// @reviewURL		http://bbs.kafan.cn/thread-1654067-1-1.html
// @homepageURL		https://github.com/feiruo/userchromejs/
// @downloadURL		https://github.com/feiruo/userChromeJS/blob/master/bookmarkBtn.uc.js
// @note			可移动书签菜单按钮。
// @version			0.3 	2016.08.24 16:00	随Firefox版本更新;
// @version			0.2 	2015.04.18 10:00	随Firefox版本更新;
// @version			0.1
// ==/UserScript==
location == "chrome://browser/content/browser.xul" && (function(CSS) {
	if (window.BookmarkBtn) {
		window.BookmarkBtn.onDestroy();
		delete window.BookmarkBtn;
	}
	window.BookmarkBtn = {
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBUlEQVQ4jZWRvWsTcRjHf4Mvi6JLJnELFlFwCAgiIghuHbKkmkJoNJ6WNE2aaE2isRDvLrnLy90luUvau0vCpSFtBu1gpehQDdXU6qSIgwhtUMkfkFm/LiIqd6F94DM8b5/heQgZEhdHXecujI6fHTZjGXa7/WAgxn6fitJfCXEd2LPATd32c0oDnNKA+2bk1p6WHQ7H/lCC60nVNqRqG6F73DYhZN+uBVepCJUq1iHpbUh6G2yxjis3wtdMh0dGzh++7PR4nZ7J3JgvtOYJ3N2JsQXk1RYEbQmCtoS82kKUkTDhj22P+YJrTs9k7pLT47Wdch0ibmomEmeLYAs1cLKBbKWJ/ELLlGylCU42wBZqiLNFjFPhEOl03h5Pl6qfMpVFZOebuyJTWURa0j92u91jhBBCOpubJ9mC9oVXDGTKjaHwigFW0j9vbG2d+OcW6+sbZ2hB7XGyAV4xh5MN0IK68+L1u9OmB01mSz5a1JAu1U2hRQ1Mrjxh+T5fMH6HFlSkijVTaEGFLxALWwqomcQ8I2pgJR2spIP5zZ9c1ECF75csBVOzyVeMqIEWVTzg5R9ZudrNKrU3CV7+SYsqGFGDfzb50lIQjDPf5ngFKUl9v/L0uRfAEQBHH68+u86ICx/mMgqmow97lgJFbzLLK08C/X7f9n9vMBjYlh+tTpf1ZvLv+i9I9HFlRbkAxwAAAABJRU5ErkJggg==",

		get version() {
			return Services.appinfo.version.split(".")[0];
		},

		init: function() {
			let Btn;
			if (this.version > 22)
				this.Australis();
			else
				this.Old();
		},

		onDestroy: function() {
			if ($('BookmarkBtn_Popup'))
				$("BookmarkBtn_Popup").parentNode.removeChild($("BookmarkBtn_Popup"));
			if ($('BookmarkBtn'))
				$("BookmarkBtn").parentNode.removeChild($("BookmarkBtn"));
		},

		Old: function(image) {
			let Btn = $C("toolbarbutton", {
				id: "BookmarkBtn",
				class: 'toolbarbutton-1 chromeclass-toolbar-additional',
				removable: "true",
				tooltiptext: "Bookmarks",
				context: "BookmarkBtn_Popup",
				onClick: "BookmarkBtn.openPop();",
				oncommand: "BookmarkBtn.openPop();",
				image: this.image
			});

			let menupopup = $C("menupopup", {
				id: "BookmarkBtn_Popup",
				//class: "cui-widget-panel cui-widget-panelview cui-widget-panelWithFooter PanelUI-subView",
				placespopup: "true",
				context: "placesContext",
				openInTabs: "children",
				oncommand: "BookmarksEventHandler.onCommand(event, this.parentNode._placesView);",
				onclick: "BookmarksEventHandler.onClick(event, this.parentNode._placesView);",
				onpopupshowing: "BookmarksMenuButton.onPopupShowing(event); if (!this.parentNode._placesView) new PlacesMenu(event, 'place:folder=BOOKMARKS_MENU')",
				tooltip: "bhTooltip",
				popupsinherittooltip: "true",
			});

			menupopup.appendChild($C("menuitem", {
				id: "BMB_viewBookmarksToolbar",
				placesanonid: "view-toolbar",
				toolbarId: "PersonalToolbar",
				type: "checkbox",
				oncommand: "onViewToolbarCommand(event)",
				label: $('BMB_viewBookmarksToolbar').label,
			}));

			menupopup.appendChild($C("menuseparator"));

			menupopup.appendChild($C("menuitem", {
				id: "BMB_bookmarksShowAll",
				key: "manBookmarkKb",
				oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');",
				label: $('BMB_bookmarksShowAll').label,
			}));

			menupopup.appendChild($C("menuseparator"));

			menupopup.appendChild($C("menuitem", {
				id: "BMB_bookmarkThisPage",
				class: "menuitem-iconic",
				key: "addBookmarkAsKb",
				onclick: "PlacesStarButton.onClick(event);",
				label: $('BMB_bookmarkThisPage').label,
			}));

			menupopup.appendChild($C("menuitem", {
				id: "BMB_subscribeToPageMenuitem",
				class: "menuitem-iconic",
				label: $('BMB_subscribeToPageMenuitem').label,
				oncommand: "return FeedHandler.subscribeToFeed(null, event);",
				onclick: "checkForMiddleClick(this, event);",
				observes: "singleFeedMenuitemState",
			}));

			menupopup.appendChild(this.AC($C("menu", {
				id: "BMB_subscribeToPageMenupopup",
				class: "menu-iconic",
				label: $('BMB_subscribeToPageMenupopup').label,
				observes: "multipleFeedsMenuState",
			}), $C("menupopup", {
				id: "BMB_subscribeToPageSubmenuMenupopup",
				onpopupshowing: "return FeedHandler.buildFeedList(event.target);",
				oncommand: "return FeedHandler.subscribeToFeed(null, event);",
				onclick: "checkForMiddleClick(this, event);",
			})));

			menupopup.appendChild($C("menuseparator"));

			menupopup.appendChild(this.AC($C("menu", {
				id: "BMB_bookmarksToolbar",
				placesanonid: "toolbar-autohide",
				class: "menu-iconic bookmark-item",
				label: $('BMB_bookmarksToolbar').label,
				container: "true",
			}), $C("menupopup", {
				id: "BMB_bookmarksToolbarPopup",
				onpopupshowing: "if (!this.parentNode._placesView) new PlacesMenu(event, 'place:folder=TOOLBAR');",
				placespopup: "true",
				context: "placesContext;",
			})));

			menupopup.appendChild($C("menuseparator", {
				builder: "end",
				class: "hide-if-empty-places-result",
			}));

			menupopup.appendChild($C("menuitem", {
				id: "BMB_unsortedBookmarks",
				class: "menuitem-iconic",
				label: $('BMB_unsortedBookmarks').label,
				oncommand: "PlacesCommandHook.showPlacesOrganizer('UnfiledBookmarks');",
			}));

			Btn.appendChild(menupopup);
			$("nav-bar").appendChild(Btn);
		},

		Australis: function(BookmarkingUI, image) {
			let Btn = $C("toolbarbutton", {
				id: "BookmarkBtn",
				class: 'toolbarbutton-1 chromeclass-toolbar-additional',
				removable: "true",
				tooltiptext: "Bookmarks",
				context: "BookmarkBtn_Popup",
				onClick: "BookmarkBtn.openPop();",
				oncommand: "BookmarkBtn.openPop();",
				image: this.image
			});

			let menupopup = $C("menupopup", {
				id: "BookmarkBtn_Popup",
				//class: "cui-widget-panel cui-widget-panelview cui-widget-panelWithFooter PanelUI-subView",
				placespopup: true,
				context: "placesContext",
				openInTabs: "children",
				oncommand: "BookmarksEventHandler.onCommand(event, this.parentNode._placesView);",
				onclick: "BookmarksEventHandler.onClick(event, this.parentNode._placesView);",
				onpopupshowing: "BookmarkingUI.onPopupShowing(event);BookmarkingUI.attachPlacesView(event, this);",
				tooltip: "bhTooltip",
				popupsinherittooltip: "true",
				flip: "both",
				side: "top",
				position: "bottomcenter topright",
				style: "",
				arrowposition: "after_end",
				disablepointereventsfortransition: "false",
			});

			menupopup.appendChild($C("menuitem", {
				id: "BMB_viewBookmarksSidebar",
				type: "checkbox",
				oncommand: "toggleSidebar('viewBookmarksSidebar');",
				label: $('BMB_viewBookmarksSidebar').label,
			}));

			menupopup.appendChild($C("menuitem", {
				id: "BMB_bookmarksShowAllTop",
				key: "manBookmarkKb",
				oncommand: "Browser:ShowAllBookmarks",
				label: $('BMB_bookmarksShowAllTop').label,
			}));

			menupopup.appendChild($C("menuseparator"));

			// menupopup.appendChild($C("menuitem", {
			// 	id: "BMB_subscribeToPageMenuitem",
			// 	class: "menuitem-iconic subviewbutton",
			// 	oncommand: "return FeedHandler.subscribeToFeed(null, event);",
			// 	onClick: "checkForMiddleClick(this, event);",
			// 	observes: "singleFeedMenuitemState",
			// 	label: $('BMB_subscribeToPageMenuitem').label,
			// }));

			// menupopup.appendChild($C("menu", {
			// 	id: "BMB_subscribeToPageMenupopup",
			// 	class: "menu-iconic subviewbutton",
			// 	observes: "multipleFeedsMenuState",
			// 	label: $('BMB_subscribeToPageMenupopup').label,
			// }));

			// menupopup.appendChild($C("menuseparator"));

			menupopup.appendChild(this.AC($C("menu", {
				id: "BMB_bookmarksToolbar",
				class: "menu-iconic bookmark-item subviewbutton",
				label: $('BMB_bookmarksToolbar').label,
				container: "true",
			}), this.AC($C("menupopup", {
				id: "BMB_bookmarksToolbarPopup",
				onpopupshowing: "if (!this.parentNode._placesView){new PlacesMenu(event, 'place:folder=TOOLBAR', PlacesUIUtils.getViewForNode(this.parentNode.parentNode).options);}",
				placespopup: "true",
				context: "placesContext;",
			}), $C("menuitem", {
				id: "BMB_viewBookmarksToolbar",
				placesanonid: "view-toolbar",
				toolbarId: "PersonalToolbar",
				type: "checkbox",
				class: "subviewbutton",
				oncommand: "onViewToolbarCommand(event)",
				label: $('BMB_viewBookmarksToolbar').label,
			}))));

			menupopup.appendChild(this.AC($C("menu", {
				id: "BMB_unsortedBookmarks",
				class: "menu-iconic bookmark-item subviewbutton",
				label: $('BMB_unsortedBookmarks').label,
				container: "true",
			}), $C("menupopup", {
				id: "BMB_unsortedBookmarksPopup",
				onpopupshowing: "if (!this.parentNode._placesView) {new PlacesMenu(event, 'place:folder=UNFILED_BOOKMARKS', PlacesUIUtils.getViewForNode(this.parentNode.parentNode).options);}",
				placespopup: "true",
				context: "placesContext;",
				emptyplacesresult: "true;",
			})));

			menupopup.appendChild($C("menuseparator"));

			// menupopup.appendChild(this.AC(
			// 	, this.AC($C("menupopup", {
			// 	id: "BMB_readingListPopup",
			// 	onpopupshowing: "ReadingListUI.onReadingListPopupShowing(this);",
			// 	placespopup: "true",
			// }), $C("menuitem", {
			// 	id: "BMB_viewReadingListSidebar",
			// 	//class: "subviewbutton panel-subview-footer",
			// 	oncommand: "SidebarUI.show('readingListSidebar');",
			// 	label: $('BMB_viewReadingListSidebar').label,
			// }))));

			// menupopup.appendChild($C("menuseparator"));

			/*===================================================*/
			menupopup.appendChild($C("menuseparator", {
				builder: "end",
				class: "hide-if-empty-places-result",
			}));

			/*===================================================*/
			menupopup.appendChild($C("menuitem", {
				id: "BMB_bookmarksShowAll",
				key: "manBookmarkKb",
				class: "subviewbutton panel-subview-footer",
				label: $('BMB_bookmarksShowAll').label,
				oncommand: "Browser:ShowAllBookmarks",
			}));
			/*===================================================*/
			Btn.appendChild(menupopup);
			ToolbarManager.addWidget(window, Btn, true);
			BookmarkBtn.style = addStyle(CSS);
		},

		AC: function(menu, itm) {
			menu.appendChild(itm);
			return menu;
		},

		openPop: function() {
			var popup = $("BookmarkBtn_Popup");
			if (typeof popup.openPopup != 'undefined') popup.openPopup($('BookmarkBtn'), "overlap", 0, 0, true, false);
			else popup.showPopup($('BookmarkBtn'), -1, -1, "popup", null, null);
		},
	};

	/*****************************************************************************************/
	// 来自 User Agent Overrider 扩展
	const ToolbarManager = (function() {

		/**
		 * Remember the button position.
		 * This function Modity from addon-sdk file lib/sdk/widget.js, and
		 * function BrowserWindow.prototype._insertNodeInToolbar
		 */
		let layoutWidget = function(document, button, isFirstRun) {

			// Add to the customization palette
			let toolbox = document.getElementById('navigator-toolbox');
			toolbox.palette.appendChild(button);

			// Search for widget toolbar by reading toolbar's currentset attribute
			let container = null;
			let toolbars = document.getElementsByTagName('toolbar');
			let id = button.getAttribute('id');
			for (let i = 0; i < toolbars.length; i += 1) {
				let toolbar = toolbars[i];
				if (toolbar.getAttribute('currentset').indexOf(id) !== -1) {
					container = toolbar;
				}
			}

			// if widget isn't in any toolbar, default add it next to searchbar
			if (!container) {
				if (isFirstRun) {
					container = document.getElementById('nav-bar');
				} else {
					return;
				}
			}

			// Now retrieve a reference to the next toolbar item
			// by reading currentset attribute on the toolbar
			let nextNode = null;
			let currentSet = container.getAttribute('currentset');
			let ids = (currentSet === '__empty') ? [] : currentSet.split(',');
			let idx = ids.indexOf(id);
			if (idx !== -1) {
				for (let i = idx; i < ids.length; i += 1) {
					nextNode = document.getElementById(ids[i]);
					if (nextNode) {
						break;
					}
				}
			}

			// Finally insert our widget in the right toolbar and in the right position
			container.insertItem(id, nextNode, null, false);

			// Update DOM in order to save position
			// in this toolbar. But only do this the first time we add it to the toolbar
			if (ids.indexOf(id) === -1) {
				container.setAttribute('currentset', container.currentSet);
				document.persist(container.id, 'currentset');
			}
		};

		let addWidget = function(window, widget, isFirstRun) {
			try {
				layoutWidget(window.document, widget, isFirstRun);
			} catch (error) {
				console.log(error);
			}
		};

		let removeWidget = function(window, widgetId) {
			try {
				let widget = window.document.getElementById(widgetId);
				widget.parentNode.removeChild(widget);
			} catch (error) {
				console.log(error);
			}
		};

		let exports = {
			addWidget: addWidget,
			removeWidget: removeWidget,
		};
		return exports;
	})();

	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}

	function log() {
		Application.console.log('[BookmarkBtn] ' + Array.slice(arguments));
	}

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	BookmarkBtn.init();
	window.BookmarkBtn = BookmarkBtn;
})('\
#bookmarkBtn {\
    -moz-appearance: none;\
    border-style: none;\
    border-radius: 0;\
    padding: 0 0;\
    margin: 0 3px;\
    background: transparent;\
    box-shadow: none;\
    -moz-box-align: center;\
    -moz-box-pack: center;\
    min-width: 18px;\
    min-height: 18px;\
    width: 24px;\
}\
#bookmarkBtn > .toolbarbutton-icon {\
    padding: 0;\
    margin: 0;\
    border: 0;\
    background-image: none;\
    background-color: transparent;\
    box-shadow: none;\
    -moz-transition: none;\
}\
#BookmarkBtn_Popup {\
    max-width: 20em !important;\
}\
#bookmarkBtn dropmarker {\
    display: none;\
}\
'.replace(/\n|\t/g, ''));
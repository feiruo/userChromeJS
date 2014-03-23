// ==UserScript==
// @name         bookmarkBtn.uc.js
// @description  可移动书签菜单按钮
// @namespace    https://github.com/feiruo/userchromejs/
// @author       feiruo
// @include      main
// @charset      utf-8
// @version      0.2
// @note         可移动书签菜单按钮。
// ==/UserScript==
(function() {
	window.bookmarkBtn = {
		init: function() {
			var version = Services.appinfo.version.split(".")[0];

			var ins = false;
			var Australis = false;
			var BookmarkingUI = "BookmarksMenuButton";

			if (version > 22)
				BookmarkingUI = "BookmarkingUI";

			try {
				var ins = Australis = $('nav-bar-customization-target');
			} catch (e) {}
			if (!ins)
				ins = $('nav-bar');

			var bookmarkBtn = ins.appendChild($C("toolbarbutton", {
				id: "bookmarkBtn",
				type: "menu",
				class: "toolbarbutton-1 chromeclass-toolbar-additional",
				persist: "class",
				removable: "true",
				label: $('bookmarks-menu-button').label,
				tooltiptext: $('bookmarks-menu-button').tooltip,
				ondragenter: "PlacesMenuDNDHandler.onDragEnter(event);",
				ondragover: "PlacesMenuDNDHandler.onDragOver(event);",
				ondragleave: "PlacesMenuDNDHandler.onDragLeave(event);",
				ondrop: "PlacesMenuDNDHandler.onDrop(event);",
				oncommand: "BookmarksMenuButton.onCommand(event);",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACBUlEQVQ4jZWRvWsTcRjHf4Mvi6JLJnELFlFwCAgiIghuHbKkmkJoNJ6WNE2aaE2isRDvLrnLy90luUvau0vCpSFtBu1gpehQDdXU6qSIgwhtUMkfkFm/LiIqd6F94DM8b5/heQgZEhdHXecujI6fHTZjGXa7/WAgxn6fitJfCXEd2LPATd32c0oDnNKA+2bk1p6WHQ7H/lCC60nVNqRqG6F73DYhZN+uBVepCJUq1iHpbUh6G2yxjis3wtdMh0dGzh++7PR4nZ7J3JgvtOYJ3N2JsQXk1RYEbQmCtoS82kKUkTDhj22P+YJrTs9k7pLT47Wdch0ibmomEmeLYAs1cLKBbKWJ/ELLlGylCU42wBZqiLNFjFPhEOl03h5Pl6qfMpVFZOebuyJTWURa0j92u91jhBBCOpubJ9mC9oVXDGTKjaHwigFW0j9vbG2d+OcW6+sbZ2hB7XGyAV4xh5MN0IK68+L1u9OmB01mSz5a1JAu1U2hRQ1Mrjxh+T5fMH6HFlSkijVTaEGFLxALWwqomcQ8I2pgJR2spIP5zZ9c1ECF75csBVOzyVeMqIEWVTzg5R9ZudrNKrU3CV7+SYsqGFGDfzb50lIQjDPf5ngFKUl9v/L0uRfAEQBHH68+u86ICx/mMgqmow97lgJFbzLLK08C/X7f9n9vMBjYlh+tTpf1ZvLv+i9I9HFlRbkAxwAAAABJRU5ErkJggg==",
			}));

			var menupopup = $C("menupopup", {
				id: "BMB_bookmarksPopup",
				placespopup: "true",
				context: "placesContext",
				openInTabs: "children",
				oncommand: "BookmarksEventHandler.onCommand(event, this.parentNode._placesView);",
				onclick: "BookmarksEventHandler.onClick(event, this.parentNode._placesView);",
				onpopupshowing: BookmarkingUI + ".onPopupShowing(event);if (!this.parentNode._placesView) new PlacesMenu(event, 'place:folder=BOOKMARKS_MENU');",
				tooltip: "bhTooltip",
				popupsinherittooltip: "true",
			});

			var cssStr = ('\
				#bookmarkBtn > .toolbarbutton-icon {\
				max-width: 18px !important;\
    			padding: 0 !important;\
    			margin: 0 !important;\
    			}\
    			#bookmarkBtn dropmarker{display: none !important;}\
			');
			var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
			document.insertBefore(style, document.documentElement);

			if (Australis) {
				var menuitem = $C("menuitem", {
					id: "BMB_bookmarksShowAll",
					oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');",
					label: $('BMB_bookmarksShowAll').label,
				});
				menupopup.appendChild(menuitem);
				var menuitem = $C("menuitem", {
					id: "BMB_viewBookmarksSidebar",
					type: "checkbox",
					oncommand: "toggleSidebar('viewBookmarksSidebar');",
					label: $('BMB_viewBookmarksSidebar').label,
				});
				menupopup.appendChild(menuitem);
				var menuitem = $C("menuitem", {
					id: "BMB_subscribeToPageMenuitem",
					class: "menuitem-iconic subviewbutton",
					oncommand: "return FeedHandler.subscribeToFeed(null, event);",
					onclick: "checkForMiddleClick(this, event);",
					observes: "singleFeedMenuitemState",
					label: $('BMB_subscribeToPageMenuitem').label,
				});
				menupopup.appendChild(menuitem);
			} else {
				var menuitem = $C("menuitem", {
					id: "BMB_viewBookmarksToolbar",
					placesanonid: "view-toolbar",
					toolbarId: "PersonalToolbar",
					type: "checkbox",
					oncommand: "onViewToolbarCommand(event)",
					label: $('BMB_viewBookmarksToolbar').label,
				});
				menupopup.appendChild(menuitem);
				var menuitem = $C("menuseparator");
				menupopup.appendChild(menuitem);

				var menuitem = $C("menuitem", {
					id: "BMB_bookmarksShowAll",
					key: "manBookmarkKb",
					oncommand: "PlacesCommandHook.showPlacesOrganizer('AllBookmarks');",
					label: $('BMB_bookmarksShowAll').label,
				});
				menupopup.appendChild(menuitem);
				var menuitem = $C("menuseparator");
				menupopup.appendChild(menuitem);

				var menuitem = $C("menuitem", {
					id: "BMB_bookmarkThisPage",
					class: "menuitem-iconic",
					key: "addBookmarkAsKb",
					onclick: "PlacesStarButton.onClick(event);",
					label: $('BMB_bookmarkThisPage').label,
				});
				menupopup.appendChild(menuitem);

				var menuitem = $C("menuitem", {
					id: "BMB_subscribeToPageMenuitem",
					class: "menuitem-iconic",
					label: $('BMB_subscribeToPageMenuitem').label,
					oncommand: "return FeedHandler.subscribeToFeed(null, event);",
					onclick: "checkForMiddleClick(this, event);",
					observes: "singleFeedMenuitemState",
				});
				menupopup.appendChild(menuitem);

				var menu = $C("menu", {
					id: "BMB_subscribeToPageMenupopup",
					class: "menu-iconic",
					label: $('BMB_subscribeToPageMenupopup').label,
					observes: "multipleFeedsMenuState",
				});

				var popu = $C("menupopup", {
					id: "BMB_subscribeToPageSubmenuMenupopup",
					onpopupshowing: "return FeedHandler.buildFeedList(event.target);",
					oncommand: "return FeedHandler.subscribeToFeed(null, event);",
					onclick: "checkForMiddleClick(this, event);",
				});

				menu.appendChild(popu);
				menupopup.appendChild(menu);
				var menuitem = $C("menuseparator");
				menupopup.appendChild(menuitem);
			}
			var menu = $C("menu", {
				id: "BMB_bookmarksToolbar",
				placesanonid: "toolbar-autohide",
				class: "menu-iconic bookmark-item",
				label: $('BMB_bookmarksToolbar').label,
				container: "true",
			});

			var popu = $C("menupopup", {
				id: "BMB_bookmarksToolbarPopup",
				onpopupshowing: "if (!this.parentNode._placesView) new PlacesMenu(event, 'place:folder=TOOLBAR');",
				placespopup: "true",
				context: "placesContext;",
			});
			menu.appendChild(popu);
			menupopup.appendChild(menu);
			var menuitem = $C("menuseparator");
			menupopup.appendChild(menuitem);


			var menuitem = $C("menuseparator", {
				builder: "end",
				class: "hide-if-empty-places-result",
			});
			menupopup.appendChild(menuitem);

			var menuitem = $C("menuitem", {
				id: "BMB_unsortedBookmarks",
				class: "menuitem-iconic",
				label: $('BMB_unsortedBookmarks').label,
				oncommand: "PlacesCommandHook.showPlacesOrganizer('UnfiledBookmarks');",
			});
			menupopup.appendChild(menuitem);

			bookmarkBtn.appendChild(menupopup);

		},
	}
	window.bookmarkBtn.init()

	function $(id) {
		return document.getElementById(id);
	}

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
})();
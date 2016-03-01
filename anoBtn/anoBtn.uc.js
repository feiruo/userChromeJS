// ==UserScript==
// @name			AnotherButton
// @description		可移动的按钮菜单
// @author	        feiruo
// @charset       	UTF-8
// @include			main
// @id              [A26C02CA]
// @inspect         window.anoBtn
// @startup         window.anoBtn.init();
// @shutdown        window.anoBtn.onDestroy();
// @config 			window.anoBtn.EditFile(anoBtn.file);
// @reviewURL		http://bbs.kafan.cn/thread-1657589-1-1.html
// @homepageURL		https://github.com/feiruo/userChromeJS/tree/master/anoBtn
// @downloadURL		https://github.com/feiruo/userChromeJS/raw/master/anoBtn/anoBtn.uc.js
// @note			支持菜单和脚本设置重载
// @note			需要 _anoBtn.js 配置文件
// @version			1.3.7 	2015.11.05 	12:00	修复枚举目录不存在导致的错误，修正原菜单移动方式,修正编辑。
// @version			1.3.6 	2015.11.05 	12:00	增加目录枚举，菜单参数与自由性与addmenu一样，仅限制位置于本菜单。
// @version			1.3.5 	2015.04.25 	10:00	为可移动菜单。
// @version			1.3.4 	2015.03.27 	09:00	调整代码。
// @version			1.3.3 	2015.02.18 	22:00	调整代码。
// @version			1.3.2 	2015.02.13 	23:00	Fix exec。
// @version			1.3.1 	2014.09.18 	19:00	Fix Path indexof '\\' or '//'。
// @version			1.3.0 	2014.08.12 	19:00	支持多级菜单，不限制菜单级数。
// @version			1.2.1
// @version			1.2 	修复按钮移动之后重载残留问题，增加菜单弹出位置选择。
// @version			1.1 	解决编辑器中文路径问题，修改菜单，提示等文字。
// @version			1.0
// ==/UserScript==
(function(CSS) {
	let {
		classes: Cc,
		interfaces: Ci,
		utils: Cu,
		results: Cr
	} = Components;
	if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");

	if (window.anoBtn) {
		window.anoBtn.onDestroy();
		delete window.anoBtn;
	}

	var anoBtn = {
		get File() {
			let aFile;
			aFile = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
			aFile.appendRelativePath("lib");
			aFile.appendRelativePath("_anoBtn.js");
			delete this.File;
			return this.File = aFile;
		},
		get FocusedWindow() {
			return gContextMenu && gContextMenu.target ? gContextMenu.target.ownerDocument.defaultView : (content ? content : gBrowser.selectedBrowser.contentWindowAsCPOW);
		},

		init: function() {
			var ins = $("menu_ToolsPopup").firstChild;
			ins.parentNode.insertBefore($C("menuitem", {
				id: "anoBtn_set",
				label: "AnotherButton",
				tooltiptext: "左键：重载配置\n右键：编辑配置",
				class: "menuitem-iconic",
				onclick: "anoBtn.BtnClick(event);",
			}), ins);

			let he = "(?:_HTML(?:IFIED)?|_ENCODE)?";
			let rTITLE = "%TITLE" + he + "%|%t\\b";
			let rTITLES = "%TITLES" + he + "%|%t\\b";
			let rURL = "%(?:R?LINK_OR_)?URL" + he + "%|%u\\b";
			let rHOST = "%HOST" + he + "%|%h\\b";
			let rIP = "%IP" + he + "%|%h\\b";
			let rBASEDOMAIN = "%BASEDOMAIN" + he + "%|%h\\b";
			let rSEL = "%SEL" + he + "%|%s\\b";
			let rLINK = "%R?LINK(?:_TEXT|_HOST)?" + he + "%|%l\\b";
			let rIMAGE = "%IMAGE(?:_URL|_ALT|_TITLE)" + he + "%|%i\\b";
			let rIMAGE_BASE64 = "%IMAGE_BASE64" + he + "%|%i\\b";
			let rMEDIA = "%MEDIA_URL" + he + "%|%m\\b";
			let rCLIPBOARD = "%CLIPBOARD" + he + "%|%p\\b";
			let rFAVICON = "%FAVICON" + he + "%";
			let rEMAIL = "%EMAIL" + he + "%";
			let rExt = "%EOL" + he + "%";

			let rFAVICON_BASE64 = "%FAVICON_BASE64" + he + "%";
			let rRLT_OR_UT = "%RLT_OR_UT" + he + "%"; // 链接文本或网页标题

			this.rTITLE = new RegExp(rTITLE, "i");
			this.rTITLES = new RegExp(rTITLES, "i");
			this.rURL = new RegExp(rURL, "i");
			this.rIP = new RegExp(rIP, "i");
			this.rHOST = new RegExp(rHOST, "i");
			this.rBASEDOMAIN = new RegExp(rBASEDOMAIN, "i");
			this.rSEL = new RegExp(rSEL, "i");
			this.rLINK = new RegExp(rLINK, "i");
			this.rIMAGE = new RegExp(rIMAGE, "i");
			this.rMEDIA = new RegExp(rMEDIA, "i");
			this.rCLIPBOARD = new RegExp(rCLIPBOARD, "i");
			this.rFAVICON = new RegExp(rFAVICON, "i");
			this.rEMAIL = new RegExp(rEMAIL, "i");
			this.rExt = new RegExp(rExt, "i");
			this.rFAVICON_BASE64 = new RegExp(rFAVICON_BASE64, "i");
			this.rIMAGE_BASE64 = new RegExp(rIMAGE_BASE64, "i");
			this.rRLT_OR_UT = new RegExp(rRLT_OR_UT, "i");

			this.regexp = new RegExp([rTITLE, rTITLES, rURL, rHOST, rBASEDOMAIN, rIP, rSEL, rLINK, rIMAGE, rIMAGE_BASE64, rMEDIA, rCLIPBOARD, rFAVICON, rFAVICON_BASE64, rEMAIL, rExt, rRLT_OR_UT].join("|"), "ig");

			this.Rebuild();
			setTimeout(function() {
				anoBtn.Rebuild();
			}, 1000); //again for webDeveloperMenu
			this.style = addStyle(CSS);
			window.addEventListener("unload", function() {
				anoBtn.onDestroy();
			}, false);
		},

		onDestroy: function() {
			this.RemoveByID();
			this.RebuildBtn();
			this.RebuildPopup();
			if ($("anoBtn_set"))
				$("anoBtn_set").parentNode.removeChild($("anoBtn_set"));
			Services.obs.notifyObservers(null, "startupcache-invalidate", "");
		},

		RemoveByID: function() {
			if (this.anomenu) {
				for (var i = 0; i < this.anomenu.length; i++) {
					var obj = this.anomenu[i];
					if (obj.id && !obj.clone)
						$("main-menubar").insertBefore($(obj.id), $("main-menubar").childNodes[7]);
				}
			}
		},

		BtnClick: function(event) {
			if (event.target != event.currentTarget) return;
			event.stopPropagation();
			event.preventDefault();
			if (event.target.id == 'anoBtn_set') {
				if (event.button == 0)
					return this.Rebuild(true);
				else if (event.button == 2)
					return this.EditFile();
			} else if (event.target.id == 'anoBtn_Icon')
				return $("anoBtn_Popup").showPopup();
			return;
		},

		Rebuild: function(isAlert) {
			var MenuDate = this.LoadFile(this.File);
			//this.RemoveByID();
			if (!MenuDate) return;
			this.anomenu = MenuDate.anomenu;
			this.anobtnset = MenuDate.anobtnset;
			this.RebuildBtn(true);
			this.RebuildPopup(true);
			if (isAlert) alert('配置已经重新载入');
		},

		/*****************************************************************************************/
		RebuildBtn: function(isAlert) {
			var icon = $("anoBtn_Icon");
			if (icon) icon.parentNode.removeChild(icon);
			delete icon;
			if (!isAlert) return;
			var iconInTag = this.anobtnset.intags ? this.anobtnset.intags : "tabbrowser-tabs";
			var iconImage = this.anobtnset.image ? this.anobtnset.image : "chrome://branding/content/icon16.png";
			var intags = $(iconInTag);
			var orientation = this.anobtnset.orientation ? this.anobtnset.orientation : 'before';

			if ($('anoBtn_set')) $('anoBtn_set').setAttribute('image', iconImage);

			var IconType = this.IconSstatusBarPanel ? 'statusbarpanel' : 'image';

			if (this.anobtnset.Icon_Pos === 0) {
				this.icon = $C('toolbarbutton', {
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					type: 'menu',
					removable: true,
					image: iconImage,
					id: "FeiRuoNet_icon",
				});
				ToolbarManager.addWidget(window, this.icon, true);
			} else if (this.anobtnset.Icon_Pos === 1) {
				this.icon = $C(IconType, {
					src: iconImage,
				});
				$('urlbar-icons').appendChild(this.icon);
			} else if (this.anobtnset.Icon_Pos === 2) {
				this.icon = $C('toolbarbutton', {
					class: 'toolbarbutton-1 chromeclass-toolbar-additional',
					type: 'menu',
					removable: true,
					image: iconImage,
					id: "FeiRuoNet_icon",
				});
				if (orientation == 'before')
					intags.parentNode.insertBefore(this.icon, intags);
				else if (orientation == 'after') {
					var parentEl = intags.parentNode;
					if (parentEl.lastChild == intags) {
						parentEl.appendChild(this.icon);
					} else {
						parentEl.insertBefore(this.icon, intags.nextSibling);
					}
				}
			}

			this.icon.setAttribute('id', 'anoBtn_Icon');
			this.icon.setAttribute('context', 'anoBtn_Popup');
			this.icon.setAttribute('onclick', 'if (event.button != 2) anoBtn.BtnClick(event);');

			if (this.anobtnset.IconSstatusBarPanel)
				this.icon.setAttribute('class', 'statusbarpanel-iconic');

			return true;
		},

		RebuildPopup: function(isAlert) {
			if (!this.anomenu) return;
			this.CustomShowings = [];
			try {
				for (i in this.anomenu) {
					$("main-menubar").insertBefore($(this.anomenu[i].id), $("main-menubar").childNodes[7]);
				}
			} catch (e) {};
			var Popup = $("anoBtn_Popup");
			if (Popup) Popup.parentNode.removeChild(Popup);
			delete Popup;
			if (!isAlert) return;
			var menu = this.anomenu;
			var Popup = $C("menupopup", {
				id: "anoBtn_Popup",
				position: this.anobtnset.position,
			});

			for (let [, obj] in Iterator(menu)) {
				if (!obj) continue;
				Popup.appendChild(this.BuildMenuitem(obj, {
					isTopMenuitem: true
				}));
			}
			this.icon.appendChild(Popup);
		},

		BuildMenu: function(menuObj, i) {
			var menu = document.createElement("menu");
			var Popup = menu.appendChild(document.createElement("menupopup"));
			if (menuObj.MapFolder)
				menuObj = this.EnumerateFolder(menuObj);

			for (let [key, val] in Iterator(menuObj)) {
				if (key === "child" || key === "MapFolder" || key === "Sort" || key === "Filter" || key === "Exclude" || key === "Directories" || key === "FilterDirs" || key === "ExcludeDirs") continue;
				if (key === 'onshowing') {
					this.customShowings.push({
						item: menu,
						fnSource: menuObj.onshowing.toSource()
					});
					delete menuObj.onshowing;
					continue;
				}
				if (typeof val == "function")
					menuObj[key] = val = "(" + val.toSource() + ").call(this, event);"
				menu.setAttribute(key, val);
			}

			let cls = menu.classList;
			cls.add("anoBtn_CustomMenu");
			cls.add("menu-iconic");
			if (menuObj.condition)
				this.SetCondition(menu, menuObj.condition);

			menuObj.child.forEach(function(obj) {
				Popup.appendChild(this.BuildMenuitem(obj));
			}, this);

			if (!menu.hasAttribute('label')) {
				let firstItem = menu.querySelector('menuitem');
				if (firstItem) {
					let command = firstItem.getAttribute('command');
					if (command)
						firstItem = document.getElementById(command) || firstItem;
					['label', 'accesskey', 'image', 'icon'].forEach(function(n) {
						if (!menu.hasAttribute(n) && firstItem.hasAttribute(n))
							menu.setAttribute(n, firstItem.getAttribute(n));
					}, this);
					menu.setAttribute('onclick', "\
                    if (event.target != event.currentTarget) return;\
                    var firstItem = event.currentTarget.querySelector('menuitem');\
                    if (!firstItem) return;\
                    if (event.button === 1) {\
                        checkForMiddleClick(firstItem, event);\
                    } else {\
                        firstItem.doCommand();\
                        closeMenus(event.currentTarget);\
                    }\
                ");
				}
			}
			return menu;
		},

		BuildMenuitem: function(obj, opt) {
			opt || (opt = {});
			if (obj.MapFolder)
				return this.BuildMenu(this.EnumerateFolder(obj));

			let menuitem;
			if (obj.id && (menuitem = $(obj.id))) {
				let dupMenuitem;
				// let isDupMenu = (obj.clone != false);
				let isDupMenu = true;
				if (isDupMenu)
					dupMenuitem = menuitem.cloneNode(true);
				else
					dupMenuitem = menuitem;

				for (let [key, val] in Iterator(obj)) {
					if (typeof val == "function")
						obj[key] = val = "(" + val.toSource() + ").call(this, event);";
					dupMenuitem.setAttribute(key, val);
				}

				let type = dupMenuitem.nodeName,
					cls = dupMenuitem.classList;
				if (type == 'menuitem' || type == 'menu')
					if (!cls.contains(type + '-iconic'))
						cls.add(type + '-iconic');

				if (!cls.contains('anoBtn_CustomMenu'))
					cls.add('anoBtn_CustomMenu');
				if (!isDupMenu && !cls.contains('anoBtn_MenuNot'))
					cls.add('anoBtn_MenuNot');

				let noMove = !isDupMenu;
				return dupMenuitem;
			}

			if (obj.child)
				return this.BuildMenu(obj);

			if (obj.label === "separator" || (!obj.label && !obj.image && !obj.text && !obj.keyword && !obj.url && !obj.oncommand && !obj.command))
				menuitem = document.createElement("menuseparator");
			else if (obj.oncommand || obj.command) {
				let org = obj.command ? document.getElementById(obj.command) : null;
				if (org && org.localName === "menuseparator") {
					menuitem = document.createElement("menuseparator");
				} else {
					menuitem = document.createElement("menuitem");
					if (obj.command)
						menuitem.setAttribute("command", obj.command);
					if (!obj.label)
						obj.label = obj.command || obj.oncommand;
				}
			} else {
				menuitem = document.createElement("menuitem");

				if (!obj.label)
					obj.label = obj.exec || obj.keyword || obj.url || obj.text || "NoName" + i;

				if (obj.keyword && !obj.text) {
					let index = obj.keyword.search(/\s+/);
					if (index > 0) {
						obj.text = obj.keyword.substr(index).trim();
						obj.keyword = obj.keyword.substr(0, index);
					}
				}

				if (obj.where && /\b(tab|tabshifted|window|current)\b/i.test(obj.where))
					obj.where = RegExp.$1.toLowerCase();

				if (obj.where && !("acceltext" in obj))
					obj.acceltext = obj.where;

				if (!obj.condition && (obj.url || obj.text)) {
					let condition = "";
					if (this.rSEL.test(obj.url || obj.text)) condition += " select";
					if (this.rLINK.test(obj.url || obj.text)) condition += " link";
					if (this.rEMAIL.test(obj.url || obj.text)) condition += " mailto";
					if (this.rIMAGE.test(obj.url || obj.text)) condition += " image";
					if (this.rMEDIA.test(obj.url || obj.text)) condition += " media";
					if (condition)
						obj.condition = condition;
				}

				if (obj.exec)
					obj.exec = this.handleRelativePath(obj.exec);
			}

			// if (opt.isTopMenuitem && obj.onshowing) {
			// 	this.CustomShowings.push({
			// 		item: menuitem,
			// 		fnSource: obj.onshowing.toSource()
			// 	});
			// 	delete obj.onshowing;
			// }

			for (let [key, val] in Iterator(obj)) {
				if (key === "command" || key === "MapFolder" || key === "Filter" || key === "Sort" || key === "ExcludeDir") continue;
				if (typeof val == "function")
					obj[key] = val = "(" + val.toSource() + ").call(this, event);";
				menuitem.setAttribute(key, val);
			}
			var cls = menuitem.classList;
			cls.add("anoBtn_CustomMenu");
			let type = menuitem.nodeName;
			if (type == 'menuitem' || type == 'menu' && (!cls.contains(type + '-iconic')))
				cls.add(type + '-iconic');

			if (obj.condition)
				this.SetCondition(menuitem, obj.condition);

			if (menuitem.localName == "menuseparator")
				return menuitem;

			if (!obj.onclick)
				menuitem.setAttribute("onclick", "checkForMiddleClick(this, event)");

			if (obj.oncommand || obj.command)
				return menuitem;

			menuitem.setAttribute("oncommand", "anoBtn.onCommand(event);");
			this.SetMenusIcon(menuitem, obj);
			return menuitem;
		},

		EnumerateFolder: function(obj) {
			obj || (obj = {});
			var path = this.handleRelativePath(obj.MapFolder);
			var dir = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
			dir.initWithPath(path);
			if (!dir.exists() || !dir.isDirectory())
				return obj;
			var Entries = dir.directoryEntries;
			var Exclude = obj.Exclude ? ((typeof obj.Exclude == "string") ? (new RegExp(obj.Exclude)) : obj.Exclude) : null;
			var Filter = obj.Filter ? ((typeof obj.Filter == "string") ? (new RegExp(obj.Filter)) : obj.Filter) : null;
			var ExcludeDirs = obj.ExcludeDirs ? ((typeof obj.ExcludeDirs == "string") ? (new RegExp(obj.ExcludeDirs)) : obj.ExcludeDirs) : null;
			var FilterDirs = obj.FilterDirs ? ((typeof obj.FilterDirs == "string") ? (new RegExp(obj.FilterDirs)) : obj.FilterDirs) : null;
			obj.child || (obj.child = []);
			if (obj.child.length > 0 && obj.child[obj.child.length - 1].label != "separator") {
				obj.child.push({
					label: 'separator',
				});
			}
			while (Entries.hasMoreElements()) {
				var Entry = Entries.getNext();
				Entry.QueryInterface(Components.interfaces.nsIFile);
				if (Entry.isDirectory() && (typeof obj.Directories === 'number') && (obj.Directories > 0)) {
					if (ExcludeDirs && ExcludeDirs.test(Entry.leafName)) continue;
					if (FilterDirs && !FilterDirs.test(Entry.leafName)) continue;
					obj.child.push(anoBtn.EnumerateFolder({
						label: Entry.leafName,
						MapFolder: Entry.path,
						exec: Entry.path,
						Directories: obj.Directories - 1,
						Filter: obj.Filter,
						Exclude: obj.Exclude,
						FilterDirs: obj.FilterDirs,
						ExcludeDirs: obj.ExcludeDirs,
						onclick: "anoBtn.onCommand(event);",
						Sort: 0,
						image: "moz-icon://" + Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler).getURLSpecFromFile(Entry) + "?size=16",
					}))
					continue;
				}
				if (!Entry.isFile()) continue;
				if (Exclude && Exclude.test(Entry.leafName)) continue;
				if (Filter && !Filter.test(Entry.leafName)) continue;
				obj.child.push({
					label: Entry.leafName.substr(0, Entry.leafName.lastIndexOf(".")),
					exec: Entry.path,
					Sort: 1,
					tooltiptext: Entry.path,
				});
			}
			obj.MapFolder = false;
			obj.child.sort(function(a, b) {
				return a.Sort - b.Sort;
			});
			return obj;
		},

		SetCondition: function(menu, condition) {
			if (/\bnormal\b/i.test(condition)) {
				menu.setAttribute("condition", "normal");
			} else {
				let match = condition.toLowerCase().match(/\b(?:no)?(?:select|link|mailto|image|canvas|media|input)\b/ig);
				if (!match || !match[0])
					return;
				match = match.filter(function(c, i, a) a.indexOf(c) === i);
				menu.setAttribute("condition", match.join(" "));
			}
		},

		SetMenusIcon: function(menu, obj) {
			if (menu.hasAttribute("src") || menu.hasAttribute("image") || menu.hasAttribute("icon"))
				return;

			if (obj.exec) {
				var aFile = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
				try {
					aFile.initWithPath(obj.exec);
				} catch (e) {
					return;
				}
				if (!aFile.exists()) {
					menu.setAttribute("disabled", "true");
				} else {
					let fileURL = Services.io.getProtocolHandler("file").QueryInterface(Ci.nsIFileProtocolHandler).getURLSpecFromFile(aFile);
					menu.setAttribute("image", "moz-icon://" + fileURL + "?size=16");
				}
				return;
			}

			if (obj.keyword) {
				let engine = Services.search.getEngineByAlias(obj.keyword);
				if (engine && engine.iconURI) {
					menu.setAttribute("image", engine.iconURI.spec);
					return;
				}
			}
			var setIconCallback = function(url) {
				let uri, iconURI;
				try {
					uri = Services.io.newURI(url, null, null);
				} catch (e) {}
				if (!uri) return;

				menu.setAttribute("scheme", uri.scheme);
				PlacesUtils.favicons.getFaviconDataForPage(uri, {
					onComplete: function(aURI, aDataLen, aData, aMimeType) {
						try {
							// javascript: URI の host にアクセスするとエラー
							menu.setAttribute("image", aURI && aURI.spec ?
								"moz-anno:favicon:" + aURI.spec :
								"moz-anno:favicon:" + uri.scheme + "://" + uri.host + "/favicon.ico");
						} catch (e) {}
					}
				});
			}
			PlacesUtils.keywords.fetch(obj.keyword || '').then(entry => {
				let url;
				if (entry) {
					url = entry.url.href;
				} else {
					url = (obj.url + '').replace(this.regexp, "");
				}
				setIconCallback(url);
			}, e => {
				console.log(e)
			}).catch(e => {});
		},

		onCommand: function(event) {
			if (event.target != event.currentTarget) return;
			var menuitem = event.target;
			var text = menuitem.getAttribute("text") || "";
			var keyword = menuitem.getAttribute("keyword") || "";
			var url = menuitem.getAttribute("url") || "";
			var where = menuitem.getAttribute("where") || "";
			var exec = menuitem.getAttribute("exec") || "";

			if (keyword) {
				let param = (text ? (text = this.ConvertText(text)) : "");
				let engine = Services.search.getEngineByAlias(keyword);
				if (engine) {
					let submission = engine.getSubmission(param);
					this.OpenCommand(event, submission.uri.spec, where);
				} else {
					PlacesUtils.keywords.fetch(keyword || '').then(entry => {
						if (!entry) return;
						let newurl = entry.url.href.replace('%s', encodeURIComponent(param));
						this.OpenCommand(event, newurl, where);
					});
				}
			} else if (url)
				this.OpenCommand(event, this.ConvertText(url), where || "tab");
			else if (exec)
				this.Exec(exec, this.ConvertText(text));
			else if (text)
				this.Copy(this.ConvertText(text));
		},

		OpenCommand: function(event, url, where, postData) {
			var uri;
			try {
				uri = Services.io.newURI(url, null, null);
			} catch (e) {
				return console.log("URL 不正确: " + url);
			}
			if (uri.scheme === "javascript")
				loadURI(url);
			else if (where)
				openUILinkIn(uri.spec, where, false, postData || null);
			else if (event.button == 1)
				openNewTabWith(uri.spec);
			else
				openUILink(uri.spec, event);
		},

		Exec: function(path, arg) {
			var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
			var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
			try {
				var a;
				if (typeof arg == 'string' || arg instanceof String) {
					a = arg.split(/\s+/)
				} else if (Array.isArray(arg)) {
					a = arg;
				} else {
					a = [arg];
				}

				file.initWithPath(path);
				if (!file.exists()) {
					Cu.reportError('File Not Found: ' + path);
					return;
				}

				if (file.isExecutable()) {
					process.init(file);
					process.runw(false, a, a.length);
				} else {
					file.launch();
				}
			} catch (e) {
				console.log(e);
			}
		},

		ConvertText: function(text) {
			var that = this;
			var context = gContextMenu || {
				link: {
					href: "",
					host: ""
				},
				target: {
					alt: "",
					title: ""
				},
				__noSuchMethod__: function(id, args)
				"",
			};
			var tab = document.popupNode && document.popupNode.localName == "tab" ? document.popupNode : null;
			var win = tab ? tab.linkedBrowser.contentWindow : this.FocusedWindow;

			return text.replace(this.regexp, function(str) {
				str = str.toUpperCase().replace("%LINK", "%RLINK");
				if (str.indexOf("_HTMLIFIED") >= 0)
					return htmlEscape(convert(str.replace("_HTMLIFIED", "")));
				if (str.indexOf("_HTML") >= 0)
					return htmlEscape(convert(str.replace("_HTML", "")));
				if (str.indexOf("_ENCODE") >= 0)
					return encodeURIComponent(convert(str.replace("_ENCODE", "")));
				return convert(str);
			});

			function convert(str) {
				switch (str) {
					case "%T":
						return win.document.title;
					case "%TITLE%":
						return win.document.title;
					case "%TITLES%":
						return win.document.title.replace(/\s-\s.*/i, "").replace(/_[^\[\]【】]+$/, "");
					case "%U":
						return win.location.href;
					case "%URL%":
						return win.location.href;
					case "%H":
						return win.location.host;
					case "%HOST%":
						return win.location.host;
					case "%S":
						return that.getSelection(win) || "";
					case "%SEL%":
						return that.getSelection(win) || "";
					case "%L":
						return context.linkURL || "";
					case "%RLINK%":
						return context.linkURL || "";
					case "%RLINK_HOST%":
						return context.link.host || "";
					case "%RLINK_TEXT%":
						return context.linkText() || "";
					case "%RLINK_OR_URL%":
						return context.linkURL || win.location.href;
					case "%RLT_OR_UT%":
						return context.onLink && context.linkText() || win.document.title; // 链接文本或网页标题
					case "%IMAGE_ALT%":
						return context.target.alt || "";
					case "%IMAGE_TITLE%":
						return context.target.title || "";
					case "%I":
						return context.imageURL || "";
					case "%IMAGE_URL%":
						return context.imageURL || "";
					case "%IMAGE_BASE64%":
						return img2base64(context.imageURL);
					case "%M":
						return context.mediaURL || "";
					case "%MEDIA_URL%":
						return context.mediaURL || "";
					case "%P":
						return readFromClipboard() || "";
					case "%CLIPBOARD%":
						return readFromClipboard() || "";
					case "%FAVICON%":
						return gBrowser.getIcon(tab ? tab : null) || "";
					case "%FAVICON_BASE64%":
						return img2base64(gBrowser.getIcon(tab ? tab : null));
					case "%EMAIL%":
						return getEmailAddress() || "";
					case "%EOL%":
						return "\r\n";
					case "%EOL%":
						return "\r\n";
				}
				return str;
			}

			function htmlEscape(s) {
				return (s + "").replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/\"/g, "&quot;").replace(/\'/g, "&apos;");
			};

			function getEmailAddress() {
				var url = context.linkURL;
				if (!url || !/^mailto:([^?]+).*/i.test(url)) return "";
				var addresses = RegExp.$1;
				try {
					var characterSet = context.target.ownerDocument.characterSet;
					const textToSubURI = Cc['@mozilla.org/intl/texttosuburi;1'].getService(Ci.nsITextToSubURI);
					addresses = textToSubURI.unEscapeURIForUI(characterSet, addresses);
				} catch (ex) {}
				return addresses;
			}

			function img2base64(imgsrc) {
				if (typeof imgsrc == 'undefined') return "";

				const NSURI = "http://www.w3.org/1999/xhtml";
				var img = new Image();
				var that = this;
				var canvas,
					isCompleted = false;
				img.onload = function() {
					var width = this.naturalWidth,
						height = this.naturalHeight;
					canvas = document.createElementNS(NSURI, "canvas");
					canvas.width = width;
					canvas.height = height;
					var ctx = canvas.getContext("2d");
					ctx.drawImage(this, 0, 0);
					isCompleted = true;
				};
				img.onerror = function() {
					Components.utils.reportError("Count not load: " + imgsrc);
					isCompleted = true;
				};
				img.src = imgsrc;

				var thread = Cc['@mozilla.org/thread-manager;1'].getService().mainThread;
				while (!isCompleted) {
					thread.processNextEvent(true);
				}

				var data = canvas ? canvas.toDataURL("image/png") : "";
				canvas = null;
				return data;
			}
		},

		handleRelativePath: function(path) {
			if (path) {
				//path = path.replace(/\//g, '\\').toLocaleLowerCase();
				path = path.replace(/\//g, '\\');
				var profD = Cc['@mozilla.org/file/directory_service;1'].getService(Ci.nsIProperties).get("ProfD", Ci.nsILocalFile);
				if (/^(\\)/.test(path)) {
					if (path.startsWith('\\..\\')) {
						return profD.parent.path + path.replace('\\..', '');
					}
					return profD.path + path;
				} else {
					return path;
				}
			}
		},

		getSelection: function(win) {
			win || (win = this.focusedWindow);
			var selection = this.getRangeAll(win).join(" ");
			if (!selection) {
				let element = document.commandDispatcher.focusedElement;
				let isOnTextInput = function(elem) {
					return elem instanceof HTMLTextAreaElement ||
						(elem instanceof HTMLInputElement && elem.mozIsTextField(true));
				};

				if (isOnTextInput(element)) {
					selection = element.QueryInterface(Ci.nsIDOMNSEditableElement)
						.editor.selection.toString();
				}
			}

			if (selection) {
				selection = selection.replace(/^\s+/, "")
					.replace(/\s+$/, "")
					.replace(/\s+/g, " ");
			}
			return selection;
		},

		getRangeAll: function(win) {
			win || (win = this.focusedWindow);
			var sel = win.getSelection();
			var res = [];
			for (var i = 0; i < sel.rangeCount; i++) {
				res.push(sel.getRangeAt(i));
			};
			return res;
		},

		/*****************************************************************************************/
		EditFile: function(aFile) {
			if (!aFile)
				aFile = this.File;
			else if (typeof(aFile) == "string") {
				if (/^file:\/\//.test(aFile))
					aFile = aFile.QueryInterface(Components.interfaces.nsIFileURL).file;
				else {
					var File = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
					aFile = File.initWithPath(aFile);
				}
			} else return;

			if (!aFile || !aFile.exists() || !aFile.isFile())
				return alert("文件不存在:\n" + aFile.path);

			var editor;
			try {
				editor = gPrefService.getCharPref("view_source.editor.path");
			} catch (e) {
				log("编辑器路径读取错误  >>  " + e);
				alert("请先设置编辑器的路径!!!\nview_source.editor.path");
				toOpenWindowByType('pref:pref', 'about:config?filter=view_source.editor.path');
			}

			if (!editor) {
				this.OpenScriptInScratchpad(window, aFile);
				alert("请先设置编辑器的路径!!!\nview_source.editor.path");
				return;
			}

			var UI = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
			var platform = window.navigator.platform.toLowerCase();
			if (platform.indexOf('win') > -1)
				UI.charset = 'GB2312';
			else
				UI.charset = 'UTF-8';
			// UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0 ? "gbk" : "UTF-8";
			var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);

			try {
				var path = UI.ConvertFromUnicode(aFile.path);
				// process.init(editor);
				// process.run(false, [path], [path].length);
				var appfile = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
				appfile.initWithPath(editor);
				process.init(appfile);
				process.run(false, [path], 1, {});
			} catch (e) {
				alert("编辑器不正确！")
				this.OpenScriptInScratchpad(window, aFile);
			}
		},

		Copy: function(str) {
			if (!str) str = this.icon.tooltipText;
			Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString(str);
			XULBrowserWindow.statusTextField.label = "已复制: " + str;
		},

		OpenScriptInScratchpad: function(parentWindow, file) {
			let spWin = (parentWindow.Scratchpad || Services.wm.getMostRecentWindow("navigator:browser").Scratchpad).openScratchpad();

			spWin.addEventListener("load", function spWinLoaded() {
				spWin.removeEventListener("load", spWinLoaded, false);

				let Scratchpad = spWin.Scratchpad;
				Scratchpad.setFilename(file.path);
				Scratchpad.addObserver({
					onReady: function() {
						Scratchpad.removeObserver(this);
						Scratchpad.importFromFile.call(Scratchpad, file);
					}
				});
			}, false);
		},

		LoadFile: function(aFile, isAlert) {
			if (!aFile || !aFile.exists() || !aFile.isFile())
				return null;
			var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
			var sstream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);
			fstream.init(aFile, -1, 0, 0);
			sstream.init(fstream);
			var data = sstream.read(sstream.available());
			try {
				data = decodeURIComponent(escape(data));
			} catch (e) {}
			sstream.close();
			fstream.close();
			if (!data) {
				var errmsg = "Rebuild Error:【" + aFile.leafName + "】文件不存在";
				console.log(errmsg);
				if (isAlert)
					alert(errmsg);
				return null;
			}
			var sandbox = new Cu.Sandbox(new XPCNativeWrapper(window));
			sandbox.Components = Components;
			sandbox.Cc = Cc;
			sandbox.Ci = Ci;
			sandbox.Cr = Cr;
			sandbox.Cu = Cu;
			sandbox.Services = Services;
			sandbox.locale = Services.prefs.getCharPref("general.useragent.locale");
			try {
				var lineFinder = new Error();
				Cu.evalInSandbox(data, sandbox, "1.8");
			} catch (e) {
				let line = e.lineNumber - lineFinder.lineNumber - 1;
				var errmsg = 'Error: ' + e + "\n请重新检查【" + aFile.leafName + "】文件第 " + line + " 行";
				console.log(errmsg);
				if (isAlert)
					alert(errmsg);
			}
			return sandbox || null;
		},
	};
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

	function log(str) {
		console.log("[Another Button Debug] ", arguments);
	}

	function alert(aString, aTitle) {
		Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "Another Button", aString, false, "", null);
	}

	function $(id) {
		return document.getElementById(id);
	}

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	function addStyle(css) {
		var pi = document.createProcessingInstruction(
			'xml-stylesheet',
			'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
		);
		return document.insertBefore(pi, document.documentElement);
	}

	anoBtn.init();
	window.anoBtn = anoBtn;
})('\
#anoBtn_Icon dropmarker {\
    display: none;\
}\
'.replace(/\n|\t/g, ''));
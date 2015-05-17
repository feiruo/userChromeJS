// ==UserScript==
// @name 			FeiRuoMouse.uc.js
// @description		手势与拖拽
// @author			feiruo
// @namespace		feiruosama@gmail.com
// @include			main
// @compatibility	Firefox 16
// @charset			UTF-8
// @id 				[4E4E49D6]
// @inspect         window.FeiRuoMouse
// @startup         window.FeiRuoMouse.init();
// @shutdown        window.FeiRuoMouse.onDestroy();
// @optionsURL		about:config?filter=FeiRuoMouse.
// @config 			window.FeiRuoMouse.Edit();
// @reviewURL		http://www.feiruo.pw
// @homepageURL		https://github.com/feiruo/userChromeJS/tree/master/FeiRuoMouse
// @downloadURL		https://github.com/feiruo/userChromeJS/raw/master/FeiRuoMouse/FeiRuoMouse.uc.js
// @note            Begin 2015.04.23
// @note            手势与拖拽。
// @version         0.0.2 	2015.05.17 15:00	TextLink&QRCreator&E10s。
// @version         0.0.1 	2015.04.28 10:00	Build。
// ==/UserScript==
(function() {

	let {
		classes: Cc,
		interfaces: Ci,
		utils: Cu,
		results: Cr
	} = Components;
	if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");


	if (window.FeiRuoMouse) {
		window.FeiRuoMouse.onDestroy();
		delete window.FeiRuoMouse;
	}

	var FeiRuoMouse = {
		DragIng: {},
		GesIng: {
			_lastX: 0,
			_lastY: 0,
			_directionChain: '',
			_isMouseDownL: false,
			_isMouseDownR: false,
			_hideFireContext: false,
			_shouldFireContext: false,
		},
		get Prefs() {
			delete this.Prefs;
			return this.Prefs = Services.prefs.getBranch("userChromeJS.FeiRuoMouse.");
		},
		get file() {
			let aFile;
			aFile = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
			aFile.appendRelativePath("lib");
			aFile.appendRelativePath("_FeiRuoMouse.js");
			try {
				this._modifiedTime = aFile.lastModifiedTime;
			} catch (e) {}
			delete this.file;
			return this.file = aFile;
		},
		get Content() {
			var cont;
			if (!window.content) {
				function listener(message) {
					cont = message.objects.cont
				}
				gBrowser.selectedBrowser.messageManager.loadFrameScript("data:application/x-javascript;charset=UTF-8," + escape('sendAsyncMessage("FeiRuoMouse:FeiRuoMouse-e10s-content-message", {}, {cont: content,})'), true);
				gBrowser.selectedBrowser.messageManager.addMessageListener("FeiRuoMouse:FeiRuoMouse-e10s-content-message", listener);
			}
			try {
				cont = cont;
			} catch (e) {
				cont = gBrowser.selectedBrowser.contentWindowAsCPOW;
			}
			delete this.Content;
			return this.Content = window.content || cont || gBrowser.selectedBrowser._contentWindow;
		},

		init: function() {
			var ins = $("menu_ToolsPopup").firstChild;
			ins.parentNode.insertBefore($C("menuitem", {
				id: "FeiRuoMouse_set",
				label: "FeiRuoMouse配置",
				tooltiptext: "左键：打开配置窗口\n中键：重载配置文件\n右键：打开配置文件",
				onclick: "FeiRuoMouse.SetMenuItmClick(event);",
				class: "menuitem-iconic",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABGklEQVQ4jZXSSyvEYRTH8Y+MhhnNuE3KyK0kUTbsbMjKwk5KynYU5RJlIVu5ZShJSbwAC3t7O2/J4nnk32T+M06dnsVzzvd3bvxaBkeYRxE96MIMTpHTwAbxiSecJfweX5hqBMigglnM4QQLmMQuOhoBoBXZqFxBNbbT2kzyj+VwgZH4lv6TnAQMC/PYE9rIoCUtMYt+FHCOITzgAG+4wzom0FmbnIlKD9jHTYSVkcehsN53POIYbUlAMSqMCzv/QG/ivy36EgZwjb7aKrawEctbRnudVvO48sdwy7j9i9wsALax1gTgsh5gTDie7hRASZhBoV7ADjZTAKvCalMVqliMKsXoXVgRVlxOA8C0cBMveI7+KvQ+mgz8BpV2JrkiClSKAAAAAElFTkSuQmCC",
			}), ins);

			this.loadSetting();
			this.loadCustomCommand();
			this.AddListen_TextLink();

			this.Prefs.addObserver('', this.Prefobs, false);
			window.addEventListener("unload", function() {
				FeiRuoMouse.onDestroy();
			}, false);
		},

		onDestroy: function() {
			this.Listen_Ges(false);
			this.Listen_Drag(false);
			this.TextToLink = false;
			this.QRCreator.uninit();
			if (this.getWindow(0)) this.getWindow(0).close();
			if (this.getWindow(1)) this.getWindow(1).close();
			this.Prefs.removeObserver('', this.Prefobs, false);
			if ($("FeiRuoMouse_set")) $("FeiRuoMouse_set").parentNode.removeChild($("FeiRuoMouse_set"));
			Services.obs.notifyObservers(null, "startupcache-invalidate", "");
		},

		SetMenuItmClick: function(e) {
			if (e.target != e.currentTarget) return;
			e.stopPropagation();
			e.preventDefault();
			if (e.button == 0)
				this.OpenPref();
			else if (e.button == 1)
				this.loadCustomCommand(true);
			else if (e.button == 2)
				this.Edit(this.file);
		},

		Prefobs: function(subject, topic, data) {
			if (topic == 'nsPref:changed') {
				switch (data) {
					case 'DragCustom':
					case 'GesCustom':
					case 'TextLink':
					case 'QRCreator':
						FeiRuoMouse.loadSetting(data);
						break;
				}
			}
		},

		loadSetting: function(type) {
			if (!type || type === "DragCustom") {
				this.DragCustom = unescape(this.getPrefs(2, "DragCustom", ""));
				if (this.DragCustom) {
					this.DragRules_Image = this.DragRules_Url = this.DragRules_Text = {};
					this.DragRules_AnyImage = this.DragRules_AnyUrl = this.DragRules_AnyText = {};
					this.loadRule("DragCustom", this.DragCustom);
					this.Listen_Drag(true);
				}
			}

			if (!type || type === "GesCustom") {
				this.GesCustom = unescape(this.getPrefs(2, "GesCustom", ""));
				if (this.GesCustom) {
					this.GesturesRules = {};
					this.loadRule("GesCustom", this.GesCustom);
					this.Listen_Ges(true);
				}
			}

			if (!type || type === "QRCreator") {
				var QRCreator = this.getPrefs(0, "QRCreator", false);
				if (QRCreator)
					this.QRCreator.init();
				else
					this.QRCreator.uninit();
			}

			if (!type || type === "TextLink")
				this.TextToLink = this.getPrefs(0, "TextLink", false);
		},

		loadRule: function(Prefs, val) {
			var Rules = val.split(";;");
			if (!Rules[0]) return;

			for (var i in Rules) {
				var Rule = Rules[i].split("|");
				var obj = {};
				var Enable = Rule[0] || "",
					Command = Rule[1] || "",
					Action = Rule[2] || "",
					Type = Rule[3] || "",
					Key = Rule[4] || "",
					TKey = Rule[5] || "";

				obj.Enable = Enable;
				obj.Command = Command;
				obj.Action = Action;
				obj.Type = Type;
				obj.TKey = TKey;

				var keys = [];
				if (Key) {
					if (Key.match("Alt"))
						keys.push("Alt")
					if (Key.match("Ctrl"))
						keys.push("Ctrl")
					if (Key.match("Shift"))
						keys.push("Shift")
				}
				Key = keys.join("+");
				obj.Key = Key;

				if (Prefs == "DragCustom" && Type) {
					if (Action != "ANY")
						FeiRuoMouse["DragRules_" + Type][Action] = obj;
					else
						FeiRuoMouse["DragRules_Any" + Type][Key] = obj;
				} else if (Prefs == "GesCustom") {
					FeiRuoMouse.GesturesRules[Action] = obj;
				}
			}
		},

		loadCustomCommand: function(isAlert) {
			if (this.file && this.file.exists() && this.file.isFile())
				var data = this.loadFile(this.file);

			if (!data)
				return alert("自定义命令配置文件不存在！");

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
				var ErrMsg = e + "请重新检查配置文件第 " + line + " 行！";
				log(ErrMsg);
				if (isAlert) alert("Rebuild Error: \n" + ErrMsg);
				return;
			}

			if (!sandbox.CustomCommand)
				return alert("无自定义命令！");

			delete this.CustomCommand;
			delete this.QRCode;
			this.QRCode = sandbox.QRCode;
			var CustomCommand = sandbox.CustomCommand || {};
			this.CustomCommand = {};
			for (var i in CustomCommand) {
				this.CustomCommand[CustomCommand[i].label] = CustomCommand[i];
			}

			if (isAlert)
				alert('自定义命令重载完成！');
		},

		/*****************************************************************************************/
		AddListen_TextLink: function() {
			if (window.content) {
				if (/^chrome:\/\/messenger\/content\//.test(window.location.href)) {
					var target = document.getElementById("messagepane");
				} else {
					var target = document.getElementById("appcontent");
				}
				target.removeEventListener('dblclick', FeiRuoMouse.Listener_TextLink, false);
				target.removeEventListener('keypress', FeiRuoMouse.Listener_TextLink, false);
				target.addEventListener('dblclick', FeiRuoMouse.Listener_TextLink, false);
				target.addEventListener('keypress', FeiRuoMouse.Listener_TextLink, false);
				if (!/^chrome:\/\/messenger\/content\//.test(window.location.href)) {
					setTimeout(function() {
						try {
							var doc = document.getElementById('sidebar').contentDocument;
							if (doc && doc.location && doc.location.href == "chrome://browser/content/web-panels.xul")
								doc.addEventListener('dblclick', FeiRuoMouse.Listener_TextLink, false);
							doc.addEventListener('keypress', FeiRuoMouse.Listener_TextLink, false);
						} catch (e) {}
					}, 1000);
				}
			} else {
				function listener(message) {
					FeiRuoMouse.Listener_TextLink(message.objects.event)
				}
				var TextLinkFunc = function() {
					addEventListener("dblclick", function(event) {
						sendAsyncMessage("FeiRuoMouse:FeiRuoMouse-e10s-TextLink-message", {}, {
							event: event,
						});
					}, false);
				}.toString().replace(/^function.*{|}$/g, "");
				let globalMM = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);
				globalMM.loadFrameScript("data:application/x-javascript;charset=UTF-8," + escape(TextLinkFunc), true);
				Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager).addMessageListener("FeiRuoMouse:FeiRuoMouse-e10s-TextLink-message", listener);
			}
		},

		/*****************************************************************************************/
		Listen_Ges: function(isAlert) {
			var Events = ["mousedown", "mousemove", "mouseup", "contextmenu", "draggesture", "DOMMouseScroll"];

			Events.forEach(function(type) {
				gBrowser.mPanelContainer.removeEventListener(type, FeiRuoMouse.Listener_Ges, type == "contextmenu");
			});

			if (!isAlert) return;

			Events.forEach(function(type) {
				gBrowser.mPanelContainer.addEventListener(type, FeiRuoMouse.Listener_Ges, type == "contextmenu");
			});
		},

		Listen_Drag: function(isAlert) {
			var Events = ["dragstart", "drag", "dragover", "drop"];
			Events.forEach(function(type) {
				gBrowser.mPanelContainer.removeEventListener(type, FeiRuoMouse.Listener_Drag, false);
			});

			if (!isAlert) return;

			Events.forEach(function(type) {
				gBrowser.mPanelContainer.addEventListener(type, FeiRuoMouse.Listener_Drag, false);
			});
		},

		/*****************************************************************************************/
		Listener_TextLink: function(event) {
			if (!FeiRuoMouse.TextToLink) return;
			setTimeout(function() {
				FeiRuoMouse.TextLink.init(event);
			}, 100);
		},

		Listener_Drag: function(event) {
			var that = FeiRuoMouse.DragIng;
			switch (event.type) {
				case "dragstart":
					that.lastPoint = [event.screenX, event.screenY];
					that.sourceNode = event.target;
					that.directionChain = "";
					event.target.localName == "img" && event.dataTransfer.setData("application/x-moz-file-promise-url", event.target.src);
					break;
				case "drag":
					//that.dragFromInside = true;
					break;
				case "dragover":
					if (!that.lastPoint) return;
					Cc["@mozilla.org/widget/dragservice;1"].getService(Ci.nsIDragService).getCurrentSession().canDrop = true;
					var [subX, subY] = [event.screenX - that.lastPoint[0], event.screenY - that.lastPoint[1]];
					var [distX, distY] = [(subX > 0 ? subX : (-subX)), (subY > 0 ? subY : (-subY))];
					var direction;
					if (distX < 10 && distY < 10) return;
					if (distX > distY) direction = subX < 0 ? "L" : "R";
					else direction = subY < 0 ? "U" : "D";
					if (direction != that.directionChain.charAt(that.directionChain.length - 1)) {
						that.directionChain += direction;
						that.Drag = that.directionChain;
						FeiRuoMouse.ActionStaus(event, that.Drag);
					}
					that.lastPoint = [event.screenX, event.screenY];
					break;
				case "drop":
					if (that.lastPoint && event.target.localName != "textarea" && (!(event.target.localName == "input" && (event.target.type == "text" || event.target.type == "password"))) && event.target.contentEditable != "true") {
						event.preventDefault();
						event.stopPropagation();
						var type;
						if (event.dataTransfer.types.contains("application/x-moz-file-promise-url"))
							type = "Image";
						else if (event.dataTransfer.types.contains("text/x-moz-url"))
							type = "Url";
						else
							type = "Text";
						that.lastPoint = "";
						var EventKey = FeiRuoMouse.ActionEventKey(event)
						var obj = FeiRuoMouse["DragRules_" + type][that.Drag] || FeiRuoMouse["DragRules_Any" + type][EventKey];
						FeiRuoMouse.Listen_AidtKey(event, obj, that.Drag);
					}
					break;
			}
		},

		Listener_Ges: function(event) {
			var that = FeiRuoMouse.GesIng;
			switch (event.type) {
				case "mousedown":
					if (/object|embed/i.test(event.target.localName)) return;
					if (event.button == 2) {
						that._isMouseDownR = true;
						that._hideFireContext = false;
						FeiRuoMouse.StartGesture(event);
					}
					if (event.button == 2 && that._isMouseDownL) {
						that._isMouseDownR = false;
						that._shouldFireContext = false;
						that._hideFireContext = true;
						that._directionChain = "L>R";
						FeiRuoMouse.StopGesture(event);
					} else if (event.button == 0) {
						that._isMouseDownL = true;
						if (that._isMouseDownR) {
							that._isMouseDownL = false;
							that._shouldFireContext = false;
							that._hideFireContext = true;
							that._directionChain = "L<R";
							FeiRuoMouse.StopGesture(event);
						}
					}
					break;
				case "mousemove":
					if (that._isMouseDownR) {
						that._hideFireContext = true;
						FeiRuoMouse.ProgressGesture(event);
					}
					break;
				case "mouseup":
					/*if (event.ctrlKey && event.button == 2) {
						that._isMouseDownL = false;
						that._isMouseDownR = false;
						that._shouldFireContext = false;
						that._hideFireContext = false;
						that._directionChain = '';
						event.preventDefault();
						FeiRuoMouse.ActionStaus(event, "", "取消手势");
						break;
					}*/
					if (that._isMouseDownR && event.button == 2) {
						if (that._directionChain) that._shouldFireContext = false;
						that._isMouseDownR = false;
						that._directionChain && FeiRuoMouse.StopGesture(event);
						if (that._shouldFireContext && !that._hideFireContext) {
							that._shouldFireContext = false;
							FeiRuoMouse._displayContextMenu(event);
						}
					} else if (event.button == 0 && that._isMouseDownL) {
						that._isMouseDownL = false;
						that._shouldFireContext = false;
					}
					break;
				case "contextmenu":
					if (that._isMouseDownL || that._isMouseDownR || that._hideFireContext) {
						var pref = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
						var contextmenu = pref.getBoolPref("dom.event.contextmenu.enabled");
						pref.setBoolPref("dom.event.contextmenu.enabled", true);
						setTimeout(function() {
							pref.setBoolPref("dom.event.contextmenu.enabled", contextmenu);
						}, 10);
						event.preventDefault();
						event.stopPropagation();
						that._shouldFireContext = true;
						that._hideFireContext = false;
					}
					break;
				case "DOMMouseScroll":
					if (that._isMouseDownR) {
						event.preventDefault();
						event.stopPropagation();
						that._shouldFireContext = false;
						that._hideFireContext = true;
						that._directionChain = "W" + (event.detail > 0 ? "+" : "-");
						FeiRuoMouse.StopGesture(event);
					}
					break;
				case "draggesture":
					that._isMouseDownL = false;
					break;
			}
		},

		/*****************************************************************************************/
		_displayContextMenu: function(event) {
			var evt = event.originalTarget.ownerDocument.createEvent("MouseEvents");
			evt.initMouseEvent("contextmenu", true, true, event.originalTarget.defaultView, 0, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 2, null);
			event.originalTarget.dispatchEvent(evt);
		},

		StartGesture: function(event) {
			var that = FeiRuoMouse.GesIng;
			that._lastX = event.screenX;
			that._lastY = event.screenY;
			that._directionChain = "";
			if (window.content)
				this.CreateTrail(event.view);
			else
				gBrowser.selectedBrowser.messageManager.loadFrameScript("data:application/x-javascript;charset=UTF-8,(" + escape(this.CreateTrail.toString()) + ")();", true);
		},

		ProgressGesture: function(event) {
			var that = FeiRuoMouse.GesIng;
			var x = event.screenX,
				y = event.screenY;
			var lastX = that._lastX,
				lastY = that._lastY;
			var subX = x - lastX,
				subY = y - lastY;
			var distX = (subX > 0 ? subX : (-subX)),
				distY = (subY > 0 ? subY : (-subY));
			var direction;
			if (distX < 10 && distY < 10) return;
			if (distX > distY) direction = subX < 0 ? "L" : "R";
			else direction = subY < 0 ? "U" : "D";
			var dChain = that._directionChain;
			var obj = {
				x1: that._lastX,
				y1: that._lastY,
				x2: x,
				y2: y
			};
			var str = JSON.stringify(obj);
			if (window.content)
				this.DrawTrail(str);
			else {
				gBrowser.selectedBrowser.messageManager.loadFrameScript("data:application/x-javascript;charset=UTF-8,(" + escape(this.DrawTrail.toString()) + ")('" + escape(str) + "');", true);
			}
			if (direction != dChain.charAt(dChain.length - 1)) {
				dChain += direction;
				that._directionChain += direction;
				this.ActionStaus(event, dChain);
			}
			that._lastX = x;
			that._lastY = y;
		},

		StopGesture: function(event) {
			var that = FeiRuoMouse.GesIng;
			this.Listen_AidtKey(event, this.GesturesRules[that._directionChain], that._directionChain);
			that._directionChain = "";
			if (window.content)
				this.EraseTrail();
			else
				gBrowser.selectedBrowser.messageManager.loadFrameScript("data:application/x-javascript;charset=UTF-8,(" + escape(this.EraseTrail.toString()) + ")();", true);
		},

		CreateTrail: function(win) {
			win = win || content;
			if (!win) return;
			if (win.top.document instanceof Components.interfaces.nsIDOMHTMLDocument) win = win.top;
			else if (win.document instanceof Components.interfaces.nsIDOMHTMLDocument === false) return;
			var doc = content.document;
			var insertionNode = doc.documentElement ? doc.documentElement : doc;
			var win = doc.defaultView;
			content.FeiRuoMouse_GesTrail_trailDot = null;
			content.FeiRuoMouse_GesTrail_trailArea = null;
			content.FeiRuoMouse_GesTrail_trailLastDot = null;
			content.FeiRuoMouse_GesTrail_trailOffsetX = 0;
			content.FeiRuoMouse_GesTrail_trailOffsetY = 0;
			content.FeiRuoMouse_GesTrail_trailZoom = 1;
			content.FeiRuoMouse_GesTrail_trailSize = 2;
			content.FeiRuoMouse_GesTrail_trailColor = "brown";
			let xdTrailArea = content.document.querySelectorAll("[id^='FeiRuoMouse_Ges_']");
			for (let i = 0; i < xdTrailArea.length; i++) {
				xdTrailArea[i].parentNode.removeChild(xdTrailArea[i]);
			}
			delete xdTrailArea;
			content.FeiRuoMouse_GesTrail_trailZoom = win.QueryInterface(Components.interfaces.nsIInterfaceRequestor).
			getInterface(Components.interfaces.nsIDOMWindowUtils).screenPixelsPerCSSPixel;
			content.FeiRuoMouse_GesTrail_trailOffsetX = (win.mozInnerScreenX - win.scrollX) * content.FeiRuoMouse_GesTrail_trailZoom;
			content.FeiRuoMouse_GesTrail_trailOffsetY = (win.mozInnerScreenY - win.scrollY) * content.FeiRuoMouse_GesTrail_trailZoom;
			content.FeiRuoMouse_GesTrail_trailArea = doc.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailArea");
			content.FeiRuoMouse_GesTrail_trailArea.id = "FeiRuoMouse_Ges_xdTrailArea";
			insertionNode.appendChild(content.FeiRuoMouse_GesTrail_trailArea);
			content.FeiRuoMouse_GesTrail_trailDot = doc.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailDot");
			content.FeiRuoMouse_GesTrail_trailDot.style.width = content.FeiRuoMouse_GesTrail_trailSize + "px";
			content.FeiRuoMouse_GesTrail_trailDot.style.height = content.FeiRuoMouse_GesTrail_trailSize + "px";
			content.FeiRuoMouse_GesTrail_trailDot.style.background = content.FeiRuoMouse_GesTrail_trailColor;
			content.FeiRuoMouse_GesTrail_trailDot.style.border = "0px";
			content.FeiRuoMouse_GesTrail_trailDot.style.position = "absolute";
			content.FeiRuoMouse_GesTrail_trailDot.style.zIndex = 2147483647;
		},

		DrawTrail: function(str) {
			var obj = JSON.parse(str);
			var x1 = obj.x1,
				y1 = obj.y1,
				x2 = obj.x2,
				y2 = obj.y2;
			if (!content.FeiRuoMouse_GesTrail_trailArea) return;
			var xMove = x2 - x1;
			var yMove = y2 - y1;
			var xDecrement = xMove < 0 ? 1 : -1;
			var yDecrement = yMove < 0 ? 1 : -1;
			x2 -= content.FeiRuoMouse_GesTrail_trailOffsetX;
			y2 -= content.FeiRuoMouse_GesTrail_trailOffsetY;

			function StrokeDot(x, y) {
				if (content.FeiRuoMouse_GesTrail_trailArea.y == y && content.FeiRuoMouse_GesTrail_trailArea.h == content.FeiRuoMouse_GesTrail_trailSize) {
					var newX = Math.min(content.FeiRuoMouse_GesTrail_trailArea.x, x);
					var newW = Math.max(content.FeiRuoMouse_GesTrail_trailArea.x + content.FeiRuoMouse_GesTrail_trailArea.w, x + content.FeiRuoMouse_GesTrail_trailSize) - newX;
					content.FeiRuoMouse_GesTrail_trailArea.x = newX;
					content.FeiRuoMouse_GesTrail_trailArea.w = newW;
					content.FeiRuoMouse_GesTrail_trailLastDot.style.left = newX.toString() + "px";
					content.FeiRuoMouse_GesTrail_trailLastDot.style.width = newW.toString() + "px";
					return;
				} else if (content.FeiRuoMouse_GesTrail_trailArea.x == x && content.FeiRuoMouse_GesTrail_trailArea.w == content.FeiRuoMouse_GesTrail_trailSize) {
					var newY = Math.min(content.FeiRuoMouse_GesTrail_trailArea.y, y);
					var newH = Math.max(content.FeiRuoMouse_GesTrail_trailArea.y + content.FeiRuoMouse_GesTrail_trailArea.h, y + content.FeiRuoMouse_GesTrail_trailSize) - newY;
					content.FeiRuoMouse_GesTrail_trailArea.y = newY;
					content.FeiRuoMouse_GesTrail_trailArea.h = newH;
					content.FeiRuoMouse_GesTrail_trailLastDot.style.top = newY.toString() + "px";
					content.FeiRuoMouse_GesTrail_trailLastDot.style.height = newH.toString() + "px";
					return;
				}
				if (content.FeiRuoMouse_GesTrail_trailZoom != 1) {
					x = Math.floor(x / content.FeiRuoMouse_GesTrail_trailZoom);
					y = Math.floor(y / content.FeiRuoMouse_GesTrail_trailZoom);
				}
				var dot = content.FeiRuoMouse_GesTrail_trailDot.cloneNode(true);
				dot.style.left = x + "px";
				dot.style.top = y + "px";
				content.FeiRuoMouse_GesTrail_trailArea.x = x;
				content.FeiRuoMouse_GesTrail_trailArea.y = y;
				content.FeiRuoMouse_GesTrail_trailArea.w = content.FeiRuoMouse_GesTrail_trailSize;
				content.FeiRuoMouse_GesTrail_trailArea.h = content.FeiRuoMouse_GesTrail_trailSize;
				content.FeiRuoMouse_GesTrail_trailArea.appendChild(dot);
				content.FeiRuoMouse_GesTrail_trailLastDot = dot;
			}
			if (Math.abs(xMove) >= Math.abs(yMove))
				for (var i = xMove; i != 0; i += xDecrement)
					StrokeDot(x2 - i, y2 - Math.round(yMove * i / xMove));
			else
				for (var i = yMove; i != 0; i += yDecrement)
					StrokeDot(x2 - Math.round(xMove * i / yMove), y2 - i);
		},

		EraseTrail: function() {
			if (content.FeiRuoMouse_GesTrail_trailArea && content.FeiRuoMouse_GesTrail_trailArea.parentNode) {
				while (content.FeiRuoMouse_GesTrail_trailArea.lastChild)
					content.FeiRuoMouse_GesTrail_trailArea.removeChild(content.FeiRuoMouse_GesTrail_trailArea.lastChild);
				content.FeiRuoMouse_GesTrail_trailArea.parentNode.removeChild(content.FeiRuoMouse_GesTrail_trailArea);
			}
			let xdTrailArea = content.document.querySelectorAll("[id^='FeiRuoMouse_Ges_']");
			for (let i = 0; i < xdTrailArea.length; i++) {
				xdTrailArea[i].parentNode.removeChild(xdTrailArea[i]);
			}
			delete xdTrailArea;
			content.FeiRuoMouse_GesTrail_trailDot = null;
			content.FeiRuoMouse_GesTrail_trailArea = null;
			content.FeiRuoMouse_GesTrail_trailLastDot = null;
		},

		/*****************************************************************************************/
		Listen_AidtKey: function(e, obj, Action) {
			if (!obj)
				return this.ActionStaus(e, Action);

			if (obj.Enable != "1")
				return this.ActionStaus(e, Action, obj.label + "(未启用)");

			var EventKey = this.ActionEventKey(e);
			if (!obj.Key || (obj.TKey != "1" && EventKey == obj.Key) || (obj.TKey == "1" && EventKey != obj.Key))
				FeiRuoMouse.Listen_Command(e, obj, Action);
			else
				this.ActionStaus(e, Action);
		},

		Listen_Command: function(e, obj, Action) {
			e.stopPropagation();
			e.preventDefault();
			var command = obj.Command;
			var cmd = this.CustomCommand[command];
			if (cmd) {
				try {
					var funstr = cmd.command.toString();
					var func = new Function('', 'return ' + funstr)();
					func(e);
				} catch (e) {
					log(command + "(执行错误：" + e + ")")
					status(command + "(执行错误：" + e + ")");
				}
			} else
				this.ActionStaus(e, Action, command);
		},

		ActionStaus: function(event, Action, str) {
			var type = this.ActionEventType(event);
			var key = this.ActionEventKey(event);
			if (!str) {
				var obj;
				if (type)
					obj = FeiRuoMouse["DragRules_" + type.en][Action] || FeiRuoMouse["DragRules_Any" + type.en][key];
				else
					obj = FeiRuoMouse.GesturesRules[Action];
			}

			if (obj) {
				str = obj.Command ? ("(" + obj.Command + ")") : "";

				if (!obj.TKey && key != obj.Key)
					str = "";

				if (obj.TKey && key == obj.Key)
					str = str + "(已排除)";
			}

			type = type ? (type.cn + "拖拽：") : "手势：";
			key = key ? (key + "+") : "";
			status(type + key + Action + (str ? str : "(未定义)"));
		},

		ActionEventKey: function(event) {
			var EventKey = [];
			if (event.altKey)
				EventKey.push("Alt")
			if (event.ctrlKey)
				EventKey.push("Ctrl")
			if (event.shiftKey)
				EventKey.push("Shift")
			EventKey = EventKey.join("+");
			return EventKey;
		},

		ActionEventType: function(event) {
			var drag = event.dataTransfer;
			if (!drag) return "";
			var type = {};
			if (drag.types.contains("application/x-moz-file-promise-url")) {
				type.en = "Image";
				type.cn = "图片";
			} else if (drag.types.contains("text/x-moz-url")) {
				type.en = "Url";
				type.cn = "链接";
			} else {
				type.en = "Text";
				type.cn = "文字";
			}
			return type;
		},

		/*****************************************************************************************/
		QRCreatorMenuCommand: function(isAlert) {
			if (content.document.getElementById('qrCreatorimageboxid'))
				return;
			var target_data = '';
			var altText = "QR码内容[网址]";

			if (gContextMenu) {
				if (gContextMenu.isTextSelected) {
					target_data = content.getSelection().toString();
					altText = "QR码内容[文本]";
				} else if (gContextMenu.onLink) {
					target_data = gContextMenu.linkURL;
				} else if (gContextMenu.onImage) {
					target_data = gContextMenu.target.src;
				} else if ((content.document.location == "about:blank" || content.document.location == "about:newtab")) {
					altText = "QR码内容[文本]";
					target_data = prompt("请输入文本创建一个QR码（长度不超过250字节）：", "");
				} else {
					target_data = content.document.location;
				}
			}

			if (this.QRCheckLength(target_data)) {
				this.QRpopupImage(target_data, altText);
			}
		},

		QRpopupImage: function(target_data, altText) {
			var img_node = content.document.getElementById('qrCreatorimageboxid');
			if (img_node) {
				img_node.parentNode.removeChild(img_node);
			}
			img_node = this.pinImage(target_data, altText);

			content.document.body.appendChild(img_node);
			this.ImgDrag(img_node);
			content.document.addEventListener('click', function(e) {
				if (img_node && e.button == 0 && e.target != img_node) {
					img_node.parentNode.removeChild(img_node);
					this.removeEventListener("click", arguments.callee, true);
				}
			}, true);
		},

		QRCheckLength: function(arg) {
			if (arg) {
				if (arg.length == 0) {
					alert("没有要转化为二维码的内容！");
					return false;
				} else if (arg.length > 250) {
					alert("要转化为二维码的数据超长了！(大于250字节)");
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},

		QRCreatorMenu: function(isAlert) {
			let itm = $("FeiRuoMouse_QRCreatorMenu");
			if (itm) itm.parentNode.removeChild(itm);
			delete itm;
			if (!isAlert) return;
			var ins = $("context-openlinkintab");
			ins.parentNode.insertBefore($C("menuitem", {
				id: "FeiRuoMouse_QRCreatorMenu",
				label: "在线生成QR码",
				tooltiptext: "左键：打开配置窗口\n中键：重载配置文件\n右键：打开配置文件",
				onclick: "FeiRuoTabplus.QRCreatorMenuCommand(event);",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzUlEQVQ4jaWOQYqFMBBE+xgewBO4ceEiIAQaBBHxPjlrFkKWucGbxaf/T/zGYZiCoqraoozwTwhACIHjOCoCt94YQvgM7PterVou762OAGzbRkufvr0H1nWt1stsvtURgGVZvmh3Q6sjPEBVUdWnymvAe4/3ntKX+UkFYJ5nTJ98masXtOCcwzl3m00FYJqmLxrMt1QAxnGs/mz5N30PDMNAS0vedQSg7/vqBWW++mtXYoyoKl3XVQQqvd5UlRgjknMmpcR5nn9iSomcMz9lng2NV0gSXAAAAABJRU5ErkJggg==",
				class: "menuitem-iconic",
			}), ins);
		},

		/*****************************************************************************************/
		getPrefs: function(type, name, val) {
			switch (type) {
				case 0:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_BOOL)
						this.Prefs.setBoolPref(name, val ? val : false);
					return this.Prefs.getBoolPref(name);
					break;
				case 1:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_INT)
						this.Prefs.setIntPref(name, val ? val : 0);
					return this.Prefs.getIntPref(name);
					break;
				case 2:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING)
						this.Prefs.setCharPref(name, val ? val : "");
					return this.Prefs.getCharPref(name);
					break;
			}
		},

		getWindow: function(num) {
			var windowsMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
			if (num === 0)
				return windowsMediator.getMostRecentWindow("FeiRuoMouse:Preferences");
			if (num === 1)
				return windowsMediator.getMostRecentWindow("FeiRuoMouse:DetailWindow");
		},

		UpdateFile: function(isAlert) {
			if (!this.file || !this.file.exists() || !this.file.isFile()) return;

			if (this._modifiedTime != this.file.lastModifiedTime) {
				this._modifiedTime = this.file.lastModifiedTime;
				setTimeout(function() {
					FeiRuoMouse.loadCustomCommand(true);
				}, 10);
			}
		},

		Edit: function(aFile, aLineNumber) {
			if (!aFile)
				aFile = this.file;

			if (typeof(aFile) == "string") {
				var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
				var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
				aFile = file.initWithPath(aFile);
			}

			if (!aFile || !aFile.exists() || !aFile.isFile())
				return alert("文件不存在:\n" + aFile.path);

			var editor;
			try {
				editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
			} catch (e) {
				alert("请先设置编辑器的路径!!!\nview_source.editor.path");
			}

			if (!editor || !editor.exists()) {
				this.openScriptInScratchpad(window, aFile);
				return;
			}
			var aURL = userChrome.getURLSpecFromFile(aFile);
			var aDocument = null;
			var aCallBack = null;
			var aPageDescriptor = null;
			if (/aLineNumber/.test(gViewSourceUtils.openInExternalEditor.toSource()))
				gViewSourceUtils.openInExternalEditor(aURL, aPageDescriptor, aDocument, aLineNumber, aCallBack);
			else
				gViewSourceUtils.openInExternalEditor(aURL, aPageDescriptor, aDocument, aCallBack);
		},

		openScriptInScratchpad: function(parentWindow, file) {
			let spWin = (parentWindow.Scratchpad || Services.wm.getMostRecentWindow("navigator:browser").Scratchpad)
				.openScratchpad();

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

		loadFile: function(aFile) {
			if (!aFile.exists() || !aFile.isFile()) return null;
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
			return data;
		},

		OpenPref: function() {
			if (this.getWindow(0))
				this.getWindow(0).focus();
			else {
				var OptionWin = this.OptionWin();
				window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + OptionWin, '', 'chrome,titlebar,toolbar,centerscreen,dialog=no');
			}
		},
	};

	FeiRuoMouse.QRCreator = {
		init: function() {
			this.Enable = true;
			var ins = $("context-openlinkintab");
			ins.parentNode.insertBefore($C("menuitem", {
				id: "FeiRuoMouse_QRCreator",
				label: "生成QR码",
				tooltiptext: "左键：自动模式\n右键：自定文字",
				onclick: "FeiRuoMouse.QRCreator.MenuClick(event);",
				//command: "qrCreator.onMenuItemCommand()",
				class: "menuitem-iconic",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAzUlEQVQ4jaWOQYqFMBBE+xgewBO4ceEiIAQaBBHxPjlrFkKWucGbxaf/T/zGYZiCoqraoozwTwhACIHjOCoCt94YQvgM7PterVou762OAGzbRkufvr0H1nWt1stsvtURgGVZvmh3Q6sjPEBVUdWnymvAe4/3ntKX+UkFYJ5nTJ98masXtOCcwzl3m00FYJqmLxrMt1QAxnGs/mz5N30PDMNAS0vedQSg7/vqBWW++mtXYoyoKl3XVQQqvd5UlRgjknMmpcR5nn9iSomcMz9lng2NV0gSXAAAAABJRU5ErkJggg==",
			}), ins);
			$("contentAreaContextMenu").addEventListener("popupshowing", this.optionsChangeLabel, false);
		},

		uninit: function() {
			this.Enable = false;
			if ($("FeiRuoMouse_QRCreator")) $("FeiRuoMouse_QRCreator").parentNode.removeChild($("FeiRuoMouse_QRCreator"));
		},

		MenuClick: function(event) {
			if (!this.Enable) return;
			var cont = window.content || FeiRuoMouse.Content;
			if (cont.document.getElementById('qrCreatorimageboxid'))
				return;
			var target_data = '';
			var altText = "QR码内容[网址]";

			if (event.button == 0) {
				if (gContextMenu) {
					if (gContextMenu.isTextSelected) {
						target_data = cont.getSelection().toString();
						altText = "QR码内容[文本]";
					} else if (gContextMenu.onLink) {
						target_data = gContextMenu.linkURL;
					} else if (gContextMenu.onImage) {
						target_data = gContextMenu.target.src;
					} else if ((cont.document.location == "about:blank" || cont.document.location == "about:newtab")) {
						altText = "QR码内容[文本]";
						target_data = prompt("请输入文本创建一个QR码（长度不超过250字节）：", "");
					} else {
						target_data = cont.document.location;
					}
				}
			} else if (event.button == 2) {
				altText = "QR码内容[文本]";
				target_data = prompt("请输入文本创建一个QR码（长度不超过250字节）：", "");
				event.stopPropagation();
				event.preventDefault();
			}
			this.QRCommand(target_data, altText);
		},

		convertFromUnicode: function(charset, str) {
			try {
				var unicodeConverter = Components
					.classes["@mozilla.org/intl/scriptableunicodeconverter"]
					.createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
				unicodeConverter.charset = charset;
				str = unicodeConverter.ConvertFromUnicode(str);
				return str + unicodeConverter.Finish();
			} catch (ex) {
				return null;
			}
		},

		createQrcode: function(text, typeNumber, errorCorrectLevel) {
			for (var type = 4; type <= 40; type += 1) {
				try {
					var qr = FeiRuoMouse.QRCode(type, 'L');
					qr.addData("" + this.convertFromUnicode("UTF-8", text));
					qr.make();

					return qr.createImgTag();
				} catch (err) {}
			}

			return null;
		},

		checkLength: function(arg) {
			if (arg) {
				if (arg.length == 0) {
					alert("没有要转化为二维码的内容！");
					return false;
				} else if (arg.length > 250) {
					alert("要转化为二维码的数据超长了！(大于250字节)");
					return false;
				} else {
					return true;
				}
			} else {
				return false;
			}
		},

		PopupImage: function(src, alt) {
			var imgnode = content.document.getElementById('qrCreatorimageboxid');
			if (imgnode) {
				imgnode.parentNode.removeChild(imgnode);
			}

			var img_node = content.document.createElement("img");
			img_node.setAttribute('style', '-moz-box-shadow: 0 0 4px #000000');
			with(img_node.style) {
				position = 'fixed';
				left = '-moz-calc(50% - 183px)';
				top = '-moz-calc(50% - 183px)';
				zIndex = 99999;
				width = "160px";
				height = "160px";
				border = '8px solid rgba(0,0,0,.5)';
				borderRadius = '5px';
				background = 'white';
			}
			img_node.setAttribute('id', 'qrCreatorimageboxid');
			img_node.setAttribute('src', src);
			img_node.setAttribute('alt', alt || "");
			img_node.setAttribute('title', img_node.getAttribute('alt'));

			content.document.body.appendChild(img_node);

			function ImgDrag(node) {
				var IsMousedown,
					LEFT,
					TOP,
					img_node = node;
				img_node.onmousedown = function(e) {
					IsMousedown = true;
					e = e || event;
					LEFT = e.clientX - img_node.offsetLeft;
					TOP = e.clientY - img_node.offsetTop;
					return false;
				}

				content.document.addEventListener("mousemove", function(e) {
					e = e || event;
					if (IsMousedown) {
						img_node.style.left = e.clientX - LEFT + "px";
						img_node.style.top = e.clientY - TOP + "px";
					}
				}, false);

				content.document.addEventListener("mouseup", function() {
					IsMousedown = false;
				}, false);
			}
			ImgDrag(img_node);
			content.document.addEventListener('click', function(e) {
				if (img_node && e.button == 0 && e.target != img_node) {
					img_node.parentNode.removeChild(img_node);
					this.removeEventListener("click", arguments.callee, true);
				}
			}, true);
		},

		QRCommand: function(target_data, altText) {
			if (!this.checkLength(target_data)) return;
			var src = this.createQrcode(target_data);
			var alt = altText + ': ' + target_data;
			if (window.content)
				this.PopupImage(src, alt);
			else {
				var E10SFunc = this.PopupImage.toString().replace(/^function.*{|}$/g, "");
				gBrowser.selectedBrowser.messageManager.loadFrameScript("data:application/x-javascript;charset=UTF-8,(function(src, alt){" + escape(E10SFunc) + "})('" + src + "','" + alt + "');", true);
			}
		},

		optionsChangeLabel: function() {
			var url = window.content ? content.document.location : FeiRuoMouse.Content.document.location;
			var labelText;
			if (gContextMenu) {
				if (gContextMenu.isTextSelected) {
					labelText = "选区文本";
				} else if (gContextMenu.onLink) {
					labelText = "链接地址";
				} else if (gContextMenu.onImage) {
					labelText = "图象地址";
				} else if (url == "about:blank" || url == "about:newtab") {
					labelText = "手工输入";
				} else {
					labelText = "当前网址";
				}
				var currentEntry = $("FeiRuoMouse_QRCreator");
				if (currentEntry) {
					let LABELTEXT = "生成二维码 : " + labelText;
					currentEntry.setAttribute("label", LABELTEXT);
				}
			}
		},
	};

	FeiRuoMouse.TextLink = {
		init: function(event) {
			if (!event || event.button != 0) return;

			var Start = new Date().getTime();

			const RELATIVE = true; //相対urlを解決するかどうか
			const SELECTUTL = false; //urlらしき文字列を選択するかどうか

			const ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
			/*
			/(([\w-]+:\/\/?|[\w\d]+[.])?[^\s()<>]+[.](?:\([\w\d]+\)|([^`!()\[\]{};:'\".,<>?«»“”‘’\s]|\/)+))/
			*/
			const urlRegex = /(((h?t)?tps?|h..ps?|ftp|((\uff48)?\uff54)?\uff54\uff50(\uff53)?|\uff48..\uff50(\uff53)?|\uff46\uff54\uff50)(:\/\/|\uff1a\/\/|:\uff0f\uff0f|\uff1a\uff0f\uff0f)[-_.~*'()|a-zA-Z0-9;:\/?,@&=+$%#\uff0d\uff3f\u301c\uffe3\uff0e\uff01\uff5e\uff0a\u2019\uff08\uff09\uff5c\uff41-\uff5a\uff21-\uff3a\uff10-\uff19\uff1b\uff1a\uff0f\uff1f\uff1a\uff20\uff06\uff1d\uff0b\uff04\uff0c\uff05\uff03\uff5c\uff3b\uff3d]*[-_,.~*)\[\]|a-zA-Z0-9;!:\/?@&=+$%#\uff0d\uff3f\u301c\uffe3\uff0e\uff01\uff5e\uff0a\u2019\uff5c\uff41-\uff5a\uff21-\uff3a\uff10-\uff19\uff1b\uff1a\uff0f\uff1f\uff20\uff06\uff1d\uff0b\uff04\uff0c\uff05\uff03\uff5c\uff3b\uff3d]+)/ig;
			const urlRegex1 = /([-_.~*'()|a-zA-Z0-9;:\/?,@&=+$%#\uff0d\uff3f\u301c\uffe3\uff0e\uff01\uff5e\uff0a\u2019\uff08\uff09\uff5c\uff41-\uff5a\uff21-\uff3a\uff10-\uff19\uff1b\uff1a\uff0f\uff1f\uff20\uff06\uff1d\uff0b\uff04\uff0c\uff05\uff03\uff5c\uff3b\uff3d]*[.\uff0e]+[-_.~*'\[\]|a-zA-Z0-9;:\/?,@&=+$%#\uff0d\uff3f\u301c\uffe3\uff0e\uff01\uff5e\uff0a\u2019\uff08\uff09\uff5c\uff41-\uff5a\uff21-\uff3a\uff10-\uff19\uff1b\uff1a\uff0f\uff1f\uff1a\uff20\uff06\uff1d\uff0b\uff04\uff0c\uff05\uff03\uff5c]+[.\uff0e/\uff0f]*[-_,.~*\[\]|a-zA-Z0-9;!:\/?@&=+$%#\uff0d\uff3f\u301c\uffe3\uff0e\uff01\uff5e\uff0a\u2019\uff5c\uff41-\uff5a\uff21-\uff3a\uff10-\uff19\uff1b\uff1a\uff0f\uff1f\uff1a\uff20\uff06\uff1d\uff0b\uff04\uff0c\uff05\uff03\uff5c]+)/ig;
			const urlRx = /^(ttp|tp|h..p|\uff54\uff54\uff50|\uff54\uff50|\uff48..\uff50)/i;
			const urlRx1 = /(:\/\/|\uff1a\/\/|:\uff0f\uff0f|\uff1a\uff0f\uff0f)/i;
			const mailRx = /(^(mailto:|\uff4d\uff41\uff49\uff4c\uff54\uff4f\uff1a)(?:(?:(?:(?:[a-zA-Z0-9_#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*")))\@(?:(?:(?:(?:[a-zA-Z0-9_#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[\x21-\x5a\x5e-\x7e])*\])))$)/;
			const mailRx1 = /(^(?:(?:(?:(?:[a-zA-Z0-9_#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:"(?:\\[^\r\n]|[^\\"])*")))\@(?:(?:(?:(?:[a-zA-Z0-9_#\$\%&'*+/=?\^`{}~|\-]+)(?:\.(?:[a-zA-Z0-9_#\$\%&'*+/=?\^`{}~|\-]+))*)|(?:\[(?:\\\S|[\x21-\x5a\x5e-\x7e])*\])))$)/;

			//ドキュメントとコンテントタイプ
			var doc = event.originalTarget.ownerDocument;
			if (doc.contentType != 'text/plain' && doc.contentType != 'text/html' && doc.contentType != 'application/xml' && doc.contentType != 'application/xhtml+xml') return;

			//designModeなら何もしない
			if (doc.designMode == 'on') return;

			var win = doc.defaultView;
			if (!win) return;

			var str1, text, str2;

			//textarea かどうか
			var node = isParentEditableNode(document.commandDispatcher.focusedElement);
			if (!node) {
				// このif ブロックは textarea等以外の処理
				//ダブルクリックで選択された選択文字列のレンジを得る
				var selection = win.getSelection();
				var selRange;
				try {
					selRange = selection.getRangeAt(0);
				} catch (e) {
					selRange = selection;
				}
				if (!selRange) return;
				//レンジのノードなど
				text = selection.toString();
				if (text == '') return;
				//debug(text);
				var sNode = selRange.startContainer; //debug(sNode.localName);
				var soffset = selRange.startOffset;
				var eNode = selRange.endContainer; //debug(eNode.localName);
				var eoffset = selRange.endOffset;
				if (sNode != eNode) {
					eNode = sNode;
					eoffset = soffset + text.length - 1;
				}
				var sOyaNode = oyaNode(sNode);
				var eOyaNode = oyaNode(eNode);
				var root;
				if (sOyaNode == eOyaNode)
					root = sOyaNode;
				else
					root = doc;
				if (!root)
					return;
				//debug("sOyaNode " + sOyaNode.localName + " soffset " + soffset);
				//debug("eOyaNode " + eOyaNode.localName + " eoffset " + eoffset);

				//親ブロック要素の文字列をすべて得る
				const allowedParents = [
					"a", "abbr", "acronym", "address", "applet", "b", "bdo", "big", "blockquote", "body",
					"caption", "center", "cite", "code", "dd", "del", "dir", "div", "dfn", "dl", "dt", "em",
					"fieldset", "font", "form", "h1", "h2", "h3", "h4", "h5", "h6", "i", "iframe",
					"ins", "kdb", "li", "menu", "noframes", "noscript", "object", "ol", "p", "pre", "q", "samp", "small", "span", "strike",
					"s", "strong", "sub", "sup", "table", "td", "th", "thead", "tt", "u", "var"
				];
				var xpath = ".//text()[(parent::" + allowedParents.join(" or parent::") + ")]";

				var candidates = doc.evaluate(xpath, root, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				//debug("candidates.snapshotLength " + candidates.snapshotLength);
				//レンジより前にある文字列
				var i1 = -1;
				for (var i = i1 + 1, len = candidates.snapshotLength; i < len; i++) {
					if (candidates.snapshotItem(i) != sNode) continue;
					i1 = i - 1;
					break;
				}
				str1 = "";
				if (i >= 0) {
					for (var i = i1; i >= 0; i--) {
						if (sOyaNode == oyaNode(candidates.snapshotItem(i))) {
							if (candidates.snapshotItem(i).nextSibling &&
								/^br$/i.test(candidates.snapshotItem(i).nextSibling.localName)) {
								//debug(candidates.snapshotItem(i).nodeValue + "  " + candidates.snapshotItem(i).nextSibling.localName);
								break;
							}
							//debug("candidates.snapshotItem(i).parentNode.localName "+candidates.snapshotItem(i).parentNode.localName);
							if (/^a$/i.test(candidates.snapshotItem(i).parentNode.localName) &&
								candidates.snapshotItem(i).parentNode.hasAttribute("href"))
								break;
							str1 = candidates.snapshotItem(i).nodeValue + str1;
							//debug("str1 "+str1);
							if (/[ 　]/.test(str1))
								break;
						} else {
							break;
						}
					}
				}
				str2 = str1;
				if (sNode.nodeValue && soffset > 0) str1 = str1 + sNode.nodeValue.substr(0, soffset);

				//レンジより後ろにある文字列
				for (var i = i1 + 1, len = candidates.snapshotLength; i < len; i++) {
					if (sOyaNode == oyaNode(candidates.snapshotItem(i))) {
						str2 = str2 + candidates.snapshotItem(i).nodeValue;
						//debug(candidates.snapshotItem(i).nodeValue);
						if (i > i1 + 1 && /[ 　]/.test(candidates.snapshotItem(i).nodeValue))
							break;
					} else {
						break;
					}

					if (candidates.snapshotItem(i).nextSibling &&
						/^br$/i.test(candidates.snapshotItem(i).nextSibling.localName)) {
						break;
					}
					if (!candidates.snapshotItem(i).nextSibling &&
						candidates.snapshotItem(i).parentNode &&
						candidates.snapshotItem(i).parentNode.nextSibling &&
						/^br$/i.test(candidates.snapshotItem(i).parentNode.nextSibling.localName)) {
						break;
					}
				}

				str2 = str2.substr(str1.length + text.length);
			} else {
				// この elseブロックは textarea等の処理
				// readonlyでないなら何もしない
				if (!node.hasAttribute("readonly"))
					return;
				if (node &&
					(node.type == "text" || node.type == "textarea") &&
					'selectionStart' in node &&
					node.selectionStart != node.selectionEnd) {
					var offsetStart = Math.min(node.selectionStart, node.selectionEnd);
					var offsetEnd = Math.max(node.selectionStart, node.selectionEnd);
					str1 = node.value.substr(0, offsetStart);
					text = node.value.substr(offsetStart, offsetEnd - offsetStart);
					str2 = node.value.substr(offsetEnd);
				} else {
					return;
				}
			}
			//すべての文字列の中でのレンジの位置を得る
			var allStr = str1 + text + str2;
			var si = str1.length
			var ei = si + text.length;
			//全角括弧調整
			while (text.match(/^[\u3001\u3002\uff08\uff5b\uff3b\u300c\u3014\u3008\u300a\u300e\u3010\u2018\u201c\u201d\u2019\u226a\uff1c\uff09\uff5d\uff3d\u300d\u3015\u3009\u300b\u300f\u3011\u2018\u201c\u201d\u2019\u226b\uff1e]/)) {
				si = si + 1;
				text = text.substr(1);
			}
			while (text.match(/[\s\u3001\u3002\uff08\uff5b\uff3b\u300c\u3014\u3008\u300a\u300e\u3010\u2018\u201c\u201d\u2019\u226a\uff1c\uff09\uff5d\uff3d\u300d\u3015\u3009\u300b\u300f\u3011\u2018\u201c\u201d\u2019\u226b\uff1e]$/)) {
				ei = ei - 1;
				text = text.substr(0, text.length - 1);
			}
			//文末の.は無いことに
			allStr = allStr.replace(/\.$/, '');

			//debug("2 " + str2);
			//debug("Str " + text);
			//debug("1 " + str1);
			//debug("all " + allStr);

			//すべての文字列の中でURLと思しき文字列を配列として得る
			var i1, i2;
			var arrUrl = allStr.match(urlRegex);
			if (arrUrl) {
				//見つかったURLと思しき文字列の中にレンジが含まれているかどうか
				i2 = 0;
				for (var i = 0, len = arrUrl.length; i < len; i++) {
					//debug(i + "] " + arrUrl[i]);
					i1 = allStr.indexOf(arrUrl[i], i2);
					i2 = i1 + arrUrl[i].length;
					//debug(i1 <= si && ei <= i2);
					if (i1 <= si && ei <= i2) {
						//debug(arrUrl[i]);
						//このURLと思しき文字列の中にレンジが含まれていたので,これをURLとして新しいタブで開きましょう
						var url = arrUrl[i];
						url = additionalFixUpURL(url);
						if (SELECTUTL)
							var URLRange = getURLRange(selRange, url)

						// ttp等を http等に および  :// を 半角に
						url = /^(ftp|\uff46\uff54\uff50)/i.test(url) ? url.replace(urlRx1, '://') : url.replace(urlRx, 'http').replace(urlRx1, '://');
						if (/,$|，$|，$|，$|．$|。$|。$/.test(url))
							url = url.replace(/,$|，$|，$|，$|．$|。$|。$/, "");
						var URIFixup = Components.classes['@mozilla.org/docshell/urifixup;1']
							.getService(Components.interfaces.nsIURIFixup);
						var uri = URIFixup.createFixupURI(
							url,
							URIFixup.FIXUP_FLAG_ALLOW_KEYWORD_LOOKUP);
						if (!uri) return;
						if (!isValidTld(uri))
							return;
						uri = ioService.newURI(uri.spec, null, null);
						//debug('Parsing ucjs_textlink: '+((new Date()).getTime()-Start) +'msec\n');
						if (SELECTUTL)
							selectRange(URLRange);
						textlink(event, doc, uri);
						return;
					}
				}
			}
			if (!RELATIVE) return;
			//すべての文字列の中で相対URLと思しき文字列を配列として得る
			arrUrl = allStr.match(urlRegex1);
			if (!arrUrl) return;
			i2 = 0;
			for (var i = 0, len = arrUrl.length; i < len; i++) {
				//debug("Relative " + arrUrl[i]);
				i1 = allStr.indexOf(arrUrl[i], i2);
				i2 = i1 + arrUrl[i].length;

				//debug(i1 +" "+ si +" "+ ei +" "+ i2);
				if (i1 <= si && ei <= i2) {
					// .hoge とか ..huga はスキップ
					if (/^\./.test(arrUrl[i]) && !/^[\.]+[/]/.test(arrUrl[i]))
						return;
					//debug(arrUrl[i]);
					//このURLと思しき文字列の中にレンジが含まれていたので,これをURLとして新しいタブで開きましょう
					var url = arrUrl[i];
					url = additionalFixUpURL(url);
					if (SELECTUTL)
						var URLRange = getURLRange(selRange, url)

					// host名が ftp で始まるなら ftp://に
					if (/^ftp/.test(url)) {
						url = "ftp://" + url;
					}
					// host名が irc で始まるなら irc:に
					if (/^irc/.test(url)) {
						url = "irc://" + url;
					}
					//メール?
					if (mailRx1.test(url)) {
						url = "mailto:" + url;
					}
					//相対パスの処理
					if (url.match(/^\.{1,}/)) {
						var baseURI = ioService.newURI(win.document.documentURI, null, null);
						url = ioService.newURI(url, null, baseURI).spec;
					}
					if (/,$|，$|，$|，$|．$|。$|。$/.test(url))
						url = url.replace(/,$|，$|，$|，$|．$|。$|。$/, "");
					//debug(url.indexOf(url.match(urlRegex)));
					if (!mailRx.test(url) && url.indexOf(url.match(urlRegex)) > 1) return;
					var URIFixup = Components.classes['@mozilla.org/docshell/urifixup;1']
						.getService(Components.interfaces.nsIURIFixup);
					try {
						//debug(url);
						var uri = URIFixup.createFixupURI(
							url,
							URIFixup.FIXUP_FLAG_NONE); //FIXUP_FLAG_ALLOW_KEYWORD_LOOKUP→FIXUP_FLAG_NONE
					} catch (e) {
						return;
					}
					if (!uri) return;

					if (!isValidTld(uri)) {
						return;
					}
					//debug('Parsing ucjs_textlink: ' + url);
					if (SELECTUTL)
						selectRange(URLRange);

					uri = ioService.newURI(uri.spec, null, null);
					//debug('Parsing ucjs_textlink: '+((new Date()).getTime()-Start) +'msec\n'+uri.spec);
					textlink(event, doc, uri);
					return;
				}
			}

			function additionalFixUpURL(url) {
				// ad hoc fix up
				// ~等 を半角に
				url = url.replace(/\u301c/g, '\uff5e');
				url = url.replace(/\uffe3/g, '\uff5e');

				// 末尾の )や] の調整
				if (/^[:\uff1a;\uff1b,\uff0c]/.test(url)) {
					url = url.replace(/^[:\uff1a;\uff1b,\uff0c]/, '');
				}
				if (/[:\uff1a]$/.test(url)) {
					url = url.replace(/[:\uff1a]$/, '');
				}
				if (/[.,]$/.test(url)) {
					url = url.replace(/[.,]$/, '');
				}

				if (/\)$/.test(url)) {
					if (url.indexOf("(") == -1)
						url = url.replace(/\)$/, '');
				}
				/*
				if (/\]$/.test(url)) {
				  if (url.indexOf("[") == -1)
				    url = url.replace(/\]$/,'');
				}
				*/
				return url;
			}

			function activeBrowser() {
				return ('SplitBrowser' in window ? SplitBrowser.activeBrowser : null) || gBrowser;
			}

			function _getFocusedWindow() { //現在のウインドウを得る
				var focusedWindow = document.commandDispatcher.focusedWindow;
				if (!focusedWindow || focusedWindow == window)
					return window._content;
				else
					return focusedWindow;
			}

			//レンジの要素が所属する親ブロック要素を得る
			function oyaNode(aNode) {
				var pNode = aNode.parentNode;
				while (pNode && /^(a|abbr|acronym|b|bdo|big|body|code|dfn|em|font|i|kbd|label|pre|q|samp|small|span|strong|sub|sup|tt|var|wbr)$/i.test(pNode.localName)) {
					pNode = pNode.parentNode;
				}
				return pNode;
			}

			function isParentEditableNode(node) {
				//if (node.ownerDocument.designMode == 'on')
				//  return node;
				while (node && node.parentNode) {
					try {
						if (!(node instanceof Ci.nsIDOMNSEditableElement))
							throw 0;
						node.QueryInterface(Ci.nsIDOMNSEditableElement);
						return node;
					} catch (e) {}
					if (/input|textarea/.test(node.localName))
						return node;
					if (node.isContentEditable || node.contentEditable == 'true')
						return node;
					node = node.parentNode;
				}
				return null;
			}

			function isValidTld(aURI) {
				const regexpTLD = new RegExp("\\.(arpa|asia|int|nato|cat|com|net|org|info|biz|name|pro|mobi|museum|coop|aero|edu|gov|jobs|mil|tel|travel|xxx|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bu|bv|bw|by|bz|ca|canon|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cp|cr|cs|sk|cu|cv|cx|cy|cz|dd|de|dg|dj|dk|dm|do|dz|ea|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|fx|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|ic|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|me|md|mg|mh|mk|ml|mm|mn|mo|moe|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nagoya|nc|ne|nf|ng|ni|nl|no|np|nr|nt|nu|nz|om|osaka|pa|pc|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sy|sz|ta|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tokyo|toyota|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|wg|ws|yd|ye|yokohama|yt|yu|za|zm|zr|zw|localhost)\\.?$", "");
				const regexpIP = new RegExp("^[1-2]?[0-9]?[0-9]\\.[1-2]?[0-9]?[0-9]\\.[1-2]?[0-9]?[0-9]\\.[1-2]?[0-9]?[0-9]$", "");
				const idnService = Components.classes["@mozilla.org/network/idn-service;1"]
					.getService(Components.interfaces.nsIIDNService);
				var host, tlds;
				try {
					host = aURI.host.split('/')[0];
					host = idnService.convertUTF8toACE(host);
				} catch (e) {
					if (aURI.spec.match(/^(.+?\/\/(?:[^\/]+@)?)([^\/]+)(:\d+)?(?:.*)$/)) {
						host = RegExp.$2;
					} else if (aURI.spec.match(/^(mailto:(?:[^\/]+@)?)([^\/]+)(:\d+)?(?:.*)$/)) {
						host = RegExp.$2;
					}
				}
				//debug("host  " + host);
				if (!host)
					return false;
				if (getVer() < 3.0) {
					if (regexpTLD.test(host))
						return true;
					else
						return (regexpIP.test(host));
				} else {
					var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"]
						.getService(Components.interfaces.nsIEffectiveTLDService);
					try {
						var tld = eTLDService.getPublicSuffixFromHost(host);
						return regexpTLD.test('.' + tld);
					} catch (e) {
						return (regexpIP.test(host));
					}
				}
			}

			function textlink(event, doc, uri) {
				if ("autoCopy" in window) {
					autoCopy.forceDisable = true;
					setTimeout(function() {
						autoCopy.forceDisable = false;
					}, 1500);
				}
				try {
					if (event.shiftKey)
						saveAsURL(uri, doc);
					else
						openNewTab(uri, doc);
				} catch (e) {}
				closeContextMenu();
			}

			function saveAsURL(uri, doc) {
				var linkText = uri.spec;
				var aReferrer = doc;
				if (aReferrer instanceof HTMLDocument) {
					aReferrer = aReferrer.documentURIObject;
				}
				//Thunderbird
				if (/^chrome:\/\/messenger\/content\//.test(window.location.href)) {
					// URL Loading Security Check
					const nsIScriptSecurityManager = Components.interfaces.nsIScriptSecurityManager;
					var secMan = Components.classes["@mozilla.org/scriptsecuritymanager;1"]
						.getService(nsIScriptSecurityManager);
					try {
						if (uri instanceof Components.interfaces.nsIURI)
							secMan.checkLoadURIWithPrincipal(doc.nodePrincipal, uri, nsIScriptSecurityManager.STANDARD);
						else
							secMan.checkLoadURIStrWithPrincipal(doc.nodePrincipal, uri, nsIScriptSecurityManager.STANDARD);
					} catch (e) {
						throw "Load denied.";
					}
					saveURL(uri.spec, linkText, null, true, false, aReferrer, doc);
					return;
				}

				// urlSecurityCheck wanted a URL-as-string for Fx 2.0, but an nsIPrincipal on trunk
				if (activeBrowser().contentPrincipal)
					urlSecurityCheck(uri.spec, activeBrowser().contentPrincipal, Ci.nsIScriptSecurityManager.DISALLOW_INHERIT_PRINCIPAL);
				else
					urlSecurityCheck(uri.spec, activeBrowser().currentURI.spec, Ci.nsIScriptSecurityManager.DISALLOW_SCRIPT);

				saveURL(uri.spec, linkText, null, true, false, aReferrer, doc);
			}

			function openNewTab(uri, doc) {
				//Thunderbird
				if (/^chrome:\/\/messenger\/content\//.test(window.location.href)) {
					// Make sure we are allowed to open this URL
					// URL Loading Security Check
					const nsIScriptSecurityManager = Components.interfaces.nsIScriptSecurityManager;
					var secMan = Components.classes["@mozilla.org/scriptsecuritymanager;1"]
						.getService(nsIScriptSecurityManager);
					try {
						if (uri instanceof Components.interfaces.nsIURI)
							secMan.checkLoadURIWithPrincipal(doc.nodePrincipal, uri, nsIScriptSecurityManager.STANDARD);
						else
							secMan.checkLoadURIStrWithPrincipal(doc.nodePrincipal, uri, nsIScriptSecurityManager.STANDARD);
					} catch (e) {
						throw "Load denied.";
					}
					var protocolSvc = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"]
						.getService(Components.interfaces.nsIExternalProtocolService);
					protocolSvc.loadUrl(uri);
					return;
				}

				// urlSecurityCheck wanted a URL-as-string for Fx 2.0, but an nsIPrincipal on trunk
				if (activeBrowser().contentPrincipal)
					urlSecurityCheck(uri.spec, activeBrowser().contentPrincipal, Ci.nsIScriptSecurityManager.DISALLOW_INHERIT_PRINCIPAL);
				else
					urlSecurityCheck(uri.spec, activeBrowser().currentURI.spec, Ci.nsIScriptSecurityManager.DISALLOW_SCRIPT);
				if ((event.ctrlKey)) {
					openLinkIn(uri.spec, "current", {});
				} else {
					if ('TreeStyleTabService' in window)
						TreeStyleTabService.readyToOpenChildTab(activeBrowser().selectedTab);
					openLinkIn(uri.spec, "tab", {
						relatedToCurrent: true
					});
					//openNewTabWith(uri.spec, null,  null, null, false)
				}
			}

			function closeContextMenu() {
				var popup = document.getElementById("contentAreaContextMenu");
				if (popup)
					popup.hidePopup();
			}

			function getURLRange(selRange, url) {
				//レンジのノードなど
				var doc = selRange.startContainer.ownerDocument
				var bodyNode = getDocumentBody(doc);
				if (!bodyNode) return;

				//nsIFindげと
				var mFind = Components.classes["@mozilla.org/embedcomp/rangefind;1"]
					.createInstance(Components.interfaces.nsIFind);

				//Rangeげと
				var theRange = doc.createRange();
				var start = doc.createRange();
				var end = doc.createRange();

				try {
					var count = bodyNode.childNodes.length;
				} catch (e) {
					var count = 0;
				}
				theRange.setStart(bodyNode, 0);
				theRange.setEnd(bodyNode, count);

				start.setStart(bodyNode, 0);
				start.setEnd(bodyNode, 0);
				end.setStart(bodyNode, count);
				end.setEnd(bodyNode, count);

				var selRangeBox = selRange.getBoundingClientRect();
				mFind.caseSensitive = false;
				while ((foundRange = mFind.Find(url, theRange, start, end))) {
					//検索range更新
					start = doc.createRange();
					start.setStart(foundRange.endContainer, foundRange.endOffset);
					start.collapse(true);

					//debug("loop 1");
					// selRange 始点が foundRange の始点よりも前
					if (selRange.compareBoundaryPoints(Range.START_TO_START, foundRange) == -1)
						continue;
					// selRangeの終点がfoundRangeの終点より後ろにある場合
					//if (foundRange.compareBoundaryPoints(Range.END_TO_END, selRange) == -1)
					// xxx selRangeの次がbrの時endContainerが先祖の要素になるので...
					var foundRangeBox = foundRange.getBoundingClientRect();
					if (selRangeBox.right > foundRangeBox.right ||
						selRangeBox.top < foundRangeBox.top ||
						selRangeBox.bottom > foundRangeBox.bottom)
						continue;
					return foundRange;
				}
				return null;
			}

			function getDocumentBody(aDocument) {
				if (aDocument instanceof Components.interfaces.nsIDOMHTMLDocument)
					return aDocument.body;

				try {
					var xpathResult = aDocument.evaluate(
						'descendant::*[contains(" BODY body ", concat(" ", local-name(), " "))]',
						aDocument,
						null,
						Components.interfaces.nsIDOMXPathResult.FIRST_ORDERED_NODE_TYPE,
						null
					);
					return xpathResult.singleNodeValue;
				} catch (e) {}
				return null;
			}

			function selectRange(aRange) {
				if (!aRange)
					return;

				var doc = aRange.startContainer.ownerDocument;
				var elm = findParentEditable(aRange);

				var selCon = getSelectionController(elm);
				if (!selCon) selCon = getSelconForDoc(doc);
				var selection = selCon.getSelection(selCon.SELECTION_NORMAL);
				selection.removeAllRanges(); //既存の選択領域を取得し、全て破棄
				selection.addRange(aRange);
			}

			//レンジは編集可能ノードにある?
			function findParentEditable(aRange) {
				var node = aRange.commonAncestorContainer.parentNode;
				while (node && node.parentNode) {
					try {
						if (!(node instanceof Components.interfaces.nsIDOMNSEditableElement))
							throw 0;
						node.QueryInterface(Components.interfaces.nsIDOMNSEditableElement);
						return node;
					} catch (e) {}
					node = node.parentNode;
				}
				return null;
			}

			function getSelectionController(aTarget) {
				if (!aTarget) return null;

				const nsIDOMNSEditableElement = Components.interfaces.nsIDOMNSEditableElement;
				const nsIDOMWindow = Components.interfaces.nsIDOMWindow;
				try {
					return (aTarget instanceof nsIDOMNSEditableElement) ?
						aTarget.QueryInterface(nsIDOMNSEditableElement).editor.selectionController :
						(aTarget instanceof nsIDOMWindow) ?
						DocShellIterator.prototype.getDocShellFromFrame(aTarget)
						.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
						.getInterface(Components.interfaces.nsISelectionDisplay)
						.QueryInterface(Components.interfaces.nsISelectionController) :
						null;
				} catch (e) {}
				return null;
			}

			function getSelconForDoc(doc) {
				var docShell = getDocShellForFrame(doc.defaultView);
				var selCon = docShell
					.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
					.getInterface(Components.interfaces.nsISelectionDisplay)
					.QueryInterface(Components.interfaces.nsISelectionController);
				return selCon;
			}

			function getDocShellForFrame(aFrame) {
				return aFrame
					.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
					.getInterface(Components.interfaces.nsIWebNavigation)
					.QueryInterface(Components.interfaces.nsIDocShell);
			}

			function getVer() {
				const Cc = Components.classes;
				const Ci = Components.interfaces;
				var info = Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo);
				// このコードを実行しているアプリケーションの名前を取得する
				var ver = parseInt(info.version.substr(0, 3) * 10, 10) / 10;
				return ver;
			}
		},
	};

	FeiRuoMouse.DragScript = {
		Text: function(e) {
			return e.dataTransfer.getData("text/unicode");
		},

		Url: function(e) {
			return e.dataTransfer.getData("application/x-moz-file-promise-url")
		},

		Url2: function(e) {
			return e.dataTransfer.getData("text/x-moz-url").split("\n")[0]
		},

		SeeAsURL: function(url) {
			var DomainName = /(\w+(\-+\w+)*\.)+\w{2,7}/i;
			var HasSpace = /\S\s+\S/;
			var KnowNameOrSlash = /^(www|bbs|forum|blog)|\//i;
			var KnowTopDomain1 = /\.(com|net|org|gov|edu|info|mobi|mil|asia)$/i;
			var KnowTopDomain2 = /\.(de|uk|eu|nl|it|cn|be|us|br|jp|ch|fr|at|se|es|cz|pt|ca|ru|hk|tw|pl|me|tv|cc)$/i;
			var IsIpAddress = /^([1-2]?\d?\d\.){3}[1-2]?\d?\d/;
			var seemAsURL = !HasSpace.test(url) && DomainName.test(url) && (KnowNameOrSlash.test(url) || KnowTopDomain1.test(url) || KnowTopDomain2.test(url) || IsIpAddress.test(url));
			return seemAsURL;
		},
	};

	FeiRuoMouse.OptionScript = {
		Rules: [],
		ruleOption: [{
			name: 'Enable',
			default: '1'
		}, {
			name: 'Command',
			default: ''
		}, {
			name: 'Action',
			default: ''
		}, {
			name: 'Type',
			default: ''
		}, {
			name: 'Key',
			default: ''
		}, {
			name: 'TKey',
			default: ''
		}],

		init: function() {
			var checkboximg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAaCAYAAABsONZfAAABD0lEQVQ4je2TMa5FQBSGrUIURiURhVJH3BXYgg1IprYGHa1FCGtheslf0UgkFMZ51ZUn3rvkJvdVr/iLKb4z55z5Ronj+ME5p7uJ4/ihcM5pmiYQ0a9ZlgVEhGmawDknhXNOr4BxHBFFEYQQIKJraBgG+L4PxhjSNIWU8git6woiwrZteJ7DMISqqsiybC90gNq2RV3XO1gUBRhjSJJkL3SCgiCAYRioqgp938OyLLiui3meDy0foKZp4DgOGGPwPA+6rqMsy9Ocp0U0TQPbtqFpGhhj+5wvISKCEAKmaSLPc0gp70FSSggh0HXdj8+wQ1dGPLMb8ZZ7HxP21N6VsLe29w+9C33/bJ+56U+E/QKpA0b/pEOBQAAAAABJRU5ErkJggg==";

			var cssStr = ('\
					treechildren::-moz-tree-checkbox(unchecked){\
						list-style-image: url(' + checkboximg + ');\
						-moz-image-region: rect(13px 13px 26px 0px);\
					}\
					treechildren::-moz-tree-checkbox(checked){\
						list-style-image: url(' + checkboximg + ');\
						-moz-image-region: rect(0px 13px 13px 0px);\
					}\
					');
			var doc = FeiRuoMouse.getWindow(0).document;
			var style = doc.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
			doc.insertBefore(style, doc.documentElement);

			this.TreeResets("TreeList0");
			this.TreeResets("TreeList1");
			this.TreeCreate("TreeList0", FeiRuoMouse.DragCustom);
			this.TreeCreate("TreeList1", FeiRuoMouse.GesCustom);

			this.ChangeStatus();
		},

		ChangeStatus: function() {},

		Resets: function() {
			this.TreeResets("TreeList0");
			this.TreeResets("TreeList1");
			_$("TextLink").value = false;
			_$("QRCreator").value = false;
			this.ChangeStatus();
		},

		Save: function() {
			FeiRuoMouse.Prefs.setBoolPref("TextLink", _$("TextLink").value);
			FeiRuoMouse.Prefs.setBoolPref("QRCreator", _$("QRCreator").value);
			this.TreeSave("TreeList0", "DragCustom");
			this.TreeSave("TreeList1", "GesCustom");
		},

		/******************************************************************/
		TreeResets: function(listName) {
			while (_$(listName).hasChildNodes()) {
				_$(listName).removeChild(_$(listName).lastChild);
			}
		},

		TreeCreate: function(listName, val) {
			if (!val) return;
			val = val.split(";;");
			if (!val[0]) return;
			for (var i = 0; i < val.length; i++) {
				this.createTreeitem(listName, this.str2Obj(val[i]));
			}
		},

		TreeSave: function(listName, Prefs) {
			var Rules = [];
			var list = _$(listName);
			//if (!list.hasChildNodes()) return;
			for (var i = 0; i < list.childNodes.length; i++) {
				var rule = this.getTreeitem(list.childNodes[i]);
				rule.Command = escape(rule.Command);
				Rules.push(rule);
			}
			var objArr = [];
			for (var i in Rules) {
				var currentObj = this.obj2Str(Rules[i]);
				objArr.push(currentObj);
			}
			var Custom = objArr.join(";;");
			if (!FeiRuoMouse.Prefs.prefHasUserValue(Prefs) || FeiRuoMouse.Prefs.getPrefType(Prefs) != Ci.nsIPrefBranch.PREF_STRING)
				FeiRuoMouse.Prefs.setCharPref(Prefs, "");
			FeiRuoMouse.Prefs.setCharPref(Prefs, Custom);
		},

		/******************************************************************/
		str2Obj: function(str) {
			var tempArr = str.split("|");
			var ret = {};
			var i = 0;
			var tempStr = '';
			for (var k = 0; k < this.ruleOption.length; k++) {
				var o = this.ruleOption[k];
				if (i < tempArr.length) {
					tempStr = tempArr[i];
					i = i + 1;
				} else {
					tempStr = o.default;
				}
				ret[o.name] = tempStr;
			}
			return ret;
		},

		obj2Str: function(myArr) {
			var tempArr = [];
			for (var k = 0; k < this.ruleOption.length; k++) {
				var o = this.ruleOption[k];
				var tempStr = (myArr[o.name] == undefined) ? o.default : myArr[o.name];
				tempArr.push(tempStr);
			}
			return tempArr.join("|");
		},

		/******************************************************************/
		createTreeitem: function(listName, params) {
			var treecell1 = _$C("treecell");
			var treecell2 = _$C("treecell");
			var treecell3 = _$C("treecell");
			var treecell4 = _$C("treecell");
			var treecell5 = _$C("treecell");
			var treecell6 = _$C("treecell");
			var treerow = _$C("treerow");
			treerow.appendChild(treecell1);
			treerow.appendChild(treecell2);
			treerow.appendChild(treecell3);
			treerow.appendChild(treecell4);
			treerow.appendChild(treecell5);
			treerow.appendChild(treecell6);
			var treeitem = _$C("treeitem");
			treeitem.setAttribute("container", "false");
			treeitem.appendChild(treerow);
			params.groupid = listName;
			this.setTreeitem(treeitem, params);
			_$(listName).appendChild(treeitem);
		},

		setCheckbox: function(treeitem, checked) {
			if (this.isGroup(treeitem) == "true") {
				return;
			}
			var checkboxCell = treeitem.firstChild.childNodes[5];
			var currentValue = checkboxCell.getAttribute("value");
			var newValue = "";
			if (checked == "reverse") {
				if (currentValue == null || currentValue == "0") {
					newValue = "1";
				} else if (currentValue == "1") {
					newValue = "0";
				} else {
					return;
				}
			} else {
				newValue = checked;
			}

			checkboxCell.setAttribute("value", newValue);
			if (newValue == "1") {
				checkboxCell.setAttribute("properties", "checked");
			} else if (newValue == "0") {
				checkboxCell.setAttribute("properties", "unchecked");
			}
		},

		ActionLabel: function(str) {
			if (str == "ANY")
				return "任意";
			var label = [];
			for (var i in str) {
				if (str[i] == "U")
					label.push("↑");
				else if (str[i] == "D")
					label.push("↓");
				else if (str[i] == "L")
					label.push("←");
				else if (str[i] == "R")
					label.push("→");
				else
					label.push(str[i]);
			}
			return label.join("");
		},

		setTreeitem: function(treeitem, params) {
			with(treeitem.firstChild) {
				childNodes[0].setAttribute("label", params["Command"]);
				childNodes[0].setAttribute("Command", params["Command"]);

				childNodes[1].setAttribute("label", this.ActionLabel(params["Action"]));
				childNodes[1].setAttribute("Action", params["Action"]);
				var type = params["Type"];
				if (type != "")
					type = params["Type"] == "Image" ? "图片" : (params["Type"] == "Url" ? "链接" : "文字");

				childNodes[2].setAttribute("label", type);
				childNodes[2].setAttribute("Type", params["Type"]);

				childNodes[3].setAttribute("label", params["Key"]);
				childNodes[3].setAttribute("Key", params["Key"]);

				childNodes[4].setAttribute("label", params["TKey"] == "1" ? "排除" : !params["Key"] ? "" : "辅助");
				childNodes[4].setAttribute("TKey", params["TKey"]);

				this.setCheckbox(treeitem, params["Enable"]);
				setAttribute("groupid", params["groupid"]);

			}
		},

		/******************************************************************/
		getGroup: function(treeItem) {
			with(treeItem) {
				var treerow = childNodes[0];
				var treechildren = childNodes[1];
				var treecell = treerow.childNodes[0];
				return {
					id: treechildren.getAttribute("id"),
					des: treecell.getAttribute("label"),
					open: getAttribute("open")
				};
			}
		},

		/******************************************************************/
		isGroup: function(treeitem) {
			if (treeitem == null) return null;
			return treeitem.getAttribute("container");
		},

		getEventRow: function(event) {
			var row = {};
			var col = {};
			var obj = {};
			_$("ruleTree").treeBoxObject.getCellAt(event.clientX, event.clientY, row, col, obj);
			if (col.value == null || row.value == null || obj.value == null)
				return null;
			else
				return row.value;
		},

		getTreeitem: function(treeitem) {
			with(treeitem.firstChild) {
				return {
					Command: childNodes[0].getAttribute("Command"),
					Action: childNodes[1].getAttribute("Action"),
					Type: childNodes[2].getAttribute("Type"),
					Key: childNodes[3].getAttribute("Key"),
					TKey: childNodes[4].getAttribute("TKey"),
					Enable: childNodes[5].getAttribute("value"),
					groupid: getAttribute("groupid")
				}
			}
		},

		/******************************************************************/
		onTreeclick: function(event) {
			with(_$("ruleTree")) {
				if (event.button != 0) return;

				var row = {};
				var col = {};
				var obj = {};
				treeBoxObject.getCellAt(event.clientX, event.clientY, row, col, obj);

				if (col.value == null || row.value == null || obj.value == null) return;
				if (col.value.type == Ci.nsITreeColumn.TYPE_CHECKBOX) {
					var treeitem = view.getItemAtIndex(row.value);
					if (treeitem != null) {
						this.setCheckbox(treeitem, "reverse");
					}
				}
			}
		},

		onTreedblclick: function(event) {
			if (event.button != 0) return;
			if (this.getEventRow(event) == null) return;
			var treeitem = _$("ruleTree").view.getItemAtIndex(_$("ruleTree").currentIndex);
			this.jumptoDetailWindow(treeitem);
		},

		jumptoDetailWindow: function(treeitem) {
			if (this.isGroup(treeitem) == "true") return;
			var params = {};
			if (treeitem == null) {
				params = {
					Enable: "1",
					Command: "",
					Action: "",
					Type: "",
					Key: "",
					TKey: "",
					changed: "",
					groupid: params["groupid"]
				};
			} else {
				params = this.getTreeitem(treeitem);
			}
			var retParams = {
				Enable: params["Enable"],
				Command: "",
				Action: "",
				Type: "",
				Key: "",
				TKey: "",
				changed: "",
				groupid: params["groupid"]
			};
			this.OpenWindow(params, retParams);

			if (retParams["changed"] != "") {
				if (treeitem == null) {
					this.createTreeitem(retParams.groupid, retParams);
				} else {
					this.setTreeitem(treeitem, retParams);
				}
			}
		},

		/******************************************************************/
		OpenWindow: function(params, retParams) {
			var win = "FeiRuoMouse:DetailWindow";
			var thisWindow = FeiRuoMouse.getWindow(1);
			if (thisWindow) {
				thisWindow.focus();
			} else {
				var detaill = FeiRuoMouse.DetaillWin();
				thisWindow = window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + detaill, win, "modal, chrome=yes,centerscreen", params, retParams);
			}
			return thisWindow;
		},

		/******************************************************************/
		onDragstart: function(event) {
			var row = this.getEventRow(event);
			if (row == null) return false;
			var treeitem = _$("ruleTree").view.getItemAtIndex(row);
			if (!this.canMove(treeitem, "from")) return false;
			var dt = event.dataTransfer;
			dt.setData('FeiRuoMouse/row', row);
			dt.setData('FeiRuoMouse/isGroup', this.isGroup(treeitem));
		},

		onDragover: function(event) {
			var row = this.getEventRow(event);
			if (row == null) return;
			var treeitem = _$("ruleTree").view.getItemAtIndex(row);
			if (!this.canMove(treeitem, "to")) return;
			if (event.dataTransfer.getData("FeiRuoMouse/isGroup") == "true" && this.isGroup(treeitem) != "true") return;
			event.preventDefault();
		},

		canMove: function(treeitem, fromTo) {
			var groupid = "";
			if (this.isGroup(treeitem) == "true") {
				var group = this.getGroup(treeitem);
				groupid = group.id;
				if (groupid == "customList" && fromTo == "from") return false;
			} else {
				var item = this.getTreeitem(treeitem);
				groupid = item.groupid;
			}
			if (groupid == "" || groupid == "defaultList") return false;
			else return true;
		},

		onDrop: function(event) {
			var dtRow = event.dataTransfer.getData('FeiRuoMouse/row');
			var dtIsGroup = event.dataTransfer.getData('FeiRuoMouse/isGroup');

			var row = this.getEventRow(event);
			if (row == null) return;
			if (row == dtRow) return;

			var pTreeitem = _$("ruleTree").view.getItemAtIndex(row);
			var treeitem = _$("ruleTree").view.getItemAtIndex(dtRow);

			if (dtIsGroup == "true") {
				if (this.isGroup(pTreeitem) == "true") {
					this.moveGroupBeforeGroup(treeitem, pTreeitem);
				}
			} else {
				if (this.isGroup(pTreeitem) == "true") {
					var group = this.getGroup(pTreeitem);
					this.moveItemToGroup(treeitem, group.id);
				} else {
					this.moveItemBeforeItem(treeitem, pTreeitem);
				}
			}
		},

		moveItemBeforeItem: function(treeitem, pTreeitem) {
			var item = this.getTreeitem(pTreeitem);
			treeitem.parentNode.removeChild(treeitem);
			pTreeitem.parentNode.insertBefore(treeitem, pTreeitem);
		},

		moveGroupBeforeGroup: function(group, pGroup) {
			group.parentNode.removeChild(group);
			pGroup.parentNode.insertBefore(group, pGroup);
		},

		moveItemToGroup: function(treeitem, groupid) {
			treeitem.parentNode.removeChild(treeitem);
			this.setItemAttr(treeitem, "groupid", groupid);
			document.getElementById(groupid).appendChild(treeitem);
		},

		setItemAttr: function(treeitem, key, value) {
			with(treeitem.firstChild) {
				if (key == "groupid") {
					setAttribute("groupid", value);
				}
			}
		},

		/******************************************************************/
		onNewButtonClick: function() {
			with(_$("ruleTree")) {
				var idx = currentIndex;
				var parentId = "TreeList0";
				if (idx >= 0) {
					var treeitem = view.getItemAtIndex(idx);
					if (this.isGroup(treeitem) == "true") {
						var group = this.getGroup(treeitem);
						if (group.id) parentId = group.id;
					} else {
						var rule = this.getTreeitem(treeitem);
						if (rule.groupid) parentId = rule.groupid;
					}
				}
				this.jumptoDetailWindow(null, parentId);
			}
		},

		onEditButtonClick: function() {
			this.editRuleList("edit");
		},

		onDeleteButtonClick: function() {
			this.editRuleList("delete");
		},

		editRuleList: function(mode) {
			with(_$("ruleTree")) {
				var idx = currentIndex;
				if (idx < 0) {
					return;
				}
				var treeitem = view.getItemAtIndex(idx);
				if (mode == "edit") {
					this.jumptoDetailWindow(treeitem);
				} else if (mode == "delete") {
					treeitem.parentNode.removeChild(treeitem);
					view.selection.select(idx);
				}
				treeBoxObject.ensureRowIsVisible(currentIndex);
			}
			this.ChangeStatus();
		},
	};

	FeiRuoMouse.OptionWin = function() {
		var xul = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
					<prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
					id="FeiRuoMouse_Settings"\
					ignorekeys="true"\
					title="FeiRuoMouse 设置"\
					onload="opener.FeiRuoMouse.OptionScript.init();"\
					onunload="opener.FeiRuoMouse.UpdateFile(true);"\
					buttons="accept,cancel,extra1,extra2"\
					ondialogextra1="opener.FeiRuoMouse.OptionScript.Resets();"\
					ondialogextra2="opener.FeiRuoMouse.Edit();"\
					ondialogaccept="opener.FeiRuoMouse.OptionScript.Save();"\
					windowtype="FeiRuoMouse:Preferences">\
					<prefpane id="main" flex="1">\
						<preferences>\
							<preference id="TextLink" type="bool" name="userChromeJS.FeiRuoMouse.TextLink"/>\
							<preference id="QRCreator" type="bool" name="userChromeJS.FeiRuoMouse.QRCreator"/>\
						</preferences>\
						<script>\
							function Change() {\
								opener.FeiRuoMouse.OptionScript.changeStatus();\
							}\
						</script>\
						<tabbox class="text">\
							<tabs>\
								<tab label="一般选项"/>\
								<tab label="拖拽/手势 规则"/>\
							</tabs>\
							<tabpanels flex="1">\
								<tabpanel orient="vertical" flex="1">\
									<groupbox>\
											<checkbox id="TextLink" label="双击打开文链接(TextLink)" preference="TextLink"/>\
											<checkbox id="QRCreator" label="生成二维码(QRCreator)" preference="QRCreator"/>\
									</groupbox>\
								</tabpanel>\
								<tabpanel orient="vertical" flex="1" style="width:500px">\
									<vbox>\
										<hbox id="listarea" flex="1">\
											<tree id="ruleTree" seltype="single" flex="1" enableColumnDrag="true" class="tree" rows="15"\
												onclick="opener.FeiRuoMouse.OptionScript.onTreeclick(event);"\
												ondblclick="opener.FeiRuoMouse.OptionScript.onTreedblclick(event);">\
												<treecols>\
													<treecol id="Command-col2" label="命令" flex="10" persist="width hidden ordinal" primary="true"/>\
													<splitter class="tree-splitter"/>\
													<treecol id="Type-col2" label="动作" flex="1" persist="width hidden ordinal"/>\
													<splitter class="tree-splitter"/>\
													<treecol id="Action-col2" label="目标" flex="1" persist="width hidden ordinal"/>\
													<splitter class="tree-splitter"/>\
													<treecol id="Keys-col2" label="键盘" flex="1" persist="width hidden ordinal" hidden="true"/>\
													<splitter class="tree-splitter"/>\
													<treecol id="TKeys-col2" label="辅助" flex="1" persist="width hidden ordinal" hidden="true"/>\
													<splitter class="tree-splitter"/>\
													<treecol id="Enable-col2" label="启用" flex="1" type="checkbox" persist="width hidden ordinal"/>\
												</treecols>\
												<treechildren id="treeroot"\
													ondragstart="opener.FeiRuoMouse.OptionScript.onDragstart(event);"\
													ondragover="opener.FeiRuoMouse.OptionScript.onDragover(event);"\
													ondrop="opener.FeiRuoMouse.OptionScript.onDrop(event);">\
													<treeitem container="true" open="true" nodelete="true">\
														<treerow>\
															<treecell label="拖拽规则" />\
														</treerow>\
														<treechildren id="TreeList0"/>\
													</treeitem>\
													<treeitem container="true" open="true" nodelete="true">\
														<treerow>\
															<treecell label="手势规则" />\
														</treerow>\
														<treechildren id="TreeList1" />\
													</treeitem>\
												</treechildren>\
											</tree>\
										</hbox>\
										<hbox>\
											<spacer flex="1"/>\
											<button label="添加" id="newButton" oncommand="opener.FeiRuoMouse.OptionScript.onNewButtonClick();"/>\
											<button label="修改" id="editButton" oncommand="opener.FeiRuoMouse.OptionScript.onEditButtonClick();"/>\
											<button label="移除" id="deleteButton" oncommand="opener.FeiRuoMouse.OptionScript.onDeleteButtonClick()"/>\
										</hbox>\
									</vbox>\
								</tabpanel>\
							</tabpanels>\
						</tabbox>\
						<hbox flex="1">\
							<button dlgtype="extra1" label="还原默认值"/>\
							<button dlgtype="extra2" label="自定义命令"/>\
							<spacer flex="1" />\
							<button label="应用" oncommand="opener.FeiRuoMouse.OptionScript.Save();"/>\
							<button dlgtype="accept"/>\
							<button dlgtype="cancel"/>\
						</hbox>\
					</prefpane>\
					</prefwindow>\
          			';
		return encodeURIComponent(xul);
	};

	FeiRuoMouse.DetaillScript = {
		init: function(param) {
			FeiRuoMouse.UpdateFile(true);
			var keys = param["Key"];
			if (keys) {
				keys = keys.split("+");
				for (var i in keys) {
					if (keys[i] == "Alt")
						_$D("Alt").checked = true;

					if (keys[i] == "Ctrl") {
						_$D("Ctrl").checked = true;
					}

					if (keys[i] == "Shift")
						_$D("Shift").checked = true;
				}
			}
			_$D("TKey").checked = param["TKey"] ? true : false;


			if (param["groupid"] == "TreeList0")
				_$D("MType").value = "Drag";
			else if (param["groupid"] == "TreeList1")
				_$D("MType").value = "Ges";

			_$D("DragType").value = param["Type"];
			_$D("Action").value = param["Action"];
			this.KChanged();
			this.MChanged();

			var cmd = param["Command"];
			var menu = _$D("Command");
			if (cmd)
				menu.value = cmd;
			else
				menu.selectedIndex = 0;
		},

		Resets: function() {
			_$D("Alt").checked = _$D("Ctrl").checked = _$D("Shift").checked = false;
			_$D("MType").value = "Ges";
			_$D("DragType").value = "0";
			_$D("Action").value = "";
			this.KChanged();
			this.MChanged();
		},

		Save: function(retParam) {
			var groupid;
			if (_$D("MType").value == "Ges")
				groupid = "TreeList1";
			else
				groupid = "TreeList0";

			var Key = [];
			if (_$D("Alt").checked)
				Key.push("Alt");
			if (_$D("Ctrl").checked)
				Key.push("Ctrl");
			if (_$D("Shift").checked)
				Key.push("Shift");
			Key = Key.join("+");

			var TKey;
			if (Key && _$D("TKey").checked)
				TKey = "1";

			var Type;
			if (_$D("Drag_Image").selected)
				Type = "Image";
			else if (_$D("Drag_Url").selected)
				Type = "Url";
			else if (_$D("Drag_Text").selected)
				Type = "Text";

			var Command = _$D("Command").label;
			var str = _$D("Action").value.toUpperCase();
			var Action = []
			if (str == "ANY")
				Action = str;
			else {
				if (groupid == "TreeList0") {
					for (var i in str) {
						if ((str[i] == "U" || str[i] == "D" || str[i] == "L" || str[i] == "R") && str[i] != str[i - 1])
							Action.push(str[i]);
					}
				} else if (groupid == "TreeList1") {
					for (var i in str) {
						if ((str[i] == "U" || str[i] == "D" || str[i] == "L" || str[i] == "R" || str[i] == "W" || str[i] == "+" || str[i] == "-" || str[i] == "<" || str[i] == ">") && str[i] != str[i - 1])
							Action.push(str[i]);
					}
					Type = "";
				}

				Action = Action.join("");
			}

			//if (Command == "" || Action == "") return;
			if (Action == "") return;

			retParam["Command"] = Command || "";
			retParam["Action"] = Action || "";
			retParam["Type"] = Type || "";
			retParam["Key"] = Key || "";
			retParam["TKey"] = TKey || "";
			retParam["Btn"] = "0";
			retParam["groupid"] = groupid || "";
			retParam["Enable"] = 1 || "";
			retParam["changed"] = "1";
			setTimeout(function() {
				FeiRuoMouse.OptionScript.ChangeStatus();
			}, 10);
			return true;
		},

		KChanged: function() {
			if (!_$D("Alt").checked && !_$D("Ctrl").checked && !_$D("Shift").checked)
				_$D("TKey").disabled = true;
			else
				_$D("TKey").disabled = false;
		},

		MChanged: function() {
			var status = _$D("Ges").selected;
			_$D("Drag_Image").disabled = _$D("Drag_Url").disabled = _$D("Drag_Text").disabled = status;
			this.CreateCommandMenu(status);
			this.Action_Label(status);
		},

		Action_Label: function(isAlert) {
			if (!isAlert)
				_$D("Action_Label").value = "";
			else
				_$D("Action_Label").value = "W-(上滚轮),W+(下滚轮),L<R(右左),L>R(左右)";
		},

		CreateCommandMenu: function(Ges) {
			var menu = _$D("Command");

			while (menu.hasChildNodes()) {
				menu.removeChild(menu.lastChild);
			}

			var Custom = FeiRuoMouse.CustomCommand;
			if (!Custom) return;

			for (var i in Custom) {
				if (Ges && Custom[i].ActionType.match("Gestures"))
					menu.appendItem(Custom[i].label, Custom[i].label);

				if (!Ges && Custom[i].ActionType.match("Drag")) {
					if (_$D("Drag_Image").selected && Custom[i].Type.match("Image"))
						menu.appendItem(Custom[i].label, Custom[i].label);
					else if (_$D("Drag_Url").selected && Custom[i].Type.match("Url"))
						menu.appendItem(Custom[i].label, Custom[i].label);
					else if (_$D("Drag_Text").selected && Custom[i].Type.match("Text"))
						menu.appendItem(Custom[i].label, Custom[i].label);
				}
			}
			menu.selectedIndex = 0;
		},
	};

	FeiRuoMouse.DetaillWin = function() {
		var xul = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
					<prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
					id="FeiRuoMouse_Detail"\
					ignorekeys="true"\
					title="FeiRuoMouse 拖拽/手势"\
					onload="init();"\
					onunload="WindoFocus();"\
					buttons="accept, cancel, extra1"\
					ondialogextra1="opener.FeiRuoMouse.DetaillScript.Resets();"\
					ondialogaccept="Save();"\
					windowtype="FeiRuoMouse:DetailWindow">\
						<prefpane id="main" flex="1">\
						<script>\
							function init() {\
								var param=window.arguments[0];\
								opener.FeiRuoMouse.DetaillScript.init(param);\
							}\
							function Save() {\
								var retparam=window.arguments[1];\
								opener.FeiRuoMouse.DetaillScript.Save(retparam);\
							}\
							function WindoFocus(){\
								if (opener.FeiRuoMouse.getWindow(0))\
									opener.FeiRuoMouse.getWindow(0).focus();\
							}\
						</script>\
							<vbox style = "width:400px; min-height:275px;">\
								<groupbox>\
									<radiogroup id="MType">\
										<rows>\
											<row align="center">\
												<radio label="鼠标手势" id="Ges" value="Ges" oncommand="opener.FeiRuoMouse.DetaillScript.MChanged();"/>\
											</row>\
											<row align="center">\
												<radio label="拖拽" id="Drag" value="Drag" style="width:100px;" oncommand="opener.FeiRuoMouse.DetaillScript.MChanged();"/>\
												<radiogroup id="DragType">\
													<hbox>\
														<radio label="图片" id="Drag_Image" value="Image" oncommand="opener.FeiRuoMouse.DetaillScript.CreateCommandMenu();"/>\
														<radio label="链接" id="Drag_Url" value="Url" oncommand="opener.FeiRuoMouse.DetaillScript.CreateCommandMenu();"/>\
														<radio label="文字" id="Drag_Text" value="Text" oncommand="opener.FeiRuoMouse.DetaillScript.CreateCommandMenu();"/>\
													</hbox>\
												</radiogroup>\
											</row>\
										</rows>\
									</radiogroup>\
								</groupbox>\
								<groupbox>\
									<caption label="键盘辅助键"/>\
										<row align="center">\
											<checkbox label="Alt" id="Alt" oncommand="opener.FeiRuoMouse.DetaillScript.KChanged();"/>\
											<label value="+"/>\
											<checkbox label="Ctrl" id="Ctrl" oncommand="opener.FeiRuoMouse.DetaillScript.KChanged();"/>\
											<label value="+"/>\
											<checkbox label="Shift" id="Shift" oncommand="opener.FeiRuoMouse.DetaillScript.KChanged();"/>\
											<spacer flex="1" />\
											<checkbox label="作为排除键" id="TKey"/>\
										</row>\
								</groupbox>\
								<groupbox>\
									<caption label="命令"/>\
										<menulist id="Command" style="width:400px;"/>\
								</groupbox>\
								<groupbox>\
									<caption label="手势方向"/>\
										<textbox id="Action" style="width:400px; height:25px;"/>\
										<label value="U(上),D(下),L(左),R(右),Any(任意)"/>\
										<label id="Action_Label" value=""/>\
								</groupbox>\
							</vbox>\
							<hbox flex="1">\
								<button dlgtype="extra1" label="重置" />\
								<spacer flex="1" />\
								<button dlgtype="accept"/>\
								<button dlgtype="cancel"/>\
							</hbox>\
						</prefpane>\
					</prefwindow>\
					';
		return encodeURIComponent(xul);
	};

	/*****************************************************************************************/
	function _$D(id) {
		return FeiRuoMouse.getWindow(1).document.getElementById(id);
	}

	function _$(id) {
		return FeiRuoMouse.getWindow(0).document.getElementById(id);
	}

	function _$C(name, attr) {
		var el = FeiRuoMouse.getWindow(0).document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	function $(id) {
		return document.getElementById(id);
	}

	function log() {
		Application.console.log("[FeiRuoMouse] " + Array.slice(arguments));
	}

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	function status(str) {
		XULBrowserWindow.statusTextField.label = '[FeiRuoMouse]' + str;
	}

	function alert(aString, aTitle) {
		Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService)
			.showAlertNotification("", aTitle || "FeiRuoMouse", aString, false, "", null);
	}

	FeiRuoMouse.init();
	window.FeiRuoMouse = FeiRuoMouse;
})();
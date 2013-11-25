// ==UserScript==
// @name         Advanced Mouse Gestures (with Wheel Gesture and Rocker Gesture)
// @namespace    http://www.xuldev.org/
// @description  轻量级鼠标手势脚本（可自定义手势代码）
// @include      main
// @author       Raqbgxue + Gomita
// @version      10.1.17 (folk from original 9.5.18)
// @homepage     http://www.xuldev.org/misc/ucjs.php
// @homepage     http://d.hatena.ne.jp/raqbgxue/20090624/1245848856
// @note         Ctrl+(right-click-up) => Reset Gesture
// @charset      utf-8
//==/UserScript==
var ucjsMouseGestures = {
	// options
	enableWheelGestures: true,
	enableRockerGestures: true,

	_lastX: 0,
	_lastY: 0,
	_directionChain: '',
	_isMouseDownL: false,
	_isMouseDownR: false,
	_hideFireContext: false,
	//for windows
	_shouldFireContext: false,
	//for linux
	GESTURES: {},
	createMenuitem: function() {
		var menuitem = document.createElement('menuitem');
		menuitem.setAttribute('id', 'ucjsMouseGestures');
		menuitem.setAttribute('label', '鼠标手势');
		menuitem.setAttribute("tooltiptext", '左键重载；右键编辑');
		menuitem.setAttribute('oncommand', 'ucjsMouseGestures.reload(true);');
		menuitem.setAttribute('onclick', 'if (event.button == 2) { event.preventDefault(); closeMenus(event.currentTarget); ucjsMouseGestures.edit(ucjsMouseGestures.file); }');
		var insPos = document.getElementById('devToolsSeparator');
		insPos.parentNode.insertBefore(menuitem, insPos);
	},

	init: function() {
		this.reload();
		var self = this;
		var events = ["mousedown", "mousemove", "mouseup", "contextmenu"];
		if (this.enableRockerGestures) events.push("draggesture");
		if (this.enableWheelGestures) events.push("DOMMouseScroll");

		function registerEvents(aAction, eventArray) {
			eventArray.forEach(function(aType) {
				getBrowser().mPanelContainer[aAction + "EventListener"](aType, self, aType == "contextmenu");
			});
		};
		registerEvents("add", events);
		window.addEventListener("unload", function() {
			registerEvents("remove", events);
		}, false);
	},

	reload: function(isAlert) {
		var file = this.getMouseGesturesFile();
		if (!file.exists()) return this.alert('Load Error: 配置文件不存在');
		try {
			this.importMouseGestures(file);
		} catch (e) {
			this.alert('Error: ' + e + '\n请重新检查配置文件');
			return;
		}
		if (isAlert) this.alert('配置已经重新载入');
	},

	alert: function(aString, aTitle) {
		Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "MouseGestures", aString, false, "", null);
	},

	getMouseGesturesFile: function() {
		var aFile = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
		aFile.appendRelativePath("lib");
		aFile.appendRelativePath("_mouseGestures.js");
		if (!aFile.exists() || !aFile.isFile()) return null;
		delete this.file;
		return this.file = aFile;
	},

	importMouseGestures: function(file) {
		var fstream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
		var sstream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream);
		fstream.init(file, -1, 0, 0);
		sstream.init(fstream);
		var data = sstream.read(sstream.available());
		try {
			data = decodeURIComponent(escape(data));
		} catch (e) {}
		sstream.close();
		fstream.close();
		this.GESTURES = new Function('', 'return ' + data)();
		return;
	},
	edit: function(aFile) {
		if (!aFile || !aFile.exists() || !aFile.isFile()) return;
		var editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
		if (!editor.exists()) {
			alert("编辑器的路径未设定。\n请设置 view_source.editor.path");
			toOpenWindowByType('pref:pref', 'about:config?filter=view_source.editor.path');
			openLinkIn(url, "tab", {
				inBackground: false
			});
			return;
		}
		var UI = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
		UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0 ? "gbk" : "UTF-8";
		var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);

		try {
			var path = UI.ConvertFromUnicode(aFile.path);
			var args = [path];
			process.init(editor);
			process.run(false, args, args.length);
		} catch (e) {}
	},

	handleEvent: function(event) {
		switch (event.type) {
		case "mousedown":
			if (event.button == 2) {
				this._isMouseDownR = true;
				this._hideFireContext = false;
				this._startGesture(event);
			}
			if (this.enableRockerGestures) {
				if (event.button == 2 && this._isMouseDownL) {
					this._isMouseDownR = false;
					this._shouldFireContext = false;
					this._hideFireContext = true;
					this._directionChain = "L>R";
					this._stopGesture(event);
				} else if (event.button == 0) {
					this._isMouseDownL = true;
					if (this._isMouseDownR) {
						this._isMouseDownL = false;
						this._shouldFireContext = false;
						this._hideFireContext = true;
						this._directionChain = "L<R";
						this._stopGesture(event);
					}
				}
			}
			break;
		case "mousemove":
			if (this._isMouseDownR) {
				this._hideFireContext = true;
				this._progressGesture(event);
			}
			break;
		case "mouseup":
			if (event.ctrlKey && event.button == 2) {
				this._isMouseDownL = false;
				this._isMouseDownR = false;
				this._shouldFireContext = false;
				this._hideFireContext = false;
				this._directionChain = '';
				event.preventDefault();
				XULBrowserWindow.statusTextField.label = "Reset Gesture";
				break;
			}
			if (this._isMouseDownR && event.button == 2) {
				if (this._directionChain) this._shouldFireContext = false;
				this._isMouseDownR = false;
				this._stopGesture(event);
				if (this._shouldFireContext && !this._hideFireContext) {
					this._shouldFireContext = false;
					this._displayContextMenu(event);
				}
			} else if (this.enableRockerGestures && event.button == 0 && this._isMouseDownL) {
				this._isMouseDownL = false;
				this._shouldFireContext = false;
			}
			break;
		case "contextmenu":
			if (this._isMouseDownL || this._isMouseDownR || this._hideFireContext) {
				event.preventDefault();
				event.stopPropagation();
				this._shouldFireContext = true;
				this._hideFireContext = false;
			}
			break;
		case "DOMMouseScroll":
			if (this.enableWheelGestures && this._isMouseDownR) {
				event.preventDefault();
				event.stopPropagation();
				this._shouldFireContext = false;
				this._hideFireContext = true;
				this._directionChain = "W" + (event.detail > 0 ? "+" : "-");
				this._stopGesture(event);
			}
			break;
		case "draggesture":
			this._isMouseDownL = false;
			break;
		}
	},

	_displayContextMenu: function(event) {
		var evt = event.originalTarget.ownerDocument.createEvent("MouseEvents");
		evt.initMouseEvent("contextmenu", true, true, event.originalTarget.defaultView, 0, event.screenX, event.screenY, event.clientX, event.clientY, false, false, false, false, 2, null);
		event.originalTarget.dispatchEvent(evt);
	},

	_startGesture: function(event) {
		this._lastX = event.screenX;
		this._lastY = event.screenY;
		this._directionChain = "";
		this.createTrail(event);
	},

	_progressGesture: function(event) {
		var x = event.screenX,
			y = event.screenY;
		var lastX = this._lastX,
			lastY = this._lastY;
		var subX = x - lastX,
			subY = y - lastY;
		var distX = (subX > 0 ? subX : (-subX)),
			distY = (subY > 0 ? subY : (-subY));
		var direction;
		if (distX < 10 && distY < 10) return;
		if (distX > distY) direction = subX < 0 ? "L" : "R";
		else direction = subY < 0 ? "U" : "D";
		var dChain = this._directionChain;
		this.drawTrail(this._lastX, this._lastY, x, y);
		if (direction != dChain.charAt(dChain.length - 1)) {
			dChain += direction;
			this._directionChain += direction;
			var gesture = this.GESTURES[dChain];
			XULBrowserWindow.statusTextField.label = "手势: " + dChain + (gesture ? ' (' + gesture.name + ')' : '');
		}
		this._lastX = x;
		this._lastY = y;
	},

	_stopGesture: function(event) {
		try {
			if (dChain = this._directionChain) {
				if (typeof this.GESTURES[dChain].cmd == "function") this.GESTURES[dChain].cmd(this, event);
				else eval(this.GESTURES[dChain].cmd);
				XULBrowserWindow.statusTextField.label = "";
			}
		} catch (e) {
			XULBrowserWindow.statusTextField.label = '手势未定义或函数定义错误: ' + dChain;
		}
		this._directionChain = "";
		this.eraseTrail();
	},

	_trailDot: null,
	_trailArea: null,
	_trailLastDot: null,
	_trailOffsetX: 0,
	_trailOffsetY: 0,
	_trailZoom: 1,
	_trailSize: 2,
	_trailColor: "brown",

	createTrail: function FGH_createTrail(event) {
		var win = event.view;
		if (win.top.document instanceof Ci.nsIDOMHTMLDocument) win = win.top;
		else if (win.document instanceof Ci.nsIDOMHTMLDocument === false) return;
		var doc = win.document;
		var insertionNode = doc.documentElement ? doc.documentElement : doc;
		var win = doc.defaultView;
		this._trailZoom = win.QueryInterface(Ci.nsIInterfaceRequestor).
		getInterface(Ci.nsIDOMWindowUtils).screenPixelsPerCSSPixel;
		this._trailOffsetX = (win.mozInnerScreenX - win.scrollX) * this._trailZoom;
		this._trailOffsetY = (win.mozInnerScreenY - win.scrollY) * this._trailZoom;
		this._trailArea = doc.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailArea");
		insertionNode.appendChild(this._trailArea);
		this._trailDot = doc.createElementNS("http://www.w3.org/1999/xhtml", "xdTrailDot");
		this._trailDot.style.width = this._trailSize + "px";
		this._trailDot.style.height = this._trailSize + "px";
		this._trailDot.style.background = this._trailColor;
		this._trailDot.style.border = "0px";
		this._trailDot.style.position = "absolute";
		this._trailDot.style.zIndex = 2147483647;
	},

	drawTrail: function FGH_drawTrail(x1, y1, x2, y2) {
		if (!this._trailArea) return;
		var xMove = x2 - x1;
		var yMove = y2 - y1;
		var xDecrement = xMove < 0 ? 1 : -1;
		var yDecrement = yMove < 0 ? 1 : -1;
		x2 -= this._trailOffsetX;
		y2 -= this._trailOffsetY;
		if (Math.abs(xMove) >= Math.abs(yMove)) for (var i = xMove; i != 0; i += xDecrement)
		this._strokeDot(x2 - i, y2 - Math.round(yMove * i / xMove));
		else for (var i = yMove; i != 0; i += yDecrement)
		this._strokeDot(x2 - Math.round(xMove * i / yMove), y2 - i);
	},

	eraseTrail: function FGH_eraseTrail() {
		if (this._trailArea && this._trailArea.parentNode) {
			while (this._trailArea.lastChild)
			this._trailArea.removeChild(this._trailArea.lastChild);
			this._trailArea.parentNode.removeChild(this._trailArea);
		}
		this._trailDot = null;
		this._trailArea = null;
		this._trailLastDot = null;
	},

	_strokeDot: function FGH__strokeDot(x, y) {
		if (this._trailArea.y == y && this._trailArea.h == this._trailSize) {
			var newX = Math.min(this._trailArea.x, x);
			var newW = Math.max(this._trailArea.x + this._trailArea.w, x + this._trailSize) - newX;
			this._trailArea.x = newX;
			this._trailArea.w = newW;
			this._trailLastDot.style.left = newX.toString() + "px";
			this._trailLastDot.style.width = newW.toString() + "px";
			return;
		} else if (this._trailArea.x == x && this._trailArea.w == this._trailSize) {
			var newY = Math.min(this._trailArea.y, y);
			var newH = Math.max(this._trailArea.y + this._trailArea.h, y + this._trailSize) - newY;
			this._trailArea.y = newY;
			this._trailArea.h = newH;
			this._trailLastDot.style.top = newY.toString() + "px";
			this._trailLastDot.style.height = newH.toString() + "px";
			return;
		}
		if (this._trailZoom != 1) {
			x = Math.floor(x / this._trailZoom);
			y = Math.floor(y / this._trailZoom);
		}
		var dot = this._trailDot.cloneNode(true);
		dot.style.left = x + "px";
		dot.style.top = y + "px";
		this._trailArea.x = x;
		this._trailArea.y = y;
		this._trailArea.w = this._trailSize;
		this._trailArea.h = this._trailSize;
		this._trailArea.appendChild(dot);
		this._trailLastDot = dot;
	},

};

ucjsMouseGestures.createMenuitem();
ucjsMouseGestures.init();
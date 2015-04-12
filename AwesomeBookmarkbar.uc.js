// ==UserScript==
// @name           	AwesomeBookmarkbar.uc.js
// @description   	智能书签工具栏
// @author         	feiruo
// @compatibility  	Firefox 24.0
// @charset			UTF-8
// @include			chrome://browser/content/browser.xul
// @id 				[73FCA65B]
// @inspect         window.AwesomeBookmarkbar
// @startup      	window.AwesomeBookmarkbar.init();
// @shutdown     	window.AwesomeBookmarkbar.onDestroy();
// @optionsURL		about:config?filter=AwesomeBookmarkbar.
// @config 			window.AwesomeBookmarkbar.openPref();
// @reviewURL		http://bbs.kafan.cn/thread-1726260-1-1.html
// @homepageURL		https://github.com/feiruo/userChromeJS
// @downloadURL		https://github.com/feiruo/userChromeJS/AwesomeBookmarkbar.uc.js
// @note         	点击地址栏显示书签工具栏。
// @note         	地址栏任意按键，地址栏失去焦点后自动隐藏书签工具栏。
// @note       		左键点击书签后自动隐藏书签工具栏。
// @version      	0.3		2015.04.11 20:00 	绘制UI设置界面.
// @version      	0.2.1 	去除鼠标移到地址栏自动显示书签工具栏
// @version      	0.2 	增加鼠标移到地址栏自动显示书签工具栏，移出隐藏
// ==/UserScript== 
location == "chrome://browser/content/browser.xul" && (function() {
	if (window.AwesomeBookmarkbar) {
		window.AwesomeBookmarkbar.onDestroy();
		delete window.AwesomeBookmarkbar;
	}

	var AwesomeBookmarkbar = {
		get prefs() {
			delete this.prefs;
			return this.prefs = Services.prefs.getBranch("userChromeJS.AwesomeBookmarkbar.");
		},
		get Window() {
			var windowsMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
				.getService(Components.interfaces.nsIWindowMediator);
			return windowsMediator.getMostRecentWindow("AwesomeBookmarkbar:Preferences");
		},

		init: function() {
			var ins = $("devToolsSeparator");
			ins.parentNode.insertBefore($C("menuitem", {
				id: "AwesomeBookmarkbar_set",
				label: "智能书签栏配置",
				oncommand: "AwesomeBookmarkbar.openPref();",
				class: "menuitem-iconic",
			}), ins);

			this.loadSetting();
			this.prefs.addObserver('', this.PrefsObs, false);
			window.addEventListener("unload", function() {
				AwesomeBookmarkbar.onDestroy();
			}, false);
		},

		onDestroy: function() {
			this.AddListener(false, 0, "command", "PersonalToolbarClick0", "Hide");
			this.AddListener(false, 0, "click", "PersonalToolbarClick1", "Hide");
			this.AddListener(false, 1, "command", "PersonalToolbarClick2", "Hide");
			this.AddListener(false, 2, "click", "UrlbarClick", "CHide");
			this.AddListener(false, 2, "mouseout", "UrlbarMouseout", "MHide");
			this.AddListener(false, 2, "keydown", "UrlbarKey", "keyHide");
			this.AddListener(false, 2, "blur", "UrlbarBlur", "MHide");
			this.AddListener(false, 0, "mouseover", "PersonalToolbarMouseover", "MShow");
			this.AddListener(false, 0, "mouseout", "PersonalToolbarMouseout", "MHide");
			setToolbarVisibility($("PersonalToolbar"), true);
			this.prefs.removeObserver('', this.PrefsObs, false);
			if (this.Window) this.Window.close();
			Services.obs.notifyObservers(null, "startupcache-invalidate", "");
		},

		PrefsObs: function(subject, topic, data) {
			if (topic == 'nsPref:changed') {
				switch (data) {
					case 'PersonalToolbarClick':
					case 'PersonalToolbarMouseover':
					case 'PersonalToolbarMouseout':
					case 'UrlbarClick':
					case 'UrlbarMouseout':
					case 'UrlbarKey':
					case 'UrlbarBlur':
						AwesomeBookmarkbar.loadSetting(data);
						break;
				}
			}
		},

		loadSetting: function(type) {
			if (!type || type === "PersonalToolbarClick") {
				this.AddListener(this.getPrefs("PersonalToolbarClick"), 0, "command", "PersonalToolbarClick0", "Hide");
				this.AddListener(this.getPrefs("PersonalToolbarClick"), 0, "click", "PersonalToolbarClick1", "Hide");
				this.AddListener(this.getPrefs("PersonalToolbarClick"), 1, "command", "PersonalToolbarClick2", "Hide");
			}

			if (!type || type === "UrlbarClick")
				this.AddListener(this.getPrefs("UrlbarClick"), 2, "click", "UrlbarClick", "CHide");

			if (!type || type === "UrlbarMouseout")
				this.AddListener(this.getPrefs("UrlbarMouseout"), 2, "mouseout", "UrlbarMouseout", "MHide");

			if (!type || type === "UrlbarKey")
				this.AddListener(this.getPrefs("UrlbarKey"), 2, "keydown", "UrlbarKey", "keyHide");

			if (!type || type === "UrlbarBlur")
				this.AddListener(this.getPrefs("UrlbarBlur"), 2, "blur", "UrlbarBlur", "MHide");

			if (!type || type === "PersonalToolbarMouseover")
				this.AddListener(this.getPrefs("PersonalToolbarMouseover"), 0, "mouseover", "PersonalToolbarMouseover", "MShow");

			if (!type || type === "PersonalToolbarMouseout")
				this.AddListener(this.getPrefs("PersonalToolbarMouseout"), 0, "mouseout", "PersonalToolbarMouseout", "MHide");
		},

		/*****************************************************************************************/
		AddListener: function(enable, tag, action, name, command) {
			if (tag === 0)
				tag = $("PersonalToolbar");
			if (tag === 1)
				tag = $("placesCommands");
			if (tag === 2)
				tag = gURLBar;
			tag.removeEventListener(action, AwesomeBookmarkbar["Listener_" + name], false);

			if (!enable) return;

			(function(name, command) {
				AwesomeBookmarkbar["Listener_" + name] = function(e) {
					AwesomeBookmarkbar.Listener(e, command);
				};
			})(name, command);

			tag.addEventListener(action, AwesomeBookmarkbar["Listener_" + name], false);
		},

		Listener: function(e, command) {
			var Tid = e.target.parentNode.id,
				paid;
			if (Tid == 'notification-popup-box' || Tid == 'identity-box' || Tid == 'urlbar-display-box' || Tid == 'urlbar-icons')
				paid = true;
			switch (command) {
				case "Hide":
					if (e.button == 2 || e.button == 1 || (e.button == 0 && !(e.metaKey || e.shiftKey || e.ctrlKey))) return;
					this.HideToolbar(true);
					break;
				case "CHide":
					if (e.button !== 0 || paid) return;
					this.HideToolbar(false);
					break;
				case "MShow":
					this.HideToolbar(false);
					break;
				case "MHide":
					if (paid) return;
					this.HideToolbar(true);
					break;
				case "keyHide":
					if (window.event ? e.keyCode : e.which)
						this.HideToolbar(true);
					break;
			}
		},

		HideToolbar: function(isHide) {
			var Bar = $("PersonalToolbar");
			if (isHide)
				setToolbarVisibility(Bar, false);
			else
				setToolbarVisibility(Bar, true);
		},

		/*****************************************************************************************/
		getPrefs: function(name) {
			if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_BOOL)
				this.prefs.setBoolPref(name, false);
			return this.prefs.getBoolPref(name);
		},

		openPref: function() {
			if (this.Window)
				this.Window.focus();
			else {
				var option = this.option();
				window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + option, '', 'chrome,titlebar,toolbar,centerscreen,dialog=no');
			}
		},

		option: function() {
			xul = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
					<prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
					id="AwesomeBookmarkbar_Settings"\
					ignorekeys="true"\
					title="智能书签栏配置"\
					buttons="accept,cancel,extra1"\
					ondialogextra1="Resets();"\
					windowtype="AwesomeBookmarkbar:Preferences">\
					<prefpane id="main" flex="1">\
						<preferences>\
							<preference id="PersonalToolbarClick" type="bool" name="userChromeJS.AwesomeBookmarkbar.PersonalToolbarClick"/>\
							<preference id="PersonalToolbarMouseover" type="bool" name="userChromeJS.AwesomeBookmarkbar.PersonalToolbarMouseover"/>\
							<preference id="PersonalToolbarMouseout" type="bool" name="userChromeJS.AwesomeBookmarkbar.PersonalToolbarMouseout"/>\
							<preference id="UrlbarClick" type="bool" name="userChromeJS.AwesomeBookmarkbar.UrlbarClick"/>\
							<preference id="UrlbarMouseout" type="bool" name="userChromeJS.AwesomeBookmarkbar.UrlbarMouseout"/>\
							<preference id="UrlbarKey" type="bool" name="userChromeJS.AwesomeBookmarkbar.UrlbarKey"/>\
							<preference id="UrlbarBlur" type="bool" name="userChromeJS.AwesomeBookmarkbar.UrlbarBlur"/>\
						</preferences>\
						<script>\
							function Resets() {\
								$("PersonalToolbarClick").value = false;\
								$("PersonalToolbarMouseover").value = false;\
								$("PersonalToolbarMouseout").value = false;\
								$("UrlbarClick").value = false;\
								$("UrlbarMouseout").value = false;\
								$("UrlbarKey").value = false;\
								$("UrlbarBlur").value = false;\
								opener.AwesomeBookmarkbar.HideToolbar();\
							}\
							function $(id) document.getElementById(id);\
						</script>\
						<groupbox>\
							<caption label="显示书签工具栏"/>\
							<checkbox id="PersonalToolbarMouseover" label="鼠标移入书签工具栏" preference="PersonalToolbarMouseover"/>\
							<label value="或者直接显在标题栏右键显示书签工具栏"/>\
						</groupbox>\
						<groupbox>\
							<caption label="隐藏书签工具栏"/>\
							<grid>\
								<rows>\
									<row align="center">\
										<checkbox id="UrlbarMouseout" label="鼠标移出地址栏" preference="UrlbarMouseout"/>\
									</row>\
									<row align="center">\
										<checkbox id="UrlbarClick" label="地址栏任意点击(鼠标)" preference="UrlbarClick"/>\
									</row>\
									<row align="center">\
										<checkbox id="UrlbarKey" label="地址栏任意按键(键盘)" preference="UrlbarKey"/>\
									</row>\
									<row align="center">\
										<checkbox id="UrlbarBlur" label="地址栏失去焦点(页面内点击)" preference="UrlbarBlur"/>\
									</row>\
									<row align="center">\
										<checkbox id="PersonalToolbarMouseout" label="鼠标移出书签工具栏" preference="PersonalToolbarMouseout"/>\
									</row>\
									<row align="center">\
										<checkbox id="PersonalToolbarClick" label="书签工具栏点击书签之后" preference="PersonalToolbarClick"/>\
									</row>\
								</rows>\
							</grid>\
						</groupbox>\
						<hbox flex="1">\
							<button dlgtype="extra1" label="还原默认值" />\
							<spacer flex="1" />\
							<button dlgtype="accept"/>\
							<button dlgtype="cancel"/>\
						</hbox>\
					</prefpane>\
					</prefwindow>\
          			';
			return encodeURIComponent(xul);
		},
	};

	function $(id) {
		return document.getElementById(id);
	}

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	AwesomeBookmarkbar.init();
	window.AwesomeBookmarkbar = AwesomeBookmarkbar;
})();
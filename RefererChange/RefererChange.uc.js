// ==UserScript==
// @name        refererChangerBlacklistVersion
// @include     main
// @include     chrome://browser/content/browser.xul
// @charset      utf-8
// @version     1.0.3
// @description Refererの内容を柔軟に書き換えるUserScriptです。
// ==/UserScript==
var refererChanger = {};
refererChanger.state = true; /* 启动时是否启用 */
refererChanger.fileName = 'lib\\_refererChange.js';
refererChanger.enabledLab = "\u7834\u89E3\u56FE\u7247\u5916\u94FE\u5DF2\u5F00\u542F";
refererChanger.disabledLab = "\u7834\u89E3\u56FE\u7247\u5916\u94FE\u5DF2\u5173\u95ED";
refererChanger.enabledSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADHUlEQVQ4jX3T3U9bBRjH8ZN46d/BhTdk171TSGuTg6aTjHkhZqmF9bBkwY5RUAbtkI6W09EX6JDQClNejlJFNjZlHdIdVEIpzCbCDHUu01EcXU9L4cQs4euVM3PEX/K9/eS5eYTRmZQcnVnLDSgpTZ44ovHnCykpbejLlcvCP4vNrO083t093CuXKe/r/9vuns5OocTgdLrwDBhQUlppr8zAtYfI19bpuj7FaCqEcreb8XU34aQPe/RjHCN3aB35mcclnbCS1p4B/omUVt7XiVx/iOfGTUZXQkz+dI7hlUYiP1q5sizhm7+INPQZ7bENdrQjgNK+ztCN3+mau8rEupsryzYC37+DL/k2nsWT+JPNvBvso2PsHjntgLCy+jyg7esM3/yDztlRPlntoH+pHs93J3DdPs6FW8fxJM5Q39+L69Nf2C7svwgUyjoj3zzCMztHKHmJy0tWum6/Rfu3b9KZOMmHXzmRBq/SPbHF9pMjLniypxOb3yY0dxenEsPz9Vm8CRue+VN88HkT74UCdIwtcWkq+yIgT6S0fElnNJEjNr9NcHad8+56evzVeHyv0nXxBO7xH/DHf8P3xa88OgrYLeq0K2/QOiny/piZbkcNXo+baDSKu6OF0/1mGsKv0dbpIBqN0uPxHtrt9pbKysqXhb7xlJYv6iS3FljYvIXb7yIQCJDL5chmsywuLtIr99IX9LF5b5NsNouqqgQCAURR9AryeErLFw9Ibi0wOBnG2dZKOpPh/IUWxBoRm81GMBikra0Nm81GTU0Np886n6qqisPh0IRBJfUgXyhS3NPx+mQ+6ukhncnwZ17DZHqdRCJBOp0mmUwyPT2NyWQiPLWsqaqKy+XSheH4qncovnYnrKxqjed6D+zSmcN0JoPV7nhaVVWN0WjEYrFgsVgwGo1UVVVTf6rxgaqqNDQ0/PsTgiAIFRUVr4iiuCHLckFRlHw8HicSidDc3IzT6SQSiRCPx1EUJS/LckEUxQ3hP3vJYDAcM5vN961Wa1mSJL2pqemvurq6+tra2ipJkkqSJOlWq7VsNpvvGwyGY38DN9aNRVh5uVwAAAAASUVORK5CYII=";
refererChanger.disabledSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACN0lEQVQ4ja3TS08TURiHcb6UO+MlcWWMJkgILsQYJMRqNEYiBERKIQxSWi5TWlouY0GnMEJr5Sq1qG2qNExpK4kGgkaD9hJa5nRm2tOVf3c1kzaEhW/yrM7JL+/inKqq/zFOr2ia8kZTo4JITK4K8dpYQSR2z9ZgCeC80fRhJvNHUVWoeXpsGYUiLcmwLmxLJWBUEImsqBhdOoBpKQb98hycIgsh3gM+ZoAlYMTtKQceTgbRMvkFhzKFRdgmJcDsEomap7AtH4BZXYNzi8Xs52aMbzXBttmAsbAORl83dPYXaOO+Ik0qAHKewr76C/qVGbhiBoyFGzH88TqMgWtgPtTBHHiAGyMD6JjeRYoUYBEiWoDkKcbXfqNz0YlnkQ4MherBvK9F10Y1nrytBuO/i/qhp+h6voeklC8HJJVi8k0CzOIK2EAfBkMN0G9cRdv6FXT66/D4VSt01hn0uPaRPKqwwZFCwfmSYFfiaBU4MK/vo9/fCMZ3E+0v7+AWO4yO6RD65r6VAyaXSLIyhdOfAudLYmQxhkeGevSaL4Axnoe+uxYG/hPM7h8wzn9HohKQyVG0CZfRMnsJzfxFONpPYYerQZyrgaf3LJoc59A4dgYN1tPlwAAvkmyOIrD/rlRox4Pw5gTinnsI7q5rzhLZAljNBrxIsrmC5tJxJbJUC1gF8WdWyiGnUOTUIohaBFEpiEIhlVXEoSTDuhD995TH3ZF+uzsatAgRwp4g23yETLgjQyf8q8fPX8SIYXU9r0McAAAAAElFTkSuQmCC";

refererChanger.sites = {

};
refererChanger.init = function() {
	this.reload();
	var label = this.state ? this.enabledLab : this.disabledLab;
	var tooltiptext = this.state ? this.enabledTip : this.disabledTip;
	var src = this.state ? this.enabledSrc : this.disabledSrc;
	var menuitem = document.createElement('menuitem');
	menuitem.setAttribute('id', 'RefererChanger');
	menuitem.setAttribute('class', 'menuitem-iconic');
	menuitem.setAttribute('label', label);
	menuitem.setAttribute("tooltiptext", '左键重载 ；中键 启用/禁用；右键编辑 ');
	menuitem.setAttribute('src', src);
	menuitem.setAttribute('oncommand', 'refererChanger.reload(true);');
	menuitem.setAttribute('onclick', 'if (event.button == 2) {event.preventDefault();closeMenus(event.currentTarget); refererChanger.edit();}else if(event.button == 1) { event.preventDefault(); refererChanger.RCToggle();}');
	var insPos = document.getElementById('devToolsSeparator');
	insPos.parentNode.insertBefore(menuitem, insPos);
	var os = Cc['@mozilla.org/observer-service;1'].getService(
	Ci.nsIObserverService);
	os.addObserver(this, 'http-on-modify-request', false);

};
refererChanger.RCToggle = function() {
	this.state = !this.state;
	let menuitem = document.getElementById('RefererChanger');
	try {
		var label = this.state ? this.enabledLab : this.disabledLab;
		var tooltiptext = this.state ? this.enabledTip : this.disabledTip;
		var src = this.state ? this.enabledSrc : this.disabledSrc;
		menuitem.setAttribute("label", label);
		menuitem.setAttribute("src", src);
	} catch (e) {}
};

refererChanger.reload = function(isAlert) {
	var data = this.loadFile(this.fileName);
	if (!data) return;
	var sandbox = new Cu.Sandbox(new XPCNativeWrapper(window));
	try {
		Cu.evalInSandbox(data, sandbox, "1.8");
	} catch (e) {
		this.alert("Error: " + e + "\n请重新检查配置文件");
		return;
	}

	this.sites = sandbox.sites;
	if (isAlert) this.alert("配置已经重新载入");
};

refererChanger.loadFile = function(aLeafName) {
	var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
	aFile.appendRelativePath(aLeafName);
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
};
refererChanger.alert = function(aString, aTitle) {
	Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "RefererChanger", aString, false, "", null);
};

refererChanger.edit = function() {
	var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
	aFile.appendRelativePath(this.fileName);
	if (!aFile || !aFile.exists() || !aFile.isFile()) return;
	var editor;
	try {
		editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
	} catch (e) {
		this.alert("请设置编辑器的路径。\nview_source.editor.path");
		toOpenWindowByType('pref:pref', 'about:config?filter=view_source.editor.path');
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
	} catch (e) {
		this.alert("编辑器不正确！")
	}
},
// *********Config End**********
//var statusbarHidden = true;
refererChanger.adjustRef = function(http, site) {
	try {
		var sRef;
		var refAction = undefined;
		for (var i in this.sites) {
			if (site.indexOf(i) != -1) {
				refAction = this.sites[i];
				break;
			}
		}

		if (refAction == undefined) return true;
		if (refAction.charAt(0) == '@') {
			//下はデバッグ用
			//logs.logStringMessage("ReferrerChanger:  " + http.originalURI.spec + " : "+refAction);
			//logs.logStringMessage("ReferrerChanger:  OriginalReferrer: "+http.referrer.spec);

			switch (refAction) {
			case '@NORMAL':
				return true;
				break;
			case '@FORGE':
				sRef = http.URI.scheme + "://" + http.URI.hostPort + "/";
				break;
			case '@BLOCK':
				sRef = "";
				break;
			case '@AUTO':
				return false;
			case '@ORIGINAL':
				sRef = window.content.document.location.href;
				break;
			default:
				//return false;
				break;
			}
		} else if (refAction.length == 0) {
			return true;
		} else {
			sRef = refAction;
		}
		http.setRequestHeader("Referer", sRef, false);
		if (http.referrer) http.referrer.spec = sRef;
		return true;
	} catch (e) {}
	return true;
};

refererChanger.observe = function(aSubject, aTopic, aData) {
	if (aTopic != 'http-on-modify-request') return;
	if (!this.state) return;
	var http = aSubject.QueryInterface(Ci.nsIHttpChannel);
	for (var s = http.URI.host; s != ""; s = s.replace(/^.*?(\.|$)/, "")) {
		if (this.adjustRef(http, s)) return;
	}
	if (http.referrer && http.referrer.host != http.originalURI.host) http.setRequestHeader('Referer', http.originalURI.spec.replace(/[^/]+$/, ''), false);
};

refererChanger.unregister = function() {
	var os = Cc['@mozilla.org/observer-service;1'].getService(
	Ci.nsIObserverService);
	os.removeObserver(this, 'http-on-modify-request', false);
};

var added = false;
if (location == "chrome://browser/content/browser.xul") {
	added = true;
	refererChanger.init();
}
window.addEventListener("unload", function() {
	if (location == "chrome://browser/content/browser.xul") if (added) refererChanger.unregister();
}, false);
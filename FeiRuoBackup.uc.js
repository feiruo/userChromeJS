// ==UserScript==
// @name            FeiRuoBackup.uc.js
// @description     备份、整合和还原文件。
// @author          feiruo
// @License         Version: MPL 2.0/GPL 3.0/LGPL 2.1
// @compatibility   Firefox 45
// @charset         UTF-8
// @include         chrome://browser/content/browser.xul
// @id              [12FA3E5D]
// @inspect         window.FeiRuoBackup
// @startup         window.FeiRuoBackup.init();
// @shutdown        window.FeiRuoBackup.onDestroy();
// @optionsURL      about:config?filter=FeiRuoBackup.
// @homepageURL     https://www.feiruo.pw/
// @homepageURL		https://github.com/feiruo/userChromeJS
// @downloadURL		https://github.com/feiruo/userChromeJS/FeiRuoBackup.uc.js
// @note            Begin 2016-07-25
// @note            备份、整合和还原文件
// @note            仅供个人测试、研究，作者不承担因使用此脚本对自己和他人造成任何形式的损失或伤害之任何责任。
// @version         0.0.1     2016.07.25 17:00    Building。
// ==/UserScript==
(function() {
	let {
		classes: Cc,
		interfaces: Ci,
		utils: Cu,
		results: Cr
	} = Components;
	if (!window.FileUtils) Cu.import("resource://gre/modules/FileUtils.jsm");
	const FileInputStream = Components.Constructor("@mozilla.org/network/file-input-stream;1", "nsIFileInputStream", "init");
	const ConverterInputStream = Components.Constructor("@mozilla.org/intl/converter-input-stream;1", "nsIConverterInputStream", "init");

	if (window.FeiRuoBackup) {
		window.FeiRuoBackup.onDestroy();
		delete window.FeiRuoBackup;
	}
	var FeiRuoBackup = {
		Prefs: Services.prefs.getBranch("userChromeJS.FeiRuoBackup."),
		BackList: [ //
			{
				Path: "ProfD", //路径 UChrm ProfD and so on
				File: "user.js", //文件名
				Type: "line", //读取方式 line-按行读取、json-作为json、sandbox
				Backup: false, //是否备份
				BackupOn: 0, //备份选项：0-启动和关闭，1-启动，2-关闭
				Recover: true, //是否还原
				RecoverOn: 0, //还原选项：0-启动和关闭，1-启动，2-关闭
				ReadFunc: function(val) { //读取转换函数，仅 line
					var matcher = val.match(/(\/\/)?([ ]*)?(user_)?pref\(([^,]*),(.*)\);([ ]*)?(\/\/(.*))?/i);
					if (!matcher) return;
					return {
						Ignore: matcher[1] == "//" ? true : false,
						Pref: matcher[3] || "",
						Key: matcher[4],
						Val: matcher[5],
						Notes: matcher[8]
					};
				},
				ToStrFunc: function(FileData, BackData) { //转为字符串函数
					var List = FeiRuoBackup.CheckDuplicate((FileData || []).concat(BackData || []), "Key"); //内置去重函数
					var str = "";
					for (var i in List) {
						if (!!List[i].Ignore) continue;
						var val = List[i].Val;
						str += List[i].Pref + 'pref(' + List[i].Key + ',' + val + ');' + (List[i].Notes ? (" //  " + List[i].Notes) : "") + "\n";
					}
					return str;
				}
			}, {
				Path: "ProfD",
				File: "logins.json",
				Type: "json",
				Backup: true,
				BackupOn: 0,
				Recover: true,
				RecoverOn: 0,
				ToStrFunc: function(FileData, BackData) {
					FileData = JSON.parse(FileData || '{"nextId": 1,"logins": [],"disabledHosts": [],"version": 1}');
					BackData = JSON.parse(BackData || '{"nextId": 1,"logins": [],"disabledHosts": [],"version": 1}');
					var NextId = FileData.nextId > BackData.nextId ? FileData.nextId : (BackData.nextId || FileData.nextId);
					var Logins = FeiRuoBackup.CheckDuplicate(FileData.logins.concat(BackData.logins));
					var DisabledHosts = FeiRuoBackup.CheckDuplicate(FileData.disabledHosts.concat(BackData.disabledHosts));
					return JSON.stringify({
						nextId: NextId,
						logins: Logins,
						disabledHosts: DisabledHosts,
						version: 1
					});
				}
			}
		],
		init: function() {
			var StartupTime = new Date();
			this.Debug = this.GetPrefs(0, "Debug", false);
			var ins = $("devToolsSeparator");
			ins.parentNode.insertBefore($C("menuitem", {
				id: "FeiRuoBackup_set",
				label: "备份还原文件",
				type: "checkbox",
				autoCheck: "false",
				oncommand: "FeiRuoBackup.Toggle(event);"
			}), ins);
			this.LoadSetting();
			this.Prefs.addObserver('', this.PrefsObs, false);
			window.addEventListener("unload", function() {
				FeiRuoBackup.onDestroy(FeiRuoBackup.Enable);
			}, false);
		},
		onDestroy: function(isAlert) {
			if (isAlert) this.Combination(isAlert);
			if ($("FeiRuoBackup_set")) $("FeiRuoBackup_set").parentNode.removeChild($("FeiRuoBackup_set"));
			Services.appinfo.invalidateCachesOnRestart();
			Services.obs.notifyObservers(null, "startupcache-invalidate", "");
		},
		PrefsObs: function(subject, topic, data) {
			if (topic == 'nsPref:changed') {
				switch (data) {
					case 'Debug':
					case 'Enable':
						FeiRuoBackup.LoadSetting(data);
						break;
				}
			}
		},
		LoadSetting: function(type) {
			if (!type || type === "Debug") this.Debug = this.GetPrefs(0, "Debug", false);
			if (!type || type === "Enable") {
				this.Enable = this.GetPrefs(0, "Enable", true);
				this.Enable && this.Combination();
				$("FeiRuoBackup_set") && $("FeiRuoBackup_set").setAttribute('checked', this.Enable);
			}
		},
		Toggle: function(event) {
			this.Enable = !this.Enable;
			this.Prefs.setBoolPref("Enable", this.Enable);
		},
		/*****************************************************************************************/
		Combination: function(isAlert) {
			var OrgFile, BackFile, FileData, BackData, NewData;
			for (var i in this.BackList) {
				var Rule = this.BackList[i];

				OrgFile = FileUtils.getFile(Rule.Path, [Rule.File]);
				BackFile = FileUtils.getFile("UChrm", ["lib", Rule.File]);

				FileData = this.LoadFile(OrgFile, Rule.Type, Rule.ReadFunc);
				BackData = this.LoadFile(BackFile, Rule.Type, Rule.ReadFunc);

				if (FileData != BackData) {
					if (Rule.Backup) {
						NewData = Rule.ToStrFunc(FileData, BackData);
						if (Rule.BackupOn == 0 || (Rule.BackupOn == 1 && !isAlert) || (Rule.BackupOn == 2 && isAlert))
							this.StrToFile(BackFile, NewData);
					} else
						NewData = Rule.ToStrFunc(BackData);

					if (Rule.Recover && (BackData && BackData != "")) {
						if (Rule.RecoverOn == 0 || (Rule.RecoverOn == 1 && !isAlert) || (Rule.RecoverOn == 2 && isAlert))
							this.StrToFile(OrgFile, NewData);
					}
				}
			}
		},
		CheckDuplicate: function(data, key) {
			if (!data) return;
			var obj = {};
			var New = [];
			key = key || "id";
			data.forEach(function(i) {
				switch (typeof i) {
					case 'object':
						if (!obj[i[key]]) {
							obj[i[key]] = true;
							New.push(i);
						}
						break;
					case 'string':
						if (!obj[i]) {
							obj[i] = true;
							New.push(i);
						}
						break;
					case 'undefined':
						break;
					default:
						break;
				}
			});
			return New;
		},
		/*****************************************************************************************/
		LoadFile: function(aFile, type, func) {
			if (!aFile || !aFile.exists() || !aFile.isFile()) return log("File does not exist.");
			var fileStream = new FileInputStream(aFile, 0x01, 0444, 0);
			var stream = new ConverterInputStream(fileStream, "UTF-8", 16384, Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
			var data = "";
			if (!type || type == "json" || type == "sandbox") {
				var str = {};
				while (stream.readString(0xffffffff, str) != 0) {
					data += str.value;
				}
				try {
					data = decodeURIComponent(escape(data));
				} catch (e) {}
			}
			if (type == "line") {
				stream = stream.QueryInterface(Ci.nsIUnicharLineInputStream);
				var line = {};
				var val = "";
				var cont;
				data = [];
				do {
					cont = stream.readLine(line);
					val = line.value;
					val = val.trim();
					val = func(val);
					!!val && data.push(val);
				} while (cont);
			}
			stream.close();
			if (type == "sandbox") {
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
					log(errmsg);
				}
				data = sandbox || null;
			}
			return data;
		},
		StrToFile: function(file, data) {
			var suConverter = Cc["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Ci.nsIScriptableUnicodeConverter);
			suConverter.charset = 'UTF-8';
			data = suConverter.ConvertFromUnicode(data);
			var foStream = Cc['@mozilla.org/network/file-output-stream;1'].createInstance(Ci.nsIFileOutputStream);
			foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);
			foStream.write(data, data.length);
			foStream.close();
		},
		GetPrefs: function(type, name, val) {
			switch (type) { //https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Preferences
				case 0:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_BOOL) this.Prefs.setBoolPref(name, val ? val : false);
					return this.Prefs.getBoolPref(name);
				case 1:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_INT) this.Prefs.setIntPref(name, val ? val : 0);
					return this.Prefs.getIntPref(name);
				case 2:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING) this.Prefs.setCharPref(name, val ? val : "");
					return this.Prefs.getCharPref(name);
				case 3:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING) this.Prefs.setComplexValue(name, Ci.nsILocalFile, makeURI(val).QueryInterface(Ci.nsIFileURL).file);
					return this.Prefs.getComplexValue(name, Ci.nsILocalFile);
				case 4:
					if (!this.Prefs.prefHasUserValue(name) || this.Prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING) {
						var aFile = Cc["@mozilla.org/pref-relativefile;1"].createInstance(Ci.nsIRelativeFilePref);
						aFile.relativeToKey = "UChrm";
						var path = Services.io.newFileURI(FileUtils.getDir("UChrm", '')).spec + val.replace(/^(\/\/|\\)/i, '').replace(/\\/ig, '/');
						aFile.file = makeURI(path).QueryInterface(Ci.nsIFileURL).file;
						this.Prefs.setComplexValue(name, Ci.nsIRelativeFilePref, aFile || this[name]);
					}
					return this.Prefs.getComplexValue(name, Ci.nsIRelativeFilePref).file;
				default:
					break;
			}
		}
	};

	/*****************************************************************************************/
	function log(str) {
		if (FeiRuoBackup.Debug) console.log("[FeiRuoBackup Debug] " + str);
	}

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}
	window.FeiRuoBackup = FeiRuoBackup;
	FeiRuoBackup.init();
})();

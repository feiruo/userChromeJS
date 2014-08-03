// ==UserScript==
// @name 			showFlagS
// @description		显示国旗与IP
// @author			ywzhaiqi、feiruo
// @compatibility	Firefox 16
// @charset			UTF-8
// @include			chrome://browser/content/browser.xul
// @id 				[FE89584D]
// @startup         window.showFlagS.init();
// @shutdown        window.showFlagS.onDestroy(true);
// @optionsURL		about:config?filter=showFlagS.
// @reviewURL		http://bbs.kafan.cn/thread-1666483-1-1.html
// @homepageURL		https://github.com/feiruo/userChromeJS/tree/master/showFlagS
// @note            Begin 2013-12-16
// @note            左键点击复制，中间刷新，右键弹出菜单
// @note            支持菜单和脚本设置重载
// @note            需要 _showFlagS.js 配置文件
// @version         1.6.0 		ReBuild。
// @version         1.5.8.3.4 	将存入perfs的选项移至脚本内，便于配置文件的理解,其他修复。
// @version         1.5.8.3.3 	修复因临时删除文件导致的错误。
// @version         1.5.8.3.2 	identity-box时错误页面智能隐藏，已查询到便显示，每查询到便隐藏。
// @version         1.5.8.3.1 	配置文件增加图标高度设置，identity-box时错误页面自动隐藏。
// @version         1.5.8.3 	修复图标切换错误的问题。
// @version         1.5.8.2 	修复FlagFox图标下，找不到图标就消失的问题，其他修改。
// @version         1.5.8.1 	配置文件加入一个图标大小的参数。
// @version         1.5.8 		修复菜单重复创建的BUG，查询源外置;可以丢弃旧版lib（不推荐）。
// @version         1.5.7		修改菜单和图标的创建方式，避免各种不显示，不弹出问题。
// @version         1.5.6 		将脚本设置也移到配置文件中，配置文件可以设置TIP显示条目，改变数据库文件等。
// @version         1.5.5 		增加flagfox扩展国旗图标库，相对路径profile\chrome\lib\isLocalFlags下，直接存放图标,支持实时切换。
// @version         1.5 		增体加右键菜单外部配置，配置方式和anoBtn一样，具请参考配置文件。
// @version         1.4 		增加几个详细信息；服务器没给出的就不显示。
// @version         1.3 		增加淘宝查询源，修复不显示图标，刷新、切换查询源时可能出现的图标提示消失等BUG
// @version         1.2.1 		修复identity-box时page-proxy-favicon的问题
// @version         1.2 		位置为identity-box时自动隐藏page-proxy-favicon，https显示
// @version         1.1 		设置延迟，增加本地文件图标。
// ==/UserScript==

/**
 * 参考 Show Location 扩展、Flagfox 扩展、http://files.cnblogs.com/ziyunfei/showFlag.uc.js
 */
location == "chrome://browser/content/browser.xul" && (function() {
	if (window.showFlagS) {
		window.showFlagS.onDestroy();
		delete window.showFlagS;
	}
	var showFlagS = {
		debug: true,
		configFile: "lib\\_showFlagS.js", // 菜单配置文件，相对路径： profile\chrome\lib\_showFlagS.js
		libIconPath: "lib\\countryflags.js", //旧版本地国旗图标库，相对路径： profile\chrome\lib\countryflags.js
		isExternalComparison: true, //外部对比
		BAK_FLAG_PATH: 'http://www.razerzone.com/asset/images/icons/flags/', //网络图标地址 http://www.1108.hk/images/ext/  http://www.myip.cn/images/country_icons/
		isFirstRun: true,
		apiSite: null,
		siteQueue: 0,
		siteApi: [],
		siteThx: [],
		dnsCache: [],
		isReqHash: [],
		isReqHash_tooltip: [],
		showFlagHash: [],
		showFlagTooltipHash: [],
		sfsRequstHeaderHash: [],
		sfsResPonseHeaderHash: [],
		// 等待时国旗图标
		DEFAULT_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=",

		get dns() {
			return Cc["@mozilla.org/network/dns-service;1"]
				.getService(Components.interfaces.nsIDNSService);
		},
		get eventqueue() {
			return Cc["@mozilla.org/thread-manager;1"].getService().mainThread;
		},
		get contentDoc() {
			return window.content.document;
		},
	};

	showFlagS.init = function() {
		this.makePopup();
		this.reload();
		this.onLocationChange();
		if (this.isFirstRun) {
			this.importLib(this.libIconPath);
			this.isFirstRun = !this.isFirstRun;
			window.addEventListener("unload", function() {
				showFlagS.onDestroy();
			}, false);
		}
		showFlagS.progressListener = {
			onLocationChange: function() {
				showFlagS.onLocationChange();
			},
			onProgressChange: function() {},
			onSecurityChange: function() {},
			onStateChange: function() {},
			onStatusChange: function() {}
		};
		window.getBrowser().addProgressListener(showFlagS.progressListener);
	};

	showFlagS.uninit = function() {
		this.removeMenu(this.showFlagSmenu);
		$("showFlagS-popup").parentNode.removeChild($("showFlagS-popup"));
		if (this.showFlagsPer.showLocationPos == "identity-box")
			$("page-proxy-favicon").style.visibility = "";
	};

	showFlagS.onDestroy = function(isAlert) {
		if (isAlert) this.uninit();
		window.getBrowser().removeProgressListener(showFlagS.progressListener);
	};

	showFlagS.makePopup = function() {
		let xml = '\
				<menupopup id="showFlagS-popup">\
				<menuitem label="复制信息" id="showFlagS-copy" oncommand="showFlagS.command(\'Copy\');" />\
				<menuitem label="刷新信息" id="showFlagS-reload" oncommand="showFlagS.onLocationChange(true);"/>\
				<menuitem label="详细信息" id="showFlagS-details" oncommand="showFlagS.showDetails(true);"/>\
				<menu label="脚本设置" id="showFlagS-set-config" class="showFlagS menu-iconic" image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAABlElEQVQ4jaXUSWtUQRQF4M9hYTuEuDAmGl0Yp0QkcQBFRFEXQhB3ATf+gKziwrU/wr8RcK04EY04JuBSQXQRhziEhEDAdDe6qKqkuuiHAQsOvHte3Vv3nlPvwRLqaKCZofEP/jOGxKCJb5jJ8BW/2/BfYs4sjokVv+MS9mU4gze4XPCn8BE/UoFmPG2/1rULkzhc8F14167AwWJjbywwUPDdeL+WDnoqOthRdtCIwTCOZLiIaVwt+PP4lBeoC2q/xpMML7EgCJnzLwTrW1yYxdnYdsJxvIon5vwgPrTT4EAxa3Khv+C7qkT8bxf6io09eIpDBd/WhZ8YEW5ZwhW8xbWCHxau9Jyg04oLz/EQjyKeYV5QPecfC+LeT90lF05ie4aBmHw6xp3Zu050YEOuQenCbqsurENNxVqLCxtxC6PYWVWgdKFbq403BL2m4vNerE8a/MJ1XMgwEjeni3RU+G8sYgK3cQ7+RNSxnKEeE9LXuAl3cQfbsBVb4B4eVGAce7KxxnCz1KCGzRWopTnj6seJPPkvhrmYqehLVdcAAAAASUVORK5CYII=">\
				<menupopup  id="showFlagS-set-popup">\
					<menuseparator id="showFlagS-sepalator1"/>\
					<menuitem label="外部信息对比" id="showFlagS-set-externalComparison" type="checkbox" oncommand="showFlagS.setPerfs(\'ExternalC\');" />\
					<menuitem label="脚本菜单配置" id="showFlagS-set-setMenu" tooltiptext="左键：重载配置|右键：编辑配置" onclick="if(event.button == 0){showFlagS.reload(true);}else if (event.button == 2) {showFlagS.command(\'Edit\');}" class="showFlagS menuitem-iconic" image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYElEQVQ4jY3TO0/VQRAF8F9yTUB6QMCCZ6KJBq4JNIQKCkoopAWMsabhC1ho5SOYaO2j0AQ+gYKPS/BeaDD0kPhJLP7nbzZA0ElOsjvnzOzOziyX2yjO8Ds4i++/bRgdzAUdjFwVMIkNDASP8QuDwXF8Nb+RGHAdb3GC72jhIxZxLViMbx/fon2XWKv4inHcx6OaQH8A3eFWot3DmmT8jImipF48y21aeI6+gp9IzA+Ywmu0k7mBF9jBDKaxjZfhxqN9k1hULepgLI90gHvFic34BqJtR6tM0D6XYKrgJ/FT1ZFa+3cu7mALR6mtkf2n3KKZ9auihMPs79aPuIvbxYn9SbIfbOFGwd/CF1XbPVC1ZARL2XdFOIihrLuwjuVod/EQevBeNXmt1P8BC6ohamA+moNojqPpqa/UxCZuBk8iKkf5abihaMsuXbBh1UvPBm3/+EznbRSnqm9c49Lv/AcsoU6W+qo3pgAAAABJRU5ErkJggg=="/>\
				</menupopup>\
				</menu>\
				<menuseparator id="showFlagS-sepalator2"/>\
				</menupopup>\
				';
		let range = document.createRange();
		range.selectNodeContents(document.getElementById("mainPopupSet"));
		range.collapse(false);
		range.insertNode(range.createContextualFragment(xml.replace(/\n|\t/g, "")));
		range.detach();
	};

	showFlagS.reload = function(isAlert) {
		var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
		aFile.appendRelativePath(this.configFile);
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
		if (!data) return;
		var sandbox = new Cu.Sandbox(new XPCNativeWrapper(window));
		sandbox.Components = Components;
		sandbox.Cc = Cc;
		sandbox.Ci = Ci;
		sandbox.Cr = Cr;
		sandbox.Cu = Cu;
		sandbox.Services = Services;
		sandbox.locale = Services.prefs.getCharPref("general.useragent.locale");
		try {
			Cu.evalInSandbox(data, sandbox, "1.8");
		} catch (e) {
			this.alert('Error: ' + e + '\n请重新检查配置文件');
			return;
		}

		this.removeMenu(this.showFlagSmenu);

		this.showFlagsPer = sandbox.showFlagsPer;
		this.showFlagSmenu = sandbox.showFlagSmenu;
		this.showFlagStipSet = sandbox.showFlagStipSet;
		this.showFlagSsiteSource = sandbox.showFlagSsiteSource;

		this.getPrefs();
		new this.buildIconMenu(this.showFlagSmenu, this.showFlagSsiteSource, this.showFlagsPer);

		this.setPerfs();
		if (isAlert) this.alert('配置已经重新载入');
	};

	showFlagS.removeMenu = function(menu) {
		try {
			for (i in menu) {
				$("main-menubar").insertBefore($(menu[i].id), $("main-menubar").childNodes[7]);
			}
		} catch (e) {}

		let sites = document.querySelectorAll("menuitem[id^='showFlagS-apiSite-']");
		for (let i = 0; i < sites.length; i++) {
			sites[i].parentNode.removeChild(sites[i]);
		}

		let menuitems = document.querySelectorAll("menuitem[id^='showFlagS-item-']");
		let menus = document.querySelectorAll("menu[id^='showFlagS-menu-']");

		if (!menuitems || !menus) return;
		for (let i = 0; i < menuitems.length; i++) {
			menuitems[i].parentNode.removeChild(menuitems[i]);
		}
		for (let i = 0; i < menus.length; i++) {
			menus[i].parentNode.removeChild(menus[i]);
		}
		try {
			$("showFlagS-icon").parentNode.removeChild($("showFlagS-icon"));
		} catch (e) {}
	};

	showFlagS.getPrefs = function() {
		this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("userChromeJS.showFlagS.");
		this._prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

		if (!this._prefs.prefHasUserValue("SourceSite") || this._prefs.getPrefType("SourceSite") != Ci.nsIPrefBranch.PREF_STRING)
			this._prefs.setCharPref("SourceSite", (this.showFlagSsiteSource ? (this.showFlagSsiteSource[0] ? this.showFlagSsiteSource[0].id : "taobao") : "taobao"));

		if (!this._prefs.prefHasUserValue("isExternalComparison") || this._prefs.getPrefType("isExternalComparison") != Ci.nsIPrefBranch.PREF_BOOL)
			this._prefs.setBoolPref("isExternalComparison", this.isExternalComparison)

		this.apiSite = this._prefs.getCharPref("SourceSite");
		this.isExternalComparison = this._prefs.getBoolPref("isExternalComparison");
	};

	showFlagS.setPerfs = function(tyep, val) {
		if (tyep == "apiSite") {
			this.apiSite = val;
			this._prefs.setCharPref("SourceSite", this.apiSite);
			$("showFlagS-apiSite-" + this.apiSite).setAttribute('checked', true);
		}
		if (tyep == "ExternalC") {
			this.isExternalComparison = !this.isExternalComparison;
			this._prefs.setBoolPref("isExternalComparison", this.isExternalComparison);
			$("showFlagS-set-externalComparison").setAttribute('checked', this.isExternalComparison);
		}
		for (var i = 0; i < this.showFlagSsiteSource.length; i++) {
			if (this.showFlagSsiteSource[i].id == this.apiSite) {
				this.siteQueue = i;
				this.siteApi = this.showFlagSsiteSource[i].inquireAPI;
			}
		}
		this.siteThx = Cc["@mozilla.org/network/effective-tld-service;1"].getService(Ci.nsIEffectiveTLDService).getBaseDomain(makeURI(this.siteApi));
		this.onLocationChange(true);
	};
	/*****************************************************************************************/
	showFlagS.showDetails = function(isTell) {};

	showFlagS.onLocationChange = function(forceRefresh) {
		if (forceRefresh) {
			this.forceRefresh = true;
		}
		try {
			var aLocation = this.contentDoc.location;
			if (this.showFlagsPer.showLocationPos == 'identity-box') {
				if ((aLocation.protocol !== "about:") && (aLocation.protocol !== "chrome:"))
					$('page-proxy-favicon').style.visibility = 'collapse';
				else
					$('page-proxy-favicon').style.visibility = 'visible';
				this.icon.hidden = ((aLocation.protocol == "about:") || (aLocation.protocol == "chrome:"));
			}
			if (aLocation && /file/.test(aLocation.protocol)) {
				this.icon.src = this.icon.image = this.showFlagsPer.File_Flag;
				this.icon.tooltipText = '本地文件' + "\n" + aLocation;
				return;
			}
			if (aLocation && aLocation.hostname == "localhost") {
				var obj = {};
				this.icon.src = this.icon.image = this.showFlagsPer.LocahHost_Flag;
				obj.locInfo = '回送地址，本机服务器';
				new showFlagS.updateTooltipText("127.0.0.1", aLocation.host, obj);
				return;
			}
			if (aLocation && /data/.test(aLocation.protocol)) {
				this.icon.src = this.icon.image = this.showFlagsPer.File_Flag;
				this.icon.tooltipText = 'Base64编码文件';
				return;
			}
			if (aLocation && aLocation.host && /tp/.test(aLocation.protocol)) {
				this.updateState(aLocation.host);
				return;
			}
			this.resetState();

		} catch (e) {
			this.resetState();
		}
	};

	showFlagS.updateState = function(host) {
		if (!this.forceRefresh && this.dnsCache[host]) {
			new this.lookupIP(this.dnsCache[host], host);
			return;
		}
		var dns_listener = {
			onLookupComplete: function(request, nsrecord, status) {
				var s_ip;
				if (status != 0 || !nsrecord.hasMore())
					s_ip = "0";
				else
					s_ip = nsrecord.getNextAddrAsString();
				showFlagS.dnsCache[host] = s_ip;
				new showFlagS.lookupIP(s_ip, host);
			}
		};
		try {
			this.dns.asyncResolve(host, 0, dns_listener, this.eventqueue);
		} catch (e) {}

		this.resetState();
	};

	showFlagS.resetState = function() {
		this.icon.src = this.icon.image = this.DEFAULT_Flag;
		this.icon.tooltipText = '';
		if (this.showFlagsPer.showLocationPos == 'identity-box') {
			this.icon.hidden = true;
			$('page-proxy-favicon').style.visibility = 'visible';
		}
	};

	showFlagS.lookupIP = function(ip, host) {
		this.inits.apply(this, arguments)
	}
	showFlagS.lookupIP.prototype = {
		inits: function(ip, host) {
			var self = showFlagS;
			if (ip == "0") {
				self.resetState();
				return;
			}
			if (ip == "127.0.0.1" || ip == "::1") {
				var obj = {};
				obj.locInfo = '回送地址，本机服务器';
				new showFlagS.updateTooltipText(ip, host, obj);
				self.icon.src = self.icon.image = self.showFlagsPer.LocahHost_Flag;
				if (self.showFlagsPer.showLocationPos == 'identity-box') {
					$('page-proxy-favicon').style.visibility = 'collapse';
					self.icon.hidden = false
				}
				return;
			}
			if (/^192.168.|169.254./.test(ip)) {
				var obj = {};
				obj.locInfo = '本地局域网服务器';
				new showFlagS.updateTooltipText(ip, host, obj);
				self.icon.src = self.icon.image = self.showFlagsPer.LAN_Flag;
				if (self.showFlagsPer.showLocationPos == 'identity-box') {
					$('page-proxy-favicon').style.visibility = 'collapse';
					self.icon.hidden = false
				}
				return;
			}
			this.flagFunc(!self.forceRefresh, ip, host);
			this.tooltipFunc(!self.forceRefresh, ip, host);
			self.forceRefresh = false;
		},
		flagFunc: function(checkCache, ip, host) {
			var self = showFlagS
			if (checkCache && self.showFlagHash[host]) {
				new self.updateIcon(host, self.showFlagHash[host]);
				return;
			}
			// 防止重复获取
			if (checkCache && self.isReqHash[host]) return;
			self.isReqHash[host] = true;
			if (self.apiSite == 'taobao')
				return;
			else
				self.lookupIP_taobao(ip, host);
		},
		tooltipFunc: function(checkCache, ip, host) {
			var self = showFlagS
			if (checkCache && self.showFlagTooltipHash[host]) {
				new self.updateTooltipText(ip, host, self.showFlagTooltipHash[host]);
				return;
			}
			if (checkCache && self.isReqHash_tooltip[host]) return;
			self.isReqHash_tooltip[host] = true;
			if (self.apiSite == 'taobao')
				self.lookupIP_taobao(ip, host);
			else
				new self.lookupIP_Info(ip, host, self.siteApi, self.siteQueue);
		},
	};

	showFlagS.updateIcon = function(host, countryCode, countryName) {
		this.inits.apply(this, arguments)
	}
	showFlagS.updateIcon.prototype = {
		inits: function(host, countryCode, countryName) {
			var self = showFlagS;
			if (host == self.contentDoc.location.host) {
				self.icon.hidden = false;
				var aLocation = self.contentDoc.location;
				if (showFlagS.showFlagsPer.showLocationPos == 'identity-box') {
					if (aLocation.protocol !== 'https:')
						$('page-proxy-favicon').style.visibility = 'collapse';
					else
						$('page-proxy-favicon').style.visibility = 'visible';
				}
				var src;
				if (countryCode === 'iana') {
					src = self.showFlagsPer.Unknown_Flag;
				} else {
					src = window.CountryFlags ? (this.getFlagFoxIconPath(countryCode) || CountryFlags[countryCode]) : this.getFlagFoxIconPath(countryCode);
					if (!src && window.CountryFlags && countryName) {
						contryCode = window.CountryNames && CountryNames[countryName];
						if (contryCode in CountryFlags) {
							src = CountryFlags[contryCode];
							self.showFlagHash[host] = contryCode;
						}
					}
					src = src || (self.BAK_FLAG_PATH + countryCode + ".gif") || self.showFlagsPer.Unknown_Flag;

					if (showFlagS.showFlagsPer.showLocationPos == 'identity-box') {
						if (src)
							$('page-proxy-favicon').style.visibility = 'collapse';
						else {
							$('page-proxy-favicon').style.visibility = 'visible';
							self.icon.hidden = true;
						}
					}
				}
				self.icon.src = self.icon.image = src;

			}
		},
		getFlagFoxIconPath: function(filename) {
			var localFlagPath = ("/lib/LocalFlags/" + filename + ".png").replace(/\//g, '\\');
			var fullPath = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties)
				.get("UChrm", Ci.nsILocalFile).path;
			if (/^(\\)/.test(localFlagPath)) {
				fullPath = fullPath + localFlagPath;
			} else {
				fullPath = fullPath + "\\" + localFlagPath;
			}
			var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
			file.initWithPath(fullPath);
			if (file.exists()) {
				return "file:///" + fullPath;
			}
		},
	};

	showFlagS.updateTooltipText = function(ip, host, obj) {
		this.inits.apply(this, arguments)
	}
	showFlagS.updateTooltipText.prototype = {
		inits: function(ip, host, obj) {
			var tooltipArr = [];
			// 跳过后台获取的情况
			if (host != showFlagS.contentDoc.location.host) return;
			obj || (obj = {});
			tooltipArr.push("域名：" + host);
			tooltipArr.push("网站IP：" + ip);
			var serverInfo = this.serverInfoTip();
			if (serverInfo !== "")
				tooltipArr.push(serverInfo);

			if (obj.locInfo)
				tooltipArr.push(obj.locInfo);

			if (obj.Site) {
				tooltipArr.push(obj.Site);
				tooltipArr.push('感谢：' + showFlagS.siteThx);
			}

			if (obj.taobao) {
				tooltipArr.push(obj.taobao);
				tooltipArr.push('感谢 淘宝(www.taobao.com)')
			}

			showFlagS.icon.tooltipText = tooltipArr.join('\n');
		},
		serverInfoTip: function() {
			var sTip = [];
			for (var i = 0; i < showFlagS.showFlagStipSet.length; i++) {
				var tip = this.getServInformation(showFlagS.showFlagStipSet[i].words);
				if (showFlagS.showFlagStipSet[i].regx) tip = showFlagS.showFlagStipSet[i].regx(tip);

				if (tip !== '未知类型')
					sTip.push(showFlagS.showFlagStipSet[i].label + tip);
			}
			return sTip.join('\n');
		},
		getServInformation: function(words) {
			var word;
			try {
				word = gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Ci.nsIHttpChannel).getResponseHeader(words).split("\n", 1)[0];
			} catch (e) {}
			return word || '未知类型';
		},
	};

	showFlagS.lookupIP_Info = function(ip, host, api, i) {
		this.doIt.apply(this, arguments);
	}
	showFlagS.lookupIP_Info.prototype = {
		doIt: function(ip, host, api, i) {
			var req = new XMLHttpRequest();
			req.open("GET", api + ip, true);
			req.send(null);
			var self = showFlagS;
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = self.showFlagsPer.Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var obj = self.showFlagSsiteSource[i].regulation(req.responseText);
					if (obj) {
						self.showFlagTooltipHash[host] = obj;
						new self.updateTooltipText(ip, host, obj);
					} else {
						onerror();
					}
				} else {
					onerror();
				}
			};
		}
	};

	showFlagS.lookupIP_taobao = function(ip, host, other) {
		var self = showFlagS;

		var req = new XMLHttpRequest();
		req.open("GET", 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, true);
		req.send(null);
		var onerror = function() {
			self.icon.src = self.showFlagsPer.Unknown_Flag;
			if (other || self.apiSite == 'taobao')
				self.icon.tooltipText = '无法查询，请刷新！';
		};
		req.onerror = onerror;
		req.timeout = self.showFlagsPer.Inquiry_Delay;
		req.ontimeout = onerror;
		req.onload = function() {
			if (req.status == 200) {
				var responseObj = JSON.parse(req.responseText);
				if (responseObj.code == 0) {
					var country_id = responseObj.data.country_id.toLocaleLowerCase();
					var addr = responseObj.data.country + responseObj.data.area;
					if (responseObj.data.region || responseObj.data.city || responseObj.data.county || responseObj.data.isp)
						addr = addr + '\n' + responseObj.data.region + responseObj.data.city + responseObj.data.county + responseObj.data.isp;
					var obj = {
						taobao: addr
					};
					if (other || self.apiSite == 'taobao') {
						self.showFlagTooltipHash[host] = obj;
						new self.updateTooltipText(ip, host, obj);
					}
					self.showFlagHash[host] = country_id;
					new self.updateIcon(host, country_id, responseObj.data.country);
				} else {
					onerror();
				}
			}
		};
	};

	showFlagS.alert = function(aString, aTitle) {
		Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "showFlagS", aString, false, "", null);
	};

	showFlagS.importLib = function(localFlagPath) {
		localFlagPath = localFlagPath.replace(/\//g, '\\');
		var fullPath = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties)
			.get("UChrm", Ci.nsILocalFile).path;
		if (/^(\\)/.test(localFlagPath)) {
			fullPath = fullPath + localFlagPath;
		} else {
			fullPath = fullPath + "\\" + localFlagPath;
		}

		var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
		file.initWithPath(fullPath);
		if (file.exists()) {
			userChrome.import(localFlagPath, "UChrm");
		}
	};

	showFlagS.command = function(type, url, arg0, arg1, arg2, arg3, arg4) {
		new this.doCommand(type, url, arg0, arg1, arg2, arg3, arg4);
	};

	showFlagS.doCommand = function(type, url, arg0, arg1, arg2, arg3, arg4) {
		this.inits.apply(this, arguments);
	}
	showFlagS.doCommand.prototype = {
		inits: function(type, url, arg0, arg1, arg2, arg3, arg4) {
			if (type == "Post")
				this.postData(url, arg0, arg1);
			else if (type == "Action")
				this.openAction(url, arg0, arg1, arg2, arg3, arg4);
			else if (type == "Copy")
				this.copy(url);
			else if (type == "Edit")
				this.editFile(url);
			else
				this.openTab(type, url, arg0, arg1, arg2, arg3, arg4);
		},
		copy: function(str) {
			str || (str = showFlagS.icon.tooltipText)
			Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper)
				.copyString(str);
		},
		openTab: function(url, urlt, arg0, arg1, arg2, arg3, arg4) {
			if (url)
				url = this.readOpenArg(url);
			else
				return;
			if (urlt = this.readOpenArg(urlt))
				url += urlt;

			if (arg0 = this.readOpenArg(arg0))
				url += arg0;

			if (arg1 = this.readOpenArg(arg1))
				url += arg1;

			if (arg2 = this.readOpenArg(arg2))
				url += arg2;

			if (arg3 = this.readOpenArg(arg3))
				url += arg3;

			if (arg4 = this.readOpenArg(arg4))
				url += arg4;

			gBrowser.selectedTab = gBrowser.addTab(url);
		},
		postData: function(aURI, aPostData) {

			var stringStream = Cc["@mozilla.org/io/string-input-stream;1"].
			createInstance(Ci.nsIStringInputStream);
			if ("data" in stringStream)
				stringStream.data = aPostData;
			else
				stringStream.setData(aPostData, aPostData.length);

			var postData = Cc["@mozilla.org/network/mime-input-stream;1"].
			createInstance(Ci.nsIMIMEInputStream);
			postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
			postData.addContentLength = true;
			postData.setData(stringStream);

			gBrowser.loadOneTab(aURI, null, null, postData, false);
		},
		openAction: function(url, fId, val, bId, bClass) {
			var wrap = {
				try: function(js) {
					return "try{" + js + "}catch(e){}";
				},
				delay: function(js) {
					return wrap.try("content.window.setTimeout(function(){" + wrap.try(js) + "},100);");
				},
				doOnLoad: function(js) {
					return wrap.try("let onLoad = function(){" +
						"removeEventListener('load',onLoad,true);" +
						wrap.try(js) +
						"};" +
						"addEventListener('load',onLoad,true);");
				},
				quotes: function(str) {
					return "\"" + str + "\"";
				},
				getElement: function(id) {
					const selector = "form #" + id;
					return "content.window.document.querySelector(" + wrap.quotes(selector) + ")";
				},
				getElementC: function(id) {
					const selector = "form ." + id;
					return "content.window.document.querySelector(" + wrap.quotes(selector) + ")";
				}
			};

			function openURL(url) {
				var browser = window.getBrowser();
				try {
					window.TreeStyleTabService.readyToOpenChildTab(browser.selectedTab);
				} catch (e) {}
				var newTab = browser.addTab(url, {
					ownerTab: browser.selectedTab,
					relatedToCurrent: true
				});
				browser.selectedTab = newTab;
				return browser.getBrowserForTab(newTab);
			}

			var contentScript = wrap.getElement(fId) + ".value = " + wrap.quotes(this.readOpenArg(val)) + ";";
			if (bId)
				contentScript += wrap.delay(wrap.getElement(bId) + ".click();")
			else if (bClass)
				contentScript += wrap.delay(wrap.getElementC(bClass) + ".click();")
			contentScript = "data:text/javascript," + encodeURIComponent(wrap.doOnLoad(contentScript));

			var targetBrowser = openURL(url);
			targetBrowser.messageManager.loadFrameScript(contentScript, false);
		},
		readOpenArg: function(str) {
			var uri = showFlagS.contentDoc.location,
				ip = showFlagS.dnsCache[uri.host];

			if (str == 'host')
				str = uri.host;

			if (str == 'ip' && ip)
				str = ip;

			if (str == "basedomain") {
				var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].
				getService(Components.interfaces.nsIEffectiveTLDService);
				var basedomain = eTLDService.getBaseDomain(makeURI(uri.href));
				str = basedomain;
			}

			if (str == 'url')
				str = uri.href;

			return str;
		},
		editFile: function(file) {
			var file = file || showFlagS.configFile;
			var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
			aFile.appendRelativePath(file);
			if (!aFile || !aFile.exists() || !aFile.isFile()) return;
			var editor;
			try {
				editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
			} catch (e) {
				showFlagS.alert("请设置编辑器的路径。\nview_source.editor.path");
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
				showFlagS.alert("编辑器不正确！")
			}
		},
	};

	showFlagS.buildIconMenu = function(menu, siteSource, iconPref) {
		this.inits.apply(this, arguments);
	}
	showFlagS.buildIconMenu.prototype = {
		inits: function(menu, siteSource, iconPref) {
			this.buildFreedomMenu(menu);
			this.buildSiteMenu(siteSource);
			this.addIcon(iconPref);
		},
		addIcon: function(iconPref) {
			if (iconPref.showLocationPos == 'identity-box' || iconPref.showLocationPos == 'urlbar-icons') {
				showFlagS.icon = $(iconPref.showLocationPos).appendChild($C('image', {
					id: 'showFlagS-icon',
					context: 'showFlagS-popup'
				}));
			} else {
				showFlagS.icon = $(iconPref.showLocationPos).appendChild($C("toolbarbutton", {
					id: "showFlagS-icon",
					class: "toolbarbutton-1 chromeclass-toolbar-additional", //statusbarpanel-iconic
					removable: true,
					context: "showFlagS-popup",
				}));
			}

			if (iconPref.showLocationPos == "identity-box") {
				showFlagS.icon.style.marginLeft = "4px";
				showFlagS.icon.style.marginRight = "2px";
			}

			showFlagS.icon.src = showFlagS.icon.image = showFlagS.DEFAULT_Flag;

			showFlagS.icon.addEventListener("click", function(event) {
				if (event.button == 0) {
					showFlagS.command('Copy');
				} else if (event.button == 1) {
					showFlagS.onLocationChange(true);
				}
			}, false);

			//$("showFlagS-popup").setAttribute('position', iconPref.iconMenuPosition);
			$("showFlagS-set-externalComparison").setAttribute('checked', showFlagS.isExternalComparison);
			$("showFlagS-apiSite-" + showFlagS.apiSite).setAttribute('checked', true);
		},
		buildSiteMenu: function(siteSource) {
			var menu = $("showFlagS-set-popup");
			var separator = $("showFlagS-sepalator1");
			var defmenuitem = menu.appendChild($C("menuitem", {
				label: "淘宝 查询源",
				id: "showFlagS-apiSite-taobao",
				class: "showFlagS-apiSite-item",
				type: "radio",
				oncommand: "showFlagS.setPerfs('apiSite','taobao');"
			}));
			menu.insertBefore(defmenuitem, separator);

			for (var i = 0; i < siteSource.length; i++) {
				var menuitem = menu.appendChild($C("menuitem", {
					label: siteSource[i].label,
					id: "showFlagS-apiSite-" + siteSource[i].id,
					class: "showFlagS-apiSite-item",
					type: "radio",
					oncommand: "showFlagS.setPerfs('apiSite','" + siteSource[i].id + "');"
				}));
				menu.insertBefore(menuitem, defmenuitem);
			};
		},
		buildFreedomMenu: function(menu) {
			var popup = $("showFlagS-popup");
			var obj, menuitem;
			for (var i = 0; i < menu.length; i++) {
				obj = menu[i];
				menuitem = $(obj.id);
				if (menuitem) {
					for (let [key, val] in Iterator(obj)) {
						if (typeof val == "function") obj[key] = val = "(" + val.toSource() + ").call(this, event);";
						menuitem.setAttribute(key, val);
					}
					menuitem.classList.add("showFlagS");
					menuitem.classList.add("menu-iconic");
				} else {
					menuitem = obj.child ? this.newMenu(obj, i) : this.newMenuitem(obj, i);
				}
				popup.appendChild(menuitem);
			}
		},
		newMenu: function(menuObj, i) {
			var menu = document.createElement("menu");
			var popup = menu.appendChild(document.createElement("menupopup"));
			for (let [key, val] in Iterator(menuObj)) {
				if (key === "child") continue;
				if (typeof val == "function") menuObj[key] = val = "(" + val.toSource() + ").call(this, event);"
				menu.setAttribute(key, val);
				menu.setAttribute("id", "showFlagS-menu-" + i);
			}

			menuObj.child.forEach(function(obj) {
				popup.appendChild(this.newMenuitem(obj));
			}, this);
			let cls = menu.classList;
			cls.add("showFlagS");
			cls.add("menu-iconic");
			return menu;
		},
		newMenuitem: function(obj, i) {
			var menuitem;
			if (obj.label === "separator" || (!obj.label && !obj.text && !obj.oncommand && !obj.command))
				menuitem = document.createElement("menuseparator");
			else
				menuitem = document.createElement("menuitem");

			for (let [key, val] in Iterator(obj)) {
				if (typeof val == "function") obj[key] = val = "(" + val.toSource() + ").call(this, event);";
				menuitem.setAttribute(key, val);
				menuitem.setAttribute("id", "showFlagS-item-" + i);
			}
			var cls = menuitem.classList;
			cls.add("showFlagS");
			cls.add("menuitem-iconic");

			if (obj.oncommand || obj.command) return menuitem;

			if (obj.exec) {
				obj.exec = this.handleRelativePath(obj.exec);
			}

			menuitem.setAttribute("oncommand", "showFlagS.onCommand(event);");
			this.setIcon(menuitem, obj);
			return menuitem;
		},
		setIcon: function(menu, obj) {
			if (menu.hasAttribute("src") || menu.hasAttribute("image") || menu.hasAttribute("icon")) return;

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
		},
		onCommand: function(event) {
			var menuitem = event.target;
			var text = menuitem.getAttribute("text") || "";
			var exec = menuitem.getAttribute("exec") || "";
			if (exec) this.exec(exec, this.convertText(text));
		},
		exec: function(path, arg) {
			var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
			var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
			try {
				var a = (typeof arg == 'string' || arg instanceof String) ? arg.split(/\s+/) : [arg];
				file.initWithPath(path);

				if (!file.exists()) {
					Cu.reportError('File Not Found: ' + path);
					return;
				}

				if (file.isExecutable()) {
					process.init(file);
					process.run(false, a, a.length);
				} else {
					file.launch();
				}

			} catch (e) {}
		},
		convertText: function(text) {
			text = text.toLocaleLowerCase().replace("%u", content.location.href);
			return text;
		},
		handleRelativePath: function(path) {
			if (path) {
				path = path.replace(/\//g, '\\').toLocaleLowerCase();
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
		}
	};

	function log(str) {
		if (showFlagS.debug) Application.console.log("[showFlagS] " + Array.slice(arguments));
	}

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	showFlagS.init();
	window.showFlagS = showFlagS;
})()
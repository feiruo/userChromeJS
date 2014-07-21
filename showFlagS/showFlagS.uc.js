// ==UserScript==
// @name 			showFlagS.uc.js
// @description		显示国旗与IP
// @author			ywzhaiqi、feiruo
// @compatibility	Firefox 16
// @include			chrome://browser/content/browser.xul
// @charset			UTF-8
// @version			1.5.8.3.3
// @update 			2014-07-21
// @note            Begin 2013-12-16
// @note            左键点击复制，右键弹出菜单。需要 _showFlagS.js 配置文件
// @reviewURL		http://bbs.kafan.cn/thread-1666483-1-1.html
// @homepageURL		https://github.com/feiruo/userChromeJS/tree/master/showFlagS
// @optionsURL		about:config?filter=showFlagS.
// @note            1.5.8.3.3 	修复因临时删除数据文件导致的错误。
// @note            1.5.8.3.2 	identity-box时错误页面智能隐藏，已查询到便显示，每查询到便隐藏。
// @note            1.5.8.3.1 	配置文件增加图标高度设置，identity-box时错误页面自动隐藏。
// @note            1.5.8.3 	修复图标切换错误的问题。
// @note            1.5.8.2 	修复FlagFox图标下，找不到图标就消失的问题，其他修改。
// @note            1.5.8.1 	配置文件加入一个图标大小的参数。
// @note            1.5.8 		修复菜单重复创建的BUG，查询源外置;可以丢弃旧版lib（不推荐）。
// @note            1.5.7		修改菜单和图标的创建方式，避免各种不显示，不弹出问题。
// @note            1.5.6 		将脚本设置也移到配置文件中，配置文件可以设置TIP显示条目，改变数据库文件等。
// @note            1.5.5 		增加flagfox扩展国旗图标库，相对路径profile\chrome\lib\flagfoxflags下，直接存放图标,支持实时切换。
// @note            1.5 		增体加右键菜单外部配置，配置方式和anoBtn一样，具请参考配置文件。
// @note            1.4 		增加几个详细信息；服务器没给出的就不显示。
// @note            1.3 		增加淘宝查询源，修复不显示图标，刷新、切换查询源时可能出现的图标提示消失等BUG
// @note            1.2.1 		修复identity-box时page-proxy-favicon的问题
// @note            1.2 		位置为identity-box时自动隐藏page-proxy-favicon，https显示
// @note            1.1 		设置延迟，增加本地文件图标。
// ==/UserScript==

/**
 * 参考 Show Location 扩展、Flagfox 扩展、http://files.cnblogs.com/ziyunfei/showFlag.uc.js
 */

location == "chrome://browser/content/browser.xul" && (function() {

	// 菜单配置文件，相对路径： profile\chrome\lib\_showFlagS.js
	var showFlagSconfigFile = "lib\\_showFlagS.js";

	// 等待时国旗图标
	var DEFAULT_Flag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=";

	window.showFlagS = {
		siteNB: null,
		siteApi: null,
		siteThx: null,
		dnsCache: [],
		isReqHash: [],
		isReqHash_tooltip: [],
		showFlagHash: [],
		showFlagTooltipHash: [],

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

		init: function() {
			this.makePopup();
			this.reBuild();
			this.onLocationChange();
			this.progressListener = {
				onLocationChange: function() {
					showFlagS.onLocationChange();
				},
				onProgressChange: function() {},
				onSecurityChange: function() {},
				onStateChange: function() {},
				onStatusChange: function() {}
			};
			window.getBrowser().addProgressListener(this.progressListener);

			window.addEventListener("unload", function() {
				showFlagS.onDestroy();
			}, false);
		},
		onDestroy: function() {
			window.getBrowser().removeProgressListener(this.progressListener);
		},
		makePopup: function() {
			let xml = '\
						<menupopup id="showFlagS-popup">\
						<menuitem label="复制信息" id="showFlagS-copy" oncommand="showFlagS.copy();" />\
						<menuitem label="刷新信息" id="showFlagS-reload" oncommand="showFlagS.onLocationChange(true);"/>\
						<menu label="脚本设置" id="showFlagS-set-config" class="showFlagS menu-iconic" image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAWCAYAAADJqhx8AAABlElEQVQ4jaXUSWtUQRQF4M9hYTuEuDAmGl0Yp0QkcQBFRFEXQhB3ATf+gKziwrU/wr8RcK04EY04JuBSQXQRhziEhEDAdDe6qKqkuuiHAQsOvHte3Vv3nlPvwRLqaKCZofEP/jOGxKCJb5jJ8BW/2/BfYs4sjokVv+MS9mU4gze4XPCn8BE/UoFmPG2/1rULkzhc8F14167AwWJjbywwUPDdeL+WDnoqOthRdtCIwTCOZLiIaVwt+PP4lBeoC2q/xpMML7EgCJnzLwTrW1yYxdnYdsJxvIon5vwgPrTT4EAxa3Khv+C7qkT8bxf6io09eIpDBd/WhZ8YEW5ZwhW8xbWCHxau9Jyg04oLz/EQjyKeYV5QPecfC+LeT90lF05ie4aBmHw6xp3Zu050YEOuQenCbqsurENNxVqLCxtxC6PYWVWgdKFbq403BL2m4vNerE8a/MJ1XMgwEjeni3RU+G8sYgK3cQ7+RNSxnKEeE9LXuAl3cQfbsBVb4B4eVGAce7KxxnCz1KCGzRWopTnj6seJPPkvhrmYqehLVdcAAAAASUVORK5CYII=">\
						<menupopup  id="showFlagS-set-popup">\
							<menuseparator id="showFlagS-sepalator1"/>\
							<menuitem label="使用本地图标" id="showFlagS-set-foxFlag" type="checkbox" oncommand="showFlagS.showflagSset(\'isFlagFoxFlags\');" />\
							<menuitem label="脚本菜单配置" id="showFlagS-set-setMenu" tooltiptext="左键：重载配置\r\n右键：编辑配置" onclick="if(event.button == 0){showFlagS.reBuild(true);}else if (event.button == 2) {showFlagS.editFile();}"/>\
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
		},
		reBuild: function(isAlert) {
			var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
			aFile.appendRelativePath(showFlagSconfigFile);
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
			this.showFlagsPer = sandbox.showFlagsPer;
			this.showFlagSmenu = sandbox.showFlagSmenu;
			this.showFlagStipSet = sandbox.showFlagStipSet;
			this.showFlagSsiteSource = sandbox.showFlagSsiteSource;

			if (this.showFlagsPer.libIcon)
				this.importLib(this.showFlagsPer.libIconPath);

			this.uninit();
			this.geitPrefs();
			this.buildSiteMenu();
			this.buildMenu();
			this.addIcon();
			this.showflagSset();
			this.onLocationChange(true);
			if (isAlert) this.alert('配置已经重新载入');
		},
		uninit: function() {
			try {
				var obj = this.showFlagSmenu[i];
				$("main-menubar").insertBefore($(obj.id), $("main-menubar").childNodes[7]);
			} catch (e) {}

			let sites = document.querySelectorAll("menuitem[id^='showFlagS-site-']");
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

		},
		geitPrefs: function() {
			this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("userChromeJS.showFlagS.");
			this._prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

			if (!this._prefs.prefHasUserValue("SourceSite")) {
				this._prefs.setCharPref("SourceSite", this.showFlagsPer.site);
			} else {
				this.showFlagsPer.site = this._prefs.getCharPref("SourceSite");
			}

			if (!this._prefs.prefHasUserValue("flagFoxFlags")) {
				this._prefs.setBoolPref("flagFoxFlags", this.showFlagsPer.isFlagFoxFlags);
			} else {
				this.showFlagsPer.isFlagFoxFlags = this._prefs.getBoolPref("flagFoxFlags");
			}
		},
		addIcon: function() {
			if (this.showFlagsPer.showLocationPos == 'identity-box' || this.showFlagsPer.showLocationPos == 'urlbar-icons') {
				this.icon = $(this.showFlagsPer.showLocationPos).appendChild($C('image', {
					id: 'showFlagS-icon',
					context: 'showFlagS-popup'
				}));
			} else {
				this.icon = $(this.showFlagsPer.showLocationPos).appendChild($C(this.showFlagsPer.iconType, {
					id: "showFlagS-icon",
					class: this.showFlagsPer.iconClass,
					removable: true,
					context: "showFlagS-popup",
				}));
			}

			if (this.showFlagsPer.showLocationPos == "identity-box") {
				this.icon.style.marginLeft = "4px";
				this.icon.style.marginRight = "2px";
			}
			this.icon.style.width = this.showFlagsPer.iconStyleWidth;
			if (this.showFlagsPer.iconStyleHeight)
				this.icon.style.height = this.showFlagsPer.iconStyleHeight;

			this.icon.src = this.icon.image = DEFAULT_Flag;

			// 点击复制
			this.icon.addEventListener("click", function(event) {
				if (event.button == 0) {
					showFlagS.copy();
				} else if (event.button == 1) {
					showFlagS.onLocationChange(true);
				}
			}, false);

			$("showFlagS-popup").setAttribute('position', this.showFlagsPer.iconMenuPosition);
			$("showFlagS-set-foxFlag").setAttribute('checked', this.showFlagsPer.isFlagFoxFlags);
			$("showFlagS-set-foxFlag").setAttribute('value', this.showFlagsPer.isFlagFoxFlags);
			$("showFlagS-site-" + this.showFlagsPer.site).setAttribute('checked', true);
		},
		showflagSset: function(tyep, val) {
			if (tyep == "isFlagFoxFlags") {
				this.showFlagsPer.isFlagFoxFlags = !this.showFlagsPer.isFlagFoxFlags;
				this._prefs.setBoolPref("flagFoxFlags", this.showFlagsPer.isFlagFoxFlags);
				$("showFlagS-set-foxFlag").setAttribute('checked', this.showFlagsPer.isFlagFoxFlags);
			}
			if (tyep == "site") {
				this.showFlagsPer.site = val;
				this._prefs.setCharPref("SourceSite", this.showFlagsPer.site);
				$("showFlagS-site-" + this.showFlagsPer.site).setAttribute('checked', true);
			}

			for (var i = 0; i < this.showFlagSsiteSource.length; i++) {
				if (this.showFlagSsiteSource[i].id == this.showFlagsPer.site) {
					this.siteNB = i;
					this.siteApi = this.showFlagSsiteSource[i].inquireAPI;
				}
			}

			if (this.showFlagSsiteSource[this.siteNB].id !== "myip")
				this.siteThx = Cc["@mozilla.org/network/effective-tld-service;1"].getService(Ci.nsIEffectiveTLDService).getBaseDomain(makeURI(this.siteApi));

			this.onLocationChange(true);
		},
		onLocationChange: function(forceRefresh) {
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
				if (aLocation && aLocation.host && /tp/.test(aLocation.protocol)) {
					this.updateState(aLocation.host);
				} else if (aLocation && /file/.test(aLocation.protocol)) {
					this.icon.src = this.icon.image = this.showFlagsPer.File_Flag;
					this.icon.tooltipText = '本地文件' + "\n" + aLocation;
				} else {
					this.resetState();
				}
			} catch (e) {
				this.resetState();
			}
		},
		updateState: function(host) {
			if (!this.forceRefresh && this.dnsCache[host]) {
				this.lookupIP(this.dnsCache[host], host);
				return;
			}

			var self = this;
			var dns_listener = {
				onLookupComplete: function(request, nsrecord, status) {
					var s_ip; //server ip
					if (status != 0 || !nsrecord.hasMore())
						s_ip = "0";
					else
						s_ip = nsrecord.getNextAddrAsString();
					self.dnsCache[host] = s_ip;
					self.lookupIP(s_ip, host);
				}
			};
			try {
				this.dns.asyncResolve(host, 0, dns_listener, this.eventqueue);
			} catch (e) {}

			// 提前重置，防止 DNS 查找很久而造成的图标延迟
			this.resetState();
		},
		resetState: function() {
			this.icon.src = this.icon.image = DEFAULT_Flag;
			this.icon.tooltipText = '';
			if (this.showFlagsPer.showLocationPos == 'identity-box') {
				this.icon.hidden = true;
				$('page-proxy-favicon').style.visibility = 'visible';
			}
		},
		lookupIP: function(ip, host) {
			if (ip == "0") {
				this.resetState();
				return;
			}

			var self = this;

			var nt, api;


			var flagFunc = function(checkCache) {
				if (checkCache && self.showFlagHash[host]) {
					self.updateIcon(host, self.showFlagHash[host]);
					return;
				}

				// 防止重复获取
				if (checkCache && self.isReqHash[host]) return;
				self.isReqHash[host] = true;
				if (self.showFlagsPer.site == 'myip' || self.showFlagsPer.site == 'taobao')
					return;
				else
					self.lookupIP_taobao(ip, host);
			};

			var tooltipFunc = function(checkCache) {
				if (checkCache && self.showFlagTooltipHash[host]) {
					self.updateTooltipText(ip, host, self.showFlagTooltipHash[host]);
					return;
				}

				// 防止重复获取
				if (checkCache && self.isReqHash_tooltip[host]) return;
				self.isReqHash_tooltip[host] = true;

				if (self.showFlagsPer.site == 'myip')
					self.lookupIP_myip(ip, host);

				else if (self.showFlagsPer.site == 'taobao')
					self.lookupIP_taobao(ip, host);
				else
					self.lookupIP_Info(ip, host, self.siteApi, self.siteNB);
			};

			flagFunc(!this.forceRefresh);
			tooltipFunc(!this.forceRefresh);
			this.forceRefresh = false;
		},
		updateIcon: function(host, countryCode, countryName) {
			// 跳过后台获取的情况
			if (host == this.contentDoc.location.host) {
				this.icon.hidden = false;
				var aLocation = this.contentDoc.location;
				if (showFlagS.showFlagsPer.showLocationPos == 'identity-box') {
					if (aLocation.protocol !== 'https:')
						$('page-proxy-favicon').style.visibility = 'collapse';
					else
						$('page-proxy-favicon').style.visibility = 'visible';
				}
				var src;
				if (countryCode.indexOf('http://') == 0) {
					if (countryCode.indexOf('http://www.myip.cn/images/country_icons/') == 0)
						src = countryCode;
					else
						src = this.showFlagsPer.Unknown_Flag;
				} else if (countryCode === 'iana') {
					src = this.showFlagsPer.Unknown_Flag;
				} else {
					if ((window.CountryFlags && this.showFlagsPer.libIcon) || this.showFlagsPer.isFlagFoxFlags) {

						if (this.showFlagsPer.isFlagFoxFlags)
							src = (window.CountryFlags && this.showFlagsPer.libIcon) ? (this.getFlagFoxIconPath(countryCode) || CountryFlags[countryCode]) : this.getFlagFoxIconPath(countryCode);
						else
							src = CountryFlags[countryCode];

						if (!src && window.CountryFlags && this.showFlagsPer.libIcon && countryName) {
							//如果 countryCode 无法找到图标，再次用 countryName 查找
							contryCode = window.CountryNames && CountryNames[countryName];
							if (contryCode in CountryFlags) {
								src = CountryFlags[contryCode];
								this.showFlagHash[host] = contryCode;
							}
						}
					}
					src = src || (this.showFlagsPer.BAK_FLAG_PATH + countryCode + ".gif") || this.showFlagsPer.Unknown_Flag;

					if (src && (showFlagS.showFlagsPer.showLocationPos == 'identity-box'))
						$('page-proxy-favicon').style.visibility = 'collapse';
					else {
						$('page-proxy-favicon').style.visibility = 'visible';
						this.icon.hidden = true;
					}
				}
				this.icon.src = this.icon.image = src;
			}
		},
		getServInformation: function(words) {
			var word;
			try {
				word = gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Ci.nsIHttpChannel).getResponseHeader(words).split("\n", 1)[0];
			} catch (e) {}
			return word || '未知类型';
		},
		updateTooltipText: function(ip, host, obj) {
			// 跳过后台获取的情况
			if (host != this.contentDoc.location.host) return;

			obj || (obj = {});
			var tooltipArr = [],
				isIpTip;

			for (var i = 0; i < this.showFlagStipSet.length; i++) {
				var tip = this.showFlagStipSet[i].words,
					tipp;
				tipp = this.getServInformation(tip);
				if (tip == "ip") isIpTip = tipp = ip;
				if (tip == "host") tipp = host;
				if (this.showFlagStipSet[i].regx) tipp = this.showFlagStipSet[i].regx(tipp);

				if (tipp !== '未知类型')
					tooltipArr.push(this.showFlagStipSet[i].label + tipp);
			};

			if (!isIpTip)
				tooltipArr.push("网站IP：" + ip);

			if (obj.Site) {
				tooltipArr.push(obj.Site);
				tooltipArr.push('感谢：' + this.siteThx);
			}

			if (obj.myipS) {
				tooltipArr.push(obj.myipS);
				tooltipArr.push('感谢 Myip(www.myip.cn)');
			}

			if (obj.taobao) {
				tooltipArr.push(obj.taobao);
				tooltipArr.push('感谢 淘宝(www.taobao.com)')
			}
			this.icon.tooltipText = tooltipArr.join('\n');
		},

		lookupIP_Info: function(ip, host, api, i) {
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
						self.updateTooltipText(ip, host, obj);
					} else {
						onerror();
					}
				} else {
					onerror();
				}
			};
		},
		lookupIP_taobao: function(ip, host, other) {
			var self = showFlagS;

			var req = new XMLHttpRequest();
			req.open("GET", 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.icon.src = self.showFlagsPer.Unknown_Flag;
				if (other || self.showFlagsPer.site == 'taobao')
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
						if (other || self.showFlagsPer.site == 'taobao') {
							self.showFlagTooltipHash[host] = obj;
							self.updateTooltipText(ip, host, obj);
						}
						self.showFlagHash[host] = country_id;
						self.updateIcon(host, country_id, responseObj.data.country);
					} else {
						onerror();
					}
				}
			};
		},
		lookupIP_myip: function(ip, host) {
			var req = new XMLHttpRequest();
			req.open("GET", 'http://www.myip.cn/' + ip, true);
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
					var myip_addr, myip_flag;
					var addr_pos = req.responseText.indexOf("来自");
					myip_addr = req.responseText.substring(addr_pos + 4);
					myip_addr = myip_addr.substring(0, myip_addr.indexOf("."));
					if (myip_addr.indexOf("&nbsp;") !== -1)
						myip_addr = myip_addr.substring(0, myip_addr.indexOf("&nbsp;"));
					if (myip_addr.indexOf("<") !== -1)
						myip_addr = myip_addr.substring(0, myip_addr.indexOf("<"));
					if (myip_addr.indexOf("\r\n\t\t") !== -1)
						myip_addr = myip_addr.substring(0, myip_addr.indexOf("\r\n\t\t"));

					var myflag = req.responseText.indexOf("res_ipen_0");
					flagSrc = req.responseText.substring(myflag + 39);
					flagSrc = "http://www.myip.cn/" + flagSrc.substring(0, flagSrc.indexOf(">"));

					var obj = {
						myipS: myip_addr
					};

					self.showFlagHash[host] = flagSrc;
					self.updateIcon(host, flagSrc);

					self.showFlagTooltipHash[host] = obj;
					self.updateTooltipText(ip, host, obj);
				} else {
					onerror();
				}
			};
		},
		alert: function(aString, aTitle) {
			Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "showFlagS", aString, false, "", null);
		},
		getFlagFoxIconPath: function(filename) {
			localFlagPath = (this.showFlagsPer.flagFoxFlags + filename + ".png").replace(/\//g, '\\');
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
		copy: function(str) {
			str || (str = this.icon.tooltipText)

			Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper)
				.copyString(str);
		},
		open: function(url, type) {
			var uri = this.contentDoc.location.href,
				host = this.contentDoc.location.host,
				ip = this.dnsCache[host];

			if (type == 'host')
				url += host;
			else if (type == 'ip' && ip)
				url += ip
			else if (type == "basedomain") {
				var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].
				getService(Components.interfaces.nsIEffectiveTLDService);
				var basedomain = eTLDService.getBaseDomain(makeURI(uri));
				url += basedomain
			} else if (type == 'url')
				url += uri
			else
				url += type
			gBrowser.selectedTab = gBrowser.addTab(url);
		},
		buildSiteMenu: function() {
			var menu = $("showFlagS-set-popup");
			var separator = $("showFlagS-sepalator1");
			var defmenuitem = menu.appendChild($C("menuitem", {
				label: "淘宝 查询源",
				id: "showFlagS-site-taobao",
				class: "showFlagS-site-item",
				type: "radio",
				oncommand: "showFlagS.showflagSset('site','taobao');"
			}));
			menu.insertBefore(defmenuitem, separator);

			for (var i = 0; i < this.showFlagSsiteSource.length; i++) {
				var menuitem = menu.appendChild($C("menuitem", {
					label: this.showFlagSsiteSource[i].label,
					id: "showFlagS-site-" + this.showFlagSsiteSource[i].id,
					class: "showFlagS-site-item",
					type: "radio",
					oncommand: "showFlagS.showflagSset('site','" + this.showFlagSsiteSource[i].id + "');"
				}));
				menu.insertBefore(menuitem, defmenuitem);
			};
		},
		buildMenu: function() {
			var popup = $("showFlagS-popup");
			var obj, menuitem;
			for (var i = 0; i < this.showFlagSmenu.length; i++) {
				obj = this.showFlagSmenu[i];
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
		convertText: function(text) {
			text = text.toLocaleLowerCase().replace("%u", content.location.href);
			return text;
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

			} catch (e) {
				log(e);
			}
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
		},
		editFile: function() {
			var aFile = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIDirectoryService).QueryInterface(Ci.nsIProperties).get('UChrm', Ci.nsILocalFile);
			aFile.appendRelativePath(showFlagSconfigFile);
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
		importLib: function(localFlagPath) {
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
		},
	};

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

	function log() {
		Application.console.log("[showFlagS] " + Array.slice(arguments));
	}
})()
window.showFlagS.init();
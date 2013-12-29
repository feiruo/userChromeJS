// ==UserScript==
// @name            showFlagS.uc.js
// @description     显示国旗与IP
// @author          ywzhaiqi、feiruo
// @homepage       https://github.com/feiruo/userchromejs/
// @include         chrome://browser/content/browser.xul
// @charset         UTF-8
// @version         1.3.2
// @note            2013-12-16
// @note            左键点击复制，右键弹出菜单。需要 countryflags.js 数据文件
// @note            1.3.2 修复identity-box图标的判断
// @note            1.3.1 修复https找不到服务的情况下显示2个图标的bug
// @note            1.3 增加淘宝查询源，修复不显示图标，刷新、切换查询源时可能出现的图标提示消失等BUG
// @note            1.2.1 修复identity-box时page-proxy-favicon的问题
// @note            1.2 位置为identity-box时自动隐藏page-proxy-favicon，https显示
// @note            1.1 设置延迟，增加本地文件图标。
// ==/UserScript==

/**
 * 参考 Show Location 扩展、Flagfox 扩展、http://files.cnblogs.com/ziyunfei/showFlag.uc.js
 */

location == "chrome://browser/content/browser.xul" && (function() {

	// 显示国旗图标/IP位置 urlbar-icons	identity-box addon-bar status-bar 等等
	var showLocationPos = "identity-box";

	// 本地国旗图标库，相对路径： profile\chrome\lib\countryflags.js
	var localFlagPath = "lib\\countryflags.js";

	// 打开查询网站是否激活
	var TAB_ACTIVE = true;

	//毫秒,延迟时间，时间内未取得所选择查询源数据，就使用新浪查询源
	var Inquiry_Delay = 3500;

	// 备用国旗地址
	var BAK_FLAG_PATH = 'http://www.razerzone.com/asset/images/icons/flags/';
	// var BAK_FLAG_PATH = 'http://www.1108.hk/images/ext/';

	//是否使用备用图标(如果本地找不到则使用在线图标),perfs
	var NetSrc = true;

	//默认API，perfs
	var site = 'CZ';

	// 等待时国旗图标
	var DEFAULT_Flag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=";

	// 未知国旗图标
	var Unknown_Flag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVQ4jZWRMahScRjFL40REW9ojqaGhoaGprg0eL3//3fkj0pCDrYp2hARmRItjk4ND0EuSFMgSEQIiuMjEjdnwUGIvLdF+bxc/j6ut8X3eM9X7z3P+vE7nPMdw9gRgPdEdCSlPJRS3t+9Xyrbtp8A4FqtFmQyGQbARHRERAXLsg6uNADwMZ1O83q9jpbLZdjtdnW5XPa3Rksi+iqEeA7g5j8NFosFu64bRjuaz+dhu93WhULBB8AAXCll3TTNO6fweDx+qLWOwvACf06TySR0HCdQSjGAt2fjKwA8m83+6zCdTsNWqxXkcjkG4Nq2/ezUgIg+ZbNZ3mw25yDP88JOp6NLpdLJL/4AaAkhnu4+cFyv14MoiiJmjvr9vq5Wq34ikeBt7+8AXpimeevC8+Lx+D0APBgMdK/X08lk8gT6KaV8HYvF7l46nxDiJQD2PC+sVCo+Ef0A8ODK3c/0/5zP5/0gCCKlFBPRu2vD2/6/ms1mMBqNjgGwEOLxtWEhxCMAPBwOjx3H0UT02zCMG/vEf6OU4tVqFRWLRZ+IvuwVn4g+pFIpbjQawXbnV3sZWJZ1IKU8BDAhom+2bd/eh/8LEFU+M9Rx2boAAAAASUVORK5CYII=";

	//本地文件图标
	var File_Flag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACf0lEQVQ4jX3S3UtTYQDH8QP9GV31T0TXKmLFiBGjmlPLt6RSyZc0kFCLcqEhXRQSeBNaDXFqw7em29yc23Fbvswdt7mztzPn5Gnu5cyxF/t1ERw8LvrBc/d8PzwXD0VRFMVz7+b5w+Eiz40gFVAiyQ4h6VPixPsacfdLEKYfx3t9iG73sBF7Vzd1fiqV7FImOoLC6SzOCjHwx2P45X+DA3sv8hktzvJrwsnx8wg7Olnq4jLRERSyGhSyGgBFAEUENluwZ36B0/g0ijkdCtkfyPML4OxP8V/gLwL4LA3Y1vcgsjOAPL+AXGoW2ZMphGzt/wAOLwJFeEy12FrtRPhnH7InU8iQCaRj4wjSraVAOvJWiHOZGfw+48Ho78GhbUXQ1o10bBypyEckQqPwWx+VAqnwkBBnkyoU80dwrshgX3qIgLUdidAo4qwSxDOIkK0NPlPzBxGQCLwSYp58xmnSjJ1lKTbn74M1t4B4BnHMPMfRbgcOt57gYL1R/Io4OyDEiegnkOB7bC1IYJ2T42CtXgg5exMIIfAa68UA8faJ4iOvEg7NdVjUt+HRVYOzNyFM1yG4IQchBJ61B2Igtt8rijlnP2xzlTBPSeDWyhDckCOwLoPfKAUhBG5DnRiIOrtEccDxDPRMBUzfqrC/LIXfKAVrkIA1SKBY8mFfXyMGuO12UeyztoFWl8P0tQLMokSIWYMEVRO7YHQKMRB0PBbFHlMzaHU5jJNlJYDPcAvOFblXBPg2GrVuYy1cegVcuhq4dHWg1eUwTN6Ac1EGRl8DRqeAa7UazpW73h3tnY6Sz2T+Lru8qbnZQM9UzFqmy9KasWuWL8NXWwyqyisll8/tD6KEcRuPWHf/AAAAAElFTkSuQmCC";

	window.showFlagS = {
		dnsCache: [],
		isReqHash: [],
		isReqHash_tooltip: [],
		showFlagHash: [],
		showFlagTooltipHash: [],

		init: function() {
			var self = this;

			this._prefs = Components.classes["@mozilla.org/preferences-service;1"]
				.getService(Components.interfaces.nsIPrefService)
				.getBranch("userChromeJS.showFlagS.");
			this._prefs.QueryInterface(Components.interfaces.nsIPrefBranch2);

			if (!this._prefs.prefHasUserValue("SourceSite")) {
				this._prefs.setCharPref("SourceSite", site);
			} else {
				site = this._prefs.getCharPref("SourceSite");
			}

			if (!this._prefs.prefHasUserValue("NetSrc")) {
				this._prefs.setIntPref("NetSrc", NetSrc);
			} else {
				NetSrc = this._prefs.getIntPref("NetSrc");
			}

			this.importLib();
			this.addIcon();
			this.onLocationChange();
			this.progressListener = {
				onLocationChange: function() {
					self.onLocationChange();
				},
				onProgressChange: function() {},
				onSecurityChange: function() {},
				onStateChange: function() {},
				onStatusChange: function() {}
			};
			window.getBrowser().addProgressListener(this.progressListener);

			window.addEventListener("unload", function() {
				self.onDestroy();
			}, false);
		},
		onDestroy: function() {
			window.getBrowser().removeProgressListener(this.progressListener);
		},
		importLib: function() {
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
		addIcon: function() {
			var self = this;

			if (showLocationPos == 'identity-box' || showLocationPos == 'urlbar-icons') {
				this.icon = $(showLocationPos).appendChild($C('image', {
					id: 'showFlagS-icon',
					context: 'showFlagS-popup'
				}));
			} else {
				this.icon = $(showLocationPos).appendChild($C("statusbarpanel", {
					id: "showFlagS-icon",
					class: "statusbarpanel-iconic",
					context: "showFlagS-popup",
				}));
			}

			if (showLocationPos == "identity-box") {
				this.icon.style.marginLeft = "4px";
				this.icon.style.marginRight = "2px";
			}
			this.icon.style.width = "16px";

			this.icon.src = DEFAULT_Flag;

			// 点击复制
			this.icon.addEventListener("click", function(event) {
				if (event.button == 0) {
					showFlagS.copy();
				} else if (event.button == 1) {
					showFlagS.onLocationChange(true);
				}
			}, false);

			// 右键菜单
			var popup = $C('menupopup', {
				id: 'showFlagS-popup',
				position: 'at_pointer'
			});

			popup.appendChild($C('menuitem', {
				label: "刷新",
				tooltiptext: '重新获取数据',
				oncommand: "showFlagS.onLocationChange(true);"
			}));

			popup.appendChild($C('menuitem', {
				label: "复制",
				oncommand: "showFlagS.copy();"
			}));

			popup.appendChild($C('menuseparator'));

			popup.appendChild($C('menuitem', {
				label: "纯真 查询",
				tooltiptext: 'http://www.cz88.net/ip/index.aspx?ip=',
				oncommand: 'showFlagS.open(this.tooltipText, "ip");'
			}));

			popup.appendChild($C('menuitem', {
				label: "MyIP.cn 查询",
				tooltiptext: 'http://www.myip.cn/',
				oncommand: 'showFlagS.open(this.tooltipText, "ip");'
			}));

			popup.appendChild($C('menuitem', {
				label: "Whois 查询 Host",
				tooltiptext: 'http://whois.domaintools.com/',
				oncommand: 'showFlagS.open(this.tooltipText, "host");'
			}));

			popup.appendChild($C('menuitem', {
				label: "Whois 查询 IP",
				tooltiptext: 'http://whois.domaintools.com/',
				oncommand: 'showFlagS.open(this.tooltipText, "ip");'
			}));

			popup.appendChild($C('menuseparator'));

			popup.appendChild($C('menuitem', {
				label: "纯真 查询源",
				id: "flagsSetLookCZ",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","CZ");'
			}));

			popup.appendChild($C('menuitem', {
				label: "MyIP 查询源",
				id: "flagsSetLookMyip",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","myip");'
			}));

			popup.appendChild($C('menuitem', {
				label: "纯真2 查询源",
				id: "flagsSetLookCZedu",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","CZedu");'
			}));

			popup.appendChild($C('menuitem', {
				label: "新浪 查询源",
				id: "flagsSetLookSina",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","sina");'
			}));

			popup.appendChild($C('menuitem', {
				label: "淘宝 查询源",
				id: "flagsSetLookTaobao",
				type: "radio",
				oncommand: 'showFlagS.lookupIP("set","taobao");'
			}));

			popup.appendChild($C('menuseparator'));

			popup.appendChild($C('menuitem', {
				label: "在线图标",
				id: "flagsNetSrc",
				type: "checkbox",
				oncommand: 'showFlagS.flagsNetSrc();'
			}));

			$('mainPopupSet').appendChild(popup);
			if (site == "myip")
				$("flagsSetLookMyip").setAttribute('checked', true);
			else if (site == "CZ")
				$("flagsSetLookCZ").setAttribute('checked', true);
			else if (site == "CZedu")
				$("flagsSetLookCZedu").setAttribute('checked', true);
			else if (site == "sina")
				$("flagsSetLookSina").setAttribute('checked', true);
			else if (site == "taobao")
				$("flagsSetLookTaobao").setAttribute('checked', true);
			if (NetSrc)
				$("flagsNetSrc").setAttribute('checked', (($("flagsNetSrc").value != NetSrc) ? true : false));
			else
				$("flagsNetSrc").setAttribute('checked', (($("flagsNetSrc").value != NetSrc) ? false : true));
		},
		flagsNetSrc: function() {
			if (NetSrc)
				NetSrc = false;
			else
				NetSrc = true;
			this._prefs.setIntPref("NetSrc", NetSrc);
		},
		copy: function(str) {
			str || (str = this.icon.tooltipText)

			Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper)
				.copyString(str);
		},
		open: function(url, type) {
			var host = this.contentDoc.location.host,
				ip = this.dnsCache[host];

			if (type == 'host') {
				url += host;
			} else if (type == 'ip' && ip) {
				url += ip
			}

			var tab = gBrowser.addTab(url);
			if (TAB_ACTIVE) {
				gBrowser.selectedTab = tab;
			}
		},
		onLocationChange: function(forceRefresh) {
			if (forceRefresh) {
				this.forceRefresh = true;
			}

			try {
				var aLocation = this.contentDoc.location;
				if (showLocationPos == 'identity-box') {
					if ((aLocation.protocol !== "about:") && (aLocation.protocol !== "chrome:"))
						$('page-proxy-favicon').style.visibility = 'collapse';
					else
						$('page-proxy-favicon').style.visibility = 'visible';
					this.icon.hidden = ((aLocation.protocol == "about:") || (aLocation.protocol == "chrome:"));
				}
				if (aLocation && aLocation.host && /tp/.test(aLocation.protocol)) {
					this.updateState(aLocation.host);
				} else if (aLocation && /file/.test(aLocation.protocol)) {
					this.icon.src = File_Flag;
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
			this.icon.src = DEFAULT_Flag;
			this.icon.tooltipText = '';
			if (showLocationPos == 'identity-box') {
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

			if (ip == "set") {
				site = host;
				this._prefs.setCharPref("SourceSite", site);
				return;
			}

			var func = self['lookupIP_' + site];

			var flagFunc = function(checkCache) {
				if (checkCache && self.showFlagHash[host]) {
					self.updateIcon(host, self.showFlagHash[host]);
					return;
				}

				// 防止重复获取
				if (checkCache && self.isReqHash[host]) return;
				self.isReqHash[host] = true;
				if (site == 'myip' || site == 'taobao')
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
				func(ip, host);
			};

			flagFunc(!this.forceRefresh);
			tooltipFunc(!this.forceRefresh);
			this.forceRefresh = false;
		},
		lookupIP_taobao: function(ip, host, other) {
			var self = showFlagS;

			var req = new XMLHttpRequest();
			req.open("GET", 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.icon.src = Unknown_Flag;
				if (other || site == 'taobao')
					self.icon.tooltipText = '无法查询，请刷新！';
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var responseObj = JSON.parse(req.responseText);
					if (responseObj.code == 0) {
						var country_id = responseObj.data.country_id.toLocaleLowerCase();
						var addr = responseObj.data.country + responseObj.data.area + '\n' + responseObj.data.region + responseObj.data.city + responseObj.data.county + responseObj.data.isp;
						var obj = {
							taobao: addr
						};
						if (other || site == 'taobao') {
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
		lookupIP_CZ: function(ip, host) {
			var self = showFlagS;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://www.cz88.net/ip/index.aspx?ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var s_local, myip, myAddr;

					var addr_pos = req.responseText.indexOf("AddrMessage");
					s_local = req.responseText.substring(addr_pos + 13);
					s_local = s_local.substring(0, s_local.indexOf("<"));

					var myip_pos = req.responseText.indexOf("cz_ip");
					myip = req.responseText.substring(myip_pos + 7);
					myip = myip.substring(0, myip.indexOf("<"));

					var myAddr_pos = req.responseText.indexOf("cz_addr");
					myAddr = req.responseText.substring(myAddr_pos + 9);
					myAddr = myAddr.substring(0, myAddr.indexOf("<"));

					s_local = s_local.replace(/ +CZ88.NET ?/g, "");

					var obj = {
						CZ: s_local
					};
					if (s_local) {
						if (myip) obj.myip = myip;
						if (myAddr) obj.myAddr = myAddr;

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
		lookupIP_CZedu: function(ip, host) {
			var self = showFlagS;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://phyxt8.bu.edu/iptool/qqwry.php?ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var s_local;
					s_local = req.responseText;
					s_local = s_local.replace(/ +CZ88.NET ?/g, "");

					var obj = {
						CZedu: s_local
					};
					if (s_local) {
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
		lookupIP_myip: function(ip, host) {
			var req = new XMLHttpRequest();
			req.open("GET", 'http://www.myip.cn/' + ip, true);
			req.send(null);
			var self = showFlagS;
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
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
		lookupIP_sina: function(ip, host) {
			var self = showFlagS;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' + ip, true);
			req.send(null);
			var onerror = function() {
				self.lookupIP_taobao(ip, host, "other");
			};
			req.onerror = onerror;
			req.timeout = Inquiry_Delay;
			req.ontimeout = onerror;
			req.onload = function() {
				if (req.status == 200) {
					var responseObj = JSON.parse(req.responseText);
					if (responseObj.ret == 1) {
						if (responseObj.isp !== '' || responseObj.type !== '' || responseObj.desc !== '')
							var addr = responseObj.country + responseObj.province + responseObj.city + responseObj.district + '\n' + responseObj.isp + responseObj.type + responseObj.desc;
						else
							var addr = responseObj.country + responseObj.province + responseObj.city + responseObj.district;
						var obj = {
							sina: addr
						};
						self.showFlagTooltipHash[host] = obj;
						self.updateTooltipText(ip, host, obj);
						return;
					} else {
						onerror();
					}
				}
			};
		},
		updateIcon: function(host, countryCode, countryName) {
			// 跳过后台获取的情况
			if (host == this.contentDoc.location.host) {
				this.icon.hidden = false;
				var aLocation = this.contentDoc.location;
				if (showLocationPos == 'identity-box') {
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
						src = Unknown_Flag;
				} else if (countryCode === 'iana') {
					src = Unknown_Flag;
				} else {
					//  如果 countryCode 无法找到图标，再次用 countryName 查找
					if (window.CountryFlags) {
						src = CountryFlags[countryCode];
						if (!src && countryName) {
							contryCode = window.CountryNames && CountryNames[countryName];
							if (contryCode in CountryFlags) {
								src = CountryFlags[contryCode];
								this.showFlagHash[host] = contryCode;
							}
						}
					} else if (NetSrc) {
						src = src || (BAK_FLAG_PATH + countryCode + ".gif");
					} else {
						src = Unknown_Flag;
					}

					src = src;
				}
				this.icon.src = src;
			}
		},
		updateTooltipText: function(ip, host, obj) { // obj 为 sina 等获取到的数据
			// 跳过后台获取的情况
			if (host != this.contentDoc.location.host) return;

			obj || (obj = {});
			var tooltipArr = [];
			if (!obj.server) obj.server = this.contentDocServer;
			tooltipArr.push("域名：" + host);
			tooltipArr.push("网站IP：" + ip);
			tooltipArr.push("服务器：" + obj.server);

			if (obj.taobao)
				tooltipArr.push(obj.taobao);

			if (obj.CZ) {
				tooltipArr.push(obj.CZ);
				tooltipArr.push('我的IP：' + obj.myip);
				tooltipArr.push('我的地址：' + obj.myAddr);
			}

			if (obj.CZedu)
				tooltipArr.push(obj.CZedu);

			if (obj.myipS)
				tooltipArr.push(obj.myipS);

			if (obj.sina)
				tooltipArr.push(obj.sina);

			this.icon.tooltipText = tooltipArr.join('\n');
		},
		get contentDoc() {
			return window.content.document;
		},
		get contentDocServer() {
			var server;
			try {
				server = gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Ci.nsIHttpChannel).getResponseHeader("Server").split(" ", 1)[0];
			} catch (e) {}
			return server || '未知类型';
		},
		get dns() {
			return Cc["@mozilla.org/network/dns-service;1"]
				.getService(Components.interfaces.nsIDNSService);
		},
		get eventqueue() {
			return Cc["@mozilla.org/thread-manager;1"].getService().mainThread;
		},
	};

	showFlagS.init();

	function $(id) document.getElementById(id);

	function $C(name, attr) {
		var el = document.createElement(name);
		if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
		return el;
	}

})()
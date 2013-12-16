// ==UserScript==
// @name            showFlagS.uc.js
// @description     显示国旗与IP
// @author          ywzhaiqi
// @homepage       https://github.com/feiruo/userchromejs/
// @include         chrome://browser/content/browser.xul
// @charset         UTF-8
// @version         1.0
// @note            2013-12-5
// @note            左键点击复制，右键弹出菜单。需要 countryflags.js 数据文件
// ==/UserScript==

/**
 * 参考 Show Location 扩展、Flagfox 扩展、http://files.cnblogs.com/ziyunfei/showFlag.uc.js
 *
 */

location == "chrome://browser/content/browser.xul" && (function() {

	// 显示国旗图标/IP位置
	var showLocationPos = "identity-box";

	// 本地国旗图标库，相对路径： profile\chrome\lib\countryflags.js
	var localFlagPath = "lib\\countryflags.js";

	// 打开查询网站是否激活
	var TAB_ACTIVE = true;

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

			if (showLocationPos == "identity-box" || showLocationPos == 'urlbar-icons') {
				this.icon.style.marginLeft = "4px";
				this.icon.style.marginRight = "2px";
				this.icon.style.width = "16px";
			}

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
				label: "myip 查询源",
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
				if (aLocation && aLocation.host && /tp/.test(aLocation.protocol)) {
					this.updateState(aLocation.host);
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
				if (site !== 'myip')
					self.lookupIP_taobao(ip, host);
				else
					return;
				// self.lookupIP_myip(ip, host);
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
		lookupIP_taobao: function(ip, host) {
			var self = this;

			var req = new XMLHttpRequest();
			req.open("GET", 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip, true);
			req.send(null);
			req.onload = function() {
				if (req.status == 200) {
					var responseObj = JSON.parse(req.responseText);
					if (responseObj.code == 0) {
						var country_id = responseObj.data.country_id.toLocaleLowerCase();
						self.showFlagHash[host] = country_id;
						self.updateIcon(host, country_id, responseObj.data.country);
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
				self.lookupIP_sina(ip, host);
			};
			req.onerror = onerror;
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
				self.lookupIP_sina(ip, host);
			};
			req.onerror = onerror;
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
		lookupIP_sina: function(ip, host) {
			var self = showFlagS;
			var req = new XMLHttpRequest();
			req.open("GET", 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' + ip, true);
			req.send(null);
			req.onload = function() {
				if (req.status == 200) {
					var responseObj = JSON.parse(req.responseText);
					if (responseObj.ret == 1) {
						self.showFlagTooltipHash[host] = responseObj;
						self.updateTooltipText(ip, host, responseObj);
						return;
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
				self.lookupIP_sina(ip, host);
				self.lookupIP_taobao(ip, host);
			};
			req.onerror = onerror;
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
		updateIcon: function(host, countryCode, countryName) {
			// 跳过后台获取的情况
			if (host == this.contentDoc.location.host) {
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
					}

					if (NetSrc)
						src = src || (BAK_FLAG_PATH + countryCode + ".gif");
					else
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

			if (obj.country) {
				if (obj.isp !== "" || obj.type !== "")
					tooltipArr.push(obj.isp + obj.type);
				if (obj.desc !== "")
					tooltipArr.push(obj.desc);
				tooltipArr.push(obj.country + obj.province + obj.city + obj.district);
			}

			if (obj.CZ) {
				tooltipArr.push(obj.CZ);
				tooltipArr.push('我的IP：' + obj.myip);
				tooltipArr.push('我的地址：' + obj.myAddr);
			}

			if (obj.CZedu)
				tooltipArr.push(obj.CZedu);


			if (obj.myipS) {
				tooltipArr.push(obj.myipS);
			}

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
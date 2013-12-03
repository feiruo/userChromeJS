// ==UserScript==
// @name            showLocationModEx.uc.js
// @author          紫云飞
// @description     显示国旗与IP
// @charset         UTF-8
// @include         chrome://browser/content/browser.xul
// @note            2013-12-2
// @note            原脚本地址 http://files.cnblogs.com/ziyunfei/showFlag.uc.js
// ==/UserScript==

location == "chrome://browser/content/browser.xul" && (function() {

	//改这里选择是否加载本地国旗图标库，不存在或路径错误自动切换从网络中读国旗图标
	var localFlagPath = "lib\\countryflags.js"; // 注意是相对路径： profile\chrome\lib\countryflags.js
	//改这里选择显示国旗图标/IP位置，如果是identity-box为地址栏前端显示，会自动加载隐藏page-proxy-favicon css配合显示效果
	var showLocationPos = "identity-box"; // urlbar-icons   identity-box addon-bar status-bar 等等

	// 等待时国旗图标
	var defaultFlag = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=";

	// var API_URL = 'http://ip.taobao.com/service/getIpInfo.php?ip=';
	var API_URL = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=';

	// 备用：self.flagPath = 'http://www.1108.hk/images/ext/'
	//var flagPath = 'http://www.razerzone.com/asset/images/icons/flags/';

	var ns = {
		init: function() {
			this.importLib();
			this.addStyle();
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
		addStyle: function() {
			if (showLocationPos == "identity-box") {
				var cssStr = ('\
					#page-proxy-favicon,\
					#identity-icon-label,\
					#identity-icon-country-label {\
					 visibility: collapse !important;\
					}\
				');
				var style = document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(cssStr) + '"');
				document.insertBefore(style, document.documentElement);
			}
		},
	};

	ns.init();

	gBrowser.addEventListener("DOMWindowCreated", function(event) {
		var self = arguments.callee;
		if (!self.showFlag) {
			self.showFlag = document.getElementById("identity-box").appendChild(document.createElement("image"));
			var parentNode = document.getAnonymousElementByAttribute(self.showFlag.parentNode, "class", "*");
			if (parentNode) parentNode.hidden = true;

			if (showLocationPos == "identity-box") {
				self.showFlag.style.marginLeft = "4px";
				self.showFlag.style.marginRight = "2px";
				self.showFlag.style.padding = "0px 2px";
			} else {
				self.showFlag.style.width = "16px";
				self.showFlag.style.padding = "5px 2px";
			}

			window.addEventListener("TabSelect", self, false);
			self.showFlag.src = self.flag = defaultFlag;
			self.isReqHash = [];
			self.showFlagHash = [];
			self.showFlagTooltipHash = [];
		}
		try {
			var host = (event.originalTarget.location || content.location).hostname;
			if (!/tp/.test(content.location.protocol) || !host || self.isReqHash[host]) {
				(event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag) && (self.showFlag.tooltipText = '');
				return
			}
			if (event.type == "DOMWindowCreated") {
				var doc = event.originalTarget,
					win = doc.defaultView;
				if (doc.body instanceof HTMLFrameSetElement || win.frameElement) return;
			}
			Components.classes["@mozilla.org/network/dns-service;1"].getService(Components.interfaces.nsIDNSService).asyncResolve(host, 0, {
				onLookupComplete: function(inRequest, inRecord, inStatus) {
					var ip = inRecord.getNextAddrAsString();
					var server;
					try {
						server = (gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Components.interfaces.nsIHttpChannel).getResponseHeader("server").match(/\w+/) || ["\u672A\u77E5"])[0];
					} catch (e) {
						server = "臣妾看不到啊~"
					}

					if (!self.showFlagHash[host]) {
						(event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag);
						self.isReqHash[host] = true;
						var req = new XMLHttpRequest();
						req.open("GET", API_URL + ip, true);
						req.send(null);
						req.onload = function() {
							if (req.status == 200) {
								var countryId = null,
									tooltipText = null;

								var responseObj = JSON.parse(req.responseText);
								if (responseObj.data && responseObj.code == 0) { // 淘宝的格式
									countryId = responseObj.data.country_id;
								} else if (responseObj.country && responseObj.ret == 1) { // 新浪的格式
									countryId = window.CountryNames && window.CountryNames[responseObj.country];
									content.console.log(window.CountryNames, responseObj.country);
									tooltipText = "国家：" + responseObj.country + "\n" +
										"地址：" + responseObj.province + responseObj.city + responseObj.district + "\n" +
										"运营：" + responseObj.isp + "\n" +
										"类型：" + responseObj.type + "\n" +
										"所属：" + responseObj.desc + "\n" +
										"服务器：" + server + "\n" +
										"IP地址：" + ip;

								} else {
									countryId = "iana";
									tooltipText = "本地局域网" + '\n' + "IP地址：" + ip;
								}

								self.showFlagHash[host] = countryId;
								self.showFlagTooltipHash[host] = tooltipText;

								setFlagSrc();
							}
							self.isReqHash[host] = false;
						}
					} else {
						setFlagSrc();
					}
				}
			}, null);
		} catch (e) {
			(event.type == "TabSelect" || event.originalTarget == content.document) && (self.showFlag.src = self.flag) && (self.showFlag.tooltipText = '');
		}

		function setFlagSrc() {
			var countryId = self.showFlagHash[host];
			var tooltiptext = self.showFlagTooltipHash[host] || "";

			if (countryId && host == content.location.hostname) {
				countryId = countryId.toLocaleLowerCase()
				var src = window.CountryFlags && window.CountryFlags[countryId];
				self.showFlag.src = src || self.flag;
				self.showFlag.tooltipText = tooltiptext;
			}
		}
	}, false)
})()
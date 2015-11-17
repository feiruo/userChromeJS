// ==UserScript==
// @name            FeiRuoNet.uc.js
// @description     网络交互信息定义
// @author          feiruo
// @License			Version: MPL 2.0/GPL 3.0/LGPL 2.1
// @compatibility   Firefox 16
// @charset         UTF-8
// @include         chrome://browser/content/browser.xul
// @id              [9AA866B3]
// @inspect         window.FeiRuoNet
// @startup         window.FeiRuoNet.init();
// @shutdown        window.FeiRuoNet.uninit();
// @optionsURL      about:config?filter=FeiRuoNet.
// @config          window.FeiRuoNet.OpenPref(0);
// @homepageURL     https://www.feiruo.pw/UserChromeJS/FeiRuoNet.html
// @homepageURL     https://github.com/feiruo/userChromeJS/tree/master/FeiRuoNet
// @downloadURL     https://github.com/feiruo/userChromeJS/raw/master/FeiRuoNet/FeiRuoNet.uc.js
// @note            Begin 2015-10-15
// @note            网络交互信息定义，查看、自定义与网站之间的交互信息。
// @note            显示网站IP地址和所在国家国旗，支持IPV6，标示https安全等级，帮助识别网站真实性。
// @note            修改浏览器标识(UA)、Cookies、Referer，伪装IP，等Http头信息。
// @note            破解反盗链,破解限制等，酌情善用。
// @note            左键点击图标复制当前站点IP，中键打刷新，右键弹出菜单。
// @note            更多功能需要【_FeiRuoNet.js】、【_FeiRuoNetMenu.js】、【FeiRuoNetLib.js】、【QQWry.dat】、【ip4.cdb】、【ip6.cdb】配置文件。
// @note            仅供个人测试、研究，不得用于商业或非法用途，作者不承担因使用此脚本对自己和他人造成任何形式的损失或伤害之任何责任。
// @version         0.0.0    2015.10.20 17:00    Building。
// ==/UserScript==
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 2.0/GPL 3.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 2.0 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is the userChromeJS utilities.
 *
 * The Initial Developer of the Original Code is
 * feiruo <feiruosama@gmail.com>
 *
 * Portions created by the Initial Developer are Copyright (C) 2015
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 3 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
location == "chrome://browser/content/browser.xul" && (function(CSS) {
	let {
		classes: Cc,
		interfaces: Ci,
		utils: Cu,
		results: Cr
	} = Components;
	if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");
	if (!window.AddonManager) Cu.import("resource://gre/modules/AddonManager.jsm");
	if (!window.UserAgentOverrides) Cu.import("resource://gre/modules/UserAgentOverrides.jsm");
	if (!window.FileUtils) Cu.import("resource://gre/modules/FileUtils.jsm");
	if (!window.XPCOMUtils) Cu.import("resource://gre/modules/XPCOMUtils.jsm");
	if (!window.Promise) Cu.import("resource://gre/modules/Promise.jsm");
	if (!window.NetUtil) Cu.import("resource://gre/modules/NetUtil.jsm");

	if (window.FeiRuoNet) {
		window.FeiRuoNet.onDestroy();
		delete window.FeiRuoNet;
	}

	var FeiRuoNet = {
			Initialization: function() {
			var StartupTime = new Date();
			//I'm Building
		},

		init: function() {},

		uninit: function() {},

		onDestroy: function() {},

		/*****************************************************************************************/
		
		},
	};
	window.FeiRuoNet = FeiRuoNet;
	FeiRuoNet.Initialization();
})('\
'.replace(/\n|\t/g, ''));
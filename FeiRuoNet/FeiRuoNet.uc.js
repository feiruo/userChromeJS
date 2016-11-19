// ==UserScript==
// @name            FeiRuoNet.uc.js
// @description     网络交互信息定义
// @author          feiruo
// @License         Version: MPL 2.0/GPL 3.0/LGPL 2.1
// @compatibility   Firefox 16
// @charset         UTF-8
// @include         chrome://browser/content/browser.xul
// @id              [9AA866B3]
// @inspect         window.FeiRuoNet
// @startup         window.FeiRuoNet.init();
// @shutdown        window.FeiRuoNet.uninit();
// @optionsURL      about:config?filter=FeiRuoNet.
// @config          window.FeiRuoNet.OpenPref('Preferences');
// @homepageURL     https://www.feiruo.pw/UserChromeJS/FeiRuoNet.html
// @homepageURL     https://github.com/feiruo/userChromeJS/tree/master/FeiRuoNet
// @downloadURL     https://github.com/feiruo/userChromeJS/raw/master/FeiRuoNet/FeiRuoNet.uc.js
// @note            Begin 2015-10-15
// @note            网络交互信息定义，查看、自定义与网站之间的交互信息。
// @note            显示网站IP地址和所在国家国旗，支持IPV6，标示https安全等级，帮助识别网站真实性。
// @note            修改浏览器标识(UA)、Cookies、Referer，伪装IP，等Http头信息。
// @note            破解反盗链,破解限制等，酌情善用。
// @note            左键点击图标查看详细信息，中键打开GET/POST界面，右键弹出菜单。
// @note            更多功能需要【_FeiRuoNet.js】、【_FeiRuoNetMenu.js】、【FeiRuoNetLib.js】、【QQWry.dat】、【ip4.cdb】、【ip6.cdb】、【_FeiRuoNetProxy.json】、【_GFWList.txt】配置文件。
// @note            仅供个人测试、研究，不得用于商业或非法用途，作者不承担因使用此脚本对自己和他人造成任何形式的损失或伤害之任何责任。
// @version         0.1.0     2016.10.31 10:30    Add Proxy Local and Refresh DNS, Fix for E10S and more。
// @version         0.0.9     2016.10.13 20:30    Fix for more。
// @version         0.0.8     2016.08.03 15:30    修改代理机制，兼容其他代理功能扩展脚本(Autoproxy、pan扩展等)。
// @version         0.0.7     2016.04.11 16:00    优化IP数据库读取缓存机制，国旗和地址使用同源，添加状态提示，自定义图标格式，自定义图标条件。
// @version         0.0.6     2016.04.09 15:00    菜单部分不再内置，需要Anobtn支持，增加家在状态，优化Tip逻辑，多窗口逻辑，减少资源消耗。
// @version         0.0.5     2016.03.20 15:00    增加GFWlist支持，优化加速智能代理逻辑，直接监听请求结果，错误直接代理。
// @version         0.0.4     2016.03.24 19:00    去除代理，fix bugs。
// @version         0.0.3     2016.03.15 15:00    完善头部、代理逻辑，取消使用CPOW。
// @version         0.0.2     2016.02.28 17:00    修复反盗链,修正查询，修正编辑。
// @version         0.0.1     2015.10.20 17:00    Building。
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
    if (!window.Downloads) Cu.import("resource://gre/modules/Downloads.jsm");
    // 刷新dns： FeiRuoNet.RefreshDNS();
    // 当前页启用/禁用代理： FeiRuoNet.SetNewProxy();
    // 全局禁用/智能/开启：  FeiRuoNet.ProxyModeSwitch();
    if (window.FeiRuoNet) {
        window.FeiRuoNet.onDestroy();
        delete window.FeiRuoNet;
    }

    const IoSrv = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
    const WinM = Cc["@mozilla.org/appshell/window-mediator;1"].getService(Ci.nsIWindowMediator);
    const HttpSrv = Cc['@mozilla.org/network/protocol;1?name=http'].getService(Ci.nsIHttpProtocolHandler);
    const ProxySrv = Cc['@mozilla.org/network/protocol-proxy-service;1'].getService(Ci.nsIProtocolProxyService);
    const DnsService = Cc["@mozilla.org/network/dns-service;1"].createInstance(Ci.nsIDNSService);
    const EventQueue = Cc["@mozilla.org/thread-manager;1"].getService(Ci.nsIThreadManager).currentThread;
    const ETLDService = Cc["@mozilla.org/network/effective-tld-service;1"].getService(Ci.nsIEffectiveTLDService);
    const FileInputStream = Components.Constructor("@mozilla.org/network/file-input-stream;1", "nsIFileInputStream", "init");
    const ConverterInputStream = Components.Constructor("@mozilla.org/intl/converter-input-stream;1", "nsIConverterInputStream", "init");
    const FileOutputStream = Components.Constructor("@mozilla.org/network/file-output-stream;1", "nsIFileOutputStream", "init");
    const ConverterOutputStream = Components.Constructor("@mozilla.org/intl/converter-output-stream;1", "nsIConverterOutputStream", "init");
    var FeiRuoNet = {
        Prefs: Services.prefs.getBranch("userChromeJS.FeiRuoNet."),
        DEFAULT_FlagS: "chrome://branding/content/icon16.png",
        DBAK_FLAG_PATH: "http://www.razerzone.com/asset/images/icons/flags/",
        DefaultFaviconVisibility: $("page-proxy-favicon") ? $("page-proxy-favicon").style.visibility : "visible",
        FireFoxVer: (parseInt(Cc["@mozilla.org/xre/app-info;1"].getService(Ci.nsIXULAppInfo).version.substr(0, 3) * 10, 10) / 10),
        get MenuFile() {
            let aFile = FileUtils.getFile("UChrm", ["lib", '_FeiRuoNetMenu.js']);
            try {
                this.MenuFile_ModifiedTime = aFile.lastModifiedTime;
            } catch (e) {}
            delete this.MenuFile;
            return this.MenuFile = aFile;
        },
        get ConfFile() {
            let aFile = FileUtils.getFile("UChrm", ["lib", '_FeiRuoNet.js']);
            try {
                this.ConfFile_ModifiedTime = aFile.lastModifiedTime;
            } catch (e) {}
            delete this.ConfFile;
            return this.ConfFile = aFile;
        },
        get ProxyFile() {
            let aFile = FileUtils.getFile("UChrm", ["lib", '_FeiRuoNetProxy.json']);
            try {
                this.ProxyFile_ModifiedTime = aFile.lastModifiedTime;
            } catch (e) {}
            delete this.ProxyFile;
            return this.ProxyFile = aFile;
        },
        get GFWListFile() {
            let aFile = FileUtils.getFile("UChrm", ["lib", '_GFWList.txt']);
            try {
                this.GFWListFile_ModifiedTime = aFile.lastModifiedTime;
            } catch (e) {}
            delete this.GFWListFile;
            return this.GFWListFile = aFile;
        },
        get IsUsingUA() {
            if (gPrefService.getPrefType("general.useragent.override") != 0) return gPrefService.getCharPref("general.useragent.override");
            return null;
        },
        get CurrentURI() {
            var topWindowOfType = WinM.getMostRecentWindow("navigator:browser");
            if (topWindowOfType) return topWindowOfType.document.getElementById("content").currentURI;
            return null;
        },
        get Content() {
            var title = gBrowser.selectedTab.label || gBrowser.selectedBrowser.contentTitle;
            var url = gBrowser.currentURI.spec || gBrowser.selectedBrowser.currentURI.spec;
            var cont;
            if (gMultiProcessBrowser) {
                function listener(message) {
                    cont = message.objects.cont;
                }
                // var script = "data:application/javascript," + encodeURIComponent('sendAsyncMessage("FeiRuoNet:FeiRuoNet-e10s-content-message", {}, {cont: content,})');
                var script = "data:application/javascript," + encodeURIComponent('sendAsyncMessage("FeiRuoNet:FeiRuoNet-e10s-content-message", {}, {cont: content,})');
                gBrowser.selectedBrowser.messageManager.addMessageListener("FeiRuoNet:FeiRuoNet-e10s-content-message", listener);
                gBrowser.selectedBrowser.messageManager.loadFrameScript(script, true);
                // gBrowser.selectedBrowser.messageManager.broadcastAsyncMessage("FeiRuoNet:FeiRuoNet-e10s-content-message", listener);
                // gBrowser.selectedBrowser.messageManager.removeMessageListener("FeiRuoNet:FeiRuoNet-e10s-content-message", listener);
                // gBrowser.selectedBrowser.messageManager.removeDelayedFrameScript(script);
            } else {
                cont = window.content || gBrowser.selectedBrowser._contentWindow || gBrowser.selectedBrowser.contentWindowAsCPOW;
            }
            delete this.Content;
            return this.Content = window.content || gBrowser.selectedBrowser._contentWindow || gBrowser.selectedBrowser.contentWindowAsCPOW;
        },
        get DirectProxy() {
            delete this.DirectProxy;
            return this.DirectProxy = ProxySrv.newProxyInfo('direct', '', -1, 0, 0, null) || null;
        },
        Initialization: function() {
            var StartupTime = new Date();
            this.Debug = this.GetPrefs(0, "Debug", false);
            this.CacheReset(true);
            this.IsMain = this.CheckMain();
            if (this.IsMain) {
                this.ReloadProxy(true);
            }
            this.init();
            this.Services.init();
            window.addEventListener("unload", function() {
                FeiRuoNet.onDestroy();
            }, false);
        },
        init: function() {
            this.CreatePopup(true);
            this.LoadSetting();
            this.Rebuild();
        },
        uninit: function() {
            this.Rebuild_UAChanger();
            this.ReloadProxy();
            this.CreatePopup();
            this.CreateIcon();
            if (this.GetWindow('Preferences')) this.GetWindow('Preferences').close();
            this.UrlbarSafetyLevel = false;
        },
        onDestroy: function() {
            this.Services.onDestroy();
            this.AddStyle(false, 'Global');
            this.SaveAutoProxyList();
            this.CacheReset();
            if (this.MutationObs) this.MutationObs.disconnect();
            if (this.IsMain) this.uninit();
            Services.appinfo.invalidateCachesOnRestart();
            Services.obs.notifyObservers(null, "startupcache-invalidate", "");
        },
        CheckMain: function() {
            var enumerator = WinM.getEnumerator("navigator:browser");
            while (enumerator.hasMoreElements()) {
                var win = enumerator.getNext();
                if (win.FeiRuoNet && win.FeiRuoNet.IsMain) {
                    return false;
                }
            }
            return true;
        },
        CacheReset: function(isAlert) {
            var enumerator = WinM.getEnumerator("navigator:browser");
            while (enumerator.hasMoreElements()) {
                var win = enumerator.getNext();
                if (win.FeiRuoNet && win.FeiRuoNet.IsMain) {
                    this.Caches = win.Caches;
                    this.DataBase = win.DataBase;
                    this.AutoProxy = win.AutoProxy;
                }
            }
            if (!this.AutoProxy) {
                this.AutoProxy = [];
                this.AutoProxy.ProxyFilters = [];
                this.AutoProxy.AutoProxyList = [];
                this.AutoProxy.Filter = Filter;
                this.AutoProxy.ActiveFilter = ActiveFilter;
                this.AutoProxy.RegExpFilter = RegExpFilter;
                this.AutoProxy.BlockingFilter = BlockingFilter;
                this.AutoProxy.WhitelistFilter = WhitelistFilter;
                this.AutoProxy.Matcher = Matcher;
                this.AutoProxy.CombinedMatcher = CombinedMatcher;
            }
            if (!this.Caches) this.Caches = new Caches(['DNS', 'Onece', 'Query', 'IPInfo', 'Headers', 'HostInfo']);
            if (!this.DataBase) {
                this.DataBase = new Caches();
                ['CountryFlag', 'CountryName', 'QQwryDate', 'FlagFoxDB'].forEach(item => {
                    if (this.DataBase[item] && (item == 'QQwryDate' || item == 'FlagFoxDB')) this.DataBase[item].Clear();
                    this.DataBase[item] = {
                        __proto__: null
                    };
                });
                if (!isAlert) return;
                var LibData = FeiRuoNet.LoadFile(FileUtils.getFile("UChrm", ["lib", 'FeiRuoNetLib.js']));
                this.DataBase.CountryName = (LibData && LibData.CountryName) || {};
                this.DataBase.CountryFlag = (LibData && LibData.CountryFlag) || {};
                var QQWryFile = FileUtils.getFile("UChrm", ["lib", 'QQWry.dat']);
                if (QQWryFile && QQWryFile.exists() && QQWryFile.isFile() && LibData) {
                    this.DataBase.QQwryDate = new QQwryDate(LibData.GBKCode, QQWryFile);
                }
                var IPDBmetadata = (LibData && LibData.IPDBmetadata) || {};
                IPDBmetadata.countryIDs = (IPDBmetadata.countryIDs || "").match(new RegExp(".{1," + 2 + "}", "g"));
                this.DataBase.FlagFoxDB = new FlagFoxDB(IPDBmetadata);
            }
        },
        /*****************************************************************************************/
        CreateIcon: function(IconPos) {
            if (this.Icon_Pos === IconPos) return;
            var icon = $("FeiRuoNet_icon");
            if (icon) icon.parentNode.removeChild(icon);
            delete icon;
            if (this.Icon_Pos === 0 && $("page-proxy-favicon")) $("page-proxy-favicon").style.visibility = this.DefaultFaviconVisibility;
            if (typeof IconPos == 'undefined') return false;
            if (typeof IconPos == "number") this.Icon_Pos = IconPos;
            var IconType = this.IconSstatusBarPanel ? 'statusbarpanel' : 'image';
            if (this.Icon_Pos === 0) {
                this.icon = $C(IconType, {});
                $('identity-box').appendChild(this.icon);
            } else if (this.Icon_Pos === 1) {
                this.icon = $C(IconType, {});
                $('urlbar-icons').appendChild(this.icon);
            } else if (this.Icon_Pos === 2) {
                this.icon = $C('toolbarbutton', {
                    class: 'toolbarbutton-1 chromeclass-toolbar-additional',
                    type: 'menu',
                    removable: true,
                    id: "FeiRuoNet_icon",
                });
                ToolbarManager.addWidget(window, this.icon, true);
            }
            this.icon.setAttribute('id', 'FeiRuoNet_icon');
            this.icon.setAttribute('context', 'FeiRuoNet_Popup');
            this.icon.setAttribute('tooltip', 'FeiRuoNet_Tooltip');
            this.icon.setAttribute('onclick', 'if (event.button != 2) FeiRuoNet.IconClick(event);');
            if (this.IconSstatusBarPanel) this.icon.setAttribute('class', 'statusbarpanel-iconic');
            return true;
        },
        CreatePopup: function(enable) {
            var Popup = $("FeiRuoNet_Popup");
            if (Popup) Popup.parentNode.removeChild(Popup);
            this.Popup = null;
            delete Popup;
            if (!enable) return;
            this.Popup = $C("menupopup", {
                id: "FeiRuoNet_Popup",
                position: "bottomcenter topright",
                onpopupshowing: "FeiRuoNet.PopupShowing(event);"
            });
            this.Popup.appendChild($C("menuitem", {
                id: "FeiRuoNet_Copy",
                label: "复制信息",
                oncommand: "FeiRuoNet.CopyStr();",
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAyklEQVQ4jZ3TQW7CMBCF4e8OlbKqwpKL9CBcBMVcqmuUHiAnQEKQrto70IUnKIAJSUeahT32b795No9RocNlRv4U9lvhjBYNUiEb7ANSBPSxcCqaZ4B3HLB9AUgDoIpTV6ixxgYfMR5qb88Anay5H+URp7u5zzvIFXCRG5awK2TCF77jJkVAM0NvPwVILwC7ANSjuasLcwEnubHbWN8uBRxldw5xm7NswCIJa/mdDNZWSwF1qfhfF24Ae9Mfp5U1FwG/5n3dTmgexx+GCF9o0H+IuAAAAABJRU5ErkJggg=="
            }));
            this.Popup.appendChild($C("menuitem", {
                id: "FeiRuoNet_Rebuild",
                label: "刷新信息",
                oncommand: "FeiRuoNet.ShowFlag.LocationChange(true);",
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA/ElEQVQ4jZXTMU5CQRDG8R8WFCAdvXAGb0IDB/AE9tDQeAIaO5tXcwAOYIiJtvR4ASKJCQSLnZcsz6fJfsm84s3Mf3e+3eW3uphigxeMWmr+VA9POOIV45JmeMQZ35iUNo+wwwXvGJYCpjgFoEKnpeY+4koDafZlNF+wQh+3GWiMt4grb9aSYfsM8IktnjNQleWr+AcecMiSdXxhFjULydw6d8YcN+IzbylYRPMsYM0FDrE4/2yxH2NsY6w6v4+x17kXbSZ1MtAqAyzD+IGGWo8pQPUOT9KRF2mIjwDscFcKmEjX+yxd9yKNJcOO0kPrlTSPpCe9kebuNgt+AGaeUCmcWxTfAAAAAElFTkSuQmCC"
            }));
            this.Popup.appendChild($C("menuitem", {
                id: "FeiRuoNet_RefreshDNS",
                label: "刷新DNS缓存",
                onclick: "FeiRuoNet.RefreshDNS(event);",
                tooltiptext: "左键：同时刷新页面。\n右键：仅刷新DNS缓存。",
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZElEQVQ4jXXSPUhXYRQG8J9fKSGFQzgYIggiGCUo6ZKBIkI0RQq5tRUViOCkg5tgoItGY9jSlhAtYeEQKLkEbuqgjWqgVoMfqcM9f7le7v+BA5fnfc7znue9h3y0oAv38QzP8QJ9KCnSc4FebGAPn/ALp1GbuB26XKMaLOIsagvv8D/FzaMHpXkGr1LCM3xAI36kuF3cKzb+I6yGcBsdMeprHEZNBncRoRK30Im7aMMERkN0NYx6JA/binEMFgxKMYwD/MMsKlCeM+EAfsaEqxHPNXxMZfyDBznNJZjOvNGMEP9Nkct4HFNk0YT1lHYN6rESxL5kD7Kows34fhkXHmCqIBjEEb5gKGoYT1CGh5iTbOMYPuMtagsG1XiDr5mMK2jAQoY/iQsuoQ7fM8JldON3hl/CjZyonkp2f0/yN76F8D2OI/cO+vOaSXaiUbJMbWgOvh0jkkW7gyvFDIqhDNfzDs4BDaxkbFlpu6cAAAAASUVORK5CYII="
            }));
            this.ProxyMenuitem = $C("menuitem", {
                id: "FeiRuoNet_AutoProxy_Config",
                label: "AutoProxy",
                class: "FeiRuoNet menuitem-iconic",
                onclick: "FeiRuoNet.ProxyIconClick(event);"
            });
            this.Popup.appendChild(this.ProxyMenuitem);
            var UserAgentMenu = $C("menu", {
                id: "FeiRuoNet_UserAgent_Config",
                label: "UserAgent",
                class: "FeiRuoNet menu-iconic",
                hidden: "true"
            });
            UserAgentMenu.appendChild($C("menupopup", {
                id: "FeiRuoNet_UserAgent_Popup"
            }));
            this.Popup.appendChild(UserAgentMenu);
            this.SetMenuitem = $C("menuitem", {
                id: "FeiRuoNet_SetPref",
                label: "脚本设置",
                class: "FeiRuoNet menuitem-iconic",
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYElEQVQ4jY3TO0/VQRAF8F9yTUB6QMCCZ6KJBq4JNIQKCkoopAWMsabhC1ho5SOYaO2j0AQ+gYKPS/BeaDD0kPhJLP7nbzZA0ElOsjvnzOzOziyX2yjO8Ds4i++/bRgdzAUdjFwVMIkNDASP8QuDwXF8Nb+RGHAdb3GC72jhIxZxLViMbx/fon2XWKv4inHcx6OaQH8A3eFWot3DmmT8jImipF48y21aeI6+gp9IzA+Ywmu0k7mBF9jBDKaxjZfhxqN9k1hULepgLI90gHvFic34BqJtR6tM0D6XYKrgJ/FT1ZFa+3cu7mALR6mtkf2n3KKZ9auihMPs79aPuIvbxYn9SbIfbOFGwd/CF1XbPVC1ZARL2XdFOIihrLuwjuVod/EQevBeNXmt1P8BC6ohamA+moNojqPpqa/UxCZuBk8iKkf5abihaMsuXbBh1UvPBm3/+EznbRSnqm9c49Lv/AcsoU6W+qo3pgAAAABJRU5ErkJggg==",
                onclick: "FeiRuoNet.MenuItemClick(event);",
                tooltiptext: "左键：打开设置窗口。\n中键：重载配置和菜单。\n右键：编辑配置。"
            });
            this.Popup.appendChild(this.SetMenuitem);
            this.Popup.appendChild($C("menuseparator", {
                id: "FeiRuoNet_Sepalator2",
                hidden: "true"
            }));
            this.Tooltip = $C("tooltip", {
                id: "FeiRuoNet_Tooltip",
                onpopupshowing: "FeiRuoNet.TooltipShowing(event);"
            });
            $('mainPopupSet').appendChild(this.Tooltip);
            $('mainPopupSet').appendChild(this.Popup);
            this.AddStyle('Global', CSS);
        },
        TooltipShowing: function(event) {
            if (event.target != FeiRuoNet.Tooltip || event.target != event.currentTarget) return;
            while (FeiRuoNet.Tooltip.firstChild) FeiRuoNet.Tooltip.removeChild(FeiRuoNet.Tooltip.firstChild);
            var grid = window.document.createElement("grid");
            var rows = window.document.createElement("rows");

            function addLabeledLine(labelID, lineValue) {
                var row = window.document.createElement("row");
                var label = window.document.createElement("label");
                label.setAttribute("value", labelID.replace("&nbsp;", ''));
                if (!!lineValue) {
                    var value = window.document.createElement("label");
                    value.setAttribute("value", lineValue.replace("&nbsp;", ''));
                    row.appendChild(label);
                    row.appendChild(value);
                    rows.appendChild(row);
                } else rows.appendChild(label);
            }

            function ToFormat(str, isAlert) {
                if (!str || str == "" || /^( )$/i.test(str)) return;
                if (!isAlert && TipShow.C) addLabeledLine(TipShow.C);
                if (str.indexOf('\n') != -1) {
                    var arr = str.split('\n');
                    arr.forEach(i => {
                        if (!!i && !/^( )$/i.test(i) && i != "") {
                            var n = i.indexOf(':');
                            if (n == -1) n = i.indexOf('：');
                            if (n != -1) addLabeledLine(i.substring(0, n + 1), i.substring(n + 1));
                            else addLabeledLine(i);
                        }
                    })
                } else addLabeledLine(str);
            }
            var aLocation = FeiRuoNet.CurrentURI,
                TipShow = FeiRuoNet.TipShow,
                conv = FeiRuoNet.ConvStr(aLocation.scheme);
            if (!conv) {
                var host = aLocation.asciiHostPort || aLocation.HostPort || aLocation.hostPort || aLocation.host;
                var obj = FeiRuoNet.Caches.Query[host] || {};
                if (obj.Host && obj.Host != obj.IP) addLabeledLine(TipShow.Host, host);
                addLabeledLine(TipShow.IP, obj.IP);
                var ServerInfo = FeiRuoNet.GetHeaders(host);
                if (ServerInfo && ServerInfo.length > 0) {
                    ServerInfo.forEach(info => {
                        addLabeledLine(info.label, info.value);
                    });
                }
                if (obj.IPAddrInfo && obj.IPAddrInfo !== "") ToFormat(obj.IPAddrInfo, true)
                if (obj.ErrorStr && obj.ErrorStr != "") {
                    ToFormat(obj.ErrorStr);
                } else {
                    FeiRuoNet.Caches.Query[host].ProxyTimes = 0;
                }
                FeiRuoNet.Caches.Query[host].ErrorStr = "";
                var thx = [];
                if (obj.IPAddrInfoThx) thx.push(FeiRuoNet.GetDomain(obj.IPAddrInfoThx, true))
                if (obj.FlagThx && obj.FlagThx !== obj.IPAddrInfoThx) thx.push(obj.FlagThx)
                if (FeiRuoNet.CustomInfos && obj.CustomInfo) {
                    for (var i in obj.CustomInfo) {
                        thx.push(FeiRuoNet.GetDomain(i, true));
                        if (typeof obj.CustomInfo[i] == 'string') ToFormat(obj.CustomInfo[i]);
                        else {
                            ToFormat(obj.CustomInfo[i].Port[FeiRuoNet.CurrentURI.Port]);
                        }
                    }
                }
                if (FeiRuoNet.Caches.Onece) {
                    for (var i in FeiRuoNet.Caches.Onece) {
                        thx.push(FeiRuoNet.GetDomain(i, true));
                        ToFormat(FeiRuoNet.Caches.Onece[i]);
                    }
                }
                if (thx.join('\n') !== "") {
                    if (TipShow.D) addLabeledLine(TipShow.D);
                    addLabeledLine(TipShow.Thk, new String(thx));
                }
            } else {
                addLabeledLine(TipShow.Host, aLocation.spec);
                addLabeledLine(conv.str);
            }
            grid.appendChild(rows);
            FeiRuoNet.Tooltip.appendChild(grid);
        },
        PopupShowing: function(event) {
            if (event.target != FeiRuoNet.Popup || event.target != event.currentTarget) return;
            var URI = FeiRuoNet.CurrentURI;
            var URL = URI.spec;
            var UAItem = $("FeiRuoNet_UserAgent_Config");
            UAItem.hidden = !FeiRuoNet.EnableUAChanger || !FeiRuoNet.UARules;
            if (FeiRuoNet.UARules) {
                $$(".FeiRuoNet_UsingUA").forEach(function(e) {
                    e.classList.remove('FeiRuoNet_UsingUA')
                });
                var idx;
                for (var j in FeiRuoNet.UARules) {
                    if ((new RegExp(j)).test(URL)) {
                        idx = FeiRuoNet.UARules[j]
                    }
                }
                if (!FeiRuoNet.UAMenuSrc(idx, UAItem)) {
                    var UAList = FeiRuoNet.UAList,
                        IsUsingUA = FeiRuoNet.IsUsingUA;
                    for (var i = 0; i < UAList.length; i++) {
                        if (UAList[i].ua != "" && UAList[i].ua != IsUsingUA) continue;
                        if (UAList[i].ua == "" && !UAList[i].ua != !IsUsingUA) continue;
                        idx = i;
                        break;
                    }
                    if (!FeiRuoNet.UAMenuSrc(idx, UAItem)) {
                        UAItem.setAttribute("label", "未知UserAgent");
                        UAItem.setAttribute("tooltiptext", IsUsingUA);
                        UAItem.setAttribute("image", FeiRuoNet.Unknown_UAImage);
                    }
                }
            }

            if (!this.MenuCreated && window.AnoBtn_BuildPopup) {
                if (!this.PopupBuild) this.PopupBuild = new AnoBtn_BuildPopup('FeiRuoNet');
                this.PopupBuild.Remove();
                $("FeiRuoNet_Sepalator2").hidden = true;
                if (!!this.MenuData && this.MenuData.Menus && this.MenuData.Menus.length > 0) {
                    $("FeiRuoNet_Sepalator2").hidden = false;
                    this.PopupBuild.Build(this.MenuData.Menus);
                    this.MenuCreated = true;
                }
            }

            var ProxyItem = $('FeiRuoNet_AutoProxy_Config');
            ProxyItem.setAttribute("onclick", "FeiRuoNet.ProxyIconClick(event);");
            if (FeiRuoNet.ProxyMode == 0) {
                ProxyItem.setAttribute("label", "代理功能关闭");
                return;
            } else if (!FeiRuoNet.ProxyScheme.test(URI.scheme)) {
                ProxyItem.setAttribute("label", "此处禁用代理");
                return;
            } else {
                var obj = FeiRuoNet.Caches.Query[URI.asciiHostPort || URI.HostPort || URI.hostPort || URI.host] || {};
                if (!FeiRuoNet.ProxyLocal && /^((192\.168|172\.([1][6-9]|[2]\d|3[01]))(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}|10(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3})$/i.test(obj.IP))
                    return ProxyItem.setAttribute("label", "局域网禁用代理");
                var topDomain = FeiRuoNet.GetDomain(URL);
                var matchs = FeiRuoNet.AutoProxy.DefaultMatcher.matchesAny(URL, topDomain);
                if (matchs && matchs instanceof FeiRuoNet.AutoProxy.WhitelistFilter) {
                    ProxyItem.setAttribute("label", topDomain + "在白名单");
                    // ProxyItem.setAttribute("label", "此站例外");
                    return;
                } else if (matchs && matchs instanceof FeiRuoNet.AutoProxy.BlockingFilter) {
                    ProxyItem.setAttribute("value", true);
                    ProxyItem.filter = matchs;
                    ProxyItem.setAttribute("label", "在" + topDomain + "禁用");
                    // ProxyItem.setAttribute("label", "此站禁代");
                    return;
                }
                ProxyItem.setAttribute("value", "blocked");
                ProxyItem.newfilter = [URL, topDomain];
                ProxyItem.setAttribute("label", "对" + topDomain + "启用");
                // ProxyItem.setAttribute("label", "代理此站");
            }
        },
        LoadSetting: function(type) {
            if (!type || type === "Icon_Pos") this.CreateIcon(this.GetPrefs(1, "Icon_Pos")) && type && FeiRuoNet.ShowFlag.LocationChange();
            if (!type || type === "IconSstatusBarPanel") {
                var IconSstatusBarPanel = this.GetPrefs(0, "IconSstatusBarPanel");
                if (this.IconSstatusBarPanel != IconSstatusBarPanel) {
                    this.IconSstatusBarPanel = IconSstatusBarPanel;
                    this.CreateIcon(true);
                    if (type) FeiRuoNet.ShowFlag.LocationChange();
                }
            }
            if (!type || type === "ApiIdx") {
                var ApiIdx = this.GetPrefs(1, "ApiIdx");
                if (this.ApiIdx == ApiIdx) return;
                FeiRuoNet.ApiIdx = ApiIdx;
                if (!!type) FeiRuoNet.ShowFlag.SetApi(this.Interfaces[FeiRuoNet.ApiIdx]) && FeiRuoNet.ShowFlag.LocationChange('Flags');
            }
            if (!type || type === "Inquiry_Delay") this.Inquiry_Delay = this.GetPrefs(1, "Inquiry_Delay", 1000);
            if (!type || type === "BAK_FLAG_PATH") this.BAK_FLAG_PATH = this.GetPrefs(2, "BAK_FLAG_PATH", this.DBAK_FLAG_PATH);
            if (!type || type === "BAK_FLAG_PATH_Format") this.BAK_FLAG_PATH_Format = this.GetPrefs(2, "BAK_FLAG_PATH_Format", 'gif');
            if (!type || type === "IconShow") this.IconShow = new RegExp(this.GetPrefs(2, "IconShow", '^((ht|f)tps?|file|data|about|chrome)'), 'i');
            if (!type || type === "ModifyHeader") this.ModifyHeader = this.GetPrefs(0, "ModifyHeader", true);
            if (!type || type === "Debug") this.Debug = this.GetPrefs(0, "Debug");
            if (!type || type === "CustomQueue") this.CustomQueue = this.GetPrefs(1, "CustomQueue", 0);
            if (!type || type === "UrlbarSafetyLevel") this.UrlbarSafetyLevel = this.GetPrefs(0, "UrlbarSafetyLevel", true);
            if (!type || type === "EnableUAChanger") this.EnableUAChanger = this.GetPrefs(0, "EnableUAChanger", true);
            if (!type || type === "EnableRefChanger") this.EnableRefChanger = this.GetPrefs(0, "EnableRefChanger", true);
            if (!type || type === "EnableProxyByError") this.EnableProxyByError = this.GetPrefs(0, "EnableProxyByError", true);
            if (!type || type === "ProxyLocal") this.ProxyLocal = this.GetPrefs(0, "ProxyLocal", false);
            if (!type || type === "ProxyTimes") this.ProxyTimes = this.GetPrefs(1, "ProxyTimes", 5);
            if (!type || type === "ProxyTimer") this.ProxyTimer = this.GetPrefs(1, "ProxyTimer", 3500);
            if (!type || type === "GFWListUrl") this.GFWListUrl = unescape(this.GetPrefs(2, "GFWListUrl", "https://raw.githubusercontent.com/gfwlist/gfwlist/master/gfwlist.txt"));
            if (!type || type === "ProxyScheme") this.ProxyScheme = new RegExp(this.GetPrefs(2, "ProxyScheme", '^(http|https|ftp|wss)$'), 'i');
            if (!type || type === "ProxyServers") {
                var ProxyServers = unescape(this.GetPrefs(2, "ProxyServers", "ShadowSocks|127.0.0.1|1080|socks|1;GoAgent|127.0.0.1|8087|http|1")).split(";");
                if (!ProxyServers[0]) return;
                this.ProxyServers = [];
                for (var i in ProxyServers) {
                    var arr = ProxyServers[i].split("|"),
                        obj = {};
                    obj.name = arr[0];
                    obj.host = arr[1];
                    obj.port = arr[2];
                    obj.type = arr[3];
                    obj.remoteDNS = arr[4] ? arr[4] : 0;
                    obj.ProxyServer = ProxySrv.newProxyInfo(obj.type, obj.host, obj.port, obj.remoteDNS, this.ProxyTimer, null);
                    this.ProxyServers.push(obj);
                }
            }
            if (!type || type === "DefaultProxy") {
                this.DefaultProxy = this.GetPrefs(1, "DefaultProxy", 0);
                this.ProxyModeIcon();
            }
            if (!type || type === "ProxyMode") {
                this.ProxyMode = this.GetPrefs(1, "ProxyMode", 1);
                this.ProxyModeIcon();
            }
        },
        /*****************************************************************************************/
        Rebuild: function(isAlert) {
            this.MenuCreated = false;
            this.MenuData = this.LoadFile(this.MenuFile, isAlert) || [];
            var ConfData = this.LoadFile(this.ConfFile, isAlert) || {};
            this.Icons = ConfData.Icons || {};
            this.ServerInfo = ConfData.ServerInfo || [];
            this.HeadRules = ConfData.HeadRules || {};
            this.UASites = ConfData.UASites || {};
            this.UAList = ConfData.UAList || [];
            this.RefererChange = ConfData.RefererChange || [];
            this.CustomInfos = ConfData.CustomInfos || [];
            this.Interfaces = ConfData.Interfaces || [];
            this.FeiRuoFunc = ConfData.FeiRuoFunc || function() {};
            var TipShow = ConfData.TipShow || {};
            this.DEFAULT_Flag = this.Icons.DEFAULT_Flag ? this.Icons.DEFAULT_Flag : this.DEFAULT_FlagS;
            this.Unknown_Flag = this.Icons.Unknown_Flag ? this.Icons.Unknown_Flag : this.DEFAULT_Flag;
            this.File_Flag = this.Icons.File_Flag ? this.Icons.File_Flag : this.DEFAULT_Flag;
            this.Base64_Flag = this.Icons.Base64_Flag ? this.Icons.Base64_Flag : this.File_Flag;
            this.LocahHost_Flag = this.Icons.LocahHost_Flag ? this.Icons.LocahHost_Flag : this.DEFAULT_Flag;
            this.Mozilla_Flag = this.Icons.Mozilla_Flag ? this.Icons.Mozilla_Flag : this.DEFAULT_Flag;
            this.Loading_Flag = this.Icons.Loading_Flag ? this.Icons.Loading_Flag : this.DEFAULT_Flag;
            this.LAN_Flag = this.Icons.LAN_Flag ? this.Icons.LAN_Flag : this.DEFAULT_Flag;
            this.Unknown_UAImage = this.Icons.Unknown_UAImage ? this.Icons.Unknown_UAImage : this.DEFAULT_Flag;
            if (this.Interfaces && this.Interfaces[0]) {
                this.Interfaces.forEach(function(api) {
                    if (api.isFlag) {
                        FeiRuoNet.ShowFlag.FlagApi = api.Api;
                        FeiRuoNet.ShowFlag.FlagFunc = api.Func;
                    }
                })
            }
            this.TipShow = {
                Host: TipShow.tipArrHost || "Host：",
                IP: TipShow.tipArrIP || "IP：",
                C: TipShow.tipArrSepC || "",
                D: TipShow.tipArrSepEnd || "",
                Thk: TipShow.tipArrThanks || "Thk："
            }
            FeiRuoNet.ShowFlag.SetApi(this.Interfaces[this.ApiIdx] ? this.Interfaces[this.ApiIdx] : this.Interfaces[0]);
            this.Rebuild_UAChanger(true);
            FeiRuoNet.ShowFlag.LocationChange();
            if (isAlert) alert('配置已经重新载入！');
        },
        Rebuild_UAChanger: function(isAlert) {
            if (!this.UAList || !this.EnableUAChanger || (this.UAList && this.UAList.length == 0)) return;
            $$("menuitem[id^='FeiRuoNet_UserAgent_']").forEach(e => {
                e.parentNode.removeChild(e);
            });
            $$("menuseparator[id^='FeiRuoNet_UserAgent_']").forEach(e => {
                e.parentNode.removeChild(e);
            });
            if (!isAlert) return;
            this.UAList.unshift('{}');
            var tmp = {};
            tmp.label = Services.appinfo.name + Services.appinfo.version /*.split(".")[0] */ ;
            tmp.ua = "";
            tmp.image = this.Icons.DEFAULT_UA ? this.Icons.DEFAULT_UA : this.DEFAULT_Flag;
            this.UAList.unshift(tmp);
            var UANameIdxHash = [],
                UAList = this.UAList,
                menu = $("FeiRuoNet_UserAgent_Popup"),
                menuitem;
            if (UAList.length >= 2) {
                for (let i = 0; i < UAList.length; i++) {
                    UANameIdxHash[UAList[i].label] = i;
                    if (UAList[i].label === "separator" || (!UAList[i].label && !UAList[i].id && !UAList[i].ua)) {
                        menuitem = $C("menuseparator", {
                            id: "FeiRuoNet_UserAgent_" + i,
                            class: "FeiRuoNet_UserAgent_menuseparator",
                        });
                    } else {
                        menuitem = $C("menuitem", {
                            label: UAList[i].label || ("UA_" + i),
                            id: "FeiRuoNet_UserAgent_" + i,
                            image: UAList[i].image || this.Unknown_UAImage,
                            tooltiptext: UAList[i].ua || "",
                            oncommand: "FeiRuoNet.SetUserAgent('" + i + "');"
                        });
                        var cls = menuitem.classList;
                        cls.add("FeiRuoNet_UserAgent_item");
                        cls.add("menuitem-iconic");
                        if (UAList[i].ua == this.IsUsingUA || (UAList[i].ua == "" && !UAList[i].ua == !this.IsUsingUA)) {
                            this.UAPerfAppVersion = this.Services.UaAppVersion(i);
                            this.Default_UAIdx = i;
                        }
                    }
                    menu.appendChild(menuitem);
                    menuitem = null;
                }
                this.UARules = {};
                for (var j in this.UASites) {
                    this.UARules[j] = UANameIdxHash[this.UASites[j]] ? UANameIdxHash[this.UASites[j]] : this.Default_UAIdx;
                }
                $("FeiRuoNet_UserAgent_Config").hidden = false;
            } else {
                this.EnableUAChanger = false;
                $("FeiRuoNet_UserAgent_Config").hidden = true;
            }
        },
        /*****************************************************************************************/
        MenuItemClick: function(event) {
            if (event.target != FeiRuoNet.SetMenuitem || event.target != event.currentTarget) return;
            event.stopPropagation();
            event.preventDefault();
            if (event.button == 0) FeiRuoNet.OpenPref('Preferences');
            else if (event.button == 1) FeiRuoNet.Rebuild(true);
            if (event.button == 2) FeiRuoNet.EditFile(0);
        },
        IconClick: function(event) {
            if (event.target != FeiRuoNet.icon) return;
            if (event.target != event.currentTarget) return;
            if (event.button == 0) {
                FeiRuoNet.CopyStr();
                event.stopPropagation();
                event.preventDefault();
            } else if (event.button == 1) {
                FeiRuoNet.ShowFlag.LocationChange(true);
            }
            if (event.button == 2) {
                //$("FeiRuoNet_Popup").showPopup();
                //event.stopPropagation();
                //event.preventDefault();
            }
        },
        ProxyIconClick: function(event) {
            if (event.target != FeiRuoNet.ProxyMenuitem) return;
            event.stopPropagation();
            event.preventDefault();
            switch (event.button) {
                case 0:
                    if (FeiRuoNet.ProxyScheme.test(FeiRuoNet.CurrentURI.scheme) && FeiRuoNet.ProxyMode != 0) FeiRuoNet.SetUrlProxy(event);
                    break;
                case 1:
                    break;
                case 2:
                    FeiRuoNet.ProxyModeSwitch();
                    break;
            }
        },
        SetUserAgent: function(val) {
            if (val == 0) {
                if (gPrefService.getPrefType("general.useragent.override") == 0 && gPrefService.getPrefType("general.platform.override") == 0) return;
                gPrefService.clearUserPref("general.useragent.override");
                gPrefService.clearUserPref("general.platform.override");
                FeiRuoNet.Services.UAPerfAppVersion = false;
            } else {
                gPrefService.setCharPref("general.useragent.override", FeiRuoNet.UAList[val].ua);
                FeiRuoNet.Services.UAPerfAppVersion = FeiRuoNet.Services.UaAppVersion(val);
                var platform = FeiRuoNet.Services.getPlatformString(FeiRuoNet.UAList[val].ua);
                if (platform && platform != "") gPrefService.setCharPref("general.platform.override", platform);
                else gPrefService.clearUserPref("general.platform.override");
            }
            ShowStatus("浏览器标识(UserAgent)已切换至 [" + FeiRuoNet.UAList[val].label + "]");
            FeiRuoNet.Default_UAIdx = val;
            return;
        },
        UAMenuSrc: function(idx, UAItem) {
            if ((idx != 0 && !idx) || !UAItem) return false;
            $("FeiRuoNet_UserAgent_" + idx).classList.add("FeiRuoNet_UsingUA");
            UAItem.setAttribute("label", FeiRuoNet.UAList[idx].label);
            UAItem.setAttribute("image", FeiRuoNet.UAList[idx].image);
            return true;
        },
        ProxyModeIcon: function() {
            var ProxyItem = $('FeiRuoNet_AutoProxy_Config'),
                PS = this.ProxyServers[this.DefaultProxy];
            var tips = "[" + PS.name + "]" + PS.ProxyServer.host + ":" + PS.ProxyServer.port;
            switch (this.ProxyMode) {
                case 0:
                    ProxyItem.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAyVBMVEUAAADOAADOAADPAADNAADPAADLAQHQAADOAABIPz/OAADNAADOAADPAADNAADNAAC3DQ2/BgatEBDOAABrLi7LAQFDQUHPAADNAAAAaGjLAACMHx9kMTG0DAyoExM3R0fABga3Cwu/BwfNAADNAABEQkK9CAhLPT3VAABOPT3NAAAuS0tPPDw/RESoERE8RUVLPT3NAADXAADQAAA4R0duMTF0KyvFBgbNAABCQkI4RkbMAACjFBTBBQXGAwPbAADVAACoEhJoMDBwWI2hAAAAOHRSTlMAwlAJ8u/p/uP+5Lm3tSopDP799O3HwqotFxb9+vrs5+Lhz8zLx8G6uKKIhX1gVk9LST47MzAqE7JymfQAAAC+SURBVBjTbY/XksIwFENlx3ZC2oalLdt7p7drpxD4/48il7xyHs9oRhIaPJloXyfSQ0sq8qrslhWJGzBXgf9wb509HihIOS8ofxw+WevcHQkPkPnzZ/395WyjCpJArKbZwD90XCP6VQyoENiJ/XXHDSdz0wPIjIFbNn9AQIDufszOpvgHjAaSsr8GsHmpB95KRdzyCuanqEfv3JIJ/5fFeDsi3sFLKVoAWL5RmLbbBSkTGtV+ad9GPdKxzHCJE6b2FKK428+EAAAAAElFTkSuQmCC");
                    ProxyItem.setAttribute("tooltiptext", "当前代理: 无");
                    break;
                case 1:
                    ProxyItem.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAXVBMVEUAAABCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkIBBsBYAAAAHnRSTlMAyw3sKOi0XN8D+vJZ5LmHQxrZ0MCveWBKlpGATzNsa7UnAAAAlElEQVQY02WPSRbDIAxDBQ4QIPPcSfc/Zs2jWfXvbEu2DMUG7+h8sKg0hhXT1LrlTVs61jAtD/lp1BW4HKddWQmAzwHxxUISekD6sudoye28RAC6GUonHIGegEvmDWA2fMboBNgpn3pswpS9arlCidseMTCUURpRPBaj5qhJhwvANGjS+5fsepfvX9TVeaH4ruj/+QKxzgqWH12ujAAAAABJRU5ErkJggg==");
                    ProxyItem.setAttribute("tooltiptext", "当前代理: 智能代理\n " + tips);
                    break;
                case 2:
                    ProxyItem.setAttribute("image", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAZlBMVEUAAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADNAADJczcGAAAAIXRSTlMAyg3rtOZcKQP68+5ZJuDeuYdD2c7Ar31gSheWkXhPMx+30RQHAAAAlUlEQVQY02XPRRbDMAwE0DHGkIa5OPe/ZO24WfUvpXkCJNJqRaWtRHETLESFrGp5aXNFCvrxHn8ZCViOz01OLCygg4VbmXlFDSiT564tOW+7UgDVgaSO7IGGgPHiBeAQfDhnIrAwvsuyAUPQKcsJiZsXh442t3yP5CPRn3egatjtAIaOTXX9EowxgeKGQtbnt3XO//sCaoULwYAmMdEAAAAASUVORK5CYII=");
                    ProxyItem.setAttribute("tooltiptext", "当前代理: 全局代理\n " + tips);
                    break;
            }
        },
        ProxyModeSwitch: function() {
            var ProxyItem = $('FeiRuoNet_AutoProxy_Config');
            switch (this.ProxyMode) {
                case 0:
                    this.Prefs.setIntPref('ProxyMode', 1);
                    break;
                case 1:
                    this.Prefs.setIntPref('ProxyMode', 2);
                    break;
                case 2:
                    this.Prefs.setIntPref('ProxyMode', 0);
                    break;
            }
            setTimeout(function() {
                ShowStatus(ProxyItem.getAttribute("tooltiptext"));
            }, 100)
        },
        RefreshDNS: function(event) {
            Downloads.getSummary(Downloads.ALL).then(summary => {
                if (summary.allHaveStopped || confirm("有下载目前正在进行中。\n如果你刷新DNS现在下载会中断！你想继续吗？")) {
                    try {
                        IoSrv.offline = true;
                        Services.cache2.clear();
                        IoSrv.offline = false;
                        this.ShowFlag.LocationChange(true);
                        if (!event || (event && event.button != 2))
                            WinM.getMostRecentWindow("navigator:browser").getBrowser().reload();
                    } catch (e) {
                        ShowStatus("Error flushing DNS: " + e);
                    }
                }
            }).catch(exception => {
                ShowStatus(exception);
            })
        },
        /*****************************************************************************************/
        UpdateGFWList: function() {
            function errorCallback(result) {
                log(result);
                ShowStatus(result);
                if (result == 'UPDATE_SUCCESS') {
                    ShowStatus("订阅规则更新成功!");
                    FeiRuoNet.ReloadProxy();
                }
            }
            log("正在更新GFWList，请等待...");
            ShowStatus("正在更新GFWList，请等待...", 5000);
            let url = this.GFWListUrl
            var request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"].createInstance(Components.interfaces.nsIXMLHttpRequest);
            let me = this;
            request.onerror = function(event) {
                setTimeout(function() {
                    errorCallback(request.statusText);
                }, 0);
                var error = request.statusText;
                return error;
            };
            request.onload = function(event) {
                try {
                    self._rawData = request.responseText;
                    if (!self._rawData) {
                        var error = '返回了一个空文件！';
                        setTimeout(function() {
                            errorCallback(error);
                        }, 0);
                        return;
                    }
                    self._rawData = self._rawData.replace(/[\r\n]/g, '');
                    self._rawData = WinM.getMostRecentWindow("").atob(self._rawData);
                    FeiRuoNet.StrToFile(FeiRuoNet.GFWListFile, self._rawData);
                    setTimeout(function() {
                        errorCallback('UPDATE_SUCCESS');
                    }, 0);
                } catch (e) {
                    setTimeout(function() {
                        errorCallback(e.toString());
                    }, 0);
                }
            };
            request.open("GET", url);
            request.send(null);
        },
        SaveAutoProxyList: function() {
            var aFile = this.ProxyFile;
            this.AutoProxyListAct('Arrange');
            const PR_WRONLY = 0x02;
            const PR_CREATE_FILE = 0x08;
            const PR_TRUNCATE = 0x20;
            var rjson = {
                CreatedBy: 'FeiRuoNetAutoProxy',
                '注释': 'DisbledFilter并非白名单！！！仅为不代理效列表，可随时切换！',
                '优先级': 'GFWList白名单 >> DisbledFilter >> ProxyFilters & GFWList',
                DisbledFilter: [],
                ProxyFilters: []
            };
            for (var i = 0; i < FeiRuoNet.AutoProxy.AutoProxyList.length; i++) {
                if (FeiRuoNet.AutoProxy.AutoProxyList[i].disabled) rjson.DisbledFilter.push(FeiRuoNet.AutoProxy.AutoProxyList[i].text);
                else rjson.ProxyFilters.push(FeiRuoNet.AutoProxy.AutoProxyList[i].text);
            }
            var fileStream = new FileOutputStream(aFile, PR_WRONLY | PR_CREATE_FILE | PR_TRUNCATE, 0644, 0);
            var stream = new ConverterOutputStream(fileStream, "UTF-8", 16384, Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
            stream.writeString(JSON.stringify(rjson, null, 4));
            stream.close();
        },
        ArrangeAutoProxyList: function(type, domain) {
            var obj = {},
                Info = [];
            var Arr = FeiRuoNet.AutoProxy.AutoProxyList || [];
            Arr.forEach(function(i) {
                if (!obj[i.text]) {
                    obj[i.text] = true;
                    Info.push(i);
                }
            });
            FeiRuoNet.AutoProxy.AutoProxyList = Info;
        },
        AutoProxyListAct: function(type, domain) {
            var obj = {},
                Info = [];
            var Arr = FeiRuoNet.AutoProxy.AutoProxyList || [];
            Arr.forEach(function(i) {
                if (!obj[i.text]) {
                    switch (type) {
                        case 'Arrange':
                            obj[i.text] = true;
                            Info.push(i);
                            break;
                        case 'Remove':
                            if (domain && i.text != domain && !obj[i.text]) {
                                obj[i.text] = true;
                                Info.push(i);
                            }
                            break;
                        case 'RemoveDisable':
                            if (domain && !i._disabled && i.text == domain && !obj[i.text]) {
                                obj[i.text] = true;
                                Info.push(i);
                            }
                            break;
                    }
                }
            });
            FeiRuoNet.AutoProxy.AutoProxyList = Info;
        },
        ReloadProxy: function(isAlert) {
            try {
                ProxySrv.unregisterFilter(FeiRuoNet.Services.ProxyFilter);
            } catch (e) {}
            FeiRuoNet.AutoProxy.DefaultMatcher && FeiRuoNet.AutoProxy.DefaultMatcher.clear();
            if (!isAlert) return;
            FeiRuoNet.AutoProxy.DefaultMatcher = new CombinedMatcher();
            this.ImportFilters('ProxyFile');
            this.ImportFilters('GFWListFile');
            ProxySrv.registerFilter(FeiRuoNet.Services.ProxyFilter, 0);
        },
        CanNotProxy: function(amatch) {
            if (amatch.disabled) return true;
            else if (amatch instanceof FeiRuoNet.AutoProxy.WhitelistFilter) return true;
            else return false;
        },
        SetNewProxy: function(URL, status) {
            var URI = FeiRuoNet.CurrentURI || (gBrowser && gBrowser.selectedBrowser && gBrowser.selectedBrowser.currentURI);
            if (!URI) return;
            URL = URL || URI.spec;
            var ishave, domain = FeiRuoNet.GetDomain(URL);
            var ishave = false;
            if (!!status) {
                if (!URI || !/^((ht|f)tps?|about|chrome)/i.test(URI.scheme) || !URI.asciiHost) return;
                var host = URI.asciiHostPort || URI.HostPort || URI.hostPort || URI.host;
                if (FeiRuoNet.Caches.Query[host].ProxyTimes > FeiRuoNet.ProxyTimes) return;
                FeiRuoNet.Caches.Query[host].ProxyTimes = FeiRuoNet.Caches.Query[host].ProxyTimes + 1;
            }
            if (!status) {
                for (let i = 0; i < FeiRuoNet.AutoProxy.ProxyFilters.length; i++) {
                    if (FeiRuoNet.AutoProxy.ProxyFilters[i].matches(URL, domain)) {
                        if (FeiRuoNet.AutoProxy.ProxyFilters[i] instanceof FeiRuoNet.AutoProxy.WhitelistFilter) {
                            ishave = true;
                            break;
                        } else if (FeiRuoNet.AutoProxy.ProxyFilters[i].disabled) {
                            FeiRuoNet.AutoProxy.ProxyFilters[i].disabled = false;
                            if (FeiRuoNet.AutoProxy.ProxyFilters[i] instanceof FeiRuoNet.AutoProxy.RegExpFilter && !FeiRuoNet.AutoProxy.DefaultMatcher.hasFilter(FeiRuoNet.AutoProxy.ProxyFilters[i])) {
                                FeiRuoNet.AutoProxy.DefaultMatcher.add(FeiRuoNet.AutoProxy.ProxyFilters[i]);
                                FeiRuoNet.AutoProxy.AutoProxyList.push(FeiRuoNet.AutoProxy.ProxyFilters[i]);
                                FeiRuoNet.SaveAutoProxyList(true);
                                // FeiRuoNet.AutoProxyListAct('RemoveDisable', FeiRuoNet.AutoProxy.ProxyFilters[i].text);
                            }
                            ishave = true;
                            break;
                        } else {
                            FeiRuoNet.AutoProxy.ProxyFilters[i].disabled = 'true';
                            if (FeiRuoNet.AutoProxy.ProxyFilters[i].disabled && FeiRuoNet.AutoProxy.ProxyFilters[i] instanceof FeiRuoNet.AutoProxy.RegExpFilter && FeiRuoNet.AutoProxy.DefaultMatcher.hasFilter(FeiRuoNet.AutoProxy.ProxyFilters[i])) {
                                FeiRuoNet.AutoProxy.DefaultMatcher.remove(FeiRuoNet.AutoProxy.ProxyFilters[i]);
                                FeiRuoNet.AutoProxy.AutoProxyList.push(FeiRuoNet.AutoProxy.ProxyFilters[i]);
                                FeiRuoNet.SaveAutoProxyList(true);
                            }
                            ishave = true;
                            break;
                        }
                    }
                }
            }
            if (!ishave) {
                let filter = FeiRuoNet.AutoProxy.Filter.fromText(FeiRuoNet.AutoProxy.Filter.normalize(domain));
                if (filter && filter instanceof FeiRuoNet.AutoProxy.RegExpFilter) {
                    FeiRuoNet.AutoProxy.ProxyFilters.push(filter);
                    if (!FeiRuoNet.AutoProxy.DefaultMatcher.hasFilter(filter)) {
                        FeiRuoNet.AutoProxy.DefaultMatcher.add(filter);
                        FeiRuoNet.AutoProxy.AutoProxyList.push(filter);
                        FeiRuoNet.SaveAutoProxyList(true);
                    }
                }
            }
            FeiRuoNet.ShowFlag.LocationChange(true);
        },
        SetUrlProxy: function(event) {
            var URI = FeiRuoNet.CurrentURI;
            var tag = (event && event.target);
            if (!FeiRuoNet.ProxyScheme.test(URI.scheme) || FeiRuoNet.ProxyMode == 0) {
                return ShowStatus('不可代理！');
            }
            var obj = FeiRuoNet.Caches.Query[URI.asciiHostPort || URI.HostPort || URI.hostPort || URI.host] || {};
            if (!FeiRuoNet.ProxyLocal && /^((192\.168|172\.([1][6-9]|[2]\d|3[01]))(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}|10(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3})$/i.test(obj.IP))
                return ShowStatus("局域网禁用代理");
            if (!tag) return FeiRuoNet.SetNewProxy(URI.spec);
            if (!tag) tag = $('FeiRuoNet_AutoProxy_Config');
            if (tag.value != "blocked") {
                if (tag.filter) {
                    for (let i = 0; i < FeiRuoNet.AutoProxy.ProxyFilters.length; i++) {
                        if (FeiRuoNet.AutoProxy.ProxyFilters[i] == tag.filter) {
                            FeiRuoNet.AutoProxy.ProxyFilters[i].disabled = tag.value;
                            if (FeiRuoNet.AutoProxy.ProxyFilters[i].disabled && FeiRuoNet.AutoProxy.ProxyFilters[i] instanceof FeiRuoNet.AutoProxy.RegExpFilter && FeiRuoNet.AutoProxy.DefaultMatcher.hasFilter(FeiRuoNet.AutoProxy.ProxyFilters[i])) {
                                FeiRuoNet.AutoProxy.DefaultMatcher.remove(FeiRuoNet.AutoProxy.ProxyFilters[i]);
                                FeiRuoNet.AutoProxy.AutoProxyList.push(FeiRuoNet.AutoProxy.ProxyFilters[i]);
                            }
                            break;
                        }
                    }
                }
            } else {
                if (event.target.value == "blocked" && event.target.newfilter && event.target.newfilter.length == 2) {
                    var val = [];
                    val = event.target.newfilter;
                    FeiRuoNet.SetNewProxy(val[0]);
                }
            }
            FeiRuoNet.ShowFlag.LocationChange(true);
        },
        ImportFilters: function(type, isAlert) {
            var aFile = FeiRuoNet[type];
            if (!aFile || !aFile.exists() || !aFile.isFile()) {
                if (isAlert) alert(aFile.leafName + "规则文件不存在！");
                return log(aFile.leafName + "规则文件不存在！");
            }
            var fileStream = new FileInputStream(aFile, 0x01, 0444, 0);
            var stream = new ConverterInputStream(fileStream, "UTF-8", 16384, Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);
            FeiRuoNet.AutoProxy.FilterIsReady = false;

            function AddProxyFilters(filter) {
                if (filter && filter instanceof FeiRuoNet.AutoProxy.RegExpFilter && !FeiRuoNet.AutoProxy.DefaultMatcher.hasFilter(filter)) {
                    FeiRuoNet.AutoProxy.DefaultMatcher.add(filter);
                    FeiRuoNet.AutoProxy.ProxyFilters.push(filter);
                    return true;
                } else return false;
            }
            switch (type) {
                case "ProxyFile":
                    var str = {};
                    var rjson = '';
                    while (stream.readString(0xffffffff, str) != 0) {
                        rjson += str.value;
                    }
                    stream.close();
                    rjson = JSON.parse(rjson) || {};
                    FeiRuoNet.AutoProxy.AutoProxyList = [];
                    for (var i = 0; i < rjson.ProxyFilters.length; i++) {
                        let filter = FeiRuoNet.AutoProxy.Filter.fromText(FeiRuoNet.AutoProxy.Filter.normalize(rjson.ProxyFilters[i]));
                        if (filter && filter instanceof FeiRuoNet.AutoProxy.RegExpFilter) {
                            FeiRuoNet.AutoProxy.AutoProxyList.push(filter);
                            AddProxyFilters(filter);
                        }
                    }
                    for (var i = 0; i < rjson.DisbledFilter.length; i++) {
                        let filter = FeiRuoNet.AutoProxy.Filter.fromText(FeiRuoNet.AutoProxy.Filter.normalize(rjson.DisbledFilter[i]));
                        if (filter && filter instanceof FeiRuoNet.AutoProxy.RegExpFilter) {
                            FeiRuoNet.AutoProxy.AutoProxyList.push(filter);
                            AddProxyFilters(filter);
                        }
                        filter.disabled = true;
                        if (filter.disabled && filter instanceof FeiRuoNet.AutoProxy.RegExpFilter && FeiRuoNet.AutoProxy.DefaultMatcher.hasFilter(filter)) FeiRuoNet.AutoProxy.DefaultMatcher.remove(filter);
                        // var s = rjson.DisbledFilter[i];
                        // var a = s.replace(/^(@@\|\||@@|\|\|).*/i, '$1');
                        // if (a != s) s = s.replace(a, '');
                        // s = "@@||" + s;
                        // let filter = FeiRuoNet.AutoProxy.Filter.fromText(FeiRuoNet.AutoProxy.Filter.normalize(s));
                        // if (filter && filter instanceof FeiRuoNet.AutoProxy.RegExpFilter) {
                        //  FeiRuoNet.AutoProxy.AutoProxyList.push(filter);
                        //  AddProxyFilters(filter);
                        // }
                        // let filter = FeiRuoNet.AutoProxy.Filter.fromObject(FeiRuoNet.AutoProxy.Filter.normalize(rjson.DisbledFilter[i]));
                        // FeiRuoNet.AutoProxy.AutoProxyList.push(filter);
                        continue;
                    }
                    break;
                case "GFWListFile":
                    stream = stream.QueryInterface(Ci.nsIUnicharLineInputStream);
                    var line = {};
                    var val = "";
                    var cont;
                    do {
                        cont = stream.readLine(line);
                        val = line.value;
                        val = val.trim();
                        if (val != "" && val[0] != "[" && val[0] != "!") {
                            let filter = FeiRuoNet.AutoProxy.Filter.fromText(FeiRuoNet.AutoProxy.Filter.normalize(val));
                            AddProxyFilters(filter);
                        }
                    } while (cont);
                    break;
            }
            stream.close();
            FeiRuoNet.AutoProxy.FilterIsReady = true;
        },
        /*****************************************************************************************/
        contains: function(arr, obj) {
            var index = arr.length;
            while (index--) {
                if (arr[index] === obj) {
                    return true;
                }
            }
            return false;
        },
        ConvStr: function(str, host) {
            switch (true) {
                case null:
                case /^(Unknown|0|iana|-\?\?)$/i.test(str):
                    return {
                        src: this.Unknown_Flag,
                        str: '找不到服务器'
                    };
                case /^(OFFLINE)$/i.test(str):
                    return {
                        src: this.OffLine_Flag,
                        str: '离线模式'
                    };
                case /^(FILE)$/i.test(str):
                    return {
                        src: this.File_Flag,
                        str: '本地文件'
                    };
                case /^(BASE64|DATA)$/i.test(str):
                    return {
                        src: this.Base64_Flag,
                        str: '脚本编码文件'
                    };
                case /^(-L|localhost|127\.0\.0\.1|::1)/i.test(str):
                    return {
                        src: this.LocahHost_Flag,
                        str: '回送地址：本机[服务器]'
                    };
                    // case /^(LAN|-A|-B|-C)|^(10|172|192)\.([0-1][0-9]{0,2}|[2][0-5]{0,2}|[3-9][0-9]{0,1})\.([0-1][0-9]{0,2}|[2][0-5]{0,2}|[3-9][0-9]{0,1})\.([0-1][0-9]{0,2}|[2][0-5]{0,2}|[3-9][0-9]{0,1})/i.test(str):
                case /^(LAN|-A|-B|-C)|^((192\.168|172\.([1][6-9]|[2]\d|3[01]))(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}|10(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3})$/i.test(str):
                    return {
                        src: this.LAN_Flag,
                        str: '本地局域网服务器'
                    };
                case /^(ABOUT|MOZ-ICON|RESOURCE|CHROME|ABOUT)$/i.test(str):
                    return {
                        src: this.Mozilla_Flag || gBrowser.selectedTab.image,
                        str: '内部文件页面'
                    };
                case /^(BLANK)$/i.test(str):
                    return {
                        src: this.Loading_Flag,
                        str: '正在查询中，请稍后。。。'
                    };
                case /^(A1|A2|AP|DEFAULT)$/i.test(str):
                    return {
                        src: this.DEFAULT_Flag,
                        str: 'I do not known!'
                    };
            }
            return false;
        },
        GetDomain: function(url, isAlert) {
            var uri;
            if (typeof url != 'string') {
                uri = url;
                url = uri.spec;
            }
            if (!url || /^(about):(newtab|blank)$/i.test(url)) return;
            uri = uri || makeURI(url);
            var IsIp = this.CheckIP(uri.asciiHost || uri.host);
            if (IsIp) return IsIp;
            var domain = ETLDService.getBaseDomain(uri);
            var thx1 = domain.replace(ETLDService.getPublicSuffix(uri), "").replace('.', "");
            var thx2 = domain.substring(0, domain.lastIndexOf('.'));
            if (isAlert) return thx2;
            return domain || null;
        },
        CheckIP: function(str) {
            function isIPv6(str) {
                if (!str.match(/:/g)) return false;
                var isIPv6 = str.match(/:/g).length <= 7 && /::/.test(str) ? /^([\da-f]{1,4}(:|::)){1,6}[\da-f]{1,4}$/i.test(str) : /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(str);
                return isIPv6 ? str : false;
            }

            function isIPv4(str) {
                var isIPv4 = str.match(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/);
                return isIPv4 ? isIPv4[0] : false;
            }
            return isIPv4(str) || isIPv6(str);
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
        },
        GetHeaders: function(host) {
            if (!this.ServerInfo || !this.ServerInfo[0]) return;
            host = host || this.CurrentURI.asciiHostPort || this.CurrentURI.hostPort;
            var Cache, ServerInfo = this.ServerInfo,
                Info = [];
            if (!host) return;
            Cache = FeiRuoNet.Caches.Headers[host];
            if (!Cache) return;
            if (this.ServerInfo[0].All) {
                var AllFilter = (typeof ServerInfo[0].AllFilter == 'string') ? (new RegExp(ServerInfo[0].AllFilter)) : ServerInfo[0].AllFilter;
                for (var p in Cache) {
                    if (!AllFilter.test(p)) {
                        Info.push({
                            label: p,
                            value: Cache[p]
                        });
                    }
                }
            } else {
                for (var i = 0; i < ServerInfo.length; i++) {
                    var info = Cache[ServerInfo[i].words.toLowerCase()];
                    if (ServerInfo[i].Func) info = ServerInfo[i].Func(info);
                    if (info) {
                        Info.push({
                            label: ServerInfo[i].label,
                            value: info
                        });
                    }
                }
            }
            return Info;
        },
        GetWindow: function(win) {
            return WinM.getMostRecentWindow("FeiRuoNet:" + win);
        },
        LoadFile: function(aFile, isAlert) {
            if (!aFile || !aFile.exists() || !aFile.isFile()) return null;
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
            if (!data) {
                var errmsg = "Rebuild Error:【" + aFile.leafName + "】文件不存在";
                log(errmsg);
                if (isAlert) alert(errmsg);
                return null;
            }
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
                if (isAlert) alert(errmsg);
            }
            return sandbox || null;
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
        XRequest: function(obj) {
            return new Promise(function(resolve, reject) {
                var request = new XMLHttpRequest();
                request.open(obj.method || 'GET', obj.url, obj.async || true, obj.bstrUser || null, obj.bstrPassword || null);
                if (obj.responseType) //返回类型
                    request.responseType = obj.responseType;
                request.timeout = obj.timeout || FeiRuoNet.Inquiry_Delay; //延迟时间，毫秒
                request.ontimeout = onerror;
                if (obj.onreadystatechange) request.onreadystatechange = obj.onreadystatechange; //存储函数（或函数名），每当 readyState 属性改变时，就会调用该函数。
                if (obj.overrideMimeType) request.overrideMimeType = obj.overrideMimeType; //覆盖发送给服务器的头部，强制 overrideMimeType 作为 mime-type。
                if (obj.setRequestHeader) { //自定义HTTP头部信息。需在open()方法之后和send()之前调用，才能成功发送请求头部信息。
                    for (let [key, val] in Iterator(obj.setRequestHeader)) {
                        request.setRequestHeader(key, val);
                    }
                }
                request.onload = function() {
                    resolve(request);
                };
                request.onerror = function(event) {
                    reject(event);
                };
                request.send(obj.SendString || null); //将请求发送到服务器。参数string仅用于POST请求；对于GET请求的参数写在url后面，所以string参数传递null。
                if (obj.getResponseHeader && obj.getResponseHeader.length > 0) { //获取指定的相应头部信息
                    if (obj.getResponseHeader[0] == "All") request.getAllResponseHeaders();
                    else {
                        var hdarry = [];
                        obj.getResponseHeader.forEach(hd => {
                            hdarry.push(request.getResponseHeader(hd));
                        })
                    }
                }
            });
        },
        CheckModified: function(type) {
            var aFile = this[type];
            if ((aFile && aFile.exists() && aFile.isFile()) && (this[type + '_ModifiedTime'] != aFile.lastModifiedTime)) {
                this[type + '_ModifiedTime'] = aFile.lastModifiedTime;
                return true;
            } else return false;
        },
        UpdateFile: function(type) {
            var NeedRebuild = false;
            if (!type || type == 'ConfFile') {
                NeedRebuild = this.CheckModified('ConfFile');
            }
            if (!type || type == 'MenuFile') {
                NeedRebuild = this.CheckModified('MenuFile');
            }
            if (!type || type == 'ProxyFile') {
                this.CheckModified('ProxyFile') && this.ImportFilters('ProxyFile', true);
            }
            if (!type || type == 'GFWListFile') {
                this.CheckModified('GFWListFile') && this.ImportFilters('GFWListFile', true);
            }
            if (NeedRebuild) {
                setTimeout(function() {
                    FeiRuoNet.Rebuild(true);
                }, 10);
            }
        },
        AddStyle: function(isAlert, n, css = '', SHEET = 'AGENT_SHEET') {
            this.CSSList || (this.CSSList = [])
            if (typeof isAlert == 'string') {
                css = n;
                n = isAlert;
                isAlert = true;
            }
            this.CSSList[n] = makeURI('data:text/css,' + encodeURIComponent(css));
            var SSSS = Cc["@mozilla.org/content/style-sheet-service;1"].getService(Ci.nsIStyleSheetService);
            try {
                SSSS.unregisterSheet(this.CSSList[n], SSSS[SHEET]);
            } catch (ex) {}
            if (!isAlert) return;
            SSSS.loadAndRegisterSheet(this.CSSList[n], SSSS[SHEET]);
        },
        EditFile: function(aFile) {
            if (aFile == 0) aFile = this.ConfFile;
            else if (aFile == 1 || !aFile) aFile = this.MenuFile;
            else if (aFile == 2 || !aFile) aFile = this.ProxyFile;
            else if (typeof(aFile) == "string") {
                if (/^file:\/\//.test(aFile)) aFile = aFile.QueryInterface(Components.interfaces.nsIFileURL).file;
                else {
                    var File = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
                    aFile = File.initWithPath(aFile);
                }
            } else return;
            if (!aFile || !aFile.exists() || !aFile.isFile()) return alert("文件不存在:\n" + aFile.path);
            var editor;
            try {
                editor = gPrefService.getCharPref("view_source.editor.path");
            } catch (e) {}
            if (!editor) {
                this.OpenScriptInScratchpad(window, aFile);
                alert("请先设置编辑器的路径!!!\nview_source.editor.path");
                return;
            }
            var UI = Cc['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Ci.nsIScriptableUnicodeConverter);
            var platform = window.navigator.platform.toLowerCase();
            if (platform.indexOf('win') > -1) UI.charset = 'GB2312';
            else UI.charset = 'UTF-8';
            // UI.charset = window.navigator.platform.toLowerCase().indexOf("win") >= 0 ? "gbk" : "UTF-8";
            var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
            try {
                var path = UI.ConvertFromUnicode(aFile.path);
                // process.init(editor);
                // process.run(false, [path], [path].length);
                var appfile = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
                appfile.initWithPath(editor);
                process.init(appfile);
                process.run(false, [path], 1, {});
            } catch (e) {
                alert("编辑器不正确！")
                this.OpenScriptInScratchpad(window, aFile);
            }
        },
        CopyStr: function(str) {
            str = str || FeiRuoNet.Caches.Query[FeiRuoNet.CurrentURI.host].IP;
            if (!str) return;
            Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString(str);
            ShowStatus = "已复制: " + str;
        },
        OpenScriptInScratchpad: function(parentWindow, file) {
            let spWin = (parentWindow.Scratchpad || Services.wm.getMostRecentWindow("navigator:browser").Scratchpad).openScratchpad();
            spWin.addEventListener("load", function spWinLoaded() {
                spWin.removeEventListener("load", spWinLoaded, false);
                let Scratchpad = spWin.Scratchpad;
                Scratchpad.setFilename(file.path);
                Scratchpad.addObserver({
                    onReady: function() {
                        Scratchpad.removeObserver(this);
                        Scratchpad.importFromFile.call(Scratchpad, file);
                    }
                });
            }, false);
        },
        OpenPref: function(win) {
            win = this.GetWindow(win);
            if (win) win.focus();
            else {
                window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + this.OptionWin(), '', 'chrome,titlebar,toolbar,centerscreen,dialog=no');
            }
        },
        OptionWin: function() {
            var xml = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
                    <prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
                    id="FeiRuoNet_Settings"\
                    ignorekeys="true"\
                    title="FeiRuoNet 设置"\
                    onload="opener.FeiRuoNet.OptionScript.init();"\
                    onunload="opener.FeiRuoNet.UpdateFile();"\
                    buttons="accept,cancel,extra1,extra2"\
                    ondialogextra1="opener.FeiRuoNet.EditFile(0);"\
                    ondialogextra2="opener.FeiRuoNet.EditFile(1);"\
                    ondialogaccept="opener.FeiRuoNet.OptionScript.Save();"\
                    windowtype="FeiRuoNet:Preferences">\
                    <prefpane id="main" flex="1">\
                        <preferences>\
                            <preference id="BAK_FLAG_PATH" type="string" name="userChromeJS.FeiRuoNet.BAK_FLAG_PATH"/>\
                            <preference id="BAK_FLAG_PATH_Format" type="string" name="userChromeJS.FeiRuoNet.BAK_FLAG_PATH_Format"/>\
                            <preference id="CustomQueue" type="int" name="userChromeJS.FeiRuoNet.CustomQueue"/>\
                            <preference id="DefaultProxy" type="int" name="userChromeJS.FeiRuoNet.DefaultProxy"/>\
                            <preference id="Icon_Pos" type="int" name="userChromeJS.FeiRuoNet.Icon_Pos"/>\
                            <preference id="ApiIdx" type="int" name="userChromeJS.FeiRuoNet.ApiIdx"/>\
                            <preference id="Inquiry_Delay" type="int" name="userChromeJS.FeiRuoNet.Inquiry_Delay"/>\
                            <preference id="UrlbarSafetyLevel" type="bool" name="userChromeJS.FeiRuoNet.UrlbarSafetyLevel"/>\
                            <preference id="ModifyHeader" type="bool" name="userChromeJS.FeiRuoNet.ModifyHeader"/>\
                            <preference id="ProxyMode" type="int" name="userChromeJS.FeiRuoNet.ProxyMode"/>\
                            <preference id="ProxyPath" type="string" name="userChromeJS.FeiRuoNet.ProxyPath"/>\
                            <preference id="IconShow" type="string" name="userChromeJS.FeiRuoNet.IconShow"/>\
                            <preference id="ProxyTimer" type="int" name="userChromeJS.FeiRuoNet.ProxyTimer"/>\
                            <preference id="ProxyTimes" type="int" name="userChromeJS.FeiRuoNet.ProxyTimes"/>\
                            <preference id="EnableRefChanger" type="bool" name="userChromeJS.FeiRuoNet.EnableRefChanger"/>\
                            <preference id="EnableUAChanger" type="bool" name="userChromeJS.FeiRuoNet.EnableUAChanger"/>\
                            <preference id="EnableProxyByError" type="bool" name="userChromeJS.FeiRuoNet.EnableProxyByError"/>\
                            <preference id="ProxyLocal" type="bool" name="userChromeJS.FeiRuoNet.ProxyLocal"/>\
                        </preferences>\
                        <script>\
                            function Change() {\
                                opener.FeiRuoNet.OptionScript.ChangeStatus();\
                            }\
                        </script>\
                        <vbox>\
                            <row>\
                                <groupbox style="width:550px">\
                                    <caption label="Tip" />\
                                        <grid>\
                                            <rows>\
                                                <row align="center">\
                                                    <label id="QQwrtVer"/>\
                                                </row>\
                                                <row align="center">\
                                                    <button id="QQwrt_Download" label="下载QQwrt" oncommand="opener.FeiRuoNet.OptionScript.openNewTab(\'https://www.baidu.com/s?word=qqwry\');"/>\
                                                </row>\
                                            </rows>\
                                        </grid>\
                                </groupbox>\
                            </row>\
                            <rows style="width:550px">\
                                <row>\
                                    <groupbox style="width:273px">\
                                        <caption label="功能开关(需要配置文件支持)" />\
                                            <grid>\
                                                <rows>\
                                                    <row align="center">\
                                                        <checkbox id="EnableRefChanger" label="破解反盗链" preference="EnableRefChanger" />\
                                                    </row>\
                                                    <row align="center">\
                                                        <checkbox id="EnableUAChanger" label="修改浏览器标识" preference="EnableUAChanger" />\
                                                    </row>\
                                                    <row align="center">\
                                                        <checkbox id="ModifyHeader" label="修改HTTP头信息" preference="ModifyHeader" />\
                                                    </row>\
                                                    <row align="center">\
                                                        <checkbox id="UrlbarSafetyLevel" label="HTTPS等级高亮" preference="UrlbarSafetyLevel" />\
                                                    </row>\
                                                    <row align="center">\
                                                        <checkbox id="EnableProxyByError" label="网络错误时代理" ' + (gMultiProcessBrowser ? "disabled=\"true\" tooltiptext=\"E10S下禁用此功能！\"" : "tooltiptext=\"智能代理模式下，遇到网络错误问题时，将该域名加入代理规则列表，错误率较大！\"") + ' preference="EnableProxyByError" />\
                                                    </row>\
                                                    <row align="center">\
                                                        <checkbox id="ProxyLocal" label="代理对局域网生效" preference="ProxyLocal" />\
                                                    </row>\
                                                </rows>\
                                            </grid>\
                                    </groupbox>\
                                    <groupbox style="width:273px">\
                                        <caption label="一般设置" />\
                                            <grid>\
                                                <rows>\
                                                    <row align="center">\
                                                        <label value="查询延时："/>\
                                                        <textbox id="Inquiry_Delay" style="width:140px;" type="number" preference="Inquiry_Delay" placeholder="3500毫秒" tooltiptext="延迟时间，时间内未取得所选择查询源数据，就使用备用询源。"/>\
                                                    </row>\
                                                    <row align="center">\
                                                        <label value="图标位置：" />\
                                                        <menulist preference="Icon_Pos" id="Icon_Pos">\
                                                            <menupopup id="Icon_Pos_Popup">\
                                                                <menuitem label="地址栏左边" value="0"/>\
                                                                <menuitem label="地址栏图标" value="1"/>\
                                                                <menuitem label="可移动按钮" value="2"/>\
                                                            </menupopup>\
                                                        </menulist>\
                                                    </row>\
                                                    <row align="center">\
                                                        <label value="显示顺序：" />\
                                                        <menulist preference="CustomQueue" style="width:110px" id="CustomQueue">\
                                                            <menupopup id="CustomQueue_Popup">\
                                                                <menuitem label="添加顺序" value="0"/>\
                                                                <menuitem label="响应速度" value="1"/>\
                                                            </menupopup>\
                                                        </menulist>\
                                                    </row>\
                                                    <row align="center">\
                                                        <label value="查询源：" tooltiptext="优先使用本地数据库"/>\
                                                        <menulist preference="ApiIdx" id="ApiIdx1"/>\
                                                    </row>\
                                                    <row align="center">\
                                                        <label value="默认代理："/>\
                                                        <menulist preference="DefaultProxy" id="DefaultProxy1" style="width:100px;"/>\
                                                    </row>\
                                                    <row align="center">\
                                                        <label value="代理模式选择：" />\
                                                        <menulist preference="ProxyMode" id="ProxyMode" style="width:100px">\
                                                            <menupopup id="ProxyMode_Popup">\
                                                                <menuitem label="禁用代理" value="0"/>\
                                                                <menuitem label="智能代理" value="1"/>\
                                                                <menuitem label="全局代理" value="2"/>\
                                                            </menupopup>\
                                                        </menulist>\
                                                    </row>\
                                                </rows>\
                                                </grid>\
                                    </groupbox>\
                                </row>\
                            </rows>\
                            <groupbox style="width:550px">\
                                <caption label="自定义设置" />\
                                    <rows>\
                                        <row align="center">\
                                            <label value="图标显示协议："/>\
                                            <textbox id="IconShow" placeholder="协议内容" preference="IconShow" style="width:435px;" tooltiptext="正则，仅当【图标位置】为【地址栏左边】时生效"/>\
                                        </row>\
                                    </rows>\
                                    <rows>\
                                        <row align="center">\
                                            <row align="center">\
                                                <label value="网络图标地址："/>\
                                                <textbox id="BAK_FLAG_PATH" placeholder="图标优先级：png→lib→网络图标" preference="BAK_FLAG_PATH" style="width:320px" tooltiptext="http://www.1108.hk/images/ext/ \n http://www.myip.cn/images/country_icons/ 等等。"/>\
                                            </row>\
                                            <row align="center">\
                                                <label value="格式："/>\
                                                <textbox id="BAK_FLAG_PATH_Format" preference="BAK_FLAG_PATH_Format" style="width:60px" tooltiptext="gif、png、jpg、bmp 等等。"/>\
                                            </row>\
                                        </row>\
                                    </rows>\
                                    <!--<rows>\
                                        <row align="center">\
                                            <label value="代理软件路径："/>\
                                            <textbox id="ProxyPath" placeholder="在触发代理条件下，如果代理软件尚未启动，则启动之" tooltiptext="支持相对路径, 正反双斜杠开头，相对于chrome文件夹" style="width:310px" preference="ProxyPath"/>\
                                            <button label="浏览" tooltiptext="支持相对路径" oncommand="opener.FeiRuoNet.OptionScript.ChouseFile();"/>\
                                        </row>\
                                    </rows>-->\
                            </groupbox>\
                            <groupbox style="width:550px">\
                                <caption label="代理服务器设置(请勿包含“|”或“;”)"/>\
                                    <grid>\
                                        <rows id="ProxyRows">\
                                            <row id="discription">\
                                                <label value="名称"/>\
                                                <label value="地址"/>\
                                                <label value="端口"/>\
                                                <hbox>\
                                                    <label value="Http" style="margin-left:10px;"/>\
                                                    <label value="Https" style="margin-left:-1px;"/>\
                                                    <label value="Socks4" style="margin-left:-1px;"/>\
                                                    <label value="Socks5" style="margin-left:-1px;"/>\
                                                </hbox>\
                                                <label value="远程DNS"/>\
                                                <label value="删除"/>\
                                            </row>\
                                        </rows>\
                                    </grid>\
                                    <description id="warning" hidden="true">警告: 删除所有代理后请添加一个代理，否则代理将无法工作。</description>\
                                    <description id="note" hidden="true">注意: 删除默认代理后请选择一个新的默认代理(通过图标右键菜单项 "默认代理" 选择), 否则代理可能无法工作。</description>\
                                    <description id="tip" hidden="true">提示: 点击"取消" 按钮能撤销之前的操作。</description>\
                                    <menuseparator/>\
                                    <hbox style="width:495px">\
                                        <row align="center">\
                                            <label value="尝试次数："/>\
                                            <textbox id="ProxyTimes" type="number" preference="ProxyTimes" style="width:75px;" placeholder="小于等于设定次数" tooltiptext="次数内，仍然无法打开则停止自动代理"/>\
                                        </row>\
                                        <spacer flex="1" />\
                                        <row align="center">\
                                            <label value="切换延时："/>\
                                            <textbox id="ProxyTimer" type="number" preference="ProxyTimer" style="width:75px;" placeholder="3500毫秒" tooltiptext="时间内代理服务器无响应，就切换到另下个代理服务器。"/>\
                                        </row>\
                                    </hbox>\
                                    <menuseparator/>\
                                    <hbox style="width:495px">\
                                        <button id="UpdateGFWList" label="更新GFWList" oncommand="opener.FeiRuoNet.UpdateGFWList();"/>\
                                        <button id="EditProxyList" label="自定规则" oncommand="opener.FeiRuoNet.EditFile(2);"/>\
                                        <spacer flex="1" />\
                                        <button id="ProxyRowsBtn1" label="添加代理" oncommand="opener.FeiRuoNet.OptionScript.AddNewRow();"/>\
                                        <button id="ProxyRowsBtn2" label="删除代理" oncommand="opener.FeiRuoNet.OptionScript.DelSelectedRow();"/>\
                                    </hbox>\
                            </groupbox>\
                        </vbox>\
                        <hbox flex="1">\
                            <button dlgtype="extra1" label="编辑规则"/>\
                            <button dlgtype="extra2" label="编辑菜单"/>\
                            <spacer flex="1" />\
                            <button label="重置" oncommand="opener.FeiRuoNet.OptionScript.Resets();"/>\
                            <button label="应用" oncommand="opener.FeiRuoNet.OptionScript.Save();"/>\
                            <button dlgtype="accept"/>\
                            <button dlgtype="cancel"/>\
                        </hbox>\
                    </prefpane>\
                    </prefwindow>\
                ';
            return encodeURIComponent(xml);
        }
    };
    FeiRuoNet.Services = {
        QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener", "nsISupportsWeakReference"]),
        ObsEvents: ["http-on-modify-request", "document-shown", "document-element-inserted", "ipc:content-created", "content-document-loaded", "content-document-global-created", "content-document-interactive", "http-on-examine-response", "http-on-examine-cached-response", "http-on-examine-merged-response"],
        MultiProcessScript: ("data:application/javascript," + encodeURIComponent('addMessageListener("FeiRuoNet:FeiRuoNet-FlagA", function() {sendAsyncMessage("FeiRuoNet:FeiRuoNet-FlagB", {URL: content.document.URL});}, false);')),
        init: function() {
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
            if (!this.MutationObs) this.MutationObs = new MutationObserver(this.UrlbarSL);
            this.MutationObs.observe($('identity-box'), {
                attributes: true,
                attributeFilter: ["class"]
            });
            if (gMultiProcessBrowser) window.messageManager.loadFrameScript(this.MultiProcessScript, true);
            gBrowser.addProgressListener(this);
            var enumerator = WinM.getEnumerator("navigator:browser");
            while (enumerator.hasMoreElements()) {
                var win = enumerator.getNext();
                if (win.FeiRuoNet && win.FeiRuoNet.RegisterDone) {
                    return;
                }
            }
            if (!FeiRuoNet.IsMain) return;
            try {
                this.ObsEvents.forEach(obs => {
                    Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService).addObserver(this, obs, false);
                });
            } catch (e) {}
            FeiRuoNet.Prefs.addObserver('', this, false);
            FeiRuoNet.RegisterDone = true;
        },
        onDestroy: function() {
            this.UrlbarSL();
            FeiRuoNet.Default_UAIdx = 0;
            if (gMultiProcessBrowser) window.messageManager.removeDelayedFrameScript(this.MultiProcessScript);
            gBrowser.removeProgressListener(this);
            if (FeiRuoNet.RegisterDone) {
                try {
                    this.ObsEvents.forEach(obs => {
                        Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService).removeObserver(this, obs, false);
                    });
                } catch (e) {}
                FeiRuoNet.Prefs.removeObserver('', this, false);
                FeiRuoNet.RegisterDone = false;
            }
        },
        handleEvent: function(event) {
            switch (event.type) {
                case 'popupshowing':
                    break;
            }
        },
        observe: function(subject, topic, data) {
            switch (topic.toLowerCase()) {
                case "http-on-modify-request":
                    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
                    if (!gMultiProcessBrowser) {
                        var Tracing = httpChannel.QueryInterface(Ci.nsITraceableChannel);
                        var NewListener = new TracingListener();
                        NewListener.originalListener = Tracing.setNewListener(NewListener);
                    }
                    var Rules = {};
                    if (FeiRuoNet.ModifyHeader && FeiRuoNet.HeadRules) {
                        for (var i in FeiRuoNet.HeadRules) {
                            if (new RegExp(i).test(httpChannel.URI.spec)) Rules = FeiRuoNet.HeadRules[i];
                        }
                    }
                    var idx = this.UAIndex(httpChannel.URI.spec);
                    if (idx && FeiRuoNet.UAList[idx] && FeiRuoNet.UAList[idx].ua) Rules['User-Agent'] = FeiRuoNet.UAList[idx].ua;
                    if (!!Rules) {
                        for (var l in Rules) {
                            var rule = Rules[l];
                            httpChannel.setRequestHeader(l, rule, false);
                        }
                    }
                    if (FeiRuoNet.EnableRefChanger) {
                        for (var s = httpChannel.URI.host; s != ""; s = s.replace(/^.*?(\.|$)/, "")) {
                            if (this.AdjustRef(httpChannel, s)) return;
                        }
                        if (httpChannel.referrer && httpChannel.referrer.host != httpChannel.originalURI.host) httpChannel.setRequestHeader('Referer', httpChannel.originalURI.spec.replace(/[^/]+$/, ''), false);
                    }
                    break;
                case "document-element-inserted":
                case "content-document-loaded":
                case "content-document-interactive":
                case "ipc:content-created":
                    break;
                case "content-document-global-created":
                    var aSubject;
                    if (subject.defaultView) aSubject = subject.defaultView;
                    if (subject.QueryInterface && subject.document) aSubject = subject;
                    if (aSubject) this.AdjustUserAgent(aSubject);
                    break;
                case "document-shown":
                    break;
                case "http-on-examine-response":
                case "http-on-examine-cached-response":
                case "http-on-examine-merged-response":
                    var httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
                    var url = httpChannel.URI.spec.replace(/#.*$/, '');
                    var host = httpChannel.URI.asciiHostPort || httpChannel.URI.hostPort;
                    //see http://tool.oschina.net/commons
                    if (httpChannel.contentType === 'text/html') {
                        FeiRuoNet.Caches.Headers[host] || (FeiRuoNet.Caches.Headers[host] = {});
                        httpChannel.visitResponseHeaders(function(header, value) {
                            FeiRuoNet.Caches.Headers[host][header.toLowerCase()] = value;
                        });
                    }
                    //Set response header
                    break;
                case "nspref:changed":
                    switch (data) {
                        case 'Icon_Pos':
                        case 'IconSstatusBarPanel':
                        case 'Inquiry_Delay':
                        case 'ApiIdx':
                        case 'BAK_FLAG_PATH':
                        case 'BAK_FLAG_PATH_Format':
                        case 'IconShow':
                        case 'EnableRefChanger':
                        case 'EnableUAChanger':
                        case 'EnableProxyByError':
                        case 'UrlbarSafetyLevel':
                        case 'ModifyHeader':
                        case 'ProxyServers':
                        case 'DefaultProxy':
                        case 'ProxyMode':
                        case 'ProxyScheme':
                        case 'ProxyLocal':
                        case 'ProxyTimes':
                        case 'ProxyTimer':
                            FeiRuoNet.LoadSetting(data);
                            break;
                    }
                    break;
            }
        },
        NetStatus: function(request, context, status) {
            // console.log(request, context, status)
            if ((status & 0xff0000) === 0x5a0000) {
                const nsINSSErrorsService = Ci.nsINSSErrorsService;
                if ((status & 0xffff) < Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE)) {
                    let nssErr = Math.abs(nsINSSErrorsService.NSS_SEC_ERROR_BASE) - (status & 0xffff);
                    switch (nssErr) {
                        case 11: // SEC_ERROR_EXPIRED_CERTIFICATE, sec(11) 证书过期
                            errName = 'SecurityExpiredCertificateError';
                            break;
                        case 12: // SEC_ERROR_REVOKED_CERTIFICATE, sec(12)  证书吊销
                            errName = 'SecurityRevokedCertificateError';
                            break;
                        case 13: // SEC_ERROR_UNKNOWN_ISSUER, sec(13)  未知发行者
                        case 20: // SEC_ERROR_UNTRUSTED_ISSUER, sec(20) 不受信任的发行者
                        case 21: // SEC_ERROR_UNTRUSTED_CERT, sec(21) 不受信任的证书
                        case 36: // SEC_ERROR_CA_CERT_INVALID, sec(36)  CA证书无效
                            errName = 'SecurityUntrustedCertificateIssuerError';
                            break;
                        case 90: // SEC_ERROR_INADEQUATE_KEY_USAGE, sec(90)  关键使用不足？
                            errName = 'SecurityInadequateKeyUsageError';
                            break;
                        case 176: // SEC_ERROR_CERT_SIGNATURE_ALGORITHM_DISABLED, sec(176) 证书签名算法禁用
                            errName = 'SecurityCertificateSignatureAlgorithmDisabledError';
                            break;
                        default:
                            errName = 'SecurityError';
                            break;
                    }
                } else {
                    let sslErr = Math.abs(nsINSSErrorsService.NSS_SSL_ERROR_BASE) - (status & 0xffff);
                    switch (sslErr) {
                        case 3: // SSL_ERROR_NO_CERTIFICATE, ssl(3) 无证书
                            errName = 'SecurityNoCertificateError';
                            break;
                        case 4: // SSL_ERROR_BAD_CERTIFICATE, ssl(4) 错误证书
                            errName = 'SecurityBadCertificateError';
                            break;
                        case 8: // SSL_ERROR_UNSUPPORTED_CERTIFICATE_TYPE, ssl(8) 不支持的证书类型
                            errName = 'SecurityUnsupportedCertificateTypeError';
                            break;
                        case 9: // SSL_ERROR_UNSUPPORTED_VERSION, ssl(9)  不支持的TLS版本
                            errName = 'SecurityUnsupportedTLSVersionError';
                            break;
                        case 12: // SSL_ERROR_BAD_CERT_DOMAIN, ssl(12)  证书域不匹配
                            errName = 'SecurityCertificateDomainMismatchError';
                            break;
                        default:
                            errName = 'SecurityError';
                            break;
                    }
                }
            }
            if (status == 0) return;
            switch (status) {
                case 0x804B000C: // connect to host:port failed NS_ERROR_CONNECTION_REFUSED, network(13)
                case 0x804B000E: // network timeout error NS_ERROR_NET_TIMEOUT, network(14)
                case 0x804B0047: // NS_ERROR_NET_INTERRUPT, network(71)  NetworkInterruptError
                    if (FeiRuoNet.EnableProxyByError && FeiRuoNet.ProxyMode == 1 && request.name) {
                        FeiRuoNet.SetNewProxy(false, true);
                    }
                    break;
                case 0x804B001E: // hostname lookup failed NS_ERROR_UNKNOWN_HOST, network(30)
                    break;
            }
        },
        UrlbarSL: function(records) {
            gURLBar.classList.remove('FeiRuoNetSSLhigh');
            gURLBar.classList.remove('FeiRuoNetSSLmid');
            gURLBar.classList.remove('FeiRuoNetSSLlow');
            gURLBar.classList.remove('FeiRuoNetSSLbroken');
            if (!records || !FeiRuoNet.UrlbarSafetyLevel) return;
            var cls = "",
                classList = records[0].target.classList;
            if (FeiRuoNet.contains(classList, "mixedDisplayContent") || FeiRuoNet.contains(classList, "mixedActiveContent")) cls = "FeiRuoNetSSLbroken";
            if (FeiRuoNet.contains(classList, "weakCipher")) cls = "FeiRuoNetSSLlow";
            // if (classList.contains("verifiedDomain") || classList.contains("grantedPermissions")) cls = "FeiRuoNetSSLmid";
            if (FeiRuoNet.contains(classList, "verifiedDomain")) cls = "FeiRuoNetSSLmid";
            if (FeiRuoNet.contains(classList, "verifiedIdentity")) cls = "FeiRuoNetSSLhigh";
            cls && gURLBar.classList.add(cls);
        },
        UAIndex: function(url) {
            if (!FeiRuoNet.EnableUAChanger || !url || !FeiRuoNet.UARules) return;
            for (var i in FeiRuoNet.UARules) {
                if ((new RegExp(i, "i")).test(url)) return FeiRuoNet.UARules[i];
            }
            return;
        },
        AdjustRef: function(http, site) {
            try {
                var sRef;
                var refAction = undefined;
                for (var i in FeiRuoNet.RefererChange) {
                    if (site.indexOf(i) != -1) {
                        refAction = FeiRuoNet.RefererChange[i];
                        break;
                    }
                }
                if (refAction == undefined) return true;
                if (refAction.charAt(0) == '@') {
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
        },
        AdjustUserAgent: function(aSubject) {
            var aChannel;
            if (aSubject) aChannel = aSubject.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsIDocShell).currentDocumentChannel;
            if (!aChannel || !(aChannel instanceof Ci.nsIHttpChannel)) return false;
            var navigator = aSubject.navigator;
            var userAgent = aChannel.getRequestHeader('User-Agent') || null;
            if (userAgent && navigator.userAgent != userAgent) {
                Object.defineProperty(XPCNativeWrapper.unwrap(navigator), 'userAgent', {
                    value: userAgent,
                    enumerable: true
                });
                var platform = this.getPlatformString(userAgent);
                if (platform && platform != '') {
                    Object.defineProperty(XPCNativeWrapper.unwrap(navigator), 'platform', {
                        value: platform,
                        enumerable: true
                    });
                }
            }
            var appVersion = this.UaAppVersion(this.UAIndex(aSubject.location.href)) || this.UAPerfAppVersion;
            if (appVersion) {
                Object.defineProperty(XPCNativeWrapper.unwrap(navigator), 'appVersion', {
                    value: appVersion,
                    enumerable: true
                });
            }
            return true;
        },
        UaAppVersion: function(idx) {
            if (!idx) return;
            var obj = FeiRuoNet.UAList[idx],
                appVersion = false;
            if (obj.appVersion) {
                if (typeof(obj.appVersion) == 'boolean') appVersion = obj.ua.replace(/^Mozilla\//, '');
                else if (typeof(obj.appVersion) == 'string') appVersion = obj.appVersion;
                else appVersion = false;
            }
            return appVersion;
        },
        getPlatformString: function(userAgent) {
            if (!userAgent) return;
            var p = "";
            var s = userAgent.toLowerCase();
            switch (true) {
                case s.indexOf("Win64") > -1:
                    p = "Win64";
                    break;
                case s.indexOf("windows") > -1:
                    p = "Win32";
                    break;
                case s.indexOf("android") > -1:
                    p = "Linux armv7l";
                    break;
                case s.indexOf("linux") > -1:
                    p = "Linux i686";
                    break;
                case s.indexOf("iphone") > -1:
                    p = "iPhone";
                    break;
                case s.indexOf("ipad") > -1:
                    p = "iPad";
                    break;
                case s.indexOf("ipad") > -1:
                    p = "iPad";
                    break;
                case s.indexOf("mac os x") > -1:
                    p = "MacIntel";
                    break;
            }
            // if (s.indexOf("windows") > -1) p = "Win32";
            // else if (s.indexOf("Win64") > -1) p = "Win64";
            // else if (s.indexOf("android") > -1) p = "Linux armv7l";
            // else if (s.indexOf("linux") > -1) p = "Linux i686";
            // else if (s.indexOf("iphone") > -1) p = "iPhone";
            // else if (s.indexOf("ipad") > -1) p = "iPad";
            // else if (s.indexOf("mac os x") > -1) p = "MacIntel";
            return p;
        },
        onLocationChange: function(aProgress, aRequest, aURI, aFlags) {
            FeiRuoNet.ShowFlag.LocationChange(null, aURI);
        },
        onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {
            if (!aRequest || !aRequest.URI || !FeiRuoNet.IconShow.test(aRequest.URI.scheme) || /^about:(newtab)$/i.test(aRequest.URI.spec) || !aRequest.URI.asciiHost || !FeiRuoNet.icon.hidden) return;
            FeiRuoNet.icon.hidden = false;
            FeiRuoNet.icon.src = FeiRuoNet.Loading_Flag;
            FeiRuoNet.icon.image = FeiRuoNet.Loading_Flag;
        },
        onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
        onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) {},
        onSecurityChange: function(aWebProgress, aRequest, aState) {},
        ProxyFilter: {
            applyFilter: function(ProxySrv, uri, aProxy) {
                if (FeiRuoNet.ProxyMode != 0 && FeiRuoNet.ProxyScheme.test(uri.scheme)) {
                    var obj = FeiRuoNet.Caches.Query[uri.asciiHostPort || uri.HostPort || uri.hostPort || uri.host] || {};
                    if (!FeiRuoNet.ProxyLocal && /^((192\.168|172\.([1][6-9]|[2]\d|3[01]))(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){2}|10(\.([2][0-4]\d|[2][5][0-5]|[01]?\d?\d)){3})$/i.test(obj.IP))
                        return ProxySrv;
                    if (FeiRuoNet.ProxyMode == 2)
                        return FeiRuoNet.ProxyServers[FeiRuoNet.DefaultProxy].ProxyServer;
                    var splttag = uri.spec.indexOf("?"),
                        match;
                    if (splttag > 20)
                        match = FeiRuoNet.AutoProxy.DefaultMatcher.matchesAny(uri.spec.substring(0, splttag), uri.host);
                    else {
                        splttag = uri.spec.indexOf("=");
                        if (splttag > 20) match = FeiRuoNet.AutoProxy.DefaultMatcher.matchesAny(uri.spec.substring(0, splttag), uri.host);
                        else match = FeiRuoNet.AutoProxy.DefaultMatcher.matchesAny(uri.spec, uri.host);
                    }
                    if (match && !FeiRuoNet.CanNotProxy(match))
                        return FeiRuoNet.ProxyServers[FeiRuoNet.DefaultProxy].ProxyServer;
                } else
                    return ProxySrv;
            },
            getFailoverForProxy: function(aProxyInfo, aURI, aReason) {
                if (FeiRuoNet.ProxyMode != 0) {
                    var ProxyServer;
                    if (FeiRuoNet.DefaultProxy != FeiRuoNet.ProxyServers.length)
                        ProxyServer = FeiRuoNet.ProxyServers[FeiRuoNet.DefaultProxy + 1].ProxyServer;
                    else
                        ProxyServer = FeiRuoNet.ProxyServers[0].ProxyServer || aProxyInfo || ProxySrv.newProxyInfo('direct', '', -1, 0, 0, null) || null;
                    return ProxyServer;
                } else
                    return aProxyInfo;
            },
        }
    };
    FeiRuoNet.ShowFlag = {
        STATE: {},
        Progress: {},
        Unknown: 'Unknown',
        LocalFlags: Services.io.newFileURI(FileUtils.getDir("UChrm", ["lib", 'LocalFlags'])).spec,
        SetApi: function(API) {
            if (API && !API.isJustFlag) {
                this.InfoApi = API.Api;
                this.InfoFunc = API.Func;
            }
            return true;
        },
        LocationChange: function(checkCache, aLocation) {
            FeiRuoNet.icon.classList.remove('Proxy');
            FeiRuoNet.icon.classList.remove('Error');
            FeiRuoNet.forceRefresh = checkCache;
            aLocation = aLocation || FeiRuoNet.CurrentURI || window.getBrowser().selectedBrowser.currentURI;
            if (aLocation.spec.startsWith("about:reader?url=")) aLocation = makeURI(aLocation.spec.slice(17))
            if (aLocation.scheme == "view-source") aLocation = makeURI(aLocation.spec.slice(12))
            if (aLocation.scheme == "jar") aLocation = makeURI(aLocation.spec.slice(4).truncateBeforeFirstChar("!"));
            var scheme = aLocation.scheme || (aLocation.protocol && aLocation.protocol.substring(0, aLocation.protocol.length - 1)),
                hostname = aLocation.asciiHost || aLocation.hostname;
            scheme = /^(about:blank)$/i.test(aLocation.spec) ? 'blank' : scheme;
            if (FeiRuoNet.ConvStr(scheme)) return this.LoadIcon(scheme);
            if (!hostname) return this.ChangeIcon(FeiRuoNet.Unknown_Flag);
            if (!window.navigator.onLine) return this.LoadIcon('offline');
            var host = aLocation.asciiHostPort || aLocation.HostPort || aLocation.hostPort || aLocation.host;
            FeiRuoNet.Caches.Query[host] || (FeiRuoNet.Caches.Query[host] = {});
            FeiRuoNet.Caches.Query[host].Host = hostname;
            FeiRuoNet.Caches.Query[host].Port = aLocation.port;
            FeiRuoNet.Caches.Query[host].Scheme = scheme;
            (!FeiRuoNet.Caches.Query[host].ProxyTimes) && (FeiRuoNet.Caches.Query[host].ProxyTimes = 0);
            if ((!FeiRuoNet.forceRefresh && FeiRuoNet.Caches.DNS[hostname]) || /^(https?:\/\/)?(localhost|::1)/i.test(hostname) || FeiRuoNet.CheckIP(hostname)) return this.LookUp(host, (FeiRuoNet.Caches.DNS[hostname] || hostname));
            this.TakeDns(host, hostname, aLocation);
        },
        TakeDns: function(host, hostname, aLocation) {
            var DnsListener = {
                onLookupComplete: function(request, nsrecord, status) {
                    var s_ip;
                    if (status != 0 || !nsrecord.hasMore()) s_ip = "0";
                    else s_ip = nsrecord.getNextAddrAsString();
                    FeiRuoNet.Caches.DNS[hostname] = s_ip;
                    FeiRuoNet.ShowFlag.LookUp(host, s_ip);
                }
            };
            this.DNSrequest = this.ResolveDNS(aLocation, IP => {
                this.DNSrequest = null;
                if (/^Proxy$/i.test(IP)) {
                    FeiRuoNet.Caches.Query[host].IsProxy = true;
                    try {
                        DnsService.asyncResolve(hostname, 0, DnsListener, EventQueue);
                    } catch (e) {}
                    return;
                } else FeiRuoNet.Caches.Query[host].IsProxy = false;
                if (/^Fail$/i.test(IP)) {
                    FeiRuoNet.Caches.Query[host].IsError = true;
                    try {
                        DnsService.asyncResolve(hostname, 0, DnsListener, EventQueue);
                    } catch (e) {}
                    return;
                } else FeiRuoNet.Caches.Query[host].IsError = false;
                FeiRuoNet.Caches.DNS[hostname] = IP
                this.LookUp(host, IP);
            });
        },
        LookUp: function(host, ip) {
            ip = FeiRuoNet.CheckIP(ip) || ip;
            FeiRuoNet.Caches.Query[host].IP = ip || "127.0.0.1";
            this.SameIPHandle(host);
            this.SameHostHandle(host);
            FeiRuoNet.Caches.IPInfo[FeiRuoNet.Caches.Query[host].IP] || (FeiRuoNet.Caches.IPInfo[FeiRuoNet.Caches.Query[host].IP] = {});
            FeiRuoNet.Caches.HostInfo[FeiRuoNet.Caches.Query[host].Host] || (FeiRuoNet.Caches.HostInfo[FeiRuoNet.Caches.Query[host].Host] = {});
            var ConvStr = FeiRuoNet.ConvStr(ip);
            if (!ip || ConvStr) {
                FeiRuoNet.Caches.Query[host].IPAddrInfo = ConvStr.str;
                return this.ChangeIcon(ConvStr.src || FeiRuoNet.LocahHost_Flag);
            }
            FeiRuoNet.Caches.Query[host].IsProxy && FeiRuoNet.icon.classList.add('Proxy');
            FeiRuoNet.Caches.Query[host].IsError && FeiRuoNet.icon.classList.add('Error');
            this.LookUp_Flag(!FeiRuoNet.forceRefresh, host);
            this.LookUp_Tooltip(!FeiRuoNet.forceRefresh, host);
            this.LookUp_Custom(!FeiRuoNet.forceRefresh, host);
            FeiRuoNet.forceRefresh = false;
        },
        SameHostHandle: function(host) {
            var Host = FeiRuoNet.Caches.Query[host].Host;
            if (!FeiRuoNet.Caches.HostInfo[Host]) return false;
            else {
                FeiRuoNet.Caches.Query[host].CustomInfo = FeiRuoNet.Caches.HostInfo[Host].CustomInfo;
                return true;
            }
        },
        SameIPHandle: function(host) {
            var IP = FeiRuoNet.Caches.Query[host].IP;
            if (!FeiRuoNet.Caches.IPInfo[IP]) return false;
            else {
                FeiRuoNet.Caches.Query[host].FlagHash = FeiRuoNet.Caches.IPInfo[IP].FlagHash;
                FeiRuoNet.Caches.Query[host].IPAddrInfo = FeiRuoNet.Caches.IPInfo[IP].IPAddrInfo;
                FeiRuoNet.Caches.Query[host].IPAddrInfoHash = FeiRuoNet.Caches.IPInfo[IP].IPAddrInfoHash;
                return true;
            }
        },
        /*****************************************************************************************/
        LookUp_Flag: function(checkCache, host) {
            if (checkCache && FeiRuoNet.Caches.Query[host].FlagHash) return this.LoadIcon(FeiRuoNet.Caches.Query[host].FlagHash);
            if (FeiRuoNet.DataBase.QQwryDate.IsReady || FeiRuoNet.DataBase.FlagFoxDB.IsReady) return;
            if (this.FlagApi == this.InfoApi) return;
            if (!this.FlagApi) return this.LookupIP_taobao(host, "Flag");
            FeiRuoNet.XRequest({
                url: this.FlagApi + FeiRuoNet.Caches.Query[host].IP,
            }).then(request => {
                if (request.status === 200) var info = this.FlagFunc(request.response);
                if (info) this.UpdateIcon(host, info.CountryCode || info.CountryName);
                else this.LookupIP_taobao(host, "Flag");
            }, error => {
                this.LookupIP_taobao(host, "Flag");
            });
        },
        LookUp_Tooltip: function(checkCache, host) {
            if (checkCache && FeiRuoNet.Caches.Query[host].IPAddrInfoHash) return;
            if (FeiRuoNet.DataBase.QQwryDate.IsReady) {
                var Code, IPAddrInfo = FeiRuoNet.DataBase.QQwryDate.SearchIP(FeiRuoNet.Caches.Query[host].IP);
                if (FeiRuoNet.ConvStr(IPAddrInfo.Country)) {
                    Code = IPAddrInfo.Country;
                } else {
                    var Code, CountryName = FeiRuoNet.DataBase.CountryName;
                    for (var i in CountryName) {
                        if (!new RegExp(i, "i").test(IPAddrInfo.Country)) continue;
                        Code = CountryName[i].toUpperCase();
                        break;
                    }
                    Code = Code || "CN";
                }
                FeiRuoNet.Caches.Query[host].IPAddrInfo = IPAddrInfo.Country + '\n' + IPAddrInfo.Area;
                return this.UpdateIcon(host, Code);
            }
            if (FeiRuoNet.DataBase.FlagFoxDB.IsReady) {
                var IP = FeiRuoNet.Caches.Query[host].IP;
                var Code = FeiRuoNet.DataBase.FlagFoxDB.LookupIP(IP);
                if (!IP.match(/:/g)) {
                    var str, CountryName = FeiRuoNet.DataBase.CountryName;
                    if (Code && CountryName) {
                        for (var i in CountryName) {
                            if (!new RegExp(CountryName[i], "i").test(Code)) continue;
                            str = String(i);
                        }
                    }
                    if (str) FeiRuoNet.Caches.Query[host].IPAddrInfo = str;
                }
                return this.UpdateIcon(host, Code);
            }
            if (!this.InfoApi) return this.LookupIP_taobao(host, "All");
            FeiRuoNet.XRequest({
                url: this.InfoApi + FeiRuoNet.Caches.Query[host].IP,
            }).then(request => {
                if (request.status === 200) var info = this.InfoFunc(request.response);
                if (info) {
                    if (this.FlagApi == this.InfoApi) this.UpdateIcon(host, info.CountryCode || info.CountryName);
                    FeiRuoNet.Caches.Query[host].IPAddrInfo = info.IPAddrInfo || null;
                    FeiRuoNet.Caches.Query[host].IPAddrInfoThx = this.InfoApi;
                    this.UpdateTooltipText(host);
                } else this.LookupIP_taobao(host, "Tip")
            }, error => {
                var type = (this.FlagApi == this.InfoApi) ? 'All' : 'Tip';
                this.LookupIP_taobao(host, type);
            });
            FeiRuoNet.Caches.Query[host].ErrorStr = "";
        },
        LookUp_Custom: function(checkCache, host) {
            if (!FeiRuoNet.CustomInfos || FeiRuoNet.CustomInfos.length == 0) return;
            if (!FeiRuoNet.Caches.Query[host].CustomInfo) FeiRuoNet.Caches.Query[host].CustomInfo = {};
            switch (FeiRuoNet.CustomQueue) {
                case 0:
                    this.LookUp_Custom_Queue_Add(checkCache, host);
                    break;
                case 1:
                    this.LookUp_Custom_Queue_Delay(checkCache, host);
                    break;
            }
        },
        LookUp_Custom_Queue_Add: function(checkCache, host) {
            var i = 0;
            var Customs = FeiRuoNet.CustomInfos;
            while (i < Customs.length) {
                var Custom = Customs[i];
                if (!Custom.Enable) {
                    i = i + 1;
                    continue;
                }
                var Query = FeiRuoNet.Caches.Query[host],
                    CusInfo = Query.CustomInfo[Custom.Api],
                    nPort = Query.Port;
                if (checkCache && ((Custom.Times == 1 && FeiRuoNet.Caches.Onece[Custom.Api]) || (!Custom.DifPort && CusInfo) || (Custom.DifPort && (nPort in CusInfo.Port)))) {
                    i = i + 1;
                    continue;
                }
                Custom.url = Custom.Api.replace(/%IP%/i, Query.IP).replace(/%Host%|%BASEDOMAIN%/i, host);
                FeiRuoNet.ShowFlag.LookUp_Custom_Func(Custom, host, nPort);
                i = i + 1;
            }
        },
        LookUp_Custom_Queue_Delay: function(checkCache, host) {
            var Customs = FeiRuoNet.CustomInfos;
            for (var i in Customs) {
                var Custom = Customs[i];
                if (!Custom.Enable) continue;
                var CusInfo = FeiRuoNet.Caches.Query[host].CustomInfo[Custom.Api],
                    nPort = FeiRuoNet.CurrentURI.port;
                if (checkCache && ((Custom.Times == 1 && FeiRuoNet.Caches.Onece[Custom.Api]) || (!Custom.DifPort && CusInfo) || (Custom.DifPort && (nPort in CusInfo.Port)))) continue;
                Custom.url = Custom.Api.replace(/%IP%/i, FeiRuoNet.Caches.Query[host].IP).replace(/%Host%|%BASEDOMAIN%/i, host);
                (function(i, Custom, host, nPort) {
                    FeiRuoNet.ShowFlag["LookupIP_CustomInfo_" + i] = function() {
                        FeiRuoNet.ShowFlag.LookUp_Custom_Func(Custom, host, nPort);
                    };
                })(i, Custom, host, nPort);
                FeiRuoNet.ShowFlag["LookupIP_CustomInfo_" + i]();
            }
        },
        LookUp_Custom_Func: function(Custom, host, nPort) {
            FeiRuoNet.XRequest(Custom).then(request => {
                if (request.status === 200) {
                    var funstr = Custom.Func.toString().replace(/^function.*{|}$/g, "");
                    var CustomInfo = (new Function("docum", funstr))(request.response);
                    if (Custom.Times == 1) FeiRuoNet.Caches.Onece[Custom.Api] = CustomInfo;
                    else if (Custom.DifPort) {
                        FeiRuoNet.Caches.Query[host].CustomInfo[Custom.Api].Port || (FeiRuoNet.Caches.Query[host].CustomInfo[Custom.Api].Port = {});
                        FeiRuoNet.Caches.Query[host].CustomInfo[Custom.Api].Port[nPort] = CustomInfo;
                    } else FeiRuoNet.Caches.Query[host].CustomInfo[Custom.Api] = CustomInfo;
                    this.UpdateTooltipText(host);
                }
            }, error => {
                log(error)
            });
        },
        LookupIP_taobao: function(host, type) {
            FeiRuoNet.XRequest({
                url: 'http://ip.taobao.com/service/getIpInfo.php?ip=' + FeiRuoNet.Caches.Query[host].IP,
            }).then(request => {
                var obj;
                if (request.status === 200) obj = JSON.parse(request.response);
                if (obj && obj.code == 0) {
                    var country_id = obj.data.country_id.toLocaleLowerCase();
                    var addr = obj.data.country + obj.data.area;
                    if (obj.data.region || obj.data.city || obj.data.county || obj.data.isp) addr = addr + '\n' + obj.data.region + obj.data.city + obj.data.county + obj.data.isp;
                    if (type == "Flag" || type == "All") this.UpdateIcon(host, country_id || obj.data.country);
                    if (type == "Tip" || type == "All" || !this.InfoApi) {
                        FeiRuoNet.Caches.Query[host].IPAddrInfo = addr;
                        FeiRuoNet.Caches.Query[host].IPAddrInfoThx = 'http://ip.taobao.com/service/getIpInfo.php?ip=';
                        this.UpdateTooltipText(host);
                    }
                } else {
                    if (type == "Flag" || type == "All") this.UpdateIcon(host, this.Unknown);
                }
            }, error => {
                if (type == "Flag" || type == "All") this.UpdateIcon(host, this.Unknown);
                // FeiRuoNet.Caches.Query[host].Unknown = '无法获取国家代码，请刷新！';
            });
        },
        /*****************************************************************************************/
        UpdateTooltipText: function(host) {
            if (!host) return;
            var tooltipArr = [];
            FeiRuoNet.Caches.Query[host] || (FeiRuoNet.Caches.Query[host] = {});
            var obj = FeiRuoNet.Caches.Query[host];
            FeiRuoNet.Caches.HostInfo[obj.Host].CustomInfo = obj.CustomInfo || {};
            if (!obj.IPAddrInfo || obj.IPAddrInfo == "") FeiRuoNet.Caches.IPInfo[obj.IP].IPAddrInfo = '无法获取国家代码，请刷新！';
            else {
                FeiRuoNet.Caches.IPInfo[obj.IP].IPAddrInfo = obj.IPAddrInfo;
                FeiRuoNet.Caches.IPInfo[obj.IP].IPAddrInfoHash = true;
                FeiRuoNet.Caches.Query[host].IPAddrInfoHash = true;
            }
        },
        UpdateIcon: function(host, Code) {
            if (!host) return;
            Code = FeiRuoNet.Caches.Query[host].FlagHash || Code;
            FeiRuoNet.Caches.Query[host].FlagHash = Code;
            FeiRuoNet.Caches.IPInfo[FeiRuoNet.Caches.Query[host].IP].FlagHash = Code;
            this.LoadIcon(Code);
        },
        LoadIcon: function(code) {
            var conv = FeiRuoNet.ConvStr(code);
            code = conv ? conv.src : this.SetIcon(code);
            this.ChangeIcon(code);
        },
        ChangeIcon: function(src) {
            if (!src) {
                FeiRuoNet.icon.src = "";
                FeiRuoNet.icon.image = "";
                return;
            }
            FeiRuoNet.icon.hidden = false;
            FeiRuoNet.icon.src = src;
            FeiRuoNet.icon.image = src;
            if (FeiRuoNet.Icon_Pos === 0) {
                var IconHide, scheme = FeiRuoNet.CurrentURI.scheme;
                (/^about:(newtab)$/i.test(FeiRuoNet.CurrentURI.spec)) && (IconHide = true);
                !IconHide && (IconHide = FeiRuoNet.IconShow.test(scheme) ? false : true);
                FeiRuoNet.icon.hidden = IconHide;
                if (IconHide) return;
                $('page-proxy-favicon') && ($('page-proxy-favicon').style.visibility = IconHide ? "visible" : "collapse");
                if (scheme == 'https' && $('page-proxy-favicon')) {
                    $('page-proxy-favicon').style.visibility = 'visible';
                }
            }
            return;
        },
        ResolveDNS: function(uri, returnIP) {
            var requestWrapper = {
                currentRequest: null,
                set: function(request) {
                    this.currentRequest = request;
                },
                cancel: function(reason = Components.results.NS_ERROR_ABORT) {
                    try {
                        this.currentRequest.cancel(reason);
                    } catch (e) {}
                }
            };
            var callback1 = {
                onProxyAvailable: function(_request, _uri, proxyinfo, status) {
                    if (status == Components.results.NS_ERROR_ABORT) return;
                    if ((proxyinfo != null) && (proxyinfo.flags & proxyinfo.TRANSPARENT_PROXY_RESOLVES_HOST)) {
                        returnIP("PROXY");
                        return;
                    }
                    requestWrapper.set(DnsService.asyncResolve(uri.host, 0, callback2, Services.tm.currentThread));
                }
            };
            var callback2 = {
                onLookupComplete: function(_request, dnsrecord, status) {
                    if (status == Components.results.NS_ERROR_ABORT) return;
                    if (status != 0 || !dnsrecord || !dnsrecord.hasMore()) {
                        returnIP("FAIL");
                        return;
                    }
                    returnIP(dnsrecord.getNextAddrAsString());
                }
            };
            requestWrapper.set(ProxySrv.asyncResolve(uri, 0, callback1));
            return requestWrapper;
        },
        SetIcon: function(code) {
            if (/^(ht|f)tps?\:.*(\.png|gif|jpg|bmp)$/i.test(code) || /^data:image\/(gif|png|jpg|bmp);base64,.*/i.test(code)) return code;
            if (!/^[a-z]*|[A-Z]*$/.test(code)) {
                if (code && FeiRuoNet.DataBase.CountryName) code = (code in FeiRuoNet.DataBase.CountryName) ? FeiRuoNet.DataBase.CountryName[code] : this.Unknown;
            }
            var src = this.GetIconPath(code) || (FeiRuoNet.DataBase.CountryFlag && (code.toLowerCase() in FeiRuoNet.DataBase.CountryFlag) ? FeiRuoNet.DataBase.CountryFlag[code.toLowerCase()] : null);
            if (!src || code == this.Unknown) {
                src = FeiRuoNet.BAK_FLAG_PATH + code + "." + FeiRuoNet.BAK_FLAG_PATH_Format;
                var img = new Image();
                img.src = src;
                if (img.height == 100 && img.height == img.height) {
                    src = null;
                    code = this.Unknown;
                }
            }
            if (!src || code == this.Unknown) src = FeiRuoNet.Unknown_Flag;
            return src;
        },
        GetIconPath: function(str) {
            if (!str) return;
            var FlagPath = this.LocalFlags + str.toUpperCase() + '.png';
            var Flag = makeURI(FlagPath).QueryInterface(Ci.nsIFileURL).file;
            if (Flag.exists()) return FlagPath;
            else return false;
        }
    };
    FeiRuoNet.OptionScript = {
        init: function() {
            _$("QQwrt_Download").hidden = true;
            this.ProxyRows = _$("ProxyRows");
            this.BuildProxyTree();
            this.BuildInfoApiPopup();
            _$("DefaultProxy1").selectedIndex = FeiRuoNet.DefaultProxy;
            _$("ApiIdx1").selectedIndex = FeiRuoNet.ApiIdx;
            this.AddCSS();
            if (FeiRuoNet.DataBase.QQwryDate.IsReady) {
                var QQwrtVer = FeiRuoNet.DataBase.QQwryDate.SearchIP('255.255.255.255').Area;
                _$("QQwrtVer").value = "纯真数据库版本：" + QQwrtVer.replace(/纯真网络|\n|IP|数据/ig, "");
            } else {
                _$("QQwrtVer").value = "无【QQWry.dat】本地纯真数据库！";
                _$("QQwrt_Download").hidden = false;
            }
            this.ChangeStatus();
        },
        sizeToContent: function() {
            FeiRuoNet.GetWindow('Preferences') && FeiRuoNet.GetWindow('Preferences').sizeToContent();
        },
        BuildProxyTree: function() {
            let row = this.ProxyRows.firstChild.nextSibling;
            while (row) {
                let temp = row;
                row = row.nextSibling;
                this.ProxyRows.removeChild(temp);
                this.sizeToContent();
            }
            FeiRuoNet.LoadSetting("ProxyServers");
            for (var i = 0; i < FeiRuoNet.ProxyServers.length; i++) this.CreateBlankRow(FeiRuoNet.ProxyServers[i], i);
            for (i in FeiRuoNet.ProxyServers) _$("DefaultProxy1").appendItem(FeiRuoNet.ProxyServers[i].name, i);
        },
        BuildInfoApiPopup: function() {
            for (var i in FeiRuoNet.Interfaces)
                if (!FeiRuoNet.Interfaces[i].isJustFlag) _$("ApiIdx1").appendItem(FeiRuoNet.Interfaces[i].label, i);
        },
        Resets: function() {
            this.BuildProxyTree();
            this.BuildInfoApiPopup();
            _$("warning").hidden = _$("note").hidden = _$("tip").hidden = true;
            _$("BAK_FLAG_PATH").value = FeiRuoNet.DBAK_FLAG_PATH;
            _$("BAK_FLAG_PATH_Format").value = FeiRuoNet.BAK_FLAG_PATH_Format;
            _$("CustomQueue").value = 0;
            _$("IconShow").value = '^((ht|f)tps?|file|data|about|chrome)';
            _$("DefaultProxy1").selectedIndex = 0;
            _$("Icon_Pos").value = 0;
            _$("ApiIdx1").selectedIndex = 0;
            _$("Inquiry_Delay").value = 1000;
            _$("ProxyMode").value = 0;
            _$("ProxyLocal").value = false;
            _$("ProxyTimes").value = 5;
            _$("ProxyTimer").value = 3500;
            _$("EnableRefChanger").value = false;
            _$("ModifyHeader").value = false;
            _$("UrlbarSafetyLevel").value = false;
            _$("EnableUAChanger").value = false;
            _$("EnableProxyByError").value = false;
            this.ChangeStatus();
        },
        Save: function() {
            FeiRuoNet.Prefs.setCharPref("BAK_FLAG_PATH", _$("BAK_FLAG_PATH").value);
            FeiRuoNet.Prefs.setCharPref("BAK_FLAG_PATH_Format", _$("BAK_FLAG_PATH_Format").value);
            FeiRuoNet.Prefs.setIntPref("CustomQueue", _$("CustomQueue").value);
            FeiRuoNet.Prefs.setIntPref("DefaultProxy", _$("DefaultProxy1").value);
            FeiRuoNet.Prefs.setIntPref("Icon_Pos", _$("Icon_Pos").value);
            FeiRuoNet.Prefs.setIntPref("ApiIdx", _$("ApiIdx1").value);
            FeiRuoNet.Prefs.setIntPref("Inquiry_Delay", _$("Inquiry_Delay").value);
            FeiRuoNet.Prefs.setIntPref("ProxyMode", _$("ProxyMode").value);
            FeiRuoNet.Prefs.setIntPref("ProxyTimer", _$("ProxyTimer").value);
            FeiRuoNet.Prefs.setIntPref("ProxyTimes", _$("ProxyTimes").value);
            FeiRuoNet.Prefs.setBoolPref("ModifyHeader", _$("ModifyHeader").value);
            FeiRuoNet.Prefs.setBoolPref("UrlbarSafetyLevel", _$("UrlbarSafetyLevel").value);
            FeiRuoNet.Prefs.setBoolPref("EnableRefChanger", _$("EnableRefChanger").value);
            FeiRuoNet.Prefs.setBoolPref("EnableUAChanger", _$("EnableUAChanger").value);
            FeiRuoNet.Prefs.setBoolPref("EnableProxyByError", _$("EnableProxyByError").value);
            FeiRuoNet.Prefs.setBoolPref("ProxyLocal", _$("ProxyLocal").value);
            FeiRuoNet.Prefs.setCharPref("IconShow", _$("IconShow").value);
            this.TreeSave();
        },
        TreeSave: function() {
            var ProxySrvers = new Array();
            for (let row = this.ProxyRows.firstChild.nextSibling; row; row = row.nextSibling) {
                var temp = {
                    name: "",
                    host: "127.0.0.1",
                    port: "",
                    type: "http",
                    remoteDNS: 0
                };
                var pDs = row.firstChild;
                for (var i = 0; i <= 2; i++) {
                    if (i == 0) {
                        if (pDs.value == "") {
                            pDs.value = "Unnamed";
                        }
                        temp.name = pDs.value;
                    }
                    if (i == 1) {
                        if (pDs.value == "") {
                            pDs.value = "127.0.0.1";
                        }
                        temp.host = pDs.value;
                    }
                    if (i == 2) {
                        temp.port = pDs.value;
                    }
                    pDs = pDs.nextSibling;
                }
                pDst = pDs.firstChild;
                if (pDst.selected) {
                    temp.type = "http";
                } else if (pDst.nextSibling.selected) {
                    temp.type = "https";
                } else if (pDst.nextSibling.nextSibling.selected) {
                    temp.type = "socks4";
                } else {
                    temp.type = "socks";
                }
                pDs = pDs.nextSibling;
                if (pDs.checked) {
                    temp.remoteDNS = 1;
                }
                var ProxySrver = [];
                ProxySrver.push(temp.name);
                ProxySrver.push(temp.host);
                ProxySrver.push(temp.port);
                ProxySrver.push(temp.type);
                ProxySrver.push(temp.remoteDNS);
                ProxySrvers.push(ProxySrver.join('|'));
            }
            FeiRuoNet.Prefs.setCharPref('ProxyServers', escape(ProxySrvers.join(';')));
        },
        AddNewRow: function() {
            this.CreateBlankRow();
            _$("warning").hidden = _$("note").hidden = _$("tip").hidden = true;
            this.sizeToContent();
        },
        DelSelectedRow: function() {
            this.Show("warning");
            let row = this.ProxyRows.firstChild.nextSibling;
            while (row) {
                var temp = row;
                row = row.nextSibling;
                if (temp.lastChild.checked) {
                    this.ProxyRows.removeChild(temp);
                    this.sizeToContent();
                } else this.Hide("warning");
            }
            if (!_$("warning").hidden) this.Hide("note");
            if (_$("warning").hidden && _$("note").hidden) this.Hide("tip");
            else this.Show("tip");
        },
        CreateBlankRow: function(proxy, i) {
            var proxyRow = _$C("row");
            var proxyName = _$C("textbox");
            var proxyHost = _$C("textbox");
            var proxyPort = _$C("textbox");
            var proxyType = _$C("radiogroup");
            var proxyRemote = _$C("checkbox");
            var proxyDele = _$C("checkbox");
            proxyName.setAttribute("class", "proxyName");
            proxyHost.setAttribute("class", "proxyHost");
            proxyPort.setAttribute("class", "proxyPort");
            proxyRemote.setAttribute("class", "remoteBox");
            proxyDele.setAttribute("class", "deleBox");
            proxyType.setAttribute("orient", "horizontal");
            var http = _$C("radio"),
                https = _$C("radio"),
                socks = _$C("radio"),
                socks4 = _$C("radio");
            http.setAttribute("class", "proxyHttp");
            https.setAttribute("class", "proxyHttps");
            socks.setAttribute("class", "proxySocks5");
            socks4.setAttribute("class", "proxySocks4");
            http.setAttribute("selected", proxy && proxy.type == "http");
            https.setAttribute("selected", proxy && proxy.type == "https");
            socks.setAttribute("selected", proxy && proxy.type == "socks");
            socks4.setAttribute("selected", proxy && proxy.type == "socks4");
            if (proxy) {
                proxyName.setAttribute("value", proxy.name);
                proxyHost.setAttribute("value", proxy.host);
                proxyPort.setAttribute("value", proxy.port);
                proxyRemote.setAttribute("checked", proxy && proxy.remoteDNS == 1);
            }
            proxyType.appendChild(http);
            proxyType.appendChild(https);
            proxyType.appendChild(socks4);
            proxyType.appendChild(socks);
            proxyRow.appendChild(proxyName);
            proxyRow.appendChild(proxyHost);
            proxyRow.appendChild(proxyPort);
            proxyRow.appendChild(proxyType);
            proxyRow.appendChild(proxyRemote);
            proxyRow.appendChild(proxyDele);
            proxyRow.id = "ProxyRow_" + i;
            this.ProxyRows.appendChild(proxyRow);
        },
        Show: function(id) {
            if (_$(id).hidden) {
                _$(id).hidden = false;
                this.sizeToContent();
            }
        },
        Hide: function(id) {
            if (!_$(id).hidden) {
                _$(id).hidden = true;
                this.sizeToContent();
            }
        },
        ChouseFile: function() {
            var nsIFilePicker = Components.interfaces.nsIFilePicker;
            var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
            fp.init(window, "选择代理软件", nsIFilePicker.modeOpen);
            fp.appendFilters(nsIFilePicker.filterApps);
            var rv = fp.show();
            if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
                var path = fp.file.path;
                _$('ProxyPath').value = decodeURIComponent(path);
            }
            this.sizeToContent();
        },
        AddCSS: function() {
            var css = ('\
            textbox.proxyName { width: 100px; }\
            .proxyHost { width: 100px; }\
            .proxyPort { width: 50px; }\
            #note,\
            #warning { color: red; }\
            #tip { color: green; }\
            #tip,\
            #note,\
            #warning { font-weight: bold; margin-top: 20px; }\
            radiogroup > .proxyHttp { margin-left: 10px !important; }\
            radiogroup > .proxyHttps { margin-left: 0px !important; }\
            radiogroup > .proxySocks4 { margin-left: 10px !important; }\
            radiogroup > .proxySocks5 { margin-left: 15px !important; }\
            .remoteBox { margin-left: 15px !important; }\
            '.replace(/\n|\t/g, ''));
            var pi = FeiRuoNet.GetWindow('Preferences').document.createProcessingInstruction('xml-stylesheet', 'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"');
            FeiRuoNet.GetWindow('Preferences').document.insertBefore(pi, FeiRuoNet.GetWindow('Preferences').document.documentElement);
        },
        openNewTab: function(url) {
            openNewTabWith(url);
        },
        ChangeStatus: function(event) {
            var aDisable = !FeiRuoNet.ConfFile;
            _$("EnableRefChanger").disabled = aDisable;
            _$("EnableUAChanger").disabled = aDisable;
            _$("ApiIdx").disabled = aDisable;
            this.sizeToContent();
        }
    };
    /*****************************************************************************************/
    function Caches(Infos) {
        this.tabs = window.getBrowser().tabContainer;
        this.Infos = Infos || [];
        this.Clear();
    }
    Caches.prototype = {
        Clear: function() {
            // .forEach(c => {
            this.Infos.forEach(c => {
                this[c] = {
                    __proto__: null
                };
            });
        },
        Oder: function() {
            this.Infos.forEach(c => {
                this.Prune(c);
            });
        },
        Prune: function(type) {
            var evictionCount = this[type].size - (this.tabs.itemCount + 1);
            var lastKey;
            for (let key of this[type].keys()) {
                if (evictionCount > 0) {
                    this[type].delete(key);
                    --evictionCount;
                    continue;
                }
                // if (lastKey)
                //  this[type].get(lastKey).uri = undefined;
                lastKey = key;
            }
        }
    };

    function FlagFoxDB(IPDBmetadata) {
        this.Clear();
        this.IPDBmetadata = IPDBmetadata;
        this.AutoLoadIPDB(this.IPv4DB);
        if (!this.IPDBmetadata || !this.IPDBmetadata.created || !this.IPDBmetadata.size || !this.IPv4DB.entryCount || this.IPv4DB.loadState != 3) return "";
        const hoplength = Math.floor(this.IPv4DB.entryCount / 5);
        var hash = 0x9e3779b9 ^ this.IPv4DB.entryCount << 24 ^ this.IPDBmetadata.created << 16 ^ this.IPDBmetadata.size.IPv4 << 8 ^ this.IPDBmetadata.size.IPv6;
        for (let i = 1; i <= 4; i++) {
            hash ^= this.IPv4DB.rangeIPs[i * hoplength];
            hash ^= this.IPv4DB.rangeCodes[i * hoplength] << i * 6;
        }
        // return Math.abs(hash).toString(36);
    }
    FlagFoxDB.prototype = {
        IsReady: false,
        IPDBmetadata: null,
        PathToIPDBFiles: null,
        IPv4DB: {
            type: "IPv4",
            filename: "ip4.cdb",
            bytesPerInt: 4
        },
        IPv6DB: {
            type: "IPv6",
            filename: "ip6.cdb",
            bytesPerInt: 6
        },
        IPv4inIPv6rules: [{
            prefix: "00000000000000000000",
            extractIPv4Integer: function(ipString) {
                var block6 = ipString.substr(20, 4);
                if (block6 == "ffff" || block6 == "0000") return this.HexStringToInteger(ipString.substr(24, 8));
                return null;
            }
        }, {
            prefix: "2002",
            extractIPv4Integer: function(ipString) {
                return this.HexStringToInteger(ipString.substr(4, 8));
            }
        }, {
            prefix: "20010000",
            extractIPv4Integer: function(ipString) {
                return ~this.HexStringToInteger(ipString.substr(24, 8));
            }
        }],
        get version() {
            if (!this.IPDBmetadata || !this.IPDBmetadata.created) return "ERROR";
            var date = new Date(this.IPDBmetadata.created);
            return date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1);
        },
        get daysOld() {
            if (!this.IPDBmetadata || !this.IPDBmetadata.created) return Infinity;
            return (Date.now() - this.IPDBmetadata.created) / 86400000;
        },
        Clear: function() {
            this.IsReady = false;
            this.PathToIPDBFiles = null;
            this.IPDBmetadata = {
                __proto__: null
            };
            this.CloseIPDBfile(this.IPv4DB);
            this.CloseIPDBfile(this.IPv6DB);
        },
        CloseIPDBfile: function(db) {
            db.path = undefined;
            db.entryCount = undefined;
            db.rangeIPs = undefined;
            db.rangeCodes = undefined;
            db.loadState = undefined;
        },
        LookupIP: function(ipString) {
            try {
                if (!ipString) return null;
                // IPv6 uses colons and IPv4 uses dots
                if (ipString.indexOf(":") == -1) return this.SearchDB(this.IPv4DB, this.IPv4StringToInteger(ipString)); // Look up normal IPv4 address
                if (ipString == "::1") // IPv6 Localhost (prefix is zero, so can't use IPv6 prefix DB)
                    return "-L";
                if (ipString.indexOf(".") != -1) // IPv4 address embedded in an IPv6 address using mixed notation ("::ffff:" or "::" followed by standard IPv4 notation)
                    return this.SearchDB(this.IPv4DB, this.IPv4StringToInteger(ipString.substr(ipString.lastIndexOf(":") + 1)));
                var longIPv6String = ExpandIPv6String(ipString); // Full IPv6 notation in use; expand all shorthand to full 32 char hex string
                for (let rule of this.IPv4inIPv6rules) // Look for tunneling and embedded IPv4 to IPv6 address types
                    if (longIPv6String.startsWith(rule.prefix)) return this.SearchDB(this.IPv4DB, rule.extractIPv4Integer(longIPv6String));
                return this.SearchDB(this.IPv6DB, this.HexStringToInteger(longIPv6String.substr(0, 12))); // Look up normal IPv6 address prefix (48 bits = 6 bytes = 12 hex chars)
            } catch (e) {
                return null;
            }
        },
        IPv4StringToInteger: function(ipString) {
            function decStringToInteger(string) {
                return parseInt(string, 10);
            }
            const octets = ipString.split(".").map(decStringToInteger);
            if (octets.length != 4) throw "Attempted to parse invalid IPv4 address string!";
            return ((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0; // '>>> 0' forces read as unsigned integer (JS messes it up, otherwise)
        },
        HexStringToInteger: function(string) {
            return parseInt(string, 16);
        },
        ExpandIPv6String: function(ipString) {
            var blocks = ipString.toLowerCase().split(":");
            for (let i = 0; i < blocks.length; i++) {
                if (blocks[i].length == 0) // Expand collapsed zeroes block
                {
                    blocks[i] = "0000";
                    while (blocks.length < 8) blocks.splice(i, 0, "0000");
                } else
                    while (blocks[i].length < 4) // Add leading zeroes as needed
                        blocks[i] = "0" + blocks[i];
            }
            var expanded = blocks.join(""); // Drop ":" notation
            if (blocks.length != 8 || expanded.length != 32) throw "Attempted to parse invalid IPv6 address string!";
            return expanded;
        },
        SearchDB: function(db, int) {
            if (!Number.isInteger(int) || int < 0) return null;
            this.AutoLoadIPDB(db); // Automatically load IPDB file on first use
            // Do a binary search loop to find given integer in ordered list of ranges
            var min = 0;
            var max = db.entryCount - 1;
            var mid;
            while (min <= max) {
                mid = Math.floor((min + max) / 2);
                if (int < db.rangeIPs[mid]) max = mid - 1;
                else if (int >= db.rangeIPs[mid + 1]) // The next number is the start of the next range; not part of this range
                    min = mid + 1;
                else /* range1start <= int && int < range2start */ return db.rangeCodes[mid] ? this.IPDBmetadata.countryIDs[db.rangeCodes[mid]] : null;
            }
            return null;
        },
        AutoLoadIPDB: function(db) {
            if (db.loadState === undefined) this.LoadIPDBfile(db);
        },
        LoadIPDBfile: function(db, async = false) {
            if (db.rangeIPs != undefined || db.loadState > 0) throw "Tried to load " + db.type + " DB twice!";
            db.loadState = 0;
            if (!this.IPDBmetadata) throw "IPDB metadata file failed to load";
            db.loadState = 1;
            var request = new XMLHttpRequest();
            request.open("GET", "file:///" + FileUtils.getFile("UChrm", ["lib", db.filename]).path);
            request.responseType = "arraybuffer";
            request.onerror = event => {
                this.Clear();
            };
            request.onload = event => {
                if (db.loadState != 1) return;
                try {
                    db.loadState = 2;
                    this.LoadCompressedIPDBdata(db, request.response);
                    db.loadState = 3;
                    this.IsReady = true;
                } catch (e) {
                    throw "FeiRuoNet_Flag ERROR attempting to load " + db.type + " DB data: " + e;
                }
            };
            request.send();
        },
        HandleIPDBLoadError: function(db, msg) {
            this.CloseIPDBfile(db);
            db.loadState = -1;
            Components.utils.reportError(msg);
        },
        LoadCompressedIPDBdata: function(db, data) {
            if (!data) throw "got null data on attempt to load file";
            if (!data.byteLength) throw "file loaded with zero bytes";
            if (data.byteLength != this.IPDBmetadata.size[db.type]) throw "file is corrupt (got " + data.byteLength + " bytes but expected " + this.IPDBmetadata.size[db.type] + " bytes)";
            var pos = 0;

            function newFastDataView(length, intbytes) {
                var size = (intbytes > 1) ? length * intbytes : length;
                var view = new FastDataViewUBE(data, pos, size, intbytes); // New typed array view of 'size' length starting at 'pos' in buffer 'data'
                pos += size; // Position in 'data' is now at 'pos' bytes
                return view;
            }
            // Create a set of typed array interfaces mapped to sections of the file's data buffer (big-endian packed)
            var header = newFastDataView(6);
            var entries = header.getUint32(0); // 4 byte entries count
            var rangewidthsdictlength = header.getUint16(4); // 2 byte range width dictionary length
            var rangewidthsdict = newFastDataView(rangewidthsdictlength, db.bytesPerInt); // range width dictionary: 4 or 6 bytes each, depending on IP version
            var rangewidthIDs = newFastDataView(entries, 2); // range width ID list: 2 bytes each (one for each entry)
            var codeIDs = newFastDataView(entries, 1); // country code ID list: 1 byte each (one for each entry)
            if (pos != data.byteLength) throw "file read error (got " + data.byteLength + " bytes from file but data is " + pos + " bytes)";
            // Now that we have views on the compressed data, create an array to hold the decompressed data (native-endian typed-array for simplicity)
            // Float64Array can't hold a 64-bit integer, but it can hold a 48-bit integer just fine
            var rangeIPs = new(db.bytesPerInt == 4 ? Uint32Array : Float64Array)(entries);
            // The 8-bit codes can be converted to strings as-needed; just copy into a new array (to not keep the whole file loaded)
            var rangeCodes = new Uint8Array(codeIDs.bytes);
            // HACK: Here I invoke black magic that should not exist... Isolating the hot loop in its own function forces the JIT to focus and doubles its speed.
            (function() {
                // Finally, read and decompress the ranges; each integer is the last integer plus the width of the range (starting from zero)
                var lastIP = 0;
                for (let i = 0; i < entries; i++) rangeIPs[i] = (lastIP += rangewidthsdict.get(rangewidthIDs.get(i)));
            })();
            // With the optimizations used here, and avoidance of slow JS built-ins like DataView, decompress time is quick. (around 2ms on recent HW; 5ms on old)
            db.entryCount = entries;
            db.rangeIPs = rangeIPs;
            db.rangeCodes = rangeCodes;
            // Compressed file data and its views are garbage collected after this point
        }
    };

    function QQwryDate(Code, file) {
        this.Clear();
        if (!Code || !file) return;
        var request = new XMLHttpRequest();
        request.open("GET", "file:///" + file.path);
        request.responseType = "arraybuffer";
        request.onerror = event => {
            this.Clear();
        };
        request.onload = event => {
            var result = request.response;
            this.IPFileBuffer = new DataView(result);
            this.Uint8Array = new Uint8Array(result);
            this.IPBegin = this.IPFileBuffer.getUint32(0, true); //索引的开始位置;
            this.IPEnd = this.IPFileBuffer.getUint32(4, true); //索引的结束位置;
            this.GBKCode = Code;
            this.IsReady = true;
        };
        request.send();
        return this;
    }
    QQwryDate.prototype = {
        IsReady: false,
        IPFileBuffer: null,
        Uint8Array: null,
        IPBegin: null,
        IPEnd: null,
        GBKCode: null,
        IP_RECORD_LENGTH: 7,
        REDIRECT_MODE_1: 1,
        REDIRECT_MODE_2: 2,
        IP_REGEXP: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        Clear: function() {
            this.IsReady = false;
            ['IPFileBuffer', 'Uint8Array', 'IPBegin', 'IPEnd', 'GBKCode'].forEach(e => {
                this[e] = {
                    __proto__: null
                };
            });
        },
        IPToInt: function(IP) {
            var result = this.IP_REGEXP.exec(IP),
                ip;
            if (result) {
                var ip_Arr = result.slice(1);
                ip = (parseInt(ip_Arr[0]) << 24 | parseInt(ip_Arr[1]) << 16 | parseInt(ip_Arr[2]) << 8 | parseInt(ip_Arr[3])) >>> 0;
            } else if (/^\d+$/.test(IP) && (ip = parseInt(IP)) >= 0 && ip <= 0xFFFFFFFF) {
                ip = +IP
            } else {
                throw ("The IP address is not normal! >> " + IP);
            }
            return ip;
        },
        IntToIP: function(INT) {
            if (INT < 0 || INT > 0xFFFFFFFF) {
                throw ("The number is not normal! >> " + INT);
            };
            return (INT >>> 24) + "." + (INT >>> 16 & 0xFF) + "." + (INT >>> 8 & 0xFF) + "." + (INT >>> 0 & 0xFF);
        },
        ReadUIntLE: function(g, w) {
            g = g || 0;
            w = w < 1 ? 1 : w > 6 ? 6 : w;
            switch (w) {
                case 1:
                    return this.IPFileBuffer.getUint8(g);
                case 3: //3个位移无符号整数?
                    var a = this.Uint8Array[g];
                    var b = this.Uint8Array[g + 1];
                    var c = this.Uint8Array[g + 2];
                    return ((0 << 24) | (c << 16) | (b << 8) | a) >>> 0;
                case 4:
                    return this.IPFileBuffer.getUint32(g, true);
            }
        },
        LocateIP: function(ip) {
            function GetMiddleOffset(begin, end, recordLength) {
                var records = ((end - begin) / recordLength >> 1) * recordLength + begin;
                return records ^ begin ? records : records + recordLength;
            }
            var g, temp;
            for (var b = this.IPBegin, e = this.IPEnd; b < e;) {
                g = GetMiddleOffset(b, e, this.IP_RECORD_LENGTH); //获取中间位置
                temp = this.ReadUIntLE(g, 4);
                if (ip > temp) {
                    b = g;
                } else if (ip < temp) {
                    if (g == e) {
                        g -= this.IP_RECORD_LENGTH;
                        break;
                    }
                    e = g;
                } else {
                    break;
                }
            }
            return g;
        },
        SetIpFileString: function(Begin) { //读取字节,直到为0x00结束,返回数组
            var B = Begin || 0,
                toarr = [],
                M = this.Uint8Array.length;
            B = B < 0 ? 0 : B;
            for (var i = B; i < M; i++) {
                if (this.Uint8Array[i] == 0) {
                    return toarr;
                }
                toarr.push(this.Uint8Array[i]);
            }
            return toarr;
        },
        DecodeGBK: function(arr) {
            var kb = '',
                str = "";
            for (var n = 0, max = arr.length; n < max; n++) {
                var Code = arr[n];
                if (Code & 0x80) {
                    Code = this.GBKCode[Code << 8 | arr[++n]]
                }
                str += String.fromCharCode(Code);
            }
            return str.replace(/CZ88\.NET/i, "");
        },
        ReadArea: function(offset) { //读取Area
            var one = this.ReadUIntLE(offset, 1);
            if (one == this.REDIRECT_MODE_1 || one == this.REDIRECT_MODE_2) {
                var areaOffset = this.ReadUIntLE(offset + 1, 3);
                if (areaOffset == 0) return unArea;
                else {
                    return this.DecodeGBK(this.SetIpFileString(areaOffset));
                }
            } else {
                return this.DecodeGBK(this.SetIpFileString(offset));
            }
        },
        SetIPLocation: function(g) {
            var ipwz = this.ReadUIntLE(g + 4, 3) + 4;
            var lx = this.ReadUIntLE(ipwz, 1),
                loc = {};
            if (lx == this.REDIRECT_MODE_1) { //Country根据标识再判断
                ipwz = this.ReadUIntLE(ipwz + 1, 3); //读取国家偏移
                lx = this.ReadUIntLE(ipwz, 1); //再次获取标识字节
                var Gjbut;
                if (lx == this.REDIRECT_MODE_2) { //再次检查标识字节
                    Gjbut = this.SetIpFileString(this.ReadUIntLE(ipwz + 1, 3));
                    loc.Country = this.DecodeGBK(Gjbut);
                    ipwz = ipwz + 4;
                } else {
                    Gjbut = this.SetIpFileString(ipwz)
                    loc.Country = this.DecodeGBK(Gjbut);
                    ipwz += Gjbut.length + 1;
                }
                loc.Area = this.ReadArea(ipwz);
            } else if (lx == this.REDIRECT_MODE_2) { //Country直接读取偏移处字符串
                var Gjbut = this.SetIpFileString(this.ReadUIntLE(ipwz + 1, 3));
                loc.Country = this.DecodeGBK(Gjbut);
                loc.Area = this.ReadArea(ipwz + 4);
            } else { //Country直接读取 Area根据标志再判断
                var Gjbut = this.SetIpFileString(ipwz);
                ipwz += Gjbut.length + 1;
                loc.Country = this.DecodeGBK(Gjbut);
                loc.Area = this.ReadArea(ipwz);
            }
            return loc;
        },
        SearchIP: function(IP) {
            if (!this.IsReady || IP.match(/:/g)) return; // 排除IPV6
            var ip = this.IPToInt(IP),
                g = this.LocateIP(ip),
                loc = {};
            if (g == -1) {
                return {
                    "ip": IP,
                    "Country": 'Unknown',
                    "Area": 'Unknown'
                };
            }
            var add = this.SetIPLocation(g);
            loc.int = ip;
            loc.ip = this.IntToIP(ip);
            loc.Country = add.Country;
            loc.Area = add.Area;
            return loc;
        },
        SearchIPScope: function(bginIP, endIP, callback) {
            if (!this.IsReady || bginIP.match(/:/g) || endIP.match(/:/g)) return; // 排除IPV6
            if (typeof callback === "function") {
                var o = this;
                process.nextTick(function() {
                    try {
                        callback(null, o.searchIPScope(bginIP, endIP));
                    } catch (e) {
                        callback(e);
                    }
                })
                return;
            }
            var _ip1, _ip2, b_g, e_g, ips = [];
            try {
                _ip1 = this.IPToInt(bginIP);
            } catch (e) {
                throw ("The bginIP is not normal! >> " + bginIP);
            }
            try {
                _ip2 = this.IPToInt(endIP);
            } catch (e) {
                throw ("The endIP is not normal! >> " + endIP);
            }
            b_g = this.LocateIP(_ip1);
            e_g = this.LocateIP(_ip2);
            for (var i = b_g; i <= e_g; i += this.IP_RECORD_LENGTH) {
                var loc = {},
                    add = this.SetIPLocation(i);
                loc.begInt = this.ReadUIntLE(i, 4);
                loc.endInt = this.ReadUIntLE(this.ReadUIntLE(i + 4, 3), 4);
                loc.begIP = this.IntToIP(loc.begInt);
                loc.endIP = this.IntToIP(loc.endInt);
                loc.Country = add.Country;
                loc.Area = add.Area;
                ips.push(loc);
            }
            return ips;
        }
    };

    function FastDataViewUBE(buffer, offset, size, bytesPerInt) {
        this.bytes = new Uint8Array(buffer, offset, size);
        switch (bytesPerInt) {
            case 2:
                this.get = function(i) {
                    return this.getUint16(i * 2);
                };
                return;
            case 4:
                this.get = function(i) {
                    return this.getUint32(i * 4);
                };
                return;
            case 6:
                this.get = function(i) {
                    return this.getUint48(i * 6);
                };
                return;
        }
    }
    FastDataViewUBE.prototype = {
        getUint8: function(offset) {
            return this.bytes[offset];
        },
        getUint16: function(offset) {
            var bytes = this.bytes;
            var a = bytes[offset];
            var b = bytes[offset + 1];
            return ((a << 8) | b);
        },
        getUint32: function(offset) {
            var bytes = this.bytes;
            var a = bytes[offset];
            var b = bytes[offset + 1];
            var c = bytes[offset + 2];
            var d = bytes[offset + 3];
            return ((a << 24) | (b << 16) | (c << 8) | d) >>> 0; // '>>> 0' forces read as unsigned; left shifts >31 bits alter the sign (JS has no '<<<')
        },
        getUint48: function(offset) {
            return this.getUint16(offset) * 0x100000000 + this.getUint32(offset + 2); // JS cannot bitshift past 32 bits; read in two chunks and combine
        }
    };

    function TracingListener() {
        this.originalListener = null;
    }
    TracingListener.prototype = {
        onDataAvailable: function(request, context, inputStream, offset, count) {
            try {
                this.originalListener.onDataAvailable(request, context, inputStream, offset, count);
            } catch (e) {}
        },
        onStartRequest: function(request, context) {
            try {
                this.originalListener.onStartRequest(request, context);
            } catch (e) {}
        },
        onStopRequest: function(request, context, statusCode) {
            // if (statusCode != 0)
            FeiRuoNet.Services.NetStatus(request, context, statusCode);
            try {
                this.originalListener.onStopRequest(request, context, statusCode);
            } catch (e) {}
        },
        QueryInterface: function(aIID) {
            if (aIID.equals(Ci.nsIStreamListener) || aIID.equals(Ci.nsISupports)) {
                return this;
            }
            throw Components.results.NS_NOINTERFACE;
        }
    }

    function Filter(text) {
        this.text = text;
    }
    Filter.prototype = {
        text: null,
        serialize: function(buffer) {
            buffer.push("[Filter]");
            buffer.push("text=" + this.text);
        },
        toString: function() {
            return this.text;
        }
    };
    Filter.knownFilters = {
        __proto__: null
    };
    Filter.regexpRegExp = /^(@@)?\/.*\/(?:\$~?[\w\-]+(?:=[^,\s]+)?(?:,~?[\w\-]+(?:=[^,\s]+)?)*)?$/;
    Filter.optionsRegExp = /\$(~?[\w\-]+(?:=[^,\s]+)?(?:,~?[\w\-]+(?:=[^,\s]+)?)*)$/;
    Filter.fromText = function(text) {
        if (text in Filter.knownFilters) return Filter.knownFilters[text];
        let ret;
        if (text[0] == "!") ret = null;
        else ret = RegExpFilter.fromText(text);
        Filter.knownFilters[ret.text] = ret;
        return ret;
    }
    Filter.fromObject = function(text) {
        let ret = Filter.fromText(text);
        if (ret instanceof ActiveFilter) {
            ret._disabled = true;
        }
        return ret;
    }
    Filter.normalize = function(text) {
        if (!text) return text;
        text = text.replace(/[^\S ]/g, "");
        if (/^\s*!/.test(text)) {
            return text.replace(/^\s+/, "").replace(/\s+$/, "");
        } else return text.replace(/\s/g, "");
    }

    function ActiveFilter(text, domains) {
        Filter.call(this, text);
        this.domainSource = domains;
    }
    ActiveFilter.prototype = {
        __proto__: Filter.prototype,
        _disabled: false,
        get disabled() this._disabled,
        set disabled(value) {
            if (value != this._disabled) {
                let oldValue = this._disabled;
                this._disabled = value;
            }
            return this._disabled;
        },
        domainSource: null,
        domainSeparator: null,
        ignoreTrailingDot: true,
        domainSourceIsUpperCase: false,
        get domains() {
            let domains = null;
            if (this.domainSource) {
                let source = this.domainSource;
                if (!this.domainSourceIsUpperCase) {
                    // RegExpFilter already have uppercase domains
                    source = source.toUpperCase();
                }
                let list = source.split(this.domainSeparator);
                if (list.length == 1 && list[0][0] != "~") {
                    domains = {
                        __proto__: null,
                        "": false
                    };
                    if (this.ignoreTrailingDot) list[0] = list[0].replace(/\.+$/, "");
                    domains[list[0]] = true;
                } else {
                    let hasIncludes = false;
                    for (let i = 0; i < list.length; i++) {
                        let domain = list[i];
                        if (this.ignoreTrailingDot) domain = domain.replace(/\.+$/, "");
                        if (domain == "") continue;
                        let include;
                        if (domain[0] == "~") {
                            include = false;
                            domain = domain.substr(1);
                        } else {
                            include = true;
                            hasIncludes = true;
                        }
                        if (!domains) domains = {
                            __proto__: null
                        };
                        domains[domain] = include;
                    }
                    domains[""] = !hasIncludes;
                }
                this.domainSource = null;
            }
            this.__defineGetter__("domains", function() domains);
            return this.domains;
        },
        isActiveOnDomain: function( /**String*/ docDomain) /**Boolean*/ {
            if (!this.domains) return true;
            if (!docDomain) return this.domains[""];
            if (this.ignoreTrailingDot) docDomain = docDomain.replace(/\.+$/, "");
            docDomain = docDomain.toUpperCase();
            while (true) {
                if (docDomain in this.domains) return this.domains[docDomain];
                let nextDot = docDomain.indexOf(".");
                if (nextDot < 0) break;
                docDomain = docDomain.substr(nextDot + 1);
            }
            return this.domains[""];
        },
        isActiveOnlyOnDomain: function( /**String*/ docDomain) /**Boolean*/ {
            if (!docDomain || !this.domains || this.domains[""]) return false;
            if (this.ignoreTrailingDot) docDomain = docDomain.replace(/\.+$/, "");
            docDomain = docDomain.toUpperCase();
            for (let domain of this.domains)
                if (this.domains[domain] && domain != docDomain && (domain.length <= docDomain.length || domain.indexOf("." + docDomain) != domain.length - docDomain.length - 1)) return false;
            return true;
        },
        serialize: function(buffer) {
            if (this._disabled) {
                Filter.prototype.serialize.call(this, buffer);
                if (this._disabled) buffer.push("disabled=true");
            }
        }
    };

    function RegExpFilter(text, regexpSource, domains) {
        ActiveFilter.call(this, text, domains);
        if (regexpSource.length >= 2 && regexpSource[0] == "/" && regexpSource[regexpSource.length - 1] == "/") {
            let regexp = new RegExp(regexpSource.substr(1, regexpSource.length - 2), "i");
            this.__defineGetter__("regexp", function() regexp);
        } else {
            this.regexpSource = regexpSource;
        }
    }
    RegExpFilter.prototype = {
        __proto__: ActiveFilter.prototype,
        domainSourceIsUpperCase: true,
        length: 1,
        domainSeparator: "|",
        regexpSource: null,
        get regexp() {
            let source = this.regexpSource.replace(/\*+/g, "*") // remove multiple wildcards
                .replace(/\^\|$/, "^") // remove anchors following separator placeholder
                .replace(/\W/g, "\\$&") // escape special symbols
                .replace(/\\\*/g, ".*") // replace wildcards by .*
                // process separator placeholders (all ANSI characters but alphanumeric characters and _%.-)
                .replace(/\\\^/g, "(?:[\\x00-\\x24\\x26-\\x2C\\x2F\\x3A-\\x40\\x5B-\\x5E\\x60\\x7B-\\x7F]|$)").replace(/^\\\|\\\|/, "^[\\w\\-]+:\\/+(?!\\/)(?:[^\\/]+\\.)?") // process extended anchor at expression start
                .replace(/^\\\|/, "^") // process anchor at expression start
                .replace(/\\\|$/, "$") // process anchor at expression end
                .replace(/^(\.\*)/, "") // remove leading wildcards
                .replace(/(\.\*)$/, ""); // remove trailing wildcards
            let regexp = new RegExp(source, "i");
            delete this.regexpSource;
            this.__defineGetter__("regexp", function() regexp);
            return this.regexp;
        },
        matches: function(location, docDomain) {
            if (this.regexp.test(location) && this.isActiveOnDomain(docDomain)) {
                return true;
            }
            return false;
        }
    };
    RegExpFilter.prototype.__defineGetter__("0", function() {
        return this;
    });
    RegExpFilter.fromText = function(text) {
        let blocking = true;
        let origText = text;
        if (text.indexOf("@@") == 0) {
            blocking = false;
            text = text.substr(2);
        }
        let domains = null;
        try {
            if (blocking) return new BlockingFilter(origText, text, domains);
            else return new WhitelistFilter(origText, text, domains);
        } catch (e) {
            return null;
        }
    }

    function BlockingFilter(text, regexpSource, domains) {
        RegExpFilter.call(this, text, regexpSource, domains);
    }
    BlockingFilter.prototype = {
        __proto__: RegExpFilter.prototype,
    };

    function WhitelistFilter(text, regexpSource, domains) {
        RegExpFilter.call(this, text, regexpSource, domains);
    }
    WhitelistFilter.prototype = {
        __proto__: RegExpFilter.prototype,
    }

    function Matcher() {
        this.clear();
    }
    Matcher.prototype = {
        filterByKeyword: null,
        keywordByFilter: null,
        clear: function() {
            this.filterByKeyword = {
                __proto__: null
            };
            this.keywordByFilter = {
                __proto__: null
            };
        },
        add: function(filter) {
            if (filter.text in this.keywordByFilter) return;
            let keyword = this.findKeyword(filter);
            let oldEntry = this.filterByKeyword[keyword];
            if (typeof oldEntry == "undefined") this.filterByKeyword[keyword] = filter;
            else if (oldEntry.length == 1) this.filterByKeyword[keyword] = [oldEntry, filter];
            else oldEntry.push(filter);
            this.keywordByFilter[filter.text] = keyword;
        },
        remove: function(filter) {
            if (!(filter.text in this.keywordByFilter)) return;
            let keyword = this.keywordByFilter[filter.text];
            let list = this.filterByKeyword[keyword];
            if (list.length <= 1) delete this.filterByKeyword[keyword];
            else {
                let index = list.indexOf(filter);
                if (index >= 0) {
                    list.splice(index, 1);
                    if (list.length == 1) this.filterByKeyword[keyword] = list[0];
                }
            }
            delete this.keywordByFilter[filter.text];
        },
        findKeyword: function(filter) {
            let result = "";
            let text = filter.text;
            if (Filter.regexpRegExp.test(text)) return result;
            let match = Filter.optionsRegExp.exec(text);
            if (match) text = match.input.substr(0, match.index);
            if (text.substr(0, 2) == "@@") text = text.substr(2);
            let candidates = text.toLowerCase().match(/[^a-z0-9%*][a-z0-9%]{3,}(?=[^a-z0-9%*])/g);
            if (!candidates) return result;
            let hash = this.filterByKeyword;
            let resultCount = 0xFFFFFF;
            let resultLength = 0;
            for (let i = 0, l = candidates.length; i < l; i++) {
                let candidate = candidates[i].substr(1);
                let count = (candidate in hash ? hash[candidate].length : 0);
                if (count < resultCount || (count == resultCount && candidate.length > resultLength)) {
                    result = candidate;
                    resultCount = count;
                    resultLength = candidate.length;
                }
            }
            return result;
        },
        hasFilter: function( /**RegExpFilter*/ filter) /**Boolean*/ {
            return (filter.text in this.keywordByFilter);
        },
        getKeywordForFilter: function( /**RegExpFilter*/ filter) /**String*/ {
            if (filter.text in this.keywordByFilter) return this.keywordByFilter[filter.text];
            else return null;
        },
        _checkEntryMatch: function(keyword, location, docDomain) {
            let list = this.filterByKeyword[keyword];
            for (let i = 0; i < list.length; i++) {
                let filter = list[i];
                if (filter.matches(location, docDomain)) return filter;
            }
            return null;
        },
        matchesAny: function(location, docDomain) {
            let candidates = location.toLowerCase().match(/[a-z0-9%]{3,}/g);
            if (candidates === null) candidates = [];
            candidates.push("");
            for (let i = 0, l = candidates.length; i < l; i++) {
                let substr = candidates[i];
                if (substr in this.filterByKeyword) {
                    let result = this._checkEntryMatch(substr, location, docDomain);
                    if (result) return result;
                }
            }
            return null;
        }
    };

    function CombinedMatcher() {
        this.blacklist = new Matcher();
        this.whitelist = new Matcher();
        this.keys = {
            __proto__: null
        };
        this.resultCache = {
            __proto__: null
        };
    }
    CombinedMatcher.maxCacheEntries = 1000;
    CombinedMatcher.prototype = {
        blacklist: null,
        whitelist: null,
        keys: null,
        resultCache: null,
        cacheEntries: 0,
        clear: function() {
            this.blacklist.clear();
            this.whitelist.clear();
            this.keys = {
                __proto__: null
            };
            this.resultCache = {
                __proto__: null
            };
            this.cacheEntries = 0;
        },
        add: function(filter) {
            if (filter instanceof WhitelistFilter) this.whitelist.add(filter);
            else this.blacklist.add(filter);
            if (this.cacheEntries > 0) {
                this.resultCache = {
                    __proto__: null
                };
                this.cacheEntries = 0;
            }
        },
        remove: function(filter) {
            if (filter instanceof WhitelistFilter) this.whitelist.remove(filter);
            else this.blacklist.remove(filter);
            if (this.cacheEntries > 0) {
                this.resultCache = {
                    __proto__: null
                };
                this.cacheEntries = 0;
            }
        },
        findKeyword: function(filter) {
            if (filter instanceof WhitelistFilter) return this.whitelist.findKeyword(filter);
            else return this.blacklist.findKeyword(filter);
        },
        hasFilter: function(filter) {
            if (filter instanceof WhitelistFilter) return this.whitelist.hasFilter(filter);
            else return this.blacklist.hasFilter(filter);
        },
        getKeywordForFilter: function(filter) {
            if (filter instanceof WhitelistFilter) return this.whitelist.getKeywordForFilter(filter);
            else return this.blacklist.getKeywordForFilter(filter);
        },
        isSlowFilter: function( /**RegExpFilter*/ filter) /**Boolean*/ {
            let matcher = (filter instanceof WhitelistFilter ? this.whitelist : this.blacklist);
            if (matcher.hasFilter(filter)) return !matcher.getKeywordForFilter(filter);
            else return !matcher.findKeyword(filter);
        },
        matchesAnyInternal: function(location, docDomain) {
            let candidates = location.toLowerCase().match(/[a-z0-9%]{3,}/g);
            if (candidates === null) candidates = [];
            candidates.push("");
            let blacklistHit = null;
            for (let i = 0, l = candidates.length; i < l; i++) {
                let substr = candidates[i];
                if (substr in this.whitelist.filterByKeyword) {
                    let result = this.whitelist._checkEntryMatch(substr, location, docDomain);
                    if (result) return result;
                }
                if (substr in this.blacklist.filterByKeyword && blacklistHit === null) blacklistHit = this.blacklist._checkEntryMatch(substr, location, docDomain);
            }
            return blacklistHit;
        },
        matchesAny: function(location, docDomain) {
            let key = location + " " + docDomain;
            if (key in this.resultCache) return this.resultCache[key];
            let result = this.matchesAnyInternal(location, docDomain);
            if (this.cacheEntries >= CombinedMatcher.maxCacheEntries) {
                this.resultCache = {
                    __proto__: null
                };
                this.cacheEntries = 0;
            }
            this.resultCache[key] = result;
            this.cacheEntries++;
            return result;
        },
        matchesByKey: function( /**String*/ location, /**String*/ key, /**String*/ docDomain) {
            key = key.toUpperCase();
            if (key in this.keys) {
                let filter = Filter.knownFilters[this.keys[key]];
                if (filter && filter.matches(location, "DOCUMENT", docDomain, false)) return filter;
                else return null;
            } else return null;
        }
    };
    /*****************************************************************************************/
    // 来自 User Agent Overrider 扩展
    const ToolbarManager = (function() {
        /**
         * Remember the button position.
         * This function Modity from addon-sdk file lib/sdk/widget.js, and
         * function BrowserWindow.prototype._insertNodeInToolbar
         */
        let layoutWidget = function(document, button, isFirstRun) {
            // Add to the customization palette
            let toolbox = document.getElementById('navigator-toolbox');
            toolbox.palette.appendChild(button);
            // Search for widget toolbar by reading toolbar's currentset attribute
            let container = null;
            let toolbars = document.getElementsByTagName('toolbar');
            let id = button.getAttribute('id');
            for (let i = 0; i < toolbars.length; i += 1) {
                let toolbar = toolbars[i];
                if (toolbar.getAttribute('currentset').indexOf(id) !== -1) {
                    container = toolbar;
                }
            }
            // if widget isn't in any toolbar, default add it next to searchbar
            if (!container) {
                if (isFirstRun) {
                    container = document.getElementById('nav-bar');
                } else {
                    return;
                }
            }
            // Now retrieve a reference to the next toolbar item
            // by reading currentset attribute on the toolbar
            let nextNode = null;
            let currentSet = container.getAttribute('currentset');
            let ids = (currentSet === '__empty') ? [] : currentSet.split(',');
            let idx = ids.indexOf(id);
            if (idx !== -1) {
                for (let i = idx; i < ids.length; i += 1) {
                    nextNode = document.getElementById(ids[i]);
                    if (nextNode) {
                        break;
                    }
                }
            }
            // Finally insert our widget in the right toolbar and in the right position
            container.insertItem(id, nextNode, null, false);
            // Update DOM in order to save position
            // in this toolbar. But only do this the first time we add it to the toolbar
            if (ids.indexOf(id) === -1) {
                container.setAttribute('currentset', container.currentSet);
                document.persist(container.id, 'currentset');
            }
        };
        let addWidget = function(window, widget, isFirstRun) {
            try {
                layoutWidget(window.document, widget, isFirstRun);
            } catch (error) {
                console.log(error);
            }
        };
        let removeWidget = function(window, widgetId) {
            try {
                let widget = window.document.getElementById(widgetId);
                widget.parentNode.removeChild(widget);
            } catch (error) {
                console.log(error);
            }
        };
        let exports = {
            addWidget: addWidget,
            removeWidget: removeWidget,
        };
        return exports;
    })();

    function $A(arr) Array.slice(arr);

    function log(str) {
        if (FeiRuoNet.Debug) console.log("[FeiRuoNet Debug] " + $A(arguments));
    }

    function ShowStatus(str, time) {
        XULBrowserWindow.statusTextField.label = '[FeiRuoNet]' + str;
        setTimeout(function() {
            XULBrowserWindow.statusTextField.label = '';
        }, time || 1500)
    }

    function alert(aString, aTitle) {
        Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "FeiRuoNet", aString, false, "", null);
    }

    function _$(id) {
        return FeiRuoNet.GetWindow('Preferences').document.getElementById(id);
    }

    function _$C(name, attr) {
        var el = FeiRuoNet.GetWindow('Preferences').document.createElement(name);
        if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
        return el;
    }

    function $(id) document.getElementById(id);

    function $$(exp, doc) {
        return Array.prototype.slice.call((doc || document).querySelectorAll(exp));
    }

    function $C(name, attr) {
        var el = document.createElement(name);
        if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
        return el;
    }
    window.FeiRuoNet = FeiRuoNet;
    FeiRuoNet.Initialization();
})('\
#urlbar.FeiRuoNetSSLhigh,\
#urlbar.FeiRuoNetSSLhigh > .autocomplete-textbox-container {\
    background-color: #88f788 !important;\
}\
#urlbar.FeiRuoNetSSLmid,\
#urlbar.FeiRuoNetSSLmid > .autocomplete-textbox-container {\
    background-color: #BBFFBB !important;\
}\
#urlbar.FeiRuoNetSSLlow,\
#urlbar.FeiRuoNetSSLlow > .autocomplete-textbox-container {\
    background-color: #DDF9CC !important;\
}\
#urlbar.FeiRuoNetSSLbroken,\
#urlbar.FeiRuoNetSSLbroken > .autocomplete-textbox-container {\
    background-color: #F7DFDF !important;\
}\
.FeiRuoNet_UserAgent_item {\
    color: black !important;\
    font-weight: normal !important;\
}\
.FeiRuoNet_UsingUA {\
    font-weight: bold!important;\
    color: brown!important;\
}\
#FeiRuoNet_Disable {\
    filter: grayscale(100%) !important;\
}\
#FeiRuoNet_Tooltip {\
    opacity: 0.9;\
    color: brown;\
    text-shadow: 0 0 3px #CCC;\
    background: rgba(255,255,255,0.6);\
    padding-bottom: 3px;\
    border: 1px solid #BBB;\
    border-radius: 3px;\
    box-shadow: 0 0 3px #444;\
}\
#FeiRuoNet_icon {\
    padding:0 0 0 3px !important;\
}\
#FeiRuoNet_icon.Proxy {\
    filter: grayscale(50%) blur(.2px);\
}\
#FeiRuoNet_icon.Error {\
    filter: grayscale(50%) blur(.2px);\
}\
'.replace(/\n|\t/g, ''));
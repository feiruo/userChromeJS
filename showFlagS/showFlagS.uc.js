// ==UserScript==
// @name 			showFlagS.uc.js
// @description		显示国旗与IP
// @author			ywzhaiqi、feiruo
// @compatibility	Firefox 16
// @charset			UTF-8
// @include			chrome://browser/content/browser.xul
// @id 				[FE89584D]
// @inspect         window.showFlagS
// @startup         window.showFlagS.init();
// @shutdown        window.showFlagS.onDestroy();
// @optionsURL		about:config?filter=showFlagS.
// @config 			window.showFlagS.command('Edit');
// @reviewURL		http://bbs.kafan.cn/thread-1666483-1-1.html
// @reviewURL		http://www.firefoxfan.com/UC-Script/328.html
// @homepageURL		https://github.com/feiruo/userChromeJS/tree/master/showFlagS
// @downloadURL		https://github.com/feiruo/userChromeJS/raw/master/showFlagS/showFlagS.uc.js
// @note            Begin 2013-12-16
// @note            显示网站IP地址和所在国家国旗，帮助识别网站真实性。
// @note            左键点击图标复制信息，中间刷新信息，右键弹出菜单。
// @note            修改浏览器标识，破解反盗链，更多功能需要【_showFlagS.js】配置文件。
// @version         1.7.0.1     2015.04.28 10:00    Fix。
// @version         1.7.0.0 	2015.03.27 10:00	Final!!Rebuild&Fix more。
// @version         1.6.2.5 	2015.03.09 11:00	UA add appVersion example:115.com。
// @version         1.6.2.4.2 	2015.03.06 17:00	Fix e10s Window。
// @version         1.6.2.4.1 	2015.02.27 14:00	Fix page-proxy-favicon CSS。
// @version         1.6.2.4 	2015.02.25 19:00	Add RefererChange。
// @version         1.6.2.3 	2015.02.18 22:00	Add UserAgentChanger。
// @version         1.6.2.2 	2015.02.13 23:00	Fix exec。
// @version         1.6.2.1 	2014.09.18 19:00	Fix Path indexof '\\' or '//'。
// @version         1.6.2.0		2014.08.29 21:30	完善卸载，完善路径兼容。
// @version         1.6.1.2		2014.08.27 20:30	完善禁用和路径支持。
// @version         1.6.1.1		2014.08.24 22:00	错误页面显示。
// @version         1.6.1.0		2014.08.22 22:00	修复Linux和Windows路径问题。
// @version         1.6.0.4		2014.08.17 16:40	Fix。
// @version         1.6.0.3		2014.08.10 18:00	ReBuilding。
// @version         1.6.0.2		2014.08.08 21:00	ReBuilding。
// @version         1.6.0.1		2014.08.07 17:00	ReBuilding。
// @version         1.6.0.0		ReBuild。
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
location == "chrome://browser/content/browser.xul" && (function(CSS) {

    if (window.showFlagS) {
        window.showFlagS.onDestroy();
        delete window.showFlagS;
    }

    if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");

    var showFlagS = {
        debug: true,
        def_uaIdx: 0,
        Current_idx: 0,
        dnsCache: [],
        isReqHash: [],
        isReqHash_tooltip: [],
        showFlagHash: [],
        showFlagTooltipHash: [],
        DlibIconPath: "lib\\countryflags.js",
        DLocalFlags: "lib\\LocalFlags\\",
        DBAK_FLAG_PATH: "http://www.razerzone.com/asset/images/icons/flags/",
        DEFAULT_FlagS: "chrome://branding/content/icon16.png",
        PPFaviconVisibility: $("page-proxy-favicon").style.visibility,

        get dns() {
            return Cc["@mozilla.org/network/dns-service;1"]
                .getService(Components.interfaces.nsIDNSService);
        },
        get eventqueue() {
            return Cc["@mozilla.org/thread-manager;1"]
                .getService().mainThread;
        },
        get usingUA() {
            var prefs = Services.prefs.getBranch("");
            if (prefs.getPrefType("general.useragent.override") != 0)
                return prefs.getCharPref("general.useragent.override");
            return null;
        },
        get currentURI() {
            var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"]
                .getService(Ci.nsIWindowMediator);
            var topWindowOfType = windowMediator.getMostRecentWindow("navigator:browser");
            if (topWindowOfType)
                return topWindowOfType.document.getElementById("content").currentURI;
            return null;
        },
        get prefs() {
            delete this.prefs;
            return this.prefs = Services.prefs.getBranch("userChromeJS.showFlagS.");
        },
        get file() {
            let aFile;
            aFile = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
            aFile.appendRelativePath("lib");
            aFile.appendRelativePath("_showFlagS.js");
            this._modifiedTime = aFile.lastModifiedTime;
            delete this.file;
            return this.file = aFile;
        },

        init: function() {
            this.makePanel();
            this.loadSetting();
            this.rebuild();
            this.Service(true);
            window.addEventListener("unload", function() {
                showFlagS.onDestroy();
            }, false);
        },

        onDestroy: function() {
            this.SetIcon();
            this.Service();
            this.removeMenu();
            if (this.Icon_Pos === 0)
                $("page-proxy-favicon").style.visibility = this.PPFaviconVisibility;

            var popup = $("showFlagS-popup");
            if (popup) popup.parentNode.removeChild(popup);
            delete popup;

            if (this.CountryNames) delete this.CountryNames;
            if (this.CountryFlags) delete this.CountryFlags;
            var win = this.getWindow(0);
            if (win) win.close();
            Services.appinfo.invalidateCachesOnRestart();
        },

        Service: function(isAlert) {
            var os = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
            try {
                os.removeObserver(this, "http-on-modify-request", false);
                os.removeObserver(this.onDocumentCreated, "content-document-global-created", false);

                this.prefs.removeObserver('', this.PrefKey, false);

                window.getBrowser().removeProgressListener(window.showFlagS.progressListener);
            } catch (e) {}
            if (!isAlert) return;
            this.progressListener = {
                onLocationChange: function() {
                    showFlagS.onLocationChange();
                },
                onProgressChange: function() {},
                onSecurityChange: function() {},
                onStateChange: function() {},
                onStatusChange: function() {}
            };
            window.getBrowser().addProgressListener(showFlagS.progressListener);
            os.addObserver(this, "http-on-modify-request", false);
            os.addObserver(this.onDocumentCreated, "content-document-global-created", false);
            this.prefs.addObserver('', this.PrefKey, false);
        },

        makePanel: function() {
            this.Popup = $C("menupopup", {
                id: "showFlagS-popup",
            });
            this.Popup.appendChild($C("menuitem", {
                id: "showFlagS-copy",
                label: "复制信息",
                oncommand: "showFlagS.command('Copy');",
            }));
            this.Popup.appendChild($C("menuitem", {
                id: "showFlagS-rebuild",
                label: "刷新信息",
                oncommand: "showFlagS.onLocationChange('Flags');",
            }));
            var menu = $C("menu", {
                id: "showFlagS-UserAgent-config",
                label: "UserAgent",
                oncommand: "showFlagS.command('Copy');",
                class: "showFlagS menu-iconic",
                hidden: "true",
            });
            menu.appendChild($C("menupopup", {
                id: "showFlagS-UserAgent-popup",
            }));
            this.Popup.appendChild(menu);
            this.Popup.appendChild($C("menuitem", {
                id: "showFlagS-set-Pref",
                label: "脚本设置",
                class: "showFlagS menuitem-iconic",
                image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYElEQVQ4jY3TO0/VQRAF8F9yTUB6QMCCZ6KJBq4JNIQKCkoopAWMsabhC1ho5SOYaO2j0AQ+gYKPS/BeaDD0kPhJLP7nbzZA0ElOsjvnzOzOziyX2yjO8Ds4i++/bRgdzAUdjFwVMIkNDASP8QuDwXF8Nb+RGHAdb3GC72jhIxZxLViMbx/fon2XWKv4inHcx6OaQH8A3eFWot3DmmT8jImipF48y21aeI6+gp9IzA+Ywmu0k7mBF9jBDKaxjZfhxqN9k1hULepgLI90gHvFic34BqJtR6tM0D6XYKrgJ/FT1ZFa+3cu7mALR6mtkf2n3KKZ9auihMPs79aPuIvbxYn9SbIfbOFGwd/CF1XbPVC1ZARL2XdFOIihrLuwjuVod/EQevBeNXmt1P8BC6ohamA+moNojqPpqa/UxCZuBk8iKkf5abihaMsuXbBh1UvPBm3/+EznbRSnqm9c49Lv/AcsoU6W+qo3pgAAAABJRU5ErkJggg==",
                onclick: "showFlagS.PrefSetClick(event);",
                tooltiptext: "左键：打开设置窗口。\n中键：重载配置。\n右键：编辑配置。",
            }));
            this.Popup.appendChild($C("menuseparator", {
                id: "showFlagS-sepalator2",
                hidden: "true",
            }));

            /*let xml = '\
				<menupopup id="showFlagS-popup">\
					<menuitem label="复制信息" id="showFlagS-copy" oncommand="showFlagS.command(\'Copy\');" />\
					<menuitem label="刷新信息" id="showFlagS-rebuild" oncommand="showFlagS.onLocationChange(\'Flags\');"/>\
					<menu label="UserAgent" id="showFlagS-UserAgent-config" class="showFlagS menu-iconic" hidden="true">\
					<menupopup  id="showFlagS-UserAgent-popup">\
					</menupopup>\
					</menu>\
					<menuitem label="脚本设置" id="showFlagS-set-Pref" onclick="showFlagS.openPref(\'Set\');" class="showFlagS menuitem-iconic" image="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABYElEQVQ4jY3TO0/VQRAF8F9yTUB6QMCCZ6KJBq4JNIQKCkoopAWMsabhC1ho5SOYaO2j0AQ+gYKPS/BeaDD0kPhJLP7nbzZA0ElOsjvnzOzOziyX2yjO8Ds4i++/bRgdzAUdjFwVMIkNDASP8QuDwXF8Nb+RGHAdb3GC72jhIxZxLViMbx/fon2XWKv4inHcx6OaQH8A3eFWot3DmmT8jImipF48y21aeI6+gp9IzA+Ywmu0k7mBF9jBDKaxjZfhxqN9k1hULepgLI90gHvFic34BqJtR6tM0D6XYKrgJ/FT1ZFa+3cu7mALR6mtkf2n3KKZ9auihMPs79aPuIvbxYn9SbIfbOFGwd/CF1XbPVC1ZARL2XdFOIihrLuwjuVod/EQevBeNXmt1P8BC6ohamA+moNojqPpqa/UxCZuBk8iKkf5abihaMsuXbBh1UvPBm3/+EznbRSnqm9c49Lv/AcsoU6W+qo3pgAAAABJRU5ErkJggg=="/>\
					<menuseparator hidden="true" id="showFlagS-sepalator2"/>\
				</menupopup>\
				';
            let range = document.createRange();
            range.selectNodeContents(document.getElementById("mainPopupSet"));
            range.collapse(false);
            range.insertNode(range.createContextualFragment(xml.replace(/\n|\t/g, "")));
            range.detach();*/
        },

        PrefSetClick: function(e) {
            if (e.target != e.currentTarget) return;
            e.stopPropagation();
            e.preventDefault();

            if (e.button == 0)
                showFlagS.openPref('Set');
            else if (e.button == 1)
                showFlagS.rebuild(true);
            if (e.button == 2)
                this.editFile(this.file);
        },

        loadSetting: function(type) {
            if (!type || type === "Icon_Pos") {
                var Icon_Pos = this.getPrefs(1, "Icon_Pos", 0);
                if (this.Icon_Pos != Icon_Pos) {
                    this.Icon_Pos = Icon_Pos;
                    this.SetIcon(true);
                    if (type) this.onLocationChange();
                }
            }

            if (!type || type === "IconSstatusBarPanel") {
                var IconSstatusBarPanel = this.getPrefs(0, "IconSstatusBarPanel", false);
                if (this.IconSstatusBarPanel != IconSstatusBarPanel) {
                    this.IconSstatusBarPanel = IconSstatusBarPanel;
                    this.SetIcon(true);
                    if (type) this.onLocationChange();
                }
            }

            if (!type || type === "Inquiry_Delay")
                this.Inquiry_Delay = this.getPrefs(1, "Inquiry_Delay", 3500);

            if (!type || type === "libIconPath") {
                var libIconPath = this.getPrefs(2, "libIconPath", this.DlibIconPath);
                if (this.libIconPath != libIconPath) {
                    this.libIconPath = libIconPath;
                    var FlagLibData = this.getData(this.libIconPath);
                    if (FlagLibData) {
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
                            Cu.evalInSandbox(FlagLibData, sandbox, "1.8");
                        } catch (e) {
                            let line = e.lineNumber - lineFinder.lineNumber - 1;
                            this.alert('Error: ' + e + "\n请重新检查Lib文件第 " + line + " 行");
                        }
                        if (this.CountryNames) delete this.CountryNames;
                        if (this.CountryFlags) delete this.CountryFlags;
                        this.CountryNames = sandbox.CountryNames || [];
                        this.CountryFlags = sandbox.CountryFlags || [];
                    }
                }
            }

            if (!type || type === "SourceSite") {
                var apiSite = this.getPrefs(2, "SourceSite", (this.SourceAPI ? (this.SourceAPI[0] ? this.SourceAPI[0].id : "") : ""));
                if (this.apiSite != apiSite) {
                    this.apiSite = apiSite;
                    this.siteApi = this.siteRex = null;
                    this.FlagApi = this.FlagRex = null;
                    if (this.SourceAPI && this.SourceAPI[0]) {
                        for (var i = 0; i < this.SourceAPI.length; i++) {
                            if (this.SourceAPI[i].isJustFlag) return;
                            if (this.SourceAPI[i].id == this.apiSite) {
                                this.siteApi = this.SourceAPI[i].inquireAPI;
                                this.siteRex = this.SourceAPI[i].regulation;
                            }
                            if (this.SourceAPI[i].isFlag) {
                                this.FlagApi = this.SourceAPI[i].inquireAPI;
                                this.FlagRex = this.SourceAPI[i].regulation;
                            }
                        }
                    }
                    if (type) this.onLocationChange('Flags');
                }
            }

            if (!type || type === "LocalFlags")
                this.LocalFlags = this.getPrefs(2, "LocalFlags", this.DLocalFlags);

            if (!type || type === "BAK_FLAG_PATH")
                this.BAK_FLAG_PATH = this.getPrefs(2, "BAK_FLAG_PATH", this.DBAK_FLAG_PATH);

            if (!type || type === "MyInfo") {
                this.isMyInfo = this.getPrefs(0, "MyInfo", false);
                if (type) this.onLocationChange('Flags');
            }

            if (!type || type === "SeoInfo") {
                this.isSeoInfo = this.getPrefs(0, "SeoInfo", false);
                if (type) this.onLocationChange('Flags');
            }

            if (!type || type === "Reacquire") {
                this.isReacquire = this.getPrefs(0, "Reacquire", false);
                if (type) this.onLocationChange('Flags');
            }

            if (!type || type === "RefChanger")
                this.RfCState = this.getPrefs(0, "RefChanger", false);

            if (!type || type === "UAChanger") {
                this.UAState = this.getPrefs(0, "UAChanger", false);
                $("showFlagS-UserAgent-config").hidden = !this.UAState;
            }
        },

        getPrefs: function(type, name, val) {
            if (type === 0) {
                if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_BOOL)
                    this.prefs.setBoolPref(name, val);
                return this.prefs.getBoolPref(name);
            }
            if (type === 1) {
                if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_INT)
                    this.prefs.setIntPref(name, val);
                return this.prefs.getIntPref(name);
            }
            if (type === 2) {
                if (!this.prefs.prefHasUserValue(name) || this.prefs.getPrefType(name) != Ci.nsIPrefBranch.PREF_STRING)
                    this.prefs.setCharPref(name, val);
                return this.prefs.getCharPref(name);
            }
        },

        removeMenu: function() {
            try {
                $("showFlagS-sepalator2").hidden = true;
            } catch (e) {}

            if (this.Menus) {
                try {
                    for (i in this.Menus) {
                        $("main-menubar").insertBefore($(this.Menus[i].id), $("main-menubar").childNodes[7]);
                    }
                    //delete this.Menus;
                } catch (e) {}
            }

            let usList = document.querySelectorAll("menuitem[id^='showFlagS-UserAgent-']");
            for (let i = 0; i < usList.length; i++) {
                usList[i].parentNode.removeChild(usList[i]);
            }
            delete usList;

            let uamenuseparator = document.querySelectorAll("menuseparator[id^='showFlagS-UserAgent-']");
            for (let i = 0; i < uamenuseparator.length; i++) {
                uamenuseparator[i].parentNode.removeChild(uamenuseparator[i]);
            }
            delete uamenuseparator;

            let menuitems = document.querySelectorAll("menuitem[id^='showFlagS-item-']");
            if (menuitems) {
                for (let i = 0; i < menuitems.length; i++) {
                    menuitems[i].parentNode.removeChild(menuitems[i]);
                }
                delete menuitems;
            }

            let menus = document.querySelectorAll("menu[id^='showFlagS-menu-']");
            if (menus) {
                for (let i = 0; i < menus.length; i++) {
                    menus[i].parentNode.removeChild(menus[i]);
                }
                delete menus;
            }
        },

        openPref: function(type) {
            var win = this.getWindow(0);
            if (win)
                win.focus();
            else
                window.openDialog("data:application/vnd.mozilla.xul+xml;charset=UTF-8," + this.option(), '', 'chrome,titlebar,toolbar,centerscreen,dialog=no');
        },

        option: function(type) {
            let xul = '<?xml version="1.0"?><?xml-stylesheet href="chrome://global/skin/" type="text/css"?>\
				<prefwindow xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"\
					id="showFlagS_Settings"\
					ignorekeys="true"\
					title="showFlagS 设置"\
					onload="opener.showFlagS.option_Scripts.init();"\
					onunload="opener.showFlagS.updateFile();"\
					buttons="accept, cancel, extra1, extra2"\
					ondialogextra1="opener.showFlagS.option_Scripts.reset();"\
					ondialogextra2="editMenu();"\
					windowtype="showFlagS:Preferences">\
					<prefpane id="main" flex="1">\
						<preferences>\
							<preference id="Icon_Pos" type="int" name="userChromeJS.showFlagS.Icon_Pos"/>\
							<preference id="IconSstatusBarPanel" type="bool" name="userChromeJS.showFlagS.IconSstatusBarPanel"/>\
							<preference id="Inquiry_Delay" type="int" name="userChromeJS.showFlagS.Inquiry_Delay"/>\
							<preference id="libIconPath" type="string" name="userChromeJS.showFlagS.libIconPath"/>\
							<preference id="LocalFlags" type="string" name="userChromeJS.showFlagS.LocalFlags"/>\
							<preference id="BAK_FLAG_PATH" type="string" name="userChromeJS.showFlagS.BAK_FLAG_PATH"/>\
							<preference id="SourceSite" type="string" name="userChromeJS.showFlagS.SourceSite"/>\
							<preference id="MyInfo" type="bool" name="userChromeJS.showFlagS.MyInfo"/>\
							<preference id="SeoInfo" type="bool" name="userChromeJS.showFlagS.SeoInfo"/>\
							<preference id="Reacquire" type="bool" name="userChromeJS.showFlagS.Reacquire"/>\
							<preference id="RefChanger" type="bool" name="userChromeJS.showFlagS.RefChanger"/>\
							<preference id="UAChanger" type="bool" name="userChromeJS.showFlagS.UAChanger"/>\
						</preferences>\
						<script>\
							function editMenu() opener.showFlagS.command("Edit");\
						</script>\
						<vbox>\
							<rows>\
								<row>\
									<groupbox>\
										<caption label="功能开关(需要配置文件支持)" />\
											<grid>\
												<columns>\
													<column/>\
													<column/>\
												</columns>\
												<rows>\
													<row align="center">\
														<checkbox id="RefChanger" label="破解(图片)反盗链" preference="RefChanger" />\
													</row>\
													<row align="center">\
														<checkbox id="UAChanger" label="自定义修改浏览器标识UserAgent" preference="UAChanger" />\
													</row>\
													<row align="center">\
														<checkbox id="SeoInfo" label="查询网站SEO信息(普通用户不推荐)" preference="SeoInfo" />\
													</row>\
													<row align="center">\
														<checkbox id="Reacquire" label="失败之后自动重获取(不推荐,可能影响效率)" preference="Reacquire" />\
													</row>\
													<row align="center">\
														<checkbox id="MyInfo" label="查询本机IP信息(不推荐,使用查询源截取更节能)" preference="MyInfo" />\
													</row>\
												</rows>\
											</grid>\
									</groupbox>\
									<groupbox>\
										<caption label="一般设置" />\
											<grid>\
												<columns>\
													<column/>\
													<column/>\
												</columns>\
												<rows>\
													<row align="center">\
														<label value="查询延时："/>\
														<textbox id="Inquiry_Delay" type="number" preference="Inquiry_Delay" tooltiptext="毫秒,延迟时间，时间内未取得所选择查询源数据，就使用备用询源,预设3500毫秒。"/>\
													</row>\
													<row align="center">\
														<label value="图标的位置：" />\
														<menulist preference="Icon_Pos" id="Icon_Pos">\
															<menupopup id="Icon_Pos_Popup">\
																<menuitem label="地址栏左边" value="0"/>\
																<menuitem label="地址栏图标" value="1"/>\
																<menuitem label="可移动按钮" value="2"/>\
															</menupopup>\
														</menulist>\
													</row>\
													<row align="center">\
														<label value="查询源选择：" />\
														<menulist preference="SourceSite" id="SourceSites"/>\
													</row>\
												</rows>\
											</grid>\
									</groupbox>\
								</row>\
							</rows>\
							<groupbox>\
								<caption label="图标库设置" />\
									<grid>\
										<columns>\
											<column/>\
											<column/>\
										</columns>\
										<rows>\
											<row align="center">\
												<label value="网络图标地址："/>\
											</row>\
											<row>\
												<textbox id="BAK_FLAG_PATH" preference="BAK_FLAG_PATH" style="width:440px" tooltiptext="http://www.1108.hk/images/ext/ \n http://www.myip.cn/images/country_icons/ 等等。"/>\
											</row>\
											<row align="center">\
												<label value="Lib国旗图标库(支持相对路径，相对于 Chrome 目录）："/>\
											</row>\
											<row>\
												<textbox id="libIconPath" preference="libIconPath" tooltiptext="如: countryflags.js、lib\\countryflags.js"/>\
												<button label="浏览" oncommand="opener.showFlagS.option_Scripts.ChouseFile(true);"/>\
											</row>\
											<row align="center">\
												<label value="本地PNG图标文件夹(支持相对路径，相对于 Chrome 目录）："/>\
											</row>\
											<row>\
												<textbox id="LocalFlags" preference="LocalFlags" tooltiptext="如:（空白）、lib\\LocalFlags"/>\
												<button label="浏览" oncommand="opener.showFlagS.option_Scripts.ChouseFile();"/>\
											</row>\
										</rows>\
									</grid>\
							</groupbox>\
						</vbox>\
						<hbox flex="1">\
							<button dlgtype="extra1" label="还原默认值" />\
							<button dlgtype="extra2" label="编辑菜单配置" />\
							<spacer flex="1" />\
							<button dlgtype="accept"/>\
							<button dlgtype="cancel"/>\
						</hbox>\
					</prefpane>\
				</prefwindow>\
            ';
            return encodeURIComponent(xul);
        },

        getData: function(path, isSave) {
            var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile),
                path = path.replace(/\//g, '\\'),
                data;
            if (/^(file:\\\\\\)/.test(path)) {
                path = path.replace(/^(file:\\\\\\)/, '');
                file.initWithPath(path);
            } else {
                if (/^(\\)/.test(path))
                    path = path.replace(/^(\\)/, "");
                file = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
                file.appendRelativePath(path);
            }
            if (isSave)
                return file;
            if (file && file.exists() && file.isFile())
                data = this.loadFile(file);
            return data;
        },

        setPerfs: function(type, val) {
            if (type == "UA") {
                var prefs = Services.prefs.getBranch("");
                if (val == 0) {
                    if (prefs.getPrefType("general.useragent.override") == 0 && prefs.getPrefType("general.platform.override") == 0) return;
                    prefs.clearUserPref("general.useragent.override");
                    prefs.clearUserPref("general.platform.override");
                    this.UAPerfAppVersion = false;
                } else {
                    prefs.setCharPref("general.useragent.override", this.UAList[val].ua);
                    this.UAPerfAppVersion = this.uaAppVersion(val);

                    var platform = this.getPlatformString(this.UAList[val].ua);
                    if (platform && platform != "")
                        prefs.setCharPref("general.platform.override", platform);
                    else
                        prefs.clearUserPref("general.platform.override");
                }
                var label = "浏览器标识(UserAgent)已切换至 [" + this.UAList[val].label + "]";
                XULBrowserWindow.statusTextField.label = label;
                this.def_uaIdx = val;
                this.uaMenuStates(val);
                return;
            }
        },

        updateFile: function() {
            if (!this.file || !this.file.exists() || !this.file.isFile()) return;

            if (this._modifiedTime != this.file.lastModifiedTime) {
                this._modifiedTime = this.file.lastModifiedTime;

                setTimeout(function() {
                    showFlagS.rebuild(true);
                }, 10);
            }
        },

        rebuild: function(isAlert) {
            this.removeMenu();
            var ErrMsg, data,
                sandbox = new Cu.Sandbox(new XPCNativeWrapper(window));

            if (this.file && this.file.exists() && this.file.isFile())
                data = this.loadFile(this.file);
            sandbox.Components = Components;
            sandbox.Cc = Cc;
            sandbox.Ci = Ci;
            sandbox.Cr = Cr;
            sandbox.Cu = Cu;
            sandbox.Services = Services;
            sandbox.locale = Services.prefs.getCharPref("general.useragent.locale");

            if (data) {
                $("showFlagS-sepalator2").hidden = false;
                try {
                    var lineFinder = new Error();
                    Cu.evalInSandbox(data, sandbox, "1.8");
                } catch (e) {
                    let line = e.lineNumber - lineFinder.lineNumber - 1;
                    ErrMsg = e + "\n请重新检查配置文件第 " + line + " 行！";
                    log(ErrMsg);
                }
            } else {
                ErrMsg = '配置文件不存在！';
                log(ErrMsg);
            }

            this.Icons = sandbox.Icons || {};
            this.TipShow = sandbox.TipShow || {};
            this.Menus = sandbox.Menus || {};
            this.ServerInfo = sandbox.ServerInfo || {};
            this.SourceAPI = sandbox.SourceAPI || {};
            this.MyInfo = sandbox.MyInfo || {};
            this.SeoInfo = sandbox.SeoInfo || {};
            this.UASites = sandbox.UASites || [];
            this.UAList = sandbox.UAList || [];
            this.RefererChange = sandbox.RefererChange || {};

            this.DEFAULT_Flag = this.Icons.DEFAULT_Flag ? this.Icons.DEFAULT_Flag : this.DEFAULT_FlagS;
            this.Unknown_Flag = this.Icons.Unknown_Flag ? this.Icons.Unknown_Flag : this.DEFAULT_Flag;
            this.File_Flag = this.Icons.File_Flag ? this.Icons.File_Flag : this.DEFAULT_Flag;
            this.Base64_Flag = this.Icons.Base64_Flag ? this.Icons.Base64_Flag : this.File_Flag;
            this.LocahHost_Flag = this.Icons.LocahHost_Flag ? this.Icons.LocahHost_Flag : this.DEFAULT_Flag;
            this.LAN_Flag = this.Icons.LAN_Flag ? this.Icons.LAN_Flag : this.DEFAULT_Flag;

            this.buildFreedomMenu(this.Menus);


            this.siteApi = this.siteRex = null;
            this.FlagApi = this.FlagRex = null;
            if (this.SourceAPI) {
                this.apiSite = this.getPrefs(2, "SourceSite", (this.SourceAPI ? (this.SourceAPI[0] ? this.SourceAPI[0].id : "") : ""));

                for (var i = 0; i < this.SourceAPI.length; i++) {
                    if (this.SourceAPI[i].isJustFlag) return;
                    if (this.SourceAPI[i].id == this.apiSite) {
                        this.siteApi = this.SourceAPI[i].inquireAPI;
                        this.siteRex = this.SourceAPI[i].regulation;
                    }
                    if (this.SourceAPI[i].isFlag) {
                        this.FlagApi = this.SourceAPI[i].inquireAPI;
                        this.FlagRex = this.SourceAPI[i].regulation;
                    }
                }
            }

            if (this.UAList) {
                this.UAList.unshift('{}');
                var tmp = {};
                tmp.label = Services.appinfo.name + Services.appinfo.version /*.split(".")[0] */ ;
                tmp.ua = "";
                tmp.image = this.Icons.DEFAULT_UA ? this.Icons.DEFAULT_UA : this.DEFAULT_Flag;
                this.UAList.unshift(tmp);

                this.buildUserAgentMenu(this.UAList);
                var UANameIdxHash = [];
                if (this.UAList.length > 2) {
                    for (let i = 0; i < this.UAList.length; i++) {
                        UANameIdxHash[this.UAList[i].label] = i;
                        if (this.UAList[i].ua == this.usingUA || this.UAList[i].ua == "")
                            this.UAPerfAppVersion = this.uaAppVersion(i);
                    }
                    for (let j = 0; j < this.UASites.length; j++) {
                        if (UANameIdxHash[this.UASites[j].label])
                            this.UASites[j].idx = UANameIdxHash[this.UASites[j].label];
                        else
                            this.UASites[j].idx = this.def_uaIdx;
                    }
                    $("showFlagS-UserAgent-config").hidden = false;
                } else {
                    this.UAState = false;
                    $("showFlagS-UserAgent-config").hidden = true;
                }
            } else {
                $("showFlagS-UserAgent-config").hidden = true;
                this.UAState = false;
            }
            this.uaMenuStates();
            this.option("Set");
            this.onLocationChange();

            if (isAlert) {
                if (!ErrMsg)
                    this.alert('配置已经重新载入！');
                else
                    this.alert("Rebuild Error: " + ErrMsg);
            }
        },

        uaMenuStates: function(idx) {
            var usingUAIdx;
            for (var j = 0; j < this.UAList.length; j++) {
                if (this.UAList[j].ua || this.UAList[j].ua == "") {
                    if (this.UAList[j].ua == this.usingUA || this.UAList[j].ua == "")
                        usingUAIdx = j;
                    $("showFlagS-UserAgent-" + j).setAttribute("style", 'font-weight: normal;');
                    $("showFlagS-UserAgent-" + j).style.color = 'black';
                }
            }
            if (idx || typeof(usingUAIdx) != 'undefined') {
                var i = idx || usingUAIdx;
                $("showFlagS-UserAgent-" + i).setAttribute("style", 'font-weight: bold;');
                $("showFlagS-UserAgent-" + i).style.color = 'brown';
                $("showFlagS-UserAgent-config").setAttribute("label", this.UAList[i].label);
                $("showFlagS-UserAgent-config").setAttribute("image", this.UAList[i].image);
                $("showFlagS-UserAgent-config").style.padding = "0px 2px";
                this.Current_idx = i;
            } else {
                $("showFlagS-UserAgent-config").setAttribute("label", "未知UserAgent");
                $("showFlagS-UserAgent-config").setAttribute("tooltiptext", this.usingUA);
                $("showFlagS-UserAgent-config").setAttribute("image", null);
            }
        },

        /*****************************************************************************************/
        PrefKey: function(subject, topic, data) {
            if (topic == 'nsPref:changed') {
                switch (data) {
                    case 'Icon_Pos':
                    case 'SourceSite':
                    case 'Inquiry_Delay':
                    case 'libIconPath':
                    case 'LocalFlags':
                    case 'BAK_FLAG_PATH':
                    case 'MyInfo':
                    case 'SeoInfo':
                    case 'Reacquire':
                    case 'RefChanger':
                    case 'UAChanger':
                        showFlagS.loadSetting(data);
                        break;
                }
            }
        },

        observe: function(subject, topic, data) {
            var http = subject.QueryInterface(Ci.nsIHttpChannel);
            if (this.UAState) {
                var ua = this.adjustUA("userAgent", http);
                if (ua) http.setRequestHeader("User-Agent", ua, false);
            }

            if (!this.RfCState) return;

            for (var s = http.URI.host; s != ""; s = s.replace(/^.*?(\.|$)/, "")) {
                if (this.adjustRef(http, s))
                    return;
            }

            if (http.referrer && http.referrer.host != http.originalURI.host)
                http.setRequestHeader('Referer', http.originalURI.spec.replace(/[^/]+$/, ''), false);
        },

        adjustUA: function(type, http) {
            var uri, val, userAgent, appVersion;
            if (type == "userAgent") {
                if (!http.URI) return;
                uri = http.URI.spec;
                for (var i = 0; i < this.UASites.length; i++) {
                    if ((new RegExp(this.UASites[i].url)).test(uri)) {
                        ua = this.UAList[this.UASites[i].idx].ua;
                        return ua;
                        break;
                    }
                }
            }
            if (type == "appVersion") {
                if (!http.location) return;
                uri = http.location.href;
                for (var i = 0; i < this.UASites.length; i++) {
                    if ((new RegExp(this.UASites[i].url)).test(uri)) {
                        appVersion = this.uaAppVersion(this.UASites[i].idx);
                        return appVersion;
                        break;
                    }
                }
            }
            return;
        },

        onDocumentCreated: function(aSubject, aTopic, aData) {
            var aChannel = aSubject.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsIDocShell).currentDocumentChannel;
            if (aChannel instanceof Ci.nsIHttpChannel) {
                var navigator = aSubject.navigator;
                try {
                    var userAgent = aChannel.getRequestHeader('User-Agent');
                } catch (e) {}
                var that = showFlagS;
                if (userAgent && navigator.userAgent != userAgent) {
                    Object.defineProperty(XPCNativeWrapper.unwrap(navigator), 'userAgent', {
                        value: userAgent,
                        enumerable: true
                    });
                    var platform = that.getPlatformString(userAgent);
                    if (platform && platform != '') {
                        Object.defineProperty(XPCNativeWrapper.unwrap(navigator), 'platform', {
                            value: platform,
                            enumerable: true
                        });
                    }
                }
                var appVersion = that.adjustUA("appVersion", aSubject);
                if (appVersion || that.UAPerfAppVersion) {
                    var appVersion = appVersion || that.UAPerfAppVersion;
                    Object.defineProperty(XPCNativeWrapper.unwrap(navigator), 'appVersion', {
                        value: appVersion,
                        enumerable: true
                    });
                }
            }
        },

        getPlatformString: function(userAgent) {
            if (!userAgent) return;
            var platform = "";
            var lowerUserAgent = userAgent.toLowerCase();
            if (lowerUserAgent.indexOf("windows") > -1) platform = "Win32";
            else if (lowerUserAgent.indexOf("android") > -1) platform = "Linux armv7l";
            else if (lowerUserAgent.indexOf("linux") > -1) platform = "Linux i686";
            else if (lowerUserAgent.indexOf("iphone") > -1) platform = "iPhone";
            else if (lowerUserAgent.indexOf("ipad") > -1) platform = "iPad";
            else if (lowerUserAgent.indexOf("mac os x") > -1) platform = "MacIntel";
            return platform;
        },

        uaAppVersion: function(idx) {
            if (!idx) return;
            var obj = this.UAList[idx],
                appVersion = false;
            if (obj.appVersion) {
                if (typeof(obj.appVersion) == 'boolean')
                    appVersion = obj.ua.replace(/^Mozilla\//, '');
                else if (typeof(obj.appVersion) == 'string')
                    appVersion = obj.appVersion;
                else appVersion = false;
            }
            return appVersion;
        },

        adjustRef: function(http, site) {
            try {
                var sRef;
                var refAction = undefined;
                for (var i in this.RefererChange) {
                    if (site.indexOf(i) != -1) {
                        refAction = this.RefererChange[i];
                        break;
                    }
                }

                if (refAction == undefined)
                    return true;
                if (refAction.charAt(0) == '@') {
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
                            break;
                    }
                } else if (refAction.length == 0) {
                    return true;
                } else {
                    sRef = refAction;
                }
                http.setRequestHeader("Referer", sRef, false);
                if (http.referrer)
                    http.referrer.spec = sRef;
                return true;
            } catch (e) {}
            return true;
        },

        /*****************************************************************************************/
        onLocationChange: function(forceRefresh) {
            var isUAChange;
            $("showFlagS-UserAgent-config").hidden = !this.UAState;
            if (this.UASites) {
                for (var i = 0; i < this.UASites.length; i++) {
                    if ((new RegExp(this.UASites[i].url)).test(this.currentURI.spec)) {
                        var idx = this.UASites[i].idx;
                        isUAChange = idx;
                        this.uaMenuStates(idx);
                    }
                }
                if (!isUAChange) this.uaMenuStates(this.def_uaIdx);
            }


            if (forceRefresh)
                this.forceRefresh = true;

            var aLocation = this.currentURI;
            try {
                if (this.Icon_Pos === 0) {
                    if ((aLocation.scheme !== "about") && (aLocation.scheme !== "chrome"))
                        $('page-proxy-favicon').style.visibility = 'collapse';
                    else
                        $('page-proxy-favicon').style.visibility = 'visible';
                    this.icon.hidden = ((aLocation.scheme == "about") || (aLocation.scheme == "chrome"));
                }
                if (aLocation && /file/.test(aLocation.scheme)) {
                    this.icon.src = this.icon.image = this.File_Flag;
                    this.icon.tooltipText = '本地文件' + "\n" + aLocation.spec;
                    return;
                }
                if (aLocation && /data/.test(aLocation.scheme)) {
                    this.icon.src = this.icon.image = this.Base64_Flag;
                    this.icon.tooltipText = 'Base64编码文件';
                    return;
                }
                if (aLocation.host && /tp/.test(aLocation.scheme)) {
                    this.updateState(aLocation);
                    return;
                }
                this.resetState();
            } catch (e) {
                this.resetState();
            }
        },

        updateState: function(aLocation) {
            var host = aLocation.host;
            if (!this.forceRefresh && this.dnsCache[host]) {
                this.lookup(this.dnsCache[host], host);
                return;
            }
            if (host == "127.0.0.1" || host == "localhost") {
                this.lookup_Local("host", host);
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
                    showFlagS.lookup(s_ip, host);
                }
            };
            try {
                this.dns.asyncResolve(host, 0, dns_listener, this.eventqueue);
            } catch (e) {}
            this.resetState();
        },

        resetState: function() {
            this.icon.src = this.icon.image = this.DEFAULT_Flag;
            this.icon.tooltipText = '';
            if (this.Icon_Pos === 0) {
                this.icon.hidden = true;
                $('page-proxy-favicon').style.visibility = 'visible';
            }
        },

        /*****************************************************************************************/
        lookup: function(ip, host) {
            var url, obj = {};
            if (/^192.168.|169.254./.test(ip) || ip == "127.0.0.1" || ip == "::1") {
                this.lookup_Local("IP", host, ip);
                return;
            }

            var url;
            if (window.content)
                url = window.content.document.URL;
            else
                url = gBrowser.selectedBrowser.contentDocumentAsCPOW.URL;

            if (ip == "0" || /^(about:neterror)/.test(url)) {
                if (ip == "0") {
                    this.showFlagHash[host] = 'UnknownFlag';
                    this.updateIcon(host, this.showFlagHash[host]);
                } else this.lookup_Flag(!this.forceRefresh, ip, host);

                if (url) {
                    obj.SiteInfo = '错误类型：' + url.substring(url.indexOf("=") + 1, url.indexOf("&")) + '\n' + '详细描述：' + decodeURI(url.substring(url.lastIndexOf("=") + 1));
                } else {
                    obj.SiteInfo = '页面载入错误';
                }

                this.showFlagTooltipHash[host] = obj;
                this.updateTooltipText(ip, host, this.showFlagTooltipHash[host]);
                return;
            }

            this.lookup_Flag(!this.forceRefresh, ip, host);
            this.lookup_Tooltip(!this.forceRefresh, ip, host);
            this.forceRefresh = false;
        },

        lookup_Local: function(type, host, ip) {
            var src = this.LocahHost_Flag,
                obj = {};
            obj.ServerInfo = this.lookupIP_ServerInfo();

            if (type == "host") {
                obj.SiteInfo = '回送地址:本机服务器';
                this.updateTooltipText("127.0.0.1", host, obj);
            }

            if (type == "IP") {
                if (/^192.168.|169.254./.test(ip)) {
                    src = this.LAN_Flag;
                    obj.SiteInfo = '本地局域网服务器';
                } else {
                    obj.SiteInfo = '回送地址：本机[服务器]';
                }
                this.showFlagTooltipHash[host] = obj;
                this.updateTooltipText(ip, host, obj);
            }
            this.icon.src = this.icon.image = src;
            this.icon.hidden = false;
            if (this.Icon_Pos === 0) {
                if (this.currentURI.scheme !== 'https')
                    $('page-proxy-favicon').style.visibility = 'collapse';
                else
                    $('page-proxy-favicon').style.visibility = 'visible';
            }
        },

        lookup_Flag: function(checkCache, ip, host) {
            if (checkCache && this.showFlagHash[host]) {
                if (this.showFlagHash[host] == 'UnknownFlag' && this.isReacquire)
                    this.isReqHash[host] = false;
                else {
                    this.updateIcon(host, this.showFlagHash[host]);
                    return;
                }
            }
            if (checkCache && this.isReqHash[host]) return;
            this.isReqHash[host] = true;
            if (this.FlagApi == this.siteApi) return;
            if (this.FlagApi)
                this.lookupIP_Flag(ip, host, this.FlagApi, this.FlagRex);
            else
                this.lookupIP_taobao(ip, host, null, "Flag");
        },

        lookup_Tooltip: function(checkCache, ip, host) {
            var self = showFlagS;
            if (checkCache && this.showFlagTooltipHash[host]) {
                if (this.showFlagTooltipHash[host].UnknownFlag && this.isReacquire)
                    this.isReqHash_tooltip[host] = false;
                else {
                    this.updateTooltipText(ip, host, this.showFlagTooltipHash[host]);
                    return;
                }
            }
            if (checkCache && this.isReqHash_tooltip[host]) return;
            this.isReqHash_tooltip[host] = true;
            var obj = {};

            obj.ServerInfo = this.lookupIP_ServerInfo();
            this.showFlagTooltipHash[host] = obj;
            this.updateTooltipText(ip, host, obj);

            function SiteInfo(SiteInfo, Thx, UnknownFlag) {
                obj.SiteInfo = SiteInfo;
                obj.SiteInfoThx = Thx;
                obj.UnknownFlag = UnknownFlag;
                self.showFlagTooltipHash[host] = obj;
                self.updateTooltipText(ip, host, obj);
            }

            if (this.siteApi)
                this.lookupIP_SiteInfo(ip, host, this.siteApi, this.siteRex, SiteInfo);
            else
                this.lookupIP_taobao(ip, host, SiteInfo, "All");

            if (this.isMyInfo && this.MyInfo.inquireAPI) {
                function MyInfo(MyInfo, Thx) {
                    obj.MyInfo = MyInfo;
                    obj.MyInfoThx = Thx;
                    self.showFlagTooltipHash[host] = obj;
                    self.updateTooltipText(ip, host, obj);
                }
                this.lookupIP_Myinfo(this.MyInfo.inquireAPI, host, MyInfo);
            }

            if (this.isSeoInfo && this.SeoInfo.inquireAPI) {
                function SeoInfo(SeoInfo, Thx) {
                    obj.SeoInfo = SeoInfo;
                    obj.SeoInfoThx = Thx;
                    self.showFlagTooltipHash[host] = obj;
                    self.updateTooltipText(ip, host, obj);
                }
                this.lookupIP_SeoInfo(this.SeoInfo.inquireAPI, host, SeoInfo);
            }
        },

        updateIcon: function(host, countryCode, countryName) {
            try {
                var currentURIhost = this.currentURI.host;
            } catch (e) {}
            if (!currentURIhost || host != currentURIhost) return this.resetState('Flags');

            this.icon.hidden = false;
            var src;
            if (countryCode === 'iana' || countryCode === 'UnknownFlag') {
                src = this.Unknown_Flag;
            } else {
                src = this.CountryFlags ? (this.getFlagFoxIconPath(countryCode) || this.CountryFlags[countryCode]) : this.getFlagFoxIconPath(countryCode);
                if (!src && this.CountryFlags && countryName) {
                    contryCode = this.CountryNames && this.CountryNames[countryName];
                    if (contryCode in this.CountryFlags) {
                        src = this.CountryFlags[contryCode];
                        this.showFlagHash[host] = contryCode;
                    }
                }
                src = src || (this.BAK_FLAG_PATH + countryCode + ".gif") || this.Unknown_Flag;

            }
            this.icon.src = this.icon.image = src;
            if (this.Icon_Pos === 0) {
                if (this.currentURI.scheme !== 'https')
                    $('page-proxy-favicon').style.visibility = 'collapse';
                else
                    $('page-proxy-favicon').style.visibility = 'visible';
                if (src) $('page-proxy-favicon').style.visibility = 'collapse';
                else this.icon.hidden = true;
            }
        },

        updateTooltipText: function(ip, host, obj) {
            try {
                var currentURIhost = this.currentURI.host;
            } catch (e) {}
            if (!currentURIhost || host != currentURIhost) return this.resetState('Flags');

            var TipShow = this.TipShow ? this.TipShow : {};

            var tipArrHost = TipShow.tipArrHost ? TipShow.tipArrHost : "Host：",
                tipArrIP = TipShow.tipArrIP ? TipShow.tipArrIP : "IP：",
                tipArrSep0 = TipShow.tipArrSep0 ? TipShow.tipArrSep0 : "",
                //服务器信息	ServerInfo
                tipArrSep1 = TipShow.tipArrSep1 ? TipShow.tipArrSep1 : "",
                //网站IP信息
                tipArrSep2 = TipShow.tipArrSep2 ? TipShow.tipArrSep2 : "",
                //我的信息	MyInfo
                tipArrSep3 = TipShow.tipArrSep3 ? TipShow.tipArrSep3 : "",
                //网站SEO信息 SeoInfo
                tipArrSep4 = TipShow.tipArrSep4 ? TipShow.tipArrSep4 : "",
                tipArrThanks = TipShow.tipArrThanks ? TipShow.tipArrThanks : "Thk：";

            var tooltipArr = [];
            obj || (obj = {});
            if (this.showFlagHash[host] && !obj.UnknownFlag && this.showFlagHash[host] !== 'UnknownFlag')
                obj.FlagThx = this.Thx(this.FlagApi) || this.Thx("http://ip.taobao.com/service/getIpInfo.php?ip=");

            if (obj.UnknownFlag && obj.UnknownFlag !== "") {
                tooltipArr.push(obj.UnknownFlag);
                tooltipArr.push(tipArrSep3);
            }

            tooltipArr.push(tipArrHost + host);
            tooltipArr.push(tipArrIP + ip);


            if (obj.ServerInfo && obj.ServerInfo !== "") {
                if (tipArrSep0) tooltipArr.push(tipArrSep0);
                tooltipArr.push(obj.ServerInfo);
            }


            if (obj.SiteInfo && obj.SiteInfo !== "") {
                if (tipArrSep1) tooltipArr.push(tipArrSep1);
                tooltipArr.push(obj.SiteInfo);
            }

            if (this.MyInfo && this.isMyInfo && obj.MyInfo) {
                if (tipArrSep2) tooltipArr.push(tipArrSep2);
                tooltipArr.push(obj.MyInfo);
            }

            if (this.SeoInfo && this.isSeoInfo && obj.SeoInfo) {
                if (tipArrSep3) tooltipArr.push(tipArrSep3);
                tooltipArr.push(obj.SeoInfo);
            }

            var thx = [];
            if (obj.SiteInfoThx)
                thx.push(obj.SiteInfoThx)
            if (obj.FlagThx && obj.FlagThx !== obj.SiteInfoThx)
                thx.push(obj.FlagThx)
            if (obj.MyInfoThx && obj.MyInfoThx !== obj.SiteInfoThx)
                thx.push(obj.MyInfoThx)
            if (obj.SeoInfoThx && obj.SeoInfoThx !== obj.SiteInfoThx)
                thx.push(obj.SeoInfoThx)
            if (thx.join('\n') !== "") {
                if (tipArrSep4) tooltipArr.push(tipArrSep4);
                tooltipArr.push(tipArrThanks + new String(thx));
            }

            this.icon.tooltipText = tooltipArr.join('\n');
        },

        /*****************************************************************************************/
        lookupIP_Myinfo: function(api, host, callback) {
            var self = showFlagS;

            var req = new XMLHttpRequest();
            req.open("GET", api, true);
            req.send(null);
            var onerror = function() {
                callback(null, null);
            };
            req.onerror = onerror;
            req.timeout = self.Inquiry_Delay;
            req.ontimeout = onerror;
            req.onload = function() {
                if (req.status == 200) {
                    var MyInfo = self.MyInfo.regulation(req.responseText);
                    if (MyInfo) {
                        callback(MyInfo, self.Thx(api));
                    } else {
                        onerror();
                    }
                } else {
                    onerror();
                }
            };
        },

        lookupIP_SeoInfo: function(api, host, callback) {
            var self = showFlagS;
            var obj = {};
            var req = new XMLHttpRequest();
            req.open("GET", api + host, true);
            req.send(null);
            var onerror = function() {
                callback(null, null);
            };
            req.onerror = onerror;
            req.timeout = self.Inquiry_Delay;
            req.ontimeout = onerror;
            req.onload = function() {
                if (req.status == 200) {
                    var SeoInfo = self.SeoInfo.regulation(req.responseText);
                    if (SeoInfo) {
                        callback(SeoInfo, self.Thx(api));
                    } else {
                        onerror();
                    }
                } else {
                    onerror();
                }
            };
        },

        lookupIP_SiteInfo: function(ip, host, api, rex, callback) {
            var self = showFlagS;
            var req = new XMLHttpRequest();
            req.open("GET", api + ip, true);
            req.send(null);
            var onerror = function() {
                if (self.FlagApi == api)
                    self.lookupIP_taobao(ip, host, callback, "All");
                else
                    self.lookupIP_taobao(ip, host, callback, "Tip");
            };
            req.onerror = onerror;
            req.timeout = self.Inquiry_Delay;
            req.ontimeout = onerror;
            req.onload = function() {
                if (req.status == 200) {
                    var info = rex(req.responseText);
                    if (info) {
                        if (self.FlagApi == api) {
                            self.showFlagHash[host] = info.countryCode || null;
                            self.updateIcon(host, info.countryCode, info.countryName);
                        }
                        callback(info.SiteInfo, self.Thx(api));
                    } else {
                        onerror();
                    }
                } else {
                    onerror();
                }
            };
        },

        lookupIP_Flag: function(ip, host, api, rex) {
            var self = showFlagS;
            var req = new XMLHttpRequest();
            req.open("GET", api + ip, true);
            req.send(null);
            var onerror = function() {
                self.lookupIP_taobao(ip, host, null, "Flag");
            };
            req.onerror = onerror;
            req.timeout = self.Inquiry_Delay;
            req.ontimeout = onerror;
            req.onload = function() {
                if (req.status == 200) {
                    var info = rex(req.responseText);
                    if (info) {
                        self.showFlagHash[host] = info.countryCode;
                        self.updateIcon(host, info.countryCode, info.countryName);
                    } else {
                        onerror();
                    }
                } else {
                    onerror();
                }
            };
        },

        lookupIP_taobao: function(ip, host, callback, other) {
            var self = showFlagS;
            var api = 'http://ip.taobao.com/service/getIpInfo.php?ip=';
            var req = new XMLHttpRequest();
            req.open("GET", api + ip, true);
            req.send(null);
            var onerror = function() {
                self.showFlagHash[host] = 'UnknownFlag';
                self.updateIcon(host, self.showFlagHash[host]);
                if (callback) callback(null, null, '无法获取国家代码，请刷新！');
            };
            req.onerror = onerror;
            req.timeout = self.Inquiry_Delay;
            req.ontimeout = onerror;
            req.onload = function() {
                if (req.status == 200) {
                    var responseObj = JSON.parse(req.responseText);
                    if (responseObj.code == 0) {
                        var country_id = responseObj.data.country_id.toLocaleLowerCase();
                        var addr = responseObj.data.country + responseObj.data.area;
                        if (responseObj.data.region || responseObj.data.city || responseObj.data.county || responseObj.data.isp)
                            addr = addr + '\n' + responseObj.data.region + responseObj.data.city + responseObj.data.county + responseObj.data.isp;
                        if (other == "Flag" || other == "All") {
                            self.showFlagHash[host] = country_id;
                            self.updateIcon(host, country_id, responseObj.data.country);
                        }
                        if (other == "Tip" || other == "All")
                            if (callback) callback(addr, self.Thx(api));
                    } else {
                        onerror();
                    }
                }
            };
        },

        lookupIP_ServerInfo: function() {
            if (!this.ServerInfo) return;
            var sTip = [];
            for (var i = 0; i < this.ServerInfo.length; i++) {
                var tip = this.getServInformation(this.ServerInfo[i].words);
                if (this.ServerInfo[i].regx) tip = this.ServerInfo[i].regx(tip);

                if (tip)
                    sTip.push(this.ServerInfo[i].label + tip);
            }
            return sTip.join('\n');
        },

        /*****************************************************************************************/
        getServInformation: function(words) {
            var word;
            try {
                word = gBrowser.mCurrentBrowser.webNavigation.currentDocumentChannel.QueryInterface(Ci.nsIHttpChannel).getResponseHeader(words).split("\n", 1)[0];
            } catch (e) {}
            return word || null;
        },

        getFlagFoxIconPath: function(filename) {
            var file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile),
                path = this.LocalFlags.replace(/\//g, '\\');
            if (/^(file:\\\\\\)/.test(path)) {
                path = path.replace(/^(file:\\\\\\)/, '');
                console.log(path);
                file.initWithPath(path + filename + ".png");
            } else {
                if (/^(\\)/.test(path))
                    path = path.replace(/^(\\)/, "");
                if (!/(\\)$/.test(path))
                    path = path + '\\';
                file = Services.dirsvc.get("UChrm", Ci.nsILocalFile);
                file.appendRelativePath(path);
                file.appendRelativePath(filename + ".png");
            }
            if (file.exists()) return "file:///" + file.path;
        },

        Thx: function(api) {
            if (!api) return;
            var Service = Cc["@mozilla.org/network/effective-tld-service;1"].getService(Ci.nsIEffectiveTLDService);
            var uri = makeURI(api);
            var thx = Service.getBaseDomain(uri).replace(Service.getPublicSuffix(uri), "").replace('.', "");
            return thx || null;
        },

        /*****************************************************************************************/
        command: function(type, url, arg0, arg1, arg2, arg3, arg4) {
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
            if (!str) str = this.icon.tooltipText;
            Cc['@mozilla.org/widget/clipboardhelper;1'].createInstance(Ci.nsIClipboardHelper).copyString(str);
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
            var uri = this.currentURI,
                ip = this.dnsCache[uri.host];

            if (str == 'host')
                str = uri.host;

            if (str == 'ip' && ip)
                str = ip;

            if (str == "basedomain") {
                var eTLDService = Components.classes["@mozilla.org/network/effective-tld-service;1"].
                getService(Components.interfaces.nsIEffectiveTLDService);
                var basedomain = eTLDService.getBaseDomain(makeURI(uri.spec));
                str = basedomain;
            }

            if (str == 'url')
                str = uri.spec;

            return str;
        },

        editFile: function(aFile, aLineNumber) {
            if (!aFile)
                aFile = this.file;

            if (typeof(aFile) == "string") {
                var file = Cc['@mozilla.org/file/local;1'].createInstance(Ci.nsILocalFile);
                var process = Cc['@mozilla.org/process/util;1'].createInstance(Ci.nsIProcess);
                aFile = file.initWithPath(aFile);
            }

            if (!aFile || !aFile.exists() || !aFile.isFile())
                return alert("文件不存在:\n" + aFile.path);

            var editor;
            try {
                editor = Services.prefs.getComplexValue("view_source.editor.path", Ci.nsILocalFile);
            } catch (e) {
                alert("请先设置编辑器的路径!!!\nview_source.editor.path");
            }

            if (!editor || !editor.exists()) {
                this.openScriptInScratchpad(window, aFile);
                return;
            }
            var aURL = userChrome.getURLSpecFromFile(aFile);
            var aDocument = null;
            var aCallBack = null;
            var aPageDescriptor = null;
            if (/aLineNumber/.test(gViewSourceUtils.openInExternalEditor.toSource()))
                gViewSourceUtils.openInExternalEditor(aURL, aPageDescriptor, aDocument, aLineNumber, aCallBack);
            else
                gViewSourceUtils.openInExternalEditor(aURL, aPageDescriptor, aDocument, aCallBack);
        },

        openScriptInScratchpad: function(parentWindow, file) {
            let spWin = (parentWindow.Scratchpad || Services.wm.getMostRecentWindow("navigator:browser").Scratchpad)
                .openScratchpad();

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
        /*****************************************************************************************/
        SetIcon: function(isAlert) {
            var icon = $("showFlagS-icon");
            if (icon) icon.parentNode.removeChild(icon);
            delete icon;
            if (this.Icon_Pos === 0)
                $("page-proxy-favicon").style.visibility = this.PPFaviconVisibility;
            if (!isAlert) return;

            var IconType = 'toolbarbutton',
                IconClass = 'toolbarbutton-1 chromeclass-toolbar-additional';
            if (this.IconSstatusBarPanel) {
                IconType = 'statusbarpanel';
                IconClass = 'statusbarpanel-iconic';
            }

            this.icon = $C(IconType, {
                id: "showFlagS-icon",
                class: IconClass,
                type: "menu",
                onclick: "showFlagS.IconClick(event);",
            });

            if (this.Icon_Pos === 0)
                $('identity-box').appendChild(this.icon);
            else if (this.Icon_Pos === 1)
                $('urlbar-icons').appendChild(this.icon);
            else if (this.Icon_Pos === 2)
                ToolbarManager.addWidget(window, this.icon, true);

            this.icon.appendChild(this.Popup);

            this.style = addStyle(CSS);
        },

        IconClick: function(e) {
            if (e.target != e.currentTarget) return;
            e.stopPropagation();
            e.preventDefault();
            if (e.button == 0)
                showFlagS.command('Copy');
            else if (e.button == 1)
                showFlagS.onLocationChange('Flags');
            if (e.button == 2)
                $("showFlagS-popup").showPopup();
        },

        buildUserAgentMenu: function(UAList) {
            if (!UAList) return;
            var menu = $("showFlagS-UserAgent-popup"),
                menuitem;
            for (var i = 0; i < UAList.length; i++) {
                if (UAList[i].label === "separator" || (!UAList[i].label && !UAList[i].id && !UAList[i].ua))
                    menuitem = menu.appendChild($C("menuseparator", {
                        id: "showFlagS-UserAgent-" + i,
                        class: "showFlagS-UserAgent-menuseparator",
                    }));
                else {
                    menuitem = menu.appendChild($C("menuitem", {
                        label: UAList[i].label,
                        id: "showFlagS-UserAgent-" + i,
                        class: "showFlagS-UserAgent-item",
                        image: UAList[i].image,
                        tooltiptext: UAList[i].ua,
                        oncommand: "showFlagS.setPerfs('UA','" + i + "');"
                    }));

                    var cls = menuitem.classList;
                    cls.add("showFlagS");
                    cls.add("menuitem-iconic");
                }
                //menu.insertBefore(menuitem, $("showFlagS-sepalator3"));
                menu.appendChild(menuitem);
            };
        },

        buildFreedomMenu: function(menu) {
            if (!menu) return;
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

            if (!obj.label)
                obj.label = obj.exec || obj.text || "NoName" + i;

            if (obj.exec)
                obj.exec = this.handleRelativePath(obj.exec);

            for (let [key, val] in Iterator(obj)) {
                if (typeof val == "function") obj[key] = val = "(" + val.toSource() + ").call(this, event);";
                menuitem.setAttribute(key, val);
                menuitem.setAttribute("id", "showFlagS-item-" + i);
            }
            var cls = menuitem.classList;
            cls.add("showFlagS");
            cls.add("menuitem-iconic");

            if (obj.oncommand || obj.command) return menuitem;

            menuitem.setAttribute("oncommand", "showFlagS.onCommand(event);");
            this.setMenusIcon(menuitem, obj);
            return menuitem;
        },

        setMenusIcon: function(menu, obj) {
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
                var a;
                if (typeof arg == 'string' || arg instanceof String) {
                    a = arg.split(/\s+/)
                } else if (Array.isArray(arg)) {
                    a = arg;
                } else {
                    a = [arg];
                }

                file.initWithPath(path);
                if (!file.exists()) {
                    Cu.reportError('File Not Found: ' + path);
                    return;
                }

                if (file.isExecutable()) {
                    process.init(file);
                    process.runw(false, a, a.length);
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
        },

        /*****************************************************************************************/
        alert: function(aString, aTitle) {
            Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService).showAlertNotification("", aTitle || "showFlagS", aString, false, "", null);
        },

        loadFile: function(aFile) {
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
        },

        getWindow: function(num) {
            var windowsMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                .getService(Components.interfaces.nsIWindowMediator);
            if (num === 0)
                return windowsMediator.getMostRecentWindow("showFlagS:Preferences");
        },

        option_Scripts: {
            UChrm: Services.dirsvc.get("UChrm", Ci.nsILocalFile),
            init: function() {
                if (!window.Services) Cu.import("resource://gre/modules/Services.jsm");
                var menu = _$("SourceSites"),
                    siteSource = showFlagS.SourceAPI;
                for (i in siteSource) {
                    if (!siteSource[i].isJustFlag) {
                        menu.appendItem(siteSource[i].label, siteSource[i].id);
                    }
                }
                var isDisable = !showFlagS.file;
                _$("RefChanger").disabled = isDisable;
                _$("UAChanger").disabled = isDisable;
                _$("SeoInfo").disabled = isDisable;
                _$("Reacquire").disabled = isDisable;
                _$("MyInfo").disabled = isDisable;
                _$("MyInfo").disabled = isDisable;
                _$("SourceSites").value = showFlagS.apiSite;
            },

            reset: function() {
                _$("Icon_Pos").value = 0;
                _$("IconSstatusBarPanel").value = false;
                _$("Inquiry_Delay").value = 3500;
                _$("libIconPath").value = showFlagS.DlibIconPath;
                _$("LocalFlags").value = showFlagS.DLocalFlags;
                _$("BAK_FLAG_PATH").value = showFlagS.DBAK_FLAG_PATH;
                _$("SourceSite").value = showFlagS.SourceAPI ? (showFlagS.SourceAPI[0] ? showFlagS.SourceAPI[0].id : "") : "";
                _$("MyInfo").value = false;
                _$("Reacquire").value = false;
                _$("SeoInfo").value = false;
                _$("RefChanger").value = false;
                _$("UAChanger").value = false;
            },

            ChouseFile: function(type) {
                var tag;
                if (type) {
                    tag = _$("libIconPath");
                } else {
                    tag = _$("LocalFlags");
                }
                if (!tag) return;
                let path = this._getPath(type);
                if (path) {
                    tag.value = decodeURIComponent(path);
                }
            },

            pathC: function(path) {
                if (/^(file:\/\/\/)/.test(path)) {
                    path = decodeURIComponent(path);
                    path = path.replace(/^(file:\/\/\/)/ig, "");
                    path = path.replace(/\//ig, "\\");
                }
                return path;
            },

            _getPath: function(type) {
                let fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
                let parentWindow = window;
                fp.displayDirectory = this.UChrm;
                if (type) {
                    let title = "选择Lib国旗图标库文件";
                    let mode = fp.modeOpen;
                    fp.init(parentWindow, title, mode);
                    fp.appendFilter("javascript", "*.js");
                } else {
                    let title = "选择本地PNG图标文件夹";
                    let mode = Components.interfaces.nsIFilePicker.modeGetFolder;
                    fp.init(parentWindow, title, mode);
                }
                if (fp.show() != fp.returnCancel) {
                    return fp.fileURL.spec;
                }
                return null;
            },
        },

    };

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

    function _$(id) {
        return showFlagS.getWindow(0).document.getElementById(id);
    }

    function log(str) {
        if (showFlagS.debug) Application.console.log("[showFlagS] " + Array.slice(arguments));
    }

    function addStyle(css) {
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        return document.insertBefore(pi, document.documentElement);
    }

    function $(id) document.getElementById(id);

    function $C(name, attr) {
        var el = document.createElement(name);
        if (attr) Object.keys(attr).forEach(function(n) el.setAttribute(n, attr[n]));
        return el;
    }

    showFlagS.init();
    window.showFlagS = showFlagS;
})('\
#showFlagS-icon dropmarker {\
    display: none;\
}\
'.replace(/\n|\t/g, ''));
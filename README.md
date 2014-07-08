userChromeJS
============
一些修改、原创的自用脚本,可能包含个人使用习惯。

####bookmarkallmod.uc.js
退出浏览器的时候保存所有未关闭的页面为书签<br /> 
可以自定义保存位置(书签工具栏/书签菜单)，保存目录等<br /> 
但设置了保存次数之后，达到数量会自动删除较早的条目。

####bookmarkBtn.uc.js
可移动书签菜单按钮<br /> 
方便FF23以下版本和UX版本。

####starClickMod.uc.js
多功能收藏按钮，支持UX版Fireofx<br /> 
单击收藏按钮自动弹出书签编辑面板<br /> 
自动获取上次使用的文件夹并选中<br /> 
书签编辑面板自动展开文件夹选择面板<br /> 
书签编辑面板增加关键字、标签、侧边栏打开等<br /> 
右键单击收藏按钮从收藏中删除当前页面。

####StarUrlicon.uc.js
新版UI移动整个书签按钮到地址栏。<br /> 
添加右键 显示/隐藏 书签侧栏，中键删除当前页面书签。<br /> 
推荐和bookmarkBtn.uc.js同时使用，并使用CSS。

		#bookmarks-menu-button > dropmarker {display: none !important;}

####NoShowBorder.uc.js
FF去边框，延迟生效，新版UI适用。<br /> 
定制动作之后再次生效。

####AwesomeBookmarkbar.uc.js
点击地址栏显示书签工具栏。<br /> 
地址栏任意按键，地址栏失去焦点后自动隐藏书签工具栏。<br /> 
左键点击书签后自动隐藏书签工具栏。

####UserScriptLoaderPlus.uc.js
ywzhaiqi的修改版 https://github.com/ywzhaiqi/userChromeJS/tree/master/UserScriptLoaderPlus<br /> 
修改为所有脚本的配置都保存在json文件内。

####UserCSSLoader.uc.js
增加重载userChrome.css和重载userContent.css。<br /> 

####javascriptUrl.uc.js
地址栏执行“Javascript:”。
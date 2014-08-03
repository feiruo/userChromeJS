userChromeJS
============
####一些修改、原创的自用脚本,可能包含个人使用习惯。
#####AwesomeBookmarkbar.uc.js
- 点击地址栏显示书签工具栏；
- 鼠标移到地址栏自动显示书签工具栏，移出隐藏；
- 地址栏任意按键，地址栏失去焦点后自动隐藏书签工具栏；
- 左键点击书签后自动隐藏书签工具栏。

#####bookmarkallmod.uc.js
- 退出浏览器的时候保存所有未关闭的页面为书签；
- 可以自定义保存位置(书签工具栏/书签菜单)，保存目录等；
- 但设置了保存次数之后，达到数量会自动删除较早的条目。

#####bookmarkBtn.uc.js
- 可移动书签菜单按钮；
- 方便FF23以下版本和UX版本。

#####NoShowBorder.uc.js
- FF去边框。

#####starClickMod.uc.js
- 多功能收藏按钮，支持UX版Fireofx；
- 单击收藏按钮自动弹出书签编辑面板；
- 自动获取上次使用的文件夹并选中；
- 书签编辑面板自动展开文件夹选择面板；
- 书签编辑面板增加关键字、标签、侧边栏打开等；
- 右键单击收藏按钮从收藏中删除当前页面。

#####StarUrlicon.uc.js
- 新版UI移动整个书签按钮到地址栏；
- 添加右键 显示/隐藏 书签侧栏，中键删除当前页面书签；
- 推荐和bookmarkBtn.uc.js同时使用，并使用CSS：

		#bookmarks-menu-button > dropmarker {display: none !important;}
		
#####TabPlus.uc.js
- 标签管理，新标签打开（智能利用空白标签）：
1. 地址栏新标签打开
2. 新标签打开书签，历史和搜索栏
3. 左键双击标签关闭
4. 滚轮切换标签
5. 标签上点击鼠标右键关闭标签
6. 标签栏空白部分中键恢复关闭的标签
7. 中键锁定标签
8. 双击标签刷新
9. 未加载标签上双击刷新
10. 紧邻当前标签新建标签页
11. 关闭标签聚焦左侧标签
- 不需要的功能请自行注释掉。


#####UserCSSLoader.uc.js
- 增加暂时的启用停用；
- 增加简单在样式站安装功能；
- 增加重载userChrome.css和重载userContent.css。

#####UserScriptLoaderPlus.uc.js
- ywzhaiqi的修改版 https://github.com/ywzhaiqi/userChromeJS/tree/master/UserScriptLoaderPlus 
- 修改为所有脚本的配置都保存在json文件内。


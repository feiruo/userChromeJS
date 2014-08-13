showFlagS
============
 - author：ywzhaiqi、feiruo。
 - 参考 Show Location 扩展、Flagfox 扩展、http://files.cnblogs.com/ziyunfei/showFlag.uc.js 。
 - 显示网站IP地址和国旗，帮助识别网站真实性。
 - 国旗图标左键复制内容，中键刷新，右键弹出菜单。
 - 位置为identity-box时,https,about和chrome页面，隐藏脚本图标，还原identity-box显示。
 - 右键菜单外部配置，配置方式和功能都与anoBtn一样，具体请参考配置文件。
 - 更多的网站详细信息，支持自定义定制，具体可在查看配置文件。
 - 多个查询地址，可以再配置文件根据网络情况等自行定制。
 - 其他更多自定义设置，请参考配置文件。
 - 模拟提交（感谢FlagFox!!），可以参考与FlagFox,不过FlagFox只能识别提交按钮的ID，本脚本增加按钮class类名识别。

 		(具体使用请参考：http://bbs.kafan.cn/thread-1701286-1-1.html)
 - 本地国旗图标库

 		Chrome\lib\LocalFlags 	
 - 菜单配置文件和本地数据库位置：

		Chrome\lib\_showFlagS.js  \\菜单和脚本配置文件
		Chrome\lib\countryflags.js  \\本地数据库
 - 可以使用本地国旗图标，可以自定义，也可以使用以下样式：
1. ![](FlagFoxFlags24x16.png)FlagFoxFlags24x16 
2. ![](FlagFoxFlags原版.png)FlagFoxFlags原版
3. ![](WorldIPFlags1.png)WorldIPFlags1 
4. ![](WorldIPFlags2.png)WorldIPFlags2 
    
注意：
--------------

- 文如果使用faviconContextMenu，请在图标外面右键，图标上面右键是本脚本的菜单。
- 如果有特殊需要显示 网站标识(page-proxy-favicon)的，请添加以下样式：

		#page-proxy-favicon{visibility: visible !important;}

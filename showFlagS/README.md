showFlagS
============
 - author：ywzhaiqi、feiruo。
 - 参考 Show Location 扩展、Flagfox 扩展、http://files.cnblogs.com/ziyunfei/showFlag.uc.js 。
 - 显示网站IP地址和国旗，帮助识别网站真实性。
 - 右键菜单外部配置，配置方式和功能都与anoBtn一样，具体请参考配置文件。
 - 更多的网站详细信息；服务器没给出的就不显示，具体显示条目可在配置文件设置。
 - 位置为identity-box时,https,about和chrome页面，隐藏脚本图标，还原identity-box显示。
 - 自定义延迟，时间内未取得所选择查询源数据，就使用备用查询源，可以在脚本里面设置。
 - 可选择查询地址，在配置文件里面添加。
 - 国旗图标左键复制内容，中键刷新，右键弹出菜单。
 - 模拟提交（感谢FlagFox!!），可以参考与FlagFox,不过FlagFox只能识别提交按钮的ID，本脚本增加按钮class类名识别。

 		(具体使用请参考：http://bbs.kafan.cn/thread-1701286-1-1.html)
 - 本地国旗图有以下样式：
1. ![](FlagFoxFlags24x16.png)FlagFoxFlags24x16 
2. ![](FlagFoxFlags原版.png)FlagFoxFlags原版
3. ![](WorldIPFlags1.png)WorldIPFlags1 
4. ![](WorldIPFlags2.png)WorldIPFlags2 
 - 本地国旗图标库

 		Chrome\lib\LocalFlags 	
 - 菜单配置文件和本地数据库位置：

		Chrome\lib\_showFlagS.js  \\菜单和脚本配置文件
		Chrome\lib\countryflags.js  \\本地数据库
    
    
注意：
--------------

- 文如果使用faviconContextMenu，请在图标外面右键，图标上面右键是本脚本的菜单。
- 如果有特殊需要显示 网站标识(page-proxy-favicon)的，请添加以下样式：

		#page-proxy-favicon{visibility: visible !important;}

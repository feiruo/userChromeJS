/******************************************************************************************
这里是菜单配置:
配置与addmenu一样，但仅支持本脚本菜单位置，具体请参照；https://github.com/ywzhaiqi/userChromeJS/tree/master/addmenuPlus
本脚本参数增加:
%IP%：当域名IP地址
%BASEDOMAIN%：当前域名的主域名；
{}：为分隔条
=======================
目录枚举添加请注意：
1、斜杠"/"或"\"开头为相对配置文件夹，注意：Linux路径区分大小写！！！！
2、根据文件名全名字符(包括扩展名)排除或筛选;
3、关系为：先排除再枚举。
4、注意：配对模式为 test循环模式正则！！！注意正则全局"g"的使用！！test()继承正则表达式的lastIndex属性，表达式在匹配全局标志g的时候须注意。
5、留空表示不进行该行为。
6、在文件夹上左键点击为打开文件夹
示例：
{
	label: "菜单显示名称",
	image: "图标",

	//枚举文件夹内的所有文件。注意：Linux路径区分大小写！！！！
	MapFolder: '/chrome/tools',

	//排除的文件，需要注意:此处不使用"g"全局模式，可以匹配所有文件,
	Exclude: /\.(dat|reg|sample|config|db|log|dll|json|zip|rar|ini)$|7za\.exe/i,

	//枚举的文件
	Filter: /\.(exe|lnk|bat)$/i,

	//是否枚举子目录内的文件，值代表子目录深度，多少级的子目录，0为根目录（即不枚举子目录）
	Directories: 1,

	//排除目录,仅当Dirs>1时生效。
	ExcludeDirs: /tmp|temp/i,

	//枚举目录,仅当Dirs>1时生效。留空表示不筛选
	FilterDirs: "",
},
*******************************************************************************************/
var Menus = [ //菜单设置
	{
		label: "外部程序",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAbklEQVQ4je3TXwqAIAzAYe+VsP32pvc/QuQx7KmIAm39eYkGwz3IB24zhCdDRBIwmVn1JDCJSFqhK8gWW6HeZVWN+3Opzayehnr5HqSq8eyAmk/zTvuHPgV59ggYDtDNT1u2UAbKBWgEsrclzZgBLQgC98zNgUMAAAAASUVORK5CYII=",
		//枚举文件夹内的所有文件，当做可执行文件加入菜单，斜杠"/"或"\"开头为相对配置文件夹，注意：Linux路径区分大小写！！！！
		MapFolder: '/chrome/tools', //注意：Linux路径区分大小写！！！！
		Filter: /\.(exe|lnk|bat|xls|xlsx|txt|doc|docx|jpg|wps)$/i, //枚举文件
		Exclude: /\.(dat|reg|sample|config|db|log|dll|json|zip|rar|ini|js)$|7za\.exe|wget\.exe|pac\.txt/i, //排除文件
		Directories: 2, //是否枚举子目录内的文件，值代表子目录深度，多少级的子目录，0为根目录（即不枚举子目录）
		FilterDirs: "", //枚举目录
		ExcludeDirs: /tmp|temp|ConFile|msdll|扩展|data|help|nTrun|skins/i, //排除目录
		child: [ //子菜单
			{
				label: "IE打开",
				image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSklEQVQ4jZXTv2sUQRwF8E88UYlg5WEhiqWIhREbIWVqOwkRUh6oqU/E/0KREBBUsJBwVmn9gXokXFJJCiN4pWKnp4lYnJ4W+x0Yhj1yLjwWZua977z3dpnsaaKF1xjgFzZweRzhEM5hAbfRDdIL3Ij1+1itI5/HQ3zBH/wNjPAO13E0hrRL8hw+ZKQ6DPEobF0qJ7/fh5zjLk4l8kE8KA58w+PwfAtv8Tvb/475JHAWn7LNPdzEMRzGEZxBpxiylgSuFuo/0cN6hi52Isx0bjcJtP/DewlNvCkW+3HdZwU6NdAKz3nnmzgZtzsQmMLxSD7hBLzCS2xnAiM8VVU7HWFeiSz6+BjvO/AVS5H6sLDyWVXfFn7U2JwRiV+LSU8mDG6AxdRAD/fQiECXo55x5H6QG0lgNhJu4yJOq/6255nQSPWhreBCBAr+AcklnGDMJaPHAAAAAElFTkSuQmCC",
				tooltiptext: "左键：IE打开当前页\r\n中键：打开 Internet Explorer\r\n右键：IE隐私打开当前页",
				//显示条件
				condition: "nolink",
				//自添加属性
				onclick: function(e) {
					var Path = "C:\\Program Files\\Internet Explorer\\iexplore.exe";
					switch (e.button) {
						case 0:
							anoBtn.Exec(Path, anoBtn.ConvertText("%u"));
							break;
						case 1:
							anoBtn.Exec(Path, "");
							break;
						case 2:
							e.preventDefault();
							anoBtn.Exec(Path, " -private " + anoBtn.ConvertText("%u"));
							break;
					}
				}
			}, {
				label: "K-Meleon打开",
				text: "%u",
				exec: "D:\\Program Files\\Browser\\K-Meleon\\k-meleon.exe"
			}
		]
	}, {
		//菜单名称
		label: "地址IP",
		//枚举文件夹内的所有文件，当做可执行文件加入菜单，斜杠"/"或"\"开头为相对配置文件夹，注意：Linux路径区分大小写！！！！
		MapFolder: false, //注意：Linux路径区分大小写！！！！
		Filter: /\.(exe|lnk|bat)$/i, //枚举文件
		Exclude: /\.(dat|reg|sample|config|db|log|dll|json|zip|rar|ini)$|7za\.exe|wget\.exe/i, //排除文件
		Directories: 0, //是否枚举子目录内的文件，值代表子目录深度，多少级的子目录，0为根目录（即不枚举子目录）
		FilterDirs: "", //枚举目录
		ExcludeDirs: /tmp|temp|msdll/i, //排除目录
		//图标
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAt0lEQVQ4jcXTsWoCQRSF4Q8SsNEitUnhM6RQUtjb+xixTRHIG+SFks7GVxBksbBPGVjWQpsjSNhdXUjIhb+4c5l/mMMMv1g93IfeWf8Qhhi0CcYowmMosAtbfGCO2zrBFGV4CiUOP/iK5GrBHu94wTqSz7rrNAnKzOAtgm0yuUpQ4RkzLCNY4a5LBlU4ZG3RJYOT4BsbvKLfRVDlxAlGuKnb3CY4D7G1/l/Q9JSLzC5W02c69X9TR6H4UVapsaP+AAAAAElFTkSuQmCC",
		child: [ //child:[  ]内为当前菜单的下级菜单配置,不限制目录级数；
			{
				MapFolder: false, //此项将转为menu类型，注意：Linux路径区分大小写！！！！
				Filter: /\.(exe|lnk|bat)$/i, //枚举文件
				Exclude: /\.(dat|reg|sample|config|db|log|dll|json|zip|rar|ini)$|7za\.exe|wget\.exe/i, //排除文件
				Directories: 0, //是否枚举子目录内的文件，值代表子目录深度，多少级的子目录，0为根目录（即不枚举子目录）
				FilterDirs: "", //枚举目录
				ExcludeDirs: /tmp|temp|msdll/i, //排除目录
				label: "PingIP(aizhan)",
				tooltiptext: 'http://ping.aizhan.com/', //提示文字
				oncommand: "anoBtn.OpenAction(this.tooltipText, 'site','%HOST%', null,'btn02')", //执行命令
				image: "http://www.aizhan.com/favicon.ico", //图标
			}, {
				label: "PingIP(17ce)",
				tooltiptext: 'http://www.17ce.com/site/ping',
				oncommand: "anoBtn.OpenAction(this.tooltipText, 'url','%HOST%', 'su')",
				image: "http://www.17ce.com/smedia/images/favicon.ico"
			}, {
				label: "PingIP(chinaz)",
				tooltiptext: 'http://ping.chinaz.com/',
				image: "http://seo.chinaz.com/Chinaz.ico",
				Post: "host=%HOST%&checktype=0&alllinetype=全选&linetype=电信&linetype=多线&linetype=联通&linetype=移动&linetype=海外",
				url: 'http://ping.chinaz.com/',
			}, {}, {
				label: "旁站(aizhan)",
				url: 'http://dns.aizhan.com/?q=%IP%',
				image: "http://www.aizhan.com/favicon.ico"
			}, {
				label: "旁站(114best)",
				url: 'http://www.114best.com/ip/114.aspx?w=%IP%',
				image: "http://www.114best.com/favicon.ico"
			}, {
				label: "旁站(Bing)",
				url: 'http://cn.bing.com/search?q=ip:%IP%',
				image: "http://cn.bing.com/s/a/bing_p.ico"
			}

		]
	}, {
		label: "域名DNS",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVQ4jXXTzUtVURQF8J+F9ugPKBTFbBAUNCl4GmE5LJI+Jn1IUP9Ck3DarEEIJVj2SKwg6AO0aNAgfZHRP1CaFVEPykGDnNekwd4XrpfngsvhHM7ae5291mUjunAMT9DCen4tPMMJbLMJdmISn/EQl3AEw7iIGaxiCt3tyPNYSsLWPO9Ff64HMIomXqKnIHdm5yUMVApfxzd8SGULGMv1dvGc4/iUcqu4id84j30pv5lKVnASHuNBSXYZk3iEjtzvzWZ13MUc/MDlNmS4hffYkfvT2XkgVf2EPxjJCzWcwg1cEXb+wxvM4guu5d3DwmLrOJqH4/iast/ir3Dnaqo5i+3VAi3hcx8+pjQp+x3ubPK8C8UTnuIeDooB7S9duo/pNuQtaOA5Ec8VYc2CsGqPGNha7qsYzGZniPxPYVGEpCkiu4zvmKiQe/E6FdSKw24Rz8VUVBdW7caukux6qnyVhTagR8RzVYTkHA5hSAy2IeLcaEcuUBPxnBcTLn7nX3iRc6mVCf8BM0VdfnCTBIgAAAAASUVORK5CYII=",
		child: [ //
			{
				label: "综合查询",
				url: 'http://seo.chinaz.com/?q=%HOST%',
				image: "http://seo.chinaz.com/Chinaz.ico"
			}, {
				label: "网站备案",
				url: 'http://icp.aizhan.com/%BASEDOMAIN%',
				image: "http://www.aizhan.com/favicon.ico"
			}, {}, {
				label: "Whois(Shosts)",
				url: 'https://www.sugarhosts.com/members/whois.php?domain=%BASEDOMAIN%',
				image: "http://www.sugarhosts.com/templates/sh_christmas2009/favicon.ico"
			}, {
				label: "Whois(cndns)",
				tooltiptext: 'http://who.cndns.com/',
				image: "http://www.cndns.com/favicon.ico",
				oncommand: function() {
					anoBtn.OpenAction(this.tooltipText, 'textDomain', "%BASEDOMAIN%", 'linkWhois')
				}
			}, {
				label: "Whois(aizhan)",
				url: 'http://whois.aizhan.com/%HOST%/',
				image: "http://www.aizhan.com/favicon.ico"
			}, {
				label: "Whois(ChinaZ)",
				url: 'http://whois.chinaz.com/%BASEDOMAIN%',
				image: "http://whois.chinaz.com/Images/Chinaz.ico"
			}, {
				label: "Whois(Dtools)",
				url: 'http://whois.domaintools.com/%BASEDOMAIN%',
				image: "http://whois.domaintools.com/favicon.png"
			}, {
				label: "Whois(dnsw)",
				url: 'http://dnsw.info/%BASEDOMAIN%',
				image: "http://dnsw.info/favicon.ico"
			}, {
				label: "DNS健康",
				url: 'http://www.intodns.com/%BASEDOMAIN%',
				image: "http://www.intodns.com/static/images/favicon.ico"
			}, {
				label: "黑名单",
				url: 'http://rbls.org/%HOST%',
				image: "http://rbls.org/favicon.ico"
			}

		]
	}, {
		label: "网站安全",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4jYWTMUtcURSEj4u2YmGZSh5rsdzzfU3+gq0QLISFhFhom3R2lkLSpA4Ee22sJIaYNkIC1kkpaiF2wUZhk+a95bk+NxemOjNzhsPciI5XSlkCdtUr9QrYLaUsdXEfPHUhM9eBU/VO/VvjDjjNzHV14ZEwM5eBDfUQ+NMSPkA9OwQ2MnO50ffU/YmNXeJRO5G6HxG9iIgecNwifs3Ml8CLBuoQeAuctHjHjcEMsNcMMvNVk6whZOazwWDwHHjdMtiLiJnmBjvAqI75Rv2i/mzhB/C5TjECRpm50z7imnpfD7fV6447XAPb9ZL7zFwbGwAD4KKONtWg5lwAg7FBVVXz6kF9g3fACfB9At/U97XZQVVV85MlGqq3wK/M/Kh+aAP4pP5Wb9XhozL1+/1F9WhaF2oc9fv9xc4qAyvq5RTxJbDy5F+IiFlgS73pEN8AWxExO80gImJO3QTOW6U5VzcjYu5/4nGSUsoqcAaclVJWn9r8D9Ly4rUXRHEbAAAAAElFTkSuQmCC",
		child: [ //
			{
				label: "安全扫描",
				tooltiptext: 'https://www.virustotal.com/#url',
				image: "https://www.virustotal.com/static/img/favicon.ico",
				oncommand: function() {
					anoBtn.OpenAction(this.tooltipText, 'url', gBrowser.selectedBrowser.currentURI.spec, 'btn-scan-url')
				}
			}, {
				label: "WOT Scorecard",
				url: 'https://www.mywot.com/en/scorecard/%HOST%',
				image: "https://www.mywot.com/files/favicon.ico"
			}, {
				label: "安全评估",
				url: 'https://www.siteadvisor.com/sites/%HOST%',
				image: "https://www.siteadvisor.com/favicon.ico"
			}, {
				label: "钓鱼分析",
				url: 'http://toolbar.netcraft.com/site_report?url=%HOST%',
				image: "http://toolbar.netcraft.com/favicon.ico"
			}, {
				label: "安全查询",
				url: 'http://webscan.360.cn/index/checkwebsite?url=%HOST%',
				image: "http://www.360.cn/favicon.ico"
			}
		]
	}, {
		label: "站点搜索",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAABHklEQVQokZ3TPyjFURwF8I8/r5fyUhZRUoqJ/Q0Gg0lGZbJgsxmUiSR5+TOIkWJQBhkUFvUGGZVRBsmCPMJkUIZ7vbxfnidn/J57zj3f+/1efkYKAzhAAR94wylGUF9GRyTn8IBzrGAi1vJ4wjZafhLXYgavmEVTgs9gDPfYQUPSIItHLMY2ymE0XjKeJHK4QfsvYkKbeaHFIlI4wmGF27+wgPfvhTROsI/qPxhMC9MpogobuEBjBXENdnGbJAaFeQ9XMMgKk1hNEhns4Rp9ZcRdOItJO5Ox6tCGY9xhORp1owdTuMIler+LU8K2bQnL0Yz5eLgQ4xaEnjejYRFpTOIFa0r3vDUmGEI/OoRtLUEOz1hS4ZOUw7rwmv8SfwIjnjkY6akXagAAAABJRU5ErkJggg==",
		child: [ //
			{
				label: "维基域名",
				url: 'http://zh.wikipedia.org/wiki/Special:Search?search=%HOST%&go=Go&variant=zh-cn',
				image: "http://bits.wikimedia.org/favicon/wikipedia.ico"
			}, {}, {
				label: "类似网站",
				url: 'https://www.xmarks.com/site/%HOST%',
				image: "http://www.xmarks.com/favicon.ico"
			}, {
				label: "类似网站",
				url: 'http://www.similarsitesearch.com/cn/site/%HOST%',
				image: "http://www.similarsitesearch.com/favicon.ico"
			}, {
				label: "相似页面",
				url: 'http://www.google.com/search?q=related:%URL%'
			}, {
				label: "相似页面2",
				url: 'http://www.similarsitesearch.com/s.php?URL=%URL%&src=bmt',
				image: "http://www.similarsitesearch.com/favicon.ico"
			}, {
				label: "反向链接",
				url: 'http://www.google.com/search?q=link:%HOST%'
			}, {
				label: "反向链接2",
				url: 'http://www.google.co.jp/search?q=link:%BASEDOMAIN%+-site:%BASEDOMAIN%',
			}, {
				label: "内部链接",
				url: 'http://www.google.co.jp/search?q=link:%BASEDOMAIN%+site:%BASEDOMAIN%',
			}, {
				label: "Email搜索",
				url: 'http://www.google.co.jp/search?q="*@%BASEDOMAIN%"',
			}
		]
	}, {
		label: "开发审查",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABGElEQVQ4jb3TOy/DURgG8F9dKjGowcRADUIwdHLpRCJG9RXEamBAY7H6AMQn0NnOQInbiJFJ7EYJYejbtP2njTB4kic5570973nPOfwD0ugPpn+bPIsSLoKlsLVEB/LYwh7uUMR4sIjbVkXasREB+zjEKlKJuG0coTNZII8bTMc+hba6dbXQJM5VZtKAnVBuhiWsheooHrBYdXZhJYy7YRvDQKwLeMUbFtCNTVxhDtZxGYF9yOERxyozeMEnDtBb11URJ0K5UOfIhe0L7/iIo/UkjjWBJ3jGSMI5hftQbpbcUCDZQRXT0WamiY/KdZ5Sm8EyhpENDmIomK1j9UFdY57aLZygjLMfWFZ50jPJljIJ1Vb806dqiW9kvzxuhp8KgQAAAABJRU5ErkJggg==",
		child: [ //
			{
				label: "BuiltWith",
				url: 'http://builtwith.com/%HOST%',
				image: "http://builtwith.com/favicon.ico"
			}, {
				label: "W3C Validator",
				url: 'http://validator.w3.org/check?uri=%HOST%',
				image: "http://www.w3.org/2008/site/images/favicon.ico"
			}, {
				label: "W3C CSS Validator",
				url: 'http://jigsaw.w3.org/css-validator/validator?uri=%HOST%',
				image: "http://jigsaw.w3.org/favicon.ico"
			}, {
				label: "Validate.nu",
				url: 'http://validator.w3.org/nu/?doc=%HOST%',
				image: "http://www.w3.org/2008/site/images/favicon.ico"
			}, {
				label: "WAVE a11y 检查",
				url: 'http://wave.webaim.org/report#/%HOST%',
				image: "http://wave.webaim.org/favicon.ico?v=1395952834"
			}, {
				label: "SSL 服务器测试",
				url: 'https://www.ssllabs.com/ssltest/analyze.html?d=%HOST%',
				image: "https://www.ssllabs.com/favicon.ico"
			}, {
				label: "SSL 检查器",
				url: 'https://www.sslshopper.com/ssl-checker.html#hostname=%HOST%',
				image: "https://www.sslshopper.com/favicon.ico"
			}, {
				label: "Header Check",
				url: 'https://quixapp.com/headers/?r=%HOST%',
				image: "https://quixapp.com/wp/wp-content/themes/quix-theme/images/favicon.png"
			}, {
				label: "URL 解析器",
				url: 'http://urlparser.com/?linkFrom=flagf1&url=%URL%',
				image: "http://urlparser.com/favicon.ico"
			}, {
				label: "编辑页面",
				url: 'http://www.printwhatyoulike.com/print?url=%URL%',
				image: "http://www.printwhatyoulike.com/editor/img/favicon.png"
			}
		]
	}, {
		label: "镜像快照",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSElEQVQ4jc3Tu0tcYRAF8N+GXVhWs+hGAiIi+Fh8gA+wyDZCEPf/MH0KNUXKZUmagNikSGETxEIb7S01uEUaQUQI2gRB7EQIQghrceeCXJSYLlN8MN89Z+6ZM/Pxv8Uz9GAIvcj/C3kYqzjGJX7gK2rI/Y08ie9o4wItnEW+h+4MvoaJNHmOnQCvo4oi+vAWcxnyaKjbDa46brCPF3E5J/EgjZd4jYrEo4Pg1GEl/t4I8Hv8xgYK0f9n/MGnwDSCsyyONprx8R1+RTv5KLCGW3wITDM4SzCPaxyG1BJmQ2oaFbxCOTCt4MxDB7ai4qZkImUMRjsLGROrOMF2cMEYvkWRKxzhp8fHOIORzJ1+fMRpyDvHF0x7wiJBV/S5KDH2jcSL0lPInZLNmpV4MI6pyAceUFBy753kJMtTiULp6AqRFzLkfKgtwh2F4z1a0Vqb4QAAAABJRU5ErkJggg==",
		child: [ //
			{
				label: "Google快照",
				url: 'https://webcache.googleusercontent.com/search?q=cache:%URL%',
				image: "https://webcache.googleusercontent.com/favicon.ico"
			}, {
				label: "Gigablast",
				url: 'http://www.gigablast.com/search?q=%HOST%',
				image: "http://www.gigablast.com/favicon.ico"
			}, {
				label: "WebArchive",
				url: 'http://web.archive.org/web/*/%HOST%',
				image: "http://archive.org/images/glogo.jpg"
			}, {
				label: "Google(限文字)",
				url: 'https://webcache.googleusercontent.com/search?strip=1&q=cache:%URL%',
				image: "https://webcache.googleusercontent.com/favicon.ico"
			}, {
				label: "Yahoo!快照",
				url: 'http://search.yahoo.com/search?p=%URL%',
				image: "http://search.yahoo.com/favicon.ico"
			}
		]
	}, {
		label: "便捷工具",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiUlEQVQ4ja2NQQqDQBAE6+v+RyUIQkAQcsjBix/wAX4jl1WGZrY3gTQU3TPbzMKf1AG9QCVfdPHAKAfHZF/rAPAw7t5uTXJ9SrLrMCcQ3HWsnoWmlkLMcXYOwBrc5VX6Tb0K2Rz3vBPim3MANvl5+9Jv7cYjWQeAQw4eJmsXgAE4BcR1N2SHftYHOcZOEltHUS4AAAAASUVORK5CYII=",
		child: [ //
			{
				label: "天涯脱水",
				url: 'http://www.tianyatool.com/cgi-bin/bbs.pl?url=%URL%',
				image: "http://www.tianyatool.com/favicon.ico"
			}, {
				label: "TinyUrl",
				url: 'http://tinyurl.com/create.php?url=%URL%',
				image: "http://tinyurl.com/siteresources/images/favicon.ico"
			}, {
				label: "Goo.gl",
				url: 'http://www.ruanyifeng.com/webapp/url_shortener_plugin.php?longUrl=%URL%',
				image: "http://www.ruanyifeng.com/favicon.ico"
			}
		]
	}, {
		label: "Alexa排名",
		url: 'http://www.alexa.com/siteinfo/%HOST%',
		image: "http://www.alexa.com/favicon.ico"
	}, {
		label: "WolframAlpha",
		url: 'http://www.wolframalpha.com/input/?i=%HOST%',
		image: "http://www.wolframalpha.com/favicon.ico"
	}, {
		label: "BugMeNot",
		url: 'http://bugmenot.com/view/%HOST%',
		image: "http://bugmenot.com/favicon.ico"
	}, {
		label: "翻译此页",
		url: 'http://translate.google.cn/translate?u=%URL%',
		image: "http://translate.google.cn/favicon.ico"
	}, {
		label: "内嵌翻译",
		oncommand: function() {
			gBrowser.loadURI("javascript:(function(){var%20s%20=%20document.createElement('script');%20s.type%20=%20'text/javascript';%20s.src%20=%20'http://labs.microsofttranslator.com/bookmarklet/default.aspx?f=js&to=zh-chs';%20document.body.insertBefore(s,%20document.body.firstChild);})()");
		},
		image: "http://labs.microsofttranslator.com/favicon.ico"
	}, {
		label: "存为PDF",
		url: 'http://www.web2pdfconvert.com/engine?curl=%URL%',
		image: "http://www.web2pdfconvert.com/favicon.ico"
	}, {
		label: "整页截图",
		oncommand: function() {
			var cont = window.content || gBrowser.selectedBrowser._contentWindow || gBrowser.selectedBrowser.contentWindowAsCPOW;
			var canvas = cont.document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
			canvas.width = cont.document.documentElement.scrollWidth;
			canvas.height = cont.document.documentElement.scrollHeight;
			var ctx = canvas.getContext("2d");
			ctx.drawWindow(cont, 0, 0, canvas.width, canvas.height, "rgb(255,255,255)");
			saveImageURL(canvas.toDataURL(), cont.document.title + ".png", null, null, null, null, cont.document);
		},
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAm0lEQVQ4jbWTUQrDIBBEH9QcokjZe+T+ieQaJXiKfvSjIyyJRmzpwHzsuo47qwJMgIlBvIpPMGAFEnAXUyOOLYEEbG7D1oirAsEV3sQoltivdwWO6Ap4C7UWIwMzqBUY8BTtGwvDAmWIBjyAGcjirJypJhwt+HvfdWoGXmJWbgeW0tHPAoHzvQ9Z6KE7xL8LRD5+FxoPqYfL7/wGEBc4QhYRpZIAAAAASUVORK5CYII="
	}
];
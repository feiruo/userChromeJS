/******************************************************************************************
 *这里是脚本中用到的各种图标设置。
 *******************************************************************************************/
var Icons = {
	//等待时国旗图标，预设Firefox内部图标【chrome://branding/content/icon16.png】。
	DEFAULT_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=",

	//未知的国旗图标，预设为上一个图标设置，如不喜欢内置默认，可以再这里修改。
	Unknown_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVQ4jZWRMahScRjFL40REW9ojqaGhoaGprg0eL3//3fkj0pCDrYp2hARmRItjk4ND0EuSFMgSEQIiuMjEjdnwUGIvLdF+bxc/j6ut8X3eM9X7z3P+vE7nPMdw9gRgPdEdCSlPJRS3t+9Xyrbtp8A4FqtFmQyGQbARHRERAXLsg6uNADwMZ1O83q9jpbLZdjtdnW5XPa3Rksi+iqEeA7g5j8NFosFu64bRjuaz+dhu93WhULBB8AAXCll3TTNO6fweDx+qLWOwvACf06TySR0HCdQSjGAt2fjKwA8m83+6zCdTsNWqxXkcjkG4Nq2/ezUgIg+ZbNZ3mw25yDP88JOp6NLpdLJL/4AaAkhnu4+cFyv14MoiiJmjvr9vq5Wq34ikeBt7+8AXpimeevC8+Lx+D0APBgMdK/X08lk8gT6KaV8HYvF7l46nxDiJQD2PC+sVCo+Ef0A8ODK3c/0/5zP5/0gCCKlFBPRu2vD2/6/ms1mMBqNjgGwEOLxtWEhxCMAPBwOjx3H0UT02zCMG/vEf6OU4tVqFRWLRZ+IvuwVn4g+pFIpbjQawXbnV3sZWJZ1IKU8BDAhom+2bd/eh/8LEFU+M9Rx2boAAAAASUVORK5CYII=",

	//本地文件图标，预设为上一个图标设置，如不喜欢内置默认，可以再这里修改。
	File_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAAB3ElEQVQ4jZ3QT2vTcBzH8YGPxpt4EHwmHoc+BRV8ADuu+8MG2w47DJINVkLHWDrFKXpYBtqmttl+JV3/Zk1/SX5pfklq09TCx8O0yLB/0g+8j9/X4bu09GB7ex9fHB8XqSgqVBQVKgj3iaJCj46+0f39r8Wtrezzh3czl0plXxUKLjj/BcuKYNv3MRbDMEKk0wWIonKTSp0+SwSvrmaXVdUGY33Uau64RsODrts4OVFhGH2I4tWPlZXTp4ngfN6C4/RBCEWp1IammSCEQtM6kKQcwnAEyxpCknLft7c/PJkbzuUoGIug6zYIoSiXKSoVB4RQCIICVTVAiAVFMbC7+/nq4ODL47lh141QrbrQdQeVioPbW4ZazYUsl5DJ5JHJqJDlIi4uGtjZ+fQuATxAvd5FtcrGNZscphnANAO02wE4j1Euc6ytya/nhj0vQqvlodHo/pM7rl53Yds9XF93k8IDGIaPVov/t2aTg7H+InCMdjvE3V0wMdeNksOcx+h0Qpjm5LrdwWKwZfVA6eQ8L4amLQDb9s+pcZ4QzucpfH8Ix+lPzfeHSV7x/mWhwBAEIzAWTy0IRiAkwMbG+duZ8OZmdjmdLoaHh5ehIFz2ZiVJWri+fvbmz/mjv85vk5TTd5np7HoAAAAASUVORK5CYII=",

	//Base64编码地址图标，预设为上一个图标设置，如不喜欢内置默认，可以再这里修改。
	Base64_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAABC0lEQVQokZXTTSvEcRDA8Q/ZcvBQLlIeXoCDUl6Aq4tQzm7egHZtCoUk70EOXEjC3UEuDk4uHo8ODkIu2l27Djubv4e1a2qa38PMd2b6zQ92kUPpn5rHjlhcYREZpDETtpouRExO0JZ8SgN61JbliFVCNnExjhtM1ABkfwN04CTOztGdCGiN6v4ETOMZ63gI24ghHGOsGmAWnbjAAVqwgscI2g+/S/RXA6Qj+3A4dOEsKnkK4DWO0Kb8YiV4xyZusYFUosxRvGIbzZjEC+YxVwEUIsM9Bn2VFEbQF/smrEZrp5FcIUhr6pN2HKJYAeSjtwFM+Tl1mW+axlYkzlOe5yx6cae+f1DEG/Y+AKR8auXF6Pi+AAAAAElFTkSuQmCC",

	//LocalHOST【127.0.0.1】【::1】，预设为上一个图标设置，如不喜欢内置默认，可以再这里修改。
	LocahHost_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAABNklEQVQ4ja2UwUpCQRSGPwx9gyAfooVLF0GLXiFo5QsUlkHcUgjcCZVEqIueQGjlIqwWbXqAom2IVJu2Bobg4raYM93D8ard7IeBuf/85xtm7szApA6BUNq6eGfKC4GdmLq5CqS4It+nBurbdlJwFahL/0SBRkB7EfhKDDQENsU/WgRul79lxv8Er8+BepVNrvgf0Gnw/bjQeUKolz6eE/ALNTBMAPU6AMaKUQLYMzM2VMESkAHSBpQWP6W8O8PhWDpj4AuoqfAl0AeegWXxckBP/EBlO8BAgzNAAcgDL0BLhW/UpFnx1lRxU2UfgGtgg+jM/+jNgDsC+CS6OKvAI/AE7BrwrQV6vf4CPE0zwe9E7wTAlYAHuC2bpXvcD4xVH7fEAHc+e0T7WcNd5YppZcl+AF0P+gbk74HicL4aGwAAAABJRU5ErkJggg==",

	//局域网【192.168.xxx.xxx】【169.254.xxx.xxx】，预设为上一个图标设置，如不喜欢内置默认，可以再这里修改。
	LAN_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAABLklEQVQ4jeXUO0vcURAF8F8pxDqdAdFCZLUQ/ARiZ6f4AjWua2dhq4IaNEWKgNjFSi3ED2AhmEKxUXw3PrBQQwQbI6SSiJhiR1nwv6uwlXhguJc5cw4zl3svhTGIM1ziV8RvXGD4BW1BfMFDnvhejPEo7hJM7/HtfRlPJpg+xlQxxhlsYEv2dpxjG5sYKMb4Az6hHEMYQSXKUPpakxI0II0efEYnmtGCH5hBW+Q6curSaIxGnuGj7LmNoxt96A9RGnOYj1xvrBl0YQzTMd0TqlGLJsyiHTWoQkXs6zCBr6iPXGXUpNAa2pbgUrCCfRzhCofYwWJMsIZd2Wd8gT2sR4cLUXsY2pMc3h/J1+kUP/EvgbvHKo7zaG/JfipJ5AGWcJPA/cVydJekvX57xv8BD7eoP535NRkAAAAASUVORK5CYII=",

	//默认UA图标，预设为上一个图标设置，如不喜欢内置默认，可以再这里修改。
	DEFAULT_UA: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKklEQVQ4jbWPT4gSURzHXzqDzr6ZgefD+fd0YJynjI62ghhqZApLdCnwkpAn87CXvO4SHTqKhw4JIl5aloiCIBChBTstHj10CXYpIRbSdXGLWDoG0ynZFSNY6Ae/y+/zPl++D4D/OBAAsHZZmfA8/7Lb7bKXskVRfCVJ0kQUxTbLsrssyz53uVxbAAD7n7IgCHcJIXPLsj7puj4lhEw0TZv6/f5TnuePGIZ5vFJkGOYGQui6JEm7lNJJPB4/jEaji7Us6yAUCn3GGJ95vd4ny74LQrgXDoergUBgn1I6Nk1zbJrmhFI6MQxjaprmOBKJ/AmZQAivLmxN03SE0FE2m70dCoXeKoryw7btj9Vq9VG9Xt8sl8sN27ZHuq6PDcM4VFX1FCG0tQgwDGMdY/w1nU7ngsHgu42NjdedTufa+Yq5XG5bVdUTXdcPFUU5lmW5tYCFQoH6fL4TVVU3W63WuuM4zPIfIYQNjPE3VVUP/H7/jBDydAF3dna8iqKMeJ7fd7vd95ZlSmkgkUi8CYfDQ4TQGCE0tyzr4YVHmUxmm+O4nyzLfgcA3D/P2u02P5/PBULIC0EQjjHGXyqVSuJCwHA4RJFI5D1CaFwoFBqWZeGlIh6O40Yej+csmUy2l1sCAADo9/t6Pp/fLZVKNx3HubKEH7jd7l+xWGyv1+vJKwMAAMBxHK7ZbGrnTi4I4S1Zlj8Ui8Vns9lM+qu8alKp1FqtVrszGAySq/hvbPGRIDMl+58AAAAASUVORK5CYII=",

	//未知UA图标，预设为上一个图标设置，如不喜欢内置默认，可以再这里修改。
	Unknown_UAImage: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADM0lEQVQ4jW2T20tqeRzFf52nmIHzr5zmwjxLQzF2rLGHItCCqJAaa2Bnuywv263i/RKm0taEasc4D0USjGQQDELQUw8xWBuCEKGLWgfdiiLzW/MyRKdzPvB9+64Fi/X9EvIGjUbz3mKxfMzn83/e3NxIZ2dnBZ1OJ4yPj/f29/d/+3b/Ne84juu9urq6qFarnXq9jpOTE1QqFQQCAUQikVY+n8/Pz8//RAjp+kJsMBim7u/v5UajQTOZDC0UCojH4zSXy1Gn0wmbzUZ3d3fp+fl51WAw/PqZiU6n+/n6+lrudDpot9u0Wq3ScrmMbDZLfT4fdblc4Hme2mw2enFxgdPT00elUvkdIYQQpVL5XhTFi3a7jVarhWaziWKxiMPDQ2xubiIUCsHtdsNut8NqteLg4ADxeBxLS0tZhULRTbRa7cfj4+OOLMuo1+uQJAnpdBqiKCKRSGB9fR0ejwcOhwNWqxV2ux0PDw+4u7uTp6enfyALCwt/5HI5mk6nsb+/D1EUqSiKdHt7G4Ig0HA4TL1eLxwOBzWbzdTv96PRaKDZbFK73f47YVlWSqVS2NnZwdbWFgRBQCKRgCAI2NjYQDAYfIlgsVgQCoUgyzJqtRpisViMLC4u/uNwOJDJZBCJRBCNRhGNRhEOhxEIBOB2u/F/CzCZTPB4PKhUKigWi/D5fDEyNTUlcBxHnU4nXC4X9vb2aDKZpH6/Hy6XizqdTsrzPEwmE11ZWaGrq6uIRCKwWq3/jo2NLZCRkZFeo9HY4jgOwWAQ9Xod7XYbkiQhmUyC53lYLBasra3BaDS+DMMwn9RqdQ8ZHBz8Zm5u7m+z2YxkMonXdT49PSGVSsHtdn9hMDk5eaBQKLoJIYQMDAz8yDBM2Ww2o1AoUFmWaa1Ww/PzMy2Xy/T29hY8z1OWZanRaIRery+qVKoPr0+5a3h4WMUwzAPHcVSSJFqtVvH4+EhLpRLNZrNgWZayLEv1en1xaGjoF0LIu7f/0NXX19czMzPz19HRUb1UKtHLy0t4vV4sLy9ThmE+TUxMHKjV6p6viV9QKBTdWq32+9nZ2d+0Wq1Xo9F4R0dHZ1Qq1YeXzK/4Dz2YO52piHOZAAAAAElFTkSuQmCC",
};
/******************************************************************************************
 *这里是图标弹出TIP文字的自定义设置,可用于本地化，他国语言等
 *******************************************************************************************/
var TipShow = { //图标显示顺序不会因这里而改变顺序
	tipArrHost: "网站域名：", //域名文字：显示为 【网站域名：xxxx.xxx.xxx】
	tipArrIP: "网站IP：", //IP文字：显示为 【网站IP：xxxx.xxx.xxx】
	tipArrSepC: "--------------------------------", //分割线，留空表示不使用分割线
	/*这里会显示 自定义查询信息*/
	tipArrSepEnd: "--------------------------------", //分割线，留空表示不使用分割线
	tipArrThanks: "Thx&From：", //信息来源文字：自动使用查询API的主域名，显示为 【Thx&From：xxxx.xxx ,xxxx.xxx ,xxxx.xxx】
};
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
							FeiRuoNet_Menu.exec(Path, FeiRuoNet_Menu.convertText("%u"));
							break;
						case 1:
							FeiRuoNet_Menu.exec(Path, "");
							break;
						case 2:
							e.preventDefault();
							FeiRuoNet_Menu.exec(Path, " -private " + FeiRuoNet_Menu.convertText("%u"));
							break;
					}
				}
			}, {
				label: "K-Meleon打开",
				text: "%u",
				exec: "D:\\Program Files\\K-Meleon\\k-meleon.exe"
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
				oncommand: "FeiRuoNet_Menu.OpenAction(this.tooltipText, 'site','%HOST%', null,'btn02')", //执行命令
				image: "http://www.aizhan.com/favicon.ico", //图标
			}, {
				label: "PingIP(17ce)",
				tooltiptext: 'http://www.17ce.com/site/ping',
				oncommand: "FeiRuoNet_Menu.OpenAction(this.tooltipText, 'url','%HOST%', 'su')",
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
					FeiRuoNet_Menu.OpenAction(this.tooltipText, 'textDomain', "%BASEDOMAIN%", 'linkWhois')
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
					FeiRuoNet_Menu.OpenAction(this.tooltipText, 'url', gBrowser.selectedBrowser.currentURI.spec, 'btn-scan-url')
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
			var cont = FeiRuoNet.Content;
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
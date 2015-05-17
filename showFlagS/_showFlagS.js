/******************************************************************************************
 *这里是脚本中用到的各种图标设置。
 *******************************************************************************************/
var Icons = {
	//等待时国旗图标，预设Firefox内部图标【chrome://branding/content/icon16.png】。
	DEFAULT_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2TwW7aQBRF+ZDku0q/qChds5mxkDG2iY3H9jyTBFAWLAgRG7CwCawQi6BEQhgEFkiAuF3VaVXaSlWvdBazuGfx5r1c7n/H9/1rIvpCAUWS5E6S3FFAkU9+wff967+VP1FA6fPzMwaDAcbjMQaDAabTKSggEFEqpcxfLEvp5huNxnmxWGC73SIMQ9Tv6gjqAbrdLqT0Ub+rg4jOUro/S4QQV57nbZMkwel0wvF4xGazQafTgeu5GY1GA8PhEMITqRDiKhM4jnPTbrdxOBxwOByQJAlcz4UQ4heiKILruXAc52smsGzrpd/v4/X1FcPhEBQQ7Jp9kVarhdlsBsu2Xj4E1u3x/v4eRATLuv0tQT3AdDrFcrmEZd2eMoFZNXdm1cSP2DUbZtUEEYECglk1MRqNkKYp3t/fYZjGPhPohh7rhg7d0PH09IQ4jjGbzdBsNtHr9SBcAd3QMZlMMJ/PEYYhdEOPM0G5Ur7RKhoeHx+xWq2wXq+xXq/x9vaGVqsFraJBq2jQDT17l8vljyFyzq9UVd2qqoooirBarTLCMIRds6GqKgzTgOPUoKpqyjn/+MZcLpdTFCVfKpXOlm1huVwiSRIkSYLFYgGzauLh4QHNZhNaRTsrinJ5GxljeUVRUil99Ho9dLtduJ4LKX0QERRFSTnnny+Wv6dYLF4zxgqMsZhzvuec7xljMWOsUCwW/3xM/5JvTakQArDW8fcAAAAASUVORK5CYII=",

	//未知的国旗图标，预设同上，如不喜欢内置默认，可以再这里修改。
	Unknown_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVQ4jZWRMahScRjFL40REW9ojqaGhoaGprg0eL3//3fkj0pCDrYp2hARmRItjk4ND0EuSFMgSEQIiuMjEjdnwUGIvLdF+bxc/j6ut8X3eM9X7z3P+vE7nPMdw9gRgPdEdCSlPJRS3t+9Xyrbtp8A4FqtFmQyGQbARHRERAXLsg6uNADwMZ1O83q9jpbLZdjtdnW5XPa3Rksi+iqEeA7g5j8NFosFu64bRjuaz+dhu93WhULBB8AAXCll3TTNO6fweDx+qLWOwvACf06TySR0HCdQSjGAt2fjKwA8m83+6zCdTsNWqxXkcjkG4Nq2/ezUgIg+ZbNZ3mw25yDP88JOp6NLpdLJL/4AaAkhnu4+cFyv14MoiiJmjvr9vq5Wq34ikeBt7+8AXpimeevC8+Lx+D0APBgMdK/X08lk8gT6KaV8HYvF7l46nxDiJQD2PC+sVCo+Ef0A8ODK3c/0/5zP5/0gCCKlFBPRu2vD2/6/ms1mMBqNjgGwEOLxtWEhxCMAPBwOjx3H0UT02zCMG/vEf6OU4tVqFRWLRZ+IvuwVn4g+pFIpbjQawXbnV3sZWJZ1IKU8BDAhom+2bd/eh/8LEFU+M9Rx2boAAAAASUVORK5CYII=",

	//本地文件图标，预设同上，如不喜欢内置默认，可以再这里修改。
	File_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAAB3ElEQVQ4jZ3QT2vTcBzH8YGPxpt4EHwmHoc+BRV8ADuu+8MG2w47DJINVkLHWDrFKXpYBtqmttl+JV3/Zk1/SX5pfklq09TCx8O0yLB/0g+8j9/X4bu09GB7ex9fHB8XqSgqVBQVKgj3iaJCj46+0f39r8Wtrezzh3czl0plXxUKLjj/BcuKYNv3MRbDMEKk0wWIonKTSp0+SwSvrmaXVdUGY33Uau64RsODrts4OVFhGH2I4tWPlZXTp4ngfN6C4/RBCEWp1IammSCEQtM6kKQcwnAEyxpCknLft7c/PJkbzuUoGIug6zYIoSiXKSoVB4RQCIICVTVAiAVFMbC7+/nq4ODL47lh141QrbrQdQeVioPbW4ZazYUsl5DJ5JHJqJDlIi4uGtjZ+fQuATxAvd5FtcrGNZscphnANAO02wE4j1Euc6ytya/nhj0vQqvlodHo/pM7rl53Yds9XF93k8IDGIaPVov/t2aTg7H+InCMdjvE3V0wMdeNksOcx+h0Qpjm5LrdwWKwZfVA6eQ8L4amLQDb9s+pcZ4QzucpfH8Ix+lPzfeHSV7x/mWhwBAEIzAWTy0IRiAkwMbG+duZ8OZmdjmdLoaHh5ehIFz2ZiVJWri+fvbmz/mjv85vk5TTd5np7HoAAAAASUVORK5CYII=",

	//Base64编码地址图标，预设同上，如不喜欢内置默认，可以再这里修改。
	Base64_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAYAAACgu+4kAAABC0lEQVQokZXTTSvEcRDA8Q/ZcvBQLlIeXoCDUl6Aq4tQzm7egHZtCoUk70EOXEjC3UEuDk4uHo8ODkIu2l27Djubv4e1a2qa38PMd2b6zQ92kUPpn5rHjlhcYREZpDETtpouRExO0JZ8SgN61JbliFVCNnExjhtM1ABkfwN04CTOztGdCGiN6v4ETOMZ63gI24ghHGOsGmAWnbjAAVqwgscI2g+/S/RXA6Qj+3A4dOEsKnkK4DWO0Kb8YiV4xyZusYFUosxRvGIbzZjEC+YxVwEUIsM9Bn2VFEbQF/smrEZrp5FcIUhr6pN2HKJYAeSjtwFM+Tl1mW+axlYkzlOe5yx6cae+f1DEG/Y+AKR8auXF6Pi+AAAAAElFTkSuQmCC",

	//LocalHOST【127.0.0.1】【::1】，预设同上，如不喜欢内置默认，可以再这里修改。
	LocahHost_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAABNklEQVQ4ja2UwUpCQRSGPwx9gyAfooVLF0GLXiFo5QsUlkHcUgjcCZVEqIueQGjlIqwWbXqAom2IVJu2Bobg4raYM93D8ard7IeBuf/85xtm7szApA6BUNq6eGfKC4GdmLq5CqS4It+nBurbdlJwFahL/0SBRkB7EfhKDDQENsU/WgRul79lxv8Er8+BepVNrvgf0Gnw/bjQeUKolz6eE/ALNTBMAPU6AMaKUQLYMzM2VMESkAHSBpQWP6W8O8PhWDpj4AuoqfAl0AeegWXxckBP/EBlO8BAgzNAAcgDL0BLhW/UpFnx1lRxU2UfgGtgg+jM/+jNgDsC+CS6OKvAI/AE7BrwrQV6vf4CPE0zwe9E7wTAlYAHuC2bpXvcD4xVH7fEAHc+e0T7WcNd5YppZcl+AF0P+gbk74HicL4aGwAAAABJRU5ErkJggg==",

	//局域网【192.168.xxx.xxx】【169.254.xxx.xxx】，预设同上，如不喜欢内置默认，可以再这里修改。
	LAN_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAABLklEQVQ4jeXUO0vcURAF8F8pxDqdAdFCZLUQ/ARiZ6f4AjWua2dhq4IaNEWKgNjFSi3ED2AhmEKxUXw3PrBQQwQbI6SSiJhiR1nwv6uwlXhguJc5cw4zl3svhTGIM1ziV8RvXGD4BW1BfMFDnvhejPEo7hJM7/HtfRlPJpg+xlQxxhlsYEv2dpxjG5sYKMb4Az6hHEMYQSXKUPpakxI0II0efEYnmtGCH5hBW+Q6curSaIxGnuGj7LmNoxt96A9RGnOYj1xvrBl0YQzTMd0TqlGLJsyiHTWoQkXs6zCBr6iPXGXUpNAa2pbgUrCCfRzhCofYwWJMsIZd2Wd8gT2sR4cLUXsY2pMc3h/J1+kUP/EvgbvHKo7zaG/JfipJ5AGWcJPA/cVydJekvX57xv8BD7eoP535NRkAAAAASUVORK5CYII=",

	//默认UA图标，预设同上，如不喜欢内置默认，可以再这里修改。
	DEFAULT_UA: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACKklEQVQ4jbWPT4gSURzHXzqDzr6ZgefD+fd0YJynjI62ghhqZApLdCnwkpAn87CXvO4SHTqKhw4JIl5aloiCIBChBTstHj10CXYpIRbSdXGLWDoG0ynZFSNY6Ae/y+/zPl++D4D/OBAAsHZZmfA8/7Lb7bKXskVRfCVJ0kQUxTbLsrssyz53uVxbAAD7n7IgCHcJIXPLsj7puj4lhEw0TZv6/f5TnuePGIZ5vFJkGOYGQui6JEm7lNJJPB4/jEaji7Us6yAUCn3GGJ95vd4ny74LQrgXDoergUBgn1I6Nk1zbJrmhFI6MQxjaprmOBKJ/AmZQAivLmxN03SE0FE2m70dCoXeKoryw7btj9Vq9VG9Xt8sl8sN27ZHuq6PDcM4VFX1FCG0tQgwDGMdY/w1nU7ngsHgu42NjdedTufa+Yq5XG5bVdUTXdcPFUU5lmW5tYCFQoH6fL4TVVU3W63WuuM4zPIfIYQNjPE3VVUP/H7/jBDydAF3dna8iqKMeJ7fd7vd95ZlSmkgkUi8CYfDQ4TQGCE0tyzr4YVHmUxmm+O4nyzLfgcA3D/P2u02P5/PBULIC0EQjjHGXyqVSuJCwHA4RJFI5D1CaFwoFBqWZeGlIh6O40Yej+csmUy2l1sCAADo9/t6Pp/fLZVKNx3HubKEH7jd7l+xWGyv1+vJKwMAAMBxHK7ZbGrnTi4I4S1Zlj8Ui8Vns9lM+qu8alKp1FqtVrszGAySq/hvbPGRIDMl+58AAAAASUVORK5CYII=",
};
/******************************************************************************************
 *这里是图标弹出TIP文字的自定义设置。
 *******************************************************************************************/
var TipShow = {
	tipArrHost: "网站域名：", //域名
	tipArrIP: "网站IP：", //IP
	tipArrSep0: "", //分割线，留空就没有
	/*这里会显示 服务器信息	ServerInfo*/
	tipArrSep1: "", // 分割线，留空就没有
	/*这里会显示 网站IP信息*/
	tipArrSep2: "--------------------------------", //分割线，留空就没有
	/*这里会显示 我的信息*/
	tipArrSep3: "--------------------------------", //分割线，留空就没有
	/*这里会显示 网站SEO信息*/
	tipArrSep4: "--------------------------------", //分割线，留空就没有
	tipArrThanks: "Thx&From：", //感谢：xxxxx 来自xxxx
};
/******************************************************************************************
 *这里是自定义服务器信息显示，可以根据需要截取(只支持函数操作)。
 *******************************************************************************************/
var ServerInfo = [{
	label: "服务器：",
	words: "Server"
}, {
	label: "网站编码：", //项目名
	words: "Content-Type", //http头信息关键字
	//截取或替换的函数，返回的是null就是在没有结果的时候自动隐藏该项
	regx: function(word) {
		if (word && word.match("=")) {
			word = word.substring(word.indexOf("charset="));
			word = word.substring(8, word.length).toUpperCase();
			return word;
		} else return null;
	}
}, {
	label: "网站程序：",
	words: "X-Generator"
}, {
	label: "网站语言：",
	words: "X-Powered-By"
}];
/******************************************************************************************
 *这里是UA自动切换规则列表。
 *支持正则匹配。
 *******************************************************************************************/
var UASites = [{
	url: "http://wap.", //WAP用UC浏览器
	label: "UCBrowser"
}, ];
/******************************************************************************************
 *RefererChange，破解反外链。
 *@FORGE：发送根站点referer
 *@BLOCK : 发送空referer
 *******************************************************************************************/
var RefererChange = {
	'wsj.com': 'https://www.google.com/', //免登陆或订阅看全文
};
/******************************************************************************************
text 为运行参数，如果无需参数，直接删除text属性，目前只支持 %u 为当前网页完整地址；
exec 为打开路径，可以是任意文件和文件夹，支持相对路径，相对于配置文件；
除了以上属性外，可以自定义添加其他属性，如果快捷键accesskey等。
=======================
{}, 为分隔条 
=======================
如果设置了id属性，会尝试获取此id并移动，如果在浏览器中没有找到此id，则创建此ID。
=======================
自带命令函数：【showFlagS.command】-----形式类型：
1、是非常简单的POST,如：
showFlagS.command('Post'（类型声明）, this.tooltipText（提交的URL）, aPostData（提交的数据）); 就这么简单，其他东西一概没有。
--------------
2、通用的GET，默认就是这个了，不用声明类型，最终结果为，新标签打开  url+参数  形式的网页。
showFlagS.command("网址", "参数1", "参数2", "参数3", "参数4", "参数5"，"参数6")
网址可以是：tooltipText(编辑项的tooltiptext,方便查看)，可以是查询API或网址；
网址也可以使用以下参数,参数有（当前网页的）:
ip：IP地址；
host：域名；
basedomain：主域名；
url：完整地址；
-----------------
3、功能相对比较强大的动作模拟（感谢FlagFox!!），可以参考与FlagFox，本脚本增加识别按钮class类名，使用方法如下：
showFlagS.command('Action','http://ping.chinaz.com/', 'host', 'IP', null,'but')
			    	Action：	声明类型，如果要使用模拟提交功能必须先使用Action声明；
'http://ping.chinaz.com/'： 	目标网址，推荐写在tooltipText，用this.tooltipText代表，方便使用的时候查看
					 host： 	打开目标网页时填写你输入数据位置的ID，
					   IP： 	这个是你需要输入的数据，内置IP，host,basedomain,url，具体代表请参考第二条。
					 null： 	点击使你输入的数据生效或提交按钮的ID，遇到奇葩网站提交按钮没有ID的话可以填写null，用下面一条解决
					  but: 		点击使你输入的数据生效或提交按钮的类名（class）
-----------------
还有一些其他的，比如编辑文件
showFlagS.command("Edit", "文件路径，支持相对路径")
showFlagS.command("Copy", "函数或者字符串")
*******************************************************************************************/
var Menus = [{
	//菜单名称
	label: "地址IP",
	//图标
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAt0lEQVQ4jcXTsWoCQRSF4Q8SsNEitUnhM6RQUtjb+xixTRHIG+SFks7GVxBksbBPGVjWQpsjSNhdXUjIhb+4c5l/mMMMv1g93IfeWf8Qhhi0CcYowmMosAtbfGCO2zrBFGV4CiUOP/iK5GrBHu94wTqSz7rrNAnKzOAtgm0yuUpQ4RkzLCNY4a5LBlU4ZG3RJYOT4BsbvKLfRVDlxAlGuKnb3CY4D7G1/l/Q9JSLzC5W02c69X9TR6H4UVapsaP+AAAAAElFTkSuQmCC",
	//child:[  ]内为当前菜单的下级菜单配置；
	child: [{
		label: "PingIP(aizhan)",
		tooltiptext: 'http://ping.aizhan.com/', //提示文字
		oncommand: "showFlagS.command('Action',this.tooltipText, 'site','host', null,'btn02')",
		image: "http://www.aizhan.com/favicon.ico"
	}, {
		label: "PingIP(17ce)",
		tooltiptext: 'http://www.17ce.com/site/ping',
		oncommand: "showFlagS.command('Action',this.tooltipText, 'url','host', 'su')",
		image: "http://www.17ce.com/smedia/images/favicon.ico"
	}, {
		label: "PingIP(chinaz)",
		tooltiptext: 'http://ping.chinaz.com/',
		image: "http://seo.chinaz.com/Chinaz.ico",
		//oncommand: "showFlagS.command('Action',this.tooltipText, 'host', 'host', null,'but')",
		oncommand: function() {
			var cont = content || window.content ? window._content : gBrowser.selectedBrowser.contentWindowAsCPOW;
			var aPostData = "host=" + cont.document.location.host + "&alllinetype=全选&linetype=电信&linetype=多线&linetype=联通&linetype=移动&linetype=海外";
			showFlagS.command('Post', this.tooltipText, aPostData);
		}
	}, {
		label: "PingIP(CA)",
		tooltiptext: 'http://cloudmonitor.ca.com/zh_cn/ping.php?varghost=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://cloudmonitor.ca.com/assets/flavors/img/ca/favicon.png"
	}, {
		label: "IP地图位置",
		tooltiptext: 'http://www.264.cn/ip/',
		oncommand: 'showFlagS.command(this.tooltipText, "ip",".html");',
		image: "http://www.264.cn/favicon.ico"
	}, {
		label: "路由跟踪",
		tooltiptext: 'http://www.domaintools.com/research/traceroute/?query=',
		oncommand: 'showFlagS.command(this.tooltipText, "ip","&search=traceroute");',
		image: "http://whois.domaintools.com/favicon.png"
	}, {}, {
		label: "旁站(aizhan)",
		tooltiptext: 'http://dns.aizhan.com/?q=',
		oncommand: 'showFlagS.command(this.tooltipText, "ip");',
		image: "http://www.aizhan.com/favicon.ico"
	}, {
		label: "旁站(264.cn)",
		tooltiptext: 'http://www.264.cn/sameip/',
		oncommand: 'showFlagS.command(this.tooltipText, "ip",".html");',
		image: "http://www.264.cn/favicon.ico"
	}, {
		label: "旁站(114best)",
		tooltiptext: 'http://www.114best.com/ip/114.aspx?w=',
		oncommand: 'showFlagS.command(this.tooltipText, "ip");',
		image: "http://www.114best.com/favicon.ico"
	}, {
		label: "旁站(Bing)",
		tooltiptext: 'http://cn.bing.com/search?q=ip:',
		oncommand: 'showFlagS.command(this.tooltipText, "ip");',
		image: "http://cn.bing.com/s/a/bing_p.ico"
	}]
}, {
	label: "域名DNS",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVQ4jXXTzUtVURQF8J+F9ugPKBTFbBAUNCl4GmE5LJI+Jn1IUP9Ck3DarEEIJVj2SKwg6AO0aNAgfZHRP1CaFVEPykGDnNekwd4XrpfngsvhHM7ae5291mUjunAMT9DCen4tPMMJbLMJdmISn/EQl3AEw7iIGaxiCt3tyPNYSsLWPO9Ff64HMIomXqKnIHdm5yUMVApfxzd8SGULGMv1dvGc4/iUcqu4id84j30pv5lKVnASHuNBSXYZk3iEjtzvzWZ13MUc/MDlNmS4hffYkfvT2XkgVf2EPxjJCzWcwg1cEXb+wxvM4guu5d3DwmLrOJqH4/iast/ir3Dnaqo5i+3VAi3hcx8+pjQp+x3ubPK8C8UTnuIeDooB7S9duo/pNuQtaOA5Ec8VYc2CsGqPGNha7qsYzGZniPxPYVGEpCkiu4zvmKiQe/E6FdSKw24Rz8VUVBdW7caukux6qnyVhTagR8RzVYTkHA5hSAy2IeLcaEcuUBPxnBcTLn7nX3iRc6mVCf8BM0VdfnCTBIgAAAAASUVORK5CYII=",
	child: [{
		label: "综合查询",
		tooltiptext: 'http://seo.chinaz.com/?q=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://seo.chinaz.com/Chinaz.ico"
	}, {
		label: "网站备案",
		tooltiptext: 'http://icp.aizhan.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "http://www.aizhan.com/favicon.ico"
	}, {}, {
		label: "Whois(Shosts)",
		tooltiptext: 'https://www.sugarhosts.com/members/whois.php?domain=',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "http://www.sugarhosts.com/templates/sh_christmas2009/favicon.ico"
	}, {
		label: "Whois(cndns)",
		tooltiptext: 'http://who.cndns.com/?d=',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "http://www.cndns.com/favicon.ico"
	}, {
		label: "Whois(aizhan)",
		tooltiptext: 'http://whois.aizhan.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://www.aizhan.com/favicon.ico"
	}, {
		label: "Whois(ChinaZ)",
		tooltiptext: 'http://whois.chinaz.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "http://whois.chinaz.com/Images/Chinaz.ico"
	}, {
		label: "Whois(Dtools)",
		tooltiptext: 'http://whois.domaintools.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "http://whois.domaintools.com/favicon.png"
	}, {
		label: "Whois(dnsw)",
		tooltiptext: 'http://dnsw.info/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "http://dnsw.info/favicon.ico"
	}, {
		label: "DNS健康",
		tooltiptext: 'http://www.intodns.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "http://www.intodns.com/static/images/favicon.ico"
	}, {
		label: "黑名单",
		tooltiptext: 'http://rbls.org/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://rbls.org/favicon.ico"
	}]
}, {
	label: "网站安全",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4jYWTMUtcURSEj4u2YmGZSh5rsdzzfU3+gq0QLISFhFhom3R2lkLSpA4Ee22sJIaYNkIC1kkpaiF2wUZhk+a95bk+NxemOjNzhsPciI5XSlkCdtUr9QrYLaUsdXEfPHUhM9eBU/VO/VvjDjjNzHV14ZEwM5eBDfUQ+NMSPkA9OwQ2MnO50ffU/YmNXeJRO5G6HxG9iIgecNwifs3Ml8CLBuoQeAuctHjHjcEMsNcMMvNVk6whZOazwWDwHHjdMtiLiJnmBjvAqI75Rv2i/mzhB/C5TjECRpm50z7imnpfD7fV6447XAPb9ZL7zFwbGwAD4KKONtWg5lwAg7FBVVXz6kF9g3fACfB9At/U97XZQVVV85MlGqq3wK/M/Kh+aAP4pP5Wb9XhozL1+/1F9WhaF2oc9fv9xc4qAyvq5RTxJbDy5F+IiFlgS73pEN8AWxExO80gImJO3QTOW6U5VzcjYu5/4nGSUsoqcAaclVJWn9r8D9Ly4rUXRHEbAAAAAElFTkSuQmCC",
	child: [{
		label: "安全扫描",
		tooltiptext: 'https://www.virustotal.com/#url',
		oncommand: function() {
			var cont = content || window.content ? window._content : gBrowser.selectedBrowser.contentWindowAsCPOW;
			showFlagS.command('Action', this.tooltipText, 'url', cont.document.location.host, 'btn-scan-url')
		},
		image: "https://www.virustotal.com/static/img/favicon.ico"
	}, {
		label: "WOT Scorecard",
		tooltiptext: 'https://www.mywot.com/en/scorecard/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "https://www.mywot.com/files/favicon.ico"
	}, {
		label: "安全评估",
		tooltiptext: 'https://www.siteadvisor.com/sites/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "https://www.siteadvisor.com/favicon.ico"
	}, {
		label: "钓鱼分析",
		tooltiptext: 'http://toolbar.netcraft.com/site_report?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://toolbar.netcraft.com/favicon.ico"
	}, {
		label: "安全查询",
		tooltiptext: 'http://webscan.360.cn/index/checkwebsite?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://www.360.cn/favicon.ico"
	}, {
		label: "安全浏览",
		tooltiptext: 'http://google.com/safebrowsing/diagnostic?site=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://google.com/favicon.ico"
	}]
}, {
	label: "站点搜索",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAABHklEQVQokZ3TPyjFURwF8I8/r5fyUhZRUoqJ/Q0Gg0lGZbJgsxmUiSR5+TOIkWJQBhkUFvUGGZVRBsmCPMJkUIZ7vbxfnidn/J57zj3f+/1efkYKAzhAAR94wylGUF9GRyTn8IBzrGAi1vJ4wjZafhLXYgavmEVTgs9gDPfYQUPSIItHLMY2ymE0XjKeJHK4QfsvYkKbeaHFIlI4wmGF27+wgPfvhTROsI/qPxhMC9MpogobuEBjBXENdnGbJAaFeQ9XMMgKk1hNEhns4Rp9ZcRdOItJO5Ox6tCGY9xhORp1owdTuMIler+LU8K2bQnL0Yz5eLgQ4xaEnjejYRFpTOIFa0r3vDUmGEI/OoRtLUEOz1hS4ZOUw7rwmv8SfwIjnjkY6akXagAAAABJRU5ErkJggg==",
	child: [{
		label: "维基域名",
		tooltiptext: 'http://zh.wikipedia.org/wiki/Special:Search?search=',
		oncommand: 'showFlagS.command(this.tooltipText, "host","&go=Go&variant=zh-cn");',
		image: "http://bits.wikimedia.org/favicon/wikipedia.ico"
	}, {}, {
		label: "类似网站",
		tooltiptext: 'https://www.xmarks.com/site/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://www.xmarks.com/favicon.ico"
	}, {
		label: "类似网站",
		tooltiptext: 'http://www.similarsitesearch.com/cn/site/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://www.similarsitesearch.com/favicon.ico"
	}, {
		label: "相似页面",
		tooltiptext: 'http://www.google.com/search?q=related:',
		oncommand: 'showFlagS.command(this.tooltipText, "url");'
	}, {
		label: "反向链接",
		tooltiptext: 'http://www.google.com/search?q=link:',
		oncommand: 'showFlagS.command(this.tooltipText, "host");'
	}, {
		label: "反向链接2",
		tooltiptext: 'http://www.google.co.jp/search?q=link:',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain","+-site:","basedomain");'
	}, {
		label: "内部链接",
		tooltiptext: 'http://www.google.co.jp/search?q=link:',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain","+site:","basedomain");'
	}, {
		label: "Email搜索",
		tooltiptext: 'http://www.google.co.jp/search?q="*@',
		oncommand: function() {
			showFlagS.command(this.tooltipText, "basedomain", '"');
		}
	}]
}, {
	label: "开发审查",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABGElEQVQ4jb3TOy/DURgG8F9dKjGowcRADUIwdHLpRCJG9RXEamBAY7H6AMQn0NnOQInbiJFJ7EYJYejbtP2njTB4kic5570973nPOfwD0ugPpn+bPIsSLoKlsLVEB/LYwh7uUMR4sIjbVkXasREB+zjEKlKJuG0coTNZII8bTMc+hba6dbXQJM5VZtKAnVBuhiWsheooHrBYdXZhJYy7YRvDQKwLeMUbFtCNTVxhDtZxGYF9yOERxyozeMEnDtBb11URJ0K5UOfIhe0L7/iIo/UkjjWBJ3jGSMI5hftQbpbcUCDZQRXT0WamiY/KdZ5Sm8EyhpENDmIomK1j9UFdY57aLZygjLMfWFZ50jPJljIJ1Vb806dqiW9kvzxuhp8KgQAAAABJRU5ErkJggg==",
	child: [{
		label: "BuiltWith",
		tooltiptext: 'http://builtwith.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://builtwith.com/favicon.ico"
	}, {
		label: "W3C Validator",
		tooltiptext: 'http://validator.w3.org/check?uri=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://www.w3.org/2008/site/images/favicon.ico"
	}, {
		label: "W3C CSS Validator",
		tooltiptext: 'http://jigsaw.w3.org/css-validator/validator?uri=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://jigsaw.w3.org/favicon.ico"
	}, {
		label: "Validate.nu",
		tooltiptext: 'http://validator.w3.org/nu/?doc=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://www.w3.org/2008/site/images/favicon.ico"
	}, {
		label: "WAVE a11y 检查",
		tooltiptext: 'http://wave.webaim.org/report#/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://wave.webaim.org/favicon.ico?v=1395952834"
	}, {
		label: "SSL 服务器测试",
		tooltiptext: 'https://www.ssllabs.com/ssltest/analyze.html?d=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "https://www.ssllabs.com/favicon.ico"
	}, {
		label: "SSL 检查器",
		tooltiptext: 'https://www.sslshopper.com/ssl-checker.html#hostname=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "https://www.sslshopper.com/favicon.ico"
	}, {
		label: "Header Check",
		tooltiptext: 'https://quixapp.com/headers/?r=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "https://quixapp.com/wp/wp-content/themes/quix-theme/images/favicon.png"
	}, {
		label: "URL 解析器",
		tooltiptext: 'http://urlparser.com/?linkFrom=flagf1&url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://urlparser.com/favicon.ico"
	}, {
		label: "编辑页面",
		tooltiptext: 'http://www.printwhatyoulike.com/print?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://www.printwhatyoulike.com/editor/img/favicon.png"
	}]
}, {
	label: "镜像快照",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSElEQVQ4jc3Tu0tcYRAF8N+GXVhWs+hGAiIi+Fh8gA+wyDZCEPf/MH0KNUXKZUmagNikSGETxEIb7S01uEUaQUQI2gRB7EQIQghrceeCXJSYLlN8MN89Z+6ZM/Pxv8Uz9GAIvcj/C3kYqzjGJX7gK2rI/Y08ie9o4wItnEW+h+4MvoaJNHmOnQCvo4oi+vAWcxnyaKjbDa46brCPF3E5J/EgjZd4jYrEo4Pg1GEl/t4I8Hv8xgYK0f9n/MGnwDSCsyyONprx8R1+RTv5KLCGW3wITDM4SzCPaxyG1BJmQ2oaFbxCOTCt4MxDB7ai4qZkImUMRjsLGROrOMF2cMEYvkWRKxzhp8fHOIORzJ1+fMRpyDvHF0x7wiJBV/S5KDH2jcSL0lPInZLNmpV4MI6pyAceUFBy753kJMtTiULp6AqRFzLkfKgtwh2F4z1a0Vqb4QAAAABJRU5ErkJggg==",
	child: [{
		label: "Google快照",
		tooltiptext: 'https://webcache.googleusercontent.com/search?q=cache:',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "https://webcache.googleusercontent.com/favicon.ico"
	}, {
		label: "Gigablast",
		tooltiptext: 'http://www.gigablast.com/search?q=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://www.gigablast.com/favicon.ico"
	}, {
		label: "WebArchive",
		tooltiptext: 'http://web.archive.org/web/*/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "http://archive.org/images/glogo.jpg"
	}, {
		label: "Google(限文字)",
		tooltiptext: 'https://webcache.googleusercontent.com/search?strip=1&q=cache:',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "https://webcache.googleusercontent.com/favicon.ico"
	}, {
		label: "Yahoo!快照",
		tooltiptext: 'http://search.yahoo.com/search?p=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://search.yahoo.com/favicon.ico"
	}]
}, {
	label: "便捷工具",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiUlEQVQ4ja2NQQqDQBAE6+v+RyUIQkAQcsjBix/wAX4jl1WGZrY3gTQU3TPbzMKf1AG9QCVfdPHAKAfHZF/rAPAw7t5uTXJ9SrLrMCcQ3HWsnoWmlkLMcXYOwBrc5VX6Tb0K2Rz3vBPim3MANvl5+9Jv7cYjWQeAQw4eJmsXgAE4BcR1N2SHftYHOcZOEltHUS4AAAAASUVORK5CYII=",
	child: [{
		label: "二维码",
		tooltiptext: 'http://atomurl.net/qrcode/?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://atomurl.net/qrcode/favicon.ico"
	}, {
		label: "视频解析",
		tooltiptext: 'http://www.flvxz.com/?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://www.flvxz.com/favicon.ico"
	}, {
		label: "天涯脱水",
		tooltiptext: 'http://www.tianyatool.com/cgi-bin/bbs.pl?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://www.tianyatool.com/favicon.ico"
	}, {
		label: "TinyUrl",
		tooltiptext: 'http://tinyurl.com/create.php?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://tinyurl.com/siteresources/images/favicon.ico"
	}, {
		label: "is.gd",
		tooltiptext: 'http://is.gd/api.php?longurl=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://is.gd/isgd_favicon.ico"
	}, {
		label: "Goo.gl",
		tooltiptext: 'http://www.ruanyifeng.com/webapp/url_shortener_plugin.php?longUrl=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "http://www.ruanyifeng.com/favicon.ico"
	}]
}, {
	label: "Alexa排名",
	tooltiptext: 'http://www.alexa.com/siteinfo/',
	oncommand: 'showFlagS.command(this.tooltipText, "host");',
	image: "http://www.alexa.com/favicon.ico"
}, {
	label: "WolframAlpha",
	tooltiptext: 'http://www.wolframalpha.com/input/?i=',
	oncommand: 'showFlagS.command(this.tooltipText, "host");',
	image: "http://www.wolframalpha.com/favicon.ico"
}, {
	label: "BugMeNot",
	tooltiptext: 'http://bugmenot.com/view/',
	oncommand: 'showFlagS.command(this.tooltipText, "host");',
	image: "http://bugmenot.com/favicon.ico"
}, {
	label: "翻译此页",
	tooltiptext: 'http://translate.google.cn/translate?u=',
	oncommand: 'showFlagS.command(this.tooltipText, "url");',
	image: "http://translate.google.cn/favicon.ico"
}, {
	label: "内嵌翻译",
	oncommand: function() {
		gBrowser.loadURI("javascript:(function(){var%20s%20=%20document.createElement('script');%20s.type%20=%20'text/javascript';%20s.src%20=%20'http://labs.microsofttranslator.com/bookmarklet/default.aspx?f=js&to=zh-chs';%20document.body.insertBefore(s,%20document.body.firstChild);})()");
	},
	image: "http://labs.microsofttranslator.com/favicon.ico"
}, {
	label: "存为PDF",
	tooltiptext: 'http://www.web2pdfconvert.com/engine?curl=',
	oncommand: 'showFlagS.command(this.tooltipText, "url");',
	image: "http://www.web2pdfconvert.com/favicon.ico"
}, {
	label: "整页截图",
	oncommand: function() {
		var cont = content || window.content ? window._content : gBrowser.selectedBrowser.contentWindowAsCPOW;
		var canvas = cont.document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		canvas.width = cont.document.documentElement.scrollWidth;
		canvas.height = cont.document.documentElement.scrollHeight;
		var ctx = canvas.getContext("2d");
		ctx.drawWindow(cont, 0, 0, canvas.width, canvas.height, "rgb(255,255,255)");
		saveImageURL(canvas.toDataURL(), cont.document.title + ".png", null, null, null, null, cont.document);
	},
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAm0lEQVQ4jbWTUQrDIBBEH9QcokjZe+T+ieQaJXiKfvSjIyyJRmzpwHzsuo47qwJMgIlBvIpPMGAFEnAXUyOOLYEEbG7D1oirAsEV3sQoltivdwWO6Ap4C7UWIwMzqBUY8BTtGwvDAmWIBjyAGcjirJypJhwt+HvfdWoGXmJWbgeW0tHPAoHzvQ9Z6KE7xL8LRD5+FxoPqYfL7/wGEBc4QhYRpZIAAAAASUVORK5CYII="
}];
/******************************************************************************************************************
 *这里是自定义浏览器标识UserAgent设置
 *******************************************************************************************************************/
var UAList = [{
		//菜单文字
		label: "IE8-Win7",
		//浏览器标识字符串 UA
		ua: "Mozilla/5.0 (compatible; MSIE 8.0; Windows NT 6.1; Trident/4.0; GTB7.4; InfoPath.2; SV1; .NET CLR 3.3.69573; WOW64; zh-CN)",
		//是否附加 navigator.appVersion
		appVersion: true, //true 脚本会去掉UA字符串开头的“Mozilla/”，作为navigator.appVersion
		//显示的图标
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB7klEQVQ4jbWSu2tUQRTGbyT4QDF2ggRRtFvZ3DvfkaAEWcEXWwoGtxEbFXyAQsjK7p0zVlFERcw/oNhYWVhYSCCdrUSIhRZBLEzcnTnHRyIubrRws3uXjQQLD3zFzPD75sw3J4r+d+VOza4fsj5nrB8lDqV8qrvXhPZe8VuTVI/A6hixPiHWeXLyCqxlsJaT8dqOv8Kw9WFifQ4ni+T0V1usdbDcIQ4l2PrwqnBi/QGwvl2B4LQJpz/AutxZy0xckbj35nIYAOuLNsz6hjhcMKk/YVjuwcnX1v6yYXE9BpSGIjn9/sdAPiP1x9qHhel+42Qya96TA1gnMm/2xskkWG+1NEEszzpPkcWkKoey7e+Ek9lMYD/B8i0rYvkCJwIWhdOaYX+8bWBYz8FpsxOezBH7o6ioMVZhrCK29f2ohhFUw0hc9Qfjq7Kthd9YByePiPUlWMNKi8Sh1JmLdxtgw3VimSKWKTi5O3jtw6YoiqJo19m5jWB5alI5CZaHmRw+Eofbxup5cvKYWJZaATYMh0vZ/Prg9GZiw+mkWiOwvO4aoIzA2gDLg/zY/OauH8iP+0GycobSUKRUCmC5DyfvwdqA0yaxLMHJDNlwOXfx05ZVp7CrCtP9SBf2UBqKxvpRsBzeV1nYHkVR39rwP9ZvsJlc4gd6n5MAAAAASUVORK5CYII="
	}, {}, //分割线
	{
		label: "Chrome-Win7",
		ua: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36",
		//appVersion项为字符串，脚本会直接以字符串为navigator.appVersion；
		appVersion: "5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZUlEQVQ4jX3SPUiWYRQG4AstJ4ewwiV3EQJrCXIJBIPIBBcpEBxcWvsBSQeDoNDBEKNNFGkQaW2sraYCB4WQSrAQ/b7SwZ/ox6/hPS+8Pr524F7Oc+77nPs8h8NxEl2Ywyp+Yh+fMYNOnHBMNGMCVdSOwSbGcCYlN+Hlf4gp5nE2JzegFe9LCn9hO/AD3wNVDKEOrmIKt8NzDRsYx3VcxAVcwy3cDPTkU8xhFwN4hQq6gzSMB2jDJXzAWuArJuFLdH2DfoygHR8LVpZwPpZctLhC9k01/MYdNGK0ZB/3cSPq8twO7BUSy2iJKVKBuyUCW/CpkDjAkxh3qZBfjD2kFpZhOklW0Bsi96JzKzpkh1SsfQZXSh4qeBpCXTjn6KGt4zLZ/T+O8VPff7GAwWRXf/AQ9SJO40WJSBV9eJuIzuKUJJrwKEbLiydlx5QLf4vOR8h51MeynuO17JTfyX5kKjzXFQn/APgEoX8xUiqtAAAAAElFTkSuQmCC"
	}, {
		label: "Chrome-linux",
		ua: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB50lEQVQ4jWNgoD4wZlWLWBVrWvVinXndh+vmdR9um9W83amZtLdASMWTD69WGZcOXbOad9fM6z78x4FfqkVt8MKqWcQwScq89sM7PJph+LdmwrYAdP3MJuXPPU1r3p9GVmxW+/6eWd2H02Z1H06b1344A8Nmte/3Mkj5csF1KwbNCzGv+/DSuOq1t1nth3/mtR9eGBY/8NROPxapErEmid+mQlA75UCkdtqhJhhWi1yDcIVRyb3F5nUf/pvVvO0yq327yrjsfgCya8xq3z8yKr1na1734TeS2BW4AWa1H05BBD/8MCy+ZaedtC8Y3e962aerzGreHkcY8OEXwoC6D3DbTCqfr1WPXBOGboB+9rk6s5p3cAPMaz/8YWBgYIR4ofT+CiST/5lUvvAzq/1wA0nsjVHFEycUL9R9uAl3gUrwwhj0+DaueRNgmH85TzfnbJl00GwZk8pna5HVGORf60OKRW02s9r3t1Gj8MM/89oPt8xqP+w0qnzhY1b74R9SAH4RNM6XQ02Fbt3mZnXvv6L73bTqVYJpzbtLyAZrJ++Jx5oa5fwmW5vVvX8M11z77phZzatchIHvP2sm7IrFqhkORB14NOO3F5rVvDtsUvbQ1az2/T2z2vfndDJPtooYJknh10wGAACB6IAc8VaKWAAAAABJRU5ErkJggg=="
	}, {
		label: "Android",
		ua: "Mozilla/5.0 (Linux; U; Android 2.0; en-us; Droid Build/ESD20) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAASElEQVQ4jWNgQANLjln+RxcjRg5D4apTrv+XHLNEwURrhtHomgkagq4JF6adAWQBdD8S6wI4e9SA/1gDdODTAbpCkhMQXQ0AAEsuZja4+pi7AAAAAElFTkSuQmCC"
	}, {
		label: "Googlebot",
		ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAPCAYAAADtc08vAAABRklEQVQokXXSv0uVURwG8M+Sg5FrjoHYHyCIWyIiOCmITTa1uLq4NLi5aYrSKHRJwuGGy1WHBiEdvKUpuAiKcBMvai03CrTs2vCeC8fDe79w4D3n+f543uf5cj9aMYIizvAH1zhFAQN4oEl04C1quGtyvuM1HqfFnfiUJN/gHCeBwVWEfYibPML7pPgYSyFxCMM4QD3gdcygBcbwO5n8Esvhvo6noUE85BLPoJQANfRgIdwv0I2tHE0WhP+MH/8Fev3YxAqm8SunwQ78zAH+YheT6MK3Jq4c5TG4ww+UMYcnQae8vDKsJY+HGMcGKviCPryKXGicRXiRuDCF0SSxiImkwRV6oS0I1QBKQfU32MPn8P01yqljVtgDMp+3I3BftkgFfEQ1YbSKdkl04l0TV2Jx5/OKG/EQz8OEKm5lllZkmzkY04b/fzejj8A3wWEAAAAASUVORK5CYII="
	}, {}, {
		label: "Opera",
		ua: "Opera/9.80 (Windows NT 6.1;zh-CN) Presto/2.12.388 Version/12.14",
		image: "http://www.opera.com/favicon.ico"
	}, {}, {
		label: "Safari-Mac",
		ua: "Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10_5_8; ja-jp) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4jYXTv0vWURQG8I9lvP4oCQvRIRN/VkPSlLzkJCRBUoJkiP+DDg3iKNTQkC01qKBCSLw1NBoRQaENLREILQ0RlIODhGIgosM9wtc3Xz1w4d5zz/Pcc55zLkdbNc7ixDFxoAMPcBu9eIRlfMUrDON8KXAZRtGPd9jBFr7hM35jN863SpEM4WMELuAmzuEMLmMEq0F85zCCqQCPoTx8tWjLxFzHd/xBu6KLLbxwULAcGmJ/D63owjaeZgke4h9uFGU1jAk8jpUL/xv8xEWoxKdIrT5erMN9Sdj3WMEltEitfYJN5OE0vkgK16MGFRgM0hlM4kqsqgxBt6h5XlK4JVJsxkvMRnnXikqbw1907jvuSh0YifM4BmLf4KA1Sl1YzGiiBkvSwPREmnASTRlwDoV47L9ZyGMDv9CXIamWJrUVrwP8rBi8b71Se3bxAdOSiAWshf+5JHxJa5ZU/iEpvYl1vJX+StlR4KxdkKYuj6s4dVjQHmMlTZu/PHeoAAAAAElFTkSuQmCC"
	}, {
		label: "iPhone", //伪装 iPhone，查询http://www.zytrax.com/tech/web/mobile_ids.html
		ua: "Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_1_2 like Mac OS X; en-us) AppleWebKit/528.18 (KHTML, like Gecko) Version/4.0 Mobile/7D11 Safari/528.16",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABB0lEQVQ4jZXSSyvEURgG8N8MkcaGsGCnWGAxIZqymA2lpCFsZilJESKUS0nDgpLbQqyUlc/gu1mck+am/99Tp845z3me93JektGNE3yjmOJ9Ddpwhg3cofBfgwKuMItbdKYRZZCN+yV84RrDacQjOEIFh1jDJo5jJpeYF0prQB4vmMOQ0LA9oYEL8S4fjQ7QUi3uEGqcTlHeLk7RWk1MxPSyTUTVGI+BcvVECesJYijH1YBF4a+TUMJWM2ISFykM+vGMsXqiC/foS2EyhXeM1hPbWElhkMOTMDM1GMQDehIMVoVhyzQjyzhHbzQqYjlGy2EGjxj4y70dO/jEB26wj9d4fhOm8Rc/nDkiWslhowkAAAAASUVORK5CYII="
	}, {}, {
		label: "UCBrowser",
		ua: "Mozilla/5.0 (Linux; U; Android 4.4.4; zh-CN) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/10.1.3.546 U3/0.8.0 Mobile Safari/534.30",
		image: "http://www.uc.cn/favicon.ico"
	}, {}, {
		label: "BaiduYunGuanJia", //伪装百度云管家，解决某些情况下百度盘出无法下载和无限加载的问题。
		ua: "netdisk;4.4.0.6;PC;PC - Windows;6.2.9200;WindowsBaiduYunGuanJia",
		image: "http://pan.baidu.com/res/static/images/favicon.ico"
	}, {
		label: "115Browser",
		ua: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36 115Browser/5.1.5",
		appVersion: true,
		image: "http://www.115.com/favicon.ico"
	}, {}, {
		label: "Firefox31-Linux",
		ua: "Mozilla/5.0 (X11; Linux i586; rv:31.0) Gecko/20100101 Firefox/31.0",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1UlEQVQ4jW2SO2hUYRCFJ7qIGGOhorig2WLZu9f/3vmOvaDBwsbGB4Eoltbx2aaJBLExpBAtDGJhI0hstbBQtPBBBImwCRLQzseCaLESXZt/w+V6fzjVnDP/zJlj9v+rAcHdJ9x9MmICCGa2sYJvQ+12e4eZ1UII+4FpSXclzbr7ZeASMAc8BKbzPG+b2dC6OkmSEeCapHOSFtz9KnBB0uHSVMeBj8AH4Gyz2dxmZmYhBID3wE9JHUmPJT0IIewrjhk/Gpf0Gvgu6War1dppwBjwSVJ/AOAtcDBJkpHyvsABSe+ArrufNOCOpLVig4hl4Gi5gbvvAp5L6rv7dZP0tSwG/kqaCSFsLTdI03QP8CZyV03SSkn8Q9KTPM9PV50sz/NDkl4M+CZpuTTBF+CEuw9nWbbb3ZMQwqaCBxej4X3gs0laqti/A9wDnklaBI5F/QZ3v1HgLZik+xUNBqu8knQ+y7K9jUZjc8xKJ9Z77j5pwDjQLYl7wDwwFkLYnqbpKDAFfCtwXoYQmoOAzFdM0JO0BDyVtCjpd6HWlXRm3VlJDUmPgD9V65TwC5iq1+tbyvcdBW7FmFaKY2KvVOVjkLJhdz8VjV2NwjVJK8Btdz9iZrWi5h+UYfMbxqhMHAAAAABJRU5ErkJggg=="
	}, {
		label: "Firefox33-Mac",
		ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABaElEQVQ4jX3Sz0vUURQF8M/MYDWRCS2arIgiIZEEXQQSSBFBm6BFC4kKIkjEQCmFaGUUGSoo9GNqkVNBm6AW0a6/I/p7WnzPyJcnduDC495zzn3vvkuFAXTQwDk8xTZ6+JR4gjP2wDV8wU28xlt0Y3YAJ3EbP8Jt1MUtvMQ3/MVHvMd3HCsaLeMPbqHZTx7CBkZxKTGSm1zH/prBqTynm5uAE9jCUNHtCn7iaC3XxDPciKYDd/CwEJ/FemZSYiHmc7gLm7hQIxzBm5AapRqLuIzJaG2rptxHBx9wP10WMJ7aAF6pfud4tHoYLrqM52n38Eu1FzCFtRgN9w26GCsMJvAVv7GE05gOdzKcMbyDx5gpDPZlBs/TcQMrMe5jJlrnM4zDdqOh2sSDaosT7ma0YD5RJ+2FZo2/g0G8wCza/xG38SDcwbI4hEeqN19VfWc70UluLZxya3fQwkWs4rNq73s5r6bWqgv+AYBxON0vXviZAAAAAElFTkSuQmCC"
	}
];
/******************************************************************************************************************
 *这里是查询源设置，只支持"GET"方式获取，taobao为脚本内置,可以自行按照示例添加。
 *不限定于IP，可以是其他相关的API，只要是你想要显示的都可以。
 *******************************************************************************************************************/
//查询本地信息
var MyInfo = {
	inquireAPI: "http://whois.pconline.com.cn/", //查询接口API 下同
	//截取函数,传入内容 docum 是XMLHttpRequest()的req.responseText，（具体可以百度	XMLHttpRequest()）。下同
	regulation: function(docum) {
		if (docum) {
			docum = docum.substring(docum.indexOf("位置"));
			docum = docum.substring(0, docum.indexOf("<h3>接口列表"));

			var addr = docum.substring(3, docum.indexOf("\n"));

			var ip = docum.substring(docum.indexOf("为:"));
			ip = ip.substring(2, ip.indexOf("\n"));

			var RemoteAddr = docum.substring(docum.indexOf("RemoteAddr"));
			RemoteAddr = RemoteAddr.substring(11, RemoteAddr.indexOf("<br/>"));
			if (addr || ip || RemoteAddr) {
				var MyInfos = "我的IP：" + ip + '\n' + "我的地址：" + addr + '\n' + "RemoteAddr：" + RemoteAddr;
				return MyInfos; //此处为传回值，为字符串
			} else return null;
		} else return null;
	}
};
//网站SEO信息
var SeoInfo = {
	inquireAPI: "http://seo.chinaz.com/?q=",
	regulation: function(docum) {
		if (docum) {
			var doc = docum;
			docum = docum.substring(docum.indexOf("baiduapp/"));
			var quanzhong = docum.substring(9, docum.indexOf(".gif"));

			docum = docum.substring(docum.indexOf("Rank_"));
			var Rank = docum.substring(5, docum.indexOf(".gif"));

			docum = docum.substring(docum.indexOf("blue>"));
			var sameip = docum.substring(5, docum.indexOf("<"));

			docum = docum.substring(docum.indexOf("域名年龄"));
			docum = docum.substring(docum.indexOf("blue>"));
			var domainage = docum.substring(5, docum.indexOf("<"));

			docum = docum.substring(docum.indexOf("创建于"));
			docum = docum.substring(docum.indexOf("blue>"));
			var start = docum.substring(5, docum.indexOf("<"));

			docum = docum.substring(docum.indexOf("过期时间为"));
			docum = docum.substring(docum.indexOf("blue>"));
			var lastage = docum.substring(5, docum.indexOf("<"));

			docum = docum.substring(docum.indexOf("备案号"));
			docum = docum.substring(docum.indexOf("</font>"));
			var beianhao = docum.substring(7, docum.indexOf("&nbsp;&nbsp;"));

			docum = docum.substring(docum.indexOf("性质"));
			docum = docum.substring(docum.indexOf("</font>"));
			var xingzhi = docum.substring(7, docum.indexOf("&nbsp;&nbsp;"));

			docum = docum.substring(docum.indexOf("名称"));
			docum = docum.substring(docum.indexOf("</font>"));
			var mingchen = docum.substring(7, docum.indexOf("&nbsp;&nbsp;"));

			docum = docum.substring(docum.indexOf("审核时间"));
			docum = docum.substring(docum.indexOf("</font>"));
			var shenhe = docum.substring(7, docum.indexOf("</td>"));

			docum = docum.substring(docum.indexOf("百度流量预计"));
			docum = docum.substring(docum.indexOf('_blank">'));
			var liuliang = docum.substring(8, docum.indexOf("</a>"));

			docum = docum.substring(docum.indexOf('库">'));
			var keydb = docum.substring(3, docum.indexOf("</a>"));

			docum = docum.substring(docum.indexOf('标题（Title）'));
			docum = docum.substring(docum.indexOf('red">'));
			var TitleN = docum.substring(5, docum.indexOf("</font>"));
			docum = docum.substring(docum.indexOf('10px;">'));
			var Title = docum.substring(7, docum.indexOf("</td>"));

			docum = docum.substring(docum.indexOf('red">'));
			var KeyWordsN = docum.substring(5, docum.indexOf("</font>"));
			docum = docum.substring(docum.indexOf('10px;">'));
			var KeyWords = docum.substring(7, docum.indexOf("</td>"));

			docum = docum.substring(docum.indexOf('red">'));
			var DescriptionN = docum.substring(5, docum.indexOf("</font>"));
			docum = docum.substring(docum.indexOf('10px;">'));
			var Description = docum.substring(7, docum.indexOf("</td>"));

			docum = docum.substring(docum.indexOf("30px"));

			docum = docum.substring(docum.indexOf('blue">'));
			var yasuo = docum.substring(6, docum.indexOf("</font>"));

			docum = docum.substring(docum.indexOf('原网页大小'));
			docum = docum.substring(docum.indexOf('blue">'));
			var yuanshi = docum.substring(6, docum.indexOf("</font>"));

			docum = docum.substring(docum.indexOf('压缩后大小'));
			docum = docum.substring(docum.indexOf('blue">'));
			var yasuohou = docum.substring(6, docum.indexOf("</font>"));

			docum = docum.substring(docum.indexOf('压缩比'));
			docum = docum.substring(docum.indexOf('blue">'));
			var yasuobi = docum.substring(6, docum.indexOf("</font>"));

			var info, infos;
			if (quanzhong && quanzhong.length < 3)
				info = "百度权重：" + quanzhong;
			if (Rank && Rank.length < 3)
				info = info + '  ||  ' + "GoogleRank：" + Rank;
			if (sameip && sameip.length < 6)
				info = info + '\n' + "同IP网站：" + sameip;
			if (sameip == "<!D") info = "暂时无法获取SEO信息 \n请稍后重试";
			if (domainage && domainage.length < 7)
				info = info + '\n' + "域名年龄：" + domainage;
			if (start && start.length == 11)
				info = info + '\n' + "创建于：" + start;
			if (lastage && lastage.length == 11)
				info = info + '\n' + "过期时间为：" + lastage;
			if (beianhao && beianhao.beianhao == 16)
				info = info + '\n' + "备案号：" + beianhao;
			if (xingzhi && xingzhi.length < 20)
				info = info + '\n' + "性质：" + xingzhi;
			if (mingchen && mingchen.length < 50)
				info = info + '\n' + "名称：" + mingchen;
			if (shenhe && shenhe.length == 10)
				info = info + '\n' + "审核时间：" + shenhe;
			if (liuliang && liuliang.length < 10)
				info = info + '\n' + "百度流量预计：" + liuliang;
			if (keydb && keydb.length < 10)
				info = info + '\n' + "关键词库：" + keydb;
			if (yasuo && yasuo.length == 1) {
				if (yuanshi && yuanshi.length < 10)
					info = info + '\n' + "网页大小：" + yuanshi + "KB";
				if (yasuohou && yasuohou.length < 10)
					info = info + '  ||  ' + "压缩后：" + yasuohou + "KB";
				if (yasuobi && yasuobi.length < 8)
					info = info + '  ||  ' + "压缩比：" + yasuobi;
			}
			if (Title) {
				if (TitleN && TitleN.length < 10)
					info = info + '\n' + "标题(" + TitleN + "个)：" + Title;
			} else {
				if (TitleN && TitleN.length < 10)
					info = info + '\n' + "标题：" + TitleN + "个";
			}
			if (KeyWords) {
				if (KeyWordsN && KeyWordsN.length < 10)
					info = info + '\n' + "关键词(" + KeyWordsN + "个)：" + KeyWords;
			} else {
				if (KeyWordsN && KeyWordsN.length < 10)
					info = info + '\n' + "关键词：" + KeyWordsN + "个";
			}
			if (Description) {
				if (DescriptionN && DescriptionN.length < 10)
					info = info + '\n' + "描述(" + DescriptionN + "个)：" + Description;
			} else {
				if (DescriptionN && DescriptionN.length < 10)
					info = info + '\n' + "描述：" + DescriptionN + "个";
			}
			return info; //此处为传回值，为字符串
		} else return null;
	}
};
//查询网站IP信息等
var SourceAPI = [{
	label: "纯真 查询源", //菜单中显示的文字
	id: "CZ", //必须设定一个ID，以便脚本读取
	isFlag: false, //是否作为国旗图标的查询源,所有自定义项目中，只能有一个设为true，其余可删除该项或为false,当你没有设定的时候会使用脚本预设
	isJustFlag: false, //是否仅作为国旗图标的查询源,如果有此项，就不会创建此项的菜单，也不会作为信息查询源使用。该项为false的时候可删除或注释掉
	inquireAPI: "http://www.cz88.net/ip/index.aspx?ip=",
	regulation: function(docum) {
		if (docum) { //判断是否有传入值

			var s_local, myip, myAddr;
			var addr_pos = docum.indexOf("AddrMessage");
			s_local = docum.substring(addr_pos + 13);
			s_local = s_local.substring(0, s_local.indexOf("<"));
			s_local = s_local.replace(/ +CZ88.NET ?/g, "");

			var myip_pos = docum.indexOf("cz_ip");
			myip = docum.substring(myip_pos + 7);
			myip = myip.substring(0, myip.indexOf("<"));

			var myAddr_pos = docum.indexOf("cz_addr");
			myAddr = docum.substring(myAddr_pos + 9);
			myAddr = myAddr.substring(0, myAddr.indexOf("<"));


			var obj = {}; //※必须，返回结果必须为object类型，此处为声明。
			if (myip) s_local = s_local + '\n' + '--------------------------------' + '\n' + '我的IP：' + myip; //可以显示自己的IP，可以关闭“查询本地信息”以节省资源
			if (myAddr) s_local = s_local + '\n' + '我的地址：' + myAddr; //加上自己的地址，可以关闭“查询本地信息”以节省资源
			obj.SiteInfo = s_local || null; //※必须，此处为返回结果中你需要显示的信息;当前项仅为图标查询源的时候可以非必须。
			//以下两项非必须，在此项目不作为国旗图标查询源的时候可以不用
			obj.countryCode = null; //此处为返回结果的国家CODE。
			obj.countryName = null; //此处为返回结果的国家名称【中文，需要lib数据库支持】。

			return obj || null; //返回“null”的时候便使用备用查询源；
		} else return null; //如果没有传入值则返回空
	}
}, {
	label: "太平洋电脑",
	id: "pconline",
	inquireAPI: "http://whois.pconline.com.cn/ip.jsp?ip=",
	regulation: function(docum) {
		if (docum) {
			var docum = docum.replace(/\n/ig, "");

			var obj = {};
			obj.SiteInfo = docum || null;
			obj.countryCode = null;
			obj.countryName = null;
			return obj || null;
		} else return null;
	}
}, {
	label: "MyIP查询源",
	id: "myip",
	inquireAPI: "http://www.myip.cn/",
	regulation: function(docum) {
		if (docum) {
			var myip_addr, myip_flag;
			var addr_pos = docum.indexOf("来自");
			myip_addr = docum.substring(addr_pos + 4);
			myip_addr = myip_addr.substring(0, myip_addr.indexOf("."));
			if (myip_addr.indexOf("&nbsp;") !== -1)
				myip_addr = myip_addr.substring(0, myip_addr.indexOf("&nbsp;"));
			if (myip_addr.indexOf("<") !== -1)
				myip_addr = myip_addr.substring(0, myip_addr.indexOf("<"));
			if (myip_addr.indexOf("\r\n\t\t") !== -1)
				myip_addr = myip_addr.substring(0, myip_addr.indexOf("\r\n\t\t"));

			var obj = {};
			obj.SiteInfo = myip_addr || null;
			obj.countryCode = null;
			obj.countryName = null;
			return obj || null;
		} else return null;
	}
}, {
	label: "新浪 查询源",
	id: "sina",
	inquireAPI: "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=",
	regulation: function(docum) {
		if (docum) {
			var doc = JSON.parse(docum);
			if (doc.ret == 1) {
				if (doc.isp !== '' || doc.type !== '' || doc.desc !== '')
					var addr = doc.country + doc.province + doc.city + doc.district + '\n' + doc.isp + doc.type + doc.desc;
				else
					var addr = doc.country + doc.province + doc.city + doc.district;

				var obj = {};
				obj.SiteInfo = addr || null;
				obj.countryCode = null;
				obj.countryName = doc.country || null;
				return obj || null;
			} else return null;
		} else return null;
	}
}, {
	label: "波士顿大学",
	id: "CZedu",
	inquireAPI: "http://phyxt8.bu.edu/iptool/qqwry.php?ip=",
	regulation: function(docum) {
		if (docum) {
			var s_local = docum;
			s_local = s_local.replace(/ +CZ88.NET ?/g, "");

			var obj = {};
			obj.SiteInfo = s_local || null;
			obj.countryCode = null;
			obj.countryName = null;
			return obj || null;
		} else return null;

	}
}, {
	label: "淘宝 查询源",
	id: "taobao",
	isFlag: true,
	inquireAPI: "http://ip.taobao.com/service/getIpInfo.php?ip=",
	regulation: function(docum) {
		if (docum && JSON.parse(docum).code == 0) {
			var doc = JSON.parse(docum);
			var country_id = doc.data.country_id.toLocaleLowerCase();
			var addr = doc.data.country + doc.data.area;
			if (doc.data.region || doc.data.city || doc.data.county || doc.data.isp)
				addr = addr + '\n' + doc.data.region + doc.data.city + doc.data.county + doc.data.isp;

			var obj = {};
			obj.SiteInfo = addr || null;
			obj.countryCode = country_id || null;
			obj.countryName = doc.data.country || null;
			return obj || null;
		} else return null;
	}
}]
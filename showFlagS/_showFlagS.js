/******************************************************************************************
 *这是综合设置，具体下面有解释。
 *******************************************************************************************/
var Perfs = {
	//显示国旗图标位置  如：urlbar-icons、identity-box、TabsToolbar、nav-bar-customization-target等等
	showLocationPos: "identity-box",

	//毫秒,延迟时间，时间内未取得所选择查询源数据，就使用备用询源
	Inquiry_Delay: 3500,

	//未知的国旗图标
	Unknown_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABwUlEQVQ4jZWRMahScRjFL40REW9ojqaGhoaGprg0eL3//3fkj0pCDrYp2hARmRItjk4ND0EuSFMgSEQIiuMjEjdnwUGIvLdF+bxc/j6ut8X3eM9X7z3P+vE7nPMdw9gRgPdEdCSlPJRS3t+9Xyrbtp8A4FqtFmQyGQbARHRERAXLsg6uNADwMZ1O83q9jpbLZdjtdnW5XPa3Rksi+iqEeA7g5j8NFosFu64bRjuaz+dhu93WhULBB8AAXCll3TTNO6fweDx+qLWOwvACf06TySR0HCdQSjGAt2fjKwA8m83+6zCdTsNWqxXkcjkG4Nq2/ezUgIg+ZbNZ3mw25yDP88JOp6NLpdLJL/4AaAkhnu4+cFyv14MoiiJmjvr9vq5Wq34ikeBt7+8AXpimeevC8+Lx+D0APBgMdK/X08lk8gT6KaV8HYvF7l46nxDiJQD2PC+sVCo+Ef0A8ODK3c/0/5zP5/0gCCKlFBPRu2vD2/6/ms1mMBqNjgGwEOLxtWEhxCMAPBwOjx3H0UT02zCMG/vEf6OU4tVqFRWLRZ+IvuwVn4g+pFIpbjQawXbnV3sZWJZ1IKU8BDAhom+2bd/eh/8LEFU+M9Rx2boAAAAASUVORK5CYII=",

	//本地文件图标
	File_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAAB3ElEQVQ4jZ3QT2vTcBzH8YGPxpt4EHwmHoc+BRV8ADuu+8MG2w47DJINVkLHWDrFKXpYBtqmttl+JV3/Zk1/SX5pfklq09TCx8O0yLB/0g+8j9/X4bu09GB7ex9fHB8XqSgqVBQVKgj3iaJCj46+0f39r8Wtrezzh3czl0plXxUKLjj/BcuKYNv3MRbDMEKk0wWIonKTSp0+SwSvrmaXVdUGY33Uau64RsODrts4OVFhGH2I4tWPlZXTp4ngfN6C4/RBCEWp1IammSCEQtM6kKQcwnAEyxpCknLft7c/PJkbzuUoGIug6zYIoSiXKSoVB4RQCIICVTVAiAVFMbC7+/nq4ODL47lh141QrbrQdQeVioPbW4ZazYUsl5DJ5JHJqJDlIi4uGtjZ+fQuATxAvd5FtcrGNZscphnANAO02wE4j1Euc6ytya/nhj0vQqvlodHo/pM7rl53Yds9XF93k8IDGIaPVov/t2aTg7H+InCMdjvE3V0wMdeNksOcx+h0Qpjm5LrdwWKwZfVA6eQ8L4amLQDb9s+pcZ4QzucpfH8Ix+lPzfeHSV7x/mWhwBAEIzAWTy0IRiAkwMbG+duZ8OZmdjmdLoaHh5ehIFz2ZiVJWri+fvbmz/mjv85vk5TTd5np7HoAAAAASUVORK5CYII=",

	//LocalHOST,127.0.0.1
	LocahHost_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAABNklEQVQ4ja2UwUpCQRSGPwx9gyAfooVLF0GLXiFo5QsUlkHcUgjcCZVEqIueQGjlIqwWbXqAom2IVJu2Bobg4raYM93D8ard7IeBuf/85xtm7szApA6BUNq6eGfKC4GdmLq5CqS4It+nBurbdlJwFahL/0SBRkB7EfhKDDQENsU/WgRul79lxv8Er8+BepVNrvgf0Gnw/bjQeUKolz6eE/ALNTBMAPU6AMaKUQLYMzM2VMESkAHSBpQWP6W8O8PhWDpj4AuoqfAl0AeegWXxckBP/EBlO8BAgzNAAcgDL0BLhW/UpFnx1lRxU2UfgGtgg+jM/+jNgDsC+CS6OKvAI/AE7BrwrQV6vf4CPE0zwe9E7wTAlYAHuC2bpXvcD4xVH7fEAHc+e0T7WcNd5YppZcl+AF0P+gbk74HicL4aGwAAAABJRU5ErkJggg==",

	//局域网，192.168.xxx.xxx
	LAN_Flag: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAQCAYAAAAS7Y8mAAABLklEQVQ4jeXUO0vcURAF8F8pxDqdAdFCZLUQ/ARiZ6f4AjWua2dhq4IaNEWKgNjFSi3ED2AhmEKxUXw3PrBQQwQbI6SSiJhiR1nwv6uwlXhguJc5cw4zl3svhTGIM1ziV8RvXGD4BW1BfMFDnvhejPEo7hJM7/HtfRlPJpg+xlQxxhlsYEv2dpxjG5sYKMb4Az6hHEMYQSXKUPpakxI0II0efEYnmtGCH5hBW+Q6curSaIxGnuGj7LmNoxt96A9RGnOYj1xvrBl0YQzTMd0TqlGLJsyiHTWoQkXs6zCBr6iPXGXUpNAa2pbgUrCCfRzhCofYwWJMsIZd2Wd8gT2sR4cLUXsY2pMc3h/J1+kUP/EvgbvHKo7zaG/JfipJ5AGWcJPA/cVydJekvX57xv8BD7eoP535NRkAAAAASUVORK5CYII=",
};
/******************************************************************************************
 *这里是设置文字显示的，可以自定义多个，可以根据需要截取，只支持函数操作。
 *******************************************************************************************/
var ServerInfo = [{
	label: "服务器：",
	words: "Server"
}, {
	label: "网站编码：", //项目名
	words: "Content-Type", //http头信息关键字
	//截取或替换的函数，返回的是“未知类型”就是在没有结果的时候自动隐藏该项
	regx: function(word) {
		if (word.match("=")) {
			word = word.replace(/text\/html;| |charset=/ig, "").toUpperCase();
		} else word = "未知类型";
		return word;
	}
}, {
	label: "网站程序：",
	words: "X-Generator"
}, {
	label: "网站语言：",
	words: "X-Powered-By"
}];
/******************************************************************************************
child:[  ]内为当前菜单的二级菜单配置，只支持二级菜单；
text 为运行参数，如果无需参数，直接删除text属性，目前只支持 %u 为当前网页完整地址；
exec 为打开路径，可以是任意文件和文件夹，支持相对路径，相对于配置文件；
文件夹不支持直接“\\”开头的相对路径，需要用“Services.dirsvc.get("ProfD", Ci.nsILocalFile).path”开头
=======================
除了以上属性外，可以自定义添加其他属性，如果快捷键accesskey等
=======================
{}, 为分隔条 
=======================
如果设置了id属性，会尝试获取此id并移动，如果在浏览器中没有找到此id，则这个id就不会生效
=======================
推荐自带命令函数：【showFlagS.command】-----函数的命令形式类型：
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
3、功能相对比较强大的动作模拟（感谢FlagFox!!），可以参考与FlagFox,
不过FlagFox有个缺点只能识别提交按钮的ID，本脚本增加识别按钮class类名，使用方法如下：
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
	label: "地址IP",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAt0lEQVQ4jcXTsWoCQRSF4Q8SsNEitUnhM6RQUtjb+xixTRHIG+SFks7GVxBksbBPGVjWQpsjSNhdXUjIhb+4c5l/mMMMv1g93IfeWf8Qhhi0CcYowmMosAtbfGCO2zrBFGV4CiUOP/iK5GrBHu94wTqSz7rrNAnKzOAtgm0yuUpQ4RkzLCNY4a5LBlU4ZG3RJYOT4BsbvKLfRVDlxAlGuKnb3CY4D7G1/l/Q9JSLzC5W02c69X9TR6H4UVapsaP+AAAAAElFTkSuQmCC",
	child: [{
		label: "PingIP",
		tooltiptext: 'http://ping.aizhan.com/',
		oncommand: "showFlagS.command('Action',this.tooltipText, 'site','host', null,'btn02')",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2STUsbURSGJ/kNsaFQcCONYFy46GZowR+QVRb+BHXRbQghbiIGpNQSP2bjRxcGUbKYTagJDbHSVNPUIEjaJEWNxKAYbRIahlhmyDxdDE46BLrywrO6vM+555wrCI95dKDZUfjxW+Nj/c9/ueto6ECfIFHOIJ22eZVp9PEydW2yWby1CtSuTqKcQZQ8SDmZJ6l7hNiVQbSCEK1gWy9gWy9gXzliJFZC7eqYYSkn49sN41oQDclp21JxJFbqE+iAcNaoEUpH8EYnmZKDOOfc2HxOEuUMalc3UVSNkVgJ+8oRwvw+0/GCIai2bijWS/h2w3ijk6ZAlDy9JwqCcNfRGNzIm4J3X6u9GejAlBxElDzYfE6m5CDFeolmRzEF5617BjfyDCxmsPtl9i6avQE2Owre6CSuBRGbz4mUk81LHdCBg8s2Y++/MbCYQZjf57x136t+1qjhWhAt/f+7nc3iLYFkGW/sGEc4gSOcQFE1o8WH3Tvn3CbV1o3lg+xdNPHGjpmOF3CEE9j9Mi8iKaMNtasTSkfM8GhkCPl7nGK9ZHLWqLF0WGM6XsDul7H7ZQLJsvGCh/6fhp8xGhlifG2Y8bVhJrbdvI4bLGW9HF42TMFqrtLbgKJqhNIRMzyx7baEZz+N8ebLc/JXOwSSZVZzFct6BR24bv/i7edZlrNBlrNBtk5m2DqZ4cPPHvmrHQ4u29bwY5y/Ihk8/sKXNsAAAAAASUVORK5CYII="
	}, {
		label: "PingIP",
		tooltiptext: 'http://www.17ce.com/site/ping',
		oncommand: "showFlagS.command('Action',this.tooltipText, 'url','host', 'su')",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACQElEQVQ4jbWT60vTARSG92f0JYigCUlBm6Ufag4k7UIpXSzmbTM1f+XM5ZqUeClzRbrKNG/QZZDM0GqEpRNNRTOl4S1voc3SNhErpy1z4nr6UGTSiEB6Px+el/Oe94hYpUT/DTA5NUPPKxtdvaNM2D/8O2DE5iDj4m3CI9MIC1cTejiJAwotqenFdPfZ/g6obbASHKYhIvoEZaUlNDXW87ythUpTBceFVOS7BEzVTd4Bza19BAQJqJO1WF+2/+HksL8lJ0ePZIeKKnPrSsB7xzTyvVoOHhFofmYBYNRmR5dZjpBynea2nl+Q+EQtEplA/+DYMiAt+xY+flGcz77AF9csU9NOAvecRnOuhMoHTUgDBdo7BwAwGu+ycWskSiEPt3sR0ajNjm9AAgFB8RQV3QCgxtLJGnE4OVfu8bS+A7FUSdYlIwCWuifIQhJYtymKxpYuRB8/zRK0X8eW7bEY8vMBDx3WYcRSJT5+Knz8VKz1VVB+pwYA86OHbJPHIpGdZOj1+I8VqswtbJDEkKTWMfZmGAC9oQJf/zjEUhVxagMzThdLS25y9Xms36ygsMy8nIHH40FzthT/wBhKbhYwN+cEYHB4HGv3CN9+Jl5X+xjZTiUR8ZeZ/7qw8ozOWRdKIQ95iIqCa1cZGuhl0e0CzwKTjnfcN1UQsu8YoYosJuzT3os093mejFwj8t2JHDoqkKJJR3smE0W0GllwHKfSipmcmvFepN9l7R4hv7CaZF0hSdoC9AYTrS/6vY2u/hu/AzhXUaJ+f854AAAAAElFTkSuQmCC"
	}, {
		label: "PingIP",
		tooltiptext: 'http://ping.chinaz.com/',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdElEQVQ4jaXSwQkAIQxEUcWObc8STEuSPWWJ4wgJBjwt/4EbS+tDX05pfSiOiOiaVdesyr7bUMDHBtyQA8A4BbA4DNziMMBCQxkgIvsWMPZXQsDHFMAf6gGMr++AASxOAamXGAG2LWSBY40ZwE8awPmBl/MBE0/2WQgYGXQAAAAASUVORK5CYII=",
		//oncommand: "showFlagS.command('Action',this.tooltipText, 'host', 'host', null,'but')",
		oncommand: function() {
			var aPostData = "host=" + content.window.document.location.host + "&alllinetype=全选&linetype=电信&linetype=多线&linetype=联通&linetype=移动&linetype=海外";
			showFlagS.command('Post', this.tooltipText, aPostData);
		}
	}, {
		label: "PingIP",
		tooltiptext: 'http://cloudmonitor.ca.com/zh_cn/ping.php?varghost=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEhklEQVRYhe2Wa0xbZRjHT4zx8mkxfjPz46JAS8tpzzrqcDrNnFm8xSxhXmLiFuMtTuclWea4lHKZG2MgmfZy2uJmcRK3CWwoGTIE2p5CuEzmpAwYg5Iu3EIXArTnnL8fDj305bSWb5rISZ40Oeft+/zO/3me838p/MsXtQGwAZDsgSiK695EFMWU65OtSQrACyKC4SWc4iaR+1MAO89cx57aG/ii5Ra84/OI8IK8oSAKiPARdNzuRLmvAgebP8E7l9/FweZDqOBOwTfBgRd4eX08CAEQe9AQmMETruugCn2gCnygTD5QJk6KQh+ofC82V/WipCOIvlA/DrcegcFpRJpFBbVNC42dlkNt0yLNosKTZ55Gpb8KUYFPrEAseUn7uJTQzElR7FeG2b/yvAubTpwF49SCZhnoHFuTBs0yoFkGHzV/jKgQlfNRq8lFfOUJgsrzKhOafKAKvJIaRfFQHChzLx4ur4bOoQfNMlDbtEi3qJFhzUQWq1eAZNqy0DXZrVQgGF7Gg8e6lMmLOLxaN4i6P6fh7LuDLaf7FBD3lLQj3fIydI6tKPedRNtYG+oDDdj9wx5o7ToCQGOn8emVz1YBYlLsb7wpvaksMwfK5IOjN6Ro0N3uG2R5zN3YXHUIo3PDirV7z+cS5cli9djlfp5UQBQFSWJiUw56dkAen/gxqg/MgDrqkcqV5wV11Aujq4PopdivtcdOANAsg2xXDglwaWhG6m6i0Ti81zSqmF0RyeddEEVMLUxheHYY1+78Af9kF0o6SxXNmO3aTgIUtU9II7YGwPT7xLo+SIGZAL68mocXfnwJz7qfQ853O2BwGWXJlQqsAfigaXRNY0kAxzzBhAljUCOzI9jfeABbvnkcGjtN1Fljp5Fpy4LWrksN8P7lxADFHRNAEsm9Ez5k12wnupxmGTz2bTr2nt+H6u7TaBn9DSd8FalLkN82nrAEn18ZU/aAKCK8FMYz3+8iNtayOuReeA0jc6PEevdAbWqAC38lbsIXzw0mNBF/kCM2zWL1eLvxAERRIEoEAM5+V+oSRKJ8wjG8r9SP8FJUIf/XXW5Ceq1dh58H6xVKAcDh1iP/DBBb+MbFIfJDVOwHZeKgsV1DX+iu/Iea/ik8WnUcOgcJUOmvVLz90MwQ9A5DagUAIBhewgNlCT7F5hUvKFyJIg6bjrugczCg4zZVWTVoHLqEZX4Zi9FFeMY9kgE5mNQAMTM66U1iRkRwuLe0BRr7DtAsaTQZ1kwYa3Lw1NmdUFk1oFkGWjutADA4jbJaCjuu9geliTBzyS3Z3I2Hym2yDa+14vh7pZ4yMM5t8j2aZZBhVStLEA/RPjaPV+oGcX+ZH1T+ig0XSAcRKs+DRyp78GFTEL/c7MSb9W8hzaJCulWy4HSLGmkWFfZdfB2tt65idnEO21xG6J0GOTKsmQjdDSkB4i9BFLHMC+gOhmHvCaGKm4R7YAq35xcRFVZHkxd5TC9Moz7QgNqBc/h1uBlTC9MQ4kYywkcUQRxIEl2imNx24js9mVes91D73z2WbwD8bwD+BuPxQevssckLAAAAAElFTkSuQmCC"
	}, {
		label: "PingIP",
		tooltiptext: 'http://tools.pingdom.com/ping/?target=',
		oncommand: 'showFlagS.command(this.tooltipText, "ip","&o=2&save=true");',
	}, {
		label: "网络托管",
		tooltiptext: 'http://bgp.he.net/ip/',
		oncommand: 'showFlagS.command(this.tooltipText, "ip");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9UlEQVQ4jZWTT2sTURTFZ2OXCl34BUzrImIKJitFxY3pyk3RnbQSSjAuIraNBRFsF1kIKoH2C6QEJhgnZOtiCPlHFRIrEalBEiy2aRIxGtOZJG/4udCmM4mBurjwHu/dc++59xzJMAwOQwjBm0IZTyDCmStPODHhZ2zyPmevrXL3kczWhx2EEJhzpMPDz5bG3EKY8akAgWCc1GaJvf0mu9XvqNlt/CsvOXV+iXuPoxxoHStAq6VxceYZ07PrVGs/LBXMsfP1G5dvveD67TW0vyCSEII7ixtMz66jaTqqqpJIJKjX65TLZWKxGIVCoQ/yq61zaeY5D1ZfIYRAevuuwvhUgGqtiWEYJJNJPB5PP8HhcNButy2dlL/UOXluke3PVaT55QhLwXj/MZvN4vV6+3eXy0Wn07HSEYL5hxECwTjSxNUVUpslC4Db7UZRFBRFwWazIcsy0WiUUCjU/5d4/R7XjadIY5N+qvvNkR04nU50XccwDEqlo0IfP+1y+sLyMMDgDJxOJ/l8nlQqRSaTGQYwU+j1eqiqiqIoNBqNPkCxWCSXy5FOp00Utv5QGBziYJgpNJtNarWadYiDazRHpVLBbrcTDoeRZRmfz0e327Wu0SwkXe+O7GSkkP5byjcHpHxkpgPmFjaGzbR3DDP9y862Y9r5N49gSiIKTqhyAAAAAElFTkSuQmCC"
	}, {
		label: "Geotool",
		tooltiptext: 'http://geoip.flagfox.net/?ip=',
		oncommand: 'showFlagS.command(this.tooltipText, "ip","&host=","host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACo0lEQVQ4jZWSW0gTYBiGfy9iA7sYtZBwlN0OFCLwVJlOszzNDZ0arVRcHsiNOedaMp2m5lwSLhGdjanzrGBsHnLNuRTDA3UjYWoeIDEJOkDUdLD5drXRzKQe+O6+57n4/4+QAwwMjJ+YmJzUtXd07mieNDpVdWpneblyRyQq0gUEBNAO7nsxNTXD7uzqdiTm5yFGpUBs730ktXeAoaxHaI4AQqFwLygoiP0XeSFC26pzXS2/izvTWtQvvkPT8hZaV79DMm9D6DMZzlSKIJFIXUwm87KXDMCnp29ghyXJxkVTClItpdAsraNrw4HODQeKZgdxyZQGZh8bkbWV4HC424QQH0/AYrGEVlbVIKovF3ybCoaNn+jedHgmb6YF0rlRpNv6QXuqgFAoBiEk2BMYGRsvvZmZDcGUDrrVz15y6+onRJv5CB1OQPTzXBzXZ6FK/RgMBkPuCRiNw8obWTmQz5nRsryNtrVvnoD67WuEjcYjxBSHC0PXQW0XokajBY1GU3oCVquVm19QiKY3H8E2FyNyNB2yhSHo176ge9OB2sUFFLzSI7D/GigGDcqUFSCEJHsCBoPBV1X3yH67ugnyeTPCjMkIMcVBMt/reUjx3Auc1CchdnAaEVci7YQQX6+faG7WlvEFBai2rUDwsg0xo7nQvf+K9nUHGlf2ED7ShlO9Y1DU1sPP77TijzvQarXHxNKSrRyxDPl9VqRNGKFe2kXp4i6CZ38g3LSJioYWBAae/0AIOXboMd0SCM5lZgnskmIpxA8bkKM3obDHggfNHZDdkyOKFW0nhJw9VHbDYrFYPF66Uygqwu8TF5/oJIREHCm78ff3T+RyU1xumcNJcVEolIR/kt1QqVR+Ki9jP5WXsU+lUvn/Jbuh0+kldDq95KidXxL+ipav5h+OAAAAAElFTkSuQmCC"
	}, {
		label: "IP地图位置",
		tooltiptext: 'http://www.264.cn/ip/',
		oncommand: 'showFlagS.command(this.tooltipText, "ip",".html");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAqElEQVQ4jbWTMQ6DQAwE9wmpKCjpUucHvIAn0UVCFBR5QDp+hqiT/jZNlJy9BuUicdI2Ps96pTsDRxwOFdlDNVTM2xS8twZ4NxlldWsSwXyuZEpGAMjbmfAJBHagmIx1Nn2sLfxYvo07Jn9NNymuJ4IXUJSS1jaED5Brr+aGaIKoOUpmDEoSuBpKpkX3ZQk2DX5VH7yC+Y1zFy+R19zpIhmjqYnBqRHwBfGiN9m6gWsFAAAAAElFTkSuQmCC"
	}, {
		label: "路由跟踪",
		tooltiptext: 'http://www.domaintools.com/research/traceroute/?query=',
		oncommand: 'showFlagS.command(this.tooltipText, "ip","&search=traceroute");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4jYWST4iNYRTG32ZSkyibWahZWM1GbJREmUwoC6w+xYaampJSMt26U9/5/VZsWEhZyM4NqTFTU6Kh8W82FobGYpTZyKRJhEQyjM17r88lc+os3vOc9znnPOeklE3tUIci4mRRFJ1FUXRGxAAwFRE70nIWEQfV9+oSMKU+Ab7m9/Tw8PDa/xKox4ER9Wf+NA9czj4HvFVrEXHin2RqFzCjLqnX1DVtHQ6onzJ+Q+1IKaVUluUmYASYyJXfqT0Z2wCcV49kjXrV18BktfKZzNr0p0VRdGaC9bnqGDBRr9e71a3q57Is+5oEt9Q7wAzwQ33VbL9er3cDL9SeiDiqXkopJeCq+jIi9id1N3BavaLO5i72pZTS4ODgCvV5RBxTD6izWY+9OW+xNQpwDrgLfFcfq125wwvAm7yFUzm2Pes1XtVis9oA5jJ7Q12ZsR51XSV3SF2KiD3tqwx1sSLoo5ZYv3P6gYWM76wCG4HxCsGHJhHwDBgF7mehm/GHLYKyLLcBk+oDdUy9qN6rCNv0L5loGpj/Y4SyLPsi4nDliM6q14HbueI3tT8iduWtbfnrpNtNPaTeBBaAj2pvSinVarXVy35OqXVMo2ojIlBXVfFfTgJz2sMe76oAAAAASUVORK5CYII="
	}, {}, {
		label: "旁站(aizhan)",
		tooltiptext: 'http://dns.aizhan.com/?q=',
		oncommand: 'showFlagS.command(this.tooltipText, "ip");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2STUsbURSGJ/kNsaFQcCONYFy46GZowR+QVRb+BHXRbQghbiIGpNQSP2bjRxcGUbKYTagJDbHSVNPUIEjaJEWNxKAYbRIahlhmyDxdDE46BLrywrO6vM+555wrCI95dKDZUfjxW+Nj/c9/ueto6ECfIFHOIJ22eZVp9PEydW2yWby1CtSuTqKcQZQ8SDmZJ6l7hNiVQbSCEK1gWy9gWy9gXzliJFZC7eqYYSkn49sN41oQDclp21JxJFbqE+iAcNaoEUpH8EYnmZKDOOfc2HxOEuUMalc3UVSNkVgJ+8oRwvw+0/GCIai2bijWS/h2w3ijk6ZAlDy9JwqCcNfRGNzIm4J3X6u9GejAlBxElDzYfE6m5CDFeolmRzEF5617BjfyDCxmsPtl9i6avQE2Owre6CSuBRGbz4mUk81LHdCBg8s2Y++/MbCYQZjf57x136t+1qjhWhAt/f+7nc3iLYFkGW/sGEc4gSOcQFE1o8WH3Tvn3CbV1o3lg+xdNPHGjpmOF3CEE9j9Mi8iKaMNtasTSkfM8GhkCPl7nGK9ZHLWqLF0WGM6XsDul7H7ZQLJsvGCh/6fhp8xGhlifG2Y8bVhJrbdvI4bLGW9HF42TMFqrtLbgKJqhNIRMzyx7baEZz+N8ebLc/JXOwSSZVZzFct6BR24bv/i7edZlrNBlrNBtk5m2DqZ4cPPHvmrHQ4u29bwY5y/Ihk8/sKXNsAAAAAASUVORK5CYII="
	}, {
		label: "旁站(264.cn)",
		tooltiptext: 'http://www.264.cn/sameip/',
		oncommand: 'showFlagS.command(this.tooltipText, "ip",".html");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAqElEQVQ4jbWTMQ6DQAwE9wmpKCjpUucHvIAn0UVCFBR5QDp+hqiT/jZNlJy9BuUicdI2Ps96pTsDRxwOFdlDNVTM2xS8twZ4NxlldWsSwXyuZEpGAMjbmfAJBHagmIx1Nn2sLfxYvo07Jn9NNymuJ4IXUJSS1jaED5Brr+aGaIKoOUpmDEoSuBpKpkX3ZQk2DX5VH7yC+Y1zFy+R19zpIhmjqYnBqRHwBfGiN9m6gWsFAAAAAElFTkSuQmCC"
	}, {
		label: "旁站(114best)",
		tooltiptext: 'http://www.114best.com/ip/114.aspx?w=',
		oncommand: 'showFlagS.command(this.tooltipText, "ip");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACj0lEQVQ4jbXRaUjTARzG8b/1puh41YuOF11QIPXKUVCRFBZUEETHCyuEiNCyw1qHRKQvOhZpmB06i7LIMVrTTJM0D8rZsVyuprO57e+Odv2vqWVRxLcXQRSK0IseeF7+PvzgEYT/kdCAhkvWeBPTeB1RccRUREVlzCNzYIi8TpWsdoWNLQprn8ik18bRmaOkVUVYavrIGmuU3U1xnHHtb+y6L0mmY5CdXYNs7tBY2SCzpCbBYnOMOTfCTCsNMvGcyPjTXsYV9jHzaog73covpFdLktv9CX3wCznuT2zt0DhmVzjVqXDSLnP8hcTRDokt9TEmFvWTUtBHymkvGywRAkkN4VksyabnGuvbVFY3KuS0yzSKCVr7E7/fbPbGedQbJ90SZVZFmOnlYZbfi+CMKgj2oEJGRYDUSyKpJSJ7a8PMrfQx1SiS0xRgV53IhEIXaWVujtSFmWvwMvuCD12pH5tfQvBLKlnmELorIunlIgZbhGmmj4y/JTGpNMBkgwch/wPzL/RQ2RllRZmfhcV+sqtDBEdbZlt7jEyHytkeK4UOH8fbyimwNbLutpG9D8WxpzzvkpjSPMThPonqsBGT6KHCWUhVdzU7TEXMOOXmvjMyOuJKKMx7qiK8/IG+X6ZNukhD1M19j57H/iqyHlwkJa8HXUkPIU0eiZxpkdG9+oZghwOBJJXBuxj9XopdJRjf15NpuYxwrBfhQBeltsBIIN+ssdP3HcEOi95/JeOtm1W2BMset7OqxsmCa60I+R8Qct+x3ewZCWRXqBR1feZE52f09mHyXg1z0DbE/tYBcpuS7GtQ2VMtkXElQuat0EigoFZmj0nmkPWPPpDIs0gcsf6q3iqx66aE4ZE09hr/kp/pOwDc448VcwAAAABJRU5ErkJggg=="
	}, {
		label: "旁站(Bing)",
		tooltiptext: 'http://cn.bing.com/search?q=ip:',
		oncommand: 'showFlagS.command(this.tooltipText, "ip");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7ElEQVQ4jWP4v5PhPyWYAZnzfQsz+Qb828nwPyAg4H9OovP/1W3q5BsQEBDwPzXWjTIDAgICqGNAWbr9/+UtGv/vLuUnz4AplYZwfkqM+/+ZNXr/L8wVI80LkaE+KOIBAQH//5FiwNfNrP87isxIMyA30fn//50M/+8u5f/fnGdJmgvS41z/X5wr+r+nxOR/IJrG5Bj3/4enyuAOg7wkp/8Ty43/BwX6o2gMDvL7v6hRG2tKRUnKfaXGGM5tzLX6/2QlD3F54f9Ohv8Hp8j+jwrz+Z8a4/7/+HQp0jITDP/axvz/7w5G0nMjORgALS2D1pyznwIAAAAASUVORK5CYII="
	}]
}, {
	label: "域名DNS",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABiElEQVQ4jXXTzUtVURQF8J+F9ugPKBTFbBAUNCl4GmE5LJI+Jn1IUP9Ck3DarEEIJVj2SKwg6AO0aNAgfZHRP1CaFVEPykGDnNekwd4XrpfngsvhHM7ae5291mUjunAMT9DCen4tPMMJbLMJdmISn/EQl3AEw7iIGaxiCt3tyPNYSsLWPO9Ff64HMIomXqKnIHdm5yUMVApfxzd8SGULGMv1dvGc4/iUcqu4id84j30pv5lKVnASHuNBSXYZk3iEjtzvzWZ13MUc/MDlNmS4hffYkfvT2XkgVf2EPxjJCzWcwg1cEXb+wxvM4guu5d3DwmLrOJqH4/iast/ir3Dnaqo5i+3VAi3hcx8+pjQp+x3ubPK8C8UTnuIeDooB7S9duo/pNuQtaOA5Ec8VYc2CsGqPGNha7qsYzGZniPxPYVGEpCkiu4zvmKiQe/E6FdSKw24Rz8VUVBdW7caukux6qnyVhTagR8RzVYTkHA5hSAy2IeLcaEcuUBPxnBcTLn7nX3iRc6mVCf8BM0VdfnCTBIgAAAAASUVORK5CYII=",
	child: [{
		label: "综合查询",
		tooltiptext: 'http://seo.chinaz.com/?q=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdElEQVQ4jaXSwQkAIQxEUcWObc8STEuSPWWJ4wgJBjwt/4EbS+tDX05pfSiOiOiaVdesyr7bUMDHBtyQA8A4BbA4DNziMMBCQxkgIvsWMPZXQsDHFMAf6gGMr++AASxOAamXGAG2LWSBY40ZwE8awPmBl/MBE0/2WQgYGXQAAAAASUVORK5CYII="
	}, {
		label: "网站备案",
		tooltiptext: 'http://icp.aizhan.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2STUsbURSGJ/kNsaFQcCONYFy46GZowR+QVRb+BHXRbQghbiIGpNQSP2bjRxcGUbKYTagJDbHSVNPUIEjaJEWNxKAYbRIahlhmyDxdDE46BLrywrO6vM+555wrCI95dKDZUfjxW+Nj/c9/ueto6ECfIFHOIJ22eZVp9PEydW2yWby1CtSuTqKcQZQ8SDmZJ6l7hNiVQbSCEK1gWy9gWy9gXzliJFZC7eqYYSkn49sN41oQDclp21JxJFbqE+iAcNaoEUpH8EYnmZKDOOfc2HxOEuUMalc3UVSNkVgJ+8oRwvw+0/GCIai2bijWS/h2w3ijk6ZAlDy9JwqCcNfRGNzIm4J3X6u9GejAlBxElDzYfE6m5CDFeolmRzEF5617BjfyDCxmsPtl9i6avQE2Owre6CSuBRGbz4mUk81LHdCBg8s2Y++/MbCYQZjf57x136t+1qjhWhAt/f+7nc3iLYFkGW/sGEc4gSOcQFE1o8WH3Tvn3CbV1o3lg+xdNPHGjpmOF3CEE9j9Mi8iKaMNtasTSkfM8GhkCPl7nGK9ZHLWqLF0WGM6XsDul7H7ZQLJsvGCh/6fhp8xGhlifG2Y8bVhJrbdvI4bLGW9HF42TMFqrtLbgKJqhNIRMzyx7baEZz+N8ebLc/JXOwSSZVZzFct6BR24bv/i7edZlrNBlrNBtk5m2DqZ4cPPHvmrHQ4u29bwY5y/Ihk8/sKXNsAAAAAASUVORK5CYII="
	}, {
		label: "Robots信息",
		tooltiptext: 'http://tools.aizhan.com/?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain"，"&r=robots/index");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2STUsbURSGJ/kNsaFQcCONYFy46GZowR+QVRb+BHXRbQghbiIGpNQSP2bjRxcGUbKYTagJDbHSVNPUIEjaJEWNxKAYbRIahlhmyDxdDE46BLrywrO6vM+555wrCI95dKDZUfjxW+Nj/c9/ueto6ECfIFHOIJ22eZVp9PEydW2yWby1CtSuTqKcQZQ8SDmZJ6l7hNiVQbSCEK1gWy9gWy9gXzliJFZC7eqYYSkn49sN41oQDclp21JxJFbqE+iAcNaoEUpH8EYnmZKDOOfc2HxOEuUMalc3UVSNkVgJ+8oRwvw+0/GCIai2bijWS/h2w3ijk6ZAlDy9JwqCcNfRGNzIm4J3X6u9GejAlBxElDzYfE6m5CDFeolmRzEF5617BjfyDCxmsPtl9i6avQE2Owre6CSuBRGbz4mUk81LHdCBg8s2Y++/MbCYQZjf57x136t+1qjhWhAt/f+7nc3iLYFkGW/sGEc4gSOcQFE1o8WH3Tvn3CbV1o3lg+xdNPHGjpmOF3CEE9j9Mi8iKaMNtasTSkfM8GhkCPl7nGK9ZHLWqLF0WGM6XsDul7H7ZQLJsvGCh/6fhp8xGhlifG2Y8bVhJrbdvI4bLGW9HF42TMFqrtLbgKJqhNIRMzyx7baEZz+N8ebLc/JXOwSSZVZzFct6BR24bv/i7edZlrNBlrNBtk5m2DqZ4cPPHvmrHQ4u29bwY5y/Ihk8/sKXNsAAAAAASUVORK5CYII="
	}, {}, {
		label: "Whois(cndns)",
		tooltiptext: 'http://who.cndns.com/?d=',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4jY2RMWhTURSGj6LV987BgmaK4qDVopVnbQlUFMyQNO+d46JLCRLq1BaHOEQcpSoGKRERHLWDiygqbXcXKw6Co4iIiy7tkBhf3jlKsX0OosU0TXLG/7/ff/9zL0AXU3jk4f23A9dnXvfNjz08NOvd9MowMby9GxYgDdtGyt7z4kJ/PP6kPx65460N3UhNdOSqAewKecfhUj6ZOHLFWzx2ezA+c+/Er2wlda0tGDEOKuODKMCryu7k8lm8sHh+T6FycW9h+tLBvrawsjtpjC816yZN6JUyLhhT0RgvK9NcQ2i+Gjj7WsOBG5jQp1oGesM0JELfOd2iXd6EPmvWTTZ7W4zpY8SYb1sRACLBuyb09P/bc+6QCdrSKGCngLrsPGCMK2EaEuupPo6b0IdO8N+2ylSNfMytN2B3yhi/dBkAyrjcCGjsn2C+c84EVxtBz9FO8Pcc7DbGlTBwTjWLPzY8TosxpqIKfXs/AD1NBs6YUBwFWNoMjnJ4XJnqyljeYH49CY4JvTHGNWV6pr6bmgbYCgBQyzj7owBLylRXwXeb/tbSKKAyzprgqgnFxvjTBNWE4j8aPq5loLfTmqDiDptgRZnmVOiFCt2KfPRanf0N1/S6NRUXNMsAAAAASUVORK5CYII="
	}, {
		label: "Whois(aizhan)",
		tooltiptext: 'http://whois.aizhan.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACG0lEQVQ4ja2STUsbURSGJ/kNsaFQcCONYFy46GZowR+QVRb+BHXRbQghbiIGpNQSP2bjRxcGUbKYTagJDbHSVNPUIEjaJEWNxKAYbRIahlhmyDxdDE46BLrywrO6vM+555wrCI95dKDZUfjxW+Nj/c9/ueto6ECfIFHOIJ22eZVp9PEydW2yWby1CtSuTqKcQZQ8SDmZJ6l7hNiVQbSCEK1gWy9gWy9gXzliJFZC7eqYYSkn49sN41oQDclp21JxJFbqE+iAcNaoEUpH8EYnmZKDOOfc2HxOEuUMalc3UVSNkVgJ+8oRwvw+0/GCIai2bijWS/h2w3ijk6ZAlDy9JwqCcNfRGNzIm4J3X6u9GejAlBxElDzYfE6m5CDFeolmRzEF5617BjfyDCxmsPtl9i6avQE2Owre6CSuBRGbz4mUk81LHdCBg8s2Y++/MbCYQZjf57x136t+1qjhWhAt/f+7nc3iLYFkGW/sGEc4gSOcQFE1o8WH3Tvn3CbV1o3lg+xdNPHGjpmOF3CEE9j9Mi8iKaMNtasTSkfM8GhkCPl7nGK9ZHLWqLF0WGM6XsDul7H7ZQLJsvGCh/6fhp8xGhlifG2Y8bVhJrbdvI4bLGW9HF42TMFqrtLbgKJqhNIRMzyx7baEZz+N8ebLc/JXOwSSZVZzFct6BR24bv/i7edZlrNBlrNBtk5m2DqZ4cPPHvmrHQ4u29bwY5y/Ihk8/sKXNsAAAAAASUVORK5CYII="
	}, {
		label: "Whois(ChinaZ)",
		tooltiptext: 'http://whois.chinaz.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdElEQVQ4jaXSwQkAIQxEUcWObc8STEuSPWWJ4wgJBjwt/4EbS+tDX05pfSiOiOiaVdesyr7bUMDHBtyQA8A4BbA4DNziMMBCQxkgIvsWMPZXQsDHFMAf6gGMr++AASxOAamXGAG2LWSBY40ZwE8awPmBl/MBE0/2WQgYGXQAAAAASUVORK5CYII="
	}, {
		label: "Whois(Dtools)",
		tooltiptext: 'http://whois.domaintools.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB00lEQVQ4jYWST4iNYRTG32ZSkyibWahZWM1GbJREmUwoC6w+xYaampJSMt26U9/5/VZsWEhZyM4NqTFTU6Kh8W82FobGYpTZyKRJhEQyjM17r88lc+os3vOc9znnPOeklE3tUIci4mRRFJ1FUXRGxAAwFRE70nIWEQfV9+oSMKU+Ab7m9/Tw8PDa/xKox4ER9Wf+NA9czj4HvFVrEXHin2RqFzCjLqnX1DVtHQ6onzJ+Q+1IKaVUluUmYASYyJXfqT0Z2wCcV49kjXrV18BktfKZzNr0p0VRdGaC9bnqGDBRr9e71a3q57Is+5oEt9Q7wAzwQ33VbL9er3cDL9SeiDiqXkopJeCq+jIi9id1N3BavaLO5i72pZTS4ODgCvV5RBxTD6izWY+9OW+xNQpwDrgLfFcfq125wwvAm7yFUzm2Pes1XtVis9oA5jJ7Q12ZsR51XSV3SF2KiD3tqwx1sSLoo5ZYv3P6gYWM76wCG4HxCsGHJhHwDBgF7mehm/GHLYKyLLcBk+oDdUy9qN6rCNv0L5loGpj/Y4SyLPsi4nDliM6q14HbueI3tT8iduWtbfnrpNtNPaTeBBaAj2pvSinVarXVy35OqXVMo2ojIlBXVfFfTgJz2sMe76oAAAAASUVORK5CYII="
	}, {
		label: "Whois(Shosts)",
		tooltiptext: 'https://www.sugarhosts.com/members/whois.php?domain=',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACSUlEQVQ4jYWSXU8TQRSGTz8kIB+iKMQoaEKCxlhDNMH4UTUhpl5QMK18aMKF/8CfMD+Gq73lpoFlTncpu9ntwjKzObvbzJZNoOF3eFVSEMt7dWbOvE9m3jMAVySlvNtsNr8kSTLdXSdJMskYyzLGslfPX5KmabmDg4OVNE3nEXE9juNRznm1VqttOo5TajQay3Ecj15rRsS8UmrMtu2ylPKTrusbQojhMAyfhGH4Wtf1jZ2dnZ/tdrvged6tfwBSysL29vbvTqczQUTzSqkHPe1MHMfPhBDFra2tP0S0EATB1EU3iqI5IUQxSZLJfk9ExHyj0Vg+Ojpa1HV9g4hGQNO0HOe8uru7+8vzvNv9AIyx7P7+frnVai10MwIAAN/3x1ut1v1+5q6I6J5hGBXOedXzvDtgWdaQlLIQBME0AGRuAgghhjnna0RUdF33M/i+/9513W/d1G8CIGLecZzS3t7eqlJqFoQQL+v1+qphGBVEHLwJwBjLCiGKSqkXAJABxlg2iqKJTqczIaV8LqUs/PezAECapoOO45SCIHh1salpWq7ZbH51XXfR9/0PhmFULMsa6vFliGggiqKniPjj7OzsEfTmRUQjpmlWEXGwO6rT09NZpdQYIuaPj48/GoZROTw8LNVqtc12uz1z6VpENGCaZlUpNRuG4UNd19dt2y5zztfOz89n6vX6apIkbyzLWiKiEbhuWicnJ1OWZS2ZprkSRdGclPKdbdvlNE3HhRBvTdP8rpR63DdhTdNyiJjvpt2tASDTU1/SX16naBB9RDh8AAAAAElFTkSuQmCC"
	}, {
		label: "Whois(dnsw)",
		tooltiptext: 'http://dnsw.info/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbUlEQVQ4jaWR4Q7AMASE79Hvze2XrTu0bBIRjX44AGCrea6RpAEwklr/FOwAGgMgi+5HgPp4Ah/f9xxpYD+tDQDx8hEgfFryNqACftIgAFRpPZV+DBpUN951TgHVrduA+/EwSQnw/ccTtLslgAvMWymeSmzhxgAAAABJRU5ErkJggg=="
	}, {
		label: "DNS健康",
		tooltiptext: 'http://www.intodns.com/',
		oncommand: 'showFlagS.command(this.tooltipText, "basedomain");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABZUlEQVQ4ja2STWrCQBTHPYe4m8OI9AAKbTJi21AzI53E6mJmQKF20Ra6D5I6gUIXBZfZdSEktDNzjrlG0oWmIkaJpX94vI/F7/E+arX/lB19tayF6loL1e2ESf10gJArGKncEjKzXmXzzwAYqbwyAIoUtIMUQJECW8i5HUltCakvhDxrBymAwSc4f3xrOKMn4Aw4wHi8O1rREUYqtyOpy+Ley4fGPs+xz3Pks9UewBIy23hd5LaQuqgXAJfQbB8glCnMFiqGQhm4+DZ2mMQwTA0ME3P5/B4jnxvkc4M8tjy2xGUBuH4IY3Q3MWg4Me5wugYQbrDHYkToGkaoOXgFZxZs5/ZYaYx9npcCLCEzZxZol9AM+zxHhG534LHfuktotgPohEkdihTAIAZX03nDGd0DZ8BBn9Az5DGNPKaRz+bOgIPCKv3KzS1tHrxCFeENoPQPqqiHx3WX0K5LaLdPaOtkwDH9AMkIIs6laIJBAAAAAElFTkSuQmCC"
	}, {
		label: "黑名单",
		tooltiptext: 'http://rbls.org/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAATklEQVQ4jc2RSQoAIAgA5/+ftkuBuCTSIQXBdXBBHoV5AECAMjYMoAuOrRsyfyspwMaiPNl4FUDV9QBBrg8wq1wP1L9B9QUHd7M35T9gAW7cCiGxw6gLAAAAAElFTkSuQmCC"
	}]
}, {
	label: "网站安全",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABd0lEQVQ4jYWTMUtcURSEj4u2YmGZSh5rsdzzfU3+gq0QLISFhFhom3R2lkLSpA4Ee22sJIaYNkIC1kkpaiF2wUZhk+a95bk+NxemOjNzhsPciI5XSlkCdtUr9QrYLaUsdXEfPHUhM9eBU/VO/VvjDjjNzHV14ZEwM5eBDfUQ+NMSPkA9OwQ2MnO50ffU/YmNXeJRO5G6HxG9iIgecNwifs3Ml8CLBuoQeAuctHjHjcEMsNcMMvNVk6whZOazwWDwHHjdMtiLiJnmBjvAqI75Rv2i/mzhB/C5TjECRpm50z7imnpfD7fV6447XAPb9ZL7zFwbGwAD4KKONtWg5lwAg7FBVVXz6kF9g3fACfB9At/U97XZQVVV85MlGqq3wK/M/Kh+aAP4pP5Wb9XhozL1+/1F9WhaF2oc9fv9xc4qAyvq5RTxJbDy5F+IiFlgS73pEN8AWxExO80gImJO3QTOW6U5VzcjYu5/4nGSUsoqcAaclVJWn9r8D9Ly4rUXRHEbAAAAAElFTkSuQmCC",
	child: [{
		label: "安全扫描",
		tooltiptext: 'https://www.virustotal.com/#url',
		oncommand: "showFlagS.command('Action',this.tooltipText, 'url', content.window.document.location.host, 'btn-scan-url')",
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACo0lEQVQ4jX2Sy09TQRSHp7aI8RElMca4NS6NK6MLdefG+AcYN8YYNXFj3ApC4d5LgAWuDBqCxuA7KoqGmEAUHxih985QAgVF1LaUhy2lVOjrtvdz0SJo1ElOzmzmy3d+c4RvMknL+ylu+ma4pWbpDMSYTGZI2zbz6Sxm5AetAzO09U9zrX+azkCcbMHGP/0DM7yAuNo/w8G2MS52h7ntj9I1Pk/74HdOdUyws9mPqPQhqk1EjVns1T7OPP1K59gcjb0hRCKdI23bgEN0KcvZzi+IygFcl0zcmkQY6vfSFRUNiuMPxml8HUZEl7JAASjgOHkWczn6QgkOtI3i8ZqUaxK3oRCGROjFvk6XeLwW3p4goulVhL3XRvgQTrKYy4FTAPKAw7OPcfa0DFNhKNbqEqGvMvJaVPcEEZffRBBVPlxek2P3PvPiU5xEOleycoACd4eiHGn/REW9ZG3J4heg+U0E4bVw6Yo1tRab6iVH28e45Y+WTIrjLWSydATmcNdavxssA5b1XLqkXLfYXK/Yc2WYR4G5EgQudH2jrO5fgD+SFoaiTJNsMSweB2L0TMTZWq+Kgep/GWEFUEzbZShEjcX559+ILWXZd3UEz3KQ+v8MdIXLkAivyeHro6RyNueef6W8zsKtr3zlf0dwa5JtjYpgIs2TQAx3jVl8bEg8hireq3xc6v4LwKVLNmoWd/xRQokU6zWLMk3i0SUbGgbZ0aQ41Bqg+V2EuVS2tAerAOWa5MSjCaaSaXa3jLC9QbG/NcDpji/ckLOE5lOsnDyiqTeCqDIRtRJRK9l1eYjJZIaeiXmuDMzwNphgKpn+tQ/FyqOmF7EiSUTHcJTjt0c5ef8jx+6M0RdcAApk8jYFxwbyOKUqODa+cALtZYjTD8d5MDTLT6JH8NO39DItAAAAAElFTkSuQmCC"
	}, {
		label: "WOT Scorecard",
		tooltiptext: 'https://www.mywot.com/en/scorecard/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC8ElEQVQ4jZ2Sb0zMARzGn65Et7tys9Nc2hhekBf9OXS/36+6/Nvirly6JItTTRPLLAyNfuuPP5PLdZhQTIhLZbVW2pKhpLs3ZqbhXVubujbLMNI93ija8MJn+758nj3Pdw94RiXzQ0WMpIGZdjUBQFRCR7uar4Zdkf3DlyM9I7XR+Bv8UBHDUX21qISOXj07Oqof0qtn4QMznS+Secoj8rQngVdfZ7BpcG+j3C3PmmYgaWAWldDR18XvE99IXxfzq3Q0VYOmBjD1PmhpBk13wIxGDcvdImsG1ul+JagMJr16fp/4NnX06kl7MNNKwKxm0PYIzO0HMzvB5HolDzxawAvv4sOnKgyNvRqgr4vjPxOkO8DMJlDKwvPo9WjVm0AxF0y9BtqegKl3Q7i1YcFrAMD42HkDvXoW1SwjR/XcXAG2DIR9FZXQ/V411oyPK7eASXbQ9hDcVLeISVWYCdrVbO88zIIH/mRlMG3tYPpp7OAZlTzNYCOSDRZwVQ6YVg9ubdbQfC0iE96Pb8q6h04ytwc0HQDzPKCtG7NlGQHsLV8jy7ICRgREJUErWEDDTjCxFMxqC2JKbUQZHr9tLO8cKubOp6D1NpjnBm09WCG7EOhyWf0nE4gZiBMsGBOywdhD4PaOmbTcWD6ICz0HI5+NOpjfB1pbwJxefMl345DVBRVkKGJ2YYa0GxopH30GK76KeWBCKbitNYSW68trAQDOvhwWv1TT2gamt2E8z4NPOb3Yl1yHxUY7Fq8pxU0hG2OxWfCJ+8F1Tj9m3Avn1INSrkSUlbiXMrsHTHGBiTUKX9JN5XhaUyATz/qPGA4qPhtyMSEUgJIcwJRbKl9q3bLBaYuMq5w/ar6l4pZW0NIArr7sT+FcCIVjQZT2gFIhKBxX0OiczfQ7S4g/YXSEPxHOhjK2TE3D8UAKRxWUivwoygEUTigpnpvDDZcW/lk8ydoqbZTRGXZPrAp9H+/QMt4xl5JDS8k573PCxdAj/xT/Dz8AcmeJhsZwOFkAAAAASUVORK5CYII="
	}, {
		label: "完全评估",
		tooltiptext: 'https://www.siteadvisor.com/sites/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACSUlEQVQ4jY2TT0gUcRTHB9FVN11EOkTQKRACDdRd/5SkP1ohkK6S0AyDl1AMhA7ezB96yHt5coMV1tQsW2cJN4J1N1YTJsbyMl4CYUBYmMvsyfXw6bDsqJTSFx5834/3vr/33u/9lExmm5czM76pmo6q6QghLljl/HxsJrONMjY+geM4OI7D/6ISPzY+gaJqOq5lE69qJz4wwtbkLAUjR8HI4Vo2rmX7/tbkLPGBEeJV7biWjarpZQGAeHUHmVAfG8EuNiPDpKKjrN/oZ60+TCo6Sio6ysdgF18b7xOvagcoCwghAFiuDnPQPMhB86Bfqjm3wFp92PdzTf3sNQ2wUtMJgBDib4GfzVE/4Si7x3yg5Uxw6DmZUB8r1ecEVE3Htg8xh6f40fSQwwfPLgzMnFvw+bcnL0g1dGMOT2Hbh+UWpJQkEgkKRo5cYz+/n077twOUSiWfm3MLbAQjFIwc71ZWkVKipNNphBB4RY9kXQ/Hr5YA/NJLJyc+31/6wOdrvXhFDyEE6XQaxXEcVE3HzOZJ3n7M8Wb2gsDp6anPj7J7fL81hJnNo2o6juOgKIqi5Hd2EULgWjZLgU7WG7v5ErpHoqGDN/WtLNa1MR9oIRnqxbVshBDkd3bLyRWomo6UEteyeR+IYDR0sxrsIFbXxuvaO2wEI7iWjZSyPLx/odKXV/RYrgnztvYui7WtpII9eEUPM5svP91VEEIQi8Xwih7r1wXbNx/hFT0+JTcRQpz1fRWklFQWrLIwl5Z9Gfb3f/nf2jBSlyb/AdPKVfDSJtJaAAAAAElFTkSuQmCC"
	}, {
		label: "钓鱼分析",
		tooltiptext: 'http://toolbar.netcraft.com/site_report?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAl0lEQVQ4jWPYH3vm/4XMxf8fllb9/9QY+P/fJIP/vzeo/f9xXvb/t7fC/+/95f+/8a/g/5Z/wv8j/on+D/ji8j/sWdP/6OsH/iec/P+fYRgasDJR4T8DAwNWLBvKTrwB5nps/4P82f57hbD+tw5hI92ApV3CKF4YNYCeBhwrUv0fYs37/9AicRQDdELZ/hv28gyFpEyqAQD5u5A3YumsgAAAAABJRU5ErkJggg=="
	}, {
		label: "安全查询",
		tooltiptext: 'http://webscan.360.cn/index/checkwebsite?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACwklEQVQ4jWWTb2jVBRSGn3u597a7xKURJS1osQqCsBIWN2oQDCIS1HAxHFpcBA2KXC5xhWRIUWROvyRLazbaGItmIaGCazrcprvD1Wq52h+L5gaarLHa7p/t9/RhIjUfON/e97zvh3NgEZ93kth/mvqa41zZfBQ3tWJFCxMvHqV+xzFKFutvsLuFJe+e5MsP2vBId9z3j0esbsKnPsTVjZj4BB+txTVf0Fi+j/hN5s866ftjcplapN6t5ut8yIkJfOMgPrIPH9yL0VfxiY/p/d+SwcvhZi1WN6pvqZsNgsfNZZeYm8VgFk+1Y+FOjL2OVGLxezQA0NTLk1qgVqqn1GH1mNlM0tJdcUt3hsxOo39jx2m8rwZ5DuNV2NFFCX9N06h3qTvUEXVe7TM985qxTcgGTI+hV9E/8VIKDzfg1y3oeLgB5xjTZeoGg+Abs5ku0zN1Tk2u89bkQt2pEUwPYXYAg2F0EP0VHQ+NYo45g5j6kLnsWkt33WlkI8ZfwvwkhiqR9chqLN2CuR60Dx1Gx0MZzDDnHJq7xdz0csvezJMXFpJDlUgF8jyyBstewVwXega9gF4OZfAfxpxGr2EwidlrYdNXw079dj15PU71Y/oHzPZi0IW2o+fRH2OjTA7QMNKNh5txZhS9sjDpS8g6ZC2m+9F+tAftuN7ge5y/mFdPUyuJZ2txayM+vAfbTqC/Y/YXLKvGsirMXkBTaCfaHtKesF6MePK76CoAHthD8zMH8OkDeH8NtrVi8DPm+kLmesMGqYh2x/RMTM/HdbDAcz/dU3/jEhNVxCNb6Fv6Mt77DhbtxuqPcPZsVFNx7blNUyt0oFjHVlp7tqgr0bLoHxJVxKNJGihHksh2jFZjxd6oh75a7qffFrqt9XZXttxRf5P5v5QfpKTwberYxhDbI1ITN2//0qEVhwrqHjuSv2qx/l9L8AUMFODD3QAAAABJRU5ErkJggg=="
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
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABo0lEQVQ4ja2TO4siQRSFC5lJOlUjEQQDE8FYRREFBUEwMDEcEJPGH2BsZiQoBgaiYCoiBv4FwRZDTQQROxE0sum2H3wT7EzDrLvs80Z1LnW+OkXVFcAr8Aas+f1af3hexcfib+tN/OHJT0mEbdvouo6u6xiGAeBq0zRxHMfVjuNgmqarbdtGbLdbMpkMQgh6vR6O41AoFBBCMBwOOZ1OJBIJcrkcqqoym83wer2Uy2V2ux0C4Hg88vLywnw+B0DTNEKhEN1uF4BsNsvtdgPg8XiQTCaxLAvgGwCgWq2SSqXcyw0GA4LBINPplHa77fYnkwn9ft/VLmCz2SCEYLVaAWBZFuFwmFgshq7rrqFYLKJp2jPgM2qlUnG1LMv4fD43rqIoNJvNL8/wBbBcLvF4PBwOBwBKpRJ+v5/xeAxAvV5HVdWfAwCi0SiyLLNYLOh2u7RaLSKRCJfLhVqt9v32Z8BoNEKSJPL5PIZhcL1ekSSJeDyOoii/BpimSSAQoNPpuL1Go0E6nX4yfwKevvJ+v8dxHFff73fO5/OP/Ov/Mkz/NM7vB+B52iVL10sAAAAASUVORK5CYII="
	}, {}, {
		label: "类似网站",
		tooltiptext: 'https://www.xmarks.com/site/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSUlEQVQ4jaVTvWoCQRicKpBU9ml8BN8hZZrE0tY8iMXdNoKdpdiFIBGxSRfM7RIlGDxMiEQsjuu2MHjg4REsJtWd9+cPZGFhd76d4Zv5WMB4voSQDzDVD4Ti0W2qXwj1DtMyUOucAUL2TyLmilkGYMo1hOLN4+xk4u6tXCAESbI91UfJ7akmyZ2dsDBwvUik0BhliIXGKCIPXG9XCw+OFzBctvYTIoXGiLb2o7rjBVmBsIO4yEV9yPP6a4K8twMIxVJrErVJkuXujOXuLLq3p5ql1iRpLy+oYnNMxwtY6X/z7mlBxwtYbI7zgz2U9NX9J687X4cnlAZqyiVJ9ubLCOvNlyTJmnKPC6yC7d4prIJtrsAmDtjaz/VbbI5paz+NbwBT2fFHmZRTU0qKyw/AeLn9x2eqAAAgrCqEHKbt5JPkGqZ8g7CqAPAHiSeO3LTeV9IAAAAASUVORK5CYII="
	}, {
		label: "类似网站",
		tooltiptext: 'http://www.similarsitesearch.com/cn/site/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC60lEQVQ4jY2TbUjTCRzH/0nqFttUEqJXcUFcBx306qgoKCiQnh+OqIu4CpyZ7sHtv7/rySi1aV5315P0QC+yJFun20rNctt/c+pMnWaZ1jQri6tssyfJLqTPvbCIKKHv69/3A7/f7/sVhDF0szOM199MfbCDcN+/RAZfMtbsF3LUBBFzT7Mmo5BFaYUsNxVjPlzNJc8NGlu6iA6++jYo8uI1BUftLNUfYWraadTaUpRb7Si051FuOcN0fQlaWwXinmLC4Z6vIQcOlbAg/S9U6XbiM5yoMl2odU7UOgfqTBex2xwoUi8wJUXPr7+lE4lEP0PcvmZW6f5Ak+kgXl9FfOZllLrLqA2VaIzVaIxVqI2VqLKuEK+1M+/3XMpdtaOAt8PDFJ/zMsNSgWCUSbL6+Cm/gan7AsRleVCKMglWmYRsHxNED4LRx4/mcs7aa4lGoghPnkU5crEJheEqc4510vroDQBv33/gZPApSTlNKLc3EmttYOGJW1TcGmR2YSM7T7rpudeP8LD/Cfnn6lBJMl0D7wAoa39O6PEoqLTtOeMsQYQMP3trHwOw5MRN1uc5Cd3oRrh95wEb8xzMOtgEwPn2CIIhQOLuJgJ9rwAoaR1g2z+9DAy95+XwCD/kNbN2VwktoU6Eru5eflmhZ26Bj6dDI2wuu4tgrme8VM80WwttH1cCGPpvhC32XhRmL5uzDxPuuT96yNXrtCSv/5PJua0k7Qig2V5HojVAnOhn0p4GUo53sPJUBzOLWhBMAWaYL7Jz76HPb3RVyWyQionbWo5S8pNg8ZJgkUmUfEwQ3cQYrhFjcBOTJZOc7WFp6j6qauQvw3Spuo60IicanZNYs4xKlNFYvGgkLypJRmHxkyy5mZ9qw1Z0/Ntxtlc2kppXxs+mMiaaalCLbjSSh2TxKtMNpaRsyiG/cAzzJ8n1IWx/n2GTeJBlGQdYnLafNdocTNYCXJXu72ukIAhCT+9Drje3EbweojvcN6bxf3NTD5HdL3rAAAAAAElFTkSuQmCC"
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
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABeElEQVQ4jWNgGPqgfVFrZd2cmpaV+5aFkWWAdKDYK05n5v9xzZHLKDbg3rN78m/fvuUjy4DY5sjl/O6c37ldWH8ltscufPbsGdfZG2f1Vh9YHbrnzB7HS/cvaaw+sDp0+7Et7lcfX1VZfWB16JajG70xDOB0Zv7P6cz8P6oxfEX5tNJuTmfm//a5NkfbF7VWcjoz/9eL17o2Zd3EbE5n5v8qYbKPUQyonlnaqRWjeovTmfk/pwvz37jmyGUEDZAPkXrK6cz8P6DadzMDAwPDpDUT8mCucMqzO0TQAM9St12czsz/uV1YfiW3x8+XD5F8zunM/J/Xnf1HVm/aDE5n5v/K4bKPQmr8N3I6M/+X9Bd6Hd0YvgImzrD37E4nbhfWXzBbYbhqVkXH+kNrAtDFkXFUY9gqBgYGBoZdp3Y5O+XaHRL1FfigF691feKqvnxYLNXOrGyVDRJ/YZSke2HV/lUhIdX+66QChN/6V3hvff78uShZaWdwAQAt8syRnVYeggAAAABJRU5ErkJggg=="
	}, {
		label: "W3C Validator",
		tooltiptext: 'http://validator.w3.org/check?uri=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADeklEQVQ4jXWOe0wUdADHfyCM7IG3Sqycf7DyP5srHf1Rrsw/nFuBiwnIIQ8POhQDiXmCYIAyhhEKhgb34F7c0bHj4DwJjkc8DrjzwSENNFMeYU0Yj8KsO2Lz0x+y/mjrj+9/n+9nH5FjHCLX5CHPfI08s4dckwdFvYccwxBZukGO1Q2QrnaRWttH8uUeDn7dxYELnez/yslHX7YhFCY3p8weTjVcQ2Fyc6LeTY5hiEztIBlrZ7mq/19B/MVuYiq7iCp3sq+sFXHS5CZbP0CWboDPDUMcUbuQ1fYiV/WTpuwj5XIPMRc6+KTCycfn2thb2sruMw4+LLnKnrMOxGd1A5TZb1HcNEzyNz3kNlynuMlLQnU3CdXdpNT0UnZllHOOHyi1j1JsG+G01UtkuZO3c22IQ9XdNN+cwTuzTFR5G6X2USYX/aTU9LK3tJXKtnGWfE+4N/8X9+d9TC36+X0FYqq62XLMjIip6qCg8SY/L60gU/YRc7GLyUU/hU1eIgps9N2dR++aICK/mR15Nvp/WsDsnmaDTMdrGWZE9PlOYqq6uD/vo8g2wqdqF49XQdN3jw/OOJhe8iNTupDIdGRo3Uwt+tma3cj6JC2hMgMiqqKd3SUOnGMPsXimqWq/zfTSCs6xWU6Yb3B37k+2Kay8mGagefgX/vgb8hq9BMRrCEnUIvaVfceuIjuFVi93Hj7m1oNHFNtG6L49x/DMMsbBSV5I0bIp3USY3IRMNcijFdiZb0dE1yD2lFzl/WIH+ys6mFjwM7Hg4608G4aBSVaBpJp+xEEVwbFKRKyKZ+M1TM77SK51ISKrEe8VXmFXkYPtJ5voHJ+lY2yO0MM6Mg0efl1eJTzLwjNJWhSWYSRJWjam6Fn0PSG68ntE1CXEzvwW3iloITzTTEXbOGdbRglKUPNukQPrjQcESjUEStU4x2a5PvUbvT/O451ZJvSwHhGnQmxTWHlTYWVrtoWI03a259qQyPRsSjexI99OoFSNiFOxIUnLF7ZRzrffYctRM+JALYFSDeKN4xZeP24hPOtbXjli4qU0I5JUI+uTtKyLU7IuQfO0Ik6FiLyEiKwmIFZJoFRDQLwasTnDzOaMBl49aiZMXo8k1chzyTpCEusIPqQhYA0MlKoJStAQvCYMiFc/FWyU1xMmr+flNCMSmYHnk/WEJNYR9B/w//YPGJmj7U8FPrwAAAAASUVORK5CYII="
	}, {
		label: "W3C CSS Validator",
		tooltiptext: 'http://jigsaw.w3.org/css-validator/validator?uri=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZUlEQVQ4jb2TMQ7AIAwD/fQ8JQMP8ZO6d3AnUAUtCkHtcBPmpFgJAGgTSOeRogl6asC9CIBIxgVm1gcG8VTwEnp8/0YwI1xi5PP/ApKDbLmDu2xL4F7iApJtI1Mj1HC6g9QxrXABNY/jTAoGzWYAAAAASUVORK5CYII="
	}, {
		label: "Validate.nu",
		tooltiptext: 'http://validator.w3.org/nu/?doc=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACRElEQVQ4jYVSP2gTcRT+krRpL+aSu+YuJM01af5d7y6nlRalCGqIBYNQMUIsClpoK5dFWuLibCnWoZuToOAinbp1UKGIk1tnHYqDGF11ilC+DvldC62tH7zh9973vfd4vw8A4Fqtqh/4D/7Jrdjehuu06DotVhxv/SRxxfHWD3i2t3FYGPPqhw1aHaAZOi5vhipOq3PAG/PqfqUfUOOWOffLMudomXPM5xtNADKACIAoALlYbDYca5GOtUDHWvgJaHJPCwwBMA1j+m0+N8N8boY54/o2gHEANoCzAM7lR2+9M0t3WS7OMpu98QZAWWhhAmiEw+pzXZugrk0wqV/4GwxKjwE8APAwGJQeGZlaNzdSp5G5RknSnwC4KbSYAtDmEQwO6p8AvADwkiST+iTTqUtMJNwfJAlgWWhRA7BKkuGw/EWO5ihHsxSk9wC2SVJVLGqJcUpS8rOorQgtpgGskWQgENpS4uZeLFZg7923Ewj07ZBkLFagEjf3AoHQlmiwJrSoAVgRydfxWPmrqljsbaR8GxhQdklSjmYZkZIdAB8Ed9XfYArAskg+lc+MvErqkyRJRTH/qKr1W1XtoycigLZ/A1Nc9D6Ae0Dodjp1eTczXGUmfZVGpsbh9BVqifPfgeCamNwG0PB/YUj8qQvAAVA2jPqzUqHJUvEOy8VZlgpN5oz6R7FyTUw2fR/0C8fJwnWRVKo66ljz3Z7rFulY811Nu2gCSIoYEtz+45YXcG1v0/e9a3ubJxJPg2t7S67tLZ3G2Qc+i/c2dck1ygAAAABJRU5ErkJggg=="
	}, {
		label: "WAVE a11y 检查",
		tooltiptext: 'http://wave.webaim.org/report#/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADbUlEQVQ4jW2Te0wUdADHf3/kWOsxHjfYQhqQYzB5KN5xHMfxuo4jQGUZXYzMB4/gOqDCazwHDjDBKxWDeA857hAPuAPhQg8lZ0wqcMr0ChmDIdlcudU/1art03/ljM/fn89/368Q/+clLw8fQ0hIiCNKFrW6W7Zr7ZWQEKf3c5JjQojgLfz/eH6b13sxStmGvjYPk/U4XVfO0OM6w6cXmyhrKCYuQfHI6wWfyi1jiY9vc/bRLPquteJwm5lwm5latuJcGWJy2cLUyhDW+U7eKcnBz8evVwjxzL+xVKow5Op12BZ7Gb87wITbjGtthNn1ca6u2pndcDC1bMG5YmXqvpVC4yEidkYcF0IIUVhY9vKOoB2PW23NXF61Mfn9IDPrI3y5NkGWbi8JKfE4l4aZfTDG1H0LVzdGsV7vJCws9HdtfGaU0Gq15dHSaHLzddzYnGR6dYj5x9PUmIxo0tRkvbGPvJKD3Hg4gf1eH9c37ZTVFBEWGopandwiVEmq6abPa4lTKZhYsDC7aWfuRyea9BRMPY0MubqJiZUyttjHxTsd2G/1kahWYWw0oMlU3xRxifJ1xy0LyZokTg+cYOHXGcYXBomRSzHPtHPp9gAxsVJM1jps9zr4ZLgeuULG+WutqNNVD0V8svyBa2WUtwveQm/Mx/3nHGctJ1CqYhlZ7GZ0qZvUzBSKqg4x8l0H+tojqNOSMM+3otLGPRLhUTtnRxf6aWirIS1Tg/u3OQwVBezXpXPhdjt9X5/ioOFNXjugYXipnYzsVHKKXuf05XoipRGLQuIpqf24vw7Ht4PskUUz9c0w2gwNHzYW0XOzmVOuKoxn9Uhjoml1NCGLlWJsK6b03FG2bw/4TAghQrX7X/3lqx8myc3XERkRSXxiHF2uFlqmK6ge1dM4foxErZLI8EgSUpU0TJaj3Cv761nhrRBCCOH9oqS+0lTGF+4L5BZkc/J8NV1zJ6mzl1A+dASjLZ/32/NIzU7mo/5Ccqr24ecb0PHkkj0CAgKHK0ylTK9ZGL7bhulKFbV2Ax8MHabYnEP52GGqnUXoqjIJCgpyCeHp+fQdPHy9fFtSD6T8UdluoNFhpP5SKUZbHu/26tA1ZBCbEf23v39g51bxE2yTB/oHntmj2L2oTJP/pEiT/bxLGX4nODi4QyIkSU/b/wCyVuaeC+U/VwAAAABJRU5ErkJggg=="
	}, {
		label: "SSL 服务器测试",
		tooltiptext: 'https://www.ssllabs.com/ssltest/analyze.html?d=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB1ElEQVQ4jX2Ty04bQRBF6zMQ8BP1E9nBLgt/mB0Hgg34IYFfxHhgAZEikm/wyuN59DwwlkIkZKSwOVn09NgIkpZqNX1vnb5VIyIiH++W7I5S9Poe6cRIJ0a9HGlHSCtCJzlyGiEnIXqZsXNm2L9dIE4s3RjpxuhVYdCOrEErQk4Lg5MQOQ7RcYY0Q6QRsHezQHZHqTXoFAbtCGlHDKIV7gyiFXIcIs3CoBEgRwHb3RjR63v0ylbl5xL18lLsJc94ybM1CVfoOEO/puhFio5SdJgg7s2b2E7ssD1jTaQRoBcp8iVADue2nFja67BKgwK7NDgK0FG6Fh/MEfVy1MvRSU7lx5Lp7xf+daaPL+gwsTVI0H6CuFG5tIE3aTtswL77YI58niN1H3Fia5BZgyLt1uyJ1uypxAbQQbIW131EJxZfJxmVu6W9NM6ofH8o0SvfFugwsd/6Cdo3tnoGcRvmsDfTdsdhWwNjO3/ykZqPOLHDfi9th10aOHHNR/QyswtSYE8f/zOFX3/QnlnXuUF2zsybtOVw/irtTWztGdu5OmOrGSL7t4tyt9/Dlrr/Clt7BqnOkOqMD15u/8i9mwXb3dh2LTZM+0k5qrJrzUfPDVvNsBT/BYjk09Pw0KheAAAAAElFTkSuQmCC"
	}, {
		label: "SSL 检查器",
		tooltiptext: 'https://www.sslshopper.com/ssl-checker.html#hostname=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADEElEQVQ4jX2Tb0zUBRzGv5O0UPojS0JH5hAh/hzin1dOReMid7HcTFrhMjdpgOGf2xEHCjJRS6digj8DKbHWTKa/37HIWrimMt0kBoYYcCgqTkJ/cHocyJ0HPz6+wF7Ssz17tufFZ8+bR0REZE7Ca6vs5buzFYcju1RTt5Zq6rYyTbWVaapN0dRcRVPtiqbmH9PUggqHw3ak+kSEef0Cea7JqSU1537ug7Mu0FzwyyM49xjqPPCHB+oG4E8PXBiE+kG46gO1pUcPjYiJFYl7f0lmvZuvumB3O+ztgP2dsKfNoLBpmMLGJ+xvG0G5DRV34Lu7UNUNNW5Iyig6JLJwXUrKb/3kd8CXNyD/H7A2+am89pjr9z209niobXdT1DTMwVtQchPKuuCbbghdbftWxJRmWep4yOZW2NQMWc3w9d9P8fkNWt3Q+Aj8Y3Dmppfc67CrbXxhrhMCVlkVkYQ0y4LqXjY0wmdX4ONLcOo2dA/B55dhfT1c0aFzALY0gv0a5LVC7AUQ83NA7MlePrwIa8+D2eGnssVHh8sgtWaID9RB6u6M0OEaJe13L5mXIaEW5DRIsk0RMaVZIssf8N6vsOIM7Lo4xEOPD6/fwPngCe29Q7iHR/CNjFLd4ibqh1GmHIfAn2CS2aaImD61hB/pY9lpWHwC6rqYUP3DMKccgo7CK1UwyZyjiJg2WGYfcLHoe4grg9r2iQE9Hog6CtNLILgSApLyFJHodMvMYjeRh+HNYjjbMjHgXw/ElsCMfRCiQMDK7YpIdIbljR0DvFUMM3LA0TwxwO2FhH0QWgwzD8PkxEJFZN66lFnbfYQXQpgVrD9CQyc0OOEv53g2OMe7qnqILIDZRRB2EKYm7akQmRYSH2PXvTFFEGWFyCyIy4T4dIjfCKZ0iMuA6E0Qvhnm5kD4TjAdgmnzP8kTEQkIW7TxwFJb5+CKnP6xpG26Yc7WjeQs3UjOHM93v9CNd7bqRqJNN5bb+8aWFNzzv72m9LyIhPz3yCnywkuJgUHBHwUGvbr2/x2c+uLUl1NE5HURkWcRXLN2a0bCxAAAAABJRU5ErkJggg=="
	}, {
		label: "Header Check",
		tooltiptext: 'https://quixapp.com/headers/?r=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACiklEQVQ4jZ2SW0iTYRjH//ve79tR80RpokVojBIvwlogFrJiFybmacQaVh4uRLuyA0lYoy6kNKSlGRQGERUSTZGQQDQhA9GWKbIybdE0p2PYdKudny7yItmE6H/7vL8fPO/zB6KEDJDS4C6lZ0i5n0bSM8gAPtq7SNAIiftpynnf8N7pwNi+EE2pKGTO8YffZY/7h9OrCBBtCtsroFhpizFRXwqFXqaSx5Q85u3Z9sL3KmWKxncSvd9BwddJHdQNFl1QL77ub5GQ+474l7tDrCeAAwDSQhzoVVwID8SG6U0c+ftjqyPgz1psna9kS57LAi038W3fiuSphvw/e6+1ymudDbL0gEn2nAZjKNSjmCQjJBsEn4r5I/MnGS3VsrC9hlfb66SPXdVIBAD33cQGjzHe5H8kVJBJTsFnMh91S5QbBB+PMa2tlJFVz3yzOl69UCezORoTCtdubN/jfpj2wNMeF3DfkjQE7sso2CWnn13CwQ2CaQ2vni3gyFrChWfKUfi1QrC4rsbTj840X6ArmVZvSmZXDbJLoRYp+W5LvHRPsnuDwKJC0pRatGgrYjRTzBknC5Btr2K9znNicl8R08pFfsB1lvVSE0/ea8L4tAHiiI80H0LTFw1Hc6Wcb+EUqyIt2PfTXKerTqDlet7rLEHYWw5y10AX9YxD+ZCa87gns0c5mi9jZNOLJmzFGF3U8+SoFchxWORfyETzZmViAIScBMT1HUDj21yRxZyL4GgGaDKPCzmqBbKfYfMGJVIBCEBktbn1gRQAnwUktmciq1VATr+K6RZ0LOioEWjiBK9Zh6O3MVqIILKW8SM2PbM59djyz+DfmTvOKq0lfPN/wQDwQQOFRYWkaLPfDBcdeek0cmkAAAAASUVORK5CYII="
	}, {
		label: "URL 解析器",
		tooltiptext: 'http://urlparser.com/?linkFrom=flagf1&url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABB0lEQVQ4jbXSzUsCURTGYf/pG0hQqxBulJSbGWhR5GKiIHAjLQpuU6b0IbPQyLJiDAXBHE1tFJtfCzPMPsYZ6IWzfJ/D5Z5I5L8ipGJyQhcDQX7lPyEhFfHNSzTDYmHtFCEV0VUTzbA+J5HMMx8/+Q6M1bLtAKAZFkIqYnqO6bj9IVv7ha+IH9Du9NF3LDL5KgBO2w0GPLdGBblxDsDwzQsGdHsDdtM3XJcbANw+NoMBk7mvOCxp2Z+B4t1oQzJVREjF+vYVAPVGj5ieYzGR+f0rhVTsHZQ+3vzKUdamVu8AcHhm+9+CkIq5ZUX6+IFmy8Xz4KU7wLx4IrpiznaRoa9wVsi3GCbvwhD0UutMHFIAAAAASUVORK5CYII="
	}, {
		label: "编辑页面",
		tooltiptext: 'http://www.printwhatyoulike.com/print?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADCUlEQVQ4jYXTaUjTcRgH8McusqjogKIXBYHQiUiH2IVQaFBmUpYVmpWZ0iGKpUZrKzvISSKmpVPTldnm5t8doa2/7VA3jzUXtnWYDV2OOdncZFBQ+e1NCpHWFz6vfjzP83tePEREBCAAQAAR0bOWrOAixQFugXyX4ElLXL2kI75GZjyZ22jKPlpamjyTporRIl5xX3mo4Xbd1rFHmihoes+gtS9lQktfCjQfz9pM/feyLRbLrD+KK2SX5+VJI3p4tVtQ/movXn08/Q9JMH3JrwIwbfzXdFO0s5BTsxF36reh0ZqApncn/tJoTUCuOAwXH65BnTF2rHugMJqIiG7XxyzOEYb4c4QhqG6NgvztsUnlCEMQnh6I8PRARHOXoKE7RU9ERFcfh+25VBUMTu0mSMyxkE5C3pPoLmLOH7hYEpF8+EbQ8/CMuTj3YN1Xt7t3PmVUBh9Jr1gPvnInal/HTIoxn44f31etVs/IKYvJjMhaCPWH/NWUJQyLvCBYgxL1bgg79/1FZDpaZ7PZZg8PDV13u92nPB7PAgDTT+aFNqQWbF9FbM/TpZerQ7+WtUWgXB85QWCI/Pm4K7a8iZFIpNXVg6a2NrhdLox6vS7fyAhXrinbXKsqWk5ERE/16XkV7TE/Kwz7/Y86Dg6ITGdePmnIuvaCYXpYlsWo14vyggI8Ewjw+f17jHq9GPV4HAAWEYCAmq5TCY4R60pzZyeHz+NJ4qOi3pyNixvL53KhkEphNBpRyufjVmYm7mZng5XL8clqtTocjjnE4/GmiU1pEp/PF9RrsQy1a7WoKi5GRlIS2nU6KMViFObmIvX4cfDS0qAUidCl1UKjUIw5nc4NRERkt+sDiYj8fv8yr8dTPOx0fuvQ6VDC5+NCYiISo6NxJTUVrSoVNAoFWIZBp1bbPOVd+FyuIJfTKRjs7//BKpXI43AgqqxEs0wGlmHQLJN9N+l0a6dsMB7HwMAO5+CghZXLof49mWUYGFSqwok7+F/sdnvgO7P5vF6lMrY0NYm6DYYTNptt9vj7L6mnPDF0znLsAAAAAElFTkSuQmCC"
	}]
}, {
	label: "镜像快照",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABSElEQVQ4jc3Tu0tcYRAF8N+GXVhWs+hGAiIi+Fh8gA+wyDZCEPf/MH0KNUXKZUmagNikSGETxEIb7S01uEUaQUQI2gRB7EQIQghrceeCXJSYLlN8MN89Z+6ZM/Pxv8Uz9GAIvcj/C3kYqzjGJX7gK2rI/Y08ie9o4wItnEW+h+4MvoaJNHmOnQCvo4oi+vAWcxnyaKjbDa46brCPF3E5J/EgjZd4jYrEo4Pg1GEl/t4I8Hv8xgYK0f9n/MGnwDSCsyyONprx8R1+RTv5KLCGW3wITDM4SzCPaxyG1BJmQ2oaFbxCOTCt4MxDB7ai4qZkImUMRjsLGROrOMF2cMEYvkWRKxzhp8fHOIORzJ1+fMRpyDvHF0x7wiJBV/S5KDH2jcSL0lPInZLNmpV4MI6pyAceUFBy753kJMtTiULp6AqRFzLkfKgtwh2F4z1a0Vqb4QAAAABJRU5ErkJggg==",
	child: [{
		label: "WebArchive",
		tooltiptext: 'http://web.archive.org/web/*/',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFQElEQVRYhbWXy2tTTxTH576apOBCEbRNXHTX3iQ2uvPxD2hTitidCiI0idVuBBdZxJvUahcVCooI7l25sFRSG18USxpNti5s1NqHS/+BgMnnt3GGuUlqyw+8cLiPOXPme77ncWeEaZoIIRBCYFkWpmliWRaWZWEYBoZh4DiOGhNCYNs2gUBAiW3bmKaJYRjqLp/luxBC3eX3P+sKNUEflAYkGNM01cISsC6BQEABlfbkPB1QB4j2Adu2sW0by7K6LiSEIBwOk06nmZubI51O09fXt6uuBK57rQMTuvc9PT0dBgzDIBgMcuHCBZ49e0a1WqVer9NoNABoNBrU63VqtRpPnz5lbGyMw4cP/9UBnREVAun5uXPnGB8fp1Ao8OHDB/7v1Ww2efHiBdeuXWNkZESxJEMk70JDQk9PD/Pz8zx69Ij5+Xnm5uaYnZ1lZmaGu3fvMj09TaFQYHp62ieFQgHP8/A8j5mZGe7fv8/s7CwPHjzg4cOHPH78mOPHjysAOhNCeyAYDJLNZsnlcuRyOTzPI5/Pk8/nKRQK5PN5PM+jUCio9/Zx+ex5Hrlcjmw2y507dzh58qSPAbmmrwp6e3v/N+V7Xbdu3VLV0hECiSYQCFAul3n//j3FYpF3795RrVap1WpUKhWWlpZYWlpibW2NWq3Gx48fqVarvHnzhmKxyMrKCrVajVqtRrlcplgssri4yKdPnxgbG1NhliFXANppicfjjI+PMzAw4ItXMplkZGSkI6vj8TgXL14kHA531W9vRHovEHqzEUJw5MgRvn37BsCTJ08IBAJYlsXVq1cVnZcvX8a2bRzH4ejRo2xsbADw8uVLQqEQtm1z5coVpX/p0iVVadJhlYztH44dO6bqfGFhQfWGyclJGo0GjUaDGzduKE8jkQjr6+s0Gg1KpRKhUAghBDdv3uzQl/HXu6PQu5UE8PXrVwDevn2rWm86nVYepVIpX1eU+q9fv1aAu+nLsa5VIBmIRCI+g8FgECEEqVRKGUyn0z4A6+vrSr8bYKkvnWyTTgD1er3DoA5AZ6C/v58vX74AsLy8rLxMpVI0m01arZbS3xWA3qF0gzql+wFQKpV8DLRarf0x0A5AUloqlfYEEA6HFWPLy8s+xlqt1v4Y2C0E7ZTulgMyZ/QqyGQyHfqO4+zOgOxOehLuB0B/f39XBiYmJjoY+ysAvQz1JJRVoGd1JpNRBvSy1ZNWZ+D69es+AL4y9O1O/lDaLasnJycBaLVaTExM+ELQLQl1BqS+4zj+H5HshHoSRiIRHwDdYLPZ7AhBX1+fStpXr14pxjKZDL9///YloXTG1wnbAQwMDLC1taUAhEIhTNNkampKeTQ1NaX2eLr+ysoKvb29XfUNwyAQCHTbJQt9f4bjODx//pxfv35x+/Zt5emZM2fY2dlhe3ub06dPq++2bSv9e/fuqe9nz57l58+f7OzscOrUqd1zQC9By7IYHBwkHo9z4sQJ4vE4rusSjUaJxWIMDw+TSCRwXZdYLIbrugwODhKLxUgkEkSjUYaGhhgaGsJ1XRKJBMPDw0SjUQ4ePIjubNdd8YEDB/hXVzabxTCMjjwQ7ZScP3+e0dFRksmk2lAkk0lGR0f3FF1Pzpf2Dh06pBaWf18FQPaAhYUFKpUKq6urVCoVyuWykrW1tT1F19Xnrq6u8vnzZ2KxmMobXw5IWhYXF9ne3ubHjx9sbm6yubmpnre2tvaU3fS+f//OxsYGruv6+oA6mOit+F+Lvh/0HUz009Fu4jgOjuPsS6/bPL3+O6qg7bz2T7zudgr/D1btuaaMYsEYAAAAAElFTkSuQmCC"
	}, {
		label: "Yahoo!快照",
		tooltiptext: 'http://search.yahoo.com/search?p=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6klEQVQ4jZ2TPQrCQBCFv3gKkZwieACPICnF0iOIWAnBc+QIVhaWOYmFeASxEAmxyFuZjBsNDgzJzM57Ozs/EJcUyIGNNJfvp0yAErgBjdObziZ94Ay4RoBer4r9uHkI2JJ0MimHAJOuXQZwat68c1q1wMSDQ01SaCtsD44iXsiugJl8KxebQ9sm63wCewEOIhjpWymzELuNETyAGpiLZAqc9YRC2XQI/BNqaSMCe2Ph7NwXMRCcgKUIZgKGelT6v2Oms7+NSW9b322E74NUR3wXYIyTTAexetQO/DHKNpO/l8mKXec1X9b5BeoMms+X/SAKAAAAAElFTkSuQmCC"
	}, {
		label: "Google快照",
		tooltiptext: 'https://webcache.googleusercontent.com/search?q=cache:',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA4klEQVQ4ja3TIU4DYRAF4O8IBElWoCsQpBLFETbICo6AqsQ2lRxgg0CiOACCEyDQFWSP0DRVBMTOks3f2bKCSSbZzL55M/NmfnKrUGMZXkfsTztDgy2+C9/iMTCpXaJNEkv/DOxB5SnJvbdlJ00CesEdFoF5KP43fXI1MvPpID7DKtGkolM4a/MET/F9i+cEU9OtKSN4DZIbrEcwy2MEe93aYI5NxL9KgmyEN1xE2ztc4yohqMdEvI+5h4LNx0TkcI0fOI8KPdl7gfldI/9wSEw/5VZyysNOjj2mJquc2eTn/AO2Qpu2apnWtQAAAABJRU5ErkJggg=="
	}, {
		label: "Google(限文字)",
		tooltiptext: 'https://webcache.googleusercontent.com/search?strip=1&q=cache:',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA2UlEQVQ4jbXSoU4DQRDG8Z9AViCQFYgqQtA8QAXixMkKBCFNJYIgKgiGEGRFVUXTh0BW8AAIJLICUYlAIkDsXHNJj+OOwN/t7Hwz38wu/8QeJrjHCp9Y4g6dn8QdvCArnZ+xxm6T7sPoWCaL2KBJgatI7pZi3TYFeviQ5i04xquGI0AeginO8RCFW3MoWb/9jRh2wsk7+m1EF1jgEmM8SXvJanQb8RKzivhc+h+1FO9dtbCe7f+xRR5JpxV3/XBXS2H1TdrDAY4wwuM3zirZxxlucI2TKP73fAGclih2C09hawAAAABJRU5ErkJggg=="
	}, {
		label: "Bing",
		tooltiptext: 'http://www.bing.com/search?q=url:',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA7ElEQVQ4jWP4v5PhPyWYAZnzfQsz+Qb828nwPyAg4H9OovP/1W3q5BsQEBDwPzXWjTIDAgICqGNAWbr9/+UtGv/vLuUnz4AplYZwfkqM+/+ZNXr/L8wVI80LkaE+KOIBAQH//5FiwNfNrP87isxIMyA30fn//50M/+8u5f/fnGdJmgvS41z/X5wr+r+nxOR/IJrG5Bj3/4enyuAOg7wkp/8Ty43/BwX6o2gMDvL7v6hRG2tKRUnKfaXGGM5tzLX6/2QlD3F54f9Ohv8Hp8j+jwrz+Z8a4/7/+HQp0jITDP/axvz/7w5G0nMjORgALS2D1pyznwIAAAAASUVORK5CYII="
	}, {
		label: "Gigablast",
		tooltiptext: 'http://www.gigablast.com/search?q=',
		oncommand: 'showFlagS.command(this.tooltipText, "host");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADDElEQVQ4jW2KS2icVRzFv85MJomKC+ur4kIpbly4sYlWY2amkSYoxnSQaiGmNraNFUGEZqGxghZFo+ADHwvdGESIaOIm1LYgLUoNSChIiiUJfVg1D9LMdL7vu/e79/7v/bkoFkXP4cc5HE7EFQUIl+Nf2//y9z0QEQKBgOBxXrBicN4iQZDgrvBPe2/BOiwZUUAIweODxfkEZzTOOqzRaGfRzvyHS84iNkUQIhcCVhQNa5k+p3j960Uef2OVjhdi2p/RtA0pNu1VtA1p2vZq7t6d0D54npnTa4h3RCKK842Ugakl1u+LKWy15EqBYqdQLDnyFUe+JOQrlnzZUigLTZ2WTyfqWJcQaZXy8Mllmo8Krd0ZTRXFzb2OuwYUmwdTNj9d577BmI6nEu7fpbl3d8qmZ+t8PBljtSeamr/E1YcbXDOakusy3NmveOkDxxdHE779qcY3xw3jP2Z8OV3nq2nFoROa70+k/HrGkIkhemuyQeF5R/P2Old1OoZGDWfOWrQJTP2g2bhtjduqy9xajdk4sELfK3/y+ZE6NaUIEhMNf5aQf1DRXDI0dyW8PxFjMkUWNJPHFimWFbmKptiRkesSijscTT0XqQ6vsNRoEH00sUK+pMhVYgqdhgNjKdqkeGuZv5Cy582U3v0NeoZj2vvrNO9MKD6R0lJKeXt8iWjunGFDzxq5iiL3gOf2bcuMfVdnYXWR32oNjp2ucWgm5vB0wr6xhNbHDMUtMevKgScPxkRaaw6OJdywNWbdFkOhZGip1LiuO+GWR1M29Cpu6tNcX12ipXqRfLdQLFnWP5Qy8oklcj7w+7LjnTHNPXsSbnykTmuXolAx5EsZ+XJ2uVcymsoZ13an3LFDseu1hOM/K6IQAt4bluqGIzOGD8cz9r+XMfCqpnpA0zei6BtRbH9R0f+y4rlRzbvjiulZIVGeCA9BPOIzjGgaacYfq8LcBcupBcvsvGF23vLLnOHUguXsoqOWekQcwRsiHzRWhMyDcY7MC0YE5zOsWJw4nDjEGbzzeBGcCN57RIS/ABzCMmCoimPmAAAAAElFTkSuQmCC"
	}]
}, {
	label: "网址解析",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiUlEQVQ4ja2NQQqDQBAE6+v+RyUIQkAQcsjBix/wAX4jl1WGZrY3gTQU3TPbzMKf1AG9QCVfdPHAKAfHZF/rAPAw7t5uTXJ9SrLrMCcQ3HWsnoWmlkLMcXYOwBrc5VX6Tb0K2Rz3vBPim3MANvl5+9Jv7cYjWQeAQw4eJmsXgAE4BcR1N2SHftYHOcZOEltHUS4AAAAASUVORK5CYII=",
	child: [{
		label: "二维码",
		tooltiptext: 'http://atomurl.net/qrcode/?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiUlEQVQ4ja2NQQqDQBAE6+v+RyUIQkAQcsjBix/wAX4jl1WGZrY3gTQU3TPbzMKf1AG9QCVfdPHAKAfHZF/rAPAw7t5uTXJ9SrLrMCcQ3HWsnoWmlkLMcXYOwBrc5VX6Tb0K2Rz3vBPim3MANvl5+9Jv7cYjWQeAQw4eJmsXgAE4BcR1N2SHftYHOcZOEltHUS4AAAAASUVORK5CYII="
	}, {
		label: "视频解析",
		tooltiptext: 'http://www.flvxz.com/?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACcklEQVQ4jY2Ra0iTcRTG/+qmW6+XTS1lGtmX7fWdbhqZ2OiilFjCiggrdWh+MFtUoM1GamqkOS8ttRpYkKEgY15mBgVeyxhMM9FUMBJzdNFc6QKxLHz6kF/MF9wD58OB83s4zzmEsChyBz9GHMSVr7UumQmUlhDiwjbLKi9C/HITt9ZXJgdadvpy4h+dD7SqDlM5ThusSXBI4v08LVq4UnLCa7Xpgs9HQgjPGdDjgEIRGxcXF1+Sndo81nIVvfq96MkXQuTjdmpTukKnq/q9sowvtiksfZ3EYIcejvZYdF/3Bb3NY/MYGRlpmT+XFrH8ww6H/RMW5z5g+oEMPQXeCBfxc52J4G0w3G1c/G6H49ssTAat5V25D0yXPH8J3YnMGQNCCOFnq9NvVOVnNJYlUQ2jt/h4dsX9M0WRAGdgqizJ1ThQxPljLeJioNQfw7VyWAp56NS4LRzbRc6xUsHhiqPS1NrW6CzDq9biCIwU8zB+0xOT9Uo87TCh/PETNObJYbnmtro7mBzcsDKjsThklbOI1NsRVT2PWP17HKmeQE6NEeP9zeiyjsHYZsbrPAqZMZyCdTRXEBJBa4cRVjIDWakNSXU2GAcXoLxvQ3TZNPbrJpFQMYoGoxk1yQKryIvQ6ww4QolCcvElpNpRSLVvcfrOCGbn5vFmYgb7CgfBaIbAaIYgUXeBePiLN+TnUkFycXo7QtW9CM3qQry2E4UP+xF1uRuMug+M+gUYdR8kZ80gZIuI7Ya87Ym358VnmkCnmECntiBU1Qpa1QZaZf5XKc0ISdRNEUJcWb/A5QfuEUiUej/pyXts5cscryKeAWH/c38B9b8egwNZncgAAAAASUVORK5CYII="
	}, {
		label: "天涯脱水",
		tooltiptext: 'http://www.tianyatool.com/cgi-bin/bbs.pl?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXUlEQVQ4jcWTUQoAIAhDvf+l7asIeToLIiGIueYUM8vD4e5EnIl4jnnxEVVFJ6RKYjuODpX1dgskIgWy/jN35fAIp6pVy29CDvBmkZBQOZBcJfDPAS3SwrO/0FkuG6mPYZ+tEmByAAAAAElFTkSuQmCC"
	}, {
		label: "TinyUrl",
		tooltiptext: 'http://tinyurl.com/create.php?url=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVElEQVQ4jWNgYJj5nzLMMPM/MoDxkWlsYgg5NAXoinBpJNoAdIPQ1RJlAD42A4JBQSAOvAGofsIMPNz+J8IAfGJEG0CRC3DJUdcFxAQY7oAd6HQAAHRkJ4+ZfqapAAAAAElFTkSuQmCC"
	}, {
		label: "is.gd",
		tooltiptext: 'http://is.gd/api.php?longurl=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVQ4jWPYzsnwnxLMQBUDLqUl/L/dUg/HMEl0cWR8QEMBYcDbg/v/I4PtnAz/r5cW/McHfn14j9+A2y31eA2AqcPpBXQDniya///bg/vYDbg/uf//24P74RibASfdHf4fNTf4f9LdAY4p8sL9yf1UDANsBhw1N8DwM0kGnHR3wIh3bOqI9sLHi+f///rwnnwDSPbCubAAvJo/XjyPMABb/G7nZPh/QEMBRRybGopzIwC80ORySzRuEQAAAABJRU5ErkJggg=="
	}, {
		label: "Goo.gl",
		tooltiptext: 'http://www.ruanyifeng.com/webapp/url_shortener_plugin.php?longUrl=',
		oncommand: 'showFlagS.command(this.tooltipText, "url");',
		image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuUlEQVQ4ja2SPajxcRiGf9mUVcosWUTJIKn/gM0kEynJqJSPpAwmkSQDKbFJkokig1FJmUUGi4lIIR9dZ3rfeotzzvA+29PzdNV9dQvxP4YP0+l00Ol0DAYDlsvl259vAc/nE6PRSDabJZFI0Gq16Pf7XC6X3wEAAoEAPp8PpVKJw+EgnU5zOp1+Bux2OwaDARqNBq/XS7FY5PF4/BxhMplQKBSIx+N4PB4UCgVyuRy/38/hcPgMmM/nOBwOwuEwiUQCs9lMt9tFLpeTz+c/RhRCCPF4PIhEIvR6PQAajQbtdptcLodMJkOSJFar1WfA6/Xi9XoBcL/faTabaLVa9Ho9BoOB0WjEZrP5nYPhcIjVamU8HmO321GpVEiSRCgU4ng8/gwA2G63SJKEWq0mn89zPp+/d/BneT6fTKdTLBYL9XqdcrnM4XBgNBqRyWSoVqtcr9f3gNvths1mQ6vVUq1WAXC5XMRiMWazGbVaDSEEu93uPWCxWOB2u/+2rNlsYjKZ2O/3VCoVnE4nwWDwc4T7/f7PIZlMkkqlWK/XCCFQKpVvXXys8mazYb1eUyqViEaj7Pf7txK/AJZP7MzxMNNqAAAAAElFTkSuQmCC"
	}]
}, {
	label: "Alexa排名",
	tooltiptext: 'http://www.alexa.com/siteinfo/',
	oncommand: 'showFlagS.command(this.tooltipText, "host");',
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC3UlEQVQ4jW1TS0xTURC9fS0VQVpUBMQfKCKaoAsTE40aUBPjQmNiXLqQGHdGaF9baG1a0YoSFhoErBEh6sJoJBg/C6OSGNSoqAs3akSMb+59Ly2fgi1QKRwXPD5VJ5nN5J4zd+acYWxOHA4OWDfVaeU5PtFp9fBfZgfB7CRY3TS4xCsebahTDx+5oaWz/8XWBlG8/LRoT3XRqFEmSH+lUSakOnk0zy/atl0Wq5LAm+tFscVDL036Y4OdYHIQMtwcC6o5JPtUzShP1XN9orO0Wc3Xv91jzfaJeya9i1EmbLkYgvNBBJ7HQ2jsiqLu+TAKz2mQ5pDk+dWWyjvKfFZUK46ZHcqIUSYwO2HH5RDe/Yxj39UwLG6O9Rc0dH4bQ/unEaRX85lx5rv48MY6cYjl+HnXdGdmI1R0RBBPTOLg9T6wCgXspALXgwh6+saxvEadGcUoE3J94h6zuHlsmlWyE/LPqjh6ewCrAypWB1SUNYVxszuG7/3jWHkmmSDDTcRMjtmCUSaYZMKu5jBa3kTR+jaGio4Ibr2PoacvmUCSCVYPn2DznLNgSSYcvzuIz6FxnGgfxGKvAKtQUP1wCL39iX8ILB6KM6ub+qa1XniKo1uJo/VtDAYbgVUqyPIKPPkyht7+BJadVsFssw2tbvrCluoSSjIhvYqj49MoPtBvlDWFsedKGJde/ELbuxiUSALltwdQfF6DpEu58qwIspJ6dV+6i/olfYlFtRoCT4cRfB1F7bNh7G6ektN2P4LmV1FsbwjBYCdY3CRKG0PbWTDYnVIQEPUpDpo06i402AlmfbkGm25n3Z0GO8HspPE1AeEBIDHGGNt7TVmU6+OtZgclJDlZlbkpyQSzU4mvqFEbDrSEM5Lu4WBrb2ZhrVad6eE/Uhw08Tc4xUkTmR76ujagndgfFGn/vUi/3y/tbNBK1gRUb7aXP0lz0ce0KvqQ5RUPCwLcUdbE1zHGDHMxfwDuAj+ls3X/jQAAAABJRU5ErkJggg=="
}, {
	label: "WolframAlpha",
	tooltiptext: 'http://www.wolframalpha.com/input/?i=',
	oncommand: 'showFlagS.command(this.tooltipText, "host");',
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAByUlEQVQ4jZ2SP28TQRDFx0jIiRNsbmccHPtu506JcEMFUkCRUDqqFCkoKPINEEViCUhHgVLyGVKmQkIgN9R0hjZEPt/OmT8miSLkNJHiyJvC9iXCnIV40uvmNzNvdgEm6OvM3PobgOlJNYksQKYzXVr6NgSaANkYvZ8d8ldGNUJ8tzk7W0xtIg6/Fqf8KXRuPYkweCrE1pBfD9Ffi8nfFdLhlxyVUxvsF72HMflWiNNc/yv4CuBaU6l8pCqPBXU/rUFE+kNEQbVd8Bb2bpZ8AACIC9qJUO8I6mNBfS7Ett/9PWYhtoK6L6h7UZGPDmbm1y+vTUFVUL8fTTreeD7w5suBa1uXm6B7so/e2vgBp6YCUX53Qn4rxDZWencM7uRLS4b051FRagRiK8rttUivJvBhtrho0HtniH8J6l4SYfPFwLWtPyLoc4P6hyheTl4AADINKOciFTwyyGdp6xvieuh4d76ryoMw7y6ORQnnFpYFh1OITxMQuSvEtqW8t6mfCACgXahsG+K6Qfd+jO6zIbzXulG53Xa8bUO60QTIpvGZMDd/rwFwHQCgAeWcIe60yd8YFRhyVz4CFCZucVURBbWTLFX/GfgfXQA2JSG687sO8AAAAABJRU5ErkJggg=="
}, {
	label: "BugMeNot",
	tooltiptext: 'http://bugmenot.com/view/',
	oncommand: 'showFlagS.command(this.tooltipText, "host");',
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABxklEQVQ4jbWSv2tUQRDHN6BphDRa2VzA8sAmYORi7n3njLn9TmFjoYEUQdG/IATt7JRYyXUiQsAiVYpUdhFJYWEqDYJoIVikMB6JyrtkZziL9y7h9ALXODDF7uznOz92Qvgf5oqPh8Tl3tmIm0a8GlrAIu64yldXtJ346YofFnFrKHj/6qWzrrLjKt0+p+x1WLswRPb69X/g0o3Z3ROgbM6I1na1OroPnHPKhwECX35fmzq/Xa2OGtGymM0dCxCbRQZ55or3TukkxaNEmUoRVxLxuGzjsymeF2+xeSSQN2oVpyw5kTuRUgR6sTLjeiGA5JSOU5byRq1SwBHjeaNWeTcxcdopv4zyYiAccb+s5GBn9uKZvFGr5BHjwSl7TuSu+OQqXYuYHwSHEEJifbbXSlGt7AUjWkZZScST3qQHwSGEYCo3XKWbNHtqlBUjWn2/4SrfTPFmEFwOe9Up3zeAU0eXu5wcs4gFI9b6vu0v2Cn3jvcBaxaxsMvJsZBUlosA2k4sGvGy7HMrKR66Zg+MeF2Cq04suqJdtCLLITWzaSM2UhMzZbIRi5g3xVtXOXDi0ClbxvrtEMJICCGkJmYKJps+caWHtT8TkU/tSQNnTAAAAABJRU5ErkJggg=="
}, {
	label: "翻译此页",
	tooltiptext: 'http://translate.google.cn/translate?u=',
	oncommand: 'showFlagS.command(this.tooltipText, "url");',
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABs0lEQVQ4jY2SP4viQBiHX0UQWz/AXb+VX8Iu/YqFhdhcd5BKEOTKC9jJFYrFgo3FIjYiCRauhTCQDMp4bJFklzCuLJLOWNj8rpDMJt7u7Q08xQzze953/hAR0el4QJLw8KR4fXkE/Wtch01zjP6gmxLsd9uPJafjAf1BF82WjmZLR61eRa1eVfNmS4cMxP8JksGk6FPB6XjAii1Qq1fBBYMMBL79+InvDIrbB0CzIpSmQHF0RnF0vkiTFxZX7A+6MOzwU0FxdEZKYJpj1fp1eO5KzF0JzYreF/iekzr77QMUhh2q1zDsUIULPQl6fXkEFww53cWKLWCaY3DBVMuaFWHuSsT7fM/5W5DTXYUMBGQgUJoCpelFst9tcc84DDuE7znQrAiFnrwIkuGY/W6rBIYdQgYC7RmHZkXwPQf3jL8JiCglISLKVCaqzfhZfc9RcMFwc/eMfGd9EWQbS+R0F9nGEtnGEpnKBJnKJFWxPNygPNygPePggqE942nBdTjG9xyUhxvVcqEnsWILrNjiTfCRJN9ZI99Zp8LxWsy73ztTmYCI6ObuGV/7Tym+/PqtICL6A7F/dNYyWabFAAAAAElFTkSuQmCC"
}, {
	label: "存为PDF",
	tooltiptext: 'http://www.web2pdfconvert.com/engine?curl=',
	oncommand: 'showFlagS.command(this.tooltipText, "url");',
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACHElEQVQ4jZ3OT0iTcRzH8e9cWiAktVEiq5NkhCATgoShoqDoMAgMhpBChUUHC8IK8rCnSwSRBwkqMIIgUURMi6A89dfSVUxkZfhnU9NYc8up257f094dJAuyZH3gdXzDR+Tvq3I4HIMVFZXDlVVVw9XVzmGn8xez2Vz3j1Zy9ouMjtnt+OvqCLhcTBYWMtvTQzyhoyuFxWK5vm653Wq9euFiS/JB02nCNhuLJSVEa2oIZWYy134bXSmUYVB0wOITkb0/O6uIFIhIgc22q3dqZo6JKT9TY5+Y9wcIzswSfPWGleVllGGgDIOFUSulRfJOzGZpuNQoia7L6dxoO8/9/ofMB0N8nvvCt8Xo2uXYwNPVWBnoShF5YcXdKEk5Wi7B6ZvCx1smPvhuMD5xF//4PQK+LiLhr2uXV7r7UMogoSti8QSRfgvaEUHOOgUjUAuxa6C3roq1QuQK0Yk2ErpOIp4g2tnL0lsvS8srRBajhO5Y0GoFcTfvgfijdSl/I5GhcsKeYsJeBwseOwvjZYRGyphpT+dcpSBacx6EtdQFT9JSvwXRzuTA9OEUHYLJYrSmrYh2Kgt89o2N7oOR3fA+Czwm8AjaCUG045vh9c517IDBbfAyE56b4Zn8QTsmiNaQBgMZv9kET9LgsWxIqxfE7ZIkfcL/cLskKaX5Jq/ekcH3ztToHRmU5pu8IiK5ednSfdAuQ6nIy5ZuEcn9AUgSejPiQUKPAAAAAElFTkSuQmCC"
}, {
	label: "整页截图",
	oncommand: function() {
		var canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		canvas.width = content.document.documentElement.scrollWidth;
		canvas.height = content.document.documentElement.scrollHeight;
		var ctx = canvas.getContext("2d");
		ctx.drawWindow(content, 0, 0, canvas.width, canvas.height, "rgb(255,255,255)");
		saveImageURL(canvas.toDataURL(), content.document.title + ".png", null, null, null, null, document);
	},
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAm0lEQVQ4jbWTUQrDIBBEH9QcokjZe+T+ieQaJXiKfvSjIyyJRmzpwHzsuo47qwJMgIlBvIpPMGAFEnAXUyOOLYEEbG7D1oirAsEV3sQoltivdwWO6Ap4C7UWIwMzqBUY8BTtGwvDAmWIBjyAGcjirJypJhwt+HvfdWoGXmJWbgeW0tHPAoHzvQ9Z6KE7xL8LRD5+FxoPqYfL7/wGEBc4QhYRpZIAAAAASUVORK5CYII="
}];
/******************************************************************************************************************
 *这里是查询源设置，只支持"GET"方式获取，taobao为脚本内置,可以自行按照示例添加，不限定于IP，可以是其他相关的API，只要是你想要显示的都可以
 *******************************************************************************************************************/
var MyInfo = { //查询自己IP信息的接口，可以去掉或者改函数名字去掉功能
	inquireAPI: "http://whois.pconline.com.cn/", //查询接口API
	//regulation是截取函数,docum是一个XMLHttpRequest()的req.responseText，（具体可以百度	XMLHttpRequest()）。传回的obj为最终要显示的结果和样式等
	regulation: function(docum) {
		docum = docum.substring(docum.indexOf("位置"));
		docum = docum.substring(0, docum.indexOf("<h3>接口列表"));

		var addr = docum.substring(3, docum.indexOf("\n"));

		var ip = docum.substring(docum.indexOf("为:"));
		ip = ip.substring(2, ip.indexOf("\n"));

		var RemoteAddr = docum.substring(docum.indexOf("RemoteAddr"));
		RemoteAddr = RemoteAddr.substring(11, RemoteAddr.indexOf("<br/>"));

		var MyInfos = "我的IP：" + ip + '\n' + "我的地址：" + addr + '\n' + "RemoteAddr：" + RemoteAddr;
		return MyInfos;
	}
};

var SourceAPI = [{
	label: "纯真 查询源", //菜单中显示的文字
	id: "CZ", //必须设定一个ID，以便脚本读取
	inquireAPI: "http://www.cz88.net/ip/index.aspx?ip=",
	//返回“null”的时候便使用备用查询源（淘宝）；
	regulation: function(docum) {
		var s_local, myip, myAddr;
		var addr_pos = docum.indexOf("AddrMessage");
		s_local = docum.substring(addr_pos + 13);
		s_local = s_local.substring(0, s_local.indexOf("<"));
		s_local = s_local.replace(/ +CZ88.NET ?/g, "");
		if (s_local) {
			return s_local;
		} else return null;
	}
}, {
	label: "太平洋电脑",
	id: "pconline",
	inquireAPI: "http://whois.pconline.com.cn/ip.jsp?ip=",
	regulation: function(docum) {
		var docum = docum.replace(/\n/ig, "");
		if (docum) {
			return docum;
		} else return null;
	}
}, {
	label: "MyIP查询源",
	id: "myip",
	inquireAPI: "http://www.myip.cn/",
	regulation: function(docum) {
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
		if (myip_addr) {
			return myip_addr;
		} else return null;
	}
}, {
	label: "新浪 查询源",
	id: "sina",
	inquireAPI: "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=",
	regulation: function(docum) {
		var responseObj = JSON.parse(docum);
		if (responseObj.ret == 1) {
			if (responseObj.isp !== '' || responseObj.type !== '' || responseObj.desc !== '')
				var addr = responseObj.country + responseObj.province + responseObj.city + responseObj.district + '\n' + responseObj.isp + responseObj.type + responseObj.desc;
			else
				var addr = responseObj.country + responseObj.province + responseObj.city + responseObj.district;
			return addr;
		} else return null;
	}
}, {
	label: "波士顿大学",
	id: "CZedu",
	inquireAPI: "http://phyxt8.bu.edu/iptool/qqwry.php?ip=",
	regulation: function(docum) {
		var s_local = docum;
		s_local = s_local.replace(/ +CZ88.NET ?/g, "");
		if (s_local) {
			return s_local;
		} else return null;
	}
}, ]
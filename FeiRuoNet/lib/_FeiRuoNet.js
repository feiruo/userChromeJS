/******************************************************************************************/
var FeiRuoFunc = function() {

};
/******************************************************************************************
 *这里是自定义服务器信息显示，可以根据需要截取(只支持函数操作)。
 *******************************************************************************************/
var ServerInfo = [ //在图标提示显示的 服务器信息
	{
		All: false, //是否显示所有信息，此项目有在第一个objiect内设置才生效，切之后的自定义项目不生效。不推荐，会显示cookies等隐私信息；
		//当显示所有http头信息时的排除项目，ALL设置为true时生效，注意：需要放到ALL同一个Object内，只支持正则！ test()
		AllFilter: /set-cookie|date|connection|vary|proxy-connection/i,
		label: "服务器：",
		words: "Server"
	}, {
		label: "网站编码：", //项目名
		words: "Content-Type", //http头信息关键字
		//截取或替换的函数，返回的是null就是在没有结果的时候自动隐藏该项
		Func: function(word) {
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
	}
];
/******************************************************************************************
 *这里是自定义httpheader规则列表。
 *******************************************************************************************/
var HeadRules = { //Http Head Rules
	"/^https?://([a-zA-Z]+)\\.?myip.cn.*$/": {
		"X-Forwarded-For": "8.8.8.8",
	},
	"/^http://mmbiz.qpic.cn/mmbiz.*$/": {
		'Connection': 'close',
		'Accept-Charset': 'utf-8, iso-8859-1, utf-16, *;q=0.7',
		'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'User-Agent': 'Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; NX510J Build/LMY47V) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025489 Mobile Safari/533.1 V1_AND_SQ_6.2.3_336_YYB_D QQ/6.2.3.2700 NetType/WIFI WebP/0.3.0 Pixel/1080',
		'Accept-Language': 'zh-CN',
		'Accept-Encoding': 'gzip'
	}
};
/******************************************************************************************
 *这里是UA自动切换规则列表。
 *******************************************************************************************/
var UASites = { //UA自动规则列表
	"^https?://([a-zA-Z]+)\\.?kankan.com.*$": "Safari-Mac", //直接可以看kankan视频，无需高清组件
	"^https?://wap.*": "UCBrowser", //WAP用UC浏览器
	"^https?://([a-zA-Z]+)\\.?uc.cn.*$": "UCBrowser", //WAP用UC浏览器
	"^https?://([a-zA-Z]+).qq.com.*$": "Chrome-Win7",
	"^https?://(pcs\\.baidu\\.com|baidupcs\\.com).*$": "BaiduYunGuanJia",
	"^https?://([a-zA-Z]+)\\.115\\.com.*$": "115Browser",
	"^https?://([a-zA-Z]+)\\.myip\\.cn.*$": "Chrome-Win7",
	"^http://mmbiz.qpic.cn.*$": "QQWEIXIN"
};
/******************************************************************************************
 *RefererChange，来源伪造，一般破解反外链。
 *@FORGE：发送根站点referer
 *@BLOCK : 发送空referer
 *******************************************************************************************/
var RefererChange = { //RefererChange 来源伪造 
	// 'qpic.cn': 'http://user.qzone.qq.com',
	'wsj.com': 'https://www.google.com/', //免登陆或订阅看全文
	'img.liufen.com': 'http://www.liufen.com.cn/',
	't4.mangafiles.com': 'http://www.imanhua.com/',
	't5.mangafiles.com': 'http://www.imanhua.com/',
	'laibafile.cn': 'http://www.tianya.cn/',
	'douban.com': 'http://www.douban.com',
	'yyets.com': 'http://www.yyets.com/',
	'baidu-img.cn': 'http://www.baidu.com/',
	'sinaimg.cn': 'http://blog.sina.com.cn/',
	'space.wenxuecity.com': 'http://bbs.wenxuecity.com/',
	'www.autoimg.cn': 'http://club.autohome.com.cn/',
	'kkkmh.com': 'http://www.kkkmh.com/',
	'nonie.1ting.com': 'http://www.1ting.com/',
	'img.knb.im': 'http://www.kenengba.com/',
	'tianya.cn': 'http://bbs.tianya.cn/',
	'xici.net': 'http://www.xici.net/',
	'media.chinagate.com': 'http://www.wenxuecity.com/',
	'jdstatic.tankr.net': 'http://jandan.net/',
	'sankakustatic.com': 'http://chan.sankakucomplex.com/'
};
/******************************************************************************************************************
 *这里是自定义浏览器标识UserAgent设置
 *******************************************************************************************************************/
var UAList = [ //自定义UA列表
	{
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
		ua: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
		//appVersion项为字符串，脚本会直接以字符串为navigator.appVersion；
		appVersion: "5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
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
		appVersion: true,
		ua: "Mozilla/5.0 (Linux; U; Android 5.0; zh-CN; NX507J Build/LRX21M) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 UCBrowser/10.4.2.585 U3/0.8.0 Mobile Safari/534.30",
		image: "http://www.uc.cn/favicon.ico"
	}, {
		label: "QQWEIXIN",
		appVersion: true,
		ua: "Mozilla/5.0 (Linux; U; Android 5.1.1; zh-cn; NX510J Build/LMY47V) AppleWebKit/533.1 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.4 TBS/025489 Mobile Safari/533.1 V1_AND_SQ_6.2.3_336_YYB_D QQ/6.2.3.2700 NetType/WIFI WebP/0.3.0 Pixel/1080",
		image: "http://weixin.qq.com/zh_CN/htmledition/images/favicon1fbcbe.ico"
	}, {}, {
		label: "BaiduYunGuanJia", //伪装百度云管家，解决某些情况下百度盘出无法下载和无限加载的问题。
		ua: "netdisk;5.2.7;PC;PC-Windows;6.2.9200;WindowsBaiduYunGuanJia",
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
 *这里是查询源设置，taobao为脚本内置,可以自行按照示例添加。
 *不限定于IP，可以是其他相关的API，只要是你想要显示的都可以。
 *******************************************************************************************************************/
//自定义查询信息
var CustomInfos = [
	//本地IP查询
	{
		Enable: false, //是否启用
		DifPort: false, //是否针对当前网站的不同端口也发送请求
		Times: 0, //脚本当次运行期间请求次数，0为每次请求。
		timeout: '1000', //延迟，毫秒 默认1000
		method: 'GET', //请求的类型，默认 GET；例如：POST、GET、PUT及PROPFIND。大小写不敏感。
		Api: "http://whois.pconline.com.cn/", //查询接口API，此处可用变量参数 %HOST%、%IP%、%URL%等（仅用于GET）具体请参照；https://github.com/ywzhaiqi/userChromeJS/tree/master/addmenuPlus
		responseType: null, //请求返回类型
		bstrUser: null, //用户名
		bstrPassword: null, //密码
		SendString: null, //发送的内容，字符串，仅method为POST时有效
		onreadystatechange: null, //onreadystatechange
		overrideMimeType: null, //overrideMimeType
		getResponseHeader: ['Server', 'Content-Type'], //数组，回应头
		setRequestHeader: { // 请求头
			apikey: 'apikey0',
			apikey1: 'apikey1',
		},

		//截取函数,传入内容 docum 是XMLHttpRequest()的req.responseText，（具体可以百度	XMLHttpRequest()）。下同
		Func: function(docum) {
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
	},
	//天气查询
	{
		Enable: false,
		Times: 1,
		Api: "http://apis.baidu.com/apistore/weatherservice/cityname?cityname=东莞",
		setRequestHeader: {
			apikey: 'apikey',
		},
		Func: function(docum) {
			if (!docum) return;
			var doc;
			try {
				doc = JSON.parse(docum);
			} catch (ex) {
				return;
			}
			if (!doc || doc.errNum != 0 || doc.errMsg != "success") return;
			var data = doc.retData;
			//var world = "城市：" + data.city + "\n" + "城市拼音：" + data.pinyin + "\n" + "城市编码：" + data.citycode + "\n" + "日期：" + data.date + "\n" + "发布时间：" + data.time + "\n" + "邮编：" + data.postCode + "\n" + "经度：" + data.longitude + "\n" + "维度：" + data.latitude + "\n" + "海拔：" + data.altitude + "\n" + "天气情况：" + data.weather + "\n" + "气温：" + data.temp + "\n" + "最低气温：" + data.l_tmp + "\n" + "最高气温：" + data.h_tmp + "\n" + "风向：" + data.WD + "\n" + "风力：" + data.WS + "\n" + "日出时间：" + data.sunrise + "\n" + "日落时间：" + data.sunset;
			var world = data.city + "[" + data.postCode + "]\n" + data.weather + "\n" + data.temp + "℃(" + data.l_tmp + "℃~" + data.h_tmp + "℃)";
			return world || null;
		}
	},
	//网站SEO信息
	{
		Enable: false,
		method: 'GET',
		timeout: 2000, //延迟时间 单位毫秒
		Api: "http://seo.chinaz.com/?q=%HOST%",
		Func: function(docum) {
			if (docum) {
				if (docum.indexOf("正在请求数据请稍候"))
					return "正在请求数据;\n可加大本项延迟时间;\n也可能是chinaz无此站点数据。";
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
	}
];

var Interfaces = [ //网站IP信息查询源
	{
		label: "纯真 查询源", //菜单中显示的文字
		isFlag: false, //是否作为国旗图标的查询源,所有自定义项目中，只能有一个设为true，其余可删除该项或为false,当你没有设定的时候会使用脚本预设
		isJustFlag: false, //是否仅作为国旗图标的查询源,如果有此项，就不会创建此项的菜单，也不会作为信息查询源使用。该项为false的时候可删除或注释掉
		Api: "http://www.cz88.net/ip/index.aspx?ip=",
		Func: function(docum) {
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
				obj.IPAddrInfo = s_local || null; //※必须，此处为返回结果中你需要显示的信息;当前项仅为图标查询源的时候可以非必须。
				//以下两项非必须，在此项目不作为国旗图标查询源的时候可以不用
				obj.CountryCode = null; //此处为返回结果的国家CODE。
				obj.CountryName = null; //此处为返回结果的国家名称【中文，需要lib数据库支持】。

				return obj || null; //返回“null”的时候便使用备用查询源；
			} else return null; //如果没有传入值则返回空
		}
	}, {
		label: "太平洋电脑",
		Api: "http://whois.pconline.com.cn/ip.jsp?ip=",
		Func: function(docum) {
			if (docum) {
				var docum = docum.replace(/\n/ig, "");

				var obj = {};
				obj.IPAddrInfo = docum || null;
				obj.CountryCode = null;
				obj.CountryName = null;
				return obj || null;
			} else return null;
		}
	}, {
		label: "MyIP查询源",
		Api: "http://www.myip.cn/",
		Func: function(docum) {
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
				obj.IPAddrInfo = myip_addr || null;
				obj.CountryCode = null;
				obj.CountryName = null;
				return obj || null;
			} else return null;
		}
	}, {
		label: "新浪 查询源",
		Api: "http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=",
		Func: function(docum) {
			if (docum) {
				var doc = JSON.parse(docum);
				if (doc.ret == 1) {
					if (doc.isp !== '' || doc.type !== '' || doc.desc !== '')
						var addr = doc.country + doc.province + doc.city + doc.district + '\n' + doc.isp + doc.type + doc.desc;
					else
						var addr = doc.country + doc.province + doc.city + doc.district;

					var obj = {};
					obj.IPAddrInfo = addr || null;
					obj.CountryCode = null;
					obj.CountryName = doc.country || null;
					return obj || null;
				} else return null;
			} else return null;
		}
	}, {
		label: "波士顿大学",
		Api: "http://phyxt8.bu.edu/iptool/qqwry.php?ip=",
		Func: function(docum) {
			if (docum) {
				var s_local = docum;
				s_local = s_local.replace(/ +CZ88.NET ?/g, "");

				var obj = {};
				obj.IPAddrInfo = s_local || null;
				obj.CountryCode = null;
				obj.CountryName = null;
				return obj || null;
			} else return null;

		}
	}, {
		label: "淘宝 查询源",
		isFlag: true,
		Api: "http://ip.taobao.com/service/getIpInfo.php?ip=",
		Func: function(docum) {
			if (docum && JSON.parse(docum).code == 0) {
				var doc = JSON.parse(docum);
				var country_id = doc.data.country_id.toLocaleLowerCase();
				var addr = doc.data.country + doc.data.area;
				if (doc.data.region || doc.data.city || doc.data.county || doc.data.isp)
					addr = addr + '\n' + doc.data.region + doc.data.city + doc.data.county + doc.data.isp;

				var obj = {};
				obj.IPAddrInfo = addr || null;
				obj.CountryCode = country_id || null;
				obj.CountryName = doc.data.country || null;
				return obj || null;
			} else return null;
		}
	}
];
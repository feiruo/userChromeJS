/*
child:[  ]内为当前菜单的下一级菜单配置
text 为运行参数，如果无需参数，直接删除text属性
exec 为打开路径，可以是任意文件和文件夹，支持相对路径，相对于配置文件夹；
文件夹不支持直接“\\”开头的相对路径，需要用“Services.dirsvc.get("ProfD", Ci.nsILocalFile).path”开头
oncommand 可以用function(){}；
=======================
除了以上属性外，可以自定义添加其他属性，如果快捷键accesskey等
=======================
{}, 为分隔条 
=======================
自带命令形式（其中ip为网站IP地址，host为网站域名。)：
如：ip为42.121.31.127，host为：bbs.kafan
----------
要打开http://www.cz88.net/ip/index.aspx?ip=42.121.31.127 可以使用以下形式
tooltiptext: 'http://www.cz88.net/ip/index.aspx?ip=',
oncommand: 'showFlagS.open(this.tooltipText, "ip");'
---------------------
要打开http://whois.domaintools.com/bbs.kafan.cn 可以使用以下形式
tooltiptext: 'http://whois.domaintools.com/',
oncommand: 'showFlagS.open(this.tooltipText, "host");'
=======================
如果设置了id属性，会尝试获取此id并移动，如果在浏览器中没有找到此id，则创建此id
*/

var showFlagSitem = [{
	label: "IP",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEUlEQVQ4jZXTO0sDURAF4M9ojAQ0RDRRsRQEH5WgVSpFhAh2AUXFSjFg1CK+IIWNVX60xY5kzW5MPDAwO3PO3Jm5d8mijHP08RXWj1g5h58Rd3CDGqbDahHrjCvSwhWmcnJTkWuNElfQQzW+i2FVzEesGpxKXoHNaBGW0EQDD7jFXuQ6wc1gG+3wVyUzN3ERbZ9Frh3cDNbRRSFV4DRObGAhct3gZjCHDyxjESc4wE6KUw9OKa8AXOMw/BnJFRZS+WNcjhKTLOclxMMo4g0bfxUo4Nlg42ns41H+G/mFXbxiNhUr4R1b48TihHuDXZDMfjeJ+Adr+JT8A/XwV/5TAI4kMz8NdTMxZiTvvie5zlx8A5EhHDBDtuxxAAAAAElFTkSuQmCC",
	child: [{
	label: "纯真查询IP",
	tooltiptext: 'http://www.cz88.net/ip/index.aspx?ip=',
	oncommand: 'showFlagS.open(this.tooltipText, "ip");'
}, {
	label: "MyIP.cn查询IP",
	tooltiptext: 'http://www.myip.cn/',
	oncommand: 'showFlagS.open(this.tooltipText, "ip");'
}]},{
	label: "DNS",
	image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACE0lEQVQ4jZWTS0sbYRiFn01tu4/Qy2zMJj9FbSVN/RuiSLwsBIk7NxJkAk0FN8HIYKBduCiS4ZP8gCAaCAOCi1BHEGmaySjihTndJEOqtqUHvuU5cJ73O/C7XgAfgC/AGXDXe2fAVyADvOQPeg18SiaTwezsrBzHkTFG+/v7chxH2WxWqVSqC2wAbx+aXwG76XRaxhiFYaiHCsNQtVpNk5OTAr4BVt88BBQmJiZ0dHSkKIoemQfVbDb7IRu9yrxPJBLtarX6T3NftVpNlmV1gI8AlZmZGQVBIEnyfV+e5+n4+FidTkfn5+fyPE8nJye6urqK68zNzakHltPt7W1J0v39vQqFgmzbVqlUUj6fV7FY1NLSkmzblm3bMR/HcQT4ALfGmDhgfX1dxhg1Gg0tLi5qdXVVxhhdX19rZWVFzWZTkmSMEXD7ZEAul1O5XNbh4aFKpZKq1arCMNTy8rI8zxsMuAP4PlihWCyqXq/HwCqVihYWFrS2tqbNzc2Yw2CFnUGIFxcXury8jAPa7bZarZZ839fNzU0McX5+PoY4nkgkfvzvGZPJZHzGZ0B+bGxMBwcHfw2JokiNRkOZTEbA5/5HAhgGKqOjo9He3p6CIHgU1O125bqu0um0gF3gzcM9DAN5y7LaU1NT2trakuu6cl1X5XJZ09PTGhkZ+QnYve08qSFgHNjpEe7P+RSoAO+A54OGXzjAWh+7MNsJAAAAAElFTkSuQmCC",
	child: [{
	label: "Whois 查询",
	tooltiptext: 'http://whois.domaintools.com/',
	oncommand: 'showFlagS.open(this.tooltipText, "host");'
},{
	label: "DNS健康",
	tooltiptext: 'http://www.intodns.com/',
	oncommand: 'showFlagS.open(this.tooltipText, "host");'
}, {
	label: "DNS信息",
	tooltiptext: 'http://www.robtex.com/dns/',
	oncommand: 'showFlagS.open(this.tooltipText, "host");'
}, {
	label: "DNS域名",
	tooltiptext: 'http://dnsw.info/',
	oncommand: 'showFlagS.open(this.tooltipText, "host");'
}]},{
	label: "BuiltWith",
	tooltiptext: 'http://builtwith.com/',
	oncommand: 'showFlagS.open(this.tooltipText, "host");'
},  {
	label: "黑名单检查",
	tooltiptext: 'http://rbls.org/',
	oncommand: 'showFlagS.open(this.tooltipText, "host");'
},]
/*****************************/
//API配置
/*****************************/
var SayingTypes = {
	//示例
	'VeryCD': { //名称
		API: "http://www.verycd.com/statics/title.saying", //地址
		Word: null, //JSON返回 语句字段
		Source: null, //JSON返回 作者字段
		ReadFunc: function(req) { //如果不是JSON，其他请自行读取
			var Start = req.indexOf("(") + 1;
			var End = req.indexOf(")");
			var world = req.substring(Start, End);
			world = world.replace(/'/ig, "");
			world = world.split(",");
			world.forEach(function(t) {
				Saying.LibPush('VeryCD', t); //****放入本地数据库/
			})
			val = world[Math.floor(Math.random() * world.length)];
			return val; //返回查询处理后的单条结果
		},
		ShowFunc: function(val) {
			return val; //就是上面那个 用于显示
		}
	},
	'Hitokoto': {
		API: "http://api.hitokoto.us/rand",
		Word: 'hitokoto',
		Source: 'source'
	},
	'Acman': {
		API: "http://zyfree1.acman.cn/",
		Word: 'zhaiyan',
		Source: 'source'
	}
};
/*****************************/
//自定义摘录语句
/*****************************/
var SayingData = [{
	"Source": "自己", //显示
	"Saying": "人生，一人一生", //显示
	"随意": "备注", //备注	
	"date": "2015-02-07", //备注
	"CustFunc": function(url) { //自定义行为函数，url为当前页面url
		console.log(url);
	}
}, {
	"Source": "自己",
	"Saying": "请不要把爱好当做愿望",
	"随意": "备注",
	"date": "2015-02-07"
}];
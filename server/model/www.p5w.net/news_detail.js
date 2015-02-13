var genDetail=require("../general/news_detail.js");

/**
 * 全景网
 * @type {Object}
 */
function p5wDetail(dataStore){
	this.dataStore=dataStore;
}

p5wDetail.prototype=new genDetail();

var p5wDetail_Obj=new p5wDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".title"
			}],
			//作者
			author:[{
				d:".source",
				r:/作者：(\S+)/
			}],
			//日期
			datetime: [{
				d: ".source",
				r:/\d{4}\S\d{2}\S\d{2}\S \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d:".source ins"
			}],
			//文本内容
			content: [{
				d: ".zwleft .text"
			}],
			summary: []
		},
		clearRule:[{
			s:/<style.*?<\/style>/,
			t:""
		}]
	});

module.exports = p5wDetail_Obj;
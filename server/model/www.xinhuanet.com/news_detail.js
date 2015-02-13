var genDetail=require("../general/news_detail.js");
/**
 * 经济日报
 * @type {Object}
 */
function xinhuanetDetail(dataStore){
	this.dataStore=dataStore;
}

xinhuanetDetail.prototype=new genDetail();

var xinhuanetDetail_Obj=new xinhuanetDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#title"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".info",
				r:/\d{4}\S\d{2}\S\d{2}\S \d{2}:\d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: "#source",
				r:/来源：\s*(\S+)/
			}],
			//文本内容
			content: [{
				d: "#content"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = xinhuanetDetail_Obj;
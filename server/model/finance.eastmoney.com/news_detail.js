var genDetail=require("../general/news_detail.js");
/**
 * 东方财富网-财经
 * @type {Object}
 */

function eastmoney_financeDetail(dataStore){
	this.dataStore=dataStore;
}

eastmoney_financeDetail.prototype=new genDetail();

var eastmoney_financeDetail_Obj=new eastmoney_financeDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".newsContent h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".Info",
				r: /\d{4}\S\d{2}\S\d{2}\S \d{2}:\d{2}/
			}],
			//数据来源
			src: [],
			//文本内容
			content: [{
				d: "#ContentBody"
			}]
		},
		clearRule:[]
	});

module.exports = eastmoney_financeDetail_Obj;
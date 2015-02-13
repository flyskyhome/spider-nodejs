var genDetail=require("../general/news_detail.js");
/**
 * 环球外汇
 * @type {Object}
 */
function cnforexDetail(dataStore){
	this.dataStore=dataStore;
}

cnforexDetail.prototype=new genDetail();

var cnforexDetail_Obj=new cnforexDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".h1Title"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".spanShowTime",
				r:/\d{4}\S\d{2}\S\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [],
			//文本内容
			content: [{
				d: ".divContent"
			}],
			summary: [{
				d: ".divSummary"
			}]
		},
		clearRule:[]
	});

module.exports = cnforexDetail_Obj;
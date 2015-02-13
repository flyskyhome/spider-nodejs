var genDetail=require("../general/news_detail.js");
/**
 * 路透社中文网
 * @type {Object}
 */
function reuters_CNDetail(dataStore){
	this.dataStore=dataStore;
}

reuters_CNDetail.prototype=new genDetail();

var reuters_CNDetail_Obj=new reuters_CNDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".primaryContent h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".timestampHeader",
				r:/\d{4}[^\d]*?\d{2}[^\d]*?\d{2}[^\d]*?\d{2}:\d{2}/
			}],
			//数据来源
			src: [],
			//文本内容
			content: [{
				d: ".focusParagraph"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = reuters_CNDetail_Obj;
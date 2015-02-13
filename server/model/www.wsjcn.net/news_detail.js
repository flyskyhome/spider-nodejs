var genDetail=require("../general/news_detail.js");
/**
 * 华尔街日报中文网
 * @type {Object}
 */
function wsjcnDetail(dataStore){
	this.dataStore=dataStore;
}

wsjcnDetail.prototype=new genDetail();

var wsjcnDetail_Obj=new wsjcnDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#title h1"
			},{
				d:".article_title h2"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: "#title p",
				r:/\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}/
			}],
			//数据来源
			src: [],
			//文本内容
			content: [{
				d: "#zi p"
			},{
				d: ".article_con"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = wsjcnDetail_Obj;
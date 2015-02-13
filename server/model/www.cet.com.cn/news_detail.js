var genDetail=require("../general/news_detail.js");
/**
 * 中国经济新闻网
 * @type {Object}
 */
function cetDetail(dataStore){
	this.dataStore=dataStore;
}

cetDetail.prototype=new genDetail();

var cetDetail_Obj=new cetDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".threeContentLeft h2"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".threeContentLeft .time",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".threeContentLeft .time a"
			}],
			//文本内容
			content: [{
				d: ".article_content"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = cetDetail_Obj;
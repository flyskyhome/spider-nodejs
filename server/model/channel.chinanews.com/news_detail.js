var genDetail=require("../general/news_detail.js");
/**
 * 中国新闻网
 * @type {Object}
 */
function chinanewsDetail(dataStore){
	this.dataStore=dataStore;
}

chinanewsDetail.prototype=new genDetail();

var chinanewsDetail_Obj=new chinanewsDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#cont_1_1_2 h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".left-time .left-t",
				r:/\d{4}\S\d{2}\S\d{2}\S \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".left-time .left-t",
				r:/来源：(\S+)/
			}],
			//文本内容
			content: [{
				d: ".left_zw"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = chinanewsDetail_Obj;
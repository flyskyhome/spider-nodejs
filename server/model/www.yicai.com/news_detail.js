var genDetail=require("../general/news_detail.js");
/**
 * 第一财经
 * @type {Object}
 */
function yicaiDetail(dataStore){
	this.dataStore=dataStore;
}

yicaiDetail.prototype=new genDetail();

var yicaiDetail_Obj=new yicaiDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".articleTitle h1"
			}],
			//作者
			author:[{
				d: ".articleAuthor h2",
				di:1,
				r:"<span>(.*?)<\/span>"
			}],
			//日期
			datetime: [{
				d: ".articleAuthor",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".articleAuthor h2 .f14blue2"
			}],
			//文本内容
			content: [{
				d: ".articleContent"
			}],
			summary: [{
				d: ".articleSummary"
			}]
		},
		clearRule:[]
	});

module.exports = yicaiDetail_Obj;
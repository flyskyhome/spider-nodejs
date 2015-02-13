var genDetail=require("../general/news_detail.js");

/**
 * Fx168
 * @type {Object}
 */
function fx168_NewsDetail(dataStore){
	this.dataStore=dataStore;
}

fx168_NewsDetail.prototype=new genDetail();

var fx168_NewsDetail_Obj=new fx168_NewsDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".yjl_fx168_article_box h1"
			}],
			//作者
			author:[{
				d: ".bianji",
				r:/文 \/ (\S+)/
			}],
			//日期
			datetime: [{
				d: ".shijian",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".laiyuan a"
			}],
			//文本内容
			content: [{
				d: ".yjl_fx168_article_zhengwen"
			}],
			summary: [{
				d: "#zhaiyaoDiv"
			}]
		},
		clearRule:[]
	});

module.exports = fx168_NewsDetail_Obj;
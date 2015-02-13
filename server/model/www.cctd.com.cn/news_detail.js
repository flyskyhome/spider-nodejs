var genDetail=require("../general/news_detail.js");
/**
 * 中国煤炭市场网
 * @type {Object}
 */

function cctdDetail(dataStore){
	this.dataStore=dataStore;
}

cctdDetail.prototype=new genDetail();

var cctdDetail_Obj=new cctdDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".biaoti"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: '.xuxian td[width="100%"]',
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: '.xuxian td[width="22%"]',
				r:/来源:(\S+)/
			}],
			//文本内容
			content: [{
				d: "#fontzoom"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = cctdDetail_Obj;
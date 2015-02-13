var genDetail=require("../general/news_detail.js");

/**
 * 欧浦钢网
 * @type {Object}
 */

function opsteelDetail(dataStore){
	this.dataStore=dataStore;
}

opsteelDetail.prototype=new genDetail();

var opsteelDetail_Obj=new opsteelDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#article h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: "#article .ref-de-publish",
				r:/\d{4}-\d{2}-\d{2}/
			}],
			//数据来源
			src: [],
			//文本内容
			content: [{
				d: "#articlebody"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = opsteelDetail_Obj;
var genDetail=require("../general/news_detail.js");
/**
 * 中国家具网
 * @type {Object}
 */

function zgjjDetail(dataStore){
	this.dataStore=dataStore;
}

zgjjDetail.prototype=new genDetail();

var zgjjDetail_Obj=new zgjjDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "h1.title"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".left_box .info",
				r:/\d{4}-\d{2}-\d{2}/
			}],
			//数据来源
			src: [],
			//文本内容
			content: [{
				d: "#article"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = zgjjDetail_Obj;
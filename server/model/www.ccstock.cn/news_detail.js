var genDetail=require("../general/news_detail.js");

/**
 * 证券日报
 * @type {Object}
 */
function ccstockDetail(dataStore){
	this.dataStore=dataStore;
}

ccstockDetail.prototype=new genDetail();

var ccstockDetail_Obj=new ccstockDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".bt h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".bt .sub_bt span",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".bt .sub_bt span",
				r:/文章来源：(.*?)&nbsp;/
			}],
			//文本内容
			content: [{
				d: "#newscontent"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = ccstockDetail_Obj;
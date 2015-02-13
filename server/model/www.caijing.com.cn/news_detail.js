var genDetail=require("../general/news_detail.js");
/**
 * 财经网
 * @type {Object}
 */
function caijingDetail(dataStore){
	this.dataStore=dataStore;
}

caijingDetail.prototype=new genDetail();

var caijingDetail_Obj=new caijingDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#cont_title"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: "#pubtime_baidu"
			}],
			//数据来源
			src: [{
				d:"#source_baidu"
			}],
			//文本内容
			content: [{
				d: "#the_content"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = caijingDetail_Obj;
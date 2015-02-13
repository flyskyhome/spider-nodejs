var genDetail=require("../general/news_detail.js");

/**
 * 经济参考报
 * @type {Object}
 */

function jjckbDetail(dataStore){
	this.dataStore=dataStore;
}

jjckbDetail.prototype=new genDetail();

var jjckbDetail_Obj=new jjckbDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "td.black18"
			}],
			//作者
			author:[{
				d: ".black12",
				r:/作者：(.*?)来源：/
			}],
			//日期
			datetime: [{
				d: ".black12",
				r:/\d{4}-\d{2}-\d{2}/
			}],
			//数据来源
			src: [{
				d: ".black12",
				r:/来源：(\S+)/
			}],
			//文本内容
			content: [{
				d: "#newsdetail-content-text"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = jjckbDetail_Obj;
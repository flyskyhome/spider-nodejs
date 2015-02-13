var genDetail=require("../general/news_detail.js");

/**
 * 经济日报
 * @type {Object}
 */
function ceDetail(dataStore){
	this.dataStore=dataStore;
}

ceDetail.prototype=new genDetail();

var ceDetail_Obj=new ceDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#articleTitle"
			}],
			//作者
			author:[{
				d: "#articleAuthor"
			}],
			//日期
			datetime: [{
				d: "#articleTime"
			}],
			//数据来源
			src: [{
				d: "#articleSource",
				r:/来源：(\S+)/
			}],
			//文本内容
			content: [{
				d: "#articleText .TRS_Editor"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = ceDetail_Obj;
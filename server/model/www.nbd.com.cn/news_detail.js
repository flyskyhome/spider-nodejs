var genDetail=require("../general/news_detail.js");

/**
 * 每经网
 * @type {Object}
 */
function nbdDetail(dataStore){
	this.dataStore=dataStore;
}

nbdDetail.prototype=new genDetail();

var nbdDetail_Obj=new nbdDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".articleTitle"
			}],
			//作者
			author:[{
				d: ".articleInfo p",
				r:/\s(\S+)\s/
			}],
			//日期
			datetime: [{
				d: ".articleTime span"
			}],
			//数据来源
			src: [{
				d: ".articleInfo p",
				r: /来源: (.*?)$/
			}],
			//文本内容
			content: [{
				d: "#articleContent"
			}],
			summary: [{
				d: "#articleDigest"
			}]
		},
		clearRule:[]
	});


module.exports = nbdDetail_Obj;
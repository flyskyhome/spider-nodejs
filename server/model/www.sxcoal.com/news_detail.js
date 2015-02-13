var genDetail=require("../general/news_detail.js");
/**
 * 中国煤炭资源网
 * @type {Object}
 */

function sxcoalDetail(dataStore){
	this.dataStore=dataStore;
}

sxcoalDetail.prototype=new genDetail();

var sxcoalDetail_Obj=new sxcoalDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".Title h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".Title .time div",
				di:1,
				r:/\d{4}\S\d{2}\S\d{2}\S/
			}],
			//数据来源
			src: [{
				d: ".Title .time div",
				di:1,
				r: /来源：(\S+)/
			}],
			//文本内容
			content: [{
				d: ".content #cont"
			}],
			summary: [{
				d: "#memo"
			}]
		},
		clearRule:[]
	});

module.exports = sxcoalDetail_Obj;
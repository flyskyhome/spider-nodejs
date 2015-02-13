var genDetail=require("../general/news_detail.js");
/**
 * 东方早报
 * @type {Object}
 */
function dfdailyDetail(dataStore){
	this.dataStore=dataStore;
}

dfdailyDetail.prototype=new genDetail();

var dfdailyDetail_Obj=new dfdailyDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#newstitle"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".WEB1_MIDDLE_LEFT04 h2",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".WEB1_MIDDLE_LEFT04 h2",
				r:/>\s+(\S+)\s*&nbsp;/
			}],
			//文本内容
			content: [{
				d: "#newscontent"
			}],
			summary: [{
				d: ".WEB1_MIDDLE_LEFT05"
			}]
		},
		clearRule:[]
	});


module.exports = dfdailyDetail_Obj;
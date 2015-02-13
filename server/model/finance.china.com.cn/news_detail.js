var genDetail=require("../general/news_detail.js");
/**
 * 第一财经
 * @type {Object}
 */
function china_finance_Detail(dataStore){
	this.dataStore=dataStore;
}

china_finance_Detail.prototype=new genDetail();

var china_finance_Detail_Obj=new china_finance_Detail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".left_content h1"
			}],
			//作者
			author:[{
				d: "#author_baidu",
				r:/作者：(\S+)/
			}],
			//日期
			datetime: [{
				d: "#pubtime_baidu",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: "#source_baidu a"
			}],
			//文本内容
			content: [{
				d: "#content"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = china_finance_Detail_Obj;
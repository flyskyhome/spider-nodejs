var genDetail=require("../general/news_detail.js");
/**
 * 中国法院网
 * @type {Object}
 */
function chinacourt_Detail(dataStore){
	this.dataStore=dataStore;
}

chinacourt_Detail.prototype=new genDetail();

var chinacourt_Detail_Obj=new chinacourt_Detail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".detail_bigtitle"
			}],
			//作者
			author:[{
				d: ".detail_thr .writer",
				r:/作者：(\S+)/
			}],
			//日期
			datetime: [{
				d: ".detail_thr .time"
			}],
			//数据来源
			src: [{
				d: ".detail_thr .source",
				r:/来源：(\S+)/
			}],
			//文本内容
			content: [{
				d: ".detail_txt"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = chinacourt_Detail_Obj;
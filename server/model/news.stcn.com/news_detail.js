var genDetail=require("../general/news_detail.js");

/**
 * 证券时报
 * @type {Object}
 */
function stcnDetail(dataStore){
	this.dataStore=dataStore;
}

stcnDetail.prototype=new genDetail();

var stcnDetail_Obj=new stcnDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule: {
			//标题
			title: [{
				//dom规则
				d: ".main h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".main .txt_hd .info",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".main .txt_hd .info",
				r:/来源：(.*?)<\/span>/
			}],
			//文本内容
			content: [{
				d: "#ctrlfscont"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = stcnDetail_Obj;
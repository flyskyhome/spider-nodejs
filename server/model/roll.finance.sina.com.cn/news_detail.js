var genDetail=require("../general/news_detail.js");

/**
 * 第一财经
 * @type {Object}
 */
function sinaFinance_rollDetail(dataStore){
	this.dataStore=dataStore;
}

sinaFinance_rollDetail.prototype=new genDetail();

var sinaFinance_rollDetail_Obj=new sinaFinance_rollDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".blkContainerSblk #artibodyTitle"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: "#pub_date",
				r:/\d{4}\S\d{2}\S\d{2}\S&nbsp;\d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".blkContainerSblk .artInfo #media_name a"
			}],
			//文本内容
			content: [{
				d: "#artibody"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = sinaFinance_rollDetail_Obj;
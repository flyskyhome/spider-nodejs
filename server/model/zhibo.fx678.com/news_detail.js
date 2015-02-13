var genDetail=require("../general/news_detail.js");
/**
 * 第一财经
 * @type {Object}
 */
function fx678_zhiboDetail(dataStore){
	this.dataStore=dataStore;
}

fx678_zhiboDetail.prototype=new genDetail();

var fx678_zhiboDetail_Obj=new fx678_zhiboDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".new_inter_left_position_title"
			}],
			//作者
			author:[{
				d: ".new_inter_left_position_title_time span",
				di:2,
				r:/编辑：(\S+)/
			}],
			//日期
			datetime: [{
				d: ".new_inter_left_position_title_time span",
				di:1
			}],
			//数据来源
			src: [{
				d: ".new_inter_left_position_title_time span",
				di:2,
				r:/来源：(\S+)/
			}],
			//文本内容
			content: [{
				d: ".wenzhang_my_area"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = fx678_zhiboDetail_Obj;
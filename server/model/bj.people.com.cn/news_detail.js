var genDetail=require("../general/news_detail.js");

/**
 * 经济日报
 * @type {Object}
 */
function people_bjDetail(dataStore){
	this.dataStore=dataStore;
}

people_bjDetail.prototype=new genDetail();

var people_bjDetail_Obj=new people_bjDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#p_title"
			}],
			//作者
			author:[{
				d:"#p_content",
				r:/\(记者 (\S+)\s*?\)/
			}],
			//日期
			datetime: [{
				d: "#p_publishtime"
			}],
			//数据来源
			src: [{
				d: "#p_origin a"
			}],
			//文本内容
			content: [{
				d: "#p_content"
			}],
			summary: []
		},
		clearRule:[],
		wait:300000
	});

module.exports = people_bjDetail_Obj;
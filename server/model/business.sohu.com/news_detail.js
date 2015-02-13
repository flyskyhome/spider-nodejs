var genDetail=require("../general/news_detail.js");

/**
 * 搜狐财经
 * @type {Object}
 */

function sohuBusinessDetail(dataStore){
	this.dataStore=dataStore;
}

sohuBusinessDetail.prototype=new genDetail();

var sohuBusinessDetail_Obj=new sohuBusinessDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".content-box h1"
			}],
			//作者
			author:[{
				d: "#author_baidu",
				r: /作者：(\S+)/
			},
			{
				d: "#contentText",
				r: /作者：(.*?)</
			}],
			//日期
			datetime: [{
				d: ".time-source .time"
			},{
				d: ".tit .timt"
			}],
			//数据来源
			src: [{
				d: "#media_span span"
			},{
				d: ".tit .from a"
			}],
			//文本内容
			content: [{
				d: "#contentText"
			},{
				d: "#contentE .explain"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = sohuBusinessDetail_Obj;
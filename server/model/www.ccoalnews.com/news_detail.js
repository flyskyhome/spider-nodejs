var genDetail=require("../general/news_detail.js");

/**
 * 中国煤炭网
 * @type {Object}
 */

function ccoalnewsDetail(dataStore){
	this.dataStore=dataStore;
}

ccoalnewsDetail.prototype=new genDetail();

var ccoalnewsDetail_Obj=new ccoalnewsDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#article h1"
			}],
			//作者
			author:[{
				d: "#article td.zi2 span.zi2"
			}],
			//日期
			datetime: [{
				d: "#article td.zi2",
				r:/\d{4}\S\d{2}\S\d{2}/
			}],
			//数据来源
			src: [],
			//文本内容
			content: [{
				d: "#article td.zi4"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = ccoalnewsDetail_Obj;
var genDetail=require("../general/news_detail.js");
/**
 * 上海有色网
 * @type {Object}
 */
function smmDetail(dataStore){
	this.dataStore=dataStore;
}

smmDetail.prototype=new genDetail();

var smmDetail_Obj=new smmDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".news-title h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".note",
				r:/\d{4}-\d{2}-\d{2}/
			}],
			//数据来源
			src: [{
				d: ".note>a"
			}],
			//文本内容
			content: [{
				d: ".bd article"
			}],
			summary: [{
				d: ".news-profile"
			}]
		},
		clearRule:[]
	});

module.exports = smmDetail_Obj;
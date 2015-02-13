var genDetail=require("../general/news_detail.js");
/**
 * 中金在线-新闻
 * @type {Object}
 */
function cnfol_NewsDetail(dataStore){
	this.dataStore=dataStore;
}

cnfol_NewsDetail.prototype=new genDetail();

var cnfol_NewsDetail_Obj=new cnfol_NewsDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#Title"
			}],
			//作者
			author:[{
				d: "#author_baidu",
				r:/作者：(\S+)/
			}],
			//日期
			datetime: [{
				d: "#pubtime_baidu"
			}],
			//数据来源
			src: [{
				d: "#source_baidu a"
			}],
			//文本内容
			content: [{
				d: "#Content"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = cnfol_NewsDetail_Obj;
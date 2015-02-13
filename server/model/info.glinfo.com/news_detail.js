var genDetail=require("../general/news_detail.js");
/**
 * 钢联资讯
 * @type {Object}
 */
function glinfoDetail(dataStore){
	this.dataStore=dataStore;
}

glinfoDetail.prototype=new genDetail();

var glinfoDetail_Obj=new glinfoDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#articleContent h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: "#articleContent .info",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: "#articleContent .info a"
			}],
			//文本内容
			content: [{
				d: "#articleContent #text"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = glinfoDetail_Obj;
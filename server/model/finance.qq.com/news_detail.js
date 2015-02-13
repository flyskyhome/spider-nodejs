var genDetail=require("../general/news_detail.js");
/**
 * 腾讯财经
 * @type {Object}
 */
function qqFinanceDetail(dataStore){
	this.dataStore=dataStore;
}

qqFinanceDetail.prototype=new genDetail();

var qqFinanceDetail_Obj=new qqFinanceDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#C-Main-Article-QQ h1"
			}],
			//作者
			author:[{
				d: "#C-Main-Article-QQ .auth a"
			}],
			//日期
			datetime: [{
				d: "#C-Main-Article-QQ .article-time"
			}],
			//数据来源
			src: [{
				d: "#C-Main-Article-QQ .where"
			}],
			//文本内容
			content: [{
				d: "#Cnt-Main-Article-QQ"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = qqFinanceDetail_Obj;
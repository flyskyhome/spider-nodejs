var genDetail=require("../general/news_detail.js");
/**
 * 凤凰财经
 * @type {Object}
 */
function ifengFinanceDetail(dataStore){
	this.dataStore=dataStore;
}

ifengFinanceDetail.prototype=new genDetail();

var ifengFinanceDetail_Obj=new ifengFinanceDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#artical h1"
			}],
			//作者
			author:[{
				d: '#artical_sth .p_time .ss04 [itemprop="name"] span'
			}],
			//日期
			datetime: [{
				d: "#artical_sth .p_time .ss01"
			}],
			//数据来源
			src: [{
				d: "#artical_sth .p_time .ss03 a"
			}],
			//文本内容
			content: [{
				d: "#main_content"
			}],
			summary: []
		},
		clearRule:[]
	});


module.exports = ifengFinanceDetail_Obj;
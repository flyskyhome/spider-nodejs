var genDetail=require("../general/news_detail.js");
/**
 * 网易财经
 * @type {Object}
 */
function a163MoneyDetail(dataStore){
	this.dataStore=dataStore;
}

a163MoneyDetail.prototype=new genDetail();

var a163MoneyDetail_Obj=new a163MoneyDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".ep-main-bg h1"
			}],
			//作者
			author:[{
				d: ".ep-source .left",
				r:/作者：(\S+)/
			}],
			//日期
			datetime: [{
				d: ".ep-time-soure",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".ep-source .left",
				r: /本文来源：(\S+)/
			}],
			//文本内容
			content: [{
				d: "#endText"
			}],
			summary: []
		},
		clearRule:[{
			s:/<script.*?<\/script>/g,
			t:""
		}]
	});

module.exports = a163MoneyDetail_Obj;
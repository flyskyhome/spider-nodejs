var genDetail=require("../general/news_detail.js");

function a21cbh_moneyDetail(dataStore){
	this.dataStore=dataStore;
}

a21cbh_moneyDetail.prototype=new genDetail();

var a21cbh_moneyDetail_Obj=new a21cbh_moneyDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".the_title"
			}],
			//作者
			author:[{
				d: ".the_title2 #author"
			}],
			//日期
			datetime: [{
				d: ".the_title2",
				r:/\d{4}\S\d{2}\S\d{2} \d{2}:\d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".the_title2",
				r:/^(\S+)/
			}],
			//文本内容
			content: [{
				d: ".article_content"
			}]
		},
		clearRule:[],
		wait:30*60*1000
	});

module.exports = a21cbh_moneyDetail_Obj;
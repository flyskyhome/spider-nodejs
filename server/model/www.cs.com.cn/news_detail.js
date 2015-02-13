var genDetail=require("../general/news_detail.js");

function csDetail(dataStore){
	this.dataStore=dataStore;
}

csDetail.prototype=new genDetail();

var csDetail_Obj=new csDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".content h1"
			}],
			//作者
			author:[{
				d: ".content .column-top",
				//第几个dom
				di:2,
				r: "<em class=\"Atext\">作者：(.*?)</em>"
			}],
			//日期
			datetime: [{
				d: ".ctime",
				r: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".content .column-top",
				di:2,
				r: "来源：<em class=\"Atext\">(.*?)<\/em>"
			}],
			//文本内容
			content: [{
				d:".z_content"
			}]
		},
		clearRule:[{
			s:/<style type="text\/css">.*?<\/style>/g,
			t:""
		},{
			s:/<script.*?<\/script>/g,
			t:""
		}]
	});

module.exports = csDetail_Obj;
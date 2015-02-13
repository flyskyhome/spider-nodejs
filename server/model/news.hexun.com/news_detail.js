var genDetail=require("../general/news_detail.js");

function hexunDetail(dataStore){
	this.dataStore=dataStore;
}

hexunDetail.prototype=new genDetail();

var hexunDetail_Obj=new hexunDetail({
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
		clearRule:[{
			s:/（.*?）/g,
			t:""
		}]
	});

module.exports = hexunDetail_Obj;
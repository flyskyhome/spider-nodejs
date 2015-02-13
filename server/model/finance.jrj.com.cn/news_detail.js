var genDetail=require("../general/news_detail.js");
/**
 * 全景网
 * @type {Object}
 */
function jrjFinanceDetail(dataStore){
	this.dataStore=dataStore;
}

jrjFinanceDetail.prototype=new genDetail();

var jrjFinanceDetail_Obj=new jrjFinanceDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".text-col h1",
				r:/title_start-->(.*?)</
			}],
			//作者
			author:[{
				d:"#author_baidu",
				r:/-->(.*?)</
			}],
			//日期
			datetime: [{
				d: ".text-col #pubtime_baidu",
				r: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d:"#source_baidu a"
			},{
				d:"#source_baidu",
				r:/source_start-->(.*?)</
			}],
			//文本内容
			content: [{
				d: ".textmain"
			}],
			summary: []
		},
		clearRule:[{
			s:/<div class="textimg text-n1">.*?<\/div><\/div>/,
			t:""
		}]
	});

module.exports = jrjFinanceDetail_Obj;
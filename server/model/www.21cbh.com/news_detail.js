var genDetail=require("../general/news_detail.js");
/**
 * 21世纪网
 * @type {Object}
 */
function a21cbhDetail(dataStore){
	this.dataStore=dataStore;
}

a21cbhDetail.prototype=new genDetail();

var a21cbhDetail_Obj=new a21cbhDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".the_title"
			},{
				d: ".title a"
			},{
				d:".headline h1"
			}],
			//作者
			author:[{
				d: "#author a"
			}],
			//日期
			datetime: [{
				d: ".the_title2",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d: ".the_title2",
				r:/^(\S+)/
			}],
			//文本内容
			content: [{
				d: ".article_content"
			},{
				d:".main"
			},{
				d:".wenzhang_box"
			}],
			summary: [{
				d: ".articlSum"
			}]
		},
		clearRule:[]
	});

module.exports = a21cbhDetail_Obj;
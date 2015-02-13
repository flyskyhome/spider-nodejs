var genDetail=require("../general/news_detail.js");

function ifengAutoDetail(dataStore){
	this.dataStore=dataStore;
}

ifengAutoDetail.prototype=new genDetail();

/**
 * 凤凰网 -汽车
 * @type {Object}
 */
var ifengAutoDetail_Obj=new ifengAutoDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".arl-cont h3"
			}],
			//作者
			author:[{
				d: '#author_baidu',
				r: /作者：(\S+)/
			}],
			//日期
			datetime: [{
				d: "#pubtime_baidu"
			}],
			//数据来源
			src: [{
				d: "#source_baidu",
				r: /来源：(\S+)/
			}],
			//文本内容
			content: [{
				d: ".arl-c-txt"
			}],
			summary: []
		},
		clearRule:[],
		wait:300000
	});

//ifengAutoDetail=myUtil.extend(ifengAutoDetail, genDetail, false);
module.exports = ifengAutoDetail_Obj;
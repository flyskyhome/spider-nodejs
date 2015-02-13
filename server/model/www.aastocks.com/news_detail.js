var genDetail=require("../general/news_detail.js");

/**
 * 阿思达克
 * @type {Object}
 */
function aastocksDetail(dataStore){
	this.dataStore=dataStore;
}

aastocksDetail.prototype=new genDetail();

var aastocksDetail_Obj=new aastocksDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#lblSTitle"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: "#spanDateTime"
			}],
			//数据来源
			src: [],
			//文本内容
			content: [{
				d: "#spanContent"
			}],
			summary: []
		},
		clearRule:[{
			s:/\(大智慧阿思达克通讯社 .*?\)/,
			t:""
		}]
	});

module.exports = aastocksDetail_Obj;
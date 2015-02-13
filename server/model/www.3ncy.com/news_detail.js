var genDetail=require("../general/news_detail.js");

/**
 * 中国三农观察网
 * @type {Object}
 */
function a3ncy_Detail(dataStore){
	this.dataStore=dataStore;
}

a3ncy_Detail.prototype=new genDetail();

var a3ncy_Detail_Obj=new a3ncy_Detail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "h2"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".info",
				r:/\d{4}-\d{2}-\d{2}/
			}],
			//数据来源
			src: [{
				d: ".info",
				r:/来源:(\S+)/
			}],
			//文本内容
			content: [{
				d: 'table td[style="padding:0px 10px;"]'
			}],
			summary: []
		},
		clearRule:[{
			s:/<div id="fenxiang".*<\/div>/,
			t:""
		},{
			s:/<div class="dede_pages">.*?<\/div>/,
			t:""
		}]
	});


module.exports = a3ncy_Detail_Obj;
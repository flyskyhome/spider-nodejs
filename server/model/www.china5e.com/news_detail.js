var genDetail=require("../general/news_detail.js");

/**
 * 中国能源网
 * @type {Object}
 */
function china5eDetail(dataStore){
	this.dataStore=dataStore;
}

china5eDetail.prototype=new genDetail();

var china5eDetail_Obj=new china5eDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".showtitle h1"
			}],
			//作者
			author:[{
					d: ".showtitinfo",
					r: /作者：(.*?)(&nbsp;)*</
				}],
			//日期
			datetime: [{
				d: ".showtitinfo",
				r:/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/
			}],
			//数据来源
			src: [
				{
					d: ".showtitinfo",
					r: /-->(.*?)作者：/
				},
				{
					d: ".showtitinfo",
					r: /-->(.*?)</
				},
			],
			//文本内容
			content: [{
				d: ".showcontent div",
				di:1
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = china5eDetail_Obj;
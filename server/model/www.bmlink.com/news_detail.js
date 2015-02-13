var genDetail=require("../general/news_detail.js");

/**
 * 中国建材网
 * @type {Object}
 */
function bmlinkDetail(dataStore){
	this.dataStore=dataStore;
}

bmlinkDetail.prototype=new genDetail();

var bmlinkDetail_Obj=new bmlinkDetail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".newsinfo h1"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: ".detail li.fl span"
			}],
			//数据来源
			src: [{
				d: ".detail li.fl",
				r: / 来源：(\S+)(\s)*&nbsp;/
			}],
			//文本内容
			content: [{
				d: ".newsinfo_cont"
			}],
			summary: [{
				d: ".news_note .f14"
			}]
		},
		clearRule:[]
	});


module.exports = bmlinkDetail_Obj;
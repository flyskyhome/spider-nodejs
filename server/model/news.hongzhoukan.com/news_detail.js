var genDetail=require("../general/news_detail.js");

/**
 * 证券市场红周刊
 * @type {Object}
 */
function hongzhoukanDetail(dataStore){
	this.dataStore=dataStore;
}

hongzhoukanDetail.prototype=new genDetail();

var hongzhoukanDetail_Obj=new hongzhoukanDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".main_zuo_one dt i"
			}],
			//作者
			author:[{
				d: ".main_zuo_one dt em",
				r:/作者：(\S+)$/
			}],
			//日期
			datetime: [{
				d: ".main_zuo_one dt p",
				di:1
			}],
			//数据来源
			src: [{
				d: ".main_zuo_one dt h2",
				r:/来源：(\S+)$/
			},{
				d: ".main_zuo_one dt h2 a"
			}],
			//文本内容
			content: [{
				d: ".main_zuo_one dd"
			}],
			summary: []
		},
		clearRule:[{
			s:/<ul class="ymgt">.*?<\/ul>/g,
			t:""
		}]
	});


module.exports = hongzhoukanDetail_Obj;
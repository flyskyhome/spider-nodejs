var genDetail=require("../general/news_detail.js");
/**
 * 上海证券报
 * @type {Object}
 */
function cnstockDetail(dataStore){
	this.dataStore=dataStore;
}

cnstockDetail.prototype=new genDetail();

var cnstockDetail_Obj=new cnstockDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".main-content .title"
			}],
			//作者
			author:[{
				d: ".bullet .author"
			}],
			//日期
			datetime: [{
				d: ".bullet .timer"
			}],
			//数据来源
			src: [{
				d: ".bullet .source"
			}],
			//文本内容
			content: [{
				d: "#qmt_content_div"
			}]
		},
		clearRule:[]
	});

module.exports = cnstockDetail_Obj;
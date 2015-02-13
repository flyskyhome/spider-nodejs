var genDetail=require("../general/news_detail.js");

/**
 * 中国商务部
 * @type {Object}
 */
function mofcom_Detail(dataStore){
	this.dataStore=dataStore;
}

mofcom_Detail.prototype=new genDetail();

var mofcom_Detail_Obj=new mofcom_Detail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#artitle"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: "script",
				di:4,
				r:/var tm = "(.*?)";/
			}],
			//数据来源
			src: [{
				d: "script",
				di:4,
				r:/var source = "(.*?)";/
			}],
			//文本内容
			content: [{
				d: ".artCon"
			},{
				d:".content1"
			}],
			summary: []
		},
		clearRule:[{
			s:/<script>.*?<\/script>/,
			t:""
		}]
	});

module.exports = mofcom_Detail_Obj;
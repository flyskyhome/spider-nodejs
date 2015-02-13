var genDetail=require("../general/news_detail.js");

function xueqiuDetail(dataStore){
	this.dataStore=dataStore;
}

xueqiuDetail.prototype=new genDetail();

/**
 * 雪球 - 指标
 * @type {Object}
 */

var xueqiuDetail_Obj=new xueqiuDetail({
		sn: 0,
		//解析规则
		parseRule:{
			_id:[{
				//dom规则
				d: "strong.stockName",
				r:/.*?\(.*?:(\d+)\)/
			}],
			//标题
			name: [{
				//dom规则
				d: "strong.stockName",
				r:/(.*?)\(.*?:\d+\)/
			}],
			//市盈率(静态_动态)
			'市盈率LYR/TTM':[{
				d: '.topTable td span',
				di:12
			}],
			'每股净资产':[{
				d: '.topTable td span',
				di:15
			}],
			'市净率':[{
				d: '.topTable td span',
				di:16
			}],
			'每股股息':[{
				d: '.topTable td span',
				di:19
			}],
			'市销率':[{
				d: '.topTable td span',
				di:20
			}]
		},
		clearRule:[],
		wait:24*60*60*1000
	});

//xueqiuDetail=myUtil.extend(xueqiuDetail, genDetail, false);
module.exports = xueqiuDetail_Obj;
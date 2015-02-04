//财务指标采集基础类
var cwzb = require("./base/cwzb.js");
var myUtil = require("../../tools/myutil.js");

function dl_cashflow() {};

//大陆利润表
dl_cashflow.prototype = new cwzb({
	sn: 0,
	//列表页获取信息出错页的网址信息，包括，下载出错、未能下载到内容，下载到内容了但解析不到标题信息
	//信息:网址、原因
	//页面类型:列表页
	errList: [],
	//下载成功并正确解析到标题信息的列表页
	okCount: 0,
	//待采列表页总数
	urlCount: 0,
	//信息解析规则
	parseRuleList: [],
	//采集失败信息重采任务执行次数
	reGrapCount: 0,
	//存储重新执行Url信息
	reUrlList:[],
	//设置等待信息,以毫秒为单位
	wait:{
		//正常等待时间
		n:5,
		//重新执行后的等待时间
		r:50,
		//开始一次重新执行的等待时间
		rn:2000
	}
});
/**
 * 初始化
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 * @override
 */
dl_cashflow.prototype.init = function(cb) {
	cb(null, {
		dbObj: dl_cashflow_Obj.dataStore.dbObj,
		jsObj: dl_cashflow_Obj
	});
};
/**
 * 对外执行接口
 * @return {[type]}         [description]
 */
dl_cashflow.prototype.exec = function(callback) {
	this.callback=callback;
	this.initInfo("cashflow");
};

//dl_cashflow = myUtil.extend(dl_cashflow, cwzb, false);
var dl_cashflow_Obj = new dl_cashflow();

module.exports = dl_cashflow_Obj;
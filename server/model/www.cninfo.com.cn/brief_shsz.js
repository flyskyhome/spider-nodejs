var cheerio = require('cheerio');
//企业信息采集基础类
var corpBase=require("./base/corpBase.js");

var myUtil = require("../../tools/myutil.js");
var tbHelper = require("../../tools/tbhelper.js");
var dbobj = require("../../tools/db.js");
var t=require("../../tools/t.js");
var db = new dbobj("flyskyhome");
var log=t.log;

function brief_shsz(){};

brief_shsz.prototype=new corpBase({
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
		reGrapCount:0,
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
brief_shsz.prototype.init=function(cb) {
	cb(null, {
		dbObj: brief_shsz_Obj.dataStore.dbObj,
		jsObj: brief_shsz_Obj
	});
};
/**
 * 解析具体内容
 * @param  {[type]} sHtml [description]
 * @param  {[type]} task  [description]
 * @return {[type]}       [description]
 * @override
 */
brief_shsz.prototype.parse=function(sHtml, task) {
	if(sHtml){
		var $ = cheerio.load(sHtml),
			domList = $(".zx_left tr"),
			titleDomList = domList.find(".zx_data"),
			valDomList = domList.find(".zx_data2"),
			iCount = domList.length,
			dom,
			//名称
			sText = "",
			//值
			sVal = "",
			sColCode = "",
			sTbCode=task.table,
			colMapList=tbHelper.colMapInfo[sTbCode],
			recordObj = {
				_id: task.corpObj._id
			},
			objList = [];

		colMapList=colMapList||[];

		for (var i = 0; i < iCount; i++) {
			dom = $(titleDomList[i]);
			sText = dom.text().replace(/：|\s/g, "");
			if (myUtil.indexOfObj(colMapList, "name", sText) >= 0) {
				sColCode = myUtil.getObj(colMapList, "name", sText).code;
			}
			else {
				sColCode = tbHelper.getNewColCode(sTbCode);
				colMapList.push({
					code: sColCode,
					name: sText
				});
				tbHelper.colMapInfo[sTbCode]=colMapList;
			}
			dom = $(valDomList[i]);
			sVal = dom.text().replace(/\s/g, "");
			recordObj[sColCode] = sVal;
		}
		objList.push(recordObj);
		return objList;
	}
	else{
		return null;
	}
};
/**
 * 对外执行接口
 * @return {[type]}         [description]
 */
brief_shsz.prototype.exec=function(callback) {
	this.callback=callback;
	this.table = "dl_brief";
	this.charset="gbk";
	this.preUrl = "http://www.cninfo.com.cn/information/brief/";
	this.sufUrl = ".html";
	this.realExec(db);
};

var brief_shsz_Obj=new brief_shsz();

module.exports = brief_shsz_Obj;
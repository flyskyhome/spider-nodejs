var cheerio = require('cheerio');
//企业信息采集基础类
var corpBase = require("./corpBase.js");
var myUtil = require("../../../tools/myutil.js");
var tbHelper = require("../../../tools/tbhelper.js");
var dbobj = require("../../../tools/db.js");
var db = new dbobj("flyskyhome");
var t = require("../../../tools/t.js");
var log = t.log;

function cwzb(dataStore){
	this.dataStore=dataStore;
}

cwzb.prototype=new corpBase(cwzb.dataStore);
/**
 * 初始化
 * @param  {Function} cb [description]
 * @return {[type]}      [description]
 * @override
 */
cwzb.prototype.init=function(cb) {
	/*
	cb(null, {
		dbObj: dl_balancesheet.dataStore.dbObj,
		jsObj: dl_balancesheet
	});
	*/
};
/**
 * 获取网页信息
 * @param  {[type]} sKey      待过滤的关键字
 * @param  {[type]} sChartSet 网页字符集
 * @return {[type]}           [description]
 * @chainable
 */
cwzb.prototype.getInfo=function(obj, cb) {
	var operObj = obj.operObj.jsObj,
		objList = obj.oList,
		sUrl = "",
		sChartSet = operObj.charset,
		urlCount = objList.length,
		sPre = operObj.preUrl,
		sSuf = operObj.sufUrl,
		urlList = [],
		tmpObj,
		sTableName = operObj.tbName;
	operObj.dataStore.dbObj.setTable(operObj.table);
	operObj.dataStore.urlCount = urlCount;
	var now = new Date(),
		curYear = now.getFullYear(),
		sCurDate = "",
		sMethod = "get",
		isFirst = 0;
	//显示开始执行的时间
	sCurDate = myUtil.formatDate2String(now);

	//console.log(sCurDate);
	//执行循环组成待获取url列表
	for (var i = 0; i < urlCount; i++) {
		tmpObj = objList[i];
		isFirst = 0;
		for (var j = 0; j < operObj.yearCount; j++) {
			//年份
			sYear = (curYear - j);
			for (var k = 0; k < operObj.qList.length; k++) {
				//季度
				sQuart = operObj.qList[k];
				if (sCurDate < sYear + sQuart) {
					isFirst = 1;
					continue;
				}
				//克隆一个新对象
				var newObj = {
					date: sYear + sQuart
				};
				newObj = myUtil.extend(newObj, tmpObj);
				//每个对象的最新一期数据获取链接
				if (isFirst) {
					//http://www.cninfo.com.cn/information/balancesheet/szmb000001.html
					sUrl = sPre + sTableName + "/" + tmpObj.aid + tmpObj._id + sSuf;
					isFirst = 0;
					sMethod = "post";
				} else {
					//http://www.cninfo.com.cn/information/stock/balancesheet_.jsp?stockCode=000001&yyyy=2012&mm=-12-31
					sUrl = sPre + "stock/" + sTableName + "_.jsp?stockCode=" + tmpObj._id + "&yyyy=" + sYear + "&mm=" + sQuart;
					sMethod = "post";
				}
				urlList.push({
					url: sUrl,
					corpObj: newObj,
					charset: {
						method: sMethod,
						charset: sChartSet
					},
					table:operObj.table
				});
			}
		}
	}
	urlCount=urlList.length;
	operObj.dataStore.urlCount = urlCount;
	operObj.initCargo(obj, cb);
	for (var i = 0; i < urlCount; i++) {
		operObj.cargo.push(
			urlList[i],
			function(err) {
				log('finished processing :' + err.url);
			}
		);
	}
	urlList=[];
	objList=[];
	obj.oList=[];
	//所有待采的Url列表信息
	//operObj.dataStore.urlInfo=allUrlList;
};
/**
 * 解析具体内容
 * @param  {[type]} sHtml [description]
 * @param  {[type]} task  [description]
 * @return {[type]}       [description]
 * @override
 */
cwzb.prototype.parse=function(sHtml, task) {
	var $ = cheerio.load(sHtml),
		domList = $(".zx_left tr"),
		corpObj = task.corpObj,
		iCount = domList ? domList.length : 0,
		childList = [],
		dom,
		//名称
		sText = "",
		//值
		sVal = "",
		sColCode = ""
		//当前解析的表名,
		sTbCode=task.table,
		colMapList=tbHelper.colMapInfo[sTbCode],
		objList = [],
		recordObj = {
			_id: corpObj._id + "_" + corpObj.date,
			code: corpObj._id,
			date: corpObj.date
		};
	colMapList=colMapList||[];
	//console.log(corpObj._id + "_" + corpObj.date);
	//var colMapList = tbHelper.colMap;
	//抛弃第一行，标题行
	for (var i = 1; i < iCount; i++) {
		dom = $(domList[i]);
		childList = $(domList[i]).find("td");
		//一行2个指标，0、2为标题,1、3为值
		for (var j = 0; j < 2; j++) {
			sText = myUtil.trimAll($(childList[j * 2]).text());
			if (!sText) continue;
			sVal = myUtil.trimAll($(childList[j * 2 + 1]).text()).replace(/,/g,"");
			if (myUtil.indexOfObj(colMapList, "name", sText) >= 0) {
				sColCode = myUtil.getObj(colMapList, "name", sText).code;
			} else {
				sColCode = tbHelper.getNewColCode(sTbCode);
				colMapList.push({
					code: sColCode,
					name: sText
				});
				tbHelper.colMapInfo[sTbCode]=colMapList;
			}
			recordObj[sColCode] = sVal;
		}
	}

	objList.push(recordObj);
	$=null;
	domList=[];
	childList=[];
	dom=null;
	sHtml="";
	return objList;
};
/**
 * [initInfo description]
 * @type {[type]}
 */
cwzb.prototype.initInfo=function(tablename) {
	this.table = "dl_" + tablename;
	this.tbName = tablename;
	this.charset = "gbk";
	this.preUrl = "http://www.cninfo.com.cn/information/";
	this.sufUrl = ".html";
	this.yearCount = 5;
	this.qList = ["-12-31", "-09-30", "-06-30", "-03-31"];
	this.realExec(db);
};
/**
 * 对外执行接口
 * @return {[type]}         [description]
 */
cwzb.prototype.exec=function() {
	this.initInfo("balancesheet");
};

//cwzbObj = myUtil.extend(cwzbObj, corpBase, false);

module.exports = cwzb;
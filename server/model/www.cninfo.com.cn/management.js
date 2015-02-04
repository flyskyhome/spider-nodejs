var cheerio = require('cheerio');
//企业信息采集基础类
var corpBase=require("./base/corpBase.js");

var myUtil = require("../../tools/myutil.js");
var tbHelper = require("../../tools/tbhelper.js");
var dbobj = require("../../tools/db.js");
var db = new dbobj("flyskyhome");
var t=require("../../tools/t.js");
var log=t.log;

function management(){};

management.prototype=new corpBase({
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
management.prototype.init=function(cb) {
	cb(null, {
		dbObj: management_Obj.dataStore.dbObj,
		jsObj: management_Obj
	});
};
/**
 * 解析具体内容
 * @param  {[type]} sHtml [description]
 * @param  {[type]} task  [description]
 * @return {[type]}       [description]
 * @override
 */
management.prototype.parse=function(sHtml, task) {
	if(sHtml){
		var $ = cheerio.load(sHtml),
			domList = $(".zx_left tr"),
			iCount = domList.length,
			iColCount=0,
			dom,
			tdList,
			//名称
			sText = "",
			//当前解析的表名,
			sTbCode=task.table,
			colMapList=tbHelper.colMapInfo[sTbCode],
			objList = [];

		colMapList=colMapList||[];

		dom=$(domList[0]);
		tdList=dom.find("td");
		iColCount=tdList.length;
		//通过第一行获取列信息
		for(var i=0;i<iColCount;i++){
			sText=myUtil.trim($(tdList[i]).text());
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
		}
		//跳过第一行(标题行)
		for (var i = 1; i < iCount; i++) {
			dom = $(domList[i]);
			tdList=dom.find("td");
			var obj={code:task.corpObj._id};
			for(var j=0;j<iColCount;j++){
				obj[colMapList[j].code]=myUtil.trim($(tdList[j]).text());
			}
			//把所有信息连接起来作为该记录的key
			//obj._id="";
			//log(obj);
			var sId="";
			for(var key in obj){
				sId+=obj[key]+"_";
			}
			//log(sId);
			obj._id=sId.substr(0,sId.length-1).replace(/,/g,'');
			//log(obj._id);
			//
			objList.push(obj);
		}

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
management.prototype.exec=function(callback) {
	this.callback=callback;
	this.table = "dl_management";
	this.charset="gbk";
	this.preUrl = "http://www.cninfo.com.cn/information/management/";
	this.sufUrl = ".html";
	this.realExec(db);
};

//management = myUtil.extend(management, corpBase, false);
var management_Obj=new management();

module.exports = management_Obj;
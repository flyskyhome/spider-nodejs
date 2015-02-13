var fs=require("fs");
var genList = require("../general/news_list.js");
var dbobj = require("../../tools/db.js");
var db = new dbobj("flyskyhome");
//上海主板企业信息
var sh_mb=require("../../data/corpMap/sh_mb.js");
//深圳创业板企业信息
var sz_cn=require("../../data/corpMap/sz_cn.js");
//深圳主板企业信息
var sz_mb=require("../../data/corpMap/sz_mb.js");
//深圳中小板企业信息
var sz_sme=require("../../data/corpMap/sz_sme.js");
var t=require("../../tools/t.js");
var log=t.log;

function xueqiu_List(dataStore) {
	this.dataStore = dataStore;
}

xueqiu_List.prototype = new genList(xueqiu_List.dataStore);

/**
 * 雪球 - 指数
 * @type {Object}
 */
xueqiu_List.prototype.exec = function(urlList, sKey, urlCount) {
	this.init(0, [], "idxInfo");
	this.getInfo(sKey, "utf-8",100);
};
/**
 * 获取信息
 * @param  {[type]} sKey      过滤词汇
 * @param  {[type]} sChartSet 字符集
 * @param  {[type]} detail_waitTime  详细页信息采集时每个页面间隔等待时间
 * @return {[type]}           [description]
 */
xueqiu_List.prototype.getInfo=function(sKey, sChartSet,detail_waitTime){
	//循环企业信息
	var that=this,
		corpObj,
		sHost="xueqiu.com"
		PreUrl = "http://xueqiu.com/S/",
		sufUrl = "",
		sUrl="",
		detailMod=null;

	if(!this.dataStore.modInfo){
		this.dataStore.modInfo={};
	};
	if(this.dataStore.modInfo[sHost]){
		detailMod = this.dataStore.modInfo[sHost]
	}
	else{
		var sModelPath = "../" + sHost + "/news_detail.js";
		fs.exists(__dirname + "/"+sModelPath, function(isExist) {
			if (isExist) {
				//如果还无详细页的模块定义
				if(!detailMod){
					detailMod = require(sModelPath);
					that.dataStore.modInfo[sHost]=detailMod;
				}
				else{
				}

				var infoList=[];
				//直接调用详细页模块，获取详细页信息
				//上海主板
				toDetail(sh_mb,"SH");
				//深圳创业板
				toDetail(sz_cn,"SZ");
				//深圳主板
				toDetail(sz_mb,"SZ");
				//深圳中小板企业
				toDetail(sz_sme,"SZ");
				that.isExisted(infoList,detailMod,{url:PreUrl},sChartSet,detail_waitTime);

				function toDetail(objList,sSign){
					var iCount=objList.length;
					for(var i=0;i<iCount;i++){
						corpObj=objList[i];
						sUrl=PreUrl+sSign+corpObj.id;
						infoList.push({
							_id:corpObj.name,
							url:sUrl
						});
					}
				}
			} else {
				log("目录不存在:"+sModelPath);
			};
		});
	}
}

var xueqiu_List_Obj = new xueqiu_List({});

module.exports = xueqiu_List_Obj;
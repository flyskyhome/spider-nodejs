var genList = require("../general/news_list.js");
var genDataDeal=require("../gendatadeal.js");
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

function xueqiu_List(dataStore) {
	this.dataStore = dataStore;
}

xueqiu_List.prototype = new genList(xueqiu_List.dataStore);

/**
 * 雪球 - 指数
 * @type {Object}
 */
xueqiu_List.prototype.exec = function(urlList, sKey, urlCount) {
	console.log(sKey);
	console.log(urlList);
	this.init(urlCount, urlList, "info");
	this.getInfo(sKey, "utf-8");

	this.getInfo4stocklist();
};

xueqiu_List.prototype.getInfo=function(){
	//循环企业信息
	var corpObj,
		PreUrl = "http://xueqiu.com/S/",
		sufUrl = "",
		sUrl="",
		detailMod=null;

	if(!this.dataStore.modInfo){
		this.dataStore.modInfo={};
	};
	if(that.dataStore.modInfo[tmpUrlObj.host]){
		detailMod = that.dataStore.modInfo[tmpUrlObj.host]
		that.isExisted(infoList,detailMod,configObj,sChartSet);
	}
	else{
		var sModelPath = "../" + tmpUrlObj.host + "/news_detail.js";
		fs.exists(__dirname + "/"+sModelPath, function(isExist) {
			if (isExist) {
				//如果还无详细页的模块定义
				if(!detailMod){
					detailMod = require(sModelPath);
					that.dataStore.modInfo[tmpUrlObj.host]=detailMod;
				}
				else{
				}
				that.isExisted(infoList,detailMod,configObj,sChartSet);
			} else {
				that.isComplete(configObj.url);
			};
		});
	}
	var sh_mbCount=sh_mb.length;
	//上海主板
	for(var i=0;i<iCount;i++){
		corpObj=sh_mb[i];
		sUrl=PreUrl+"SH"+corpObj.id;
		detailMod.exec(infoObj.url, configObj,sChartSet,that.table,infoObj._id);
	}
	//直接调用详细页模块，获取详细页信息
}

xueqiu_List.prototype.getInfo4stocklist=function(){
	async.waterfall([this.init,genDataDeal.getColMap, this.getInfo, genDataDeal.saveColMap], function(err, results) {
		log('err: ', err);
		log('results: ', results);
		log(that.dataStore.errList);
		that.callback(null,{
			err:err,
			res:results
		});
	});
}

var xueqiu_List_Obj = new xueqiu_List({
	sn: 0,
	//列表页获取信息出错页的网址信息，包括，下载出错、未能下载到内容，下载到内容了但解析不到标题信息
	//信息:网址、原因
	//页面类型:列表页
	list_errList: [],
	//下载成功并正确解析到标题信息的列表页
	list_okList: [],
	//待采列表页总数
	urlCount: 0,
	//待解析内容格式 默认格式html,text:文本,json
	parseType: "html",
	//解析规则,如果是html则用 cheerio，如果是text 则用 正则
	parseRuleList: [{
		main: ".v2c-lst-li .tit"
	}]
});

module.exports = xueqiu_List_Obj;
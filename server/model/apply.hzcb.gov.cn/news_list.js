var url = require('url');
var cheerio = require('cheerio');
var page = require("../../tools/page.js");
var dbobj = require("../../tools/db.js");
var genList = require("../general/news_list.js");
var t = require("../../tools/t.js");
var db = new dbobj("flyskyhome");
var log = t.log;
//var wait=t.wait;

function hzcbList(dataStore) {
	this.dataStore = dataStore;
}

hzcbList.prototype = new genList(hzcbList.dataStore);

/**
 * 获取添加分页链接后的网址列表
 * @param  {[type]} urlList [description]
 * @return {[type]}         [description]
 */
hzcbList.prototype.getPageUrlList = function(urlList, sCharSet) {
	var iCount = urlList.length,
		urlObj;
	for (var i = 0; i < iCount; i++) {
		urlObj = urlList[i];
		for (j = 1; j < 388; j++) {
			var newObj = {};
			//复制原有url对象属性
			for (var key in urlObj) {
				newObj[key] = urlObj[key];
			}
			//修改链接地址
			newObj.url = urlObj.url + "?issueNumber=201501&pageNo=" + j;
			urlList.push(newObj)
		}
	}
	return urlList;
};

hzcbList.prototype.parse = function(sHtml, sKey, urlObj) {
	if (sHtml) {
		//解析规则列表
		var ruleList = this.dataStore.parseRuleList,
			iCount = ruleList.length,
			//规则对象
			ruleObj = {},
			$ = cheerio.load(sHtml),
			//通过规则获取到的dom列表
			domList,
			domCount = 0,
			dom,
			//名称
			sCode = "",
			sName = "",
			//待返回的结果对象
			objList = [],
			tdList = [];
		//解析多套规则
		for (var j = 0; j < iCount; j++) {
			ruleObj = ruleList[j];
			//如果规则存在则
			if (ruleObj.main) {
				//console.log("ruleObj.main--:"+ruleObj.main);
				domList = $(ruleObj.main);
				domCount = domList.length;
				//console.log("parse--:"+domCount);
				for (var i = 0; i < domCount; i++) {
					dom = $(domList[i]);
					tdList = dom.find("td");
					sCode = $(tdList[0]).text();
					sName = $(tdList[1]).text();
					if (sCode) {
						objList.push({
							_id: sCode,
							name: sName
						});
					}
				}
			}
		}
		sHtml = "";
		ruleList = [];
		ruleObj = null;
		$ = null;
		domList = null;
		return objList;
	} else {
		return [];
	}
}

hzcbList.prototype.getInfo = function(sKey, sCharSet) {
	var that = this,
		urlCount = this.urlList.length,
		detailMod = null;
	if (!that.dataStore.modInfo) {
		that.dataStore.modInfo = {};
	}
	for (var j = 0; j < urlCount; j++) {
		var srcUrlObj = this.urlList[j];
		try {
			//log("----aaa---"+srcUrlObj.url);
			var urlObj = url.parse(srcUrlObj.url);

			//wait(50);
			//这里的configObj 就是传进去的srcUrlObj
			page.download(urlObj, sCharSet, function(sHtml, configObj) {
				that.dataStore.sn = (that.dataStore.sn - 0 + 1);
				//如果sHtml不为null
				if (sHtml) {
					//详细页链接信息
					var infoList = that.parse(sHtml, sKey, urlObj),
						iCount = infoList.length;
					//console.log(iCount);
					for (var i = 0; i < iCount; i++) {
						var tmpInfo = infoList[i];
						//console.log(tmpInfo);
						db.add(tmpInfo);
					}
					that.dataStore.list_okList.push({
						type: "list",
						url: configObj.srcUrl
					});
					that.isComplete();
				} else {
					//下载出错了
					//把错误页信息存入数据库
					that.dataStore.list_errList.push({
						type: "list",
						url: configObj.errUrl,
						reseaon: configObj.errInfo
					});
					that.isComplete();
				}

			}, srcUrlObj);
		} catch (e) {
			console.log("网址解析异常:" + srcUrlObj.url);
			that.dataStore.list_errList.push({
				type: "list",
				url: srcUrlObj.url,
				reseaon: "网址异常"
			});
			that.isComplete();
		}
	}
	return this;
};

hzcbList.prototype.isComplete = function() {
	var result = 0,
		okCount = this.dataStore.list_okList.length,
		errCount = this.dataStore.list_errList.length,
		sumCount = this.dataStore.urlCount,
		iCount = sumCount - (okCount + errCount);

	if (!iCount) {
		result = 1;
		console.log("列表页采集全部完成");
		console.log("出错个数err:" + errCount);
		console.log(this.dataStore.list_errList);
		var errUrlList = this.dataStore.list_errList;
		//继续执行
		//this.init(errUrlList.length,errUrlList, "hzcb",0);
		//this.getInfo(this.dataStore.keyInfo, "utf-8");
	} else {
		console.log("列表页采集还差:" + iCount);
	}
	return result;
};

hzcbList.prototype.exec = function(urlList, sKey, urlCount) {
	console.log(sKey);
	console.log(urlList);
	this.init(urlCount, urlList, "hzcb", 1);
	db.init("hzcb" + "_list");
	this.getInfo(sKey, "utf-8");
};

var hzcbList_Obj = new hzcbList({
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
		main: ".ge2_content .content_data"
	}]
});

module.exports = hzcbList_Obj;
var url = require('url');
var cheerio = require('cheerio');
var fs = require('fs');
var page = require("../../tools/page.js");
var myUtil = require("../../tools/myutil.js");
//var subtask = require("../../service/taskService.js");
var grapService = require("../../service/grapService.js");
var okInfo = require("../../data/okInfo.js");
var t = require("../../tools/t.js");
var log = t.log;

function genList(dataStore) {
	this.dataStore = dataStore;
	/*
	{
		sn:0,
		//列表页获取信息出错页的网址信息，包括，下载出错、未能下载到内容，下载到内容了但解析不到标题信息
		//信息:网址、原因
		//页面类型:列表页
		list_errList:[],
		//下载成功并正确解析到标题信息的列表页
		list_okList:[],
		//待采列表页总数
		urlCount:0,
		//待解析内容格式 默认格式html,text:文本,json
		parseType:"html",
		//解析规则,如果是html则用 cheerio，如果是text 则用 正则
		parseRuleList:[]
	}
	*/
}

genList.prototype = {
	/**
	 * 初始化
	 * @param  {[type]} urlCount    所有要采集的列表页数量
	 * @param  {[type]} urlList     当前host需要采集的列表页信息
	 * @param  {[type]} sTablePre  	表名前缀
	 * @param  {[type]} addPageInfo 是否补充分页信息
	 * @param  {[type]} sCharSet 	字符集
	 * @return {[type]}             [description]
	 */
	init: function(urlCount, urlList, tablePre, addPageInfo, sCharSet) {
		this.dataStore.urlCount = urlCount;
		//this.dataStore.list_errList=[];
		//this.dataStore.list_okList=[];
		this.dataStore.sn = 0;
		//如果需要添加分页信息
		if (addPageInfo) {
			this.urlList = this.getPageUrlList(urlList, sCharSet);
			this.dataStore.urlCount = this.urlList.length;
		} else {
			this.urlList = urlList;
		}
		this.table = tablePre;

		//db.init(tablePre+"_list");
		return this;
	},
	/**
	 * 获取添加分页链接后的网址列表
	 * @param  {[type]} urlList [description]
	 * @param  {[type]} sCharSet 网页字符集
	 * @return {[type]}         [description]
	 * @override
	 */
	getPageUrlList: function(urlList, sCharSet) {},
	/**
	 * 获取网页信息
	 * @param  {[type]} sKey      待过滤的关键字
	 * @param  {[type]} sChartSet 网页字符集
	 * @return {[type]}           [description]
	 * @chainable
	 */
	getInfo: function(sKey, sChartSet) {
		var that = this,
			urlCount = this.urlList.length,
			iListWaitTime = this.dataStore.list_waitTime || 700;
		if (!that.dataStore.modInfo) {
			that.dataStore.modInfo = {};
		}
		for (var j = 0; j < urlCount; j++) {
			var srcUrlObj = this.urlList[j];
			try {
				//log(srcUrlObj.url);
				var urlObj = url.parse(srcUrlObj.url);
				setTimeout(this.toDownload, j * iListWaitTime, that, sKey, urlObj, sChartSet, srcUrlObj);
			} catch (e) {
				log("网址解析异常:" + srcUrlObj.url);
				//this.dataStore.list_errList.push({
					//type: "list",
					//url: srcUrlObj.url,
					//reseaon: "网址异常"
				//});
				that.isComplete(srcUrlObj.url);
			}
		}
		return this;
	},
	toDownload: function(that, sKey, urlObj, sChartSet, srcUrlObj) {
		var detailMod = null;
		page.download(urlObj, sChartSet, function(sHtml, configObj) {
			that.dataStore.sn = (that.dataStore.sn - 0 + 1);
			//如果sHtml不为null
			if (sHtml) {
				//详细页链接信息
				var infoList = that.parse(sHtml, sKey, url.parse(configObj.url)),
					iCount = infoList.length;
				if (iCount) {
					/*
					that.dataStore.list_okList.push({
						type:"list",
						url:configObj.url,
						count:iCount
					});
					*/
					//根据链接 动态引用模块
					var tmpUrlObj = url.parse(configObj.url);
					//如果详细页模块已经缓存，则直接获取
					if (that.dataStore.modInfo[tmpUrlObj.host]) {
						detailMod = that.dataStore.modInfo[tmpUrlObj.host]
							//log("-----cccccccc-----"+tmpUrlObj.host);
						that.isExisted(infoList, detailMod, configObj, sChartSet);
					} else {
						var sModelPath = "../" + tmpUrlObj.host + "/news_detail.js";
						fs.exists(__dirname + "/" + sModelPath, function(isExist) {
							if (isExist) {
								
								//如果还无详细页的模块定义
								if (!detailMod) {
									detailMod = require(sModelPath);
									that.dataStore.modInfo[tmpUrlObj.host] = detailMod;
									//var detailMod_Obj=new detailMod();
									//log("-----aaaa-----"+tmpUrlObj.host);
								} else {
									//log("-----bbbbb-----"+tmpUrlObj.host);
								}

								that.isExisted(infoList, detailMod, configObj, sChartSet);
								
								//that.isExisted(infoList,detailMod_Obj,configObj,sChartSet);
							} else {
								//log(__dirname + sModelPath + " 文件不存在!");
								//that.dataStore.list_errList.push({
								//type:"list",
								//url:configObj.url,
								//reseaon:"未找到详细页解析模块:"+sModelPath
								//});
								that.isComplete(configObj.url);
							};
						});
					}
				} else {
					//log("List: 未能找到标题信息!");
					//that.dataStore.list_errList.push({
					//type:"list",
					//url:configObj.url,
					//reseaon:"未找到标题"
					//});
					that.isComplete(configObj.url);
				}
			} else {
				//下载出错了
				//把错误页信息存入数据库
				//that.dataStore.list_errList.push({
				//type:"list",
				//url:configObj.errUrl,
				//reseaon:configObj.errInfo
				//});
				that.isComplete(configObj.url);
			}
		}, srcUrlObj);
	},
	/**
	 * 对内容进行解析,需要重写
	 * @param  {[type]} sHtml  采集到的 html信息
	 * @param  {[type]} sKey   待过滤的关键字
	 * @param  {[type]} urlObj url对象
	 * @override
	 * @return {[type]}        [description]
	 */
	parse: function(sHtml, sKey, urlObj) {
		if (sHtml) {
			//解析类型
			var parseType = this.dataStore.parseType,
				//解析规则列表
				ruleList = this.dataStore.parseRuleList,
				iCount = ruleList.length,
				//规则对象
				ruleObj = {},
				$ = cheerio.load(sHtml),
				//通过规则获取到的dom列表
				domList,
				domCount,
				subDomList,
				subDomCount,
				dom,
				//名称
				sText = "",
				//待返回的结果对象
				objList = [],
				//链接前缀
				sUrlPre = "",
				//是否是完整链接
				isCompleteUrl = 1;
			//html格式信息处理，用cheerio
			if (parseType == "html") {
				//解析多套规则
				for (var j = 0; j < iCount; j++) {
					ruleObj = ruleList[j];
					//如果规则存在则
					if (ruleObj.main) {
						domList = $(ruleObj.main);
						domCount = domList.length;

						for (var i = 0; i < domCount; i++) {
							dom = $(domList[i]);
							if (ruleObj.sub) {
								subDomList = dom.find(ruleObj.sub.r);
								subDomCount = subDomList.length;
								if (subDomCount > 0 && ruleObj.sub.ri) {
									if (typeof(ruleObj.sub.ri) == "string") {
										if (ruleObj.sub.ri == "last") {
											dom = subDomList.last();
										} else if (ruleObj.sub.ri == "first") {
											dom = subDomList.first();
										}
									} else {
										dom = subDomList.eq(ruleObj.sub.ri);
									}
								} else {
									dom = subDomList[0];
								}
							}
							sHref = myUtil.trim(dom.attr("href"));
							sUrlPre = this.getPreInfo(sHref, urlObj);
							sUrl = sUrlPre + sHref;
							sText = dom.text();
							//如果存在链接，才新增
							if (sHref) {
								if (sKey) {
									if (sText.indexOf(sKey) >= 0) {
										objList.push({
											_id: sText,
											url: sUrl
										});
									}
								} else {
									objList.push({
										_id: sText,
										url: sUrl
									});
								}
							}
						}
					}
				}
			}
			//文本格式信息处理，用正则
			else if (parseType == "text") {
				var titleList = [],
					titleCount = 0,
					urlList = [],
					urlCount = 0,
					sHref = "",
					sTitle = "",
					tmpList = [];
				//解析多套规则
				for (var j = 0; j < iCount; j++) {
					ruleObj = ruleList[j];
					//如果规则存在则
					if (ruleObj.main) {
						titleList = sHtml.match(ruleObj.main.titleList);
						titleCount = titleList.length;
						urlList = sHtml.match(ruleObj.main.urlList);
						urlCount = urlList.length;

						for (var i = 0; i < urlCount; i++) {
							sHref = urlList[i];
							tmpList = sHref.match(ruleObj.main.url);
							if (tmpList.length > 1) {
								sHref = tmpList[1];
							} else {
								sHref = tmpList[0]
							}
							sTitle = titleList[i];
							tmpList = sTitle.match(ruleObj.main.title);
							if (tmpList.length > 1) {
								sText = tmpList[1];
							} else {
								sText = tmpList[0]
							}
							sHref = myUtil.trim(sHref);
							sUrlPre = this.getPreInfo(sHref, urlObj);
							sUrl = sUrlPre + sHref;
							//log(sText);
							//如果存在链接，才新增
							if (sHref) {
								if (sKey) {
									if (sText.indexOf(sKey) >= 0) {
										objList.push({
											_id: sText,
											url: sUrl
										});
									}
								} else {
									objList.push({
										_id: sText,
										url: sUrl
									});
								}
							}
						}
					}
				}
			}
			sHtml = "";
			domList = [];
			dom = null;
			$ = null;
			return objList;
		} else {
			return [];
		}
	},
	isComplete: function(sListUrl) {
		//var result=0,
		//okCount=this.dataStore.list_okList.length,
		//errCount=this.dataStore.list_errList.length,
		//sumCount=this.dataStore.urlCount,
		//iCount=sumCount-(okCount+errCount);
		/*
		var curListObj=okInfo[sListUrl],
			okCount=curListObj.detail_okList.length,
			errCount=curListObj.detail_errList.length,
			sumCount=curListObj.count,
			iCount=sumCount-(okCount+errCount);
		
		if(!iCount){
			result=1;

			log(sListUrl+":列表页采集完成");
			log("出错个数err:"+errCount);
			log(this.dataStore.list_errList);
		}
		else{
			//log("列表页采集还差:"+iCount);
		}
		return result;
		*/
	},
	/**
	 * 判断信息是否已经存在,未存在则调用详细页进行执行
	 * @param  {[type]}  infoList  当前获取的页面列表信息
	 * @param  {[type]}  detailMod 明细模块
	 * @param  {[type]}  configObj [description]
	 * @param  {[type]}  sChartSet [description]
	 * @return {Boolean}           [description]
	 */
	isExisted: function(infoList, detailMod, configObj, sChartSet) {
		var that = this,
			iCount = infoList.length,
			infoObj,
			sTitle = '',
			curOkInfo = okInfo[configObj.url],

			newInfoList = [],
			isAllExisted = 1;
		//列表页等待时间
		//var waitTime = this.dataStore.wait ? this.dataStore.wait : 600000;	
				
		if (!curOkInfo) {
			okInfo[configObj.url] = curOkInfo = {
				type: "list",
				url: configObj.url,
				count: iCount,
				detail_okList: [],
				detail_errList: []
			};
			//okInfo[configObj.url]={};
		}

		var okList = curOkInfo.detail_okList,
			errList = curOkInfo.detail_errList;
		//清理已ok 但已经不在最新获取到的列表中的信息
		iCount = okList.length;
		//log(configObj.url+",isExisted,okList.length:"+iCount);
		for (var i = iCount - 1; i >= 0; i--) {
			infoObj = okList[i];
			sTmpUrl = infoObj.url;
			if (myUtil.indexOfObj(infoList, 'url', sTmpUrl) < 0) {
				okList.splice(i, 1);
			}
		}
		curOkInfo.detail_okList = okList;

		//清理已失败 但已经也不在最新获取到的列表中的信息
		iCount = errList.length;
		for (var i = iCount - 1; i >= 0; i--) {
			infoObj = errList[i];
			sTmpUrl = infoObj.url;
			if (myUtil.indexOfObj(infoList, 'url', sTmpUrl) < 0) {
				errList.splice(i, 1);
			}
		}
		curOkInfo.detail_errList = errList;
		iCount = infoList.length;
		for (var i = 0; i < iCount; i++) {
			infoObj = infoList[i];
			sTmpUrl = infoObj.url;
			if (myUtil.indexOfObj(okList, 'url', sTmpUrl) < 0) {
				log("新:" + sTmpUrl + ",   源:" + configObj.url);
				newInfoList.push(infoObj);
				isAllExisted = 0;
				setTimeout(detailMod.exec, i * 100, detailMod, infoObj.url, configObj, sChartSet, that.table, infoObj._id);
			}
		}
		//详细页挑起重新执行后，看页面是否有数据更新
		if (isAllExisted) {
			var waitTime = this.dataStore.wait ? this.dataStore.wait : 600000;
			log("list.isExisted 所有信息已存详细中，等" + waitTime + "毫秒后后继续执行采集……");
			setTimeout(reExec, waitTime);

			function reExec() {
				//log("list reExec start");
				//log(configObj);
				//log("list reExec end");

				var objList=[{
					url: configObj.url,
  					src: configObj.src,
  					remark: configObj.remark,
  					siteName: configObj.siteName
				}];				
				grapService.exec(objList,1);
				//subtask.exec(objList);
			}
		}
		
		//that.isComplete(configObj.url);
	},
	/**
	 * 获取Url前缀,因有可能一个列表信息中各个链接格式存在不一致
	 * @param  {[type]} sUrl   原始链接
	 * @param  {[type]} urlObj [description]
	 * @return {[type]}        [description]
	 */
	getPreInfo: function(sUrl, urlObj) {
		var tmpUrlObj = url.parse(sUrl),
			isCompleteUrl = 1,
			sUrlPre = "";
		if (!tmpUrlObj.host) {
			isCompleteUrl = 0;
		}
		//如果是相对链接，则获取链接前缀
		if (!isCompleteUrl) {
			sUrlPre = myUtil.getUrlPre(urlObj, sUrl);
		}
		tmpUrlObj = null;
		return sUrlPre;
	},
	/**
	 * 对外执行接口
	 * @param  {[type]} urlList 链接对象列表
	 * @param  {[type]} sKey    待过滤信息
	 * @override
	 * @return {[type]}         [description]
	 */
	exec: function(urlList, sKey, urlCount) {
		this.init(urlCount, urlList, "info");
		this.getInfo(sKey, "gbk");
	}
};

module.exports = genList;
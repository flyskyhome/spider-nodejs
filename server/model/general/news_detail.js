var url = require('url');
var cheerio = require('cheerio');
var myUtil = require("../../tools/myutil.js");
var page = require("../../tools/page.js");
var dbobj = require("../../tools/db.js");
var keyInfo = require("../../data/keyList.js");
var t = require("../../tools/t.js");
var subtask = require("../../service/taskService.js");
var okInfo = require("../../data/okInfo.js");

var db = new dbobj("flyskyhome");
var db4email = new dbobj("flyskyhome");
var log = t.log;

function genDetail() {}

genDetail.prototype = {
	/**
	 * 初始化
	 * @param  {[type]} sUrl      网页地址
	 * @param  {[type]} urlConfig 待采网页的配置信息
	 * @param  {[type]} tablePre  表前缀
	 * @return {[type]}           [description]
	 */
	init: function(sUrl, urlConfig, tablePre) {
		this.config = urlConfig;
		this.url = url.parse(sUrl);
		db.init(tablePre + "_detail");
		db4email.init(tablePre + "_detail4email");
		return this;
	},
	/**
	 * 获取信息
	 * @param  {[type]} sChartSet 待采网页的字符集
	 * @return {[type]}           [description]
	 */
	getInfo: function(sUrl, sChartSet, urlConfig) {
		var that = this;

		var curUrlObj = url.parse(sUrl);
		var listUrlObj = okInfo[urlConfig.url];
		try {
			page.download(curUrlObj, sChartSet, function(sHtml, configObj) {
				that.dataStore.sn = (that.dataStore.sn - 0 + 1);

				if (sHtml) {
					//如果存在采集成功的页面信息
					if (!listUrlObj.detail_okList) {
						log("没有找到相应的 detail_okList 信息! :" + configObj.url);
						listUrlObj.detail_okList = [];
					}

					listUrlObj.detail_okList.push({
						type: "detail",
						url: configObj.srcUrl
					});
					//判断当前获取正确的信息是否已经存在于错误信息中，如是，则从错误信息中删除
					var idx = myUtil.indexOfObj(listUrlObj.detail_errList, "url", configObj.srcUrl);
					if (idx >= 0) {
						listUrlObj.detail_errList.splice(idx, 1);
					}
					var infoList = that.parse(sHtml, configObj.srcUrl),
						iCount = infoList.length,
						infoObj = "",
						sContent = "",
						nowTime = new Date();

					for (var i = 0; i < iCount; i++) {
						infoObj = infoList[i];
						infoObj.srcUrl = configObj.srcUrl;
						infoObj.updatetime = myUtil.formatDate2String(nowTime) + " " + myUtil.formatTime2String(nowTime);
						db.add(infoObj);
						if (that.isIncludeKey(infoObj)) {
							db4email.add(infoObj);
						}
					}
					that.isComplete(configObj.url);

				} else {
					//下载出错了
					//把错误页信息存入数据库
					if (!listUrlObj.detail_errList) {
						listUrlObj.detail_errList = [];
					}
					listUrlObj.detail_errList.push({
						type: "detail",
						url: configObj.errUrl,
						reseaon: configObj.errInfo
					});
					that.isComplete(configObj.url);
				}

			}, urlConfig);
		} catch (e) {
			if (listUrlObj.detail_errList) {} else {
				listUrlObj.detail_errList = [];
			}
			listUrlObj.detail_errList.push({
				type: "detail",
				url: curUrlObj.url
			});
			that.isComplete(urlConfig.url);
		}
	},
	/**
	 * 该信息是否包含关键字
	 * @param  {[type]}  sInfo [description]
	 * @return {Boolean}       [description]
	 */
	isIncludeKey: function(infoObj) {
		var result = 0;
		var iCount = keyInfo.length,
			sTitle = "",
			sContent = "",
			sKey = "";
		for (var i = 0; i < iCount; i++) {
			sKey = keyInfo[i];
			sTitle = infoObj._id;
			sContent = infoObj.content ? infoObj.content : "";
			if (sTitle.indexOf(sKey) >= 0 || sContent.indexOf(sKey) >= 0) {
				result = 1;
				break;
			}
		}
		return result;
	},
	/**
	 * 更新img 图片链接信息
	 * @param  {[type]} domContent [description]
	 * @return {[type]}            [description]
	 */
	updateImgSrc: function(domContent) {
		//找到是否存在img标签
		var imgList = domContent.find("img"),
			iCount = imgList.length,
			imgDom,
			sImgSrc = "";

		for (var i = 0; i < iCount; i++) {
			imgDom = imgList[i];
			sImgSrc = imgDom.attribs.src;
			imgDom.attribs.src = myUtil.getNewUrl(this.url, sImgSrc);
		}

		return domContent.html();
	},
	/**
	 * 根据规则获取dom内的信息
	 * @param  {object} domObj  dom对象
	 * @param  {object} ruleObj 规则对象
	 * @param  {object} srcUrl  原始链接
	 * @return {string}         信息
	 */
	getInfo4Rule: function(domObj, ruleObj, srcUrl) {
		var sInfo = "",
			sTmpHtml,
			re,
			matchList;
		if (ruleObj.r) {
			sTmpHtml = domObj.html();
			if (sTmpHtml) {
				re = new RegExp(ruleObj.r);
				matchList = sTmpHtml.match(re);
				if (matchList) {
					//带分组的表达式
					if (matchList.length > 1) {
						sInfo = matchList[1];
					}
					//不带分组的表达式
					else {
						sInfo = matchList[0];
					}
				} else {
					//log(ruleObj.r.toString()+":未能匹配到信息！"+srcUrl);
				}
			} else {
				log("获取信息为空 :" + srcUrl);
			}
		} else {
			sInfo += domObj.html();
		}
		return sInfo;
	},
	/**
	 * 网页内容解析
	 * @param  {[type]} sHtml  获取到的页面内容
	 * @param  {[type]} srcUrl 原始页面链接
	 * @override
	 * @return {[type]}       [description]
	 */
	parse: function(sHtml, srcUrl) {
		if (sHtml) {
			var ruleList,
				domObjList,
				domObj,
				sTmpHtml,
				sInfo,
				objList = [],
				matchList = [],
				//规则数量
				iCount,
				//根据规则获取到dom的数量
				domCount;

			//获取解析规则
			var $ = cheerio.load(sHtml, {
					normalizeWhitespace: true,
					decodeEntities: false
				}),
				//配置的解析规则
				rule = this.dataStore.parseRule,
				//存储解析出来的内容
				infoObj = {},
				tmpRule;

			for (var key in rule) {
				ruleList = rule[key];

				iCount = ruleList.length;
				sInfo = "";
				for (var i = 0; i < iCount; i++) {
					tmpRule = ruleList[i];

					if (tmpRule.d) {
						domObjList = $(tmpRule.d);
						domCount = domObjList.length;
					}

					if (domObjList) {
						if (key == "content") {
							this.updateImgSrc(domObjList);
						}

						if (domCount > 1) {
							//如果有指定的，则直接获取
							if (tmpRule.di) {
								domObj = $(domObjList[tmpRule.di - 1]);
								sInfo = this.getInfo4Rule(domObj, tmpRule, srcUrl);
							}
							// 没有指定则进行循环获取
							else {
								for (var j = 0; j < domCount; j++) {
									domObj = $(domObjList[j]);
									sInfo += this.getInfo4Rule(domObj, tmpRule, srcUrl);
								}
							}
						} else {
							for (var j = 0; j < domCount; j++) {
								domObj = $(domObjList[j]);
								sInfo = this.getInfo4Rule(domObj, tmpRule, srcUrl);
							}
						}
					} else {
						sInfo = "";
					}

					if (sInfo) {
						if (key == "title") {
							//替换标题中的html标签
							sInfo = sInfo.replace(/<[^>]*>/g, " ");
							infoObj["_id"] = myUtil.trim(sInfo);
						} else if (key == "content") {
							//清理掉内容中所有换行回车符
							sInfo = sInfo.replace(/(\r|\n)/g, "");
							//执行自定义清理规则
							if (this.dataStore.clearRule) {
								ruleList = this.dataStore.clearRule;
								iCount = ruleList.length;
								for (var i = 0; i < iCount; i++) {
									tmpRule = ruleList[i];
									//re=new RegExp(tmpRule.s,"g");
									//sInfo=sInfo.replace(re,tmpRule.t);
									sInfo = sInfo.replace(tmpRule.s, tmpRule.t);
								}
							}

							//清理内容中需要清理的信息
							//执行默认清理规则
							ruleList = this.dataStore.defaultRule.clear;
							iCount = ruleList.length;
							for (var i = 0; i < iCount; i++) {
								tmpRule = ruleList[i];
								//re=new RegExp(tmpRule.s,"g");
								//sInfo=sInfo.replace(re,tmpRule.t);
								sInfo = sInfo.replace(tmpRule.s, tmpRule.t);
							}

							infoObj[key] = myUtil.trim(sInfo);
						} else if (key == "datetime") {
							//日期格式处理
							if (sInfo) {
								//获取统一格式化后的日期信息 yyyy-mm-dd hh:mm:ss
								infoObj[key] = myUtil.getFormatedDate(sInfo);
								//infoObj[key]=myUtil.trim(sInfo);
							}
						} else {
							infoObj[key] = myUtil.trim(sInfo);
						}
						break;
					}
				}
				//如果是真的没有获取到
				if (sInfo) {} else {
					if (key == "title") {
						infoObj["_id"] = "";
					} else {
						infoObj[key] = "";
					}
				}
			}

			if (infoObj["_id"]) {
				infoObj.orgSrc = this.config.src;
				infoObj.summary = this.config.remark;
				infoObj.siteName = this.config.siteName;
				objList.push(infoObj);
			} else {
				log("sTitle 为空：" + srcUrl);
			}
			$ = null;
			domObjList = [];
			domObj = "";
			sHtml = "";
			matchList = [];
			sInfo = "";
			return objList;
		} else {
			return [];
		}
	},
	isComplete: function(sListUrl) {
		var that = this,
			result = 0,
			obj = okInfo[sListUrl],
			okCount = 0,
			errCount = 0,
			urlObj,
			sumErrorCount = 0;

		okCount = obj.detail_okList.length;
		errCount = obj.detail_errList.length;

		if (okCount + errCount == obj.count) {
			result = 1;
			log("详细页采集已全部完成!");
			//显示结果信息
			log("出错个数err:" + errCount);

			//db4email.close();
			//db.close();
			//等5分钟
			var waitTime = this.dataStore.wait ? this.dataStore.wait : 300000;
			log("等" + waitTime + "毫秒后后继续执行采集……");

			setTimeout(reExec, waitTime);

			function reExec() {
				//log("detail reExec start");
				//log(sListUrl);
				//log("detail reExec end");
				urlObj = url.parse(sListUrl);
				subtask.exec(urlObj.host);
			}
		} else {
			//log("列表内页采集还差:"+(iCount-completedNum)+","+iCount+","+completedNum);
		}
		return result;
	},
	doWork: function(sUrl, urlConfig, sChartSet, sTablePre) {
		this.init(sUrl, urlConfig, sTablePre);
		this.getInfo(sUrl, sChartSet, urlConfig);
	},
	/**
	 * 对外开放的执行接口
	 * @param  {[type]} sUrl      详细页地址
	 * @param  {[type]} urlConfig [description]
	 * @param  {[type]} sChartSet 详细页的字符集
	 * @param  {[type]} sTablePre 存放数据表的前缀信息
	 * @param  {[type]} okUrlList  成功解析的列表页链接信息列表
	 * @return {[type]}           [description]
	 */
	exec: function(sUrl, urlConfig, sChartSet, sTablePre) {
		/*
		this.doWork(sUrl, urlConfig, sChartSet, sTablePre);
		this.dataStore.parseRuleList = [{
			main: "",
			sublist: []
		}];
		*/
	}
};

module.exports = genDetail;
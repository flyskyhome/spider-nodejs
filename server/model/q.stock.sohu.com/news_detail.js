var genDetail=require("../general/news_detail.js");
var cheerio = require('cheerio');
var myUtil = require("../../tools/myutil.js");
var t = require("../../tools/t.js");
var log = t.log;
function sohubk_Detail(dataStore){
	this.dataStore=dataStore;
}

sohubk_Detail.prototype=new genDetail();

	/**
	 * 网页内容解析
	 * @param  {[type]} sHtml  获取到的页面内容
	 * @param  {[type]} srcUrl 原始页面链接
	 * @param  {[type]} sTitle4List 来之列表页的标题
	 * @override
	 * @return {[type]}       [description]
	 */
	sohubk_Detail.prototype.parse=function(sHtml, srcUrl,sTitle4List) {
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
				infoObj={},
				//配置的解析规则
				rule = this.dataStore.parseRule,
				//存储解析出来的内容
				tmpRule;

			for (var key in rule) {
				ruleList = rule[key];

				iCount = ruleList.length;
				sInfo = "";
				var subInfoList=[];
				for (var i = 0; i < iCount; i++) {
					tmpRule = ruleList[i];

					if (tmpRule.d) {
						domObjList = $(tmpRule.d);
						domCount = domObjList.length;
					}

					if (domObjList) {
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
									subInfoList.push(this.getInfo4Rule(domObj, tmpRule, srcUrl));
									//sInfo += this.getInfo4Rule(domObj, tmpRule, srcUrl)+",";
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
					//如果有列表信息，则
					if(subInfoList.length>0){
						infoObj[key]=subInfoList;
					}
					else if (sInfo) {
						sInfo=sInfo.substr(0,sInfo.length-1);
						infoObj[key] = myUtil.trim(sInfo);
						break;
					}
				}
			}

			infoObj["_id"]=sTitle4List;
			objList.push(infoObj);

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
	};

var sohubk_Detail_Obj=new sohubk_Detail({
		sn: 0,
		//解析规则
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		parseRule:{
			//证券代码
			code: [{
				//dom规则
				d: "#BIZ_MS_plstock tbody .e1"
			}]/*,
			name:[{
				//dom规则
				d: "#BIZ_MS_plstock tbody .e2 a"
			}]*/
		},
		clearRule:[]
	});

module.exports = sohubk_Detail_Obj;
var url = require('url');
var async = require('async');
var cheerio = require('cheerio');
var page = require("../../tools/page.js");
var dbobj = require("../../tools/db.js");
var myUtil = require("../../tools/myutil.js");
var genList = require("../general/news_list.js");
var db = new dbobj("flyskyhome");

var hzcbList = {
	dataStore: {
		sn: 0,
		//列表页获取信息出错页的网址信息，包括，下载出错、未能下载到内容，下载到内容了但解析不到标题信息
		//信息:网址、原因
		//页面类型:列表页
		list_errList: [],
		//下载成功并正确解析到标题信息的列表页
		list_okList: [],
		//待采列表页总数
		urlCount: 0,
		//信息解析规则
		parseRuleList: []
	},
	/**
	 * 初始化
	 * @param  {[type]} urlCount    所有要采集的列表页数量
	 * @param  {[type]} urlList     当前host需要采集的列表页信息
	 * @param  {[type]} sTablePre  	表名前缀
	 * @param  {[type]} addPageInfo 是否补充分页信息
	 * @return {[type]}             [description]
	 */
	init: function(socket, urlCount, urlList, tablePre, addPageInfo, sCharSet) {
		this.socket = socket;
		this.dataStore.urlCount = urlCount;
		this.dataStore.list_errList = [];
		this.dataStore.list_okList = [];
		this.dataStore.sn = 0;
		//如果需要添加分页信息
		if (addPageInfo) {
			this.urlList = this.getPageUrlList(urlList, sCharSet);
			this.dataStore.urlCount=this.urlList.length;
		} else {
			this.urlList = urlList;
		}
		this.table = tablePre;

		db.init(tablePre + "_list");
		return this;
	},
	/**
	 * 获取添加分页链接后的网址列表
	 * @param  {[type]} urlList [description]
	 * @return {[type]}         [description]
	 */
	getPageUrlList: function(urlList,sCharSet) {
		var iCount = urlList.length,
			urlObj;
		for (var i = 0; i < iCount; i++) {
			urlObj = urlList[i];
			for (j = 1; j < 2126; j++) {
				var newObj = {};
				//复制原有url对象属性
				for (var key in urlObj) {
					newObj[key] = urlObj[key];
				}
				//修改链接地址
				newObj.url = urlObj.url + "?issueNumber=000000&pageNo="+j;
				urlList.push(newObj)
			}
		}
		return urlList;
	},
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
			detailMod = null;
		this.dataStore.keyInfo=sKey;
		for (var j = 0; j < urlCount; j++) {
			var srcUrlObj = this.urlList[j];
			try {
				var urlObj = url.parse(srcUrlObj.url);
				//这里的configObj 就是传进去的srcUrlObj
				page.download(urlObj, sChartSet, function(sHtml, configObj) {
					//如果sHtml不为null
					if (sHtml) {
						//详细页链接信息
						var infoList = that.parse(sHtml, sKey, urlObj),
							iCount = infoList.length;

						for (var i = 0; i < iCount; i++) {
							var tmpInfo = infoList[i];
							db.add(tmpInfo);
						}
					}
					else{
						that.socket.emit('grap', {
							type: "msg",
							message: "列表页_下载出错:  " + configObj.errUrl + "错误原因:" + configObj.errInfo
						});
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
				this.socket.emit('grap', {
					type: "msg",
					message: "列表页_下载出错:  " + configObj.errUrl + "错误原因:网址异常"
				});

				//console.log("网址解析异常:" + srcUrlObj.url);
				this.dataStore.list_errList.push({
					type: "list",
					url: srcUrlObj.url,
					reseaon: "网址异常"
				});
				that.isComplete();
			}
		}
		return this;
	},
	parse: function(sHtml, sKey, urlObj) {
		if (sHtml) {
			//解析规则列表
			var ruleList = this.parseRuleList,
				iCount = ruleList.length,
				//规则对象
				ruleObj = {},
				$ = cheerio.load(sHtml),
				//通过规则获取到的dom列表
				domList = $(".piece3 .PicTitleSumlist .titles"),
				domCount = domList.length,
				dom,
				//名称
				sCode = "",
				sName ="",
				//待返回的结果对象
				objList = [],
				tdList=[];
			//解析多套规则
			for (var j = 0; j < iCount; j++) {
				ruleObj = ruleList[j];
				//如果规则存在则
				if (ruleObj.main) {
					domList = $(ruleObj.main);
					domCount = domList.length;

					for (var i = 0; i < domCount; i++) {
						dom = $(domList[i]);
						tdList=dom.find("td");
						sCode = $(tdList[0]).text();
						sName= $(tdList[1]).text();
						if(sCode){
							objList.push({
								_id: sCode,
								name: sName
							});
						}
					}
				}
			}
			return objList;
		} else {
			return [];
		}
	},
	isComplete: function() {
		var result = 0,
			okCount = this.dataStore.list_okList.length,
			errCount = this.dataStore.list_errList.length,
			sumCount = this.dataStore.urlCount,
			iCount = sumCount - (okCount + errCount);

		if (!iCount) {
			result = 1;
			this.socket.emit('grap', {
				type: "msg",
				message: "--------列表页下载完成,出错个数:  " + errCount
			});
			console.log("列表页采集全部完成");
			console.log("出错个数err:" + errCount);
			console.log(this.dataStore.list_errList);
			var errUrlList=this.dataStore.list_errList;
			//继续执行
			this.init(this.socket,errUrlList.length,errUrlList, "hzcb",0);
			this.getInfo(this.dataStore.keyInfo, "utf-8");
			//console.log("ok个数:"+okCount);
			//console.log(this.dataStore.list_okList);
			//if(errCount>0){
			//console.log("执行未能采集成功的 列表页网址信息");
			//this.exec(this.dataStore.list_errList,"",errCount);
			//}
		} else {
			//console.log("列表页采集还差:"+iCount);
		}
		return result;
	},
	exec: function(socket,urlList, sKey,urlCount) {
		console.log(sKey);
		console.log(urlList);

		this.parseRuleList=[{
			main:".ge2_content .content_data"
		}];
		this.init(socket,urlCount,urlList, "hzcb",1);
		this.getInfo(sKey, "utf-8");
	}
};

hzcbList = myUtil.extend(hzcbList, genList, false);

module.exports = hzcbList;
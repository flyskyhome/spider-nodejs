var url = require('url');
var async = require('async');
//var fs=require('fs');
//var cheerio = require('cheerio');
var genDataDeal=require("../gendatadeal.js");
var myUtil = require("../../../tools/myutil.js");
//var tbHelper = require("../../../tools/tbhelper.js");
var page = require("../../../tools/page.js");
var t=require("../../../tools/t.js");
var log=t.log;
var wait=t.wait;

function corpBase(dataStore){
	this.dataStore=dataStore;
	/*
	{
		sn: 0,
		//列表页获取信息出错页的网址信息，包括，下载出错、未能下载到内容，下载到内容了但解析不到标题信息
		//信息:网址、原因
		//页面类型:列表页
		errList: [],
		//下载成功并正确解析到标题信息的列表页
		okList: [],
		//待采列表页总数
		urlCount: 0,
		//信息解析规则
		parseRuleList: [],
		//采集失败信息重采任务执行次数
		reGrapCount:0,
		reUrlList:[]
	}
	*/
}
corpBase.prototype={
	/**
	 * 初始化
	 * @param  {[type]} urlCount    所有要采集的列表页数量
	 * @param  {[type]} urlList     当前host需要采集的列表页信息
	 * @param  {[type]} sTablePre  	表名前缀
	 * @param  {[type]} addPageInfo 是否补充分页信息
	 * @return {[type]}             [description]
	 */
	init:function(cb) {},
	/**
	 * 初始化任务信息
	 * @return {[type]} [description]
	 */
	initCargo:function(obj, cb){
		var that=obj.operObj.jsObj;
		var waitInfo=that.dataStore.wait||{
			//正常等待时间
			n:5,
			//重新执行后的等待时间
			r:50,
			//开始一次重新执行的等待时间
			rn:2000
		};
		that.cargo = async.cargo(function (tasks, callback) {
			var task,
				urlObj,
				sChartSet="",
				srcUrlObj,
				sUrl="",
				sTable="";

		    for(var i=0; i<tasks.length; i++){
		    	task=tasks[i];
		    	sChartSet=task.charset;
		    	sUrl=task.url;

		    	//corpObj=task.corpObj;

				var curUrlObj=url.parse(sUrl);
				try {
					page.download(curUrlObj, sChartSet, function(sHtml, configObj) {

						var sState="ok";
						that.dataStore.sn = (that.dataStore.sn - 0 + 1);
						if (sHtml) {
							
							var infoList = that.parse(sHtml, configObj),
								iCount = infoList.length;

		    				sTable=task.table;
		    				//log("task.table:"+sTable);
		    				that.dataStore.dbObj.setTable(sTable);
							for (var i = 0; i < iCount; i++) {
								that.dataStore.dbObj.add(infoList[i]);
							}

							//如果存在采集成功的页面信息
							that.dataStore.okCount++;
							/*
							var oklistUrlObj = that.dataStore.okList;
							oklistUrlObj.push({
								type: "detail",
								url: configObj.srcUrl
							});
							*/
							that.isComplete(cb);
						} else {
							sState="err";
							log("详细页_采集出错:  " + configObj.errUrl+"<br/>"+sHtml);
							var errlist = that.dataStore.errList;
							if(myUtil.indexOfObj(errlist, "url", configObj.errUrl)<0){
								errlist.push(configObj);
							}
							else{
								log("采集出错：xxxxx");
							}

							that.isComplete(cb);
						}
						sHtml="";
						callback({
							state:sState,
							url:sUrl
						});
					}, task);
				} catch (e) {
					var listUrlObj = that.dataStore.errList;
					log("详细页_采集异常出错:  " + curUrlObj.url+"<br/>"+sHtml);
					listUrlObj.push({
						type: "detail",
						url: curUrlObj.url
					});

					that.isComplete(cb);

					callback({
						state:"err",
						url:sUrl
					});
				}
		    }
		}, 1);
		/**
		 * 监听：如果某次push操作后，任务数将达到或超过worker数量时，将调用该函数
		 */
		that.cargo.saturated = function() {
		    log('all workers to be used');
		}

		/**
		 * 监听：当最后一个任务交给worker时，将调用该函数
		 */
		that.cargo.empty = function() {
			/*
			var iTaskCount=that.cargo.length();
		    //log(that.table+'_还剩任务数量:'+iTaskCount);
		    if(iTaskCount==0){
		    	//that.reExec(cb);
		    }
		    else{
			    //if(that.dataStore.sn!=0 && that.dataStore.sn % 150==0){
			    	//wait(waitInfo.n);
			    //}
			    //else{
			    	//wait(5+that.dataStore.reGrapCount*waitInfo.r);
			    //}
		    }
		    */
		}
		/**
		 * 监听：当所有任务都执行完以后，将调用该函数
		 */
		that.cargo.drain = function() {
		    log('all tasks have been processed:'+that.cargo.length());
		}
	},
	/**
	 * 重新执行
	 * @param  {Function} cb 回调函数
	 * @return {[type]}      [description]
	 */
	reExec:function(cb){
		var that=this,
			errList=this.dataStore.errList,
			tmpObj;

		var waitInfo=that.dataStore.wait||{
			//正常等待时间
			n:5,
			//重新执行后的等待时间
			r:50,
			//开始一次重新执行的等待时间
			rn:2000
		};

		//此时，虽然，所有任务均以发出，但是，并不能代表所有任务均以完成，重新计算所剩任务数量
		var okCount = this.dataStore.okCount,
			errCount = this.dataStore.errList.length,
			sumCount = this.dataStore.urlCount,
			unfinishedCount=sumCount-okCount-errCount;

			unfinishedCount=unfinishedCount>0?unfinishedCount:0;

		//db.setTable(that.table);
		log('采集失败页面数量:'+errCount);
		log('未完成页面数量:'+unfinishedCount);
		log('已进行重采次数:'+this.dataStore.reGrapCount);
		//log(errList);

		this.dataStore.okCount=0;
		this.dataStore.urlCount=errCount+unfinishedCount;
		if(errCount>0 && this.dataStore.reGrapCount<10){
//		if(errCount>0){
			this.dataStore.reUrlList=[];
			//that.dataStore.cargoCb=cb;
			myUtil.extend(this.dataStore.reUrlList,errList);
			this.dataStore.errList=[];
			//log("re_okCount:"+dataStore.okList.length);
			//log("re_errCount:"+dataStore.errList.length);
			//log("re_sumCount:"+dataStore.urlCount);
			//wait(waitInfo.rn);
			setTimeout(setReExeInfo,waitInfo.rn);

			function setReExeInfo(){
				//继续把抓取存在错误的信息
				for(var i=0;i<errCount;i++){
				 	tmpObj=that.dataStore.reUrlList[i];
					that.cargo.push(
						{
							url:tmpObj.url,
							corpObj:tmpObj.corpObj,
							charset:tmpObj.charset
						},
						function (err) {
							//log('finished processing :'+err.url);
						}
					);
				}
				that.dataStore.reUrlList=[];
				that.dataStore.reGrapCount+=1;
			}
		}
		else{
			log("没有错误信息，或者已经重新执行超过10次!");
			log(this.table+" 准备去存字段映射关系了!");
			cb(null, that);
		}
	},
	/**
	 * 获取网页信息
	 * @param  {[type]} sKey      待过滤的关键字
	 * @param  {[type]} sChartSet 网页字符集
	 * @return {[type]}           [description]
	 * @chainable
	 */
	getInfo:function(obj, cb) {
		var operObj = obj.operObj.jsObj,
			objList = obj.oList,
			sUrl = "",
			sChartSet = operObj.charset,
			urlCount = objList.length,
			sPre = operObj.preUrl,
			sSuf = operObj.sufUrl,
			tmpObj
			;

		operObj.dataStore.dbObj.setTable(operObj.table);
		operObj.initCargo(obj, cb);
		operObj.dataStore.urlCount = urlCount;

		for (var i = 0; i < urlCount; i++) {
			tmpObj = objList[i];
			operObj.cargo.push(
				{
					url:sPre + tmpObj.aid + tmpObj._id + sSuf,
					corpObj:tmpObj,
					charset:sChartSet,
					table:operObj.table
				},
				function (err) {
					log('finished processing :'+err.url);
				}
			);
		}
		obj.oList=objList=[];
	},
	/**
	 * 对内容进行解析,需要重写
	 * @param  {[type]} sHtml  采集到的 html信息
	 * @param  {[type]} sKey   待过滤的关键字
	 * @param  {[type]} urlObj url对象
	 * @override
	 * @return {Array}        需存储对象的列表信息
	 */
	parse:function(sHtml, task) {
	},
	/**
	 * 判断是否已经完成
	 * @param  {Function} cb [description]
	 * @return {Boolean}     [description]
	 */
	isComplete:function(cb) {
		var that=this,
			result = 0,
			okCount = this.dataStore.okCount,
			errCount = this.dataStore.errList.length,
			sumCount = this.dataStore.urlCount,
			iCount = sumCount - (okCount + errCount);

		if (!iCount) {
			result = 1;
			log(this.table+" 采集全部完成");
			log(this.table+" okCount:"+okCount);
			log(this.table+" errCount:"+errCount);
			log(this.table+" sumCount:"+sumCount);
			log(this.dataStore.errList);

			//ok的数量 和 全部需要采集的数据数量一致时，说明任务真的完成~\(≧▽≦)/~啦啦啦
			if(okCount==sumCount){
				this.dataStore.okCount=0;
				this.dataStore.urlCount=0;
				this.dataStore.errList=[];
				log(this.table+" 全部正确采集完成！！！");
				//断开数据库链接
				//dataStore.dbObj.close();
				log(this.table+" 准备去存字段映射关系了!");
				cb(null, that);
			}
			else{
				this.reExec(cb)
			}
		} else {
			log(this.table+" okCount:"+okCount);
			log(this.table+" errCount:"+errCount);
			log(this.table+" sumCount:"+sumCount);
			log(this.table+" 采集还差:"+iCount);
			if(iCount<0){
				this.reExec(cb);
			}
		}
	},
	/**
	 * 对外执行接口
	 * @override
	 * @return {[type]}         [description]
	 */
	exec:function() {
	},
	/**
	 * 真实执行
	 * @param  {[type]} db [description]
	 * @return {[type]}    [description]
	 */
	realExec:function(db){
		var that=this;
		this.dataStore.dbObj=db;
		db.init(this.table);
		async.waterfall([this.init,genDataDeal.getColMap, genDataDeal.getCorpMapInfo, this.getInfo, genDataDeal.saveColMap], function(err, results) {
			log('err: ', err);
			log('results: ', results);
			log(that.dataStore.errList);
			that.callback(null,{
				err:err,
				res:results
			});
			/*
			process.send({
				id:that.table,
				state:"finish",
				err:err,
				wait:24*3600*1000
			});
			*/
		});
	}
};

module.exports = corpBase;
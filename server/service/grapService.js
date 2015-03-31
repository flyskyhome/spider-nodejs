var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var myUtil = require("../tools/myutil.js");
var t=require("../tools/t.js");
var log=t.log;
//var execInfoStore=require("./execInfo.js");

/**
 * 抓取服务
 * @type {Object}
 */

var grapService = {
	dataStore:{
	},
	/**
	 * 执行抓取动作
	 * @param  {[type]} urlList [description]
	 * @param  {[type]} reExec  任务重新执行标记，在列表或详细页判断抓取完成之后，提供
	 * @return {[type]}         [description]
	 */
	exec: function(urlList,reExec) {
		log("采集开始:");
		var iCount = urlList.length,
			sUrl = "",
			newUrlList = [],
			//控制网站
			hostList = [],
			//控制网站，及网站栏目，还未处理
			hostObjList = [],
			modelObjList = [],
			urlObj,
			sHost="",
			reExec=reExec||0;

		//解析Url,获取host，剔除重复
		for (var i = 0; i < iCount; i++) {
			sUrl = urlList[i].url;
			urlObj = url.parse(sUrl);
			sHost = urlObj.host;
			//log(sUrl);
			//log(urlObj);
			//如果host中还不存在
			if (myUtil.indexOfObj(hostList, "", sHost) < 0) {
				hostList.push(sHost);
			}

			if (myUtil.indexOfObj(hostObjList, "host", sHost) < 0) {
				var hostObj = {
					host: sHost,
					pathList: []
				};

				hostObj.pathList.push(urlList[i]);

				hostObjList.push(hostObj);
			} else {
				var hostObj = myUtil.getObj(hostObjList, "host", sHost);
				if (myUtil.indexOfObj(hostObj.pathList, "url", sUrl) < 0) {
					hostObj.pathList.push(urlList[i]);
				}
			}
		}

		//根据Url中host的信息，剔除重复，加载模块列表
		iCount = hostList.length;
		var sModelPath = "",
			pathList=[],
			urlCount=0;

		for (var i = 0; i < iCount; i++) {
			sHost=hostList[i];
			var ListModel=undefined;
			pathList=hostObjList[i].pathList;
			urlCount=urlList.length;

			if(this.dataStore[sHost]){
				log("--------------------------this.dataStore-----------------------");
				ListModel=this.dataStore[sHost];
				ListModel.exec(pathList, "",urlCount,reExec);
			}
			else{
				log("---------sssssss-----------------this.dataStore-----------------------");
				sModelPath = "../model/" + hostList[i] + "/news_list.js";
				if (fs.existsSync(__dirname + "/" + sModelPath)) {
					//console.log("grap:  "+sModelPath);
					ListModel = require(sModelPath);
					this.dataStore[sHost]=ListModel;
					//console.log(sModelPath);
					//console.log(ListModel);

	//				ListModel.exec(hostObjList[i].pathList, "",urlList.length);
					ListModel.exec(pathList, "",urlCount,reExec);
				} else {
					console.log(__dirname + sModelPath + " 文件不存在!");
				};
			}
		}
	}
}

module.exports = grapService;
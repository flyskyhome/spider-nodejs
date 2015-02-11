var url = require('url');
var page = require("../../tools/page.js");
var dbobj = require("../../tools/db.js");
var genDataDeal=require("./gendatadeal.js");
var cheerio = require('cheerio');
var db = new dbobj("flyskyhome");
var async = require('async');
var fs = require('fs');
var t = require('../../tools/t.js');
var log = t.log;

var corpMap = {
	init: function(cb) {
		console.log("init");
		corpMap.tbCode = "corpMap";
		corpMap.preUrl = "http://www.cninfo.com.cn/information/";
		corpMap.sufUrl = "lclist.html";
		cb(null, {
			dbObj: db,
			jsObj: corpMap
		});
	},
	getInfo: function(obj, cb) {
		log("getInfo");

		//因为用async调用时 this 为node执行环境
		var that = obj.operObj.jsObj,
			objList = obj.oList,
			sUrl = "",
			iCount = objList.length,
			tmpObj,
			sPre = that.preUrl,
			sSuf = that.sufUrl,
			urlList = [];
		log(that.tbCode);
		db.init(that.tbCode);
		//console.log(iCount);
		//执行循环获取各个市场的企业数据
		for (var i = 0; i < iCount; i++) {
			tmpObj = objList[i];

			sUrl = sPre + tmpObj.mid + "/" + tmpObj.pid + "/" + tmpObj._id + sSuf;
			log(sUrl);
			urlList.push({
				obj: tmpObj,
				urlObj: url.parse(sUrl)
			});
		}

		//console.log(urlList);

		//通过同步控制，保证最后一项执行的时候
		async.each(urlList, function(u, callback) {
			page.download(u.urlObj, 'gbk', function(sHtml, newobj) {
				//console.log(sHtml);
				var infoList = that.parse(sHtml, newobj.mid, newobj.pid),
					iCount = infoList.length;
				for (var i = 0; i < iCount; i++) {
					//console.log(infoList[i]);
					db.add(infoList[i]);
				}
				that.write2file(newobj,infoList);
			}, u.obj);
		}, function(err) {
			//如果出错
			if (err) {
				log('err: ' + err);
				cb("getInfo download err:", err);
			}
			//如果未出错
			else {
				log("未出错！！");
				cb(null, obj.operObj);
			}
		});
		cb(null, obj.operObj);
	},
	/**
	 * 写数据入文件
	 * @param  {[type]} markObj  [description]
	 * @param  {[type]} infoList [description]
	 * @return {[type]}          [description]
	 */
	write2file:function(markObj,infoList){
		var sFileName=markObj.mid+"_"+markObj.pid+".js",
			sContent="",
			iCount=infoList.length,
			tmpInfo;
		if(iCount>0){
			tmpInfo=infoList[0];
			sContent="{id:'"+tmpInfo._id+"',name:'"+tmpInfo.name+"'}";
			//生成内容信息
			for(var i=1;i<iCount;i++){
				tmpInfo=infoList[i];
				sContent+=",\n\r{id:'"+tmpInfo._id+"',name:'"+tmpInfo.name+"'}";
			}
			sContent="var "+markObj.mid+"_"+markObj.pid+"=[\n\r"+sContent+"\n\r];\n\rmodule.exports = "+markObj.mid+"_"+markObj.pid+";";
			fs.writeFile(__dirname + '/../../data/corpMap/' + sFileName, sContent, function(err) {
				log(__dirname + '/../../data/corpMap/' + sFileName);
				if (err) {
					log(err.message);
					throw err;
				} else {
					log(sFileName+' saved!');
				}
			});
		}
	},
	parse: function(sHtml, sMId, sPId) {
		var $ = cheerio.load(sHtml),
			domList = $("td"),
			iCount = domList.length,
			dom,
			//名称
			sText = "",
			textInfo = [],
			//代码
			sCode = "",
			//名称
			sName = "",
			objList = [];

		for (var i = 0; i < iCount; i++) {
			dom = $(domList[i]);
			sText = dom.text();
			//console.log(sText);
			textInfo = sText.match(/\d+/);
			sCode = textInfo[0];
			sName = sText.replace(sCode, "").replace(/\s/g, "");
			objList.push({
				_id: sCode,
				name: sName,
				mid: sMId,
				pid: sPId,
				aid:sMId+sPId
			});
		}

		return objList;
	},
	exec: function(callback) {
		this.callback=callback;
		var that=this;
		async.waterfall([this.init, genDataDeal.getMarketInfo, this.getInfo], function(err, results) {
			console.log('err: ', err);
			that.callback(null,{
				err:err,
				res:results
			});
			/*
			process.send({
				id:"corpmap.js",
				state:"finish",
				err:err,
				wait:24*3600*1000
			});
			*/
		});
	}
};

module.exports = corpMap;
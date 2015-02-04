var url = require('url');
var async = require('async');
var cheerio = require('cheerio');
var page = require("../../tools/page.js");
var dbobj = require("../../tools/db.js");
var db = new dbobj("flyskyhome");

var market = {
	init: function() {
		var sUrl = "http://www.cninfo.com.cn/information/lclist.html";
		this.url = url.parse(sUrl);
		db.init("market");
		return this;
	},
	getInfo: function() {
		var that = this;
		page.download(this.url, 'gbk', function(sHtml,config) {
			if(sHtml){
				var infoList = that.parse(sHtml),
					iCount = infoList.length;
				var task;
				for (var i = 0; i < iCount; i++) {
					db.add(infoList[i]);
				}
				that.callback(null,{
					stat:"ok",
					err:""
				});
				/*
				//给主进程报信
				process.send({
					id:"market.js",
					state:"finish",
					err:"",
					//24天
					wait:24*24*3600*1000
				});
				*/
			}
			//获取页面出错
			else{
				console.log("未能获取到页面信息:"+config.errInfo);
				that.callback({
					stat:"err",
					err:"未能获取到页面信息:"+config.errInfo
				});
				/*
				//给主进程报信
				process.send({
					id:"market.js",
					state:"finish",
					err:"",
					//10秒
					wait:10*1000
				});
				*/
			}
		});
	},
	parse: function(sHtml) {
		var $ = cheerio.load(sHtml),
			domList = $(".zx_nav li"),
			iCount = domList.length,
			dom,
			sId = "",
			idInfo = [],
			//名称
			sText = "",
			//市场id
			sMarketId = "",
			//板块id
			sPlateId = "",
			objList = [];

		for (var i = 0; i < iCount; i++) {
			dom = $(domList[i]);
			sId = dom.attr("id");
			idInfo = sId.split("/");
			sMarketId = idInfo[0];
			sPlateId = idInfo[1];
			sText = dom.text().replace(/\s/g, "");
			objList.push({
				_id: sMarketId + sPlateId,
				mid: sMarketId,
				pid: sPlateId,
				name: sText
			});
		}

		return objList;
	},
	exec: function(callback) {
		this.callback=callback;
		this.init();
		this.getInfo();
	}
};

module.exports = market;
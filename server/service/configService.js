//var express = require('express');
//var router = express.Router();
//var url = require('url');
var myUtil = require("../tools/myutil.js");
var dbobj = require("../tools/db.js");
var db = new dbobj("flyskyhome");
/**
 * 抓取服务
 * @type {Object}
 */

var searchService = {
	exec: function(socket, param) {
		var sType = param.type;

		switch (sType) {
			//保存信息
			case "save":
				this.save(socket, param);
				break;
				//获取配置信息
			case "get":
				this.get(socket, param);
				break;
		}
	},
	save: function(socket, param) {
		var infoObj = {};
		try {
			db.init("siteInfo_config");

			var infoList = param.infoList,
				iCount = infoList.length;
			db.delete({_id:/.*/});
			for (var i = 0; i < iCount; i++) {
				infoObj = infoList[i];
				infoObj["_id"] = infoObj.url;
				db.add(infoList[i]);
			}
			socket.emit('config', {
				type: "msg",
				state: "ok"
			});
		} catch (e) {
			socket.emit('config', {
				type: "msg",
				state: "err",
				message: e.message
			});
		}
	},
	get: function(socket, param) {
		db.init("siteInfo_config");

		db.find({},{
					sort: [
						['_id', 1]
					]}, function(objList) {
			//console.log(objList);
			objList = objList || [];
			socket.emit('config',{
				type:"res",
				state: "ok",
				objList: objList
			});
		});
	}
}
module.exports = searchService;
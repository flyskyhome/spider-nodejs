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
		var sType = param.type,
			sTitle = param.title,
			sAuthor = param.author,
			sSrc = param.src,
			sBegDate = param.begdate,
			sEndDate = param.enddate,
			sPageNum = param.pagenum,
			sCurPage = param.page,
			titleList = [],
			iCount = 0,
			//针对标题的查询条件
			sCont4Title = "",
			//针对作者的查询条件
			sCont4Author = "",
			//针对数据来源的查询条件
			sCont4Src = "",
			//针对日期的查询条件
			sCont4Date = "",
			sCont = "";
		//console.log(sTitle);
		if (sType == "email") {
			db.init("info_detail4email");
		} else {
			db.init("info_detail");
		}

		if (sTitle) {
			titleList = sTitle.split(",");
			iCount = titleList.length;
			if (iCount > 0) {
				for (var i = 0; i < iCount; i++) {
					sCont4Title += "{_id:" + "/^.*" + titleList[i] + ".*$/i},";
				}
				sCont4Title = "'$or':["+sCont4Title.substr(0, sCont4Title.length - 1)+"]";
			}
			sCont += sCont4Title;
		}

		if (sAuthor) {
			sCont4Author = "author:" + "/^.*" + sAuthor + ".*$/i";
			if (sCont) {
				sCont += "," + sCont4Author;
			} else {
				sCont += sCont4Author;
			}
		}

		if (sSrc) {
			sCont4Src = "src:" + "/^.*" + sSrc + ".*$/i";
			if (sCont) {
				sCont += "," + sCont4Src;
			} else {
				sCont += sCont4Src;
			}
		}

		if (sBegDate || sEndDate) {
			if (sBegDate && sEndDate) {
				sCont4Date = "datetime:{$gte:'" + sBegDate + "', $lte:'" + sEndDate + "'}";
			} else if (sBegDate) {
				sCont4Date = "datetime:{$gte:'" + sBegDate + "'}";
			} else {
				sCont4Date = "datetime:{$lte:'" + sEndDate + "'}";
			}
			if (sCont) {
				sCont += "," + sCont4Date;
			} else {
				sCont += sCont4Date;
			}
		}

		console.log(sCont);
		socket.emit('search', {
			type: "msg",
			message: "查询条件:"+sCont
		});
		//如果存在分页信息，则启用分页规则
		if (sPageNum && sCurPage) {
			var pageNum = sPageNum - 0,
				page = sCurPage - 0;

			if (sCont) {
				eval("var condObj={" + sCont + "}");

				db.find(condObj, {
					sort: [
						['datetime', -1]
					],
					skip: pageNum * (page - 1),
					limit: pageNum
				}, function(objList) {
					//console.log(objList);
					objList = objList || [];
					socket.emit('search', {
						type: "res",
						state: "ok",
						objList: objList
					});
					//res.json(objList);
				});
			} else {
				db.find({}, {
					_id: 0,
					sort: [
						['datetime', -1]
					],
					skip: pageNum * (page - 1),
					limit: pageNum
				}, function(objList) {
					//console.log(objList);
					objList = objList || [];
					socket.emit('search', {
						type: "res",
						state: "ok",
						objList: objList
					});
					//res.json(objList);
				});
			}
		} else {
			if (sCont) {
				eval("var condObj={" + sCont + "}");

				db.find(condObj, {
					sort: [
						['datetime', -1]
					]
				}, function(objList) {
					objList = objList || [];
					socket.emit('search', {
						type: "res",
						state: "ok",
						objList: objList
					});
				});
			} else {
				db.find({}, {
					_id: 0,
					sort: [
						['datetime', -1]
					]
				}, function(objList) {
					//console.log(objList);
					objList = objList || [];
					socket.emit('search', {
						type: "res",
						state: "ok",
						objList: objList
					});
					//res.json(objList);
				});
			}
		}
	}
}
module.exports = searchService;
var myUtil = require("../tools/myutil.js");
var dbobj = require("../tools/db.js");
var db = new dbobj("flyskyhome");
/**
 * 小车增量指标查询
 * @type {Object}
 */

var carService = {
	exec: function(socket, param) {
		var sId = param.id,
			sName = param.name,
			sPageNum = param.pagenum,
			sCurPage = param.page,
			idList = [],
			iCount = 0,
			//针对标题的查询条件
			sCont4Id = "",
			//针对作者的查询条件
			sCont4Name = "",
			sCont = "";

		db.init("new_hzcb_list");

		if (sId) {
			idList = sId.split(",");
			iCount = idList.length;
			if (iCount > 0) {
				for (var i = 0; i < iCount; i++) {
					sCont4Id += "_id:" + "/^.*" + idList[i] + ".*$/,";
				}
				sCont4Id = sCont4Id.substr(0, sCont4Id.length - 1);
			}
			sCont += sCont4Id;
		}

		if (sName) {
			sCont4Name = "name:" + "/^.*" + sName + ".*$/";
			if (sCont) {
				sCont += "," + sCont4Name;
			} else {
				sCont += sCont4Name;
			}
		}

		console.log(sCont);
		socket.emit('car', {
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
						['_id', -1]
					],
					skip: pageNum * (page - 1),
					limit: pageNum
				}, function(objList) {
					//console.log(objList);
					objList = objList || [];
					socket.emit('car', {
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
						['_id', -1]
					],
					skip: pageNum * (page - 1),
					limit: pageNum
				}, function(objList) {
					//console.log(objList);
					objList = objList || [];
					socket.emit('car', {
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
						['_id', -1]
					]
				}, function(objList) {
					objList = objList || [];
					socket.emit('car', {
						type: "res",
						state: "ok",
						objList: objList
					});
				});
			} else {
				db.find({}, {
					_id: 0,
					sort: [
						['_id', -1]
					]
				}, function(objList) {
					//console.log(objList);
					objList = objList || [];
					socket.emit('car', {
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
module.exports = carService;
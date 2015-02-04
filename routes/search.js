var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var myUtil = require("../server/tools/myutil.js");
var dbobj = require("../server/tools/db.js");
var db = new dbobj("flyskyhome");

/* GET users listing. */
router.get('/*', function(req, res) {
	var sType= req.query.type,
		sTitle = req.query.title,
		sAuthor = req.query.author,
		sSrc = req.query.src,
		sUrl = req.query.url,
		sBegDate = req.query.begdate,
		sEndDate = req.query.enddate,
		sPageNum = req.query.pagenum,
		sCurPage = req.query.page,
		//查询条件类型 like ？ 还是 =
		sCondType = req.query.condtype,
		titleList = [],
		urlList=[],
		iCount = 0,
		//针对标题的查询条件
		sCont4Title = "",
		//针对作者的查询条件
		sCont4Author = "",
		//针对数据来源的查询条件
		sCont4Src = "",
		//针对日期的查询条件
		sCont4Date = "",
		sCont4Url ="",
		sCont = "";
	//console.log(sTitle);
	if(sType=="email"){
		db.init("info_detail4email");
	}
	else{
		db.init("info_detail");
	}

	if (sTitle) {
		titleList = sTitle.split("㊣");
		iCount = titleList.length;
		//console.log("title count: "+iCount);
		if (iCount > 0) {
			for (var i = 0; i < iCount; i++) {
				if(sCondType=='eq'){
					sCont4Title += "'" + unescape(titleList[i]) + "',";
				}
				else{
					sCont4Title += "_id:" + "/^.*" + unescape(titleList[i]) + ".*$/,";
				}
			}
			sCont4Title = sCont4Title.substr(0, sCont4Title.length - 1);
			if(sCondType=='eq'){
				sCont4Title="_id:{$in:["+sCont4Title+"]}";
			}
		}
		sCont += sCont4Title;
	}

	if(sUrl){
		urlList = sUrl.split("㊣");
		iCount = urlList.length;
		//console.log("title count: "+iCount);
		if (iCount > 0) {
			for (var i = 0; i < iCount; i++) {
				if(sCondType=='eq'){
					sCont4Url += "'" + unescape(urlList[i]).replace(/\//g,'\\/') + "',";
				}
				else{
					sCont4Url += "srcUrl:" + "/^.*" + unescape(urlList[i]).replace(/\//g,'\\/') + ".*$/,";
				}
			}
			sCont4Url = sCont4Url.substr(0, sCont4Url.length - 1);
			if(sCondType=='eq'){
				sCont4Url="srcUrl:{$in:["+sCont4Url+"]}";
			}
		}
		sCont += sCont4Url;
	}

	if (sAuthor) {
		sCont4Author = "author:" + "/^.*" + sAuthor + ".*$/";
		if (sCont) {
			sCont += "," + sCont4Author;
		} else {
			sCont += sCont4Author;
		}
	}

	if (sSrc) {
		sCont4Src = "src:" + "/^.*" + sSrc + ".*$/";
		if (sCont) {
			sCont += "," + sCont4Src;
		} else {
			sCont += sCont4Src;
		}
	}

	if (sBegDate || sEndDate) {
		if (sBegDate && sEndDate) {
			sCont4Date = "updatetime:{$gte:'" + sBegDate + "', $lte:'" + sEndDate + "'}";
		} else if (sBegDate) {
			sCont4Date = "updatetime:{$gte:'" + sBegDate + "'}";
		} else {
			sCont4Date = "updatetime:{$lte:'" + sEndDate + "'}";
		}
		if (sCont) {
			sCont += "," + sCont4Date;
		} else {
			sCont += sCont4Date;
		}
	}

	//如果存在分页信息，则启用分页规则
	if(sPageNum && sCurPage){
		var pageNum=sPageNum-0,
			page=sCurPage-0;

		if (sCont) {
			eval("var condObj={" + sCont + "}");
			//console.log(condObj);
			db.find(condObj, {
				sort: [
					['datetime', -1]
				],
				skip: pageNum * (page - 1),
				limit: pageNum
			}, function(objList) {
				//console.log(objList);
				objList = objList || [];
				res.json(objList);
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
				res.json(objList);
			});
		}
	}
	else{
		if (sCont) {
			try{
				eval("var condObj={" + sCont + "}");
				//console.log(condObj);
				db.find(condObj, {
					sort: [
						['datetime', -1]
					]
				}, function(objList) {
					//console.log(objList);
					objList = objList || [];
					//console.log("记录数量:"+objList.length);
					res.json(objList);
				});
			}
			catch(e){
				console.log(e);
				console.log("生成查询条件出错 start");
				console.log("var condObj={" + sCont + "}");
				console.log("生成查询条件出错 end");
				res.json([]);
			}

		} else {
			db.find({}, {
				_id: 0,
				sort: [
					['datetime', -1]
				]
			}, function(objList) {
				//console.log(objList);
				objList = objList || [];
				res.json(objList);
			});
		}
	}
});

router.post('/*',function(req,res){
	var sTitle = req.query.title;
});
module.exports = router;
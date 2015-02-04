var fs=require("fs");
var express = require('express');
var dbobj = require("../server/tools/db.js");
var db = new dbobj("flyskyhome");
var router = express.Router();

/**
 * 保存配置信息
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
router.post('/save', function(req, res) {

	console.log(req.body.infoList);
	var infoObj = {};
	try {
		db.init("siteInfo_config");

		var infoList = req.body.infoList,
			iCount = infoList.length;

		for (var i = 0; i < iCount; i++) {
			infoObj = infoList[i];
			infoObj["_id"] = infoObj.url;
			db.add(infoList[i]);
		}
		res.json({
			state: "ok"
		});
	} catch (e) {
		res.json({
			state: "err"
		});
	}
});

router.get('/*', function(req, res) {
	var sReqType = req.query.type;
	console.log(sReqType);
	switch(sReqType){
		case "site":
			modObj.getSite(req, res);
			break;
		case "saveSite":
			modObj.saveSite(req, res);
			break;
		case "removeSite":
			modObj.removeSite(req, res);
			break;
		case "cate":
			modObj.getCate(req, res);
			break;
		case "saveCate":
			modObj.saveCate(req,res);
			break;
		case "removeCate":
			modObj.removeCate(req,res);
			break;
		default:
			modObj.returnErrInfo(req, res);
			break;
	}
});

var modObj={
	/**
	 * 获取分类配置信息
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	getCate:function(req, res){
		db.init("siteInfo_cateConfig");
		this.getData4Db(req, res);
	},
	saveCate:function(req, res){
		db.init("siteInfo_cateConfig");
		var nodeObj = req.query.nodeObj;
		console.log(nodeObj);
		var info=db.add(nodeObj);
		if(info){
			res.json({
				state:"err",
				msg:info
			});
		}
		else{
			res.json({
				state:"ok",
				nodeObj:nodeObj
			});
		}
	},
	removeCate:function(req, res){
		db.init("siteInfo_cateConfig");
		var nodeObj = req.query.nodeObj;
		console.log(nodeObj);
		var info=db.delete(nodeObj);
		res.json({
			state:"ok"
		});
		/*
		if(info){
			res.json({
				state:"err",
				msg:info
			});
		}
		else{
			res.json({
				state:"ok",
				nodeObj:nodeObj
			});
		}
		*/
	},
	/**
	 * 获取站点Url配置信息
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	getSite:function(req, res){
		db.init("siteInfo_config");
		this.getData4Db(req, res,1);
	},
	saveSite:function(req, res){
		var that=this;
		db.init("siteInfo_config");
		var objInfo = req.query.objInfo;
		console.log(objInfo);
		db.add(objInfo,function(info){
			that.updateSiteConfigFile();
			if(isNaN(parseInt(info))){
				res.json({
					state:"err",
					msg:info
				});
			}
			else{
				res.json({
					state:"ok",
					objInfo:objInfo
				});
			}
		});

	},
	removeSite:function(req, res){
		db.init("siteInfo_config");
		var objList = req.query.objList,
			iCount=objList.length,
			info;
		console.log(objList);
		objList.forEach(function(obj){
			db.delete(obj);
		});
		/*
		for(var i=0;i<iCount;i++){
			info=db.delete(objList[i]);
		}
		*/
		this.updateSiteConfigFile();
		res.json({
			state:"ok"
		});
	},
	/**
	 * 从数据库获取数据信息
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @param  {[type]} isSite 是否是站点信息
	 * @return {[type]}     [description]
	 */
	getData4Db:function(req, res,isSite){
		var query={},
			sCond='';
		console.log(req.query.site);
		console.log(req.query._id);
		
		if(isSite){
			if(req.query.site){
				query={
					site:req.query.site
				};
			}
			else if(req.query._id){
				sCond=req.query._id;
				if(sCond.indexOf('/')>=0){
					sCond=sCond.replace(/\//g,'\\/');
					sCond='/^.*?'+sCond+'.*$/';
				}
				else{
					sCond='/^.*?\\/'+sCond+'\\/.*$/';
				}
				//var sCont='/^.*?\\/'+req.query._id+'\\/.*$/';
				//console.log(sCont);
				eval("query={_id:" + sCond + "}");
			}
		}
		db.find(query, {}, function(objList) {
			//console.log(objList);
			objList = objList || [];
			res.json({
				state:"ok",
				objList:objList
			});
		});
	},
	/**
	 * 返回出错信息
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	returnErrInfo:function(req, res){
		res.json({
			state:"err",
			msg:"无相应数据表"
		});
	},
	/**
	 * 更新site配置信息到文件
	 * @return {[type]} [description]
	 */
	updateSiteConfigFile:function(){
		//重新获取site的配置信息
		db.find(
			{},
			{
				sort: [
					['site', 1]
				]
			},
			function(objList) {
				//console.log(objList);
				objList = objList || [];
				//保存到相应的文件中
				var iCount=objList.length,
					obj,
					sSite="",
					sUrl="",
					sCurSite="",
					sContent="var siteInfo_config={",
					sObjInfo="";
				for(var i=0;i<iCount;i++){
					obj=objList[i];
					sObjInfo="";
					for(var key in obj){
						sObjInfo+=key+":'"+obj[key]+"',"
					}
					sObjInfo="{"+sObjInfo.substr(0,sObjInfo.length-1)+"}";
					sCurSite=obj.site;
					if(sCurSite!=sSite){
						if(i==0){
							sContent+="'"+sCurSite+"':["+sObjInfo+",";
						}
						else{
							sContent+="],'"+sCurSite+"':["+sObjInfo+",";
						}
						sSite=sCurSite;
					}
					else{
						sContent+=sObjInfo+",";
					}
				}
				sContent+="]};\n\rmodule.exports = siteInfo_config;"
				sContent=sContent.replace(/,\]/g,"]");
				console.log(__dirname);
				fs.writeFile(__dirname + '/../server/data/siteInfo_config.js', sContent, function(err) {
					if (err) {
						console.log(err.message);
						throw err;
					} else {
						console.log(__dirname + '/../server/data/siteInfo_config.js'+' saved!');
					}
				});
			});
	}
};

module.exports = router;
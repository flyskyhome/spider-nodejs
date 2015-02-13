//var url = require('url');
//var page = require('../tools/page.js');
var grapService= require("./grapService.js");
var siteConfigInfo=require("../data/siteInfo_config.js");
var myUtil = require("../tools/myutil.js");
/**
 * 通过http请求去查询信息，而不是直接调用信息去执行
 * @type {Object}
 */
var subtask = {
	exec:function(sSiteInfo){
//		var objList=siteConfigInfo[this.getRealSite(sSiteInfo)];
		var objList=siteConfigInfo[sSiteInfo],
			obj,
			idx=-1,
			tmpObjList=[];
		if(!objList){
			console.log(sSiteInfo);
			console.log(this.getRealSite(sSiteInfo));
			objList=siteConfigInfo[this.getRealSite(sSiteInfo)];
			//console.log(objList);
			//如果还是没有找到
			if(objList){
				idx=myUtil.indexOfObj(objList, "_id", sSiteInfo);
				if(idx>=0){
					obj=objList[idx];
					tmpObjList=[];
					tmpObjList.push(obj);
					objList=tmpObjList;
				}
				//console.log("----subtask exec");
			}
		}
		console.log(objList);
		if(objList){
			var newObjList=[],
				iCount=objList.length,
				tmpObj;
			for(var i=0;i<iCount;i++){
				tmpObj=objList[i];
				newObjList.push({
					url:tmpObj._id,
					src:tmpObj.src,
					remark:tmpObj.remark,
					siteName:tmpObj.siteName
				});
			}
			console.log(newObjList);
			grapService.exec(newObjList);
		}
		else{
			console.log("没有"+sSiteInfo+": 相关信息");
			grapService.exec([{
				url:"http://"+sSiteInfo
			}]);
		}
	},
	getRealSite:function(sSiteInfo){
		var sResult=sSiteInfo,
			keyList=[],
			iCount=0;

		for(var key in siteConfigInfo){
			keyList.push(key);
		}
		//把key按长度从大到小排
		keyList=keyList.sort(function(a,b){return a.length<b.length;})
		iCount=keyList.length;
		for(var i=0;i<iCount;i++){
			if(sSiteInfo.indexOf(keyList[i])>=0){
				sResult=keyList[i];
				break;
			}
		}

		return sResult;
	}
};

module.exports = subtask;
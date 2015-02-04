var tbHelper = require("../../tools/tbhelper.js");
var mytools = require("../../tools/myutil.js");
var t = require("../../tools/t.js");
var log = t.log;

var self_dbobj = require("../../tools/db.js");
var self_db = new self_dbobj("flyskyhome");

/**
 * 通用数据处理
 * @type {Object}
 */
var genDataDeal = {
	dataStore:{
		//市场信息
		marketInfo:[],
		//市场企业映射信息
		corpMapInfo:[]
	},
	/**
	 * 获取市场信息
	 * @param  {object}   obj 待执行的对象
	 * @param  {Function} cb  [description]
	 * @return {[type]}       [description]
	 */
	getMarketInfo: function(obj, cb) {
		//console.log("getMarketInfo");
		log("getMarketInfo :"+mytools.formatTime2String(new Date()));
		log(genDataDeal.dataStore.marketInfo.length);
		if(genDataDeal.dataStore.marketInfo.length<=0){
			obj.dbObj.init("market");
			obj.dbObj.find({}, {
				name: 0
			}, function(objList) {
				log("getMarketInfo from db");
				genDataDeal.dataStore.marketInfo=objList;
				cb(null, {
					operObj: obj,
					oList: objList
				});
			});
		}
		else{
			log("getMarketInfo from cache");
			cb(null, {
				operObj: obj,
				oList: genDataDeal.dataStore.marketInfo
			});
		}
	},
	/**
	 * 获取表字段信息 (用于存储抓取信息的表)
	 * @param  {[type]}   obj [description]
	 * @param  {Function} cb  [description]
	 * @return {[type]}       [description]
	 */
	getColMap: function(obj, cb) {
		console.log("getColMap :"+mytools.formatTime2String(new Date()));
		obj.dbObj.init("colMap");
		obj.dbObj.find({
			tbcode: obj.jsObj.tbCode
		}, {
			_id: 0
		}, function(objList) {
			tbHelper.colMapInfo[obj.jsObj.table]=objList;
			//tbHelper.colMapList = objList;
			if (cb) cb(null, obj);
		});
	},
	/**
	 * 获取主体映射关系表信息
	 * @param  {[type]}   colMap [description]
	 * @param  {Function} cb     [description]
	 * @return {[type]}          [description]
	 */
	getCorpMapInfo: function(obj, cb) {
		log("getCorpMapInfo :"+mytools.formatTime2String(new Date()));
		
		log(genDataDeal.dataStore.corpMapInfo.length);

		if(genDataDeal.dataStore.corpMapInfo.length<=0){
			obj.dbObj.setTable("corpMap");
			obj.dbObj.find({
				mid: {
					$not: /hk/
				}
			}, {
				name: 0
			}, function(objList) {
				log("getCorpMapInfo from db");
				genDataDeal.dataStore.corpMapInfo=objList;
				cb(null, {
					operObj: obj,
					oList: objList
				});
			});
		}
		else{
			log("getCorpMapInfo from cache");
			cb(null, {
				operObj: obj,
				oList: genDataDeal.dataStore.corpMapInfo
			});
		}
	},
	/**
	 * 保存字段映射信息
	 * @param  {[type]}   sId [description]
	 * @param  {Function} cb  [description]
	 * @return {[type]}       [description]
	 */
	saveColMap: function(obj, cb) {
		console.log("saveColMap:"+mytools.formatTime2String(new Date())+"   "+obj.table);

		var colmap = tbHelper.colMapInfo[obj.table],
			iCount = colmap.length,
			col;
		console.log("save colMap start :"+obj.table);
		console.log(colmap);
		//obj.dataStore.dbObj.setTable("colMap");

		self_db.init("colMap");
		for (var i = 0; i < iCount; i++) {
			col=colmap[i];
			col["tbcode"] = obj.table;
			col["_id"]=obj.table+"_"+col.code;
			//obj.dataStore.dbObj.add(col);
			self_db.add(col);
		}
		//self_db.close();
		//obj.dataStore.dbObj.close();
		console.log("save colMap end");
		//obj.dbObj.setTable(obj.jsObj.table);
		//console.log("set table to "+obj.jsObj.table);
		cb(null, "ok");
	}
};

module.exports = genDataDeal;
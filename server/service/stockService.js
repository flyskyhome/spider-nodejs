var myUtil = require("../tools/myutil.js");
var dbobj = require("../tools/db.js");
var db = new dbobj("flyskyhome");
/**
 * 抓取服务
 * @type {Object}
 */

var stockService = {
	exec: function(socket, param) {
		var sType = param.type;

		switch (sType) {
			//基本信息
			case "base":
				this.baseInfo(socket, param);
				break;
				//获取配置信息
			case "manage":
				this.manageInfo(socket, param);
				break;
		}
	},
	baseInfo: function(socket, param) {
		db.init("corpMap");
		var infoObj = {};
		try {
			db.find({mid:{$not:/hk/}},{
						sort: [
							['aid', 1],
							['_id',1]
						]}, function(objList) {
				//console.log(objList);
				objList = objList || [];
				socket.emit('stock',{
					type:"base",
					state: "ok",
					objList: objList
				});
			});
		} catch (e) {
			socket.emit('stock', {
				type: "msg",
				state: "err",
				message: e.message
			});
		}
	},
	manageInfo: function(socket, param) {
		db.init("dl_management");

		db.find({code:param.code},{_id:0}, function(objList) {
			//console.log(objList);
			objList = objList || [];
			socket.emit('stock',{
				type:"manage",
				state: "ok",
				objList: objList
			});
		});
	}
}
module.exports = stockService;
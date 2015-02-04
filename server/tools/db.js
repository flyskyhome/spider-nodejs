var mongoskin = require("mongoskin");

function dbObj(sDbname, sUrl, sPort, sUser, sPassword) {
	this.dbname = sDbname;
	this.url = sUrl || "localhost";
	this.port = sPort || "27017";
	this.user = sUser;
	this.password = sPassword;
}

dbObj.prototype = {
	/**
	 * 初始化数据库链接
	 * @chainable
	 */
	init: function(sTbName) {
		if(!this.db){
			console.log("dbObj init");
			this.db = mongoskin.db("mongodb://" + this.url + ":" + this.port + "/" + this.dbname, {
				native_parser: true,
				safe:true
			});
		}

		sTbName ? this.setTable(sTbName) : "";
		return this;
	},
	/**
	 * [setTable description]
	 * @param {[type]} sTbName [description]
	 * @chainable
	 */
	setTable: function(sTbName) {
		//console.log("setTable:" + sTbName);
		//console.log(this);
		//如果该表还未存在,则先绑定
		this.db[sTbName] || this.db.bind(sTbName);
		//设置当前需要操作的表对象
		this.curTable = this.db[sTbName];
		return this;
	},
	/**
	 * 新增数据，如果有相同_id的数据存在,则更新
	 * @param {[type]} obj [description]
	 */
	add: function(obj,callback) {
		var that=this;
		this.curTable.save(obj, function(error, task) {
			//console.log(error);
			//console.log(task);
			if (error) {
				if(callback){
					return callback(error);
				}
				else{
					return error;
				}
			}
			//if (!task) return new Error("Failed to save.");
			//that.db.close();
			if(callback){
				return callback(task);
			}
			else{
				return task;
			}
		});
	},
	delete: function(obj) {
		this.curTable.remove(obj, function(error, count) {
			if (error) return error;
			return count;
		});
	},
	/**
	 * [update description]
	 * @param  {[type]} oldObj [description]
	 * @param  {[type]} newObj [description]
	 * @return {[type]}        [description]
	 * @example
	 * 	person.update({“name”:”jobs”}, {$set{“age”:33}}, {multi:true}, callback(err))  
	 */
	update: function(oldObj, newObj) {
		this.curTable.update(oldObj, {
			$set: newObj
		}, {
			multi: true
		}, function(error, count) {
			if (error) return error;
			return count;
		});
	},
	/**
	 * [find description]
	 * @param  {[type]} obj     [description]
	 * @param  {[type]} hideFieldInfo 剔除的指定字段，不显示
	 * @return {[type]}         [description]
	 */
	find: function(obj, hideFieldInfo,callback) {
		var that=this,
			obj = obj || {},
			hObj=hideFieldInfo||{};

		//如果有参数对象，则
		this.curTable.find(obj,hObj).toArray(function(error, tasks) {
			if (error) return error;
			callback(tasks);
			return tasks || [];
		});
	},
	close:function(callback){
		if(this.db){
			this.db.close(function(){
	        	console.log('database has closed');
	        	if(callback){
	        		callback();
	        	}
	    	});
		}
	}
}

module.exports = dbObj;
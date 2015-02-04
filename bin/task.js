var fork = require('child_process').fork;

//var fork = require('child_process').fork;
//var cpus = require('os').cpus();
var async = require('async');
var fs = require('fs');
//var exec = require('child_process').exec;
//var subtask = require("../server/service/taskService.js");
//var taskList = require("./taskList.js");
var t = require("../server/tools/t.js");
var log = t.log;
var workers = {};
async.series({
	b: function(cb) {

		//console.log('b');
		var sPath = "../server/model/";
		//创建批处理文件
		fs.readdir(sPath, function(err, files) {
			var iCount = files.length,
				sName = '',
				sContent = "var taskList =[\n\r",
				sLastInfo = "",
				sDirName = '',
				sFileName = 'taskList.js';
			if (iCount > 0) {
				sDirName = files[iCount - 1];
				sLastInfo = "'" + sDirName + "'\n\r";
			}
			for (var i = 0; i < iCount - 1; i++) {
				sDirName = files[i];
				if(sDirName=="general"){
					continue;
				}
				sContent += "'" + sDirName + "',\n\r";
			}

			sContent += sLastInfo + "];\n\rmodule.exports = taskList;";
			fs.exists(sFileName, function(exists) {
				//不管存不存在都重新创建一遍，因为有可能目录有所增加或改变
				//		if(!exists){
				fs.writeFile(__dirname + '/tasks/' + sFileName, sContent, function(err) {
					console.log(__dirname + '/tasks/' + sFileName);
					if (err) {
						console.log(err.message);
						cb(undefined, err, message);
						throw err;
					} else {
						console.log('It\'s saved!');
						cb();
					}
				});
			});
		});

		cb();
	},
	c: function(cb) {
		//console.log('c');
		//createWorker("./www");
		//createWorker("./search");
		//createWorker("./site.js");
		createWorker("./tasks/grapCorpInfo.js");
		/*
		createWorker("./tasks/market.js");
		createWorker("./tasks/corpMap.js");
		createWorker("./tasks/management.js");
		createWorker("./tasks/balancesheet.js");
		createWorker("./tasks/incomestatements.js");
		createWorker("./tasks/cashflow.js");
		*/
	}
}, function(err, results) {
	log('main err: ', err);
	log('main results: ', results);
});


function createWorker(appPath) {
	//保存fork返回的进程实例
	var worker = fork(appPath);
	//监听子进程exit事件
	worker.on('exit', function() {
		console.log('worker:' + worker.pid + 'exited');
		delete workers[worker.pid];

		//console.log(worker);
		//如果已经全部完成，则不需要重新启动
		if(worker.msg && worker.msg.state=="finish"){
			//如果有指定重启时间 setTimeout 等待时间 有上限，目前最大设置为 24天
			if(worker.msg.wait){
				setTimeout(createWorker,worker.msg.wait,appPath);
			}
		}
		else{
			//等待30秒之后再启动
			setTimeout(createWorker,30000,appPath);
			//createWorker(appPath);
		}
	});

	worker.on('message', function(msg) {
		console.log('recive info:');
		console.log(msg);
		console.log('recive end!');
		worker.msg=msg;
		if(msg && msg.state=="finish"){
			worker.kill([signal='SIGTERM']);
		}
	});

	console.log(worker.pid);
	//console.log(workers);
	workers[worker.pid] = worker;
	console.log('Create worker:' + worker.pid);
}

//父进程退出时杀死所有子进程
process.on('exit', function() {
	for (var pid in workers) {
		workers[pid].kill();
	}
})

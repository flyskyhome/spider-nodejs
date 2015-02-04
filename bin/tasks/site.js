var async = require('async');
var taskList = require("./taskList.js");
var subtask = require("../../server/service/taskService.js");
var t = require("../../server/tools/t.js");
var log = t.log;

async.eachSeries(taskList, function(task, callback) {
	setTimeout(function() {
		log(task + "采集开始……");
		subtask.exec(task);
		callback(null);
	}, 5000);
}, function(err) {
	log('1.4 err: ' + err);
});
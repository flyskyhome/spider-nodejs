var io = require("socket.io");
var serach = require("../server/service/searchService.js");
var config = require("../server/service/configService.js");
var grap = require("../server/service/grapService.js");
var key = require("../server/service/keyService.js");
var car= require("../server/service/carService.js");
var stock=require("../server/service/stockService.js");

exports.initialize = function(server) {
	//io = io.listen(server);
	io = io(server);
	io.on("connection", function(socket) {
		socket.send(JSON.stringify({
			type: 'serverMessage',
			message: 'socket 已经连上!'
		}));

		socket.on('message', function(message) {
			//message = JSON.parse(message);
			console.log(message);
			if (message.type == "userMessage") {
				socket.broadcast.send(JSON.stringify(message));
				message.type = "myMessage";
				socket.send(JSON.stringify(message));
			}
		});

		//查询信息
		socket.on('search', function(message) {
			serach.exec(socket, message);
		});

		//保存配置信息
		socket.on('config',function(message){
			config.exec(socket,message);
		});

		//抓取信息
		socket.on('grap',function(message){
			grap.exec(message.urlList,socket);
		});

		//设置关键字
		socket.on('key',function(message){
			key.exec(socket,message);
		});

		//获取小车信息
		socket.on('car',function(message){
			car.exec(socket,message);
		});

		//获取股票信息
		socket.on("stock",function(message){
			stock.exec(socket,message);
		});
	});
};
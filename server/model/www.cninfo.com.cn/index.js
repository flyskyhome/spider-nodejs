var async = require('async');
var market = require("./market.js");
var corpMap = require("./corpmap.js");
var brief_shsz = require("./brief_shsz.js");
var page = require("../../tools/page.js");
var url = require('url');
var request = require('request');
var iconv = require('iconv-lite');
var buffer = require('buffer');
var BufferHelper = require('bufferhelper');

var dbobj = require("../../tools/db.js");
var db = new dbobj("flyskyhome");

db.test();
//获取市场信息
//market.exec();
//获取市场所属企业信息
//corpMap.exec();
//获取企业概况信息
//brief_shsz.exec();
/*
request({
		method: "post",
		timeout: 50000,
		pool: false,
		maxRedirects: 50,
		headers: {
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp;q=0.8',
			'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'
		},
		encoding: "binary",
//		url: "http://www.cninfo.com.cnqwq/information/stock/balancesheet_.jsp?stockCode=000006&yyyy=2013&mm=-09-309872wkq"
		url: "http://www.cninfo.com.cn/information/balancesheet/szmb000001.html"
	}, function(error, response, body) {
			//如果出错
			if (error) {
				console.log('error: ' + error);
			}
			//正常获取
			else {
				console.log("---------是是是是 ^_^");

				var buf = iconv.decode(new Buffer(body, 'binary'), "gbk");
				console.log(buf.toString());
			}
	})
	.on('response', function(response) {
		var html = '';
		var bufferHelper = new BufferHelper();
		// unmodified http.IncomingMessage object
		response.on('data', function(chunk) {
			//html += chunk;
			bufferHelper.concat(chunk);
			// compressed data as it is received
			//console.log('received ' + data.length + ' bytes of compressed data')
		});

		response.on('end', function() {
			//config=config||{};
			//config.srcUrl=url.href;
			//var buf = iconv.decode(new Buffer(html, 'binary'), "gbk");
			//console.log(buf.toString());
			console.log("---------end ^_^");
			//var result = iconv.decode(bufferHelper.toBuffer(), "gbk");
			//console.log(result);
			//var buf = iconv.decode(new Buffer(html, 'binary'), sCharSet);
			//callback(result,config);
			//callback(buf.toString(),config);
		});
	})
	.on('error', function(err) {
		console.log(err);
		console.log("download error:" + url.href);
		//config = config || {};
		//config.errInfo = err;
		//config.errUrl = url.href;
		//callback(null, config);
	});
*/
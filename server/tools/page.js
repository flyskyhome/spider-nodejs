//var	request = require('request');
var http = require('http'),
	buffer = require('buffer'),
	iconv = require('iconv-lite'),
	//cheerio = require('cheerio'),
	agentList=require("./userAgentList.js"),
	myUtil=require("./myutil.js");

var request = require('request');
var BufferHelper = require('bufferhelper');

var page = {
	/**
	 * 获取页面信息
	 * @param  {object}   sUrl     [description]
	 * @param  {string}   sCharSet [description]
	 * @param  {Function} callback [description]
	 */
	download_old: function(url, sCharSet, callback,config) {
		http.get(url, function(res) {
			var html = '';
			res.setEncoding('binary'); //or hex
			//console.log(res);
			var lFunc=function(chunk) {
				html += chunk;
			};

			res.on('data', lFunc);

			res.on('end', function() {
				var buf = iconv.decode(new Buffer(html, 'binary'), sCharSet);
				config=config||{};
				//console.log(buf);
				//res.removeListener("data",lFunc);
				//config.url=url;
				callback(buf.toString(),config);
			});
		}).on("error", function() {
			console.log("download error:"+url.href);
			config=config||{};
			config.errUrl=url.href;
			callback(null,config);
		});
	},
	/**
	 * [download description]
	 * @param  {[type]}   url      [description]
	 * @param  {[type]}   sCharSet [description]
	 * @param  {Function} callback [description]
	 * @param  {[type]}   config   [description]
	 * @return {[type]}            [description]
	 */
	download_001:function (url, sCharSet, callback,config){
		//默认不启用池
		//bPool=bPool?bPool:false;
		//随机挑选AgentInfo
		var sAgentInfo=agentList[myUtil.random(0,agentList.length-1)];
		//console.log(sAgentInfo);
	    var req = request(url.href, {timeout: 50000, pool: false});
	    req.setMaxListeners(50);
	    req.setHeader('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8')
	       //.setHeader(sAgentInfo);
	       //.setHeader('user-agent', 'Mozilla/5.0 (Linux; U; Android 4.1.2; zh-cn; GT-I9300 Build/JZO54K) AppleWebKit/534.24 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.24 T5/2.0 baiduboxapp/5.2 (Baidu; P1 4.1.2)');
	       .setHeader('user-agent', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36');

	    req.on('error', function(err) {
	        console.log(err);
			console.log("download error:"+url.href);
			config=config||{};
			config.errInfo=err;
			config.errUrl=url.href;
			callback(null,config);
	    });
	    req.on('response', function(res) {
	        var bufferHelper = new BufferHelper();
	        res.on('data', function (chunk) {
	            bufferHelper.concat(chunk);
	        });
	        res.on('end',function(){
	        	config=config||{};
	        	config.srcUrl=url.href;
	            var result = iconv.decode(bufferHelper.toBuffer(),sCharSet);
	            //var buf = iconv.decode(new Buffer(html, 'binary'), sCharSet);
	            callback(result,config);
	            //callback(buf.toString(),config);
	        });
	    });
	},
	/**
	 * [download description]
	 * @param  {[type]}   url      [description]
	 * @param  {[type]}   param    如果是字符串的时候 是charSet，如果是对象时，是charset 和 获取方式 put\get
	 * @param  {Function} callback [description]
	 * @param  {[type]}   config   [description]
	 * @return {[type]}            [description]
	 */
	download:function (url, param, callback,config){
		//默认不启用池
		//bPool=bPool?bPool:false;
		//随机挑选AgentInfo
		var sAgentInfo=agentList[myUtil.random(0,agentList.length-1)];
		//默认请求方法为get
		var sMethod=param.method?param.method:"get";
		//如果存在charset配置,则...,否则认为参数本身即charset信息
		var sCharSet=param.charset?param.charset:param;
		var sProxy="";
		if(url.host.indexOf("127.0.0.1")<0){
			//sProxy="http://127.0.0.1:8087";
		}

		var req=request(
			{
				method: sMethod,
				timeout: 50000,
				pool: false,
				maxRedirects: 50,
				proxy:sProxy,
				headers: {
					'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
					'user-agent':sAgentInfo
				},
				encoding: "binary",
				url: url.href
			},
			function(error, response, body) {
				//如果出错
				if (error) {
			        console.log(error);
					console.log("download error:"+url.href);
					config=config||{};
					config.errInfo=error;
					config.errUrl=url.href;
					callback(null,config);
				}
				//正常获取
				else {
					var result = iconv.decode(new Buffer(body, 'binary'), sCharSet);
		        	config=config||{};
		        	config.srcUrl=url.href;
		            callback(result,config);
				}
			}
		);

		req.setMaxListeners(50);
	}
}
module.exports = page;
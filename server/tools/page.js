var http = require('http'),
	buffer = require('buffer'),
	iconv = require('iconv-lite'),
	agentList=require("./userAgentList.js"),
	myUtil=require("./myutil.js");

var request = require('request');
//var BufferHelper = require('bufferhelper');

var page = {
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
		var sMethod=param.method?param.method:"GET";
		//如果存在charset配置,则...,否则认为参数本身即charset信息
		var sCharSet=param.charset?param.charset:param;
		var sProxy="";
		//console.log("----download begin!");
		//console.log(url);
		//console.log("----download end!");
		
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
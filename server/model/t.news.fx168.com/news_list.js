var genList = require("../general/news_list.js");
/**
 * Fx168
 * @type {Object}
 */
function fx168_NewsList(dataStore){
	this.dataStore=dataStore;
}

fx168_NewsList.prototype=new genList(fx168_NewsList.dataStore);


	/**
	 * 获取添加分页链接后的网址列表
	 * @param  {[type]} urlList [description]
	 * @return {[type]}         [description]
	 */
	fx168_NewsList.prototype.getPageUrlList= function(urlList,sCharSet) {
		var iCount = urlList.length,
			urlObj;
		for (var i = 0; i < iCount; i++) {
			urlObj = urlList[i];
			for (j = 2; j < 10; j++) {
				var newObj = {};
				//复制原有url对象属性
				for (var key in urlObj) {
					newObj[key] = urlObj[key];
				}
				//修改链接地址
				newObj.url = urlObj.url + j + ".html";
				urlList.push(newObj)
			}
		}
		return urlList;
	};
	fx168_NewsList.prototype.exec= function(urlList, sKey,urlCount) {
		console.log(sKey);
		console.log(urlList);
//		this.init(urlList, "fx168_News");
		this.init(urlCount,urlList, "info");
		this.getInfo(sKey, "utf-8");
	};

var fx168_NewsList_Obj=new fx168_NewsList({
										sn:0,
										//列表页获取信息出错页的网址信息，包括，下载出错、未能下载到内容，下载到内容了但解析不到标题信息
										//信息:网址、原因
										//页面类型:列表页
										list_errList:[],
										//下载成功并正确解析到标题信息的列表页
										list_okList:[],
										//待采列表页总数
										urlCount:0,
										//待解析内容格式 默认格式html,text:文本,json
										parseType:"text",
										//解析规则,如果是html则用 cheerio，如果是text 则用 正则
										parseRuleList:[{
											main:{
												titleList:/"title":"(.*?)"/g,
												title:/"title":"(.*?)"/,
												urlList:/"url":"(.*?)"/g,
												url:/"url":"(.*?)"/
											}
										}]
									});

module.exports = fx168_NewsList_Obj;
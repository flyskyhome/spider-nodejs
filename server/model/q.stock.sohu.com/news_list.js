var genList = require("../general/news_list.js");
/**
 * 搜狐行情板块，用于收集行情板块信息
 * @type {Object}
 */
function sohubk_List(dataStore){
	this.dataStore=dataStore;
}

sohubk_List.prototype=new genList(sohubk_List.dataStore);

	/**
	 * 获取添加分页链接后的网址列表
	 * @param  {[type]} urlList [description]
	 * @return {[type]}         [description]
	 */
	sohubk_List.prototype.getPageUrlList= function(urlList,sCharSet) {
	};
	sohubk_List.prototype.exec= function(urlList, sKey,urlCount) {
		console.log(sKey);
		console.log(urlList);
//		this.init(urlList, "cs");
//		标签分类，可以是板块，指数，等等……
		this.init(urlCount,urlList, "stock_sign");
		this.getInfo(sKey, "gbk");
	};

var sohubk_List_Obj=new sohubk_List({
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
							parseType:"html",
							//解析规则,如果是html则用 cheerio，如果是text 则用 正则
							parseRuleList:[{
								main:"#allSector tbody .e2 a"
							}]
						});

module.exports = sohubk_List_Obj;
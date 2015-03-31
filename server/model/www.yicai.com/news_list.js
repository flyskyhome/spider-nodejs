var genList = require("../general/news_list.js");
/**
 * 第一财经
 * @type {Object}
 */
function yicaiList(dataStore) {
	this.dataStore = dataStore;
}

yicaiList.prototype = new genList(yicaiList.dataStore);

/**
 * 获取添加分页链接后的网址列表
 * @param  {[type]} urlList [description]
 * @return {[type]}         [description]
 */
yicaiList.prototype.getPageUrlList = function(urlList, sCharSet) {
	var iCount = urlList.length,
		urlObj;
	for (var i = 0; i < iCount; i++) {
		urlObj = urlList[i];
		for (j = 2; j <= 233; j++) {
			var newObj = {};
			//复制原有url对象属性
			for (var key in urlObj) {
				newObj[key] = urlObj[key];
			}
			//修改链接地址
			//http://www.yicai.com/economy/hgjj/
			//http://www.yicai.com/economy/hgjj/index-1.html

			newObj.url = urlObj.url + "index-" + j + ".html";
			urlList.push(newObj)
		}
	}
	return urlList;
};
/**
 * 采集执行
 * @param  {[type]} urlList  待采列表页列表
 * @param  {[type]} sKey     需过滤掉关键字
 * @param  {[type]} urlCount 数量
 * @param  {[type]} reExec   重新执行标记
 * @return {[type]}          [description]
 */
yicaiList.prototype.exec = function(urlList, sKey, urlCount,reExec) {
	console.log(sKey);
	console.log(urlList);
	//		this.init(urlList, "yicai");
	//如果是重新执行，不去获取分页信息
	if(reExec){
		this.init(urlCount, urlList, "info", 0);
	}
	else{
		this.init(urlCount, urlList, "info", 0);
	}
	this.getInfo(sKey, "utf-8");
};

var yicaiList_Obj = new yicaiList({
	sn: 0,
	//列表页获取信息出错页的网址信息，包括，下载出错、未能下载到内容，下载到内容了但解析不到标题信息
	//信息:网址、原因
	//页面类型:列表页
	//list_errList: [],
	//下载成功并正确解析到标题信息的列表页
	//list_okList: [],
	//待采列表页总数
	urlCount: 0,
	//待解析内容格式 默认格式html,text:文本,json
	parseType: "html",
	//解析规则,如果是html则用 cheerio，如果是text 则用 正则
	parseRuleList: [{
		main: ".newsStyleLine01 a"
	}, {
		main: ".videolist li div a"
	}]
});

module.exports = yicaiList_Obj;
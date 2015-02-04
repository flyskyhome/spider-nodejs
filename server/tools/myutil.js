var url = require('url');
/**
 * 通用工具
 * @type {Object}
 */

var myUtil = {
	extend: function(o, n, override) {
		for (var p in n)
			if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) o[p] = n[p];
		return o;
	},
	/**
	 * 获取对象在在所属对象列表中的位置
	 * @param  {Array} objList  所属对象列表
	 * @param  {string} sKey    关键属性
	 * @param  {object} sVal    属性值
	 * @return {int}            所在位置
	 */
	indexOfObj: function(objList, sKey, sVal) {
		var pos = -1;
			iCount = objList?objList.length:0;

		if(iCount==0 && !objList){
			console.log("indexOfObj iCount=0 start");
			console.log(objList);
			console.log("indexOfObj iCount=0 end");
		}
		//对象类型数组
		if (sKey) {
			for (var i = 0; i < iCount; i++) {
				if (objList[i][sKey] == sVal) {
					pos = i;
					break;
				}
			}
		}
		//值类型数组
		else {
			for (var i = 0; i < iCount; i++) {
				if (objList[i] == sVal) {
					pos = i;
					break;
				}
			}
		}
		return pos;
	},
	/**
	 * 根据关键key的值获取对象列表中的对象
	 * @param  {Array} objList  所属对象列表
	 * @param  {string} sKey    关键属性
	 * @param  {object} sVal    属性值
	 * @return {object}         对象
	 */
	getObj: function(objList, sKey, sVal) {
		var pos = this.indexOfObj(objList, sKey, sVal);
		return pos == -1 ? {} : objList[pos];
	},
    /**
     * 根据关键key的值从对象列表删除对象
     * @param  {Array} objList  所属对象列表
     * @param  {string} sKey    关键属性
     * @param  {object} sVal    属性值
     * @return {Array}         对象
     */
    delObj: function(objList, sKey, sVal) {
        var pos = this.indexOfObj(objList, sKey, sVal);
        (pos > -1) && objList.splice(pos, 1);
        return objList;
    },
	ltrim: function(s) {
		return s.replace(/^\s+/, "");
	},
	rtrim: function(s) {
		return s.replace(/\s+$/, "");
	},
	trim: function(s) {
		return this.ltrim(this.rtrim(s));
	},
	trimAll: function(s) {
		return s.replace(/\s/g, "");
	},
	/**
	 * 转换2012-01-01 之类的日期 为日期对象
	 * @param  {string} sDate 日期
	 * @param  {string} sSign 分隔符
	 * @return {object}       日期对象
	 */
	getDateObj: function(sDate, sSign) {
		if (sSign == undefined) {
			sSign = "-";
		}
		var dateInfoArray = sDate.split(sSign);
		if (dateInfoArray.length == 3) {
			var iYear = parseInt(dateInfoArray[0], 10);
			var iMonth = parseInt(dateInfoArray[1], 10) - 1;
			var iDay = parseInt(dateInfoArray[2], 10);
			var date = new Date(iYear, iMonth, iDay, 0, 0, 0);
			return date;
		} else {
			return 0;
		}
	},
	/**
	 * 格式化日期对象成 10位日期
	 * @param  {object} sDate 日期对象
	 * @param  {string} sSign 分隔符
	 * @return {string}       10位的日期字符串
	 */
	formatDate2String: function(dateObj, sSign) {
		if (dateObj == "") {
			return "";
		}
		if (sSign == undefined) {
			sSign = "-";
		}
		var sSysDate = "",
			sYear = dateObj.getFullYear(),
			sMonth = dateObj.getMonth() + 1,
			sDate = dateObj.getDate();
		if (sMonth.toString().length == 1) {
			sMonth = "0" + sMonth;
		}
		if (sDate.toString().length == 1) {
			sDate = "0" + sDate;
		}
		sSysDate = sYear + sSign + sMonth + sSign + sDate;
		return sSysDate;
	},
	/**
	 * 格式化日期对象成 8位时间
	 * @param  {object} sDate 日期对象
	 * @param  {string} sSign 分隔符
	 * @return {string}       8位的时间字符串
	 */
	formatTime2String: function(dateObj, sSign) {
		if (dateObj == "") {
			return "";
		}
		if (sSign == undefined) {
			sSign = ":";
		}
		var sSysTime = "",
			sHour = dateObj.getHours(),
			sMin = dateObj.getMinutes(),
			sSec = dateObj.getSeconds();
		sMSec = dateObj.getMilliseconds();
		if (sHour.toString().length == 1) {
			sHour = "0" + sHour;
		}
		if (sMin.toString().length == 1) {
			sMin = "0" + sMin;
		}
		if (sSec.toString().length == 1) {
			sSec = "0" + sSec;
		}
		sSysTime = sHour + sSign + sMin + sSign + sSec + "." + sMSec;
		return sSysTime;
	},
	/**
	 * 获取格式化后的日期信息 yyyy-mm-dd hh:mm:ss
	 * @param  {string} sDatetime 各种类型的日期信息：已处理格式下如 
	 *                            		2014-12-22 15:08:38
	 *									2014-12-22 16:00
     *									2014-12-22
	 *									2014年12月22日
	 *									2014年12月22日 10:07
	 *									2014年12月22日 11:25:19
	 *									2014年12月22日09:11
	 *									2014年 12月 22日 星期一 15:52 BJT
	 *									2014/12/22 16:03
	 *									2014/12/22&nbsp;&nbsp;10:30:16
	 *									2014-1-1 1:1:1
	 * @return {string}           yyyy-mm-dd hh:mm:ss 格式
	 */
	getFormatedDate:function(sDatetime){
		var sInfo=sDatetime.replace(/(\d{4})[^\d]*?(\d{1,2})[^\d]*?(\d{1,2})([^\d]*?)(\d{1,2})?(:(\d{1,2}))?(:(\d{1,2}))?[^\d]*$/,'$1-$2-$3 $5$6$8');								//检查冒号数量,补足位数
		var colonList=sInfo.match(/:/g);
		//如果存在冒号
		if(colonList){
			var colonCount=colonList.length;
			for(var i=0;i<2-colonCount;i++){
				sInfo+=':00';
			}
		}
		//如果没有冒号
		else{
			sInfo=myUtil.trim(sInfo)+" 00:00:00";
		}
		//处理格式化之后 还有类似 2014-1-1 1:1:1 的数据 begin
		sInfo=sInfo.replace(/(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})/,"$1-0$2-0$3 0$4:0$5:0$6");
		//处理三位数字成2位
		sInfo=sInfo.replace(/(\D)(\d{1})(\d{2})/g,'$1$3');
		/*
		var mList=sInfo.split(" ");
		if(mList.length>1){
			var
				sDate=mList[0],
				sTime=mList[1],
				dList=sDate.split("-"),
				tList=sTime.split(
			var a=dList.length;
			sInfo=dList[0];
			for(var i=1;i<a;i++){
				sInfo+="-"+(dList[i].length>2?dList[i][1]+dList[i][2]:dList[i]);
			}
			sInfo+=" "+(tList[0].length>2?tList[0][1]+tList[0][2]:tList[0]);
			a=tList.length;
			for(var i=1;i<a;i++){
				sInfo+=":"+(tList[i].length>2?tList[i][1]+tList[i][2]:tList[i]);
			}
		}
		*/
		return sInfo;
	},
	getNewUrl: function(urlObj, sUrl) {
		var sPre = this.getUrlPre(urlObj, sUrl),
			sResult = "";

		sResult = sPre + sUrl;
		return sResult;
	},
	/**
	 * 获取url前缀
	 * @param  {object} urlObj 采集页面的Url
	 * @param  {string} sUrl   采到信息的Url
	 * @return {string}        [description]
	 */
	getUrlPre: function(urlObj, sUrl) {
		var sResult = "";
		if (sUrl && sUrl.length > 0) {
			var tarUrlObj = url.parse(sUrl);
			//绝对路径
			if (tarUrlObj.host) {
				sResult = "";
			}
			//不存在host信息，相对路径
			else {
				var sFirst = sUrl.substring(0, 1);
				if (sFirst == "/") {
					sResult = urlObj.protocol + "//" + urlObj.host;
				} else {
					sResult = urlObj.href;
					sResult = sResult.replace(/^(.*\/)(.*?)$/, "$1");
				}
			}
		}

		return sResult;
	},
	/**
	 * 生成范围内随机数据
	 * @param  {[type]} min [description]
	 * @param  {[type]} max [description]
	 * @return {[type]}     [description]
	 */
	random: function(min, max) {
		return Math.floor(min + Math.random() * (max - min));
	},
}
module.exports = myUtil;
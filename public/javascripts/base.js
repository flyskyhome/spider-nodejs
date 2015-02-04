/**
 * 核心加载模块,输出一个imp函数到window全局，还有一个exp对象到全局
 * 这边有一个原则就是所有可以imp的内容均在exp对象中
 * @param  {object} win window对象
 * @author fgq
 */
(function(win, $) {
    /**
     * 判断是否是数组对象
     * @param  {[type]}  o) {return      Object.prototype.toString.call(o [description]
     * @return {Boolean}    [description]
     */
    function isArray(o) {
        return Object.prototype.toString.call(o) === '[object Array]';
    }
    /**
     * 引用接口
     * @param  {string|Array} sKey    需要引用对象的名称
     * @param  {string} isMerge 是否合并成一个对象，如果是则回出现同名函数替换情况
     * @return {object}      对象
     */
    win.imp = function(keyObj, isMerge) {
        isMerge = !isMerge ? true : isMerge;
        //如果是字符串
        if (typeof(keyObj) === "string") {
            return exp[keyObj] || {};
        }
        //如果是数组
        else if (isArray(keyObj)) {
            var obj = {},
                sKey = "",
                tmpObj;
            for (var key in keyObj) {
                sKey = keyObj[key];
                tmpObj = exp[keyObj[key]] || {};
                if (isMerge) {
                    $.extend(obj, tmpObj);
                } else {
                    obj[sKey] = tmpObj;
                }
            }
            return obj;
        }
        //如果非字符串也不是数组
        else {
            return {};
        }
    };

    /**
     * 模块js导出接口
     * @type {Object}
     */
    win.exp = {};

})(window, jQuery);

/**
 * 一般通用工具集,导出一个工具集对象到全局的 exp 对象中
 * @param  {Object} $ jQuery对象
 */
(function($) {
    var genTool = {
        /**
         * 生成Js的GUID
         * @return {string} guid字符串
         */
        guidGenerator: function() {
            var S4 = function() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        /**
         * 生成范围内随机数据
         * @param  {[type]} min [description]
         * @param  {[type]} max [description]
         * @return {[type]}     [description]
         */
        random:function(min,max){
            return Math.floor(min+Math.random()*(max-min));
        },
        /**
         * 获取请求参数
         * @param {[type]} name 请求名称
         */
        getUrlParam: function(sReq) {
            /*var sInfo = "",
                reg = new RegExp("(^|&)" + sReq + "=([^&]*)(&|$)", "i"),
                r = location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
            */
            var params = Ext.urlDecode(location.search.substring(1));
            return sReq ? params[sReq] : params;
        },
        /**
         * 数组转树
         * @param  {[type]} key       子节点名称
         * @param  {[type]} parentKey 父节点名称
         * @param  {[type]} childKey  待生成子节点名称
         * @param  {[type]} arrayObj  数值对象
         * @param  {object} leafExtendAttr  叶子节点扩展属性
         * @return {[type]}           [description]
         */
        array2Tree: function(key, parentKey, childKey, arrayObj) {
            var i, l;
            if (!key || key == "" || !arrayObj) return [];
            if ($.isArray(arrayObj)) {
                var r = [];
                var tmpMap = [];
                for (i = 0, l = arrayObj.length; i < l; i++) {
                    tmpMap[arrayObj[i][key]] = arrayObj[i];
                }
                for (i = 0, l = arrayObj.length; i < l; i++) {
                    if (tmpMap[arrayObj[i][parentKey]] && arrayObj[i][key] != arrayObj[i][parentKey]) {
                        if (!tmpMap[arrayObj[i][parentKey]][childKey]) tmpMap[arrayObj[i][parentKey]][childKey] = [];
                        tmpMap[arrayObj[i][parentKey]][childKey].push(arrayObj[i]);
                    } else {
                        r.push(arrayObj[i]);
                    }
                }
                return r;
            } else {
                return [arrayObj];
            }
        },
        /**
         * 树转数组
         * @param  {string} childListKey    子节点列表的标示
         * @param  {Object} treeObj         树对象
         * @param  {string} childKey        节点Key
         * @param  {string} parentKey       父节点Key
         * @param  {string} parentKeyVal    父节点值,在需要自己创建父子节点关系时用
         * @return {Array}                  对象数组列表
         */
        tree2Array: function(childListKey, treeObj, key, parentKey, parentKeyVal) {
            if (!treeObj) return [];

            //判断是否是数组形式进来的，如果不是，改造成数组形式
            if (!$.isArray(treeObj)) {
                var oList = [];
                oList.push(treeObj);
                treeObj = oList;
            }

            var r = [],
                sParentKeyVal = parentKeyVal == undefined ? "" : parentKeyVal,
                sPKey = "";
            //如果预设数据中已经存在code,parentCode之类代表父子关系的属性，则不需要传，或者转成数组后不再需要转回成树形也可不传
            if (!(key && parentKey)) {
                for (var i = 0, l = treeObj.length; i < l; i++) {
                    if (treeObj[i][childListKey]) {
                        var childObj = treeObj[i][childListKey];
                        delete treeObj[i][childListKey];
                        r.push(treeObj[i]);
                        r = r.concat(this.tree2Array(childListKey, childObj));
                    } else {
                        r.push(treeObj[i]);
                    }
                }
            } else {
                for (var i = 0, l = treeObj.length; i < l; i++) {
                    treeObj[i][parentKey] = sParentKeyVal;
                    sPKey = !treeObj[i][key] ? sParentKeyVal + "_" + i : treeObj[i][key];
                    treeObj[i][key] = sPKey;
                    if (treeObj[i][childListKey]) {
                        var childObj = treeObj[i][childListKey];
                        delete treeObj[i][childListKey];
                        r.push(treeObj[i]);
                        r = r.concat(this.tree2Array(childListKey, childObj, key, parentKey, sPKey));
                    } else {
                        r.push(treeObj[i]);
                    }
                }
            }
            return r;
        },
        /**
         * 获取对象在在所属对象列表中的位置
         * @param  {Array} objList  所属对象列表
         * @param  {string} sKey    关键属性
         * @param  {object} sVal    属性值
         * @return {int}            所在位置
         */
        indexOfObj: function(objList, sKey, sVal) {
            var pos = -1,
                iCount = objList.length;
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
        /**
         * 从对象列表中获取指定属性值的列表
         * @param  {Array} objList  对象列表
         * @param  {string} sKey    待获取的属性标记
         * @return {Array}          属性值列表
         */
        getKeyValueList: function(objList, sKey) {
            var iCount = objList.length,
                attrList = [],
                keyList = sKey.split("."),
                keyCount = keyList.length,
                tmpObj;
            for (var i = 0; i < iCount; i++) {
                tmpObj = objList[i];
                for (var j = 0; j < keyCount; j++) {
                    tmpObj = tmpObj[keyList[j]];
                }
                attrList.push(tmpObj);
            }
            return attrList;
        },
        /**
         * 获取对象标示值
         * @param  {Array} objList      对象列表 来自EXT控件的Store中的数据项 domCorp.getStore().data.items
         * @param  {string} sVal        待查找对象的属性值
         * @param  {string} sSignAttr   能代表对象的属性标识，如Code
         * @param  {Array} attrList     待查找对象属性列表
         * @return {string}             对象关键属性的值
         */
        getObjCode: function(objList, sVal, sSignAttr, attrList) {
            var sResult = "",
                iCount = objList.length,
                iAttrCount = attrList.length,
                tmpObj;
            for (var i = 0; i < iCount; i++) {
                tmpObj = objList[i].data;
                for (var j = 0; j < iAttrCount; j++) {
                    if (tmpObj[attrList[j]] == sVal) {
                        sResult = tmpObj[sSignAttr];
                        break;
                    }
                }
            }
            return sResult;
        },
        /**
         * 格式化浮点数
         * @param  {string}  sValue        [description]
         * @param  {int}  iPrecision    小数点保留位数
         * @param  {Boolean} hasThousandth 是否支持千分位
         * @return {string}
         */
        floatFormat: function(sValue, iPrecision, hasThousandth) {
            if (!sValue) return sValue;

            sValue = sValue.toString().replace(/\$|\,/g, '');

            if (isNaN(sValue)) {
                return sValue;
            }

            //处理小数点位数
            var fValue = parseFloat(sValue);
            fValue = fValue.toFixed(iPrecision);
            if (hasThousandth == true) {
                //处理千分位
                var reg = /(\d{1,3})(?=(\d{3})+(?:$|\D))/g;
                var newValue = fValue.toString().replace(reg, "$1,");
                //处理小数点后被替换成千分位的样式
                var vList = newValue.split(".");
                if (vList.length == 2) {
                    newValue = vList[0] + "." + vList[1].replace(/\,/g, "");
                }
            } else {
                newValue = fValue;
            }
            return newValue;
        },
        /**
         * 通过函数名或字符串获取函数对象
         * @param  {string|object} funcName 函数对象名称
         * @return {object}                 函数对象
         */
        getFunObj: function(funcName) {
            var result;
            //如果本身就是一个函数 ，则直接返回
            if (jQuery.type(funcName) === 'function') {
                result = funcName;
            } else if (jQuery.type(funcName) === 'string' && jQuery.type(eval(funcName)) === 'function') {
                result = eval(funcName);
            }

            return result;
        },
        /**
         * 从日期字符串中获取年份信息
         * @param  {[type]} sDate [description]
         * @param  {[type]} sMark [description]
         * @return {[type]}       [description]
         */
        getYear4Date: function(sDate, sMark) {
            sMark == !sMark ? "-" : sMark;
            return sDate.split(sMark)[0]
        },
        /**
         * 转换2012-01-01 之类的日期为 时间片Ticks,如果串不太对，则返回0
         * @param  {string} sDate 日期字符串
         * @param  {string} sSign 分割标识符
         * @return {number}       [description]
         */
        getDateTicks: function(sDate, sSign) {
            if (!sSign) {
                sSign = "-";
            }
            var dateInfoArray = sDate.split(sSign);

            if (dateInfoArray.length == 3) {
                var iYear = parseInt(dateInfoArray[0], 10);
                var iMonth = parseInt(dateInfoArray[1], 10) - 1;
                var iDay = parseInt(dateInfoArray[2], 10);

                var date = new Date(iYear, iMonth, iDay, 16, 59, 59);

                return date.getTime();
            } else {
                return 0;
            }
        },
        /**
         * 转换2012-01-01 之类的日期 为日期对象 如果串不太对，则返回0
         * @param  {string} sDate 日期串
         * @param  {string} sSign 标识符
         * @return {Object}       日期对象
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
         * 格式化日期对象成 10位日期,如果串不太对，则返回""
         * @param  {Object} dateObj 日期对象
         * @return {string}       日期字符串
         */
        formatDate2String: function(dateObj, sSign) {
            if(dateObj==""){
                return ""
            }
            else{
                if (!sSign) {
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
            }
        },

        /**
         * 格式化日期对象成 8位时间,格式不对返回""
         * @param  {object} dateObj 日期对象
         * @param  {string} showMillSec 是否显示毫秒
         * @param  {string} sSign 分隔符
         * @return {string}       时间串
         */
        formatTime2String: function(dateObj, showMillSec, sSign) {
            if (!sSign) {
                sSign = ":";
            }
            var sTime = "",
                sHour = dateObj.getHours(),
                sMin = dateObj.getMinutes(),
                sSec = dateObj.getSeconds(),
                sMill = dateObj.getMilliseconds();
            if (sHour.toString().length == 1) {
                sHour = "0" + sHour;
            }
            if (sMin.toString().length == 1) {
                sMin = "0" + sMin;
            }
            if (sSec.toString().length == 1) {
                sSec = "0" + sSec;
            }
            sTime = sHour + sSign + sMin + sSign + sSec;

            if (showMillSec) {
                sTime += sSign + sMill;
            }
            return sTime;
        },
        leftTrim: function(s) {
            return s.replace(/^\s+/, "");
        },
        rightTrim: function(s) {
            return s.replace(/\s+$/, "");
        },
        trim: function(s) {
            return this.leftTrim(this.rightTrim(s));
        },
        //获取最大值
        getMaxVal: function(dataList) {
            return Math.max.apply(null, dataList);
        },
        //获取最小值
        getMinVal: function(dataList) {
            return Math.min.apply(null, dataList);
        },
        getBrowerInfo:function (){
            var isIE=$.browser.msie;
            var isWebkit=$.browser.webkit;
            var isSafari=$.browser.safari;
            var isMozilla=$.browser.mozilla;
            var isOpera=$.browser.opera;

            var sVersion=$.browser.version;
            //ie
            if (isIE==true)
            {
                return {bName:"ie",ver:sVersion}
            }
            //firefox
            else if (isMozilla==true)
            {
                return {bName:"ff",ver:sVersion}
            }
            //google chrome
            else if (isWebkit==true && isSafari==true)
            {
                return {bName:"gc",ver:sVersion}
            }
            //opera
            else if (isOpera==true)
            {
                return {bName:"op",ver:sVersion}
            }
            //苹果 safari
            else if (isSafari==true)
            {
                return {bName:"sf",ver:sVersion}
            }
            else{
                return {bName:"",ver:""}
            }
        },
        setPageTitle:function(sTitle){
            document.title=sTitle;
        }
    };

    exp.genTools = genTool;
})(jQuery);


/**
 * 数据工具
 * @param  {Object} $ jQuery对象
 */
(function($) {
    var dataTools = {
            SendAjaxReq4Json: function(sSendUrl, paramObj, sucessFunc, errorFunc, sType, isAsync, isCache) {
                if (sType != "get" && sType != "post") {
                    sType = "get";
                }
                if (isCache) {
                    isCache = true;
                }
                else{
                    isCache = false;
                }
                if (isAsync != false) {
                    isAsync = true;
                }
                $.ajax({
                    type: sType,
                    url: sSendUrl,
                    dataType: "json",
                    cache: isCache,
                    ifModified: false,
                    async: isAsync,
                    data: paramObj,
                    beforeSend: function() {},
                    success: function(msg) {
                        sucessFunc(msg);
                        msg = null;
                    },
                    error: function(errorMsg) {
                        errorFunc(errorMsg);
                        errorMsg = null;
                    }
                });
                paramObj = null;
            }
    };

    exp.dataTools = dataTools;
})(jQuery);

/**
 * zTree树助手
 * @param  {[type]} Ext [description]
 * @return {[type]}     [description]
 */
(function($){
    var ztreeHelper = {
        initTree:function(sTreeId,setting,objList){
            $.fn.zTree.init($("#"+sTreeId), setting, objList);
        },
        //析构树对象
        destoryTree:function(sTreeId){
            if(sTreeId){
                $.fn.zTree.destroy(sTreeId);
            }
            else{
                $.fn.zTree.destroy();
            }
            return this;
        },
        getTreeObj:function(sTreeId){
            return $.fn.zTree.getZTreeObj(sTreeId);
        }
    };

    exp.ztreeHelper=ztreeHelper;
})(jQuery);

(function(win,$){
    //如果浏览器是ie的，目前发现ie11 会被判断成 ff 则重写open方法，其它浏览器如碰到问题再具体分析
    if(exp.genTools.getBrowerInfo().bName=="ie" || exp.genTools.getBrowerInfo().bName=="ff"){

        var myOpen=myOpen || win.open,
            sWidth="width="+screen.availWidth,
            sHeight="height="+screen.availHeight;
        win.open=function(sURL,sName,sFeatures,bReplace){
            sName=sName||"_blank";
            sFeatures=sFeatures||"fullscreen=0,directories=0,location=0,menubar=0,toolbar=0,resizable=1,status=1,top=0,left=0,"+sWidth+","+sHeight;
            bReplace=bReplace||false;
            myOpen(sURL,sName,sFeatures,bReplace);
        }
    }
})(window,jQuery);
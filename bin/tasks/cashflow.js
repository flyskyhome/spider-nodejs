var cashflow=require("../../server/model/www.cninfo.com.cn/cashflow.js");
var t = require("../../server/tools/t.js");
var log = t.log;

log("现金流量表抓取开始……");
cashflow.exec();
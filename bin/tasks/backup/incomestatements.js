var incomestatements=require("../../server/model/www.cninfo.com.cn/incomestatements.js");
var t = require("../../server/tools/t.js");
var log = t.log;

log("大陆利润表抓取开始……");
incomestatements.exec();
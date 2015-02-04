var balancesheet=require("../../server/model/www.cninfo.com.cn/balancesheet.js");
var t = require("../../server/tools/t.js");
var log = t.log;

log("大陆资产负债表抓取开始……");
balancesheet.exec();
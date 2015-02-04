var market=require("../../server/model/www.cninfo.com.cn/market.js");
var t = require("../../server/tools/t.js");
var log = t.log;

log("市场分类信息抓取开始……");
market.exec();
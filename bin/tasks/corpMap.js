var corpMap=require("../../server/model/www.cninfo.com.cn/corpMap.js");
var t = require("../../server/tools/t.js");
var log = t.log;

log("市场分类信息抓取开始……");
corpMap.exec();
var management=require("../../server/model/www.cninfo.com.cn/management.js");
var t = require("../../server/tools/t.js");
var log = t.log;

log("企业高管信息抓取开始……");
management.exec();
var brief_shsz=require("../../server/model/www.cninfo.com.cn/brief_shsz.js");
var t = require("../../server/tools/t.js");
var log = t.log;

log("企业基础信息抓取开始……");
brief_shsz.exec();
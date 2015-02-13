var corpMap=require("../../../server/model/www.cninfo.com.cn/corpmap.js");
var t = require("../../../server/tools/t.js");
var log = t.log;

log("市场分类信息抓取开始……");
corpMap.exec(function(obj,res){
	console.log(res);
});
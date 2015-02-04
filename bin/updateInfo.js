var dbobj = require("../server/tools/db.js");
var db = new dbobj("flyskyhome");

db.init("siteInfo_cateConfig");

db.find({site:/\S+/}, {site:1,name:1,_id:0}, function(objList) {
	//console.log(objList);
	objList = objList || [];
	//console.log(objList);

	db.init("siteInfo_config");
	var iCount=objList.length,
		obj,
		sName="",
		sSite="";
	for(var i=0;i<iCount;i++){
		obj=objList[i];
		sName=obj.name;
		sSite=obj.site;
		console.log(obj);
		//person.update({“name”:”jobs”}, {$set{“age”:33}}, {multi:true}, callback(err))
		db.update({"site":sSite},{siteName:sName});
	}
});
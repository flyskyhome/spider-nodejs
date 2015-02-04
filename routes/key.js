var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var page = require("../server/tools/page.js");
var myUtil = require("../server/tools/myutil.js");
var dbobj = require("../server/tools/db.js");
var db = new dbobj("flyskyhome");

/* GET users listing. */
router.post('/', function(req, res) {
	var sType = req.body.type;

	switch (sType) {
		case "set":
			//关键字文件下载链接
			var downLoadUrl = req.body.downurl;
			//关键字列表
			var keyList = req.body.keyList;
			//对于增量关键字而言 add:新增,del:删除
			var operType = req.body.operType;

			setKeyList(downLoadUrl, keyList, operType);

			break;
	}

	function setKeyList(downUrl, keyList) {
		var sFileName = __dirname + "/../server/data/keyList.js";
		//如果是新增关键字列表
		if (downUrl) {
			var urlObj = url.parse(downUrl);

			page.download(urlObj, "utf-8", function(sHtml) {
				if (sHtml == null || sHtml.indexOf("<h1>404</h1>") > 0) {
					return res.json({
						stat: "err",
						msg: "文件下载失败!"
					});
				} else {
					fs.exists(sFileName, function(isExist) {
						//var sNewKeyInfo = sHtml.replace(/(\S+)/g, '"$1",');
						sHtml=sHtml+"\r\n";
						var sNewKeyInfo = sHtml.replace(/(.*?)\r\n/g, '"$1",');
						sNewKeyInfo = "var keyList=[" + sNewKeyInfo.substring(0, sNewKeyInfo.length - 1) + "];module.exports = keyList;";

						fs.writeFile(sFileName, sNewKeyInfo, function(err) {
							if (err) {
								return res.json({
									stat: "ok",
									msg: "文件保存失败:" + err.message
								});
								throw err;
							}

							return res.json({
								stat: "ok",
								msg: "文件保存成功!"
							});
						});
					});
				}
			});

		} else {
			var sNewInfo = "",
				iCount = keyList.length;
			//生成新的关键字信息,并保留逗号
			var sNewKeyInfo = "";

			//如果有新的数据进来则更新信息
			if (iCount > 0) {
				//按道理无需判断文件是否存在，为保险起见
				fs.exists(sFileName, function(isExist) {
					//如果已存在文件信息
					if (isExist) {
						fs.readFile(sFileName, {
							encoding: "utf8"
						}, function(err, data) {
							if (err) throw err;
							//去除原来的变定义信息
							var keyInfo = data.replace("var keyList=[", "").replace("];module.exports = keyList;", "");
							var sTestKeyInfo = keyInfo + ",";
							var sTmpKeyInfo = "";
							if (operType == "del") {
								//循环生成新的关键字信息，直接替换关键字信息
								for (var i = 0; i < iCount; i++) {
									sTmpKeyInfo = '"' + keyList[i] + '",';
									sTestKeyInfo = sTestKeyInfo.replace(sTmpKeyInfo, "");
								}
								sTestKeyInfo = sTestKeyInfo.substring(0, sTestKeyInfo.length-1);
								//重新组合新的变量信息
								sNewKeyInfo = "var keyList=[" + sTestKeyInfo + "];module.exports = keyList;";
							}
							//否则认为是新增
							else {
								//循环生成新的关键字信息，并且判断如果已经存在于原有信息中则不添加
								for (var i = 0; i < iCount; i++) {
									sTmpKeyInfo = '"' + keyList[i] + '",';
									if (sTestKeyInfo.indexOf(sTmpKeyInfo) < 0) {
										sNewKeyInfo += sTmpKeyInfo;
									}
								}

								//重新组合新的变量信息
								sNewKeyInfo = "var keyList=[" + sNewKeyInfo + keyInfo + "];module.exports = keyList;";
							}
							sTestKeyInfo = "";
							sTmpKeyInfo = "";
							fs.writeFile(sFileName, sNewKeyInfo, function(err) {
								if (err) {
									return res.json({
										stat: "ok",
										msg: "文件保存失败:" + err.message
									});
									throw err;
								}

								sNewKeyInfo = "";
								keyInfo = "";
								return res.json({
									stat: "ok",
									msg: "文件保存成功!"
								});
							});
						});
					}
					//还未存在关键字信息
					else {
						if (operType == "del") {
							return res.json({
								stat: "ok",
								msg: "无数据可删除!"
							});
						} else {
							sNewKeyInfo = sNewKeyInfo.substring(0, sNewKeyInfo.length - 1);
							sNewKeyInfo = "var keyList=[" + sNewKeyInfo + "];module.exports = keyList;";
							fs.writeFile(sFileName, sNewKeyInfo, function(err) {
								if (err) {
									return res.json({
										stat: "ok",
										msg: "文件保存失败:" + err.message
									});
									throw err;
								}

								return res.json({
									stat: "ok",
									msg: "文件保存成功!"
								});
							});
						}
					}
				});
			}
		}
	}
});
module.exports = router;
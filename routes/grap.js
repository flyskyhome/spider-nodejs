var express = require('express');
var router = express.Router();
var url = require('url');
var fs = require('fs');
var myUtil = require("../server/tools/myutil.js");
var grapService= require("../server/service/grapService.js");

/* GET users listing. */
router.get('/', function(req, res) {
	res.send('respond with a resource');
});

/* GET users listing. */
router.post('/', function(req, res) {
	grapService.exec(req.body.urlList);

	//console.log(modelObjList);
	res.json({
		stat: "ok"
	});
});

module.exports = router;
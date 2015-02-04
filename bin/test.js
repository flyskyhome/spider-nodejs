var page = require("../server/tools/page.js");
var url=require("url");

var urlObj = url.parse("http://apply.hzcb.gov.cn/apply/app/status/norm/person");

				page.download(urlObj, "utf-8", function(sHtml, configObj) {
					//如果sHtml不为null
					if (sHtml) {
						//详细页链接信息
						console.log(sHtml);
					}
					else{

					}

				}, {});
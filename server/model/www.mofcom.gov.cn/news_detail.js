var genDetail=require("../general/news_detail.js");

/**
 * 中国商务部
 * @type {Object}
 */
function mofcom_Detail(dataStore){
	this.dataStore=dataStore;
	this.dataStore.defaultRule={
			//清理规则
			//获取干净的图片链接
			clear:[
				{
					s:/<[iI][mM][gG]\s+.*?[sS][rR][cC]\s*=\s*(?:(?:"([^"]*?)")|(?:\'([^\']*?)\')|([^\'">\s]+)).*?>/g,
					t:"<img src='$1$2$3'>"
				},
				//清理脚本信息
				{
					s:/<[sS][cC][rR][iI][pP][tT][^>]*?>.*?<\/[sS][cC][rR][iI][pP][tT]>/g,
					t:""
				},
				//清理样式信息
				{
					s:/<[sS][tT][yY][lL][eE][^>]*?>.*?<\/[sS][tT][yY][lL][eE]>/g,
					t:""
				},
				//清除注释信息
				{
					s:/<!--.*?-->/g,
					t:""
				},
				/*
				//清理超链
				{
					s:/<[aA]\s+.*?[hH][rR][eE][fF]\s*=\s*(?:(?:"([^"]*?)")|(?:'([^']*?)')|([^'">\s]+)).*?>\s*(.*?)\s*<\/[aA]>/g,
					t:""
				}
				,*/
				//替换掉所有非p、br、img的信息
				{
					s:/<([^pPbBiI]|[Bb](?![rR])|[iI](?![mM]))[^>]*?>/g,
					t:""
				}
			]
		};
}

mofcom_Detail.prototype=new genDetail();

	/**
	 * 对外开放的执行接口
	 * @param  {[type]} sUrl      详细页地址
	 * @param  {[type]} urlConfig [description]
	 * @param  {[type]} sChartSet 详细页的字符集
	 * @param  {[type]} sTablePre 存放数据表的前缀信息
	 * @param  {[type]} okUrlList  成功解析的列表页链接信息列表
	 * @return {[type]}           [description]
	 */
	mofcom_Detail.prototype.exec= function(sUrl, urlConfig, sChartSet, sTablePre, listStore) {
		//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
		this.doWork(sUrl, urlConfig, sChartSet, sTablePre, listStore);
	};

var mofcom_Detail_Obj=new mofcom_Detail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: "#artitle"
			}],
			//作者
			author:[],
			//日期
			datetime: [{
				d: "script",
				di:4,
				r:/var tm = "(.*?)";/
			}],
			//数据来源
			src: [{
				d: "script",
				di:4,
				r:/var source = "(.*?)";/
			}],
			//文本内容
			content: [{
				d: ".artCon"
			},{
				d:".content1"
			}],
			summary: []
		},
		clearRule:[{
			s:/<script>.*?<\/script>/,
			t:""
		}]
	});

module.exports = mofcom_Detail_Obj;
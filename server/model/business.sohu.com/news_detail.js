var genDetail=require("../general/news_detail.js");

/**
 * 搜狐财经
 * @type {Object}
 */

function sohuBusinessDetail(dataStore){
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

sohuBusinessDetail.prototype=new genDetail();

/**
 * 对外开放的执行接口
 * @param  {[type]} sUrl      详细页地址
 * @param  {[type]} urlConfig [description]
 * @param  {[type]} sChartSet 详细页的字符集
 * @param  {[type]} sTablePre 存放数据表的前缀信息
 * @param  {[type]} okUrlList  成功解析的列表页链接信息列表
 * @return {[type]}           [description]
 */
sohuBusinessDetail.prototype.exec=function(sUrl, urlConfig, sChartSet, sTablePre, listStore) {
	//dom规则和正则规则允许同时配置，同时配置时先取dom在在之内获取正则匹配信息
	this.doWork(sUrl, urlConfig, sChartSet, sTablePre, listStore);
};

var sohuBusinessDetail_Obj=new sohuBusinessDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".content-box h1"
			}],
			//作者
			author:[{
				d: "#author_baidu",
				r: /作者：(\S+)/
			},
			{
				d: "#contentText",
				r: /作者：(.*?)</
			}],
			//日期
			datetime: [{
				d: ".time-source .time"
			},{
				d: ".tit .timt"
			}],
			//数据来源
			src: [{
				d: "#media_span span"
			},{
				d: ".tit .from a"
			}],
			//文本内容
			content: [{
				d: "#contentText"
			},{
				d: "#contentE .explain"
			}],
			summary: []
		},
		clearRule:[]
	});

module.exports = sohuBusinessDetail_Obj;
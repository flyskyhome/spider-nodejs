var genDetail=require("../general/news_detail.js");
/**
 * 全景网
 * @type {Object}
 */
function jrjFinanceDetail(dataStore){
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

jrjFinanceDetail.prototype=new genDetail();

	/**
	 * 对外开放的执行接口
	 * @param  {[type]} sUrl      详细页地址
	 * @param  {[type]} urlConfig [description]
	 * @param  {[type]} sChartSet 详细页的字符集
	 * @param  {[type]} sTablePre 存放数据表的前缀信息
	 * @param  {[type]} okUrlList  成功解析的列表页链接信息列表
	 * @return {[type]}           [description]
	 */
	jrjFinanceDetail.prototype.exec=function(sUrl, urlConfig, sChartSet, sTablePre, listStore) {
		this.doWork(sUrl, urlConfig, sChartSet, sTablePre, listStore);
	};

var jrjFinanceDetail_Obj=new jrjFinanceDetail({
		sn: 0,
		//解析规则
		parseRule:{
			//标题
			title: [{
				//dom规则
				d: ".text-col h1",
				r:/title_start-->(.*?)</
			}],
			//作者
			author:[{
				d:"#author_baidu",
				r:/-->(.*?)</
			}],
			//日期
			datetime: [{
				d: ".text-col #pubtime_baidu",
				r: /\d{4}-\d{2}-\d{2} \d{2}:\d{2}/
			}],
			//数据来源
			src: [{
				d:"#source_baidu a"
			},{
				d:"#source_baidu",
				r:/source_start-->(.*?)</
			}],
			//文本内容
			content: [{
				d: ".textmain"
			}],
			summary: []
		},
		clearRule:[{
			s:/<div class="textimg text-n1">.*?<\/div><\/div>/,
			t:""
		}]
	});

module.exports = jrjFinanceDetail_Obj;
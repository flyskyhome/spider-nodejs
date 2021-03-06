//存储清理规则
var defaultRuleObj = {
	//清理规则
	//获取干净的图片链接
	clear: [{
			s: /<[iI][mM][gG]\s+.*?[sS][rR][cC]\s*=\s*(?:(?:"([^"]*?)")|(?:\'([^\']*?)\')|([^\'">\s]+)).*?>/g,
			t: "<img src='$1$2$3'>"
		},
		//清理脚本信息
		{
			s: /<[sS][cC][rR][iI][pP][tT][^>]*?>.*?<\/[sS][cC][rR][iI][pP][tT]>/g,
			t: ""
		},
		//清理样式信息
		{
			s: /<[sS][tT][yY][lL][eE][^>]*?>.*?<\/[sS][tT][yY][lL][eE]>/g,
			t: ""
		},
		//清除注释信息
		{
			s: /<!--.*?-->/g,
			t: ""
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
			s: /<([^pPbBiI]|[Bb](?![rR])|[iI](?![mM]))[^>]*?>/g,
			t: ""
		}
	]
};
module.exports = defaultRuleObj;
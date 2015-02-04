/**
 * 表辅助工具
 * @type {Object}
 */
var tbHelper = {
	colName_01: "abcdefghijklmnopqrstuvwxyz",
	colName_02: "0123456789",
	//字段代码和标题映射信息
	//tbcode,code,name
	colMapInfo: {},
	getNewColCode: function(sTbCode) {
		var colMapList=this.colMapInfo[sTbCode];
		colMapList=colMapList||[];
		var iCount = colMapList.length,
			lastObj,
			sLastColCode = "",
			s0 = s1 = "",
			p0 = p1 = 0;
		if (iCount == 0) {
			return "a0";
		} else {
			lastObj = colMapList[colMapList.length - 1];
			sLastColCode = lastObj.code;
			s0 = sLastColCode[0];
			s1 = sLastColCode[1];
			p0 = this.colName_01.indexOf(s0);
			p1 = this.colName_02.indexOf(s1);

			if (p1 == 9) {
				p0 = p0 + 1;
				p1 = 0;
			} else {
				p1 = p1 + 1;
			}
			return this.colName_01[p0] + this.colName_02[p1];
		}
	}
};

module.exports = tbHelper;
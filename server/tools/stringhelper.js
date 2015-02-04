/**
 * 字符串处理工具
 * @type {Object}
 */
var StringHelper = {
	/**
	 * 获取两个字符串的相识度
	 * @param  {string} str01 [description]
	 * @param  {string} str02 [description]
	 * @return {number}       [description]
	 */
	getSimilarity: function(str01, str02) {
		var d = 0,
			l = 0;

		d = this.getNotSame(str01, str02);
		l = str01.length;

		if (l < str02.length) {
			l = str02.length;
		}

		if (l == 0) {
			l = 1;
		}

		return 1 - d / l;
	},
	/**
	 * 以字符串1为基准找出不同的字符个数
	 * @param {string} str01 [description]
	 * @param {string} str02 [description]
	 * @return {number}      [description]
	 */
	getNotSame: function(str01, str02) {
		var d = [],
			n = 0,
			m = 0,
			i = 0,
			j = 0,
			s_i = '',
			t_j = '',
			cost = 0,
			result = 0;

		n = str01.length;
		m = str02.length;
		if (n == 0) {
			result = m;
		}
		else if (m == 0) {
			result = n;
		}
		else {
			for (var i = 0; i <= n; i++) {
				d[i] = [];
			}
			console.log(d);
			for (var i = 0; i <= n; i++) {
				d[i].push(i);
			}
			console.log(d);
			for (var j = 1; j <= m; j++) {
				d[0].push(j);
			}
			console.log(d);
			for (var i = 1; i <= n; i++) {
				s_i = str01[i];
				for (var j = 1; j <= m; j++) {
					t_j = str02[j];
					if (s_i == t_j) {
						cost = 0;
					} else {
						cost = 1;
					}
					console.log("i:"+i+",j:"+j);
					console.log(d[i - 1][j]+","+d[i][j - 1]+","+d[i - 1][j - 1]+","+cost);
					d[i][j] = this.Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
				}
			}
			console.log(d);
			result = d[n][m];
		}

		return result;
	},
	/**
	 * 获取三个数字中的最小值
	 * @param {number} a 数值a
	 * @param {number} b 数值b
	 * @param {number} c 数值c
	 */
	Minimum: function(a, b, c) {
		var result = a;

		if (b < result) {
			result = b;
		}
		if (c < result) {
			result = c;
		}
		return result;
	}
}

module.exports = StringHelper;
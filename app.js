(function () {
	'use strict';
	const fs = require('fs');	// fs:FileSystem ファイルを使うためのモジュール
	const readline = require('readline');	// ファイルを一行ずつ読むためのモジュール
	const rs = fs.ReadStream('./popu-pref.csv');	// ファイルを読み込むStreamを作成
	const rl = readline.createInterface({ 'input': rs, 'output': {} });	// inputに設定
	const map = new Map();	// key: 都道府県、value: 集計データのオブジェクト
	rl.on('line', (lineString) => {
		const columns = lineString.split(',');	// 配列
		const year = parseInt(columns[0]);		// 集計年
		const prefecture = columns[2];			// 都道府県
		const sex = columns[3];					// 性別
		const popu = parseInt(columns[7]);		// 人口
		if (year === 2010 || year === 2015) {
			let value = map.get(prefecture);
			if (!value) {
				value = {
					p10: 0,
					p15: 0,
					change: null
				};
			}
			if (year === 2010) {
				value.p10 += popu;
			} else if (year == 2015) {
				value.p15 += popu;
			}
			map.set(prefecture, value);
		}
	});
	rl.resume();
	rl.on('close', () => {
		for (let pair of map) {
			const value = pair[1];
				// pair[0]:key 都道府県、pair[1]:value 集計オブジェクト
				// pair[0]: 北海道
				// pair[1]: { p10: 258530, p15: 236840, change: null }
			value.change = value.p15 / value.p10;
		}
		const rankingArray = Array.from(map).sort( (p1, p2) => {
			return p2[1].change - p1[1].change;
		});
		const rankingString = rankingArray.map( (p) => {
			return p[0] + ': ' + p[1].p10 + '=>' + p[1].p15 + ' 変化率:' + p[1].change;
		});
		console.log(rankingString);
	});
})();
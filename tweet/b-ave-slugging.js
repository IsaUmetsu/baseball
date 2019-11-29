"use strict";

/**
 * Twitter 文字数制限を満たす範囲で順位を作成
 *
 * 基本的に書くツイートに以下の内容を持つ
 *   header: タイトル
 *   content: 順位・選手名・球団 打率 打数・安打数
 *   footer: ハッシュタグ
 *
 * 同率順位について複数ツイートにまたがる場合は header は省略
 */

const argv = require('./average/yargs').argv;

const { averageSluggingByBat } = require("../query");
const { isValidBat } = require("./util");
const getAndTweetAverage = require("./average/b-ave");

const tweet = argv.tweet > 0;
const basePA = { 1: 100, 2: 100, 3: 100, 4: 95, 5: 30, 6: 5, 7: 1 };

// validated
if (!isValidBat(argv.bat, Object.keys(basePA))) process.exit();
// set bat
const bat = argv.bat;

/**
 * header
 */
const header = `2019年 第${bat}打席 長打率ランキング\n※該当打席数が${basePA[bat]}以上の打者のみ 打数-塁打数\n\n`;

/**
 * Execute
 */
(async () => {
  await getAndTweetAverage(averageSluggingByBat(bat, basePA[bat]), tweet, header)
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();

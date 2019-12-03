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
const argv = require("./average/yargs").batter.argv;

const { averageOpsBat } = require("../query");
const { isValidBat, round } = require("./util");
const { executeWithCb } = require("./average/b-ave");

const tweet = argv.tweet > 0;
const basePA = { 1: 100, 2: 80, 3: 80, 4: 70, 5: 35 };

// validated
if (!isValidBat(argv.bat, Object.keys(basePA))) process.exit();
// set bat
const bat = argv.bat;

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 第${bat}打席 OPSランキング\n※該当打席数が${basePA[bat]}以上の打者のみ\n\n`;

/**
 * 
 * @param {object} result DB1レコード
 * @return {string}
 */
const createRow = result => {
  let { name, team, rate_sum, rate, onbase, slugging, rank } = result;

  // create display info
  rate = round(rate, 4);
  onbase = String(round(onbase, 3)).slice(1);
  slugging = String(round(slugging, 3)).slice(1);
  return `${rank}位: ${name}(${team}) ${rate} (出${onbase}, 長${slugging})\n`;
};

/**
 * Execute
 */
(async () => {
  await executeWithCb(averageOpsBat(bat, basePA[bat]), tweet, header, createRow)
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();

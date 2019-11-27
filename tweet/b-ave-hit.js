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

const { averageHitByBat } = require("../query");
const getAndTweetAverage = require("./average/b-ave");

const tweet = false;
const targetBat = 1;
const battingCnt = { 1: 100, 2: 80, 3: 80, 4: 70, 5: 35 };

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 第${targetBat}打席 打率ランキング\n※該当打席数が${battingCnt[targetBat]}以上の打者のみ\n\n`;

/**
 * Execute
 */
(async () => {
  await getAndTweetAverage(averageHitByBat(targetBat), tweet, header)
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();

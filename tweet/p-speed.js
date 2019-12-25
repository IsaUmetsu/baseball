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
const argv = require("./average/yargs").pitcher.count("random")
  .alias("x", "random").argv;

const { speed } = require("../query");
const { isValid, round, getRandomKey } = require("./util/util");
const { executeWithCb } = require("./average/b-ave");

const tweet = argv.tweet > 0, isRandom = argv.random > 0;
const bType = {
  1: "ストレート",
  2: "カーブ",
  3: "シュート(ツーシーム)",
  4: "スライダー",
  5: "フォーク",
  6: "シンカー",
  7: "チェンジアップ",
  9: "カットボール"
};
const bPitchCnt = {
  1: 150,
  2: 100,
  3: 100,
  4: 100,
  5: 100,
  6: 100,
  7: 50,
  9: 100
};
const resultLimit = 50;
let ballType;

if (isRandom) {
  ballType = getRandomKey(bPitchCnt);
} else {
  // validated
  if (!isValid(argv.ballType, Object.keys(bPitchCnt), "ballType")) process.exit();
  // set bat
  ballType = argv.ballType;
}

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 ${bType[ballType]} 平均球速ランキング\n※対象球種を${bPitchCnt[ballType]}投球以上の投手のみ\n(単位:km/h (Max 投球数))\n\n`;

/**
 *
 * @param {object} result DB1レコード
 * @return {string}
 */
const createRow = result => {
  let { name, team, avg_spd, max_spd, cnt, lr, rank } = result;
  // create display info
  avg_spd = String(round(avg_spd, 2));
  return `${rank}位: ${name}(${team}) ${avg_spd} (${max_spd} ${cnt})\n`;
};

/**
 * Execute
 */
(async () => {
  await executeWithCb(
    speed(ballType, bPitchCnt[ballType], resultLimit),
    tweet,
    header,
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();

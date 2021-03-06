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

const { strikeout } = require("../query");
const { BALL_TYPES } = require("../constants");
const { isValid, executeRoundSmallNum, getRandomKey } = require("./util/util");
const { executeWithRound } = require("./average/b-ave");

const tweet = argv.tweet > 0, isRandom = argv.random > 0;
let ballType;

const bSoCnt = {
  1: 30,
  2: 10,
  3: 10,
  4: 20,
  5: 20,
  6: 10,
  7: 10,
  9: 15
};
const bSoRate = {
  1: 0.4,
  2: 0.25,
  3: 0.2,
  4: 0.3,
  5: 0.3,
  6: 0.3,
  7: 0.3,
  9: 0.3
};
const resultLimit = 100;

if (isRandom) {
  ballType = getRandomKey(bSoCnt);
} else {
  // validated
  if (!isValid(argv.ballType, Object.keys(bSoCnt), "ballType")) process.exit();
  // set bat
  ballType = argv.ballType;
}


/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 決め球｢${BALL_TYPES[ballType]}｣奪三振率ランキング\n※対象球種で${bSoCnt[ballType]}奪三振または率が${bSoRate[ballType]}以上である投手 (全奪三振数-対象個数)\n\n`;

/**
 *
 * @param {object} result DB1レコード
 * @return {string}
 */
const createRow = (results, idx, round2ndDecimal, round3rdDecimal) => {
  let { rounded, flag2, flag3 } = executeRoundSmallNum(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    { cntCol: "b_cnt", allCol: "all_cnt", targetCol: "b_rate" }
  );
  // create display info
  const { name, team, all_cnt, b_cnt, rank } = results[idx];
  let row = `${rank}位: ${name}(${team}) ${rounded} (${all_cnt}-${b_cnt})\n`;

  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    strikeout(ballType, bSoCnt[ballType], bSoRate[ballType], resultLimit),
    tweet,
    header,
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();

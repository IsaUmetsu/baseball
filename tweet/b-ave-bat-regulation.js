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
const argv = require("yargs")
  .count("tweet")
  .alias("t", "tweet")
  .alias("b", "bat")
  .default({ bat: 1 })
  .alias("r", "result")
  .alias("a", "average").argv;

const { resultPerBatBatter } = require("../query");
const {
  RATE_TYPE,
  RATE_TYPE_NAME,
  RATE_TYPE_OPS,
  RESULT_PER_TYPE,
  RESULT_PER_TYPE_NAME
} = require("../constants");
const { isValid, executeRoundSmallNum, round } = require("./util");
const { executeWithRound } = require("./average/b-ave");

const tweet = argv.tweet > 0;
const basePA = { 1: 100, 2: 80, 3: 80, 4: 70, 5: 35 };

// validated
if (!isValid(argv.bat, Object.keys(basePA), "bat")) process.exit();

let bat = argv.bat,
  ave = argv.average,
  rst = argv.result,
  targetCol = "",
  rankName = "";

const isValidResult = isValid(argv.result, Object.keys(RATE_TYPE), "result");
const isValidAvg = isValid(argv.average, Object.keys(RATE_TYPE), "average");

if (!isValidResult && !isValidAvg) {
  process.exit();
} else if (isValidResult && !isValidAvg) {
  ave = 1; // 打率に固定
  targetCol = RESULT_PER_TYPE[rst];
  rankName = RESULT_PER_TYPE_NAME[rst];
} else if (!isValidResult && isValidAvg) {
  targetCol = RATE_TYPE[ave];
  rankName = RATE_TYPE_NAME[ave];
} else {
  console.log("オプション -r -a を同時に指定できません");
  process.exit();
}

const cols = {
  1: { cntCol: "hit", allCol: "bat", targetCol: "rate" },
  2: { cntCol: "ob", allCol: "batob", targetCol: "obrate" },
  3: { cntCol: "tb", allCol: "bat", targetCol: "slug" },
  4: { cntCol: "hit", allCol: "bat", targetCol: "ops" }
};

const description = {
  1: "(打数-安打)",
  2: "(出塁打数-出塁数)",
  3: "(打数-塁打数)",
  4: "(出塁率 長打率)"
};

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const header = `2019年 第${bat}打席 ${rankName}ランキング\n※規定到達打者のみ${description[ave]}\n\n`;

/**
 * @param {number} ave
 * @return {string}
 */
const roundRate = ave => String(round(ave, 3)).slice(1);

/**
 *
 * @param {array} results
 * @param {number} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {[string, boolean, boolean]}
 */
const createRoundedRow = (
  results,
  idx,
  round2ndDecimal,
  round3rdDecimal
) => {
  const result = results[idx];
  const { name, team, hr, rbi, rank, obrate, slug } = result;

  let { rounded, flag2, flag3 } = executeRoundSmallNum(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    cols[ave]
  );
  const { cntCol, allCol } = cols[ave];
  // 詳細データ作成(OPSのみ分ける)
  const detail =
    ave == RATE_TYPE_OPS
      ? `(${roundRate(obrate)} ${roundRate(slug)})`
      : `(${result[allCol]}-${result[cntCol]}) ${hr}本 ${rbi}打点`;

  // create display info
  let row = `${rank}位 ${name}(${team}) ${rounded} ${detail}\n`;

  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    resultPerBatBatter(bat, targetCol),
    tweet,
    header,
    createRoundedRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();

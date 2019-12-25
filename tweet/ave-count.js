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
  .count("kindTeam")
  .alias("k", "kindTeam")
  .alias("r", "result")
  .default({ result: 1 })
  .alias("b", "ball")
  .alias("s", "strike")
  .alias("o", "out").argv;

const { resultPerAnyColSum } = require("../query");
const {
  RESULT_PER_TYPE,
  RESULT_PER_TYPE_NAME
} = require("../constants");
const {
  isValid,
  isValidAllowEmply,
  executeRoundSmallNum,
  createHeader
} = require("./util/util");
const { executeWithRound } = require("./average/b-ave");

const tweet = argv.tweet > 0;
const isKindTeam = argv.kindTeam > 0;

const createArrIdx = cnt => [...Array(cnt).keys()].map(key => String(key));
// validated
const isValidBall = isValidAllowEmply(argv.ball, createArrIdx(4), "ball"),
  isValidStrike = isValidAllowEmply(argv.strike, createArrIdx(3), "strike"),
  isValidOut = isValidAllowEmply(argv.out, createArrIdx(3), "out");

const { ball, strike, out, result: rst } = argv;
if (ball === undefined && strike === undefined && out === undefined) {
  console.log("BSOのいずれか1つは指定してください");
  process.exit();
} else if (!isValidBall || !isValidStrike || !isValidOut) {
  console.log("BSOは正しい範囲で指定してください");
  process.exit();
}

if (!isValid(argv.result, Object.keys(RESULT_PER_TYPE), "result"))
  process.exit();
// set args

const targetCols = ["hit", "hr", "rbi", "bat"];
const selectCols = {};
// s
targetCols.map(col => {
  let cols = [];
  [...Array(4).keys()].map(b => {
    [...Array(3).keys()].map(s => {
      [...Array(3).keys()].map(o => {
        b = ball ? ball : b;
        s = strike ? strike : s;
        o = out ? out : o;
        cols.push(`${col}_${b}${s}${o}`)
      });
    });
  });
  // 重複を削除して格納
  selectCols[col] = cols.filter((x, i, self) => self.indexOf(x) == i).join(" + ");
});

/**
 *
 * @param {array} results
 * @param {number} idx
 * @param {boolean} round2ndDecimal
 * @param {boolean} round3rdDecimal
 * @return {array}
 */
const createRow = (results, idx, round2ndDecimal, round3rdDecimal) => {
  let { rounded, flag2, flag3 } = executeRoundSmallNum(
    results,
    idx,
    round2ndDecimal,
    round3rdDecimal,
    { cntCol: "hit", allCol: "bat", targetCol: "rate" }
  );
  const { name, team, hr, rbi, hit, bat, rank } = results[idx];
  let namePart = `${isKindTeam ? `${team}` : `${name}(${team})`}`;
  let row = `${rank}位 ${namePart} ${rounded} (${bat}-${hit}) ${hr}本 ${rbi}打点 \n`;
  return [row, flag2, flag3];
};

/**
 * Execute
 */
(async () => {
  await executeWithRound(
    resultPerAnyColSum(selectCols, isKindTeam, RESULT_PER_TYPE[rst], "result_per_count_regulation"),
    tweet,
    createHeader(
      isKindTeam,
      (() => {
        let title = "";
        if (out > -1 && out < 3) title += `${out}アウト`;
        if ((ball > -1 && ball < 4) && strike == undefined) title += `${ball}ボール`;
        if (ball == undefined && (strike > -1 && strike < 3)) title += `${strike}ストライク`;
        if ((ball > -1 && ball < 4) && (strike > -1 && strike < 3)) title += `${ball}-${strike}`;
        return title;
      })(),
      `${RESULT_PER_TYPE_NAME[rst]}ランキング`,
      ""
    ),
    createRow
  )
    .then(r => r)
    .catch(e => {
      console.log(e);
    });
})();

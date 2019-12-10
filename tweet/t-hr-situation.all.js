"use strict";

/**
 * Twitter 文字数制限を満たす範囲で順位を作成
 *
 * 基本的に書くツイートに以下の内容を持つ
 *   header: 順位、本数、同率順位人数
 *   content: 選手名・球団 対象本塁打数/全本塁打数 対象本塁打割合
 *   footer: ハッシュタグ (暫定で #npb)))
 *
 * 同率順位について複数ツイートにまたがる場合は header は省略
 */

const twText = require("twitter-text");

const { db } = require("../model");
const { homerunTypeRankSituationTeam } = require("../query");
const { HASHTAGS } = require('../constants')
const { executeRoundPercent, tweetResult } = require("./util");

const homerun_type = "逆転";
const homerun_type_other = ""; // 反撃の一打
const { SELECT: type } = db.QueryTypes;

const tweet = false;
let prevTweetId = "";

/**
 * Execute
 */
(async () => {
  // get target records
  const results = await db
    .query(homerunTypeRankSituationTeam(homerun_type), { type })
    .then(r => r)
    .catch(e => {
      console.log(e);
      throw e;
    });

  let contents = ""; // whole
  let header = ""; // rank, number of homerun, tie
  let footer = "\n#侍ジャパン #プレミア12 #npb "; // hashtag
  let currentRank = 0;

  let round2ndDecimal = false;
  let round3rdDecimal = false;

  for (let idx in results) {
    const { team, cnt, batting_cnt, rank, team_kana } = results[idx];

    if (!header) {
      header = createHeader();
      contents += header;
    }

    let rankPart = "";
    if (currentRank == rank && currentRank != 0) {
      rankPart = `${rank}位: `;
    } else {
      rankPart = `${rank}位: `;
      currentRank = rank;
    }

    let { rounded, flag2, flag3 } = executeRoundPercent(
      results,
      idx,
      round2ndDecimal,
      round3rdDecimal,
      { cntCol: "cnt", allCol: "batting_cnt", targetCol: "percent" }
    );
    // update flag
    round2ndDecimal = flag2;
    round3rdDecimal = flag3;
    // create display info
    let row = `${team_kana} (${cnt}本/チーム合計${batting_cnt}打数) ${rounded}% #${HASHTAGS[team]}\n`;

    // 次の内容を足してもツイート可能な場合
    if (twText.parseTweet(contents + (rankPart + row) + footer).valid) {
      contents += rankPart + row;
      // 次の内容を足すとツイート不可である場合（文字数超過)
    } else {
      // finalize content (足す前の内容で確定)
      let displayContent = contents + footer;
      // reset content
      rankPart = `${rank}位: `;
      contents = header + (rankPart + row);
      // display temp content
      console.log("----------");
      console.log(displayContent);
      // tweet
      prevTweetId = await tweetResult(tweet, displayContent, prevTweetId);
    }
  }

  let lastDisplayContent = contents + footer;
  // 最終ツイート内容出力
  console.log("----------");
  console.log(lastDisplayContent);
  // tweet
  await tweetResult(tweet, lastDisplayContent, prevTweetId);
})();

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const createHeader = () => {
  const dispHomerunType = homerun_type_other
    ? homerun_type_other
    : homerun_type;
  // 各種ヘッダ作成
  const header1 = `2019年 チーム別${dispHomerunType}HRランキング\n`;
  const header2 = `(本/${dispHomerunType}打数)\n`;
  // 連結して返却
  return `${header1}${header2}※同数の場合は率が高い順に順位付け\n\n`;
};

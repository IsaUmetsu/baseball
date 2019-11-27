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

const twText = require("twitter-text");

const { db } = require("../model");
const { SELECT: type } = db.QueryTypes;
const { executeRoundAverage, tweetResult } = require("./util");

let prevTweetId = "";

/**
 * Execute
 */
module.exports = async (execQuery, tweet, headerBase) => {

  // get target records
  const results = await db
    .query(execQuery, { type })
    .then(r => r)
    .catch(e => {
      console.log(e);
      throw e;
    });

  let contents = ""; // whole
  let header = ""; // rank, number of homerun, tie
  let footer = "\n#npb "; // hashtag
  let currentRank = 0;

  let round2ndDecimal = false;
  let round3rdDecimal = false;

  for (let idx in results) {
    const { name, team, bat_cnt, target_cnt, rank } = results[idx];

    if (!header) {
      header = headerBase;
      contents += header;
    }

    let rankPart = "";
    if (currentRank == rank && currentRank != 0) {
      rankPart = `${rank}位: `;
    } else {
      rankPart = `${rank}位: `;
      currentRank = rank;
    }

    let { rounded, flag2, flag3 } = executeRoundAverage(
      results,
      idx,
      round2ndDecimal,
      round3rdDecimal
    );
    // update flag
    round2ndDecimal = flag2;
    round3rdDecimal = flag3;
    // create display info
    let row = `${name}(${team}) ${String(rounded).slice(1)} (${bat_cnt}-${target_cnt})\n`;

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
};

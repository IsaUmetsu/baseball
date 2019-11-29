"use strict";

const bAve = module.exports = {};

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

const { db } = require("../../model");
const { SELECT: type } = db.QueryTypes;
const { executeRoundAverage, tweetResult, round } = require("../util");

let prevTweetId = "";

/**
 * Execute
 */
bAve.execute = async (execQuery, tweet, headerBase) => {
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

  let round2ndDecimal = false;
  let round3rdDecimal = false;

  for (let idx in results) {
    const { name, team, bat_cnt, target_cnt, rank } = results[idx];

    if (!header) {
      header = headerBase;
      contents += header;
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
    let average = String(rounded).slice(1);
    let row = `${rank}位: ${name}(${team}) ${average} (${bat_cnt}-${target_cnt})\n`;

    // 次の内容を足してもツイート可能な場合
    if (twText.parseTweet(contents + row + footer).valid) {
      contents += row;
      // 次の内容を足すとツイート不可である場合（文字数超過)
    } else {
      // finalize content (足す前の内容で確定)
      let displayContent = contents + footer;
      // reset content
      contents = header + row;
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

/**
 * Execute
 */
bAve.executeOPS = async (execQuery, tweet, headerBase) => {
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

  for (let idx in results) {

    if (!header) {
      header = headerBase;
      contents += header;
    }

    let { name, team, rate_sum, rate, onbase, slugging, rank } = results[idx];

    // create display info
    onbase = String(round(onbase, 3)).slice(1);
    slugging = String(round(slugging, 3)).slice(1);
    let row = `${rank}位: ${name}(${team}) ${round(rate, 4)} (出${onbase}, 長${slugging})\n`;

    // 次の内容を足してもツイート可能な場合
    if (twText.parseTweet(contents + row + footer).valid) {
      contents += row;
      // 次の内容を足すとツイート不可である場合（文字数超過)
    } else {
      // finalize content (足す前の内容で確定)
      let displayContent = contents + footer;
      // reset content
      contents = header + row;
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

"use strict";

const bAve = (module.exports = {});

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
const { tweetResult } = require("../util");

let contents = ""; // whole
let row = "";
let header = ""; // rank, number of homerun, tie
let footer = "\n#npb "; // hashtag
let prevTweetId = "";

/**
 * Execute
 *
 * @param {string} exexQuery
 * @param {boolean} tweet
 * @param {string} headerBase
 * @param {function} createRowCb callback function
 */
bAve.executeWithRound = async (execQuery, tweet, headerBase, createRowCb) => {
  // get target records
  const results = await db
    .query(execQuery, { type })
    .then(r => r)
    .catch(e => {
      console.log(e);
      throw e;
    });

  let round2ndDecimal = false;
  let round3rdDecimal = false;

  for (let idx in results) {
    if (!header) {
      header = headerBase;
      contents += header;
    }

    [row, round2ndDecimal, round3rdDecimal] = createRowCb(
      results,
      idx,
      round2ndDecimal,
      round3rdDecimal
    );

    // 次の内容を足してもツイート可能な場合
    if (twText.parseTweet(contents + row + footer).valid) {
      contents += row;
      // 次の内容を足すとツイート不可である場合（文字数超過)
    } else {
      prevTweetId = await executeTweet(tweet, contents, footer, prevTweetId)
        .then(r => r)
        .catch(e => {
          throw e;
        });
      // reset content
      contents = header + row;
    }
  }

  await executeTweet(tweet, contents, footer, prevTweetId);
};

/**
 * Execute
 *
 * @param {string} exexQuery
 * @param {boolean} tweet
 * @param {string} headerBase
 * @param {function} createRowCb callback function
 */
bAve.executeWithCb = async (execQuery, tweet, headerBase, createRowCb) => {
  // get target records
  const results = await db
    .query(execQuery, { type })
    .then(r => r)
    .catch(e => {
      console.log(e);
      throw e;
    });

  for (let idx in results) {
    if (!header) {
      header = headerBase;
      contents += header;
    }

    row = createRowCb(results[idx]);

    // 次の内容を足してもツイート可能な場合
    if (twText.parseTweet(contents + row + footer).valid) {
      // contents += row;
      contents += row;
      // 次の内容を足すとツイート不可である場合（文字数超過)
    } else {
      prevTweetId = await executeTweet(tweet, contents, footer, prevTweetId)
        .then(r => r)
        .catch(e => {
          throw e;
        });
      // reset content
      contents = header + row;
    }
  }

  await executeTweet(tweet, contents, footer, prevTweetId);
};

/**
 *
 * @param {boolean} tweet
 * @param {string} contents
 * @param {string} footer
 * @param {string} prevTweetId
 */
const executeTweet = async (tweet, contents, footer, prevTweetId) => {
  let displayContent = contents + footer;
  // 最終ツイート内容出力
  console.log("----------");
  console.log(displayContent);
  // tweet
  return await tweetResult(tweet, displayContent, prevTweetId);
};

/**
 * create for test
 */
const createContentAndTweet = async (
  header,
  contents,
  footer,
  row,
  tweet,
  prevTweetId
) => {
  // 次の内容を足してもツイート可能な場合
  if (twText.parseTweet(contents + row + footer).valid) {
    // contents += row;
    contents += row;
    // 次の内容を足すとツイート不可である場合（文字数超過)
  } else {
    prevTweetId = await executeTweet(tweet, contents, footer, prevTweetId)
      .then(r => r)
      .catch(e => {
        throw e;
      });
    // reset content
    contents = header + row;
  }
  return [prevTweetId, contents];
};

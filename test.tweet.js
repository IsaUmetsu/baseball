"use strict"

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

const twitter = require('twitter-text')
const { db } = require('./model')
const { homerunTypeRank } = require('./query')

const homerun_type = '追い上げ'
const { SELECT: type } = db.QueryTypes

// test
// let tweet = "鶴岡(F) (1/1) 100%\n高橋(D) (1/7) 14.3%\n頓宮(B) (1/3) 33.3%\n長谷川勇(H) (1/3) 33.3%\n長坂(T) (1/1) 100%\n釜元(H) (1/4) 25%\n遠藤(D) (1/2) 50%\n近藤(F) (1/2) 50%\n西村(B) (1/2) 50%\n藤岡(M) (1/2) 50%\n荒木(S) (1/2) 50%"
// const result = twitter.parseTweet(tweet)

db.query(homerunTypeRank(homerun_type), { type })
  .then(async results => {
    let contents = ''       // whole
    let header = ''         // rank, number of homerun, tie
    let footer = "\n #npb"  // hashtag
    let currentCnt = 0      // current number of homerun

    results.map(result => {
      const { summary, cnt, total_cnt, percent, rank }= result

      if (currentCnt == 0) currentCnt = cnt

      if (! header) {
        header = createHeader(rank, cnt, results)
        contents += header
      }

      let row = `${summary} (${cnt}本/${total_cnt}本) ${percent}%\n`

      // 次の内容を足してもツイート可能な場合
      if (twitter.parseTweet(contents + row + footer).valid) {
        // ホームラン本数が変わる場合は、次の内容を足す前の内容で確定
        if (currentCnt != cnt) {
          // finalize content
          console.log("----------")
          console.log(contents += footer)
          // 次の内容については新しく作ったheaderに足す
          header = createHeader(rank, cnt, results)
          currentCnt = cnt
          // reset content
          contents = header + row
        // ホームラン本数に変更がない場合はそのまま足す
        } else { contents += row }
      // 次の内容を足すとツイート不可である場合（文字数超過)
      } else {
        // finalize content (足す前の内容で確定)
        console.log("----------")
        console.log(contents += footer)
        // ホームラン本数がちょうど変わる場合はヘッダから作り直す
        if (currentCnt != cnt) {
          header = createHeader(rank, cnt, results)
          currentCnt = cnt
          // reset content
          contents = header + row
        // 変更がない場合、次のツイートにはヘッダなし
        } else { contents = '' }
      }
    })
    // 最終ツイート内容出力
    console.log("---------\n")
    console.log(contents += footer)
  })

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const createHeader = (rank, cnt, results) => {
  let sameRankCnt = results.filter(r => r.rank == rank).length
  return `第${rank}位 ${cnt}本 ${sameRankCnt > 1 ? `(${sameRankCnt}名)` : ``}\n\n`
}
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
const { db } = require('../model')
const { homerunTypeRankSituationBatter } = require('../query')

const homerun_type = '同点'
const homerun_type_other = '' // 反撃の一打
const devide_cnt = false
const { SELECT: type } = db.QueryTypes

// test
// let tweet = "鶴岡(F) (1/1) 100%\n高橋(D) (1/7) 14.3%\n頓宮(B) (1/3) 33.3%\n長谷川勇(H) (1/3) 33.3%\n長坂(T) (1/1) 100%\n釜元(H) (1/4) 25%\n遠藤(D) (1/2) 50%\n近藤(F) (1/2) 50%\n西村(B) (1/2) 50%\n藤岡(M) (1/2) 50%\n荒木(S) (1/2) 50%"
// const result = twitter.parseTweet(tweet)

db.query(homerunTypeRankSituationBatter(homerun_type), { type })
  .then(async results => {
    let contents = ''       // whole
    let header = ''         // rank, number of homerun, tie
    let footer = "\n#プレミア12 #侍ジャパン "  // hashtag
    let currentCnt = 0      // current number of homerun
    let currentRank = 0

    results.map(result => {
      const { name, team, cnt, batting_cnt, percent, rank } = result

      if (currentCnt == 0) currentCnt = cnt

      if (! header) {
        header = createHeader()
        contents += header
      }

      let rankPart = ''
      if (currentRank == rank && currentRank != 0) {
        rankPart = `${rank}位: `
        // rankPart += rank < 10 ? ' ' : '  '
      } else {
        rankPart = `${rank}位: `
        currentRank = rank
      }
      let row = `${name}(${team}) (${cnt}本/${batting_cnt}打数) ${percent}%\n`

      // 次の内容を足してもツイート可能な場合
      if (twitter.parseTweet(contents + (rankPart + row) + footer).valid) {
        contents += (rankPart + row)
      // 次の内容を足すとツイート不可である場合（文字数超過)
      } else {
        // finalize content (足す前の内容で確定)
        console.log("----------")
        console.log(contents += footer)

        rankPart = `${rank}位: `
        contents = header + (rankPart + row)
      }
    })
    // 最終ツイート内容出力
    console.log("---------")
    console.log(contents += footer)
  })

/**
 * ヘッダ作成 (rank, number of homerun, tie)
 */
const createHeader = () => {
  return `2019年 '${homerun_type_other ? homerun_type_other : homerun_type}' 本塁打ランキング\n\n`
}
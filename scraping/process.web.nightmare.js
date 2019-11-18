'use strict'

const Nightmare = require('nightmare')
const fs = require('fs')
const moment = require('moment')

const { JSDOM } = require('jsdom')
const { window } = new JSDOM('')
const $ = require('jquery')(window)

const vo = require('vo')

const { checkAndCreateDir } = require('../func')
const { finished, moveRealtimePage } = require('./test.nightmare')

const nightmare = new Nightmare({
  show: false,
  height: 2000,
  width: 1000,        
})

const waitSelect = '#batterBoxLive'

const baseUrl = 'https://www.nikkansports.com/baseball/professional/score/2019/'
const nikkanBaseUrl = 'https://www.nikkansports.com'

const day = moment('2019-03-29');
const date = day.format('YYYYMMDD')
const seasonStart = moment('2019-03-29');
const seasonEnd = moment('2019-09-30');

const gameNo  = '05'

const screeshotBasePath = './scraping/screenshot/'
const htmlBasePath = './scraping/html/'

const replaceBtnName = btnName => '#ball-nav a[sj-click="controller:${btnName}"]'.replace('${btnName}', btnName)

/**
 * Screenshot, HTML保存
 */
const getAndSaveData = function * (targetDate, targetGameNo, targetUrl) {
  try {
    // let url = baseUrl + date + gameNo + '/0001.html?sj_PageID=GA2125923_00_0ball'

    // create save directory
    const screenshotPath = yield checkAndCreateDir(screeshotBasePath, targetDate, targetGameNo)
      .then(r => r)
      .catch(e => { throw e })
    const htmlPath = yield checkAndCreateDir(htmlBasePath, targetDate, targetGameNo)
      .then(r => r)
      .catch(e => { throw e })

    const inning1TopSelect = '#sj-score-in9 .first .in1 a'
    const prvBatterBtnSelect = replaceBtnName('prevBatter')
    // const nxtBatterBtnSelect = replaceBtnName('nextBatter')
    const prvBallBtnSelect = replaceBtnName('prevBall')
    const nxtBallBtnSelect = replaceBtnName('nextBall')

    // リアルタイム速報
    yield nightmare
      // .goto(url)
      .goto(targetUrl)
      .wait(waitSelect)
      // 1回表のスコア押下
      .click(inning1TopSelect)
      .wait(waitSelect)

    let batterMaxBallCnt = 0
    // 1回表 3アウト目の打者から1アウト目までさかのぼる
    while (1) {
      let { isFirstBatter, pitchCnt, document } = yield nightmare
        .evaluate(() => {
          let doc = $(document)
          // 打者の打順を取得
          let firstTeamOrderArea = doc.find('#playerListIndex .data-view :first');
          let nowBatterClass = firstTeamOrderArea.find('caption').attr('class')
          let nowBatterOrder = firstTeamOrderArea.find('td.' + nowBatterClass).html()
          // 現在の投手の球数と打者の打席内での合計投球数
          let pitchCnt = doc.find('#pitcherTbl tr:nth-child(2) td').html().replace('球', '');
          let batterBallCnt = doc.find('#pitchingBallTbl tr:nth-child(1) td').html().replace('球目', '');
          
          return {
            isFirstBatter: pitchCnt == batterBallCnt && nowBatterOrder == 1,
            pitchCnt,
            document: document.body.innerHTML
          }
        })

      // 1回表の最初の打者の結果に到達したら処理終了
      if (isFirstBatter) {
        batterMaxBallCnt = pitchCnt
        break
      }
      //「前の打者」ボタン押下
      yield nightmare
        .click(prvBatterBtnSelect)
        .wait(waitSelect)
    }

    // 1回表 先頭打者の1球目までさかのぼる
    while (1) {
      let { isFirstBall, ballCnt, document } = yield nightmare
        .evaluate(() => {
          let doc = $(document)
          // 現在の投手の球数と打者の打席内での合計投球数
          let pitchCnt = doc.find('#pitcherTbl tr:nth-child(2) td').html().replace('球', '');
          let batterBallCnt = doc.find('#pitchingBallTbl tr:nth-child(1) td').html().replace('球目', '');
          
          return {
            isFirstBall: pitchCnt == 1 && batterBallCnt == 1,
            ballCnt: pitchCnt,
            document: document.body.innerHTML
          }
        })

      // 1回表の最初の打者の結果に到達したら処理終了
      if (isFirstBall) break

      // save as html
      fs.writeFile(`${htmlPath}/${ballCnt}.html`, document, (err) => { if (err) console.log(err) })
      //「前の球」ボタン押下
      yield nightmare
        .screenshot(`${screenshotPath}/${ballCnt}.png`)
        .click(prvBallBtnSelect)
        .wait(waitSelect)
    }

    // 1番打者の1球目情報保存
    yield nightmare
      .screenshot(`${screenshotPath}/1.png`)
      .evaluate(() => document.body.innerHTML)
      .then(document => {
        // save as html
        fs.writeFile(`${htmlPath}/1.html`, document, (err) => { if (err) console.log(err) })
      })

    // 1回表 2番打者の1球目から情報取得再開 (1回表 1番打者終了後で「次の球」押下)
    for (let fstBtrCnt = 0; fstBtrCnt < batterMaxBallCnt; fstBtrCnt++) {
      yield nightmare
        .click(nxtBallBtnSelect)
        .wait(waitSelect)
    }

    let cnt = ++batterMaxBallCnt

    // 1回裏 先頭打者の初球情報取得
    yield nightmare
      .screenshot(`${screenshotPath}/${cnt}.png`)
    cnt++

    // /**
    // 試合終了まで情報取得を繰り返す
    while (1) {
      //「次の球」ボタン押下
      yield nightmare
        .click(nxtBallBtnSelect)
        .wait(waitSelect)

      let { isFinished, document } = yield nightmare
        .screenshot(`${screenshotPath}/${cnt}.png`)
        .evaluate(() => { return {
          isFinished: $(document).find('#game-end').html(),
          document: document.body.innerHTML
        }})
      // save as html
      fs.writeFile(`${htmlPath}/${cnt}.html`, document, (err) => { if (err) console.log(err) })

      if (isFinished) break

      cnt++
    }
    // */

  } catch (e) {
    if (e) throw e
  }
}

/**
 * 指定日時・指定試合のデータ取得
 */
const run = function * () {
  const dateString = day.format('YYYYMMDD')
  const document = fs.readFileSync('./scraping/html/top.html', 'utf8')
  const hrefBase = `/baseball/professional/score/2019/pf-score-${dateString}.html`
  // 処理対象の日付がある場合
  if ($(document).find(`a[href="${hrefBase}"]`).length) {
    const dayTopHtml = yield nightmare
      .goto(nikkanBaseUrl + hrefBase)
      .wait('body')
      .evaluate(() => document.body.innerHTML)

    // fs.writeFile(`./scraping/html/daytop_${dateString}.html`, dayTopHtml, (err) => { if (err) console.log(err) })

    let urls = []
    $(dayTopHtml).find('.nscoreLink.realtime a').each(function (idx, elem) {
      const targetGameNo = '0' + (idx + 1)
      // ゲーム番号指定時はその前の試合については処理しない
      if (targetGameNo < gameNo) return true

      let targetUrl = $(elem).attr('href')
      // console.log(`gameNo: ${targetGameNo}, url: ${nikkanBaseUrl}${targetUrl}`)
      urls.push({ gameNo: targetGameNo, url: `${nikkanBaseUrl}${targetUrl}` })
    })
    // 処理対象の数だけ実行
    for (let cnt = 0; cnt < urls.length; cnt++) {
      let info = urls[cnt]
      yield getAndSaveData(dateString, info.gameNo, info.url)
    }
  }
  yield nightmare.end()
}

/**
 * メイン処理実行
 */
vo(run)(function(err) {
  if (err) console.dir(err.message)
  console.log('done')
})

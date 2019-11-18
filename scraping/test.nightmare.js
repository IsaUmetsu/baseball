'use strict'

/**
 * 動作確認用クラス
 */
const testNightmare = module.exports = {}

const Nightmare = require('nightmare')
const fs = require('fs')
const moment = require('moment')

const { JSDOM } = require('jsdom')
const { window } = new JSDOM('')
const $ = require('jquery')(window)

const nightmare = new Nightmare({
  show: false,
  height: 2000,
  width: 1000,        
})

const waitSelect = '#batterBoxLive'

const baseUrl = 'https://www.nikkansports.com/baseball/professional/score/2019/'

const day = moment('2019-03-29');
const date = day.format('YYYYMMDD')
const seasonStart = moment('2019-03-29');
const seasonEnd = moment('2019-09-30');

const gameNo  = '05'

const screenshotPath  = `./scraping/screenshot/${date}/${gameNo}/`
const htmlPath        = `./scraping/html/${date}/${gameNo}/`

/**
 * 試合終了判定テスト
 */
testNightmare.finished = function * () {
  const no = 500
  const inning9TopSelect = '#sj-score-in9 .first .in1 a'
  // const isFinished = yield nightmare
  yield nightmare
    .goto(baseUrl + date + gameNo + '/0001.html?sj_PageID=GA2125923_00_0ball')
    .wait(waitSelect)
    .click(inning9TopSelect)
    .wait(waitSelect)
    .screenshot(screenshotPath + no + ".png")
    // .evaluate(() => $(document).html())

  // if (isFinished) {
    const info = yield nightmare.evaluate(() => document)
    fs.writeFile(htmlPath + no + ".html", info, (err) => { if (err) console.log(err) })
  // }

  yield nightmare.end()
}

/**
 * トップページから各試合のリアルタイム速報遷移テスト
 */
testNightmare.moveRealtimePage = function * (run) {
  const dateString = day.format('YYYYMMDD')
  const proBaseballBase = 'https://www.nikkansports.com'

  const document = fs.readFileSync('./scraping/html/top.html', 'utf8')
  const hrefBase = `/baseball/professional/score/2019/pf-score-${dateString}.html`
  // 処理対象の日付がある場合
  if ($(document).find(`a[href="${hrefBase}"]`).length) {
    const dayTopHtml = yield nightmare
      .goto(proBaseballBase + hrefBase)
      .wait('body')
      .evaluate(() => document.body.innerHTML)

    // fs.writeFile(`./scraping/html/daytop_${dateString}.html`, dayTopHtml, (err) => { if (err) console.log(err) })
    $(dayTopHtml).find('.nscoreLink.realtime a').each((idx, elem) => {
      const targetGameNo = '0' + (idx + 1)
      // ゲーム番号指定時はその前の試合については処理しない
      if (targetGameNo < gameNo) return true

      let targetUrl = $(elem).attr('href')
      console.log(`gameNo: ${targetGameNo}, url: ${proBaseballBase}${targetUrl}`)
    })
  }
}
'use strict'

const Nightmare = require('nightmare')
const nightmare = new Nightmare({
  show: false,
  height: 2000,
  width: 1000,
  waitTimeout: 1000 * 50,
  timeout: 1000 * 50
})
const fs = require('fs')
const vo = require('vo')

const { JSDOM } = require('jsdom')
const { window } = new JSDOM('')
const $ = require('jquery')(window)

const { nikkanBaseUrl, day, seasonStart, seasonEnd, gameNo, htmlBasePath } = require('./nightmare.config')
const { getAndSaveData } = require('./func.web.nightmare')

/**
 * 指定日時・指定試合のデータ取得
 */
const run = function * () {
  if (day.isSameOrAfter(seasonStart) && day.isSameOrBefore(seasonEnd)) {
    const dateString = day.format('YYYYMMDD')
    const document = fs.readFileSync(`${htmlBasePath}/top.html`, 'utf8')
    const hrefBase = `/baseball/professional/score/2019/pf-score-${dateString}.html`
    // 処理対象の日付がある場合
    if ($(document).find(`a[href="${hrefBase}"]`).length) {
      const dayTopHtml = yield nightmare
        .goto(nikkanBaseUrl + hrefBase)
        .wait('body')
        .evaluate(() => document.body.innerHTML)

      let urls = []
      $(dayTopHtml).find('.nscoreLink.realtime a').each(function (idx, elem) {
        const targetGameNo = '0' + (idx + 1)
        // ゲーム番号指定時はその前の試合については処理しない
        if (targetGameNo < gameNo) return true

        let targetUrl = $(elem).attr('href')
        urls.push({ gameNo: targetGameNo, url: `${nikkanBaseUrl}${targetUrl}` })
      })
      // 処理対象の数だけ実行
      for (let cnt = 0; cnt < urls.length; cnt++) {
        let info = urls[cnt]
        yield getAndSaveData(nightmare, dateString, info.gameNo, info.url)
      }
    }
    day.add(1, 'days')
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

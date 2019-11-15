'use strict'

const Nightmare = require('nightmare')
const fs = require('fs')

const { JSDOM } = require('jsdom')
const { window } = new JSDOM('')
const $ = require('jquery')(window)

const vo = require('vo')

const nightmare = new Nightmare({
  show: false,
  height: 2000,
  width: 1000,        
})

const waitSelect = 'body'

const baseUrl = 'https://www.nikkansports.com/baseball/professional/score/2019/'
const date = '20190329'
const gameNo = '01'

const replaceBtnName = btnName => '#ball-nav a[sj-click="controller:${btnName}"]'.replace('${btnName}', btnName)

const run = function * () {
  try {
    const inning1TopSelect = '#sj-score-in9 .first .in1 a'
    const prvBatterBtnSelect = replaceBtnName('prevBatter')
    // const nxtBatterBtnSelect = replaceBtnName('nextBatter')
    const prvBallBtnSelect = replaceBtnName('prevBall')
    const nxtBallBtnSelect = replaceBtnName('nextBall')

    // リアルタイム速報
    yield nightmare
      .goto(baseUrl + date + gameNo + '/0001.html?sj_PageID=GA2125923_00_0ball')
      // .goto(baseUrl + date + '04/0001.html?sj_PageID=GA2125830_00_0ball')
      .wait(waitSelect)
      // 1回表のスコア押下
      .click(inning1TopSelect)
      .wait(waitSelect)
      // プロ野球トップ
      // .goto('https://www.nikkansports.com/baseball/professional/score/2019/pf-score-20190329.html')

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
      let filePath = './scraping/html/20190329/01/' + ballCnt + '.html'
      fs.writeFile(filePath, document, (err) => { if (err) console.log(err) })
      //「前の球」ボタン押下
      yield nightmare
        .screenshot("./scraping/screenshot/" + ballCnt + ".png")
        .click(prvBallBtnSelect)
        .wait(waitSelect)
    }

    // 1番打者の1球目情報保存
    yield nightmare
      .screenshot("./scraping/screenshot/1.png")
      .evaluate(() => document.body.innerHTML)
      .then(document => {
        // save as html
        let filePath = "./scraping/html/20190329/01/1.html"
        fs.writeFile(filePath, document, (err) => { if (err) console.log(err) })
      })

    // 1回表 2番打者の1球目から情報取得再開 (1回表 1番打者終了後で「次の球」押下)
    for (let fstBtrCnt = 0; fstBtrCnt < batterMaxBallCnt; fstBtrCnt++) {
      yield nightmare
        .click(nxtBallBtnSelect)
        .wait(waitSelect)
    }

    let cnt = ++batterMaxBallCnt

    // 試合終了まで情報取得を繰り返す
    while (1) {
      //「次の球」ボタン押下
      yield nightmare
        .screenshot("./scraping/screenshot/" + cnt + ".png")
        .click(nxtBallBtnSelect)
        .wait(waitSelect)

      let { isFinished, document } = yield nightmare.evaluate(() => { return {
        isFinished: $(document).find('#game-end').html(),
        document: document.body.innerHTML
      }})
      // save as html
      let filePath = './scraping/html/20190329/01/' + cnt + '.html'
      fs.writeFile(filePath, document, (err) => { if (err) console.log(err) })

      if (isFinished) break

      cnt++
    }

    yield nightmare.end()
  } catch (e) {
    if (e) throw e
  }
}

const runTest = function * () {
  const no = 500
  const inning9TopSelect = '#sj-score-in9 .first .in1 a'
  // const isFinished = yield nightmare
  yield nightmare
    .goto(baseUrl + date + gameNo + '/0001.html?sj_PageID=GA2125923_00_0ball')
    .wait(waitSelect)
    .click(inning9TopSelect)
    .wait(waitSelect)
    .screenshot("./scraping/screenshot/" + no + ".png")
    // .evaluate(() => $(document).html())

  // if (isFinished) {
    const info = yield nightmare.evaluate(() => document)
    fs.writeFile("./scraping/html/20190329/01/" + no + ".html", info, (err) => { if (err) console.log(err) })
  // }

  yield nightmare.end()
}

vo(run)(function(err) {
// vo(runTest)(function(err) {
  if (err) console.dir(err)
  console.log('done')
})

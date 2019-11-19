'use strict'

/**
 * 
 */
const funcWebNightmare = module.exports = {}

const fs = require('fs')

const { JSDOM } = require('jsdom')
const { window } = new JSDOM('')
const $ = require('jquery')(window)

const {
  saveMode, SAVE_MODE_HTML, SAVE_MODE_JSON, isTest,
  waitSelect, screeshotBasePath, htmlBasePath, jsonBasePath, 
} = require('./nightmare.config')
const { checkAndCreateDir } = require('../func')


const replaceBtnName = btnName => '#ball-nav a[sj-click="controller:${btnName}"]'.replace('${btnName}', btnName)


// ------------------------- for save json -------------------------
const getHtml = (elem, selector) => $(elem).find(selector).html()

const convertOnBase = elem => {
  let onBase = ''
  for (let base = 1; base <= 3; base++) {
    onBase += String(Number(Boolean($(elem).find('#baseMap p.base0' + base).length > 0)))
  }
  return onBase
}

const convertKey = {
  '投手': 'pitcher', '球数': 'pitchCnt', '今季成績': 'seasonalResults',
  '結果': 'result', '球種': 'ballType', '球速': 'speed',
  '打者': 'batter', '本日': 'todayResult'
}

// ------------------------- /for save json -------------------------

const saveAsJson = function * (html, jsonPath, ballCnt) {
  const outputJson = {}

  // ------------------------- scoreBordInfo -------------------------
  const scoreBordInfo = {}
  $(html).find('.scoreboardArea table tr').each((idx, trElem) => {
    // ヘッダ行はスキップ
    if (idx == 0) return true
    // 表裏攻撃情報
    $(trElem).find('td').each((idx, tdElem) => {
      let classes = $(tdElem).attr('class').split(' ')
      // チーム情報は除外
      if (classes.indexOf('team') > -1) return true
      let key = classes.indexOf('inning') > -1 ? classes[1] : classes[0]
      // 保存キーがない場合作成
      if (Object.keys(scoreBordInfo).indexOf(key) == -1) scoreBordInfo[key] = []
      // save
      scoreBordInfo[key].push(classes.indexOf('inning') > -1 ? $(tdElem).find('a').html() : $(tdElem).html())
    })
  })
  outputJson.scoreBordInfo = scoreBordInfo
  // ------------------------- /scoreBordInfo -------------------------

  // ------------------------- playerList -------------------------
  // get player info
  const playerListIndex = $(html).find('#playerListIndex')
  const playerLists = {}
  playerListIndex.find('.data-view').each((idx, elem) => {

    const playerList = []
    $(elem).find('tbody tr').each((trIdx, trElem) => {
      playerList.push({
        no: getHtml(trElem, '.no'),
        position: getHtml(trElem, '.position'),
        name: getHtml(trElem, '.name a')
      })
    })
    playerLists[getHtml(elem, 'caption')] = playerList
  })
  outputJson.playerLists = playerLists
  // ------------------------- /playerList -------------------------

  // ------------------------- liveInfo -------------------------
  const batterBoxLive = $(html).find('#batterBoxLive')
  const liveInfo = {}
  batterBoxLive.find('#pitcherTbl tbody tr').each((idx, elem) => {
    liveInfo[convertKey[getHtml(elem, 'th')]] = getHtml(elem, idx > 0 ? 'td' : 'td a')
  })
  batterBoxLive.find('#catcherTbl tbody tr').each((idx, elem) => {
    liveInfo['catcher'] = getHtml(elem, 'td')
  })

  const inningScore = $(html).find('#inningScore')
  liveInfo['inning'] = getHtml(inningScore, '.currentInning')

  const nowCount = {}
  nowCount['B'] = getHtml(inningScore, 'table tbody tr.ball td')
  nowCount['S'] = getHtml(inningScore, 'table tbody tr.strike td')
  nowCount['O'] = getHtml(inningScore, 'table tbody tr.out td')
  liveInfo['ballCount'] = nowCount

  liveInfo['onBase'] = convertOnBase(html)

  const pitchBallInfo = {}
  $(html).find('#pitchingBallTbl tbody tr').each((idx, elem) => {
    pitchBallInfo[convertKey[getHtml(elem, 'th')]] = getHtml(elem, 'td')
  })
  liveInfo['pichBall'] = pitchBallInfo

  const batterInfo = {}
  $(html).find('#batterTbl tbody tr').each((idx, elem) => {
    batterInfo[convertKey[getHtml(elem, 'th')]] = getHtml(elem, idx > 0 ? 'td' : 'td a')
  })
  liveInfo['batterInfo'] = batterInfo

  // `#pitchesMap .wrapper ul` はスルー & `#pitchesMap .batter` を調査
  // console.log($(html).find('#pitchesMap .batter').html())

  if ($(html).find('#batting-label').length) {
    liveInfo['battingResult'] = {
      name: getHtml(html, '#batting-label .name'),
      result: getHtml(html, '#batting-label .bat-result'),
      other: getHtml(html, '#batting-label .other-event'),
    }
  } else { liveInfo['battingResult'] = {} }

  const pitchingResults = []
  $(html).find('#ballResultData tbody tr').each((idx, elem) => {
    // 指定テーブルの2行目以降
    if (idx > 0) {
      const pitchingResult = {}
      // 打席結果確定前
      if ($(elem).find('td').length > 1) {
        pitchingResult.pitchCnt = getHtml(elem, '.count')
        pitchingResult.result = getHtml(elem, '.result')
        pitchingResult.type = getHtml(elem, '.type')
        pitchingResult.speed = getHtml(elem, '.speed')
      // 結果確定時
      } else {
        pitchingResult.result = getHtml(elem, 'td')
      }
      pitchingResults.push(pitchingResult)
    }
  })
  liveInfo.pitchingResult = pitchingResults

  outputJson.liveInfo = liveInfo
  // ------------------------- /liveInfo -------------------------

  // ------------------------- save as json file -------------------------
  fs.writeFile(
    `${jsonPath}/${ballCnt}.json`,
    JSON.stringify(outputJson, null, '  '),
    (err) => { if (err) console.log(err) }
  )
}

/**
 * ファイル保存関数
 * 
 * @param {object} nightmare
 * @param {string} document
 * @param {number} ballCnt
 * @param {string} jsonPath
 * @param {string} htmlPath
 * @param {string} screenshotPath
 */
const saveAsFile = function * (nightmare, html, ballCnt, jsonPath, htmlPath, screenshotPath) {
  if (saveMode == SAVE_MODE_JSON) {
    yield saveAsJson(html, jsonPath, ballCnt)
    console.log(`----- saved: ${jsonPath}/${ballCnt}.json -----`)
    fs.writeFile(`${htmlPath}/${ballCnt}.html`, html, (err) => { if (err) console.log(err) })
    console.log(`----- saved: ${jsonPath}/${ballCnt}.html -----`)
  } else if (saveMode == SAVE_MODE_HTML) {
    fs.writeFile(`${htmlPath}/${ballCnt}.html`, html, (err) => { if (err) console.log(err) })
    yield nightmare.screenshot(`${screenshotPath}/${ballCnt}.png`)
    console.log(`----- saved: ${jsonPath}/${ballCnt}.html -----`)
  }
}

/**
 * リアルタイム速報ページオープン
 * 
 * @param {object} nightmare
 * @param {string} targetDate YYYYMMDD
 * @param {string} targetGameNo
 * @param {string} targetUrl
 */
funcWebNightmare.getAndSaveData = function * (nightmare, targetDate, targetGameNo, targetUrl) {
  try {
    // let url = baseUrl + date + gameNo + '/0001.html?sj_PageID=GA2125923_00_0ball'
    // create save directory
    let screenshotPath = '', htmlPath = '', jsonPath = ''
    if (saveMode == SAVE_MODE_JSON) {
      jsonPath = yield checkAndCreateDir(jsonBasePath, targetDate, targetGameNo).then(r => r).catch(e => { throw e })
      htmlPath = yield checkAndCreateDir(htmlBasePath, targetDate, targetGameNo).then(r => r).catch(e => { throw e })
    } else if (saveMode == SAVE_MODE_HTML) {
      screenshotPath = yield checkAndCreateDir(screeshotBasePath, targetDate, targetGameNo).then(r => r).catch(e => { throw e })
      htmlPath = yield checkAndCreateDir(htmlBasePath, targetDate, targetGameNo).then(r => r).catch(e => { throw e })
    }

    const inning1TopSelect = '#sj-score-in9 .first .in1 a'
    const prvBatterBtnSelect = replaceBtnName('prevBatter')
    // const nxtBatterBtnSelect = replaceBtnName('nextBatter')
    const prvBallBtnSelect = replaceBtnName('prevBall')
    const nxtBallBtnSelect = replaceBtnName('nextBall')

    // リアルタイム速報
    yield nightmare
      .goto(targetUrl).wait(waitSelect)
      // 1回表のスコア押下
      .click(inning1TopSelect).wait(waitSelect)

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

      yield saveAsFile(nightmare, document, ballCnt, jsonPath, htmlPath, screenshotPath)
      //「前の球」ボタン押下
      yield nightmare
        .click(prvBallBtnSelect)
        .wait(waitSelect)
    }

    // 1番打者の1球目情報保存
    const documentFitstBall = yield nightmare.evaluate(() => document.body.innerHTML)
    yield saveAsFile(nightmare, documentFitstBall, 1, jsonPath, htmlPath, screenshotPath)

    // 1回表 2番打者の1球目から情報取得再開 (1回表 1番打者終了後で「次の球」押下)
    for (let fstBtrCnt = 0; fstBtrCnt < batterMaxBallCnt - 1; fstBtrCnt++) {
      yield nightmare
        .click(nxtBallBtnSelect)
        .wait(waitSelect)
    }

    let ballCnt = ++batterMaxBallCnt

    // 試合終了まで情報取得を繰り返す
    if (! isTest) {
      while (1) {
        //「次の球」ボタン押下
        let document = yield nightmare
          .click(nxtBallBtnSelect)
          .wait(waitSelect)
          .evaluate(() => document.body.innerHTML)

        yield saveAsFile(nightmare, document, ballCnt, jsonPath, htmlPath, screenshotPath)

        if ($(document).find('#game-end').html()) break

        ballCnt++
      }
    }

  } catch (e) { if (e) throw e }
}

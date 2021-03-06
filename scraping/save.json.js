'use strict'

/**
 * 
 */
const saveJson = module.exports = {}

const fs = require('fs')

const { JSDOM } = require('jsdom')
const { window } = new JSDOM('')
const $ = require('jquery')(window)

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

saveJson.saveAsJson = function * (html, jsonPath, ballCnt) {
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
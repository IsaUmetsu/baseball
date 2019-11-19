'use strict'

const moment = require('moment')

const SAVE_MODE_HTML = 1
const SAVE_MODE_JSON = 2

module.exports = {
  // 可変値
  saveMode          : SAVE_MODE_JSON,
  isTest            : false,                          // テスト（各試合最初の打者1名のみの動作確認か） 
  day               : moment('2019-03-29'),           // 処理対象日
  seasonStart       : moment('2019-03-29'),           // 処理対象期間
  seasonEnd         : moment('2019-03-29'),           //    〃
  gameNo            : '06',                           // 処理対象試合番号
  waitSelect        : '#indexLayout',                 // for nightmare wait function
  // waitSelect        : '#batterBoxLive',               // for nightmare wait function
  // 固定値
  screeshotBasePath : './scraping/screenshot',        // save path
  htmlBasePath      : './scraping/html',              //    〃
  jsonBasePath      : './scraping/json',              //    〃
  nikkanBaseUrl     : 'https://www.nikkansports.com', // target page url
  SAVE_MODE_HTML,
  SAVE_MODE_JSON,
}
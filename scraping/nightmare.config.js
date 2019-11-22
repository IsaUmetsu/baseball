"use strict";

const moment = require("moment");

const SAVE_MODE_HTML = 1;
const SAVE_MODE_JSON = 2;

const unifiedDate = true;
const targetDay = "2019-03-30";

let seasonStartDay = "2019-03-30";
let seasonEndDay = "2019-03-29";

if (unifiedDate) {
  seasonStartDay = targetDay;
  seasonEndDay = targetDay;
}

const convertFS = { 1: "表", 2: "裏" };

module.exports = {
  // 可変値
  saveMode: 2,
  isTest: false, // テスト（各試合最初の打者1名のみの動作確認か）
  day: moment(targetDay), // 処理対象日
  seasonStart: moment(seasonStartDay), // 処理対象期間
  seasonEnd: moment(seasonEndDay), //    〃
  startGameNo: "06", // 処理対象開始試合番号
  endGameNo: "06", // 処理対象終了試合番号
  waitSelect: "#indexLayout", // for nightmare wait function // '#batterBoxLive'
  getAll: true,
  startBallCnt: 332,
  startInning: 9,
  startFS: convertFS[2],
  // 固定値
  screeshotBasePath: "./scraping/screenshot", // save path
  htmlBasePath: "./scraping/html", //    〃
  jsonBasePath: "./scraping/json", //    〃
  nikkanBaseUrl: "https://www.nikkansports.com", // target page url
  SAVE_MODE_HTML,
  SAVE_MODE_JSON
};

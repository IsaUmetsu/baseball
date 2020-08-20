"use strict";

/**
 *
 */
const funcWebNightmare = (module.exports = {});

const fs = require("fs");

const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

const logger = require("./logger.nightmare");

const {
  saveMode,
  SAVE_MODE_HTML,
  SAVE_MODE_JSON,
  isTest,
  waitSelect,
  screeshotBasePath,
  htmlBasePath,
  jsonBasePath,
  getAll,
  startBallCnt,
  startInning,
  startFS
} = require("./nightmare.config");
const { checkAndCreateDir } = require("../func");
const { saveAsJson } = require("./save.json");

const replaceBtnName = btnName =>
  '#ball-nav a[sj-click="controller:${btnName}"]'.replace(
    "${btnName}",
    btnName
  );

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
const saveAsFile = function*(
  nightmare,
  html,
  ballCnt,
  jsonPath,
  htmlPath,
  screenshotPath,
  date,
  gameNo
) {
  if (saveMode == SAVE_MODE_JSON) {
    yield saveAsJson(html, jsonPath, ballCnt);
  } else if (saveMode == SAVE_MODE_HTML) {
    fs.writeFile(`${htmlPath}/${ballCnt}.html`, html, err => {
      if (err) console.log(err);
    });
    yield nightmare.screenshot(`${screenshotPath}/${ballCnt}.png`);
  }
  logger.debug(`[${ballCnt}] saved. date: ${date}, gameNo: ${gameNo}`);
};

/**
 * リアルタイム速報ページオープン
 *
 * @param {object} nightmare
 * @param {string} targetDate YYYYMMDD
 * @param {string} targetGameNo
 * @param {string} targetUrl
 */
funcWebNightmare.getAndSaveData = function*(
  nightmare,
  targetDate,
  targetGameNo,
  targetUrl
) {
  try {
    // let url = baseUrl + date + gameNo + '/0001.html?sj_PageID=GA2125923_00_0ball'
    // create save directory
    let screenshotPath = "",
      htmlPath = "",
      jsonPath = "";
    if (saveMode == SAVE_MODE_JSON) {
      jsonPath = yield checkAndCreateDir(jsonBasePath, targetDate, targetGameNo)
        .then(r => r)
        .catch(e => {
          throw e;
        });
      /**
      htmlPath = yield checkAndCreateDir(htmlBasePath, targetDate, targetGameNo)
        .then(r => r)
        .catch(e => {
          throw e;
        });
      */
    } else if (saveMode == SAVE_MODE_HTML) {
      screenshotPath = yield checkAndCreateDir(
        screeshotBasePath,
        targetDate,
        targetGameNo
      )
        .then(r => r)
        .catch(e => {
          throw e;
        });
      htmlPath = yield checkAndCreateDir(htmlBasePath, targetDate, targetGameNo)
        .then(r => r)
        .catch(e => {
          throw e;
        });
    }

    const inning1TopSelect = "#sj-score-in9 .first .in1 a";
    const inningSelect = (fitstSecond, inning) =>
      `#sj-score-in9 .${fitstSecond} .in${inning} a`;
    const prvBatterBtnSelect = replaceBtnName("prevBatter");
    // const nxtBatterBtnSelect = replaceBtnName('nextBatter')
    const prvBallBtnSelect = replaceBtnName("prevBall");
    const nxtBallBtnSelect = replaceBtnName("nextBall");
    const converterFS = { 表: "first", 裏: "second" };

    // リアルタイム速報
    yield nightmare.goto(targetUrl).wait(waitSelect);

    let ballCnt = 1;
    let currentInning = "";

    // 1回表の先頭打者から全て取得する場合、1回表を押して先頭打者の初球までさかのぼる
    // 指定イニングから取得する場合、その直前のイニングを押して「次の球」ボタンを押す
    if (getAll) {
      // 1回表のスコア押下
      yield nightmare.click(inning1TopSelect).wait(waitSelect);

      let batterMaxBallCnt = 0;
      // 1回表 3アウト目の打者から1アウト目までさかのぼる
      while (1) {
        let { isFirstBatter, pitchCnt, document } = yield nightmare.evaluate(
          () => {
            let doc = $(document);
            // 打者の打順を取得
            let firstTeamOrderArea = doc.find(
              "#playerListIndex .data-view :first"
            );
            let nowBatterClass = firstTeamOrderArea
              .find("caption")
              .attr("class");
            let nowBatterOrder = firstTeamOrderArea
              .find("td." + nowBatterClass)
              .html();
            // 現在の投手の球数と打者の打席内での合計投球数
            let pitchCnt = doc
              .find("#pitcherTbl tr:nth-child(2) td")
              .html()
              .replace("球", "");
            let batterBallCnt = doc
              .find("#pitchingBallTbl tr:nth-child(1) td")
              .html()
              .replace("球目", "");

            return {
              isFirstBatter: pitchCnt == batterBallCnt && nowBatterOrder == 1,
              pitchCnt,
              document: document.body.innerHTML
            };
          }
        );

        // 1回表の最初の打者の結果に到達したら処理終了
        if (isFirstBatter) {
          batterMaxBallCnt = pitchCnt;
          break;
        }
        //「前の打者」ボタン押下
        yield nightmare.click(prvBatterBtnSelect).wait(waitSelect);
      }

      // 1回表 先頭打者の1球目までさかのぼる
      while (1) {
        let { isFirstBall, ballCnt, document } = yield nightmare.evaluate(
          () => {
            let doc = $(document);
            // 現在の投手の球数と打者の打席内での合計投球数
            let pitchCnt = doc
              .find("#pitcherTbl tr:nth-child(2) td")
              .html()
              .replace("球", "");
            let batterBallCnt = doc
              .find("#pitchingBallTbl tr:nth-child(1) td")
              .html()
              .replace("球目", "");

            return {
              isFirstBall: pitchCnt == 1 && batterBallCnt == 1,
              ballCnt: pitchCnt,
              document: document.body.innerHTML
            };
          }
        );

        // 1回表の最初の打者の結果に到達したら処理終了
        if (isFirstBall) break;

        yield saveAsFile(
          nightmare,
          document,
          ballCnt,
          jsonPath,
          htmlPath,
          screenshotPath,
          targetDate,
          targetGameNo
        );
        //「前の球」ボタン押下
        yield nightmare.click(prvBallBtnSelect).wait(waitSelect);
      }

      // 1番打者の1球目情報保存
      const documentFitstBall = yield nightmare.evaluate(
        () => document.body.innerHTML
      );
      yield saveAsFile(
        nightmare,
        documentFitstBall,
        1,
        jsonPath,
        htmlPath,
        screenshotPath,
        targetDate,
        targetGameNo
      );

      // 1回表 2番打者の1球目から情報取得再開 (1回表 1番打者終了後で「次の球」押下)
      for (let fstBtrCnt = 0; fstBtrCnt < batterMaxBallCnt - 1; fstBtrCnt++) {
        yield nightmare.click(nxtBallBtnSelect).wait(waitSelect);
      }

      ballCnt = ++batterMaxBallCnt;
      currentInning = "1回表";
    } else {
      ballCnt = startBallCnt;
      currentInning = `${startInning}回${startFS}`;

      let currentInningNum = Number(currentInning.slice(0, -2));
      let prevInningNum =
        currentInning.indexOf("表") > -1
          ? currentInningNum - 1
          : currentInningNum;
      let prevFB = currentInning.indexOf("表") > -1 ? "裏" : "表";
      // 指定のイニングの直前を押下
      yield nightmare
        .click(inningSelect(converterFS[prevFB], prevInningNum))
        .wait(waitSelect);
    }

    // 試合終了まで情報取得を繰り返す
    if (!isTest) {
      while (1) {
        try {
          //「次の球」ボタン押下
          let document = yield nightmare
            .click(nxtBallBtnSelect)
            .wait(waitSelect)
            .evaluate(() => document.body.innerHTML);
        } catch (e) {
          console.log("--- catched!! ---");
          console.log(e);
          throw e;
        }

        let rstCurrentInning = $(document)
          .find(".currentInning")
          .html();
        logger.debug(
          `[${ballCnt}] execute: ${rstCurrentInning}, now: ${currentInning}`
        );

        let continuable = true;
        if (currentInning != rstCurrentInning) {
          let currentInningNum = Number(currentInning.slice(0, -2));
          let nextInningNum =
            currentInning.indexOf("裏") > -1
              ? currentInningNum + 1
              : currentInningNum;
          let nextFB = currentInning.indexOf("表") > -1 ? "裏" : "表";

          let expectedInning = `${nextInningNum}回${nextFB}`;
          logger.debug(
            `[${ballCnt}] execute: ${rstCurrentInning}, expected: ${expectedInning}`
          );
          // 期待するイニングと異なる場合、現在のイニングを再度押下する
          if (expectedInning != rstCurrentInning) {
            continuable = false;
            yield nightmare
              .click(
                inningSelect(
                  converterFS[currentInning.slice(-1)],
                  currentInningNum
                )
              )
              .wait(waitSelect);
            // 期待通りの場合、現在のイニングを更新
          } else {
            currentInning = expectedInning;
          }
        }

        if (continuable) {
          yield saveAsFile(
            nightmare,
            document,
            ballCnt,
            jsonPath,
            htmlPath,
            screenshotPath,
            targetDate,
            targetGameNo
          );
          if (
            $(document)
              .find("#game-end")
              .html()
          )
            break;
          ballCnt++;
        }
      }
    }
  } catch (e) {
    if (e) throw e;
  }
};

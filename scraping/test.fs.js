const fs = require("fs");

const date = "20190403";
const gameNo = "03";
const basePath = `./scraping/json/${date}/${gameNo}/`;

fs.readdir(basePath, (err, files) => {
  if (err) {
    console.log(err);
    return;
  }

  for (let ballCnt = 1; ballCnt <= files.length; ballCnt++) {
    const { liveInfo } = require(`./json/${date}/${gameNo}/${ballCnt}.json`);
    const {
      pitcher,
      inning,
      ballCount: { B, S, O },
      pichBall: { result, ballType, speed },
      batterInfo: { batter },
      pitchingResult
    } = liveInfo;

    let displayResult;
    if (!pitcher || !batter) {
      displayResult = pitchingResult[pitchingResult.length - 1].result;
    } else {
      displayResult = `P:${pitcher} B:${batter} ${ballType} ${speed} ${result}`;
    }
    console.log(`[${ballCnt}] ${inning} ${O}アウト ${B}-${S} ${displayResult}`);
  }
});

// 2019033001 5回表 133〜

import { checkArgDaySeasonEndSpecify } from "./util/display";
import { createConnection } from "typeorm";
import { savePitchData } from "./util/process";
import { getDayInfo } from './util/day';

const { D, SE, S } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);
const { seasonStart, seasonEnd } = getDayInfo(targetDay, seasonEndArg);

// Execute
(async () => {
  try {
    await createConnection('default');
    await savePitchData(targetDay, seasonStart, seasonEnd, specifyArg);
  } catch (err) {
    console.log(err);
  }
})();

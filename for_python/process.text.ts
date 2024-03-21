import { checkArgDaySeasonEndSpecify } from "./util/display";
import { saveText } from './util/process';
import { getDayInfo, getYear } from './util/day';
import { AppDataSource } from "./util/datasource";

const { D, SE, S } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);
const { seasonStart, seasonEnd } = getDayInfo(targetDay, seasonEndArg);
const YEAR = getYear();

// Execute
(async () => {
  try {
    await AppDataSource.initialize();
    await saveText(YEAR, targetDay, seasonStart, seasonEnd, specifyArg);
  } catch (err) {
    console.log(err);
  }
})();

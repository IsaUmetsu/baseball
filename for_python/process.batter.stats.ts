import * as moment from "moment";
import { format } from 'util';

import { checkArgDaySeasonEndSpecify } from "./util/display";
import { createConnection } from "typeorm";
import { saveBatAndScoreData } from "./process_util";

const { D, SE, S } = process.env;
let { targetDay, seasonEndArg, specifyArg } = checkArgDaySeasonEndSpecify(D, SE, S);

const seasonStart = moment(format("2020%s", targetDay), "YYYYMMDD");
const seasonEnd = moment(format("2020%s", seasonEndArg), "YYYYMMDD");

// Execute
(async () => {
  try {
    await createConnection('default');
    await saveBatAndScoreData(targetDay, seasonStart, seasonEnd, specifyArg);
  } catch (err) {
    console.log(err);
  }
})();

import * as moment from 'moment';
import { exit } from 'process';
import { getYear } from './util/day';

const targetDay = Number(process.env.d);
if (! targetDay || targetDay < 0 || 7 < targetDay) {
    console.log("0~7で入力してください。");
    exit;
}

const seasonYear = getYear();
const seasonStartDate = "0619";
const dateFormat = "YYYYMMDD";

const startDate = moment(seasonYear + seasonStartDate, dateFormat);
const seasonStart = moment(seasonYear + seasonStartDate, dateFormat);

if (process.env.se && process.env.se.length != 4) {
  console.log('正しく日付指定してください。')
  exit;
}
const seasonEnd = process.env.se ? moment(seasonYear + process.env.se, dateFormat) : moment();

const dateList: string[] = [];
while (startDate.isSameOrAfter(seasonStart) && startDate.isSameOrBefore(seasonEnd)) {
    if (startDate.day() == targetDay) dateList.push(startDate.format("\"YYYYMMDD\""));
    startDate.add(1, "days");
}

console.log(dateList.join(","));

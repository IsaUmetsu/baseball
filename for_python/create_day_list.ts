import * as moment from 'moment';

const targetDay = 2;
const seasonStartDate = "2020-06-19";

const seasonStart = moment(seasonStartDate);
const seasonEnd = moment("2020-08-23");
const startDate = moment(seasonStartDate);

const dateList: string[] = [];

while (startDate.isSameOrAfter(seasonStart) && startDate.isSameOrBefore(seasonEnd)) {
    if (startDate.day() == targetDay) dateList.push(startDate.format("\"YYYYMMDD\""));
    startDate.add(1, "days");
}

console.log(dateList.join(","));

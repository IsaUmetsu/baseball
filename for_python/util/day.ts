import * as moment from 'moment';
import { format } from 'util';

export const getDayInfo = (targetDay: string, seasonEndArg: string) => {

    const YEAR = process.env.YEAR ?? moment().format("YYYY");
    const day = moment(format("%s%s", YEAR, targetDay), "YYYYMMDD");
    const seasonStart = moment(format("%s%s", YEAR, targetDay), "YYYYMMDD");
    const seasonEnd = moment(format("%s%s", YEAR, seasonEndArg), "YYYYMMDD");

    return { YEAR, day, seasonStart, seasonEnd };
}

export const getYear = () => {
    return process.env.YEAR ?? moment().format("YYYY");
}
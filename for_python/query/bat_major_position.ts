import { format } from "util";

import { AppDataSource } from "../util/datasource";
import { leagueList, posFullDic, posArgDic } from '../constant';
import { checkArgPs, checkArgTMLG, displayResult, trimRateZero } from "../util/display";
import { getIsTweet, tweetMulti } from '../util/tweet';
import { getYear } from '../util/day';
const YEAR = getYear();

// Execute
(async () => {
  await AppDataSource.initialize();
  const teamArg = process.env.TM;
  const leagueArg = process.env.LG;

  const teams = checkArgTMLG(teamArg, leagueArg);
  if (! teams.length) return;

  let positions = [];
  const pos = checkArgPs(process.env.PS);
  if (! pos) {
    positions = Object.values(posArgDic);
  } else {
    positions.push(pos);
  }

  const manager = await AppDataSource.manager;

  for (const position of positions) {
    const results = await manager.query(`
      SELECT
        REPLACE(name, ' ', '') AS batter,
        b_team AS tm,
        SUM(ab) AS ab,
        SUM(hit) AS hit,
        ROUND(SUM(hit) / SUM(ab), 3) AS ave,
        SUM(hr) AS hr,
        SUM(rbi) AS rbi
      FROM
        baseball_${YEAR}.stats_batter sb
      WHERE
        (sb.name, b_team) IN (
          SELECT
            A.name, A.b_team
          FROM (
            SELECT
              name,
              b_team,
              SUM(ab) AS ab
            FROM
              baseball_${YEAR}.stats_batter sb
            WHERE
              position LIKE '%${position}%'
            GROUP BY
              name,
              b_team
          ) AS A
          LEFT JOIN (
            SELECT
              b_team,
              MAX(ab) AS ab
            FROM (
              SELECT
                name,
                b_team,
                SUM(ab) AS ab
              FROM
                baseball_${YEAR}.stats_batter sb
              WHERE
                position LIKE '%${position}%'
              GROUP BY
                name,
                b_team
              ) AS A
            GROUP BY b_team
          ) AS B ON A.b_team = B.b_team AND A.ab = B.ab
          WHERE B.b_team IS NOT NULL
        )
        AND b_team IN ('${teams.join("', '")}')
      GROUP BY
        name,
        b_team
      HAVING
        ave IS NOT NULL
      ORDER BY
        ave DESC
    `);

    const [ posEn ] = Object.entries(posArgDic).find(([, value]) => value == position);

    const title = format("%s打者 主要%s手 打撃成績\n", leagueArg ? leagueList[leagueArg] + '6' : 'NPB12', posFullDic[posEn]);
    const rows = [];
    for (const result of results) {
      const { batter, tm, ab, hit, ave, hr, rbi } = result;

      rows.push(format(
        '\n%s(%s) %s (%s-%s) %s本 %s打点',
        batter, tm, trimRateZero(ave), ab, hit, hr, rbi
      ));
    }

    if (getIsTweet()) {
      await tweetMulti(title, rows);
    } else {
      displayResult(title, rows);
    }
  }
})();

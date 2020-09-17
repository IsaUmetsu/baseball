import { format } from 'util';
import * as moment from 'moment';

import { createConnection, getManager } from 'typeorm';
import { leagueList } from '../constant';
import { checkArgTMLG, displayResult, trimRateZero } from '../disp_util';

// Execute
(async () => {
  await createConnection('default');

  const teamArg = process.env.TM;
  const league = process.env.LG;
  const teams = checkArgTMLG(teamArg, league);
  if (! teams.length) return;

  let domainHandArg = process.env.DH;
  if (! domainHandArg) {
    console.log('DH=[L/R(投手利き腕)] の指定がありません');
    return;
  } else if (domainHandArg != 'L' && domainHandArg != 'R') {
    console.log('DH=[投手利き腕] は L or R で指定してください');
    return;
  }

  const domainHandList = { 'L': '左', 'R': '右' };
  const dh = domainHandArg.toLowerCase();

  const manager = await getManager();
  const results = await manager.query(`
    SELECT 
      REPLACE(total.current_batter_name, ' ', '') AS current_batter_name,
      total.b_team,
      pa, ab, hit,
      ave,
      r_pa, r_ab, r_hit,
      r_ave,
      (r_ave - ave) AS r_diff,
      l_pa, l_ab, l_hit,
      l_ave,
      (l_ave - ave) AS l_diff,
      '' AS eol
    FROM
      (SELECT 
          base.current_batter_name,
              base.b_team,
              SUM(is_pa) AS pa,
              SUM(is_ab) AS ab,
              SUM(is_hit) AS hit,
              ROUND(SUM(is_hit) / SUM(is_ab), 3) AS ave,
              game.game_cnt
      FROM
          baseball_2020.debug_base base
      LEFT JOIN (SELECT 
          tm.team_initial_kana AS team_initial,
              away.game_cnt AS away_game_cnt,
              home.game_cnt AS home_game_cnt,
              away.game_cnt + home.game_cnt AS game_cnt,
              '' AS eol
      FROM
          team_master tm
      LEFT JOIN (SELECT 
          away_team_initial AS team_initial,
              COUNT(away_team_initial) AS game_cnt
      FROM
          baseball_2020.game_info
      WHERE
          no_game = 0
      GROUP BY away_team_initial) AS away ON away.team_initial = tm.team_initial_kana
      LEFT JOIN (SELECT 
          1 AS dow,
              home_team_initial AS team_initial,
              COUNT(home_team_initial) AS game_cnt
      FROM
          baseball_2020.game_info
      WHERE
          no_game = 0
      GROUP BY home_team_initial) AS home ON home.team_initial = tm.team_initial_kana) game ON game.team_initial = base.b_team
      WHERE
          CHAR_LENGTH(base.current_batter_name) > 0
      GROUP BY base.current_batter_name , b_team
      HAVING pa >= ${teamArg ? 2 : 3.1} * game_cnt) AS total
          LEFT JOIN
      (SELECT 
          current_batter_name,
              b_team,
              SUM(is_pa) AS r_pa,
              SUM(is_ab) AS r_ab,
              SUM(is_hit) AS r_hit,
              ROUND(SUM(is_hit) / SUM(is_ab), 3) AS r_ave
      FROM
          baseball_2020.debug_base base
      WHERE
          CHAR_LENGTH(current_batter_name) > 0
              AND current_pitcher_domain_hand = '右投'
      GROUP BY current_batter_name , b_team) AS R ON R.current_batter_name = total.current_batter_name
          AND R.b_team = total.b_team
          LEFT JOIN
      (SELECT 
          current_batter_name,
              b_team,
              SUM(is_pa) AS l_pa,
              SUM(is_ab) AS l_ab,
              SUM(is_hit) AS l_hit,
              ROUND(SUM(is_hit) / SUM(is_ab), 3) AS l_ave
      FROM
          baseball_2020.debug_base base
      WHERE
          CHAR_LENGTH(current_batter_name) > 0
              AND current_pitcher_domain_hand = '左投'
      GROUP BY current_batter_name , b_team) AS L ON L.current_batter_name = total.current_batter_name
          AND L.b_team = total.b_team
    WHERE total.b_team IN (${teams.join()})
    ORDER BY ${dh}_ave DESC
  `);
  
  const title = format("%s球団 対%s投手 打率\n", league ? leagueList[league] + '6' : 'NPB12', domainHandList[domainHandArg]);
  const rows = [];
  results.forEach(result => {
    const { current_batter_name, b_team, ave } = result;

    rows.push(format(
      "\n%s (%s-%s) %s(%s)",
      trimRateZero(result[`${dh}_ave`]), result[`${dh}_ab`], result[`${dh}_hit`],
      current_batter_name, b_team
    ));
  });

  displayResult(title, rows);
})();

"use strict";

const { execute, getFilename, cols } = require("./util/func");
const orderNo = [...Array(9).keys()].map(odr => ++odr);

let sql = `-- CREATE TABLE ${getFilename(__filename)}
`;

// -------------------- [select part] --------------------

// player_info
sql += `SELECT
  p.id, p.name, p.team,`;

let stCols = "";
let flCols = "";
// any info(hit, hr, rbi, bat) per inning
orderNo.map(order => {
  sql += `
  IFNULL(od${order}.cnt, 0) AS stmm${order},
  IFNULL(full${order}.cnt, 0) AS full${order},
  CASE WHEN IFNULL(od${order}.cnt, 0) > 0 THEN ROUND(IFNULL(full${order}.cnt, 0)/IFNULL(od${order}.cnt, 0), 5) ELSE 0 END AS rate${order},`;

  stCols += `IFNULL(od${order}.cnt, 0) + `;
  flCols += `IFNULL(full${order}.cnt, 0) + `;
});

// about `total`
sql += `-- 各項目合計`;
sql += `
  CASE WHEN(${cols(stCols)}) > 0 THEN ROUND((${cols(flCols)})/(${cols(stCols)}), 5) ELSE 0 END AS rate,
  ${cols(stCols)} AS stmm,
  ${cols(flCols)} AS flpt,`;

// -------------------- /[select part] --------------------

sql += `
  'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id`;

// -------------------- [left join part] --------------------

// left join part per inning
orderNo.map(order => {
  sql += `
  -- starting member info [${order}]
  LEFT JOIN (
    SELECT
      player,
      COUNT(
        pitch_count = 1
        OR NULL
      ) AS cnt
    FROM
      baseball.order_detail od
      LEFT JOIN no_game_info ng ON ng.order_overview_id = od.order_overview_id
      LEFT JOIN post_season_info ps ON ps.oo_id = od.order_overview_id
    WHERE
      batting_order = ${order}
      AND pitch_count = 1
      AND ng.order_overview_id IS NULL
      AND ps.oo_id IS NULL
    GROUP BY
      player
  ) AS od${order} ON od${order}.player = pb.id
  -- full participate info [${order}]
  LEFT JOIN (
    SELECT
      stmm.player,
      COUNT(stmm.player) AS cnt
    FROM
      (
        SELECT
          order_overview_id,
          top_bottom,
          batting_order,
          player
        FROM
          order_detail
        WHERE
          pitch_count = 1
      ) AS stmm
      LEFT JOIN (
        SELECT
          od.order_overview_id,
          top_bottom,
          batting_order,
          player
        FROM
          order_detail od
          LEFT JOIN _max_pitch_count_per_game mp ON mp.order_overview_id = od.order_overview_id
        WHERE
          od.pitch_count = mp.max_pitch_count
      ) fupt ON stmm.order_overview_id = fupt.order_overview_id
      AND stmm.top_bottom = fupt.top_bottom
      AND stmm.batting_order = fupt.batting_order
      LEFT JOIN no_game_info ng ON ng.order_overview_id = stmm.order_overview_id
      LEFT JOIN post_season_info ps ON ps.oo_id = stmm.order_overview_id
    WHERE
      stmm.batting_order = ${order}
      AND stmm.player = fupt.player
      AND ng.order_overview_id IS NULL
      AND ps.oo_id IS NULL
    GROUP BY
      stmm.player
  ) AS full${order} ON full${order}.player = pb.id
  `;
});

// -------------------- /[left join part] --------------------

// end of query
sql += `-- LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;`;

// generate
execute(`${getFilename(__filename)}`, sql);

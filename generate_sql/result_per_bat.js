"use strict";

const { execute, getFilename, cols } = require("./util/func");
const { BATS_COL } = require("../constants");

let sql = `-- CREATE TABLE ${getFilename(__filename)}
-- CREATE TABLE ${getFilename(__filename)}_regulation
`;

// -------------------- [select part] --------------------

// player_info
sql += `SELECT
  pb.id, p.name, p.team,
  `;

let abCols = "",
  paCols = "",
  hitCols = "",
  hrCols = "",
  rbiCols = "",
  abobCols = "",
  obCols = "",
  tbCols = "";
// any info(hit, hr, rbi, bat) per inning
Object.keys(BATS_COL).map(bat => {
  const batName = BATS_COL[bat];
  sql += `-- bat${bat}`;
  // 打率
  sql += `
  IFNULL(${batName}.ave, 0) AS rate${bat},
  IFNULL(${batName}.onbase_ave, 0) AS obrate${bat},
  IFNULL(${batName}.slug_ave, 0) AS slug${bat},
  IFNULL(${batName}.onbase_ave, 0) + IFNULL(${batName}.slug_ave, 0) AS ops${bat},
  IFNULL(${batName}.pa, 0) AS pa${bat},
  IFNULL(${batName}.ab, 0) AS ab${bat},
  IFNULL(${batName}.hit, 0) AS hit${bat},
  IFNULL(${batName}.hr, 0) AS hr${bat},
  IFNULL(${batName}.rbi, 0) AS rbi${bat},
  IFNULL(${batName}.abob, 0) AS abob${bat},
  IFNULL(${batName}.ob, 0) AS ob${bat},
  IFNULL(${batName}.tb, 0) AS tb${bat},
  `;

  abCols += `IFNULL(${batName}.ab, 0) + `;
  paCols += `IFNULL(${batName}.pa, 0) + `;
  hitCols += `IFNULL(${batName}.hit, 0) + `;
  hrCols += `IFNULL(${batName}.hr, 0) + `;
  rbiCols += `IFNULL(${batName}.rbi, 0) + `;
  abobCols += `IFNULL(${batName}.abob, 0) + `;
  obCols += `IFNULL(${batName}.ob, 0) + `;
  tbCols += `IFNULL(${batName}.tb, 0) + `;
});

// about `total`
sql += `-- 各項目合計`;
sql += `CASE WHEN(${cols(abCols)}) > 0 THEN ROUND((${cols(hitCols)})/(${cols(
  abCols
)}), 5) ELSE NULL END AS rate,
  CASE WHEN(${cols(abobCols)}) > 0 THEN ROUND((${cols(obCols)})/(${cols(
  abobCols
)}), 5) ELSE NULL END AS obrate,
  CASE WHEN(${cols(abCols)}) > 0 THEN ROUND((${cols(tbCols)})/(${cols(
  abCols
)}), 5) ELSE NULL END AS slugrate,
  (CASE WHEN(${cols(abobCols)}) > 0 THEN ROUND((${cols(obCols)})/(${cols(
  abobCols
)}), 5) ELSE 0 END) + (CASE WHEN(${cols(abCols)}) > 0 THEN ROUND((${cols(
  tbCols
)})/(${cols(abCols)}), 5) ELSE 0 END) AS ops,
  ${cols(abCols)} AS ab,
  ${cols(paCols)} AS pa,
  ${cols(hitCols)} AS hit,
  ${cols(hrCols)} AS hr,
  ${cols(rbiCols)} AS rbi,
  ${cols(abobCols)} AS abob,
  ${cols(obCols)} AS ob,
  ${cols(tbCols)} AS tb,
  `;

// -------------------- /[select part] --------------------

sql += `'e' AS eol
FROM baseball._player_batter pb
  LEFT JOIN player p ON pb.id = p.id`;

// -------------------- [left join part] --------------------

// left join part per inning
Object.keys(BATS_COL).map(bat => {
  const batName = BATS_COL[bat];
  sql += `-- bat${bat}`;
  // 抽出項目: 打席数、打数、安打数、本塁打、打点、打率、出塁打数、出塁数、出塁率、打数、長打率
  sql += `
  LEFT JOIN (
    SELECT 
		  h.batter,
      COUNT(h.batter OR NULL) AS pa,
      COUNT(eb.name IS NULL OR NULL) AS ab,
      COUNT(hi.rst_id IS NOT NULL OR NULL) AS hit,
      COUNT(hi.rst_id = 9 OR NULL) AS hr,
      SUM(CASE WHEN rbi.RBI IS NOT NULL THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS rbi,
      CASE WHEN COUNT(eb.name IS NULL OR NULL) > 0 THEN ROUND(COUNT(hi.rst_id IS NOT NULL OR NULL) / COUNT(eb.name IS NULL OR NULL), 5) ELSE null END AS ave,
      COUNT(eob.name IS NULL OR NULL) AS abob,
      COUNT(oi.rst_id IS NOT NULL OR NULL) AS ob,
      CASE WHEN COUNT(eob.name IS NULL OR NULL) > 0 THEN ROUND(COUNT(oi.rst_id IS NOT NULL OR NULL) / COUNT(eob.name IS NULL OR NULL), 5) ELSE null END AS onbase_ave,
      COUNT(hi.rst_id IN (2, 3, 4) OR NULL) + COUNT(hi.rst_id = 6 OR NULL) * 2 + COUNT(hi.rst_id = 8 OR NULL) * 3 + COUNT(hi.rst_id = 9 OR NULL) * 4 AS tb,
      CASE WHEN COUNT(eb.name IS NULL OR NULL) > 0 THEN ROUND((COUNT(hi.rst_id IN (2, 3, 4) OR NULL) + COUNT(hi.rst_id = 6 OR NULL) * 2 + COUNT(hi.rst_id = 8 OR NULL) * 3 + COUNT(hi.rst_id = 9 OR NULL) * 4) / COUNT(eb.name IS NULL OR NULL), 5) ELSE null END AS slug_ave
    FROM
        baseball._bat_all_info h
    -- for hit, slugging
    LEFT JOIN exclude_batting_info eb ON h.\`${bat}_result\` = eb.name
    LEFT JOIN hit_id_info hi ON  h.\`${bat}_rst_id\` = hi.rst_id
    -- for onbase
    LEFT JOIN exclude_onbase_info eob ON h.\`${bat}_result\` = eob.name
    LEFT JOIN onbase_id_info oi ON  h.\`${bat}_rst_id\` = oi.rst_id
    -- rbi
    LEFT JOIN _rbi_all rbi on h.\`${bat}_cnt\` = rbi.g_id
    WHERE h.\`${bat}_result\` IS NOT NULL
    GROUP BY batter
  ) AS ${batName} ON ${batName}.batter = pb.id
  `;
});

// -------------------- /[left join part] --------------------

// end of query
sql += `LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;`;

// generate
execute(`${getFilename(__filename)}_base`, sql);

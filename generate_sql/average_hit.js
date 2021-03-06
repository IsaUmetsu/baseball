"use strict";

const { execute, getFilename, cols } = require("./util/func");
const { BATS_COL } = require("../constants");

let sql = `-- CREATE TABLE ${getFilename(__filename)}
`;

// -------------------- [select part] --------------------

// player_info
sql += `SELECT
  pb.id, p.name, p.team,
  `;

let abCols = "";
let paCols = "";
let hitCols = "";
// any info(hit, hr, rbi, bat) per inning
Object.keys(BATS_COL).map(bat => {
  const batName = BATS_COL[bat];
  sql += `-- bat${bat}`;
  // 打率
  sql += `
  IFNULL(${batName}.ave, 0) AS rate${bat},
  IFNULL(${batName}.pa, 0) AS pa${bat},
  IFNULL(${batName}.ab, 0) AS ab${bat},
  IFNULL(${batName}.hit, 0) AS cnt${bat},
  `;

  abCols += `IFNULL(${batName}.ab, 0) + `;
  paCols += `IFNULL(${batName}.pa, 0) + `;
  hitCols += `IFNULL(${batName}.hit, 0) + `;
});

// about `total`
sql += `-- 各項目合計`;
sql += `
  CASE WHEN(${cols(abCols)}) > 0 THEN ROUND((${cols(hitCols)})/(${cols(abCols)}), 5) ELSE NULL END AS rate,
  ${cols(abCols)} AS ab,
  ${cols(paCols)} AS pa,
  ${cols(hitCols)} AS cnt,
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
  sql += `
  LEFT JOIN (
    SELECT 
		  h.batter,
      COUNT(h.batter OR NULL) AS pa,
      COUNT(eb.name IS NULL OR NULL) AS ab,
      COUNT(hi.rst_id IS NOT NULL OR NULL) AS hit,
      CASE WHEN COUNT(eb.name IS NULL OR NULL) > 0 THEN ROUND(COUNT(hi.rst_id IS NOT NULL OR NULL) / COUNT(eb.name IS NULL OR NULL), 5) ELSE null END AS ave
    FROM
        baseball._bat_all_info h
    LEFT JOIN exclude_batting_info eb ON h.\`${bat}_result\` = eb.name
    LEFT JOIN hit_id_info hi ON  h.\`${bat}_rst_id\` = hi.rst_id
    WHERE h.\`${bat}_result\` IS NOT NULL
    GROUP BY batter
  ) AS ${batName} ON ${batName}.batter = pb.id
  `;
});

// -------------------- /[left join part] --------------------

// end of query
sql += `-- LEFT JOIN batter_reaching_regulation br ON pb.id = br.batter WHERE br.batter IS NOT NULL
;`;

// generate
execute(`${getFilename(__filename)}`, sql);

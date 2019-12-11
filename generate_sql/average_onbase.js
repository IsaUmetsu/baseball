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
let obCols = "";
// any info(hit, hr, rbi, bat) per inning
Object.keys(BATS_COL).map(bat => {
  const batName = BATS_COL[bat];
  sql += `-- bat${bat}`;
  // 打率
  sql += `
  IFNULL(${batName}.onbase_ave, 0) AS rate${bat},
  IFNULL(${batName}.pa, 0) AS pa${bat},
  IFNULL(${batName}.ab, 0) AS ab${bat},
  IFNULL(${batName}.ob, 0) AS cnt${bat},
  `;

  paCols += `IFNULL(${batName}.pa, 0) + `;
  abCols += `IFNULL(${batName}.ab, 0) + `;
  obCols += `IFNULL(${batName}.ob, 0) + `;
});

// about `total`
sql += `-- 各項目合計`;
sql += `
  CASE WHEN(${cols(abCols)}) > 0 THEN ROUND((${cols(obCols)})/(${cols(abCols)}), 5) ELSE NULL END AS rate,
  ${cols(paCols)} AS pa,
  ${cols(obCols)} AS ab,
  ${cols(obCols)} AS cnt,
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
      COUNT(eob.name IS NULL OR NULL) AS ab,
      COUNT(oi.rst_id IS NOT NULL OR NULL) AS ob,
      CASE WHEN COUNT(eob.name IS NULL OR NULL) > 0 THEN ROUND(COUNT(oi.rst_id IS NOT NULL OR NULL) / COUNT(eob.name IS NULL OR NULL), 5) ELSE null END AS onbase_ave
    FROM
        baseball._bat_all_info h
    -- for onbase
    LEFT JOIN exclude_onbase_info eob ON h.\`${bat}_result\` = eob.name
    LEFT JOIN onbase_id_info oi ON  h.\`${bat}_rst_id\` = oi.rst_id
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
execute(`${getFilename(__filename)}`, sql);

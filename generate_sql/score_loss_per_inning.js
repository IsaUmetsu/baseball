"use strict";

const { execute, getFilename, cols } = require("./util/func");
const innings = [...Array(12).keys()].map(num => ++num);

// -------------------- [select part] --------------------

let totalScoreCol = "",
  totalLossCol = "",
  totalDiffCol = "",
  insertCols = ["team"], // append insert target cols
  sql = `SELECT
  base.team,`;

// any info(hit, hr, rbi, bat) per inning
innings.map(inning => {
  let col1 = `\`scr${inning}\``,
    col2 = `\`ls${inning}\``,
    col3 = `\`df${inning}\``;

  sql += `
  ing${inning}.score AS ${col1},
  ing${inning}.loss AS ${col2},
  ing${inning}.diff AS ${col3},`;

  totalScoreCol += `IFNULL(ing${inning}.score, 0) + `;
  totalLossCol += `IFNULL(ing${inning}.loss, 0) + `;
  totalDiffCol += `IFNULL(ing${inning}.diff, 0) + `;
  // append insert target cols
  insertCols = [...insertCols, col1, col2, col3];
});

let totalCol1 = "`total_scr`",
  totalCol2 = "`total_ls`",
  totalCol3 = "`total_df`";

// about `total`
sql += `-- 各項目合計`;
sql += `
  ${cols(totalScoreCol)} AS ${totalCol1},
  ${cols(totalLossCol)} AS ${totalCol2},
  ${cols(totalDiffCol)} AS ${totalCol3},
  `;
// append insert target cols
insertCols = [...insertCols, totalCol1, totalCol2, totalCol3, "`eol`"];

// -------------------- /[select part] --------------------

sql += `'e' AS eol
FROM
  (
    SELECT
        team
    FROM _inning_score_loss_info
    GROUP BY team
  ) AS base
`;

// -------------------- [left join part] --------------------

// left join part per inning
innings.map(inning => {
  sql += `
  LEFT JOIN (
    SELECT
        team,
        ining,
        SUM(score) AS score,
        SUM(loss) AS loss,
        SUM(score) - SUM(loss) AS diff,
        'e' AS eol
    FROM _inning_score_loss_info
    WHERE ining = ${inning}
    GROUP BY team, ining
) AS ing${inning} ON base.team = ing${inning}.team`;
});

// -------------------- /[left join part] --------------------

sql =
  `-- CREATE TABLE ${getFilename(__filename)}
-- INSERT INTO ${getFilename(__filename)} (${insertCols.join(",")})

` + sql;

// generate
execute(getFilename(__filename), sql);

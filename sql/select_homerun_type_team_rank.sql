SELECT
  h.id,
  h.team,
  h.cnt,
  h.team_cnt AS total_cnt,
  h.percent,
  rank.rank
FROM
  baseball.homerun_type_team h
  LEFT JOIN (
    SELECT
      id,
      score,
      rank
    FROM
      (
        SELECT
          score,
          percent,
          @rank AS rank,
          cnt,
          @rank := @rank + cnt
        FROM
          (
            SELECT
              @rank := 1
          ) AS Dummy,
          (
            SELECT
              cnt AS score,
              percent,
              Count(*) AS cnt
            FROM
              (
                SELECT
                  *
                FROM
                  homerun_type_team
                WHERE
                  homerun_type = '先制'
              ) AS htb
            GROUP BY
              score,
              percent
            ORDER BY
              score DESC,
              percent DESC
          ) AS GroupBy
      ) AS Ranking
      JOIN (
        SELECT
          *
        FROM
          homerun_type_team
        WHERE
          homerun_type = '先制'
      ) AS htb ON htb.cnt = Ranking.score
      AND htb.percent = Ranking.percent
    ORDER BY
      rank ASC
  ) AS rank ON rank.id = h.id
WHERE
  h.homerun_type = '先制' -- ORDER  BY h.cnt ASC, h.percent ASC
ORDER BY
  h.percent ASC
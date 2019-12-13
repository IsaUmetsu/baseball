create table _inning_score_info

SELECT
  oo_id, ining, top_bottom,
  SUM((
    CASE
      WHEN next_1b_go = 4 THEN 1
      ELSE 0
    END
  ) + (
    CASE
      WHEN next_2b_go = 4 THEN 1
      ELSE 0
    END
  ) + (
    CASE
      WHEN next_3b_go = 4 THEN 1
      ELSE 0
    END
  ) + (
    CASE
      WHEN rst_id = 9 THEN 1
      ELSE 0
    END
  )) AS score
FROM
  baseball._homein_all
group by ining, top_bottom, oo_id
order by oo_id, ining, top_bottom
;
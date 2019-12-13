-- create table _homein_all
-- insert into _homein_all (`g_id`,`order_overview_id`,`ining`,`top_bottom`,`pitcher`,`batter`,`strike`,`ball`,`out`,`runner_1b`,`next_1b_go`,`runner_2b`,`next_2b_go`,`runner_3b`,`next_3b_go`,`is_commit`,`rst_id`,`result`,`direction`,`ball_flow`,`g_id_prv`)

SELECT
  *
FROM
  baseball._situation_base
WHERE
  (
    next_1b_go = 4
    OR next_2b_go = 4
    OR next_3b_go = 4
  )
  OR rst_id = 9
;
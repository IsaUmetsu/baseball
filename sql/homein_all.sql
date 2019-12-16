-- create table _homein_all
-- insert into _homein_all (`g_id`,`oo_id`,`date`,`location`,`ining`,`top_bottom`,`pitcher`,`batter`,`name`,`team`,`strike`,`ball`,`out`,`on_all_base`,`runner_1b`,`next_1b_go`,`runner_2b`,`next_2b_go`,`runner_3b`,`next_3b_go`,`bp_count`,`is_commit`,`rst_id`,`result`,`t_total`,`b_total`,`prv_gid`,`bat_cnt`)

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
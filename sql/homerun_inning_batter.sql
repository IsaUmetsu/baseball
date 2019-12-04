-- CREATE TABLE homerun_inning_batter 
-- INSERT INTO homerun_inning_batter (`id`,`name`,`team`,`oen_hr`,`two_hr`,`thr_hr`,`fur_hr`,`fiv_hr`,`six_hr`,`sev_hr`,`egt_hr`,`nin_hr`,`ten_hr`,`elv_hr`,`twl_hr`,`total_hr`,`oen_bat`,`two_bat`,`thr_bat`,`fur_bat`,`fiv_bat`,`six_bat`,`sev_bat`,`egt_bat`,`nin_bat`,`ten_bat`,`elv_bat`,`twl_bat`,`total_bat`,`oen_ttl_pct`,`two_ttl_pct`,`thr_ttl_pct`,`fur_ttl_pct`,`fiv_ttl_pct`,`six_ttl_pct`,`sev_ttl_pct`,`egt_ttl_pct`,`nin_ttl_pct`,`ten_ttl_pct`,`elv_ttl_pct`,`twl_ttl_pct`,`oen_situ_pct`,`two_situ_pct`,`thr_situ_pct`,`fur_situ_pct`,`fiv_situ_pct`,`six_situ_pct`,`sev_situ_pct`,`egt_situ_pct`,`nin_situ_pct`,`ten_situ_pct`,`elv_situ_pct`,`twl_situ_pct`,`total_situ_pct`)

SELECT
    pb.id,
    p.name,
    p.team,
    ifnull(oen.hr_cnt, 0)AS oen_hr,
    ifnull(two.hr_cnt, 0) AS two_hr,
    ifnull(thr.hr_cnt, 0) AS thr_hr,
    ifnull(fur.hr_cnt, 0) AS fur_hr,
    ifnull(fiv.hr_cnt, 0) AS fiv_hr,
    ifnull(six.hr_cnt, 0) AS six_hr,
    ifnull(sev.hr_cnt, 0) AS sev_hr,
    ifnull(egt.hr_cnt, 0) AS egt_hr,
    ifnull(nin.hr_cnt, 0) AS nin_hr,
    ifnull(ten.hr_cnt, 0) AS ten_hr,
    ifnull(elv.hr_cnt, 0) AS elv_hr,
    ifnull(twl.hr_cnt, 0) AS twl_hr,
    ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0) AS total_hr,
    ifnull(oen.bat_cnt, 0) AS oen_bat,
    ifnull(two.bat_cnt, 0) AS two_bat,
    ifnull(thr.bat_cnt, 0) AS thr_bat,
    ifnull(fur.bat_cnt, 0) AS fur_bat,
    ifnull(fiv.bat_cnt, 0) AS fiv_bat,
    ifnull(six.bat_cnt, 0) AS six_bat,
    ifnull(sev.bat_cnt, 0) AS sev_bat,
	ifnull(egt.bat_cnt, 0) AS egt_bat,
    ifnull(nin.bat_cnt, 0) AS nin_bat,
    ifnull(ten.bat_cnt, 0) AS ten_bat,
    ifnull(elv.bat_cnt, 0) AS elv_bat,
    ifnull(twl.bat_cnt, 0) AS twl_bat,
    ifnull(oen.bat_cnt, 0) + ifnull(two.bat_cnt, 0) + ifnull(thr.bat_cnt, 0) + ifnull(fur.bat_cnt, 0) + ifnull(fiv.bat_cnt, 0) + ifnull(six.bat_cnt, 0) + ifnull(sev.bat_cnt, 0) + ifnull(egt.bat_cnt, 0) + ifnull(nin.bat_cnt, 0) + ifnull(ten.bat_cnt, 0) + ifnull(elv.bat_cnt, 0) + ifnull(twl.bat_cnt, 0) AS total_bat,
    -- percent of total
    round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then oen.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS oen_ttl_pct,
    round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then two.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS two_ttl_pct,
    round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then thr.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS thr_ttl_pct,
    round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then fur.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS fur_ttl_pct,
    round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then fiv.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS fiv_ttl_pct,
    round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then six.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS six_ttl_pct,
    round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then sev.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS sev_ttl_pct,
	round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then egt.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS egt_ttl_pct,
	round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then nin.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS nin_ttl_pct,
	round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then ten.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS ten_ttl_pct,
	round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then elv.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS elv_ttl_pct,
	round(case when ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) != 0 then twl.hr_cnt / (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) else 0 end, 4) AS twl_ttl_pct,
	-- percent of situation bat
    round(case when oen.bat_cnt is not null then oen.hr_cnt / oen.bat_cnt else 0 end, 4) AS oen_situ_pct,
    round(case when two.bat_cnt is not null then two.hr_cnt / two.bat_cnt else 0 end, 4) AS two_situ_pct,
    round(case when thr.bat_cnt is not null then thr.hr_cnt / thr.bat_cnt else 0 end, 4) AS thr_situ_pct,
    round(case when fur.bat_cnt is not null then fur.hr_cnt / fur.bat_cnt else 0 end, 4) AS fur_situ_pct,
    round(case when fiv.bat_cnt is not null then fiv.hr_cnt / fiv.bat_cnt else 0 end, 4) AS fiv_situ_pct,
    round(case when six.bat_cnt is not null then six.hr_cnt / six.bat_cnt else 0 end, 4) AS six_situ_pct,
    round(case when sev.bat_cnt is not null then sev.hr_cnt / sev.bat_cnt else 0 end, 4) AS sev_situ_pct,
	round(case when egt.bat_cnt is not null then egt.hr_cnt / sev.bat_cnt else 0 end, 4) AS egt_situ_pct,
	round(case when nin.bat_cnt is not null then nin.hr_cnt / sev.bat_cnt else 0 end, 4) AS nin_situ_pct,
	round(case when ten.bat_cnt is not null then ten.hr_cnt / sev.bat_cnt else 0 end, 4) AS ten_situ_pct,
	round(case when elv.bat_cnt is not null then elv.hr_cnt / sev.bat_cnt else 0 end, 4) AS elv_situ_pct,
	round(case when twl.bat_cnt is not null then twl.hr_cnt / sev.bat_cnt else 0 end, 4) AS twl_situ_pct,
    -- percent of homerun par bat
	round(case when ifnull(oen.bat_cnt, 0) + ifnull(two.bat_cnt, 0) + ifnull(thr.bat_cnt, 0) + ifnull(fur.bat_cnt, 0) + ifnull(fiv.bat_cnt, 0) + ifnull(six.bat_cnt, 0) + ifnull(sev.bat_cnt, 0) + ifnull(egt.bat_cnt, 0) + ifnull(nin.bat_cnt, 0) + ifnull(ten.bat_cnt, 0) + ifnull(elv.bat_cnt, 0) + ifnull(twl.bat_cnt, 0) = 0 then 0 else (ifnull(oen.hr_cnt, 0) + ifnull(two.hr_cnt, 0) + ifnull(thr.hr_cnt, 0) + ifnull(fur.hr_cnt, 0) + ifnull(fiv.hr_cnt, 0) + ifnull(six.hr_cnt, 0) + ifnull(sev.hr_cnt, 0) + ifnull(egt.hr_cnt, 0) + ifnull(nin.hr_cnt, 0) + ifnull(ten.hr_cnt, 0) + ifnull(elv.hr_cnt, 0) + ifnull(twl.hr_cnt, 0)) / (ifnull(oen.bat_cnt, 0) + ifnull(two.bat_cnt, 0) + ifnull(thr.bat_cnt, 0) + ifnull(fur.bat_cnt, 0) + ifnull(fiv.bat_cnt, 0) + ifnull(six.bat_cnt, 0) + ifnull(sev.bat_cnt, 0) + ifnull(egt.bat_cnt, 0) + ifnull(nin.bat_cnt, 0) + ifnull(ten.bat_cnt, 0) + ifnull(elv.bat_cnt, 0) + ifnull(twl.bat_cnt, 0)) end, 4)  AS total_situ_pct
FROM
    baseball._player_batter pb
    LEFT JOIN player p ON pb.id = p.id
    -- 1回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
			ining = 1
		GROUP BY batter) AS oen ON oen.batter = pb.id
    -- 2回
    LEFT JOIN (
        SELECT
            batter,
            COUNT(rst_id = 9 OR NULL) AS hr_cnt,
            COUNT(batter) AS bat_cnt
        FROM
            situation_base_commit
        WHERE
			ining = 2
        GROUP BY batter) AS two ON two.batter = pb.id
	-- 3回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining = 3
		GROUP BY batter) AS thr ON thr.batter = pb.id
	-- 4回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
			ining = 4
		GROUP BY batter) AS fur ON fur.batter = pb.id
	-- 5回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining = 5
		GROUP BY batter) AS fiv ON fiv.batter = pb.id
	-- 6回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
			ining = 6
		GROUP BY batter) AS six ON six.batter = pb.id
	-- 7回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining = 7
		GROUP BY batter) AS sev ON sev.batter = pb.id
	-- 8回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining = 8
		GROUP BY batter) AS egt ON egt.batter = pb.id
	-- 9回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining = 9
		GROUP BY batter) AS nin ON nin.batter = pb.id
	-- 10回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining = 10
		GROUP BY batter) AS ten ON ten.batter = pb.id
	-- 11回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining = 11
		GROUP BY batter) AS elv ON elv.batter = pb.id
	-- 12回
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining = 12
		GROUP BY batter) AS twl ON twl.batter = pb.id
	LEFT JOIN homerun_king hk ON hk.player_id = pb.id
;

/*
Error Code: 1064. You have an error in your SQL sevtax; check the manual that corresponds to your MySQL server version fur the right sevtax to use near '(`id`,`name`,`team`,`oen_hr`,`two_hr`,`thr_hr`,``fur`_hr`,`fiv_hr`,`six_hr`,`sev_h' at line 1

*/
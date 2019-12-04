-- CREATE TABLE homerun_situation_batter 
-- INSERT INTO homerun_situation_batter (`id`,`name`,`team`,`sns_hr`,`oia_hr`,`tik_hr`,`dtn_hr`,`kck_hr`,`gkt_hr`,`syn_hr`,`total_hr`,`sns_bat`,`oia_bat`,`tik_bat`,`dtn_bat`,`kck_bat`,`gkt_bat`,`syn_bat`,`total_bat`,`sns_ttl_pct`,`oia_ttl_pct`,`tik_ttl_pct`,`dtn_ttl_pct`,`kck_ttl_pct`,`gkt_ttl_pct`,`syn_ttl_pct`,`sns_situ_pct`,`oia_situ_pct`,`tik_situ_pct`,`dtn_situ_pct`,`kck_situ_pct`,`gkt_situ_pct`,`syn_situ_pct`,`total_situ_pct`)

SELECT
    pb.id,
    p.name,
    p.team,
    ifnull(sns.hr_cnt, 0)AS sns_hr,
    ifnull(oia.hr_cnt, 0) AS oia_hr,
    ifnull(tik.hr_cnt, 0) AS tik_hr,
    ifnull(dtn.hr_cnt, 0) AS dtn_hr,
    ifnull(kck.hr_cnt, 0) AS kck_hr,
    ifnull(gkt.hr_cnt, 0) AS gkt_hr,
    ifnull(syn.hr_cnt, 0) AS syn_hr,
    ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0) AS total_hr,
    ifnull(sns.bat_cnt, 0) AS sns_bat,
    ifnull(oia.bat_cnt, 0) AS oia_bat,
    ifnull(tik.bat_cnt, 0) AS tik_bat,
    ifnull(dtn.bat_cnt, 0) AS dtn_bat,
    ifnull(kck.bat_cnt, 0) AS kck_bat,
    ifnull(gkt.bat_cnt, 0) AS gkt_bat,
    ifnull(syn.bat_cnt, 0) AS syn_bat,
    ifnull(sns.bat_cnt, 0) + ifnull(oia.bat_cnt, 0) + ifnull(tik.bat_cnt, 0) + ifnull(dtn.bat_cnt, 0) + ifnull(kck.bat_cnt, 0) + ifnull(gkt.bat_cnt, 0) + ifnull(syn.bat_cnt, 0) AS total_bat,
    -- percent of total
    round(case when ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0) != 0 then sns.hr_cnt / (ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0)) else 0 end, 4) AS sns_ttl_pct,
    round(case when ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0) != 0 then oia.hr_cnt / (ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0)) else 0 end, 4) AS oia_ttl_pct,
    round(case when ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0) != 0 then tik.hr_cnt / (ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0)) else 0 end, 4) AS tik_ttl_pct,
    round(case when ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0) != 0 then dtn.hr_cnt / (ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0)) else 0 end, 4) AS dtn_ttl_pct,
    round(case when ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0) != 0 then kck.hr_cnt / (ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0)) else 0 end, 4) AS kck_ttl_pct,
    round(case when ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0) != 0 then gkt.hr_cnt / (ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0)) else 0 end, 4) AS gkt_ttl_pct,
    round(case when ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0) != 0 then syn.hr_cnt / (ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0)) else 0 end, 4) AS syn_ttl_pct,
	-- percent of situation bat
    round(case when sns.bat_cnt is not null then sns.hr_cnt / sns.bat_cnt else 0 end, 4) AS sns_situ_pct,
    round(case when oia.bat_cnt is not null then oia.hr_cnt / oia.bat_cnt else 0 end, 4) AS oia_situ_pct,
    round(case when tik.bat_cnt is not null then tik.hr_cnt / tik.bat_cnt else 0 end, 4) AS tik_situ_pct,
    round(case when dtn.bat_cnt is not null then dtn.hr_cnt / dtn.bat_cnt else 0 end, 4) AS dtn_situ_pct,
    round(case when kck.bat_cnt is not null then kck.hr_cnt / kck.bat_cnt else 0 end, 4) AS kck_situ_pct,
    round(case when gkt.bat_cnt is not null then gkt.hr_cnt / gkt.bat_cnt else 0 end, 4) AS gkt_situ_pct,
    round(case when syn.bat_cnt is not null then syn.hr_cnt / syn.bat_cnt else 0 end, 4) AS syn_situ_pct,
    -- percent of homerun par bat
	round(case when ifnull(sns.bat_cnt, 0) + ifnull(oia.bat_cnt, 0) + ifnull(tik.bat_cnt, 0) + ifnull(dtn.bat_cnt, 0) + ifnull(kck.bat_cnt, 0) + ifnull(gkt.bat_cnt, 0) + ifnull(syn.bat_cnt, 0) = 0 then 0 else (ifnull(sns.hr_cnt, 0) + ifnull(oia.hr_cnt, 0) + ifnull(tik.hr_cnt, 0) + ifnull(dtn.hr_cnt, 0) + ifnull(kck.hr_cnt, 0) + ifnull(gkt.hr_cnt, 0) + ifnull(syn.hr_cnt, 0)) / (ifnull(sns.bat_cnt, 0) + ifnull(oia.bat_cnt, 0) + ifnull(tik.bat_cnt, 0) + ifnull(dtn.bat_cnt, 0) + ifnull(kck.bat_cnt, 0) + ifnull(gkt.bat_cnt, 0) + ifnull(syn.bat_cnt, 0)) end, 4)  AS total_situ_pct
FROM
    baseball._player_batter pb
    LEFT JOIN player p ON pb.id = p.id
    -- 先制
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
			b_total = 0 AND t_total = 0  AND NOT (
				ining >= 9
				AND top_bottom = 2
			) -- サヨナラシチュエーションは除外
		GROUP BY batter) AS sns ON sns.batter = pb.id
    -- 追い上げ
    LEFT JOIN (
        SELECT
            batter,
            COUNT(rst_id = 9 OR NULL) AS hr_cnt,
            COUNT(batter) AS bat_cnt
        FROM
            situation_base_commit
        WHERE
        ROUND((SELECT (CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) <= CASE (CASE top_bottom
            WHEN 1 THEN b_total - t_total
            WHEN 2 THEN t_total - b_total
        END)
            WHEN 2 THEN 0
            WHEN 3 THEN 1
            WHEN 4 THEN 2
            ELSE 4
        END
		AND (CASE top_bottom WHEN 1 THEN t_total - b_total WHEN 2 THEN b_total - t_total END ) < - 1
        GROUP BY batter) AS oia ON oia.batter = pb.id
	-- 追加点
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  (
			CASE
			  top_bottom
			  WHEN 1 THEN t_total - b_total
			  WHEN 2 THEN b_total - t_total
			END
		  ) > 0
		GROUP BY batter) AS tik ON tik.batter = pb.id
	-- 同点
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
			ROUND((SELECT (CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) = CASE (CASE top_bottom
					WHEN 1 THEN b_total - t_total
					WHEN 2 THEN t_total - b_total
				END)
					WHEN 1 THEN 0
					WHEN 2 THEN 1
					WHEN 3 THEN 2
					WHEN 4 THEN 3
					ELSE 4
				END
				AND (CASE top_bottom
				WHEN 1 THEN b_total - t_total
				WHEN 2 THEN t_total - b_total
			END) < 5
				AND (CASE top_bottom
				WHEN 1 THEN t_total - b_total
				WHEN 2 THEN b_total - t_total
			END) < 0
		GROUP BY batter) AS dtn ON dtn.batter = pb.id
	-- 勝ち越し
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  b_total - t_total = 0
		  AND NOT (
			b_total = 0
			OR t_total = 0
		  )
		  AND NOT (
			ining >= 9
			AND top_bottom = 2
		  ) -- サヨナラシチュエーションは除外
		GROUP BY batter) AS kck ON kck.batter = pb.id
	-- 逆転
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
			ROUND((SELECT (CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) >= CASE (CASE top_bottom
					WHEN 1 THEN b_total - t_total
					WHEN 2 THEN t_total - b_total
				END)
					WHEN 1 THEN 1
					WHEN 2 THEN 2
					WHEN 3 THEN 3
					ELSE 4
				END
				AND (CASE top_bottom
				WHEN 1 THEN b_total - t_total
				WHEN 2 THEN t_total - b_total
			END) < 5
				AND (CASE top_bottom
				WHEN 1 THEN t_total - b_total
				WHEN 2 THEN b_total - t_total
			END) < 0
            AND (ining < 9 OR (ining >= 9 and top_bottom = 1)) -- サヨナラシチュエーションは除外
		GROUP BY batter) AS gkt ON gkt.batter = pb.id
	-- サヨナラ
    LEFT JOIN (
        SELECT 
			batter,
			COUNT(rst_id = 9 OR NULL) AS hr_cnt,
			COUNT(batter) AS bat_cnt
		FROM
			situation_base_commit
		WHERE
		  ining >= 9 AND top_bottom = 2
		  AND (
			b_total - t_total = 0 OR (
			  t_total - b_total > 0
			  AND t_total - b_total < 4 AND (
				ROUND((SELECT (CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', ''))) / CHAR_LENGTH('1')),
							0) >= CASE (CASE top_bottom
						WHEN 1 THEN b_total - t_total
						WHEN 2 THEN t_total - b_total
					END)
						WHEN 1 THEN 1
						WHEN 2 THEN 2
						WHEN 3 THEN 3
						ELSE 4
					END
				)
			  )
			)
		GROUP BY batter) AS syn ON syn.batter = pb.id
	LEFT JOIN homerun_king hk ON hk.player_id = pb.id
;

/*
Error Code: 1064. You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '(`id`,`name`,`team`,`sns_hr`,`oia_hr`,`tik_hr`,`dtn_hr`,`kck_hr`,`gkt_hr`,`syn_h' at line 1

*/
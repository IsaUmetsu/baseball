-- CREATE TABLE hit_rbi_situation_batter 
-- INSERT INTO hit_situation_batter (`id`,`name`,`team`,`sns_hit`,`oia_hit`,`tik_hit`,`dtn_hit`,`kck_hit`,`gkt_hit`,`syn_hit`,`total_hit`,`sns_bat`,`oia_bat`,`tik_bat`,`dtn_bat`,`kck_bat`,`gkt_bat`,`syn_bat`,`total_bat`,`sns_runs`,`oia_runs`,`tik_runs`,`dtn_runs`,`kck_runs`,`gkt_runs`,`syn_runs`,`total_runs`,`sns_ttl_pct`,`oia_ttl_pct`,`tik_ttl_pct`,`dtn_ttl_pct`,`kck_ttl_pct`,`gkt_ttl_pct`,`syn_ttl_pct`,`sns_situ_pct`,`oia_situ_pct`,`tik_situ_pct`,`dtn_situ_pct`,`kck_situ_pct`,`gkt_situ_pct`,`syn_situ_pct`)

SELECT
    pb.id,
    p.name,
    p.team,
	-- hit count
    IFNULL(sns.hit_cnt, 0) AS sns_hit,
    IFNULL(oia.hit_cnt, 0) AS oia_hit,
    IFNULL(tik.hit_cnt, 0) AS tik_hit,
    IFNULL(dtn.hit_cnt, 0) AS dtn_hit,
    IFNULL(kck.hit_cnt, 0) AS kck_hit,
    IFNULL(gkt.hit_cnt, 0) AS gkt_hit,
    IFNULL(syn.hit_cnt, 0) AS syn_hit,
    IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0) AS total_hit,
	-- bat count
    IFNULL(sns.bat_cnt, 0) AS sns_bat,
    IFNULL(oia.bat_cnt, 0) AS oia_bat,
    IFNULL(tik.bat_cnt, 0) AS tik_bat,
    IFNULL(dtn.bat_cnt, 0) AS dtn_bat,
    IFNULL(kck.bat_cnt, 0) AS kck_bat,
    IFNULL(gkt.bat_cnt, 0) AS gkt_bat,
    IFNULL(syn.bat_cnt, 0) AS syn_bat,
    IFNULL(sns.bat_cnt, 0) + IFNULL(oia.bat_cnt, 0) + IFNULL(tik.bat_cnt, 0) + IFNULL(dtn.bat_cnt, 0) + IFNULL(kck.bat_cnt, 0) + IFNULL(gkt.bat_cnt, 0) + IFNULL(syn.bat_cnt, 0) AS total_bat,
	-- RBI count
	IFNULL(sns.runs, 0) AS sns_runs,
	IFNULL(oia.runs, 0) AS oia_runs,
	IFNULL(tik.runs, 0) AS tik_runs,
	IFNULL(dtn.runs, 0) AS dtn_runs,
	IFNULL(kck.runs, 0) AS kck_runs,
	IFNULL(gkt.runs, 0) AS gkt_runs,
	IFNULL(syn.runs, 0) AS syn_runs,
    IFNULL(sns.runs, 0) + IFNULL(oia.runs, 0) + IFNULL(tik.runs, 0) + IFNULL(dtn.runs, 0) + IFNULL(kck.runs, 0) + IFNULL(gkt.runs, 0) + IFNULL(syn.runs, 0) AS total_runs,
    -- percent of total
    ROUND(CASE WHEN IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0) != 0 then sns.hit_cnt / (IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0)) ELSE 0 END, 4) AS sns_ttl_pct,
    ROUND(CASE WHEN IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0) != 0 then oia.hit_cnt / (IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0)) ELSE 0 END, 4) AS oia_ttl_pct,
    ROUND(CASE WHEN IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0) != 0 then tik.hit_cnt / (IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0)) ELSE 0 END, 4) AS tik_ttl_pct,
    ROUND(CASE WHEN IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0) != 0 then dtn.hit_cnt / (IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0)) ELSE 0 END, 4) AS dtn_ttl_pct,
    ROUND(CASE WHEN IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0) != 0 then kck.hit_cnt / (IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0)) ELSE 0 END, 4) AS kck_ttl_pct,
    ROUND(CASE WHEN IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0) != 0 then gkt.hit_cnt / (IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0)) ELSE 0 END, 4) AS gkt_ttl_pct,
    ROUND(CASE WHEN IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0) != 0 then syn.hit_cnt / (IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0)) ELSE 0 END, 4) AS syn_ttl_pct,
	-- percent of situation bat
    ROUND(CASE WHEN IFNULL(sns.bat_cnt, 0) != 0 THEN sns.hit_cnt / sns.bat_cnt ELSE 0 END, 4) AS sns_situ_pct,
    ROUND(CASE WHEN IFNULL(oia.bat_cnt, 0) != 0 THEN oia.hit_cnt / oia.bat_cnt ELSE 0 END, 4) AS oia_situ_pct,
    ROUND(CASE WHEN IFNULL(tik.bat_cnt, 0) != 0 THEN tik.hit_cnt / tik.bat_cnt ELSE 0 END, 4) AS tik_situ_pct,
    ROUND(CASE WHEN IFNULL(dtn.bat_cnt, 0) != 0 THEN dtn.hit_cnt / dtn.bat_cnt ELSE 0 END, 4) AS dtn_situ_pct,
    ROUND(CASE WHEN IFNULL(kck.bat_cnt, 0) != 0 THEN kck.hit_cnt / kck.bat_cnt ELSE 0 END, 4) AS kck_situ_pct,
    ROUND(CASE WHEN IFNULL(gkt.bat_cnt, 0) != 0 THEN gkt.hit_cnt / gkt.bat_cnt ELSE 0 END, 4) AS gkt_situ_pct,
    ROUND(CASE WHEN IFNULL(syn.bat_cnt, 0) != 0 THEN syn.hit_cnt / syn.bat_cnt ELSE 0 END, 4) AS syn_situ_pct
    -- percent of homerun par bat
	-- ,ROUND(CASE WHEN IFNULL(sns.bat_cnt, 0) + IFNULL(oia.bat_cnt, 0) + IFNULL(tik.bat_cnt, 0) + IFNULL(dtn.bat_cnt, 0) + IFNULL(kck.bat_cnt, 0) + IFNULL(gkt.bat_cnt, 0) + IFNULL(syn.bat_cnt, 0) = 0 then 0 ELSE (IFNULL(sns.hit_cnt, 0) + IFNULL(oia.hit_cnt, 0) + IFNULL(tik.hit_cnt, 0) + IFNULL(dtn.hit_cnt, 0) + IFNULL(kck.hit_cnt, 0) + IFNULL(gkt.hit_cnt, 0) + IFNULL(syn.hit_cnt, 0)) / (IFNULL(sns.bat_cnt, 0) + IFNULL(oia.bat_cnt, 0) + IFNULL(tik.bat_cnt, 0) + IFNULL(dtn.bat_cnt, 0) + IFNULL(kck.bat_cnt, 0) + IFNULL(gkt.bat_cnt, 0) + IFNULL(syn.bat_cnt, 0)) END, 4)  AS total_situ_pct
FROM
    baseball._player_batter pb
    LEFT JOIN player p ON pb.id = p.id
    -- 先制
    LEFT JOIN (
        SELECT 
			sc.batter,
			COUNT((sc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS hit_cnt,
			COUNT(e.name IS NULL OR NULL) AS bat_cnt,
			SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
		FROM
			situation_hit_rbi_commit sc
		LEFT JOIN exclude_batting_info e ON sc.result = e.name
		LEFT JOIN _rbi_all rbi ON sc.g_id = rbi.g_id
		WHERE
			sc.b_total = 0 AND sc.t_total = 0  AND NOT (
				sc.ining >= 9
				AND sc.top_bottom = 2
			) -- サヨナラシチュエーションは除外
		GROUP BY sc.batter) AS sns ON sns.batter = pb.id
    -- 追い上げ
    LEFT JOIN (
        SELECT
            sc.batter,
            COUNT((sc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS hit_cnt,
            COUNT(e.name IS NULL OR NULL) AS bat_cnt,
			SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
        FROM
            situation_hit_rbi_commit sc
		LEFT JOIN exclude_batting_info e ON sc.result = e.name
		LEFT JOIN _rbi_all rbi ON sc.g_id = rbi.g_id
        WHERE
        ROUND((SELECT (CHAR_LENGTH(sc.`on_all_base`) - CHAR_LENGTH(REPLACE(sc.`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) <= CASE (CASE sc.top_bottom
            WHEN 1 THEN sc.b_total - sc.t_total
            WHEN 2 THEN sc.t_total - sc.b_total
        END)
            WHEN 2 THEN 1
            WHEN 3 THEN 2
            -- WHEN 4 THEN 3
            ELSE 3
        END
		AND (CASE sc.top_bottom WHEN 1 THEN sc.t_total - sc.b_total WHEN 2 THEN sc.b_total - sc.t_total END ) < - 1
        GROUP BY sc.batter) AS oia ON oia.batter = pb.id
	-- 追加点
    LEFT JOIN (
        SELECT 
			sc.batter,
			COUNT((sc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS hit_cnt,
			COUNT(e.name IS NULL OR NULL) AS bat_cnt,
			SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
		FROM
			situation_hit_rbi_commit sc
		LEFT JOIN exclude_batting_info e ON sc.result = e.name
		LEFT JOIN _rbi_all rbi ON sc.g_id = rbi.g_id
		WHERE
		  (
			CASE
			  sc.top_bottom
			  WHEN 1 THEN sc.t_total - sc.b_total
			  WHEN 2 THEN sc.b_total - sc.t_total
			END
		  ) > 0
		GROUP BY sc.batter) AS tik ON tik.batter = pb.id
	-- 同点
    LEFT JOIN (
        SELECT 
			sc.batter,
			COUNT((sc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS hit_cnt,
			COUNT(e.name IS NULL OR NULL) AS bat_cnt,
			SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
		FROM
			situation_hit_rbi_commit sc
		LEFT JOIN exclude_batting_info e ON sc.result = e.name
		LEFT JOIN _rbi_all rbi ON sc.g_id = rbi.g_id
		WHERE
			ROUND((SELECT (CHAR_LENGTH(sc.`on_all_base`) - CHAR_LENGTH(REPLACE(sc.`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) = CASE (CASE sc.top_bottom
					WHEN 1 THEN sc.b_total - sc.t_total
					WHEN 2 THEN sc.t_total - sc.b_total
				END)
					WHEN 1 THEN 1
					WHEN 2 THEN 2
					WHEN 3 THEN 3
					-- WHEN 4 THEN 3
					ELSE 3
				END
				AND (CASE sc.top_bottom
				WHEN 1 THEN sc.b_total - sc.t_total
				WHEN 2 THEN sc.t_total - sc.b_total
			END) < 5
				AND (CASE sc.top_bottom
				WHEN 1 THEN sc.t_total - sc.b_total
				WHEN 2 THEN sc.b_total - sc.t_total
			END) < 0
		GROUP BY sc.batter) AS dtn ON dtn.batter = pb.id
	-- 勝ち越し
    LEFT JOIN (
        SELECT 
			sc.batter,
			COUNT((sc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS hit_cnt,
			COUNT(e.name IS NULL OR NULL) AS bat_cnt,
			SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
		FROM
			situation_hit_rbi_commit sc
		LEFT JOIN exclude_batting_info e ON sc.result = e.name
		LEFT JOIN _rbi_all rbi ON sc.g_id = rbi.g_id
		WHERE
		  sc.b_total - sc.t_total = 0
		  AND NOT (
			sc.b_total = 0
			OR sc.t_total = 0
		  )
		  AND NOT (
			sc.ining >= 9
			AND sc.top_bottom = 2
		  ) -- サヨナラシチュエーションは除外
		GROUP BY sc.batter) AS kck ON kck.batter = pb.id
	-- 逆転
    LEFT JOIN (
        SELECT 
			sc.batter,
			COUNT((sc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS hit_cnt,
			COUNT(e.name IS NULL OR NULL) AS bat_cnt,
			SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
		FROM
			situation_hit_rbi_commit sc
		LEFT JOIN exclude_batting_info e ON sc.result = e.name
		LEFT JOIN _rbi_all rbi ON sc.g_id = rbi.g_id
		WHERE
			ROUND((SELECT (CHAR_LENGTH(sc.`on_all_base`) - CHAR_LENGTH(REPLACE(sc.`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) >= CASE (CASE sc.top_bottom
					WHEN 1 THEN sc.b_total - sc.t_total
					WHEN 2 THEN sc.t_total - sc.b_total
				END)
					WHEN 1 THEN 2
					WHEN 2 THEN 3
					-- WHEN 3 THEN 3
					ELSE 3
				END
				AND (CASE sc.top_bottom
				WHEN 1 THEN sc.b_total - sc.t_total
				WHEN 2 THEN sc.t_total - sc.b_total
			END) < 5
				AND (CASE sc.top_bottom
				WHEN 1 THEN sc.t_total - sc.b_total
				WHEN 2 THEN sc.b_total - sc.t_total
			END) < 0
            AND (sc.ining < 9 OR (sc.ining >= 9 and sc.top_bottom = 1)) -- サヨナラシチュエーションは除外
		GROUP BY sc.batter) AS gkt ON gkt.batter = pb.id
	-- サヨナラ
    LEFT JOIN (
        SELECT 
			sc.batter,
			COUNT((sc.rst_id IN (2, 3, 4, 6, 8) AND IFNULL(rbi.RBI, 0) > 0) OR NULL) AS hit_cnt,
			COUNT(e.name IS NULL OR NULL) AS bat_cnt,
			SUM(CASE WHEN rbi.rst_id IN (2, 3, 4, 6, 8) THEN IFNULL(rbi.RBI, 0) ELSE 0 END) AS runs
		FROM
			situation_hit_rbi_commit sc
		LEFT JOIN exclude_batting_info e ON sc.result = e.name
		LEFT JOIN _rbi_all rbi ON sc.g_id = rbi.g_id
		WHERE
		  sc.ining >= 9 AND sc.top_bottom = 2
		  AND (
			sc.b_total - sc.t_total = 0 OR (
			  sc.t_total - sc.b_total > 0
			  AND sc.t_total - sc.b_total < 4 AND (
				ROUND((SELECT (CHAR_LENGTH(sc.`on_all_base`) - CHAR_LENGTH(REPLACE(sc.`on_all_base`, '1', ''))) / CHAR_LENGTH('1')),
							0) >= CASE (CASE sc.top_bottom
						WHEN 1 THEN sc.b_total - sc.t_total
						WHEN 2 THEN sc.t_total - sc.b_total
					END)
						WHEN 1 THEN 2
						WHEN 2 THEN 3
						-- WHEN 3 THEN 3
						ELSE 3
					END
				)
			  )
			)
		GROUP BY sc.batter) AS syn ON syn.batter = pb.id
;

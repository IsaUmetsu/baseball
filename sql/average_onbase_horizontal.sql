-- create table average_onbase_horizontal
-- insert into average_onbase_horizontal (`batter`,`name`,`team`,`rate1`,`rate2`,`rate3`,`rate4`,`rate5`,`rate6`,`rate7`,`rate`,`pa1`,`ab1`,`cnt1`,`pa2`,`ab2`,`cnt2`,`pa3`,`ab3`,`cnt3`,`pa4`,`ab4`,`cnt4`,`pa5`,`ab5`,`cnt5`,`pa6`,`ab6`,`cnt6`,`pa7`,`ab7`,`cnt7`,`pa`,`ab`,`cnt`)

-- select r.* from (
SELECT 
	f.batter,
	pb.name,
    pb.team,
    f.rate1,
    s.rate2,
    t.rate3,
    fo.rate4,
    fi.rate5,
    si.rate6,
    sev.rate7,
    case when (ifnull(ab1, 0) + ifnull(ab2, 0) + ifnull(ab3, 0) + ifnull(ab4, 0) + ifnull(ab5, 0) + ifnull(ab6, 0) + ifnull(ab7, 0)) > 0 then round((ifnull(cnt1, 0) + ifnull(cnt2, 0) + ifnull(cnt3, 0) + ifnull(cnt4, 0) + ifnull(cnt5, 0) + ifnull(cnt6, 0) + ifnull(cnt7, 0)) / (ifnull(ab1, 0) + ifnull(ab2, 0) + ifnull(ab3, 0) + ifnull(ab4, 0) + ifnull(ab5, 0) + ifnull(ab6, 0) + ifnull(ab7, 0)), 5) else null end as rate
--     /*
    ,f.pa1,
    f.ab1,
    f.cnt1,
    s.pa2,
    s.ab2,
    s.cnt2,
	t.pa3,
    t.ab3,
    t.cnt3,
    fo.pa4,
    fo.ab4,
    fo.cnt4,
    fi.pa5,
    fi.ab5,
    fi.cnt5,
    si.pa6,
    si.ab6,
    si.cnt6,
    sev.pa7,
    sev.ab7,
	sev.cnt7,
    ifnull(pa1, 0) + ifnull(pa2, 0) + ifnull(pa3, 0) + ifnull(pa4, 0) + ifnull(pa5, 0) + ifnull(pa6, 0) + ifnull(pa7, 0) as pa,
    ifnull(ab1, 0) + ifnull(ab2, 0) + ifnull(ab3, 0) + ifnull(ab4, 0) + ifnull(ab5, 0) + ifnull(ab6, 0) + ifnull(ab7, 0) as ab,
    ifnull(cnt1, 0) + ifnull(cnt2, 0) + ifnull(cnt3, 0) + ifnull(cnt4, 0) + ifnull(cnt5, 0) + ifnull(cnt6, 0) + ifnull(cnt7, 0) as cnt
-- */
FROM
	-- 第1打席
    (SELECT 
		h.batter,
            COUNT(h.batter OR NULL) AS pa1,
            COUNT(e.name IS NULL OR NULL) AS ab1,
            COUNT(ob.rst_id IS NOT NULL OR NULL) AS cnt1,
            case when COUNT(e.name IS NULL OR NULL) > 0 then ROUND(COUNT(ob.rst_id IS NOT NULL OR NULL) / COUNT(e.name IS NULL OR NULL), 5) else null end AS rate1
    FROM
        baseball._bat_all_info_horizontal h
    LEFT JOIN exclude_onbase_info e ON h.`1_result` = e.name
    LEFT JOIN onbase_id_info ob ON  h.`1_rst_id` = ob.rst_id
    WHERE h.`1_result` IS NOT NULL
    GROUP BY batter) AS f
    -- 第2打席
        LEFT JOIN
    (SELECT 
		h.batter,
            COUNT(h.batter OR NULL) AS pa2,
            COUNT(e.name IS NULL OR NULL) AS ab2,
            COUNT(ob.rst_id IS NOT NULL OR NULL) AS cnt2,
            case when COUNT(e.name IS NULL OR NULL) > 0 then ROUND(COUNT(ob.rst_id IS NOT NULL OR NULL) / COUNT(e.name IS NULL OR NULL), 5) else null end AS rate2
    FROM
        baseball._bat_all_info_horizontal h
    LEFT JOIN exclude_onbase_info e ON h.`2_result` = e.name
    LEFT JOIN onbase_id_info ob ON  h.`2_rst_id` = ob.rst_id
    WHERE h.`2_result` IS NOT NULL
    GROUP BY batter) AS s ON f.batter = s.batter
    -- 第3打席
        LEFT JOIN
    (SELECT 
		h.batter,
            COUNT(h.batter OR NULL) AS pa3,
            COUNT(e.name IS NULL OR NULL) AS ab3,
            COUNT(ob.rst_id IS NOT NULL OR NULL) AS cnt3,
            case when COUNT(e.name IS NULL OR NULL) > 0 then ROUND(COUNT(ob.rst_id IS NOT NULL OR NULL) / COUNT(e.name IS NULL OR NULL), 5) else null end AS rate3
    FROM
        baseball._bat_all_info_horizontal h
    LEFT JOIN exclude_onbase_info e ON h.`3_result` = e.name
    LEFT JOIN onbase_id_info ob ON  h.`3_rst_id` = ob.rst_id
    WHERE h.`3_result` IS NOT NULL
    GROUP BY batter) AS t ON f.batter = t.batter
    -- 第4打席
        LEFT JOIN
    (SELECT 
		h.batter,
            COUNT(h.batter OR NULL) AS pa4,
            COUNT(e.name IS NULL OR NULL) AS ab4,
            COUNT(ob.rst_id IS NOT NULL OR NULL) AS cnt4,
            case when COUNT(e.name IS NULL OR NULL) > 0 then ROUND(COUNT(ob.rst_id IS NOT NULL OR NULL) / COUNT(e.name IS NULL OR NULL), 5) else null end AS rate4
    FROM
        baseball._bat_all_info_horizontal h
    LEFT JOIN exclude_onbase_info e ON h.`4_result` = e.name
    LEFT JOIN onbase_id_info ob ON  h.`4_rst_id` = ob.rst_id
    WHERE h.`4_result` IS NOT NULL
    GROUP BY batter) AS fo ON f.batter = fo.batter
    -- 第5打席
		LEFT JOIN
    (SELECT 
		h.batter,
            COUNT(h.batter OR NULL) AS pa5,
            COUNT(e.name IS NULL OR NULL) AS ab5,
            COUNT(ob.rst_id IS NOT NULL OR NULL) AS cnt5,
            case when COUNT(e.name IS NULL OR NULL) > 0 then ROUND(COUNT(ob.rst_id IS NOT NULL OR NULL) / COUNT(e.name IS NULL OR NULL), 5) else null end AS rate5
    FROM
        baseball._bat_all_info_horizontal h
    LEFT JOIN exclude_onbase_info e ON h.`5_result` = e.name
    LEFT JOIN onbase_id_info ob ON  h.`5_rst_id` = ob.rst_id
    WHERE h.`5_result` IS NOT NULL
    GROUP BY batter) AS fi ON f.batter = fi.batter
    -- 第6打席
		LEFT JOIN
    (SELECT 
		h.batter,
            COUNT(h.batter OR NULL) AS pa6,
            COUNT(e.name IS NULL OR NULL) AS ab6,
            COUNT(ob.rst_id IS NOT NULL OR NULL) AS cnt6,
            case when COUNT(e.name IS NULL OR NULL) > 0 then ROUND(COUNT(ob.rst_id IS NOT NULL OR NULL) / COUNT(e.name IS NULL OR NULL), 5) else null end AS rate6
    FROM
        baseball._bat_all_info_horizontal h
    LEFT JOIN exclude_onbase_info e ON h.`6_result` = e.name
    LEFT JOIN onbase_id_info ob ON  h.`6_rst_id` = ob.rst_id
    WHERE h.`6_result` IS NOT NULL
    GROUP BY batter) AS si ON f.batter = si.batter
    -- 第7打席
		LEFT JOIN
    (SELECT 
		h.batter,
            COUNT(h.batter OR NULL) AS pa7,
            COUNT(e.name IS NULL OR NULL) AS ab7,
            COUNT(ob.rst_id IS NOT NULL OR NULL) AS cnt7,
            case when COUNT(e.name IS NULL OR NULL) > 0 then ROUND(COUNT(ob.rst_id IS NOT NULL OR NULL) / COUNT(e.name IS NULL OR NULL), 5) else null end AS rate7
    FROM
        baseball._bat_all_info_horizontal h
    LEFT JOIN exclude_onbase_info e ON h.`7_result` = e.name
    LEFT JOIN onbase_id_info ob ON  h.`7_rst_id` = ob.rst_id
    WHERE h.`7_result` IS NOT NULL
    GROUP BY batter) AS sev ON f.batter = sev.batter
    -- 選手情報
    left join player pb on f.batter = pb.id
-- ) as r
-- left join team_info t on r.team = t.team_initial
-- where r.pa >= 443 and t.league = 'C'
-- order by r.rate DESC
;
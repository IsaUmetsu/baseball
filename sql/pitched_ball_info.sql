-- create table pitched_ball_info
-- insert into pitched_ball_info (`id`, `lr`, `name`, `team`, `b1`, `b1_avg_spd`, `b1_max_spd`, `b1_cnt`, `b2`, `b2_avg_spd`, `b2_max_spd`, `b2_cnt`, `b3`, `b3_avg_spd`, `b3_max_spd`, `b3_cnt`, `b4`, `b4_avg_spd`, `b4_max_spd`, `b4_cnt`, `b5`, `b5_avg_spd`, `b5_max_spd`, `b5_cnt`, `b6`, `b6_avg_spd`, `b6_max_spd`, `b6_cnt`, `b7`, `b7_avg_spd`, `b7_max_spd`, `b7_cnt`, `b8`, `b8_avg_spd`, `b8_max_spd`, `b8_cnt`, `b9`, `b9_avg_spd`, `b9_max_spd`, `b9_cnt`)

SELECT 
    pp.*,
    p.`name`,
    p.team,
    p1.b_id AS b1,
    p1.avg_spd AS b1_avg_spd,
    p1.max_spd AS b1_max_spd,
    p1.cnt AS b1_cnt,
    p2.b_id AS b2,
    p2.avg_spd AS b2_avg_spd,
    p2.max_spd AS b2_max_spd,
    p2.cnt AS b2_cnt,
    p3.b_id AS b3,
    p3.avg_spd AS b3_avg_spd,
    p3.max_spd AS b3_max_spd,
    p3.cnt AS b3_cnt,
    p4.b_id AS b4,
    p4.avg_spd AS b4_avg_spd,
    p4.max_spd AS b4_max_spd,
    p4.cnt AS b4_cnt,
    p5.b_id AS b5,
    p5.avg_spd AS b5_avg_spd,
    p5.max_spd AS b5_max_spd,
    p5.cnt AS b5_cnt,
    p6.b_id AS b6,
    p6.avg_spd AS b6_avg_spd,
    p6.max_spd AS b6_max_spd,
    p6.cnt AS b6_cnt,
    p7.b_id AS b7,
    p7.avg_spd AS b7_avg_spd,
    p7.max_spd AS b7_max_spd,
    p7.cnt AS b7_cnt,
    p8.b_id AS b8,
    p8.avg_spd AS b8_avg_spd,
    p8.max_spd AS b8_max_spd,
    p8.cnt AS b8_cnt,
    p9.b_id AS b9,
    p9.avg_spd AS b9_avg_spd,
    p9.max_spd AS b9_max_spd,
    p9.cnt AS b9_cnt
FROM
    _player_pitcher pp
		LEFT JOIN player p on pp.id = p.id
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE -- 計測不能な球は対象外
        ball_type_id = 1 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p1 ON pp.id = p1.pitcher
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE
        ball_type_id = 2 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p2 ON pp.id = p2.pitcher
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE
        ball_type_id = 3 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p3 ON pp.id = p3.pitcher
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE
        ball_type_id = 4 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p4 ON pp.id = p4.pitcher
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE
        ball_type_id = 5 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p5 ON pp.id = p5.pitcher
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE
        ball_type_id = 6 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p6 ON pp.id = p6.pitcher
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE
        ball_type_id = 7 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p7 ON pp.id = p7.pitcher
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE
        ball_type_id = 8 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p8 ON pp.id = p8.pitcher
        LEFT JOIN
    (SELECT 
        ball_type_id AS b_id,
            pitcher,
            AVG(speed) AS avg_spd,
            MAX(speed) AS max_spd,
            COUNT(pitcher) AS cnt
    FROM
        _pitched_ball
    WHERE
        ball_type_id = 9 AND speed > 0
    GROUP BY ball_type_id , pitcher) AS p9 ON pp.id = p9.pitcher
;
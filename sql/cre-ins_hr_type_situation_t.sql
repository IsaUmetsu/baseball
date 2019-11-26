-- create table hr_type_situation_t 

-- insert into baseball.hr_type_situation_t (homerun_type, team, cnt, batting_cnt, percent)
SELECT
    '逆転' AS homerun_type,
    hr_cnt.*,
    situ_bat.batting_cnt,
    ROUND(hr_cnt.cnt / situ_bat.batting_cnt * 100, 5) AS percent
FROM
    (
        -- 選手(and 球団)ごとの本塁打数算出
        SELECT
            -- name,
            team,
            COUNT(name) AS cnt
        FROM
            (
                SELECT
                    all_bat.date,
                    all_bat.name,
                    all_bat.team
                FROM
                    baseball._situation_gyakuten_all AS all_bat 
                    -- 各打席の最終投球の情報を取得
                    LEFT JOIN (
                        SELECT
                            date,
                            location,
                            name,
                            team,
                            ining,
                            top_bottom,
                            MAX(bp_count) AS bp_count,
                            t_total,
                            b_total
                        FROM
                            baseball._situation_gyakuten_all
                        GROUP BY
                            date,
                            location,
                            name,
                            team,
                            ining,
                            top_bottom,
                            t_total,
                            b_total
                    ) AS last_ball ON all_bat.date = last_ball.date
                    AND all_bat.location = last_ball.location
                    AND all_bat.name = last_ball.name
                    AND all_bat.team = last_ball.team
                    AND all_bat.top_bottom = last_ball.top_bottom
                    AND all_bat.ining = last_ball.ining
                    AND all_bat.bp_count = last_ball.bp_count
                    AND all_bat.t_total = last_ball.t_total
                    AND all_bat.b_total = last_ball.b_total
                -- 最終投球 かつ 本塁打のみ抽出
                WHERE
                    last_ball.date IS NOT NULL
                    AND all_bat.result = '本塁打'
            ) AS all_hr
        GROUP BY
            -- name,
            team
        ORDER BY
            cnt DESC
    ) AS hr_cnt
    -- 指定の本塁打が発生する打数を算出
    LEFT JOIN (
        SELECT
            -- name,
            team,
            COUNT(name) AS batting_cnt
        FROM -- 指定の本塁打が発生する全打席リストアップ
            (
                SELECT
                    date,
                    location,
                    s.name,
                    team,
                    ining,
                    top_bottom,
                    MAX(bp_count) AS bp_count,
                    t_total,
                    b_total
                FROM
                    baseball._situation_gyakuten_all s
                    -- 四球などは除外
                    LEFT JOIN baseball.exclude_batting_info eb ON s.result = eb.name
                WHERE
                    eb.name IS NULL
                GROUP BY
                    date,
                    location,
                    name,
                    team,
                    ining,
                    top_bottom,
                    t_total,
                    b_total
            ) AS situ_bat_all
        GROUP BY
            -- name,
            team
    ) AS situ_bat ON
    -- hr_cnt.name = situ_bat.name AND
    hr_cnt.team = situ_bat.team
ORDER BY
    hr_cnt.cnt DESC,
    percent DESC;

-- 村上, ソラーテ, 大山
SELECT 
    oo.date,
    g.ining,
    g.top_bottom,
    pp.name,
    pp.profile_number AS p_no,
    pb.name,
    pb.profile_number AS b_no,
    g.strike,
    g.ball,
    g.out,
    pi.col_8,
    g.on_all_base,
    g.runner_1b,
    pr1b.name AS '一塁走者',
    g.next_1b_go,
    g.runner_2b,
    pr2b.name AS '二塁走者',
    g.next_2b_go,
    g.runner_3b,
    pr3b.name AS '三塁走者',
    g.next_3b_go,
    g.game_datetime
FROM
    baseball.game_info g
        LEFT JOIN
    baseball.player pp ON g.pitcher = pp.id
        LEFT JOIN
    baseball.player pb ON g.batter = pb.id
        LEFT JOIN
    baseball.player pr1b ON g.runner_1b = pr1b.id
        LEFT JOIN
    baseball.player pr2b ON g.runner_2b = pr2b.id
        LEFT JOIN
    baseball.player pr3b ON g.runner_3b = pr3b.id
        LEFT JOIN
    baseball.pitch_info pi ON g.id = pi.game_info_id
        LEFT JOIN
    order_overview oo ON g.order_overview_id = oo.id
WHERE
    pb.name = 'ソト'
    and pi.col_8 = '本塁打'
GROUP BY oo.date , g.ining , g.top_bottom , pp.name , p_no , pb.name , b_no , g.strike , g.ball , g.out , pi.col_8 , g.on_all_base , g.runner_1b , '一塁走者' , g.next_1b_go , g.runner_2b , '二塁走者' , g.next_2b_go , g.runner_3b , '三塁走者' , g.next_3b_go , g.game_datetime
;

-- ソト: 9/19 のサヨナラ打で重複
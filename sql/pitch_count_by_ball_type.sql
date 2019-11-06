SELECT 
    b.ball_type,
    count(p.col_1) as count
FROM
    baseball.pitch_info p
left join
	baseball.ball_type b on p.col_1 = b.id
group by col_1
order by count desc
;
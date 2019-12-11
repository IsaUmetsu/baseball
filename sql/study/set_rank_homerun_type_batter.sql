/**
select * from
(SELECT 
    id, score, rank
FROM
    (SELECT 
		score, @rank AS rank, cnt, @rank:=@rank + cnt
    FROM
        (SELECT @rank:=1) AS Dummy, (SELECT 
        cnt as score, COUNT(*) AS cnt
    FROM
        (select * from hr_type_situation_b where homerun_type = '追い上げ') as htb
    GROUP BY score
    ORDER BY score DESC) AS GroupBy) AS Ranking
        JOIN
    (select * from hr_type_situation_b where homerun_type = '追い上げ') as htb ON htb.cnt = Ranking.score
ORDER BY rank ASC
) as rank;
-- */

-- /*
SELECT 
    h.id, h.name, h.team, h.cnt, h.batting_cnt, h.percent, rank.rank
FROM
    baseball.hr_type_situation_b h
        LEFT JOIN
    (SELECT 
        id, score, rank
    FROM
        (SELECT 
        score, @rank AS rank, cnt, @rank:=@rank + cnt
    FROM
        (SELECT @rank:=1) AS Dummy, (SELECT 
        cnt AS score, COUNT(*) AS cnt
    FROM
        (SELECT 
        *
    FROM
        hr_type_situation_b
    WHERE
        homerun_type = '追い上げ') AS htb
    GROUP BY score
    ORDER BY score DESC) AS GroupBy) AS Ranking
    JOIN (SELECT 
        *
    FROM
        hr_type_situation_b
    WHERE
        homerun_type = '追い上げ') AS htb ON htb.cnt = Ranking.score
    ORDER BY rank ASC) AS rank ON rank.id = h.id
WHERE
    h.homerun_type = '追い上げ'
ORDER BY rank.rank DESC;
-- */
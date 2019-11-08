-- /*
SELECT 
    h.id, h.summary, h.cnt, h.total_cnt, h.percent, rank.rank
FROM
    baseball.homerun_type_batter h
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
        homerun_type_batter
    WHERE
        homerun_type = '追い上げ') AS htb
    GROUP BY score
    ORDER BY score DESC) AS GroupBy) AS Ranking
    JOIN (SELECT 
        *
    FROM
        homerun_type_batter
    WHERE
        homerun_type = '追い上げ') AS htb ON htb.cnt = Ranking.score
    ORDER BY rank ASC) AS rank ON rank.id = h.id
WHERE
    h.homerun_type = '追い上げ'
ORDER BY rank.rank DESC;
-- */

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
        (select * from homerun_type_batter where homerun_type = '追い上げ') as htb
    GROUP BY score
    ORDER BY score DESC) AS GroupBy) AS Ranking
        JOIN
    (select * from homerun_type_batter where homerun_type = '追い上げ') as htb ON htb.cnt = Ranking.score
ORDER BY rank ASC
) as rank;
-- */
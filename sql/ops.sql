-- create table ops 
-- insert into ops (`batter`,`name`,`team`,`rate`,`rate1`,`rate2`,`rate3`,`rate4`,`rate5`,`rate6`,`rate7`)

SELECT 
	o.batter,
    o.name,
    o.team,
    o.rate + s.rate AS rate,
    o.rate1 + s.rate1 AS rate1,
    o.rate2 + s.rate2 AS rate2,
    o.rate3 + s.rate3 AS rate3,
    o.rate4 + s.rate4 AS rate4,
    o.rate5 + s.rate5 AS rate5,
    o.rate6 + s.rate6 AS rate6,
    o.rate7 + s.rate7 AS rate7
FROM
    average_onbase o
        LEFT JOIN
    average_slugging s ON o.batter = s.batter
-- where
-- 	o.pa >= 443
order by rate DESC
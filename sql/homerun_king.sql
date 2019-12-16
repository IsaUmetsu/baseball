-- insert into homerun_king (player_id, name, team, cnt, summary)

SELECT 
    sb.batter AS player_id,
    sb.name,
    sb.team,
    COUNT(sb.name) AS cnt,
    CONCAT(sb.name, '(', sb.team, ')') AS summary
FROM
    baseball._situation_base sb
WHERE
    sb.result = '本塁打'
GROUP BY batter , name , team
ORDER BY cnt DESC , sb.team DESC , sb.batter DESC;
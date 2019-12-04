-- create table _situation_oiage_all

SELECT 
    batter,
    `name`,
    team,
    COUNT(rst_id = 9 OR NULL) AS hr_cnt,
    COUNT(batter) AS bat_cnt
FROM
    situation_base_commit
WHERE
    ROUND((SELECT (CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', ''))) / CHAR_LENGTH('1')), 0) <= CASE (CASE top_bottom
        WHEN 1 THEN b_total - t_total
        WHEN 2 THEN t_total - b_total
    END)
        WHEN 2 THEN 0
        WHEN 3 THEN 1
        WHEN 4 THEN 2
        ELSE 4
    END
--        【追い上げ本塁打の条件】
--        ・リード時、同点時はありえない
--        ・1点差ビハインドでもありえない
--        ・2点差ビハインドならソロ(走者なし)
--        ・3点差ビハインドならソロ or 2ラン(走者なし・走者1人)
--        ・4点差ビハインドならソロ or 2ラン or 3ラン(走者なし・走者1人・走者2人)
--        ・5点差以上のビハインドなら全ての本塁打を許容(全ての走者のパターン)
        AND (CASE top_bottom
        WHEN 1 THEN t_total - b_total
        WHEN 2 THEN b_total - t_total
    END) < - 1
GROUP BY batter , `name` , team
ORDER BY hr_cnt DESC , bat_cnt
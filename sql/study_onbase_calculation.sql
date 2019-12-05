SELECT 
    (SELECT (CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', ''))) / CHAR_LENGTH('1')) AS `result`,
    CHAR_LENGTH(`on_all_base`) AS `char_len`,
    REPLACE(`on_all_base`, '1', '') AS `replaced`,
    CHAR_LENGTH(REPLACE(`on_all_base`, '1', '')) AS `replaced_length`,
    CHAR_LENGTH(`on_all_base`) - CHAR_LENGTH(REPLACE(`on_all_base`, '1', '')) AS `one_count`,
    `on_all_base`
FROM
    baseball.situation_base_commit;
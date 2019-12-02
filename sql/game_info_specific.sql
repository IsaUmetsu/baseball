-- set @no:=0;
-- set @prevbatter:=null;

-- /*
-- CREATE TABLE _game_info_specific
SELECT
  id AS game_info_id,
  order_overview_id,
  ining,
  top_bottom,
  pitcher,
  batter,
  batter_cnt
FROM
  (
    SELECT
	  g.id,
      g.order_overview_id,
      g.ining,
      g.top_bottom,
      g.pitcher,
      g.batter,
      IF(@prevbatter = g.batter, @no, @no := @no + 1) AS batter_cnt,
      @prevbatter := g.batter
    FROM
      baseball.game_info g
  ) AS A;
-- */
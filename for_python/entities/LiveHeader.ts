import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_live_header", ["gameInfoId", "scene"], {})
@Entity("live_header", { schema: format("baseball_%s", getYear()) })
export class LiveHeader extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("smallint", { name: "scene" })
  scene: number;

  @Column("varchar", { name: "inning", length: 5 })
  inning: string;

  @Column("tinyint", { name: "away_score" })
  awayScore: number;

  @Column("varchar", { name: "away_initial", length: 2 })
  awayInitial: string;

  @Column("tinyint", { name: "home_score" })
  homeScore: number;

  @Column("varchar", { name: "home_initial", length: 2 })
  homeInitial: string;

  @Column("tinyint", { name: "count_ball" })
  countBall: number;

  @Column("tinyint", { name: "count_strike" })
  countStrike: number;

  @Column("tinyint", { name: "count_out" })
  countOut: number;

  @Column("tinyint", { name: "ing_num" })
  ingNum: number;

  @Column("tinyint", { name: "ing_tb", nullable: true })
  ingTb: number | null;

  @Column("varchar", { name: "p_team", nullable: true, length: 2 })
  pTeam: string | null;

  @Column("varchar", { name: "b_team", nullable: true, length: 2 })
  bTeam: string | null;
}

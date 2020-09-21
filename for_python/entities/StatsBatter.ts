import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_stats_batter", ["gameInfoId", "bTeam", "order"], {})
@Entity("stats_batter", { schema: "baseball_2020" })
export class StatsBatter extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("varchar", { name: "b_team", length: 2 })
  bTeam: string;

  @Column("varchar", { name: "name", nullable: true, length: 20 })
  name: string | null;

  @Column("tinyint", { name: "order", nullable: true })
  order: number | null;

  @Column("varchar", { name: "position", nullable: true, length: 10 })
  position: string | null;

  @Column("varchar", { name: "ave", nullable: true, length: 10 })
  ave: string | null;

  @Column("tinyint", { name: "ab", nullable: true })
  ab: number | null;

  @Column("tinyint", { name: "run", nullable: true })
  run: number | null;

  @Column("tinyint", { name: "hit", nullable: true })
  hit: number | null;

  @Column("tinyint", { name: "rbi", nullable: true })
  rbi: number | null;

  @Column("tinyint", { name: "so", nullable: true })
  so: number | null;

  @Column("tinyint", { name: "bb", nullable: true })
  bb: number | null;

  @Column("tinyint", { name: "hbp", nullable: true })
  hbp: number | null;

  @Column("tinyint", { name: "sh", nullable: true })
  sh: number | null;

  @Column("tinyint", { name: "sb", nullable: true })
  sb: number | null;

  @Column("tinyint", { name: "err", nullable: true })
  err: number | null;

  @Column("tinyint", { name: "hr", nullable: true })
  hr: number | null;

  @Column("varchar", { name: "ing1", nullable: true, length: 10 })
  ing1: string | null;

  @Column("varchar", { name: "ing2", nullable: true, length: 10 })
  ing2: string | null;

  @Column("varchar", { name: "ing3", nullable: true, length: 10 })
  ing3: string | null;

  @Column("varchar", { name: "ing4", nullable: true, length: 10 })
  ing4: string | null;

  @Column("varchar", { name: "ing5", nullable: true, length: 10 })
  ing5: string | null;

  @Column("varchar", { name: "ing6", nullable: true, length: 10 })
  ing6: string | null;

  @Column("varchar", { name: "ing7", nullable: true, length: 10 })
  ing7: string | null;

  @Column("varchar", { name: "ing8", nullable: true, length: 10 })
  ing8: string | null;

  @Column("varchar", { name: "ing9", nullable: true, length: 10 })
  ing9: string | null;

  @Column("varchar", { name: "ing10", nullable: true, length: 10 })
  ing10: string | null;
}

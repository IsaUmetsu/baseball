import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_stats_pitcher", ["gameInfoId", "pTeam", "name"], {})
@Entity("stats_pitcher", { schema: "baseball_2020" })
export class StatsPitcher extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("varchar", { name: "p_team", length: 2 })
  pTeam: string;

  @Column("varchar", { name: "name", nullable: true, length: 20 })
  name: string | null;

  @Column("varchar", { name: "result", nullable: true, length: 5 })
  result: string | null;

  @Column("varchar", { name: "era", nullable: true, length: 5 })
  era: string | null;

  @Column("varchar", { name: "ip", nullable: true, length: 5 })
  ip: string | null;

  @Column("smallint", { name: "np", nullable: true })
  np: number | null;

  @Column("tinyint", { name: "bf", nullable: true })
  bf: number | null;

  @Column("tinyint", { name: "ha", nullable: true })
  ha: number | null;

  @Column("tinyint", { name: "hra", nullable: true })
  hra: number | null;

  @Column("tinyint", { name: "so", nullable: true })
  so: number | null;

  @Column("tinyint", { name: "bb", nullable: true })
  bb: number | null;

  @Column("tinyint", { name: "hbp", nullable: true })
  hbp: number | null;

  @Column("tinyint", { name: "balk", nullable: true })
  balk: number | null;

  @Column("tinyint", { name: "ra", nullable: true })
  ra: number | null;

  @Column("tinyint", { name: "er", nullable: true })
  er: number | null;
}

import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Entity("stats_scoreboard", { schema: format("baseball_%s", getYear()) })
export class StatsScoreboard extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("varchar", { name: "b_team", length: 2 })
  bTeam: string;

  @Column("varchar", { name: "ing1", nullable: true, length: 3 })
  ing1: string | null;

  @Column("varchar", { name: "ing2", nullable: true, length: 3 })
  ing2: string | null;

  @Column("varchar", { name: "ing3", nullable: true, length: 3 })
  ing3: string | null;

  @Column("varchar", { name: "ing4", nullable: true, length: 3 })
  ing4: string | null;

  @Column("varchar", { name: "ing5", nullable: true, length: 3 })
  ing5: string | null;

  @Column("varchar", { name: "ing6", nullable: true, length: 3 })
  ing6: string | null;

  @Column("varchar", { name: "ing7", nullable: true, length: 3 })
  ing7: string | null;

  @Column("varchar", { name: "ing8", nullable: true, length: 3 })
  ing8: string | null;

  @Column("varchar", { name: "ing9", nullable: true, length: 3 })
  ing9: string | null;

  @Column("varchar", { name: "ing10", nullable: true, length: 3 })
  ing10: string | null;

  @Column("varchar", { name: "total", nullable: true, length: 3 })
  total: string | null;

  @Column("varchar", { name: "hit", nullable: true, length: 3 })
  hit: string | null;

  @Column("varchar", { name: "err", nullable: true, length: 3 })
  err: string | null;
}

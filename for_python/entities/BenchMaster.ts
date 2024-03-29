import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_bench_master", ["gameInfoId", "scene"], {})
@Entity("bench_master", { schema: format("baseball_%s", getYear()) })
export class BenchMaster extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("smallint", { name: "scene" })
  scene: number;

  @Column("int", { name: "team_info_id" })
  teamInfoId: number;

  @Column("varchar", { name: "team_name", nullable: true, length: 10 })
  teamName: string | null;

  @Column("tinyint", { name: "member_count", nullable: true })
  memberCount: number | null;
}

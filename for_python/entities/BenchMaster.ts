import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_bench_master", ["gameInfoId", "scene"], {})
@Entity("bench_master", { schema: "baseball_2020" })
export class BenchMaster extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("smallint", { name: "scene" })
  scene: number;

  @Column("varchar", { name: "team_name", nullable: true, length: 10 })
  teamName: string | null;

  @Column("tinyint", { name: "member_count", nullable: true })
  memberCount: number | null;
}

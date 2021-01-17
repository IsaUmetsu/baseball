import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_bench_1", ["teamInfoId"], {})
@Index("idx_bench_2", ["position"], {})
@Entity("bench_member_info", { schema: "baseball_2020" })
export class BenchMemberInfo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "team_info_id" })
  teamInfoId: number;

  @Column("varchar", { name: "position", nullable: true, length: 5 })
  position: string | null;

  @Column("varchar", { name: "player_name", nullable: true, length: 45 })
  playerName: string | null;

  @Column("varchar", { name: "domain_hand", nullable: true, length: 2 })
  domainHand: string | null;

  @Column("varchar", { name: "average", nullable: true, length: 10 })
  average: string | null;
}

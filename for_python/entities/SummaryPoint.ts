import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_summary_point", ["gameInfoId", "inning", "no"], {})
@Entity("summary_point", { schema: "baseball_2020" })
export class SummaryPoint extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("varchar", { name: "inning", nullable: true, length: 5 })
  inning: string | null;

  @Column("varchar", { name: "team", nullable: true, length: 10 })
  team: string | null;

  @Column("varchar", { name: "no", nullable: true, length: 3 })
  no: string | null;

  @Column("varchar", { name: "order", nullable: true, length: 3 })
  order: string | null;

  @Column("varchar", { name: "batter", nullable: true, length: 20 })
  batter: string | null;

  @Column("varchar", { name: "detail", nullable: true, length: 100 })
  detail: string | null;
}
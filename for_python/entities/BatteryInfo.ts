import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_battery_info", ["gameInfoId", "pitcher", "catcher"], {})
@Entity("battery_info", { schema: "baseball_2020" })
export class BatteryInfo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("varchar", { name: "pitcher", nullable: true, length: 100 })
  pitcher: string | null;

  @Column("varchar", { name: "catcher", nullable: true, length: 100 })
  catcher: string | null;
}

import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_battery_info", ["gameInfoId", "pitcher", "catcher"], {})
@Entity("battery_info", { schema: format("baseball_%s", getYear()) })
export class BatteryInfo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("smallint", { name: "scene" })
  scene: number;

  @Column("varchar", { name: "current_p", nullable: true, length: 20 })
  currentP: string | null;

  @Column("varchar", { name: "current_c", nullable: true, length: 20 })
  currentC: string | null;

  @Column("varchar", { name: "pitcher", nullable: true, length: 100 })
  pitcher: string | null;

  @Column("varchar", { name: "catcher", nullable: true, length: 100 })
  catcher: string | null;
}

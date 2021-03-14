import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_homerun_info", ["gameInfoId", "scene", "homerun"], {})
@Entity("homerun_info", { schema: format("baseball_%s", getYear()) })
export class HomerunInfo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("smallint", { name: "scene" })
  scene: number;

  @Column("varchar", { name: "homerun", nullable: true, length: 250 })
  homerun: string | null;
}

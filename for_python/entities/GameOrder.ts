import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_game_order", ["teamInfoId"], {})
@Entity("game_order", { schema: format("baseball_%s", getYear()) })
export class GameOrder extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "team_info_id" })
  teamInfoId: number;

  @Column("tinyint", { name: "order_no" })
  orderNo: number;

  @Column("varchar", { name: "position", length: 3 })
  position: string;

  @Column("varchar", { name: "name", length: 20 })
  name: string;

  @Column("varchar", { name: "domain_hand", length: 2 })
  domainHand: string;

  @Column("varchar", { name: "average", length: 10 })
  average: string;
}

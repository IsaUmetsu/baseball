import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_pitcher_batter", ["pitchInfoId"], {})
@Entity("pitcher_batter", { schema: format("baseball_%s", getYear()) })
export class PitcherBatter extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "pitch_info_id" })
  pitchInfoId: number;

  @Column("varchar", { name: "left_title", nullable: true, length: 5 })
  leftTitle: string | null;

  @Column("varchar", { name: "left_name", nullable: true, length: 20 })
  leftName: string | null;

  @Column("varchar", { name: "left_domain_hand", nullable: true, length: 2 })
  leftDomainHand: string | null;

  @Column("varchar", { name: "right_title", nullable: true, length: 5 })
  rightTitle: string | null;

  @Column("varchar", { name: "right_name", nullable: true, length: 45 })
  rightName: string | null;

  @Column("varchar", { name: "right_domain_hand", nullable: true, length: 2 })
  rightDomainHand: string | null;
}

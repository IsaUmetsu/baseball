import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_pitch_details", ["pitchInfoId"], {})
@Entity("pitch_details", { schema: format("baseball_%s", getYear()) })
export class PitchDetails extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "pitch_info_id" })
  pitchInfoId: number;

  @Column("tinyint", { name: "judge_icon", nullable: true })
  judgeIcon: number | null;

  @Column("smallint", { name: "pitch_cnt", nullable: true })
  pitchCnt: number | null;

  @Column("varchar", { name: "pitch_type", nullable: true, length: 10 })
  pitchType: string | null;

  @Column("varchar", { name: "pitch_speed", nullable: true, length: 10 })
  pitchSpeed: string | null;

  @Column("varchar", {
    name: "pitch_judge_detail",
    nullable: true,
    length: 100,
  })
  pitchJudgeDetail: string | null;

  @Column("tinyint", { name: "is_swing", nullable: true })
  isSwing: number | null;

  @Column("tinyint", { name: "is_missed", nullable: true })
  isMissed: number | null;
}

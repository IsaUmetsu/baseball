import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_pitch_details", ["pitchInfoId"], {})
@Entity("pitch_details", { schema: "baseball_2020" })
export class PitchDetails extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "pitch_info_id" })
  pitchInfoId: number;

  @Column("tinyint", { name: "judge_icon", nullable: true })
  judgeIcon: number | null;

  @Column("tinyint", { name: "pitch_cnt", nullable: true })
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
}

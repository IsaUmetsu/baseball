import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_pitch_course", ["pitchInfoId"], {})
@Entity("pitch_course", { schema: format("baseball_%s", getYear()) })
export class PitchCourse extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "pitch_info_id" })
  pitchInfoId: number;

  @Column("smallint", { name: "pitch_cnt", nullable: true })
  pitchCnt: number | null;

  @Column("smallint", { name: "top", nullable: true })
  top: number | null;

  @Column("smallint", { name: "left", nullable: true })
  left: number | null;
}

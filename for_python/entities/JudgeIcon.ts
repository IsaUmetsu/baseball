import { Column, Entity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Entity("judge_icon", { schema: format("baseball_%s", getYear()) })
export class JudgeIcon {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 20 })
  name: string;
}

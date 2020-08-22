import { Column, Entity } from "typeorm";

@Entity("judge_icon", { schema: "baseball_2020" })
export class JudgeIcon {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 20 })
  name: string;
}

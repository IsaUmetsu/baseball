import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Entity("tweet", { schema: format("baseball_%s", getYear()) })
export class Tweet extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "script_name", nullable: true, length: 30 })
  scriptName: string | null;

  @Column("varchar", { name: "team", nullable: true, length: 20 })
  team: string | null;

  @Column("varchar", { name: "tweeted_day", nullable: true, length: 10 })
  tweetedDay: string | null;
}

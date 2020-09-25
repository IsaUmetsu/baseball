import { Column, Entity, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Entity("tweet", { schema: "baseball_2020" })
export class Tweet extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "script_name", nullable: true, length: 20 })
  scriptName: string | null;

  @Column("varchar", { name: "team", nullable: true, length: 20 })
  team: string | null;

  @Column("datetime", { name: "tweeted_at", nullable: true })
  tweetedAt: Date | null;
}

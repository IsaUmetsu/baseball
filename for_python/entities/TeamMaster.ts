import { Column, Entity, Index, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("team_initial_kana_UNIQUE", ["teamInitialKana"], { unique: true })
@Entity("team_master", { schema: format("baseball_%s", getYear()) })
export class TeamMaster extends BaseEntity {
  @Column("varchar", { primary: true, name: "team_initial_kana", length: 2 })
  teamInitialKana: string;

  @Column("varchar", { name: "team_initial", nullable: true, length: 2 })
  teamInitial: string | null;
}

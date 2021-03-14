import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_game_info", ["date", "awayTeamInitial", "homeTeamInitial"], {})
@Index("idx_no_game", ["noGame"], {})
@Entity("game_info", { schema: format("baseball_%s", getYear()) })
export class GameInfo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "date", length: 8 })
  date: string;

  @Column("varchar", { name: "away_team_initial", length: 2 })
  awayTeamInitial: string;

  @Column("varchar", { name: "home_team_initial", length: 2 })
  homeTeamInitial: string;

  @Column("varchar", { name: "game_no", length: 2 })
  gameNo: string;

  @Column("tinyint", { name: "no_game", default: () => "'0'" })
  noGame: number;
}

import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
import { format } from 'util';
import { getYear } from "../util/day";

@Index("idx_date", ["date"], {})
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

  @Column("tinyint", { name: "is_op", nullable: true })
  isOp: number | null;

  @Column("tinyint", { name: "is_rg", nullable: true })
  isRg: number | null;

  @Column("tinyint", { name: "is_cs", nullable: true, default: () => "'0'" })
  isCs: number | null;

  @Column("tinyint", { name: "is_js", nullable: true, default: () => "'0'" })
  isJs: number | null;

  @Column("tinyint", { name: "is_il", nullable: true })
  isIl: number | null;
}

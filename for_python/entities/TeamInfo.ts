import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_team_info_2", ["homeAway", "teamName"], {})
@Index("idx_team_info_1", ["gameInfoId", "scene", "homeAway"], {})
@Entity("team_info", { schema: "baseball_2020" })
export class TeamInfo extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("smallint", { name: "scene" })
  scene: number;

  @Column("varchar", { name: "home_away", length: 5 })
  homeAway: string;

  @Column("varchar", { name: "team_name", length: 10 })
  teamName: string;

  @Column("varchar", { name: "team_initial_kana", nullable: true, length: 2 })
  teamInitialKana: string | null;

  @Column("int", { name: "battery_info_id", nullable: true })
  batteryInfoId: number | null;

  @Column("int", { name: "homerun_info_id", nullable: true })
  homerunInfoId: number | null;
}

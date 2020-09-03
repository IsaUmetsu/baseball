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

  @Column("int", { name: "battery_info_id", nullable: true })
  batteryInfoId: number | null;

  @Column("varchar", { name: "homerun_info", nullable: true, length: 250 })
  homerunInfo: string | null;
}

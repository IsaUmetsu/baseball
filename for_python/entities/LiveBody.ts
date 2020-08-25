import { Column, Entity, Index, PrimaryGeneratedColumn, BaseEntity } from "typeorm";

@Index("idx_live_body", ["gameInfoId", "scene"], {})
@Entity("live_body", { schema: "baseball_2020" })
export class LiveBody extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "game_info_id" })
  gameInfoId: number;

  @Column("int", { name: "scene" })
  scene: number;

  @Column("varchar", { name: "batting_result", nullable: true, length: 200 })
  battingResult: string | null;

  @Column("varchar", { name: "pitching_result", nullable: true, length: 200 })
  pitchingResult: string | null;

  @Column("varchar", {
    name: "current_batter_name",
    nullable: true,
    length: 20,
  })
  currentBatterName: string | null;

  @Column("varchar", {
    name: "current_batter_player_no",
    nullable: true,
    length: 5,
  })
  currentBatterPlayerNo: string | null;

  @Column("varchar", {
    name: "current_batter_domain_hand",
    nullable: true,
    length: 3,
  })
  currentBatterDomainHand: string | null;

  @Column("varchar", {
    name: "current_batter_average",
    nullable: true,
    length: 20,
  })
  currentBatterAverage: string | null;

  @Column("varchar", {
    name: "current_pitcher_name",
    nullable: true,
    length: 20,
  })
  currentPitcherName: string | null;

  @Column("varchar", {
    name: "current_pitcher_player_no",
    nullable: true,
    length: 5,
  })
  currentPitcherPlayerNo: string | null;

  @Column("varchar", {
    name: "current_pitcher_domain_hand",
    nullable: true,
    length: 3,
  })
  currentPitcherDomainHand: string | null;

  @Column("smallint", { name: "current_pitcher_pitch", nullable: true })
  currentPitcherPitch: number | null;

  @Column("tinyint", { name: "current_pitcher_vs_batter_cnt", nullable: true })
  currentPitcherVsBatterCnt: number | null;

  @Column("varchar", {
    name: "current_pitcher_era",
    nullable: true,
    length: 10,
  })
  currentPitcherEra: string | null;

  @Column("varchar", { name: "base1_player", nullable: true, length: 20 })
  base1Player: string | null;

  @Column("varchar", { name: "base2_player", nullable: true, length: 20 })
  base2Player: string | null;

  @Column("varchar", { name: "base3_player", nullable: true, length: 20 })
  base3Player: string | null;

  @Column("varchar", { name: "next_batter_name", nullable: true, length: 45 })
  nextBatterName: string | null;

  @Column("varchar", { name: "inning_batter_cnt", nullable: true, length: 5 })
  inningBatterCnt: string | null;

  @Column("tinyint", { name: "is_pa", nullable: true })
  isPa: number | null;

  @Column("tinyint", { name: "is_ab", nullable: true })
  isAb: number | null;

  @Column("tinyint", { name: "is_hit", nullable: true })
  isHit: number | null;

  @Column("tinyint", { name: "is_onbase", nullable: true })
  isOnbase: number | null;

  @Column("tinyint", { name: "is_err", nullable: true })
  isErr: number | null;

  @Column("tinyint", { name: "is_fc", nullable: true })
  isFc: number | null;

  @Column("tinyint", { name: "is_change_pitcher", nullable: true })
  isChangePitcher: number | null;

  @Column("tinyint", { name: "is_change_fileder", nullable: true })
  isChangeFileder: number | null;

  @Column("tinyint", { name: "is_change_batter", nullable: true })
  isChangeBatter: number | null;

  @Column("tinyint", { name: "is_change_runner", nullable: true })
  isChangeRunner: number | null;
}

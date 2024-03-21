import { DataSource } from 'typeorm';

import { GameInfo, LiveHeader, LiveBody, PitchInfo, PitchCourse, PitchDetails, PitcherBatter, TeamInfo, GameOrder, BenchMemberInfo, BenchMaster, BatteryInfo, HomerunInfo, SummaryPoint, StatsPitcher, StatsBatter, StatsScoreboard } from '../entities';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "baseball_2024",
    synchronize: false,
    entities: [GameInfo, LiveHeader, LiveBody, PitchInfo, PitchCourse, PitchDetails, PitcherBatter, TeamInfo, GameOrder, BenchMemberInfo, BenchMaster, BatteryInfo, HomerunInfo, SummaryPoint, StatsPitcher, StatsBatter, StatsScoreboard]
});

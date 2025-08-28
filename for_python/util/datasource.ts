import { DataSource } from 'typeorm';

import { GameInfo, LiveHeader, LiveBody, PitchInfo, PitchCourse, PitchDetails, PitcherBatter, TeamInfo, GameOrder, BenchMemberInfo, BenchMaster, BatteryInfo, HomerunInfo, SummaryPoint, StatsPitcher, StatsBatter, StatsScoreboard } from '../entities';

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "127.0.0.1",
    port: 3306,
    username: "baseball",
    password: "baseball",
    database: "baseball_" + process.env.YEAR,
    synchronize: false,
    entities: [GameInfo, LiveHeader, LiveBody, PitchInfo, PitchCourse, PitchDetails, PitcherBatter, TeamInfo, GameOrder, BenchMemberInfo, BenchMaster, BatteryInfo, HomerunInfo, SummaryPoint, StatsPitcher, StatsBatter, StatsScoreboard]
});

module.exports = [
  {
    name: 'default',
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'baseball',
    password: 'baseball',
    database: 'baseball_' + process.env.YEAR,
    synchronize: false,
    logging: false,
    connectTimeout: 30 * 1000,
    acquireTimeout: 30 * 1000,
    entities: [__dirname + '/for_python/entities/*.ts'],
    migrations: [__dirname + '/for_python/migration/*.ts'],
    cli: {
      entitiesDir: 'entities',
      migrationsDir: 'migration',
    }
  },
];
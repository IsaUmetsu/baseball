module.exports = [
  {
    name: 'default',
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'baseball_2023',
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
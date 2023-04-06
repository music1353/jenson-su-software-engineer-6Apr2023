import { ConnectionOptions } from 'typeorm';
import { Config } from '../../config';

const config: ConnectionOptions = {
  type: 'postgres',
  host: Config.database.HOST,
  port: parseInt(Config.database.PORT),
  username: Config.database.USERNAME,
  password: Config.database.PASSWORD,
  database: Config.database.NAME,
  synchronize: true,
  entities: [
    '**/src/entities/*{.ts,.js}'
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  cli: {
    'migrationsDir': __dirname + '/migrations'
  }
};

export default config;
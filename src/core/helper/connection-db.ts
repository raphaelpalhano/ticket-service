import pgp from 'pg-promise';
import * as env from 'dotenv';

env.config();

export const connection = () => {
  if (!global.DB_DATA) {
    global.DB_DATA = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    };
  }
  const connection = pgp()(global.DB_DATA);
  return connection;
};

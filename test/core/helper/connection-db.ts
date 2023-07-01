import pgp from 'pg-promise';
import { PostgreSqlContainer } from 'testcontainers';

const baseDbTestContainer = new PostgreSqlContainer('postgres');

export default async () => {
  console.time('[Postgres container] started in');
  console.log('[Postgres container] starting...');
  const startedTestContainer = await baseDbTestContainer.start();
  process.env.DB_HOST = startedTestContainer.getHost();
  process.env.DB_PORT = String(startedTestContainer.getMappedPort(5432));
  process.env.DB_USER = startedTestContainer.getUsername();
  process.env.DB_PASSWORD = startedTestContainer.getPassword();
  process.env.DB_NAME = startedTestContainer.getDatabase();
  global.TESTCONTAINER_POSTGRES = startedTestContainer;
  global.DB_DATA = {
    host: startedTestContainer.getHost(),
    port: startedTestContainer.getPort(),
    database: startedTestContainer.getDatabase(),
    user: startedTestContainer.getUsername(),
    password: startedTestContainer.getPassword(),
  };
  const connection = pgp()(global.DB_DATA);

  console.timeEnd('[Postgres container] started in');

  console.log('Start DDL...');

  await connection.query('create schema tickect_broker;');

  await connection.query(`create table tickect_broker.event (
    event_id uuid,
    description text,
    price numeric,
    capacity integer
  );`);

  await connection.query(`create table tickect_broker.ticket (
    ticket_id uuid,
    event_id uuid,
    email text,
    status text
  );`);

  await connection.query(`create table tickect_broker.transaction (
    transaction_id uuid,
    ticket_id uuid,
    event_id uuid,
    price numeric,
    tid text,
    status text
  );`);

  await connection.query(`insert into tickect_broker.event
  (event_id, description, price, capacity) values 
  ('bf6a9b3d-4d5c-4c9d-bf3b-4a091b05dc76', 'Foo Fighters 10/10/2022 22:00', 300, 100000);
  `);
};

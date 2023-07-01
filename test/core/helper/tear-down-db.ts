export default async () => {
  global.TESTCONTAINER_POSTGRES.stop();
  console.log('[Postgres container] stopped');
};

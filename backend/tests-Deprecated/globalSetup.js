// tests/global-setup.js
import { sequelize, connectToDatabase } from '../util/db.js';

export async function setup() {
  console.log('Vitest global setup: connecting & migrating...');

  // await sequelize.query('DROP SCHEMA public CASCADE');
  await sequelize.query('CREATE SCHEMA IF NOT EXISTS public');
  await connectToDatabase();
}

export async function teardown() {
  console.log('Vitest global teardown: dropping & closing...');

  await sequelize.query('DROP SCHEMA public CASCADE');
  await sequelize.query('CREATE SCHEMA IF NOT EXISTS public');

  console.log('done in global teardown');

  await sequelize.close();

}

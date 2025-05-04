import { Sequelize } from 'sequelize'
import { DATABASE_URL } from './config.js'
import { Umzug, SequelizeStorage } from 'umzug'

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: true,
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('Connected to the database')
  } catch (err) {
    console.log('failed to connect to the database', err)
    return process.exit(1)
  }

  return null
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.cjs',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations', schema: 'public', }),
  context: sequelize.getQueryInterface(),
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

export { connectToDatabase, sequelize, rollbackMigration }
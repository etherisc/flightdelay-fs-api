const dotenv = require('dotenv');
const config = dotenv.load().parsed;

module.exports = {
  client: 'pg',
  connection: {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME
  },
  pool: {
    min: 5,
    max: 15
  },
  migrations: {
    tableName: 'fdd_api_migrations'
  },
  acquireConnectionTimeout: 60000,
  onUpdateTrigger: {
    up: table => `
      CREATE TRIGGER ${table}_updated_at
      BEFORE UPDATE ON ${table}
      FOR EACH ROW
      EXECUTE PROCEDURE on_update_timestamp()
    `,
    down: table => `DROP TRIGGER IF EXISTS ${table}_updated_at on ${table}`
  }
};

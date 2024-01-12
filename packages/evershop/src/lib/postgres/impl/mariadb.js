const mariadb = require('mariadb');
const { getConfig } = require('../../util/getConfig');

function _convertSettings(settings) {
  const custom_settings = {
    host: settings.host,
    port: settings.port,
    user: settings.user,
    password: settings.password,
    database: settings.database,
    connectionLimit: settings.max,
    checkDuplicate: false
  }
  if(settings.ssl){
    custom_settings.ssl = {
      cert: settings.ssl.cert,
      key: settings.ssl.key,
      ca: settings.ssl.ca
    }
  }
  return custom_settings;
}

const ADMIN_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS \`admin_user\` (
  \`admin_user_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`uuid\` VARCHAR(128) NOT NULL DEFAULT UUID(),
  \`status\` TINYINT(1) NOT NULL DEFAULT TRUE,
  \`email\` VARCHAR(100) NOT NULL,
  \`password\` VARCHAR(60) NOT NULL,
  \`full_name\` VARCHAR(100),
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`ADMIN_USER_EMAIL_UNIQUE\` UNIQUE (\`email\`),
  CONSTRAINT \`ADMIN_USER_UUID_UNIQUE\` UNIQUE (\`uuid\`));`

const MIGRATION_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS \`migration\` (
  \`migration_id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`module\` VARCHAR(50) NOT NULL,
  \`version\` VARCHAR(20) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT \`MODULE_UNIQUE\` UNIQUE (\`module\`)
);`;

const QUERY_BUILDER = require('@evershop/mariadb-query-builder');

function createConnectionPool(settings) {
  custom_settings = _convertSettings(settings);
  const pool = mariadb.createPool(custom_settings);
  // Set the timezone
  pool.on('connection', (client) => {
    const timeZone = getConfig('shop.timezone', 'UTC');
    client.query(`SET time_zone = "${timeZone}";`);
  });
  return pool;
}

async function getConnection(pool) {
  return await pool.getConnection();
}

// eslint-disable-next-line no-multi-assign
module.exports = exports = { createConnectionPool, getConnection, MIGRATION_TABLE_QUERY, ADMIN_TABLE_QUERY, QUERY_BUILDER };
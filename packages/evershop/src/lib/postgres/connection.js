/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const fs = require('fs');
const { getConfig } = require('../util/getConfig');

const DB_IMPL_PATH = 'impl';

// Retrieve the database implementations and check which one was selected
const implementations = fs.readdirSync(path.resolve(module.path, DB_IMPL_PATH), {
  withFileTypes: true
})
  .filter(
    (dirent) =>
      dirent.isFile() &&
      dirent.name.endsWith('.js')
  )
  .map((dirent) => dirent.name.replace('.js', ''));


const dbType = process.env.DB_TYPE || getConfig('system.database.type', 'postgres');
if(!implementations.includes(dbType)) {
  throw `Critical Error: ${dbType} is not a valid DB type, supported types: [${implementations}]`;
}

// Use env for the database connection, maintain the backward compatibility
const connectionSetting = {
  host: process.env.DB_HOST || getConfig('system.database.host'),
  port: process.env.DB_PORT || getConfig('system.database.port'),
  user: process.env.DB_USER || getConfig('system.database.user'),
  password: process.env.DB_PASSWORD || getConfig('system.database.password'),
  database: process.env.DB_NAME || getConfig('system.database.database'),
  max: 20
};

// Support SSL
const sslMode = process.env.DB_SSLMODE || getConfig('system.database.ssl_mode');
switch (sslMode) {
  case 'disable': {
    connectionSetting.ssl = false;
    break;
  }
  case 'require':
  case 'prefer':
  case 'verify-ca':
  case 'verify-full': {
    const ssl = {
      rejectUnauthorized: true
    };
    const ca = process.env.DB_SSLROOTCERT;
    if (ca) {
      ssl.ca = fs.readFileSync(ca).toString();
    }
    const cert = process.env.DB_SSLCERT;
    if (cert) {
      ssl.cert = fs.readFileSync(cert).toString();
    }
    const key = process.env.DB_SSLKEY;
    if (key) {
      ssl.key = fs.readFileSync(key).toString();
    }
    connectionSetting.ssl = ssl;
    break;
  }
  case 'no-verify': {
    connectionSetting.ssl = {
      rejectUnauthorized: false
    };
    break;
  }
  default: {
    connectionSetting.ssl = false;
    break;
  }
}

const dbImpl = require(path.resolve(module.path, DB_IMPL_PATH, `${dbType}.js`))

const pool = dbImpl.createConnectionPool(connectionSetting);

async function getConnection() {
  // eslint-disable-next-line no-return-await
  return dbImpl.getConnection(pool);
}

function getMigrationTableQuery() {
  return dbImpl.MIGRATION_TABLE_QUERY;
}

function getAdminTableQuery() {
  return dbImpl.ADMIN_TABLE_QUERY;
}

const {QUERY_BUILDER} = dbImpl

// eslint-disable-next-line no-multi-assign
module.exports = exports = { pool, QUERY_BUILDER, getConnection, getMigrationTableQuery, getAdminTableQuery, dbType };

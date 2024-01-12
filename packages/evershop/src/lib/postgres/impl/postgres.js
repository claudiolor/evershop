const { Pool } = require('pg');
const { getConfig } = require('../../util/getConfig');

const ADMIN_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS "admin_user" (
  "admin_user_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  "uuid" UUID NOT NULL DEFAULT gen_random_uuid (),
  "status" boolean NOT NULL DEFAULT TRUE,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "full_name" varchar DEFAULT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ADMIN_USER_EMAIL_UNIQUE" UNIQUE ("email"),
  CONSTRAINT "ADMIN_USER_UUID_UNIQUE" UNIQUE ("uuid")
);`;

const MIGRATION_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS "migration"  (
  "migration_id" INT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,
  "module" varchar NOT NULL,
  "version" varchar NOT NULL,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MODULE_UNIQUE" UNIQUE ("module")
  )`

const QUERY_BUILDER = require('@evershop/evershop/src/lib/postgres/query-builder');

function createConnectionPool(settings) {
  const pool = new Pool(settings);
  // Set the timezone
  pool.on('connect', (client) => {
    const timeZone = getConfig('shop.timezone', 'UTC');
    client.query(`SET TIMEZONE TO "${timeZone}";`);
  });
  return pool;
}

async function getConnection(pool) {
  return await pool.connect();
}

// eslint-disable-next-line no-multi-assign
module.exports = exports = { createConnectionPool, getConnection, MIGRATION_TABLE_QUERY, ADMIN_TABLE_QUERY, QUERY_BUILDER };
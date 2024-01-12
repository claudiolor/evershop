const { execute } = require('@evershop/evershop/src/lib/postgres/query-builder');
const { getMigrationTableQuery } = require('@evershop/evershop/src/lib/postgres/connection');

module.exports.createMigrationTable = async function createMigrationTable(
  connection
) {
  await execute(connection, getMigrationTableQuery());
};

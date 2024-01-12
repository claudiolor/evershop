const { execute } = require('@evershop/evershop/src/lib/postgres/query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS setting (
      setting_id INT AUTO_INCREMENT PRIMARY KEY,
      uuid VARCHAR(128) NOT NULL DEFAULT UUID(),
      name VARCHAR(100) NOT NULL,
      value TEXT DEFAULT NULL,
      is_json TINYINT(1) NOT NULL DEFAULT FALSE,
      UNIQUE INDEX SETTING_UUID_UNIQUE (uuid),
      UNIQUE INDEX SETTING_NAME_UNIQUE (name)
    )`
  );
};

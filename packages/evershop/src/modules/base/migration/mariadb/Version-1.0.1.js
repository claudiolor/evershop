const { execute } = require('@evershop/evershop/src/lib/postgres/query-builder');

// eslint-disable-next-line no-multi-assign
module.exports = exports = async (connection) => {
  await execute(
    connection,
    `CREATE TABLE IF NOT EXISTS \`event\` (
      \`event_id\` INT AUTO_INCREMENT PRIMARY KEY,
      \`uuid\` CHAR(16) NOT NULL DEFAULT UUID(),
      \`name\` VARCHAR(255) NOT NULL,
      \`data\` JSON,
      \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT \`EVENT_UUID\` UNIQUE (\`uuid\`)
    );`
  );
};

const { insert } = require('@evershop/evershop/src/lib/postgres/query-builder');
const { pool } = require('@evershop/evershop/src/lib/postgres/connection');

module.exports.emit = async function emit(name, data) {
  await insert('event')
    .given({
      name,
      data
    })
    .execute(pool);
};

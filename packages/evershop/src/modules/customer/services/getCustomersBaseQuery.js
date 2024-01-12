const { select } = require('@evershop/evershop/src/lib/postgres/query-builder');

module.exports.getCustomersBaseQuery = () => {
  const query = select().from('customer');

  return query;
};

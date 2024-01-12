const { select } = require('@evershop/evershop/src/lib/postgres/query-builder');

module.exports.getOrdersBaseQuery = () => {
  const query = select().from('order');

  return query;
};

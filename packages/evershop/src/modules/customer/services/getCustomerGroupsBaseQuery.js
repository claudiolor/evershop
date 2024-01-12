const { select } = require('@evershop/evershop/src/lib/postgres/query-builder');

module.exports.getCustomerGroupsBaseQuery = () => {
  const query = select().from('customer_group');

  return query;
};

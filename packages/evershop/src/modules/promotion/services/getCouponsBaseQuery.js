const { select } = require('@evershop/evershop/src/lib/postgres/query-builder');

module.exports.getCouponsBaseQuery = () => {
  const query = select().from('coupon');

  return query;
};

const { select } = require('@evershop/evershop/src/lib/postgres/query-builder');

module.exports.getCollectionsBaseQuery = () => {
  const query = select().from('collection');

  return query;
};

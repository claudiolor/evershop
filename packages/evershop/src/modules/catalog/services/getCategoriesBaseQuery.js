const { select } = require('@evershop/evershop/src/lib/postgres/query-builder');

module.exports.getCategoriesBaseQuery = () => {
  const query = select().from('category');
  query
    .leftJoin('category_description')
    .on(
      'category_description.category_description_category_id',
      '=',
      'category.category_id'
    );

  return query;
};


exports.up = function(knex, Promise) {
  return knex.schema.table('movies', function(table) {
    table.date('date_borrowed');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('movies', function(table) {
    table.dropColumn('date_borrowed');
  });
};

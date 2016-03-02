
exports.up = function(knex, Promise) {
  return knex.schema.table('movies', function(table) {
    table.dropColumn('renter');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('movies', function(table) {
    table.string('renter')
      .defaultTo('false');
  });
};

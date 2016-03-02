
exports.up = function(knex, Promise) {
  return knex.schema.table('movies', function(table) {
    table.integer('borrower_id')
      .references('id')
      .inTable('borrowers');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('movies', function(table) {
    table.dropColumn('borrower_id');
  });
};

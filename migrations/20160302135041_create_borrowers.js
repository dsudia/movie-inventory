
exports.up = function(knex, Promise) {
  return knex.schema.createTable('borrowers', function(table) {
    table.increments();
    table.string('first_name');
    table.string('last_name');
    table.string('email');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('borrowers');
};

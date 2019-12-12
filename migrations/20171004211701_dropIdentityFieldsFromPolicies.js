module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('first_name');
    t.dropColumn('last_name');
    t.dropColumn('email');
    t.dropColumn('ethereum_account_id');
    t.dropColumn('birth_date')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.string('first_name', 100).notNullable();
    t.string('last_name', 100).notNullable();
    t.string('email', 100).notNullable();
    t.string('ethereum_account_id', 100);
    t.date('birth_date')
  })
};

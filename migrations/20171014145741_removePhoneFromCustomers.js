module.exports.up = function (db) {
  return db.schema.alterTable('customers', t => {
    t.dropColumn('phone')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('customers', t => {
    t.string('phone', 100).notNullable()
  })
};

module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.string('origin', 100).notNullable();
    t.string('destination', 100).notNullable()
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('origin');
    t.dropColumn('destination')
  })
};

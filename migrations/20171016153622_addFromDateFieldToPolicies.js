module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.integer('fromDate')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('fromDate')
  })
};

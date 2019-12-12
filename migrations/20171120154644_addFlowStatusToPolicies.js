module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.string('flowStatus', 256)
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('flowStatus')
  })
};

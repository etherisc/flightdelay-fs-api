module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.text('rating')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('rating')
  })
};

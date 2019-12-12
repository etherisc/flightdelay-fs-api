module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.text('flowError')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('flowError')
  })
};

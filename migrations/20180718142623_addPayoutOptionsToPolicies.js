module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.text('payoutOptions')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('payoutOptions')
  })
};

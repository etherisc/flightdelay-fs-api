module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.decimal('exposurePayoutInEur', 64, 32)
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('exposurePayoutInEur')
  })
};

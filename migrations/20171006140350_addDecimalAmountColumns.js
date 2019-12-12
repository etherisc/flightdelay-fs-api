
module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.decimal('amount', 64, 0);
    t.decimal('chargeAmount', 64, 0);
    t.decimal('payoutAmount', 64, 0)
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('amount');
    t.dropColumn('chargeAmount');
    t.dropColumn('payoutAmount')
  })
};

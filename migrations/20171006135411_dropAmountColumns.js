
module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('amount');
    t.dropColumn('chargeAmount');
    t.dropColumn('payoutAmount')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.integer('amount').notNullable();
    t.integer('chargeAmount').notNullable();
    t.integer('payoutAmount').notNullable()
  })
};

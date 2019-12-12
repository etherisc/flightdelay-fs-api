exports.up = (db) => {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('birth_date');
    t.string('coupon_code');
    t.renameColumn('charged_amount', 'charge_amount')
  }).then(() => {
    return db.schema.alterTable('policies', t => {
      t.string('birth_date')
    })
  })
};

exports.down = (db) => {
  return db.schema.alterTable('policies', t => {
    t.dropColumns('coupon_code', 'birth_date');
    t.renameColumn('charge_amount', 'charged_amount')
  }).then(() => {
    return db.schema.alterTable('policies', t => {
      t.date('birth_date')
    })
  })
};

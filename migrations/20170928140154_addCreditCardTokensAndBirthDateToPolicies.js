exports.up = (db) => {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('credit_card_token');
    t.string('credit_card_payout_id', 100);
    t.string('credit_card_payout_token', 100);
    t.string('credit_card_premium_token', 100);
    t.date('birth_date')
  })
};

exports.down = (db) => {
  return db.schema.alterTable('policies', t => {
    t.dropColumns('credit_card_payout_id', 'birth_date');
    t.string('credit_card_token', 100)
  })
};

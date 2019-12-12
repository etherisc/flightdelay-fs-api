module.exports.up = (db) => {
  return db.schema.createTable('policies', t => {
    t.uuid('id').notNullable().primary();
    t.string('customer_id', 256).notNullable();
    t.string('first_name', 100).notNullable();
    t.string('last_name', 100).notNullable();
    t.string('email', 100).notNullable();
    t.string('flight_number', 100).notNullable();
    t.integer('amount').notNullable();
    t.string('currency', 100).notNullable();
    t.string('ethereum_account_id', 100);
    t.string('credit_card_token', 100);
    t.string('credit_card_account_id', 100);
    t.string('credit_card_charge_id', 100);
    t.string('credit_card_transfer_id', 100);
    t.integer('charged_amount');
    t.integer('payout_amount');
    t.timestamps()
  })
};

module.exports.down = (db) => {
  return db.schema.dropTable('policies')
};

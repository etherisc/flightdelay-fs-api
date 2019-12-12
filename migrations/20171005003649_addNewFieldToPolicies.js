module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.string('carrier', 100).notNullable();
    t.integer('departsAt').notNullable();
    t.integer('arrivesAt').notNullable();
    t.string('contract', 256);
    t.integer('policyId');
    t.dropColumn('created_at');
    t.dropColumn('updated_at');
    t.timestamp('createdAt').notNullable().defaultTo(db.fn.now());
    t.timestamp('updatedAt').notNullable().defaultTo(db.fn.now());
    t.renameColumn('flight_number', 'flightNumber');
    t.renameColumn('customer_id', 'customerId');
    t.renameColumn('credit_card_account_id', 'creditCardAccountId');
    t.renameColumn('credit_card_charge_id', 'creditCardChargeId');
    t.renameColumn('credit_card_transfer_id', 'creditCardTransferId');
    t.renameColumn('charge_amount', 'chargeAmount');
    t.renameColumn('payout_amount', 'payoutAmount');
    t.renameColumn('credit_card_payout_id', 'creditCardPayoutId');
    t.renameColumn('credit_card_payout_token', 'creditCardPayoutToken');
    t.renameColumn('credit_card_premium_token', 'creditCardPremiumToken');
    t.renameColumn('coupon_code', 'couponCode')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('carrier');
    t.dropColumn('departsAt');
    t.dropColumn('arrivesAt');
    t.dropColumn('contract');
    t.dropColumn('policyId');
    t.renameColumn('flightNumber', 'flight_number');
    t.renameColumn('customerId', 'customer_id');
    t.renameColumn('creditCardAccountId', 'credit_card_account_id');
    t.renameColumn('creditCardChargeId', 'credit_card_charge_id');
    t.renameColumn('creditCardTransferId', 'credit_card_transfer_id');
    t.renameColumn('chargeAmount', 'charge_amount');
    t.renameColumn('payoutAmount', 'payout_amount');
    t.renameColumn('creditCardPayoutId', 'credit_card_payout_id');
    t.renameColumn('creditCardPayoutToken', 'credit_card_payout_token');
    t.renameColumn('creditCardPremiumToken', 'credit_card_premium_token');
    t.renameColumn('couponCode', 'coupon_code')
  })
};

exports.up = knex => {
  return knex.schema.alterTable('policies', t => {
    t.timestamp('payoutTime')
  })
};

exports.down = knex => {
  return knex.schema.alterTable('policies', t => {
    t.dropColumn('payoutTime')
  })
};

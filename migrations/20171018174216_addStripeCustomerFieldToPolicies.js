module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.string('stripeCustomerId', 256)
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('stripeCustomerId')
  })
};

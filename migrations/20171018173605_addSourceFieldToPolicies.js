module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.string('stripeSourceId', 256)
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('stripeSourceId')
  })
};

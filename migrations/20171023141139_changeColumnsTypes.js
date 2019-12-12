module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.string('departsAt', 256).alter();
    t.string('arrivesAt', 256).alter()
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.integer('departsAt').alter();
    t.integer('arrivesAt').alter()
  })
};

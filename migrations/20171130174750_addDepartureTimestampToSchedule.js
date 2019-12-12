module.exports.up = function (db) {
  return db.schema.alterTable('schedule', t => {
    t.integer('departureTimeUTC')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('schedule', t => {
    t.dropColumn('departureTimeUTC')
  })
};

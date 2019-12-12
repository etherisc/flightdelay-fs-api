module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.boolean('lock')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('lock')
  })
};

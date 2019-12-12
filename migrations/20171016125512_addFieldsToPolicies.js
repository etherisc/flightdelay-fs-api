module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.string('status', 256);
    t.string('txHash', 256)
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('status');
    t.dropColumn('txHash')
  })
};

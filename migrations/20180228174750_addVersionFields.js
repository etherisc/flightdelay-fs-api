module.exports.up = function (db) {
  return db.schema.alterTable('policies', t => {
    t.varchar('apiVersion');
    t.varchar('contractsVersion')
  })
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('apiVersion');
    t.dropColumn('contractsVersion')
  })
};

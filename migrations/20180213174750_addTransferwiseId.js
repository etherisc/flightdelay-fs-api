module.exports.up = function (db, Promise) {
  return Promise.all([
    db.schema.hasColumn('policies', 'payoutTransactionSent')
      .then(hasColumn => {
        if (!hasColumn) {
          return db.schema.alterTable('policies', t => {
            t.boolean('payoutTransactionSent')
          })
        }
      }),
    db.schema.hasColumn('policies', 'payoutId')
      .then(hasColumn => {
        if (!hasColumn) {
          return db.schema.alterTable('policies', t => {
            t.integer('payoutId')
          })
        }
      })
  ])
};

module.exports.down = function (db) {
  return db.schema.alterTable('policies', t => {
    t.dropColumn('payoutId');
    t.dropColumn('payoutTransactionSent')
  })
};

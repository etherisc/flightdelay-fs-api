module.exports.up = function (db, Promise) {
  return Promise.all([
    db.schema.hasColumn('customers', 'created_at')
      .then(hasColumn => {
        if (hasColumn) {
          return db.schema.alterTable('customers', t => {
            t.renameColumn('created_at', 'createdAt')
          })
        }
      }),
    db.schema.hasColumn('customers', 'updated_at')
      .then(hasColumn => {
        if (hasColumn) {
          return db.schema.alterTable('customers', t => {
            t.renameColumn('updated_at', 'updatedAt')
          })
        }
      })
  ])
};

module.exports.down = function (db) {
  return db.schema.alterTable('customers', table => {
    table.renameColumn('createdAt', 'created_at');
    table.renameColumn('updatedAt', 'updated_at')
  })
};

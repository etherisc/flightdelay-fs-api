const { onUpdateTrigger } = require('../knexfile');

module.exports.up = function (db) {
  return db.schema.hasColumn('policies', 'createdAt')
    .then(hasColumn => {
      if (!hasColumn) {
        return db.schema.alterTable('policies', table => {
          table.timestamp('createdAt').notNullable().defaultTo(db.fn.now())
        })
      }
    })
    .then(() => db.schema.hasColumn('policies', 'updatedAt')
      .then(hasColumn => {
        if (!hasColumn) {
          return db.schema.alterTable('policies', table => {
            table.timestamp('updatedAt').notNullable().defaultTo(db.fn.now())
          })
        }
      })
    )
    .then(() => db.raw(onUpdateTrigger.up('policies')))
};

module.exports.down = function (db) {
  return db.raw(onUpdateTrigger.down('policies'))
};

const { onUpdateTrigger } = require('../knexfile');

module.exports.up = function (db) {
  return db.schema.alterTable('customers', table => {
    table.timestamp('createdAt').notNullable().defaultTo(db.fn.now()).alter();
    table.timestamp('updatedAt').notNullable().defaultTo(db.fn.now()).alter()
  })
    .then(() => db.raw(onUpdateTrigger.up('customers')))
};

module.exports.down = function (db) {
  return db.schema.alterTable('customers', table => {
    table.timestamp('createdAt').nullable().defaultTo(null).alter();
    table.timestamp('updatedAt').nullable().defaultTo(null).alter()
  })
    .then(() => db.raw(onUpdateTrigger.down('customers')))
};

const {onUpdateTrigger} = require('../knexfile');

exports.up = (knex, Promise) => {
  return knex.schema.createTable('internal_events', (table) => {
    table.increments('id').primary().unsigned();
    table.string('policyId');
    table.string('type');
    table.text('error');
    table.json('details');
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').notNullable().defaultTo(knex.fn.now())
  })
    .then(() => knex.raw(onUpdateTrigger.up('internal_events')))
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('internal_events')
};

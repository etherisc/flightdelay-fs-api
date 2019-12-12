module.exports.up = function (db) {
  return db.schema.createTable('events', t => {
    t.increments('id').primary().unsigned();
    t.string('contractAddress', 256).notNullable();
    t.string('contractName', 256).notNullable();
    t.integer('blockNumber').notNullable();
    t.string('transactionHash', 256).notNullable();
    t.string('event', 256).notNullable();
    t.text('eventArgs')
  })
};

module.exports.down = function (db) {
  return db.schema.dropTable('events')
};

module.exports.up = function (db) {
  return db.schema.createTable('customers', t => {
    t.string('customerId', 256).notNullable().primary();
    t.string('firstName', 100).notNullable();
    t.string('lastName', 100).notNullable();
    t.string('email', 100).notNullable();
    t.string('phone', 100).notNullable();
    t.string('ethereumAccount', 256);
    t.timestamps()
  })
};

module.exports.down = function (db) {
  return db.schema.dropTable('customers')
};

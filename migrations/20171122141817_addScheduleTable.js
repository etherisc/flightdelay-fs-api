module.exports.up = function (db) {
  return db.schema.createTable('schedule', t => {
    t.increments();
    t.string('carrierFsCode', 100).notNullable();
    t.string('flightNumber', 100).notNullable();
    t.string('departureAirport', 100).notNullable();
    t.dateTime('departureTime').notNullable();
    t.string('departureTimeOffset', 100).notNullable();
    t.string('departureAirportCountry', 100).notNullable();
    t.string('departureAirportCity', 100).notNullable();
    t.string('departureAirportName', 100).notNullable();
    t.string('arrivalAirport', 100).notNullable();
    t.dateTime('arrivalTime').notNullable();
    t.string('arrivalTimeOffset', 100).notNullable();
    t.string('arrivalAirportCountry', 100).notNullable();
    t.string('arrivalAirportCity', 100).notNullable();
    t.string('arrivalAirportName', 100).notNullable();
    t.text('codeshares')
  })
};

module.exports.down = function (db) {
  return db.schema.dropTable('schedule')
};

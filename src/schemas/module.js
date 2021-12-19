const flightStatsSchemas = require('./flightStatsSchemas')
const flightDelaySchemas = require('./flightDelaySchemas')

module.exports = {

  ...flightStatsSchemas,
  ...flightDelaySchemas,

}

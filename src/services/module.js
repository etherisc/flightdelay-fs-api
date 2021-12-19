const VersionService = require('./versionService')
const FlightStatsService = require('./flightStatsService')
const FlightDelayService = require('./flightDelayService')

module.exports = ({ config, ioDeps }) => {
  const versionService = new VersionService({ config, ...ioDeps })
  const flightStatsService = new FlightStatsService({ config, ...ioDeps })
  const flightDelayService = new FlightDelayService({ config, ...ioDeps })

  return {
    versionService,
    flightStatsService,
    flightDelayService,
  }
}

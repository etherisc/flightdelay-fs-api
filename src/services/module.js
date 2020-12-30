const VersionService = require('./versionService')
const FlightStatsService = require('./flightStatsService')

module.exports = ({ config, ioDeps }) => {

  const versionService = new VersionService({ config, ...ioDeps })
  const flightStatsService = new FlightStatsService({ config, ...ioDeps })

  return {
    versionService,
    flightStatsService
  }

}

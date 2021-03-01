
const JSON = true

module.exports = ({ routerCommand, schemas, flightStatsService }) => {

  routerCommand.get('/schedule/:carrier/:flightNumber/:year/:month/:day', schemas.getStatusSchema, flightStatsService, 'getSchedule')
  routerCommand.get('/status/:carrier/:flightNumber/:year/:month/:day', schemas.getStatusSchema, flightStatsService, 'getStatus')
  routerCommand.get('/ratings/:carrier/:flightNumber', schemas.getRatingsSchema, flightStatsService, 'getRatings')
  routerCommand.get('/quote/:premium/:carrier/:flightNumber', schemas.getQuoteSchema, flightStatsService, 'getQuote')

  routerCommand.get('/status-oracle', schemas.getStatusSchema, flightStatsService, 'getStatusOracle', JSON)
  routerCommand.get('/ratings-oracle', schemas.getRatingsSchema, flightStatsService, 'getRatingsOracle', JSON)
}

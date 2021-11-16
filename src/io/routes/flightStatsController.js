module.exports = ({ routerCommand, schemas, flightStatsService }) => {
  routerCommand.get('/schedule/:carrier/:flightNumber/:year/:month/:day', schemas.getStatusSchema, flightStatsService, 'getSchedule')
  routerCommand.get('/status/:carrier/:flightNumber/:year/:month/:day', schemas.getStatusSchema, flightStatsService, 'getStatus')
  routerCommand.get('/ratings/:carrier/:flightNumber', schemas.getRatingsSchema, flightStatsService, 'getRatings')
  routerCommand.get('/quote/:premium/:carrier/:flightNumber', schemas.getQuoteSchema, flightStatsService, 'getQuote')

  // preprocessed results for oracles
  routerCommand.get('/status-oracle/:carrier/:flightNumber/:year/:month/:day', schemas.getStatusSchema, flightStatsService, 'getStatusOracle')
  routerCommand.get('/ratings-oracle/:carrier/:flightNumber', schemas.getRatingsSchema, flightStatsService, 'getRatingsOracle')
}

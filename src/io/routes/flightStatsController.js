
module.exports = ({ routerCommand, schemas, flightStatsService }) => {

  routerCommand.get('/status', schemas.getStatusSchema, flightStatsService, 'getStatus')
  routerCommand.get('/ratings', schemas.getRatingsSchema, flightStatsService, 'getRatings')

}

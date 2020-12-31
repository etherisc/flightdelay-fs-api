
module.exports = ({ routerCommand, schemas, flightStatsService }) => {

  routerCommand.get('/schedule', schemas.getStatusSchema, flightStatsService, 'getSchedule')
  routerCommand.get('/status', schemas.getStatusSchema, flightStatsService, 'getStatus')
  routerCommand.get('/ratings', schemas.getRatingsSchema, flightStatsService, 'getRatings')

}

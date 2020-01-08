
module.exports = ({ routerCommand, schemas, monitoringDataService }) => {

  routerCommand.post('/monitoring_data', schemas.monitoringDataSchema, monitoringDataService, 'monitoringData')

}

const versionController = require('./versionController')
const flightStatsController = require('./flightStatsController')

module.exports = ({
  routerCommand, router, config, serviceDeps, schemas, ioDeps,
}) => {
  const controllerDeps = {
    routerCommand, router, config, schemas, ...serviceDeps, ...ioDeps,
  }

  versionController(controllerDeps)
  flightStatsController(controllerDeps)

  router.get(`${config.API_VERSION}/health-check`, async (ctx) => ctx.ok('OK'))
}

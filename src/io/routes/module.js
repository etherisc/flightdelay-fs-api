const policyController = require('./policyController')
const versionController = require('./versionController')
const authController = require('./authController')

module.exports = ({ routerCommand, router, config, serviceDeps, schemas, ioDeps, modelDeps }) => {

  const controllerDeps = { routerCommand, router, config, schemas, ...serviceDeps, ...ioDeps, ...modelDeps }

  versionController(controllerDeps)
  policyController(controllerDeps)
  authController(controllerDeps)

  router.get(config.API_VERSION + '/health-check', async (ctx) => ctx.ok('OK'))
}

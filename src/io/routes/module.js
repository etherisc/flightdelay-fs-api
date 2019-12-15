const policyController = require('./policyController');
const versionController = require('./versionController');

module.exports = ({ routerCommand, router, config, serviceDeps, ioDeps, modelDeps }) => {

  const controllerDeps = { routerCommand, router, config, ...serviceDeps, ...ioDeps, ...modelDeps };

  versionController(controllerDeps);
  policyController(controllerDeps);

  router.get(config.API_VERSION + '/health-check', async (ctx) => ctx.ok('OK'))
};

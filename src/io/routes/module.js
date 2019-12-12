const customerController = require('./customerController');
const policyController = require('./policyController');
const versionController = require('./versionController');

module.exports = ({ router, config, serviceDeps, ioDeps, modelDeps }) => {
  const controllerDeps = { router, config, ...serviceDeps, ...ioDeps, ...modelDeps };

  versionController(controllerDeps);
  policyController(controllerDeps);
  customerController(controllerDeps);

  router.get('/api/health-check', async (ctx) => ctx.ok('OK'))
};

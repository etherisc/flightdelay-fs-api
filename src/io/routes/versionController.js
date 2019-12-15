
module.exports = ({ router, config, versionService }) => {

  router.get(config.API_VERSION + '/version', async (ctx) => {
    const appVersion = await versionService.retrieveVersion();

    ctx.ok(appVersion)
  })

};

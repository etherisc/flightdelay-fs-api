module.exports = class RouterCommand {
  /**
   * Generic Router Command.
   * Takes config, router, ajv schema validator as input.
   *
   * @param config  Config Object, contains API_VERSION
   * @param router  koa router
   * @param ajv     minimal json schema validator
   */
  constructor({config, router, ajv}) {
    this.config = config;
    this.router = router;
    this.ajv = ajv;
  }

  command(method, path, schema, command) {

    /**
     * Workflow:
     * 1. Validate data against schema
     * 2. Handle validation errors
     * 3. try to execute command
     * 4. Handle command errors
     */
    this.router[method](this.config.API_VERSION + path, async (ctx) => {
      const data = ctx.request.body;
      const validate = this.ajv.compile(schema);

      if (!validate(data)) {
        ctx.badRequest({error: validate.errors});
        return
      }

      try {
        ctx.ok(await command(data))
      } catch (error) {
        ctx.badRequest(error)
      }
    });

  }

  post(path, schema, command) {
    this.command('post', path, schema, command);
  }

  get(path, schema, command) {
    this.command('get', path, schema, command)
  }

};


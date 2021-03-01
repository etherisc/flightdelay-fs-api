module.exports = class RouterCommand {
  /**
   * Generic Router Command.
   * Takes config, router, ajv schema validator as input.
   *
   * @param config  Config Object, contains API_VERSION
   * @param router  koa router
   * @param authenticator
   * @param ajv     minimal json schema validator
   */
  constructor ({config, router, authenticator, ajv}) {
    this.config = config
    this.router = router
    this.ajv = ajv
  }

  /**
   * Handle a generic api method call.
   * @param method
   * @param path
   * @param schema
   * @param service
   * @param command
   * @param json
   */
  command (method, path, schema, service, command, json = false) {

    /**
     * Workflow:
     * 1. Validate data against schema
     * 2. Handle validation errors
     * 3. try to execute command
     * 4. Handle command errors
     */
    this.router[method](this.config.API_VERSION + path, async (ctx) => {
      const data = json ? ctx.request.body : ctx.params
      const validate = this.ajv.compile(schema)

      if (!validate(data)) {
        ctx.badRequest({error: validate.errors})
        return
      }

      try {
        await service[command](ctx, data)
      } catch (error) {
        console.error(error)
        ctx.badRequest(error)
      }
    })

  }

  post (...args) {
    this.command('post', ...args)
  }

  get (...args) {
    this.command('get', ...args)
  }

}

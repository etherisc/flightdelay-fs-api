const koaLogger = require('koa-logger')

function logger (transport) {

  const koaLog = koaLogger(transport)

  return async function logger (ctx, next) {
    koaLog(ctx, next)
    console.log(ctx)

    await next()
  }
}

module.exports = logger

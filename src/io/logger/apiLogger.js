const koaLogger = require('koa-logger')

function logger (transport) {

  const koaLog = koaLogger(transport)

  return async function logger (ctx, next) {
    transport(`Method: ${ctx.request.method}; URL: ${ctx.request.url}`)
    koaLog(ctx, next)

    //  await next()
  }
}

module.exports = koaLogger

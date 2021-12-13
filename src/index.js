/**
 * Implement a REST API Server based on koa router.
 * @type {Application|*}
 */

const Koa = require('koa')
const Router = require('koa-router')
const BodyParser = require('koa-bodyparser')
const Cors = require('kcors')
const Respond = require('koa-respond')
const dotenv = require('dotenv')
const logger = require('koa-logger')
const ratelimit = require('koa-ratelimit')
const ioModule = require('./io/module')
const servicesModule = require('./services/module')
const routesModule = require('./io/routes/module')
const RouterCommand = require('./io/routes/routerCommand')
const schemas = require('./schemas/module')
// eslint-disable-next-line no-console
const log = console

const db = new Map()

async function unhandledExceptionHandler(ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = 500

    if (process.env.NODE_ENV !== 'production') {
      ctx.body = ctx.body || { error: err.toString() }
    }

    ctx.app.emit('error', err, ctx)
  }
}

function listen(app, port) {
  return new Promise((resolve, reject) => {
    app.listen(port, (err) => err ? reject(err) : resolve(port))
  })
}

async function runServer() {
  const config = {
    ...dotenv.load().parsed,
    API_VERSION: '/api/v1',
    NO_BOT: process.env.NO_BOT,
  }
  const ioDeps = ioModule({ config })
  const serviceDeps = servicesModule({ config, ioDeps })

  const router = new Router()
  const routerCommand = new RouterCommand({ router, config, ...ioDeps })
  routesModule({
    routerCommand, router, config, schemas, ioDeps, serviceDeps,
  })

  const app = new Koa()

  app
    .use(logger(ioDeps.telegramBot.telegramTransport))
    .use(new Cors())
    .use(ratelimit({
      driver: 'memory',
      db,
      duration: 60000,
      errorMessage: 'Sometimes You Just Have to Slow Down.',
      id: (ctx) => ctx.ip,
      headers: {
        remaining: 'Rate-Limit-Remaining',
        reset: 'Rate-Limit-Reset',
        total: 'Rate-Limit-Total',
      },
      max: 50,
      disableHeader: false,
      whitelist: (ctx) => {
      // some logic that returns a boolean
      },
      blacklist: (ctx) => {
      // some logic that returns a boolean
      },
    }))
    .use(new BodyParser())
    .use(new Respond())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(unhandledExceptionHandler)

  app.on('error', (err) => {
    if (process.env.NODE_ENV !== 'production') {
      log.error('Server Error', err)
    }
  })

  listen(app, config.PORT).then((port) => log.log(`Listening to ${port}`))
}

runServer()

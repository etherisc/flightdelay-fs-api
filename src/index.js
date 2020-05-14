/**
 * Implement a REST API Server based on koa router.
 * @type {Application|*}
 */

const Koa = require('koa')
const JWT = require('koa-jwt')
const Router = require('koa-router')
const BodyParser = require('koa-bodyparser')
const Cors = require('kcors')
const Respond = require('koa-respond')
const logger = require('koa-logger')
// const Knex = require('knex');
const dotenv = require('dotenv')
// const dbConfig = require('../knexfile');
const ioModule = require('./io/module')
const servicesModule = require('./services/module')
const routesModule = require('./io/routes/module')
const RouterCommand = require('./io/routes/routerCommand')
const schemas = require('./schemas/module')
const TelegramLogger = require('./io/telegram/telegramLogger')
const GIF = require('@etherisc/gifcli')

const noAuth = [/\/auth/, /\/health-check/, /\/version/]

async function runServer () {

  const gif = await GIF.connect()

  const config = Object.assign(
    {},
    dotenv.load().parsed,
    {API_VERSION: '/api/v1'},
    {gif})

  const ioDeps = ioModule({ config }) //, knex: Knex(dbConfig) });
  const serviceDeps = servicesModule({ config, ioDeps })

  const router = new Router()
  const routerCommand = new RouterCommand({router, config, ...ioDeps})
  routesModule({ routerCommand, router, config, schemas, ioDeps, serviceDeps })

  const app = new Koa()

  if (!process.env.NO_BOT) {
    const TL = new TelegramLogger()
    app.use(logger(TL.telegramTransport))
  }

  app
    .use(new Cors())
    .use(new BodyParser())
    .use(new Respond())
    .use(unhandledExceptionHandler)
    .use(JWT({ secret: config.JWT_SECRET }).unless({path: noAuth}))
    .use(router.routes())
    .use(router.allowedMethods())

  app.on('error', err => console.error('Server Error', err))

  listen(app, config.PORT).then(port => console.log(`Listening to ${port}`))
}

async function unhandledExceptionHandler (ctx, next) {
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

function listen (app, port) {
  return new Promise(function (resolve, reject) {
    app.listen(port, (err) =>
      err ? reject(err) : resolve(port)
    )
  })
}

runServer()

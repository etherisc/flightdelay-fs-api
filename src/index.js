const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-bodyparser');
const Cors = require('kcors');
const Respond = require('koa-respond');
const Logger = require('koa-logger');
const Knex = require('knex');
const log = require('bristol');
const palin = require('palin');
const dotenv = require('dotenv');
const dbConfig = require('../knexfile');
const ioModule = require('./io/module');
const servicesModule = require('./services/module');
const routesModule = require('./io/routes/module');

function runServer () {
  const config = dotenv.load().parsed;
  log.addTarget('console').withFormatter(palin);

  const ioDeps = ioModule({ config, knex: Knex(dbConfig) });
  const serviceDeps = servicesModule({ config, ioDeps, modelDeps });

  const router = new Router();
  routesModule({ router, config, ioDeps, modelDeps, serviceDeps });

  const app = new Koa();

  app
    .use(new Logger())
    .use(new Cors())
    .use(new BodyParser())
    .use(new Respond())
    .use(unhandledExceptionHandler)
    .use(router.routes())
    .use(router.allowedMethods());

  app.on('error', err => log.error('Server Error', err));

  listen(app, config.PORT).then(port => console.log(`Listening to ${port}`))
}

async function unhandledExceptionHandler (ctx, next) {
  try {
    await next()
  } catch (err) {
    ctx.status = 500;

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

runServer();

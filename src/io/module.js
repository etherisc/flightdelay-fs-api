// const ethModule = require('./eth/module');
const Ajv = require('ajv');
const EventEmitter = require('events');

module.exports = ({ config /* , knex */  }) => {

  const ajv = new Ajv();
  const messageBus = new EventEmitter();

  const systemDeps = {
    ajv, messageBus
  };

  return Object.assign({} /*, ethModule({ config, db: knex })*/, systemDeps)
};

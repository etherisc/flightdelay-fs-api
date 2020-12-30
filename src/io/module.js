const Ajv = require('ajv')
const EventEmitter = require('events')
const TelegramLogger = require('./telegram/telegramLogger')

module.exports = ({ config }) => {

  const ajv = new Ajv()
  const messageBus = new EventEmitter()
  const telegramBot = new TelegramLogger({ config })

  const ioDeps = {
    ajv,
    messageBus,
    telegramBot
  }

  return Object.assign({}, ioDeps)
}

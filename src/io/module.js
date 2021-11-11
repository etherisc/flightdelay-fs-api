const Ajv = require('ajv')
const TelegramLogger = require('./telegram/telegramLogger')

module.exports = ({ config }) => {
  const ajv = new Ajv()
  const telegramBot = new TelegramLogger({ config })

  const ioDeps = {
    ajv,
    telegramBot,
  }

  return { ...ioDeps }
}

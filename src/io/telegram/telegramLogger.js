const TB = require('node-telegram-bot-api')

/**
 * Wrapper for Telegram Bot.
 */
module.exports = class TelegramLogger {

  constructor ({ config }) {

    this.bot = new TB(config.BOT_TOKEN, { polling: true })

    this.send = async (message) => {
      if (message && this.chatId) {
        await this.bot.sendMessage(this.chatId, message)
      }
    }

    this.bot.on('message',
      async req => {
        this.chatId = req.chat.id
        this.send('Activated')
      })

    this.telegramTransport = (str, args) => {
      this.send((args.length < 4 ? '<-- ' : '--> ') + args.slice(1).join(' '))
    }

  }

}

const TB = require('node-telegram-bot-api')

/**
 * Wrapper for Telegram Bot.
 */
module.exports = class TelegramLogger {

  constructor ({ config }) {
    this.config = config
    if (!config.NO_BOT) {
      this.bot = new TB(config.BOT_TOKEN, { polling: true })
      this.bot.on('message',
        async req => {
          this.chatId = req.chat.id
          this.send('Activated')
        })
    }

    this.send = async (message) => {
      if (this.config.NO_BOT) { // fallback to console
        console.log(message)
      } else if (message && this.chatId) {
        await this.bot.sendMessage(this.chatId, message)
      }
    }

    this.telegramTransport = (str, args) => {
      this.send((args.length < 4 ? '<-- ' : '--> ') + args.slice(1).join(' '))
    }

  }

}

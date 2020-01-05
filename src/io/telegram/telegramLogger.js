const TB = require('node-telegram-bot-api')
const token = '1013319375:AAFkhhwe84QrFYbfLZjy21g5IXxnuLOC6YE'

/**
 * Wrapper for Telegram Bot.
 * @type {TelegramBot}
 */
module.exports = class TelegramLogger {

  constructor () {

    this.bot = new TB(token, { polling: true })

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

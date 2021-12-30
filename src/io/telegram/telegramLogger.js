const TB = require('tgfancy')

/**
 * Wrapper for Telegram Bot.
 */
module.exports = class TelegramLogger {
  constructor({ config }) {
    this.config = config
    if (!config.NO_BOT) {
      this.bot = new TB(config.BOT_TOKEN, {
        polling: true,
        orderedSending: true,
      })
      this.bot.on(
        'message',
        async (req) => {
          this.chatId = req.chat.id
          this.send('Activated')
        },
      )
    }

    this.send = async (message) => {
      if (this.config.NO_BOT) { // fallback to console
        // eslint-disable-next-line no-console
        console.log(message)
      } else if (message && this.chatId) {
        try {
          await this.bot.sendMessage(this.chatId, message)
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error sending telegram message: message=${message}, error=${error.message} ${error.stack}`)
        }
      }
    }

    this.telegramTransport = (str, args) => {
      if (str.includes('health')) return
      if (args) {
        this.send((args.length < 4 ? '<-- ' : '--> ') + args.slice(1).join(' '))
      } else {
        this.send(str)
      }
    }
  }
}

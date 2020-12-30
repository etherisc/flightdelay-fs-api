const fetch = require('node-fetch')

module.exports = class FlightStatsService {

  /**
   * Constructor.
   *
   * @param config Config Object, contains API_VERSION
   * @param telegramBot TelegramBot Object
   */

  constructor ({ config, telegramBot }) {
    this.config = config
    this.tg = telegramBot
    this.appId = config.APP_ID
    this.appKey = config.APP_KEY

    this.flightStatsBaseURL = 'https://api.flightstats.com'
    this.flightStatusEndpoint = '/flex/schedules/rest/v1/json/flight'
    this.flightRatingsEndpoint = '/flex/ratings/rest/v1/json/flight'

  }

  async getStatus (ctx, data) {
    const { carrier, flightNumber, departure } = data
    this.tg.send(`Get Status: ${JSON.stringify(data)}`)
    const apiURL = `${this.flightStatsBaseURL}${this.flightStatusEndpoint}/${carrier}/${flightNumber}/departing/${departure}?appId=${this.appId}&appKey=${this.appKey}`
    const response = await fetch(apiURL)
    const json = await response.json()
    this.tg.send(`Get Status: \n ${apiURL} \n${JSON.stringify(json)}`)

    if (json.error) {
      ctx.badRequest(json.error)
    } else {
      ctx.ok(json)
    }
  }

  async getRatings (ctx, data) {
    const { carrier, flightNumber } = data
    this.tg.send(`Get Status: ${JSON.stringify(data)}`)
    const apiURL = `${this.flightStatsBaseURL}${this.flightRatingsEndpoint}/${carrier}/${flightNumber}?appId=${this.appId}&appKey=${this.appKey}`
    const response = await fetch(apiURL)
    const json = await response.json()
    if (json.error) {
      ctx.badRequest(json.error)
    } else {
      ctx.ok(json)
    }

  }

}

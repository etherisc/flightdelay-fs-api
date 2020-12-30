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

  async getFlightStats (ctx, endpoint) {
    const response = await fetch(endpoint)
    const json = await response.json()

    if (json.error) {
      this.tg.send(`Error: ${JSON.stringify(json.error)}`)
      ctx.badRequest(json.error)
    } else {
      this.tg.send(`Success: ${JSON.stringify(json)}`)
      ctx.ok(json)
    }
  }

  async getStatus (ctx, data) {
    this.tg.send(`Get Status: ${JSON.stringify(data)}`)
    const { carrier, flightNumber, departure } = data
    const endpoint = `${this.flightStatsBaseURL}${this.flightStatusEndpoint}/${carrier}/${flightNumber}/departing/${departure}?appId=${this.appId}&appKey=${this.appKey}`
    await this.getFlightStats(ctx, endpoint)
  }

  async getRatings (ctx, data) {
    this.tg.send(`Get Ratings: ${JSON.stringify(data)}`)
    const { carrier, flightNumber } = data
    const endpoint = `${this.flightStatsBaseURL}${this.flightRatingsEndpoint}/${carrier}/${flightNumber}?appId=${this.appId}&appKey=${this.appKey}`
    await this.getFlightStats(ctx, endpoint)
  }

}

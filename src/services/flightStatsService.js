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
    this.gif = config.gif

    this.flightStatsBaseURL = 'https://api.flightstats.com'
    this.flightScheduleEndpoint = '/flex/schedules/rest/v1/json/flight'
    this.flightStatusEndpoint = '/flex/flightstatus/rest/v2/json/flight/status'
    this.flightRatingsEndpoint = '/flex/ratings/rest/v1/json/flight'

  }

  async fetchEndpoint (endpoint) {
    const response = await fetch(endpoint)
    return response.json()
  }

  async getFlightStats (ctx, endpoint) {
    const json = await this.fetchEndpoint(endpoint)
    if (json.error) {
      await this.tg.send(`Error: ${JSON.stringify(json.error)}`)
      ctx.badRequest(json.error)
    } else {
      // this.tg.send(`Success: ${JSON.stringify(json)}`)
      await this.tg.send(`Success`)
      ctx.ok(json)
    }
  }

  getScheduleEndpoint (data) {
    const { carrier, flightNumber, year, month, day } = data
    return `\
${this.flightStatsBaseURL}${this.flightScheduleEndpoint}/\
${carrier}/${flightNumber}/\
departing/${year}/${month}/${day}\
?appId=${this.appId}&appKey=${this.appKey}\
`
  }

  getStatusEndpoint (data) {
    const { carrier, flightNumber, year, month, day } = data
    return `\
${this.flightStatsBaseURL}${this.flightStatusEndpoint}/\
${carrier}/${flightNumber}\
/dep/${year}/${month}/${day}\
?appId=${this.appId}&appKey=${this.appKey}\
`
  }

  getRatingsEndpoint (data) {
    const { carrier, flightNumber } = data
    return `\
${this.flightStatsBaseURL}${this.flightRatingsEndpoint}\
/${carrier}/${flightNumber}\
?appId=${this.appId}&appKey=${this.appKey}\
`
  }

  async getSchedule (ctx, data) {
    await this.tg.send(`Get Schedule: ${JSON.stringify(data)}`)
    await this.getFlightStats(ctx, this.getScheduleEndpoint(data))
  }

  async getStatus (ctx, data) {
    await this.tg.send(`Get Status: ${JSON.stringify(data)}`)
    await this.getFlightStats(ctx, this.getStatusEndpoint(data))
  }

  async getRatings (ctx, data) {
    await this.tg.send(`Get Ratings: ${JSON.stringify(data)}`)
    await this.getFlightStats(ctx, this.getRatingsEndpoint(data))
  }

  async getQuote (ctx, data) { // data = { premium, carrier, flightNumber }
    await this.tg.send(`Get Quote: ${JSON.stringify(data)}`)
    const { ratings } = await this.fetchEndpoint(this.getRatingsEndpoint(data))
    const rating = (({observations, ontime, late15, late30, late45, cancelled, diverted}) =>
      ({observations, ontime, late15, late30, late45, cancelled, diverted}))(ratings[0])
    const { premium } = data
    const product = 'FlightDelaySokol'
    const contractName = 'FlightDelayEtheriscOracle'
    const methodName = 'calculatePayouts'
    const parameters = [
      parseInt(premium, 10),
      [
        rating.observations,
        rating.late15,
        rating.late30,
        rating.late45,
        rating.cancelled,
        rating.diverted
      ]
    ]

    const { _weight, _payoutOptions } = (await this.gif.contract.call({product, contractName, methodName, parameters})).data
    const quote = {
      weight: _weight,
      payoutOptions: _payoutOptions
    }
    await this.tg.send(` Ratings: ${JSON.stringify(rating)} \n Quote: ${JSON.stringify(quote)}`)
    ctx.ok({ rating, quote })
  }

}

const fetch = require('node-fetch')
const ethers = require('ethers')

const abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_premium',
        type: 'uint256',
      },
      {
        internalType: 'uint256[6]',
        name: '_statistics',
        type: 'uint256[6]',
      },
    ],
    name: 'calculatePayouts',
    outputs: [
      {
        internalType: 'uint256',
        name: '_weight',
        type: 'uint256',
      },
      {
        internalType: 'uint256[5]',
        name: '_payoutOptions',
        type: 'uint256[5]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true,
  },
]

module.exports = class FlightStatsService {
  /**
   * Constructor.
   *
   * @param {{APP_ID, APP_KEY, HTTP_PROVIDER, FLIGHTDELAY_ADDRESS}} config Config Object, contains API_VERSION
   * @param telegramBot TelegramBot Object
   */

  constructor({ config, telegramBot }) {
    this.config = config
    this.tg = telegramBot
    this.appId = config.APP_ID
    this.appKey = config.APP_KEY
    this.httpProvider = config.HTTP_PROVIDER
    this.flightDelayContractAddress = config.FLIGHTDELAY_ADDRESS

    this.flightStatsBaseURL = 'https://api.flightstats.com'
    this.flightScheduleEndpoint = '/flex/schedules/rest/v1/json/flight'
    this.flightStatusEndpoint = '/flex/flightstatus/rest/v2/json/flight/status'
    this.flightRatingsEndpoint = '/flex/ratings/rest/v1/json/flight'
    this.flightDelayContract = new ethers.Contract(this.flightDelayContractAddress, abi, this.httpProvider)
  }

  async fetchEndpoint(endpoint) {
    const response = await fetch(endpoint)
    return response.json()
  }

  async getFlightStats(ctx, endpoint) {
    const json = await this.fetchEndpoint(endpoint)
    if (json.error) {
      await this.tg.send(`Error: ${JSON.stringify(json.error)}`)
      ctx.badRequest(json.error)
    } else {
      // this.tg.send(`Success: ${JSON.stringify(json)}`)
      await this.tg.send('Success')
      ctx.ok(json)
    }
  }

  async getFlightStatsOracle(ctx, endpoint) {
    const json = await this.fetchEndpoint(endpoint)
    if (json.error) {
      await this.tg.send(`Error: ${JSON.stringify(json.error)}`)
      ctx.badRequest(json.error)
    } else {
      ctx.ok(json)
    }
  }

  getScheduleEndpoint(data) {
    const {
      carrier, flightNumber, year, month, day,
    } = data
    return `\
${this.flightStatsBaseURL}${this.flightScheduleEndpoint}/\
${carrier}/${flightNumber}/\
departing/${year}/${month}/${day}\
?appId=${this.appId}&appKey=${this.appKey}\
`
  }

  getStatusEndpoint(data) {
    const {
      carrier, flightNumber, year, month, day,
    } = data
    return `\
${this.flightStatsBaseURL}${this.flightStatusEndpoint}/\
${carrier}/${flightNumber}\
/dep/${year}/${month}/${day}\
?appId=${this.appId}&appKey=${this.appKey}\
`
  }

  getRatingsEndpoint(data) {
    const { carrier, flightNumber } = data
    return `\
${this.flightStatsBaseURL}${this.flightRatingsEndpoint}\
/${carrier}/${flightNumber}\
?appId=${this.appId}&appKey=${this.appKey}\
`
  }

  async getSchedule(ctx, data) {
    await this.tg.send(`Get Schedule: ${JSON.stringify(data)}`)
    await this.getFlightStats(ctx, this.getScheduleEndpoint(data))
  }

  async getStatus(ctx, data) {
    await this.tg.send(`Get Status: ${JSON.stringify(data)}`)
    await this.getFlightStats(ctx, this.getStatusEndpoint(data))
  }

  async getRatings(ctx, data) {
    await this.tg.send(`Get Ratings: ${JSON.stringify(data)}`)
    await this.getFlightStats(ctx, this.getRatingsEndpoint(data))
  }

  async getStatusOracle(ctx, data) {
    await this.tg.send(`Get Status Oracle: ${JSON.stringify(data)}`)
    const json = await this.getFlightStatsOracle(ctx, this.getStatusEndpoint(data))
    if (!('flightStatuses' in json) || json.flightStatuses.length < 1) {
      const msg = 'Error: result has no flightStatuses'
      await this.tg.send(msg)
      ctx.badRequest(msg)
    }
    const flightStatuses = json.flightStatuses[0]
    if (
      'status' in flightStatuses
      && 'operationalTimes' in flightStatuses
    ) {
      const { status } = flightStatuses
      if (status === 'L') {
        const arrived = 'actualGateArrival' in flightStatuses.operationalTimes
        if (arrived) {
          const delay = 'delays' in flightStatuses && 'arrivalGateDelayMinutes' in flightStatuses.delays
            ? flightStatuses.delays.arrivalGateDelayMinutes
            : 0
          ctx.ok({ status, delay })
        } else { // landed, but no actualGateArrival, so probably taxiing or doors not open
          ctx.ok({ status: 'A', delay: -1 })
        }
      } else {
        ctx.ok({ status, delay: -1 })
      }
    } else {
      const msg = 'Error: result has no status'
      await this.tg.send(msg)
      ctx.badRequest(msg)
    }
  }

  async getRatingsOracle(ctx, data) {
    await this.tg.send(`Get Ratings Oracle: ${JSON.stringify(data)}`)
    const json = await this.getFlightStatsOracle(ctx, this.getRatingsEndpoint(data))
    const ratings = json.ratings[0]
    const result = ['observations', 'late15', 'late30', 'late45', 'cancelled', 'diverted']
      .reduce((res, item) => {
        res.push(ratings[item])
        return res
      }, [])
      .join(',')
    await this.tg.send(`Result: ${result}`)
    ctx.response.body = result
    ctx.response.status = 200
  }

  async getQuote(ctx, data) { // data = { premium, carrier, flightNumber }
    await this.tg.send(`Get Quote: ${JSON.stringify(data)}`)
    const { ratings } = await this.fetchEndpoint(this.getRatingsEndpoint(data))
    if (ratings && ratings[0] && ratings[0].observations) {
      const rating = (({
        observations, ontime, late15, late30, late45, cancelled, diverted,
      }) => ({
        observations, ontime, late15, late30, late45, cancelled, diverted,
      }))(ratings[0])
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
          rating.diverted,
        ],
      ]

      const { _weight, _payoutOptions } = (await this.gif.contract.call({
        product,
        contractName,
        methodName,
        parameters,
      })).data
      const quote = {
        weight: _weight,
        payoutOptions: _payoutOptions,
      }
      await this.tg.send(` Ratings: ${JSON.stringify(rating)} \n Quote: ${JSON.stringify(quote)}`)
      ctx.ok({ rating, quote })
    } else {
      await this.tg.send(` Flight not available for ${data.carrier} ${data.flightNumber}`)
      ctx.status = 404
      ctx.body = 'Flight data not available'
    }
  }
}

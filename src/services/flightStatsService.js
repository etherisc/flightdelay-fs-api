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
    this.provider = new ethers.providers.JsonRpcProvider({ url: this.httpProvider })

    this.flightStatsBaseURL = 'https://api.flightstats.com'
    this.flightScheduleEndpoint = '/flex/schedules/rest/v1/json/flight'
    this.flightStatusEndpoint = '/flex/flightstatus/rest/v2/json/flight/status'
    this.flightRatingsEndpoint = '/flex/ratings/rest/v1/json/flight'
    this.flightDelayContract = new ethers.Contract(this.flightDelayContractAddress, abi, this.provider)
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
      return {}
    }
    return json
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
    const statusHex = (str) => `0x${str.charCodeAt(0).toString(16)}`
    const revertResult = { status: statusHex('X'), arrived: false, delay: 0 } // this will lead to a revert in the smart contract
    let result
    try {
      const json = await this.getFlightStatsOracle(ctx, this.getStatusEndpoint(data))
      if (!('flightStatuses' in json) || json.flightStatuses.length < 1) {
        const msg = 'Error: result has no flightStatuses'
        await this.tg.send(msg)
        ctx.ok(revertResult)
      }
      const flightStatuses = json.flightStatuses[0]
      if (
        'status' in flightStatuses
        && 'operationalTimes' in flightStatuses
      ) {
        const { status: statusString } = flightStatuses
        const status = statusHex(statusString)
        if (status === statusHex('L')) {
          const arrived = 'actualGateArrival' in flightStatuses.operationalTimes
          if (arrived) {
            const delay = 'delays' in flightStatuses && 'arrivalGateDelayMinutes' in flightStatuses.delays
              ? flightStatuses.delays.arrivalGateDelayMinutes
              : 0
            result = { status, arrived, delay }
          } else { // landed, but no actualGateArrival, so probably taxiing or doors not open
            result = { status: statusHex('A'), arrived: false, delay: 0 }
          }
        } else {
          result = { status, arrived: false, delay: 0 }
        }
      }
      ctx.ok(result)
    } catch (error) {
      ctx.ok(revertResult)
    }
  }

  async getRatingsOracle(ctx, data) {
    await this.tg.send(`Get Ratings Oracle: ${JSON.stringify(data)}`)
    try {
      const json = await this.getFlightStatsOracle(ctx, this.getRatingsEndpoint(data))
      const ratings = json.ratings[0]
      const result = {
        observations: ratings.observations,
        late15: ratings.late15,
        late30: ratings.late30,
        late45: ratings.late45,
        cancelled: ratings.cancelled,
        diverted: ratings.diverted,
      }

      await this.tg.send(`Result: ${result}`)
      ctx.ok(result)
    } catch (error) {
      ctx.ok({
        observations: 0, late15: 0, late30: 0, late45: 0, cancelled: 0, diverted: 0,
      })
    }
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
      const { premium } = data // here premium is in USD Cents
      const premiumInWei = ethers.utils.parseEther((parseInt(premium, 10) / 100).toFixed(2).toString())
      const parameters = [
        premiumInWei,
        [
          rating.observations,
          rating.late15,
          rating.late30,
          rating.late45,
          rating.cancelled,
          rating.diverted,
        ],
      ]

      const result = await this.flightDelayContract.calculatePayouts(...parameters)
      const quote = {
        weight: result._weight.toNumber(),
        payoutOptions: result._payoutOptions.map((item) => ethers.utils.formatEther(item)),
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

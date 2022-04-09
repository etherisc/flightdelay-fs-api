const fetch = require('node-fetch')
const ethers = require('ethers')
const fs = require('fs-jetpack')
const abi = require('../schemas/abi.json')
// const {spec} = require('mocha/lib/reporters')

const hours = 60 * 60 * 1000

module.exports = class FlightStatsService {
  /**
   * Constructor.
   *
   * @param {{APP_ID, APP_KEY, HTTP_PROVIDER, FLIGHTDELAY_ADDRESS}} config Config Object, contains API_VERSION
   * @param telegramBot TelegramBot Object
   */

  constructor ({config, telegramBot}) {
    this.config = config
    this.tg = telegramBot
    this.appId = config.APP_ID
    this.appKey = config.APP_KEY
    this.httpProvider = config.HTTP_PROVIDER
    this.flightDelayContractAddressDemo = config.FLIGHTDELAY_ADDRESS_DEMO
    this.flightDelayContractAddressProduction = config.FLIGHTDELAY_ADDRESS_PRODUCTION
    this.provider = new ethers.providers.JsonRpcProvider({url: this.httpProvider})

    this.flightStatsBaseURL = 'https://api.flightstats.com'
    this.flightScheduleEndpoint = '/flex/schedules/rest/v1/json/flight'
    this.flightStatusEndpoint = '/flex/flightstatus/rest/v2/json/flight/status'
    this.flightRatingsEndpoint = '/flex/ratings/rest/v1/json/flight'
    this.flightDelayContractDemo = new ethers.Contract(
      this.flightDelayContractAddressDemo,
      abi,
      this.provider,
    )
    this.flightDelayContractProduction = new ethers.Contract(
      this.flightDelayContractAddressProduction,
      abi,
      this.provider,
    )
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
      await this.tg.send('Success')
      ctx.ok(json)
    }
  }

  async getFlightStatsOracle (ctx, endpoint) {
    const json = await this.fetchEndpoint(endpoint)
    if (json.error) {
      await this.tg.send(`Error: ${JSON.stringify(json.error)}`)
      return {}
    }
    return json
  }

  getScheduleEndpoint (data) {
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

  getStatusEndpoint (data) {
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

  getStatusOracleEndpoint (data) {
    const {carrierFlightNumber, yearMonthDay} = data
    return `\
${this.flightStatsBaseURL}${this.flightStatusEndpoint}/\
${carrierFlightNumber}\
/dep/${yearMonthDay}\
?appId=${this.appId}&appKey=${this.appKey}\
`
  }

  getRatingsEndpoint (data) {
    const {carrier, flightNumber} = data
    return `\
${this.flightStatsBaseURL}${this.flightRatingsEndpoint}\
/${carrier}/${flightNumber}\
?appId=${this.appId}&appKey=${this.appKey}\
`
  }

  getRatingsOracleEndpoint (data) {
    const {carrierFlightNumber} = data
    return `\
${this.flightStatsBaseURL}${this.flightRatingsEndpoint}\
/${carrierFlightNumber}\
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

  async getStatusOracle (ctx, data) {
    await this.tg.send(`Get Status Oracle: ${JSON.stringify(data)}`)
    const statusHex = (str) => `0x${str.charCodeAt(0).toString(16)}`
    const revertResult = {status: statusHex('X'), arrived: false, delay: 0} // this will lead to a revert in the smart contract
    let result

    const checkSpecialFlights = async (data) => {
      try {
        const specialFlights = fs.read('./src/data/specialFlights.json', 'json')
        const specialResult = specialFlights.filter(item => JSON.stringify(item.key) === JSON.stringify(data))
        if (specialResult.length === 0) {
          const msg = 'Error: result has no flightStatuses'
          await this.tg.send(msg)
          ctx.ok(revertResult)
        } else {
          const msg = 'Special Flight Result delivered'
          await this.tg.send(msg)
          ctx.ok(specialResult[0].value)
        }
      } catch (error) {
        console.log(error.message, error.stack)
      }
    }

    try {
      const json = await this.getFlightStatsOracle(ctx, this.getStatusOracleEndpoint(data))
      if (!('flightStatuses' in json) || json.flightStatuses.length < 1) {
        await checkSpecialFlights(data)
        return
      }
      const flightStatuses = json.flightStatuses[0]
      if (
        'status' in flightStatuses
        && 'operationalTimes' in flightStatuses
      ) {
        const {status: statusString} = flightStatuses
        const status = statusHex(statusString)
        if (status === statusHex('L')) {
          let arrived = 'actualGateArrival' in flightStatuses.operationalTimes
          if (!arrived && 'actualRunwayArrival' in flightStatuses.operationalTimes) {
            // After 6 hours, we assume that flight has arrived at gate even if there is no "actualGateArrival"
            arrived = new Date() - new Date(flightStatuses.operationalTimes.actualRunwayArrival.dateUtc) > 6 * hours
          }
          if (!arrived && 'scheduledGateArrival') {
            // After 24 hours, we assume that flight has arrived at gate even if there is no operational times
            arrived = new Date() - new Date(flightStatuses.operationalTimes.scheduledGateArrival.dateUtc) > 24 * hours
          }
          if (arrived) {
            const delay = 'delays' in flightStatuses && 'arrivalGateDelayMinutes' in flightStatuses.delays
              ? flightStatuses.delays.arrivalGateDelayMinutes
              : 0
            result = {status, arrived, delay}
          } else {
            // landed, but no actualGateArrival or actualRunwayArrival, so probably taxiing or doors not open
            result = {status: statusHex('A'), arrived: false, delay: 0}
          }
        } else {
          result = {status, arrived: false, delay: 0}
        }
      }
      await this.tg.send(`Result: ${JSON.stringify(result)}`)
      ctx.ok(result)
    } catch (error) {
      console.log('ERROR!!!', error.message, error.stack)
      await checkSpecialFlights(data)
    }
  }

  async getRatingsOracle (ctx, data) {

    const isAllowed = (flight) => {
      const {airlineFsCode, departureAirportFsCode, arrivalAirportFsCode} = flight.ratings[0]
      console.log(airlineFsCode, departureAirportFsCode, arrivalAirportFsCode)
      const departureAirport = flight.appendix.airports.filter(item => item.fs === departureAirportFsCode)[0]
      const arrivalAirport = flight.appendix.airports.filter(item => item.fs === arrivalAirportFsCode)[0]
      const departureCountry = departureAirport.countryCode
      const arrivalCountry = arrivalAirport.countryCode
      const filterList = fs.read('./src/data/filterList.json', 'json')
      const isOk = (property, departure, arrival) => {
        const {order, list} = filterList[property]
        return (order === 'allow'
          ? list.includes(departure) && list.includes(arrival)
          : !(list.includes(departure) || list.includes(arrival)))
      }
      return (
        isOk('countries', departureCountry, arrivalCountry) &&
        isOk('airports', departureAirportFsCode, arrivalAirportFsCode) &&
        isOk('airlines', airlineFsCode, airlineFsCode)
      )
    }

    const noFlight = () => ctx.ok({
        observations: 0, late15: 0, late30: 0, late45: 0, cancelled: 0, diverted: 0,
      })

    await this.tg.send(`Get Ratings Oracle: ${JSON.stringify(data)}`)
    try {
      const json = await this.getFlightStatsOracle(ctx, this.getRatingsOracleEndpoint(data))
      if (isAllowed(json)) {
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
      } else {
        await this.tg.send(`Result: Country/Airport/Airline not allowed`)
        noFlight()
      }
    } catch (error) {
      await this.tg.send(`Result: Error, ${error.message}`)
      noFlight()
    }
  }

  async getQuote (ctx, data) { // data = { premium, carrier, flightNumber }
    await this.tg.send(`Get Quote: ${JSON.stringify(data)}`)
    const {ratings} = await this.fetchEndpoint(
      this.getRatingsEndpoint({carrier: data.carrier, flightNumber: data.flightNumber}),
    )
    if (ratings && ratings[0] && ratings[0].observations) {
      const rating = (({
        observations, ontime, late15, late30, late45, cancelled, diverted,
      }) => ({
        observations, ontime, late15, late30, late45, cancelled, diverted,
      }))(ratings[0])
      const {premium} = data // here premium is in USD Cents
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

      const result = premium === '150'
        ? await this.flightDelayContractDemo.calculatePayouts(...parameters)
        : await this.flightDelayContractProduction.calculatePayouts(...parameters)

      const quote = {
        weight: result._weight.toString(),
        payoutOptions: result._payoutOptions.map((item) => ethers.utils.formatUnits(item, 0)),
      }
      await this.tg.send(` Ratings: ${JSON.stringify(rating)} \n Quote: ${JSON.stringify(quote)}`)
      ctx.ok({rating, quote})
    } else {
      await this.tg.send(` Flight not available for ${data.carrier} ${data.flightNumber}`)
      ctx.status = 404
      ctx.body = 'Flight data not available'
    }
  }
}

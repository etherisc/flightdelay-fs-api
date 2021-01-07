require('dotenv').config()
const FlightStatsService = require('../src/services/flightStatsService')

describe('getRatings', () => {

  let telegramBot = {
    send: (msg) => {
      console.log(msg)
    }
  }
  let FlightStats

  before(async () => {
    FlightStats = new FlightStatsService({ config: process.env, telegramBot })
  })

  beforeEach(async () => {
  })

  after(async () => {
  })

  it('should return flight ratings', async () => {
    const data = {
      carrier: 'LH',
      flightNumber: '117'
    }
    const ctx = {
      badRequest: (error) => {
        error.should.be.undefined()
      },
      ok: (res) => {
        console.log(res)
        res.should.have.property('ratings')
        const ratings = res.ratings[0]
        ratings
          .should.have.properties('observations', 'ontime', 'late15', 'late30', 'late45', 'cancelled', 'diverted')
      }
    }
    await FlightStats.getRatings(ctx, data)
  })

})

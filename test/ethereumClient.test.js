require('dotenv').config()

const EthereumClient = require('../src/utils/ethereumClient')
const log = {
  debug: console.log,
  info: console.log,
  warn: console.log,
  error: console.error
}

describe('EthereumClient', () => {

  let ethereumClient

  before(async () => {
    ethereumClient = new EthereumClient({ log })
  })

  beforeEach(async () => {
  })

  after(async () => {
    await ethereumClient.stopProvider()
  })

  it('should not fail', async () => {
    const content = {
      product: 'FlightDelaySokol',
      networkName: 'sokol',
      contractName: 'FlightDelayEtheriscOracle',
      methodName: 'calculatePayouts',
      parameters: [1500, [62, 2, 0, 0, 0, 0]]
    }
    const result = await ethereumClient.callRequest({ content })
    log.info(result)
    result.should.be.deepEqual({ _weight: '1612', _payoutOptions: '0,0,150000,150000,150000' })
  })

})

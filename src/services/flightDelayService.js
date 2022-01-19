const ethers = require('ethers')
const Gif = require('@etherisc/gif-connect')

const abi = require('../schemas/abi.json')

module.exports = class FlightDelayService {
  /**
   * Constructor.
   *
   * @param {{APP_ID, APP_KEY, HTTP_PROVIDER, FLIGHTDELAY_ADDRESS}} config Config Object, contains API_VERSION
   * @param telegramBot TelegramBot Object
   */

  constructor({ config, telegramBot }) {
    this.config = config
    this.httpProvider = config.HTTP_PROVIDER
    this.flightDelayContractAddress = config.FLIGHTDELAY_ADDRESS
    this.provider = new ethers.providers.JsonRpcProvider({ url: this.httpProvider })
    this.flightDelayContract = new ethers.Contract(this.flightDelayContractAddressDemo, abi, this.provider)
    this.gif = new Gif.Instance(config.HTTP_PROVIDER, config.GIF_REGISTRY_ADDRESS)
  }

  async getApplicationData(bpKey) {
    const policy = await this.gif.getContract('Policy')
    const {
      data: appData, // , state, createdAt, updatedAt,
    } = await policy.getApplication(bpKey)
    const decoded = ethers.utils.defaultAbiCoder.decode(['uint256', 'uint256[5]', 'address', 'bytes32'], appData)
    return {
      premium: ethers.utils.formatEther(decoded[0]),
      payouts: decoded[1].map((payout) => ethers.utils.formatEther(payout)),
      address: decoded[2],
      riskId: decoded[3],
    }
  }

  async getRiskData(riskId) {
    const risk = await this.flightDelayContract.risks(riskId)
    return {
      carrierFlightNumber: ethers.utils.parseBytes32String(risk.carrierFlightNumber),
      departureYearMonthDay: ethers.utils.parseBytes32String(risk.departureYearMonthDay),
      departureTime: new Date(risk.departureTime.toNumber() * 1000),
      arrivalTime: new Date(risk.arrivalTime.toNumber() * 1000),
      delayInMinutes: risk.delayInMinutes.toNumber(),
    }
  }

  async getPolicies(ctx, data) { // data = { address }
    const { address } = data
    const policyCount = (await this.flightDelayContract.addressToPolicyCount(address)).toNumber()
    const policies = []
    for (let policyIndex = 0; policyIndex < policyCount; policyIndex += 1) {
      const bpKey = await this.flightDelayContract.addressToBpKeys(address, policyIndex)
      const appData = await this.getApplicationData(bpKey)
      const riskData = await this.getRiskData(appData.riskId)
      policies.push({ ...appData, ...riskData })
    }
    ctx.ok({ policyCount, policies })
  }

  async getClaims(ctx, data) { // data = { address }
    ctx.ok({ claims: [] })
  }
}

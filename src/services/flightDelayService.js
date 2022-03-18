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
    this.flightDelayContractAddressDemo = config.FLIGHTDELAY_ADDRESS_DEMO
    this.flightDelayContractAddressProduction = config.FLIGHTDELAY_ADDRESS_PRODUCTION
    this.provider = new ethers.providers.JsonRpcProvider({ url: this.httpProvider })
    this.flightDelayContractDemo = new ethers.Contract(this.flightDelayContractAddressDemo, abi, this.provider)
    this.flightDelayContractProduction = new ethers.Contract(
      this.flightDelayContractAddressProduction,
      abi,
      this.provider,
    )
    this.gif = new Gif.Instance(config.HTTP_PROVIDER, config.GIF_REGISTRY_ADDRESS)
  }

  async getApplicationData(bpKey) {
    const policy = await this.gif.getContract('Policy')
    const {
      data: appData, // , state, createdAt, updatedAt,
    } = await policy.getApplication(bpKey)
    // const metaData = await policy.metadata(bpKey)
    const decoded = ethers.utils.defaultAbiCoder.decode(['uint256', 'uint256[5]', 'address', 'bytes32'], appData)
    return {
      /*
      productId: metaData.productId.toNumber(),
      claimsCount: metaData.claimsCount.toNumber(),
      payoutsCount: metaData.payoutsCount.toNumber(),
      hasPolicy: metaData.hasPolicy,
      hasApplication: metaData.hasApplication,
      state: metaData.state,
       */
      premium: ethers.utils.formatEther(decoded[0]),
      payouts: decoded[1].map((payout) => ethers.utils.formatEther(payout)),
      address: decoded[2],
      riskId: decoded[3],
    }
  }

  async getRiskData(riskId, fdContract) {
    const risk = await fdContract.risks(riskId)
    return {
      carrierFlightNumber: ethers.utils.parseBytes32String(risk.carrierFlightNumber),
      departureYearMonthDay: ethers.utils.parseBytes32String(risk.departureYearMonthDay),
      departureTime: new Date(risk.departureTime.toNumber() * 1000),
      arrivalTime: new Date(risk.arrivalTime.toNumber() * 1000),
      delayInMinutes: risk.delayInMinutes.toNumber(),
    }
  }

  async getPolicies(ctx, data) { // data = { address }
    const { address, environment } = data
    const fdContract = environment && environment === 'production'
      ? this.flightDelayContractProduction
      : this.flightDelayContractDemo
    const policyCount = (await fdContract.addressToPolicyCount(address)).toNumber()
    const policies = []
    for (let policyIndex = 0; policyIndex < policyCount; policyIndex += 1) {
      const bpKey = await fdContract.addressToBpKeys(address, policyIndex)
      const appData = await this.getApplicationData(bpKey)
      const riskData = await this.getRiskData(appData.riskId, fdContract)
      policies.push({ ...appData, ...riskData })
    }
    ctx.ok({ policyCount, policies })
  }

  async getAllPolicies(ctx, data) {
    try {
      const { environment } = data
      const fdContract = environment && environment === 'production'
        ? this.flightDelayContractProduction
        : this.flightDelayContractDemo
      const policy = await this.gif.getContract('Policy')
      const bpKeyCount = (await policy.getBpKeyCount()).toNumber()
      const policies = []
      for (let bpKeyIndex = 0; bpKeyIndex < bpKeyCount; bpKeyIndex += 1) {
        console.log(bpKeyIndex)
        const bpKey = await policy.bpKeys(bpKeyIndex)
        const metaData = await policy.metadata(bpKey)
        const appData = await this.getApplicationData(bpKey)
        const riskData = await this.getRiskData(appData.riskId, fdContract )
        const allData = {...metaData, ...appData, ...riskData}
        policies.push(allData)
        console.log(allData)
      }
      ctx.ok({ bpKeyCount, policies })
    } catch (error) {
      console.log(error.message, error.stack)
    }
  }

  async getClaims(ctx, data) { // data = { address }
    ctx.ok({ claims: [] })
  }
}

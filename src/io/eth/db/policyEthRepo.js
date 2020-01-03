
class PolicyEthRepo {
  constructor (contractResolver) {
    this.contractResolver = contractResolver
    this.web3 = contractResolver.web3
  }

  async findPolicyById (id) {
    const policyRaw = await this.contractResolver.db.instance.methods.policies(id).call()

    return {
      id: id,
      contractAddress: this.contractResolver.newPolicy.address,
      customer: policyRaw[0],
      premium: policyRaw[1].toString(),
      riskId: policyRaw[2],
      weight: policyRaw[3].toString(),
      calculatedPayout: policyRaw[4].toString(),
      actualPayout: policyRaw[5].toString(),
      state: policyRaw[6].toString(),
      stateTime: policyRaw[7].toString(),
      stateMessage: policyRaw[8],
      proof: policyRaw[9],
      currency: currencyByCode(policyRaw[10]),
      customerExternalId: this.web3.utils.hexToUtf8(policyRaw[11])
    }
  }
}

const currencyByCode = code => {
  switch (code) {
    case '0':
      return 'eth'

    case '1':
      return 'eur'

    case '2':
      return 'usd'

    case '3':
      return 'gbp'

    default:
      throw new Error('Currency is not supported')
  }
}

module.exports = PolicyEthRepo

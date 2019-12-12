
class PolicyService {
  constructor ({ payoutCalcService, policyRepo, customerRepo }) {
  }

  async getPolicy (id) {
  }

  async findAllByCustomerId (customerId) {
    const policies = await this.policyRepo.findAllByCustomerId(customerId);

    return policies.map(policy => ({ ...policy, amount: this.formatAmount(policy) }))
  }

}

module.exports = PolicyService;

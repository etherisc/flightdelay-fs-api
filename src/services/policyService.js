
module.exports = class PolicyService {
  constructor ({ policyRepo }) {

    this.policyRepo = policyRepo

  }

  /**
   * Apply for a policy.
   *
   * @param applyCommand JSON describing the application. Contains client data, contract data, parcel data.
   */
  applyForPolicy (applyCommand) {

    return ({applicationId: 5})

  }

  /**
   * Underwrite a policy.
   *
   * @param underwriteCommand JSON describing the underwrite Command. Contains application ID
   */
  underwritePolicy (underwriteCommand) {

    return ({policyId: 5})

  }

  createClaim (createClaimCommand) {

    return ({claimId: 5})

  }

  confirmClaim (confirmClaimCommand) {

    return ({payoutId: 5})

  }

}

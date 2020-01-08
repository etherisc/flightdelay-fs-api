
module.exports = class PolicyService {
  constructor ({ policyRepo }) {

    this.policyRepo = policyRepo // TODO: is this still needed?

  }

  /**
   * Apply for a policy.
   *
   * @param ctx
   * @param applyCommand JSON describing the application. Contains client data, contract data, parcel data.
   *
   */
  applyForPolicy (ctx, applyCommand) {

    ctx.ok({applicationId: 5})

  }

  /**
   * Underwrite a policy.
   *
   * @param ctx
   * @param underwriteCommand JSON describing the underwrite Command. Contains application ID
   */
  underwritePolicy (ctx, underwriteCommand) {

    ctx.ok({policyId: 5})

  }

  /**
   *
   * @param ctx
   * @param createClaimCommand
   */
  createClaim (ctx, createClaimCommand) {

    ctx.ok({claimId: 5})

  }

  /**
   *
   * @param ctx
   * @param confirmClaimCommand
   */
  confirmClaim (ctx, confirmClaimCommand) {

    ctx.ok({payoutId: 5})

  }

}

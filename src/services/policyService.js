
module.exports = class PolicyService {
  constructor ({ config, policyRepo }) {

    this.policyRepo = policyRepo // TODO: is this still needed?
    this.gif = config.gif
    this.log = console.log

    this.normalizeParcel = this._normalizeParcel.bind(this)
    this.normalizeRisk = this._normalizeRisk.bind(this)

  }

  typeId (peril) {
    const perils = ['hailstorms', 'fire', 'drought', 'flood']

    const ti = perils.findIndex((element) => element === peril.toLowerCase())
    if (ti < 0) throw new Error('Peril "' + peril + '" not allowed')
    return ti
  }

  _normalizeRisk (riskData) {
    return [
      this.typeId(riskData.type),
      riskData.threshold1 * 100,
      riskData.amount1 * 100,
      riskData.threshold2 * 100,
      riskData.amount2 * 100,
      riskData.parcel_id
    ]
  }

  _normalizeParcel (parcelData) {
    return [
      parcelData.id,
      parcelData.crop_type.name,
      new Date(parcelData.sowing_date).getTime() / 1000,
      new Date(parcelData.harvesting_date).getTime() / 1000,
      parcelData.area * 1000,
      parcelData.county.id,
      parcelData.risks.map(this.normalizeRisk)
    ]
  }

  normalize (data) {

    return [
      data.contract_id,
      data.client.id,
      new Date(data.contract_start).getTime() / 1000,
      new Date(data.contract_end).getTime() / 1000,
      data.contract_duration,
      data.insured_area * 1000,
      data.insured_value * 100,
      data.parcels.map(this.normalizeParcel)
    ]

  }

  /**
   * Apply for a policy.
   *
   * @param ctx
   * @param data
   *
   */
  async applyForPolicy (ctx, data) {

    const customer = await this.gif.customer.create({
      firstname: data.client.firstname,
      lastname: data.client.lastname,
      email: data.client.contact_email
    })

    const bpKey = await this.gif.bp.create({customerId: customer.customerId})
    const nd = this.normalize(data)
    const tx = await this.gif.contract.send('BeaconProduct', 'applyForPolicy', ['0x' + bpKey.bpExternalKey, nd])

    if (tx.error) {
      ctx.throw(400, tx.error)
    } else {

      ctx.ok({
        applicationId: parseInt(tx.events.NewApplication.returnValues._applicationId),
        tx
      })
    }

  }

  /**
   * Underwrite a policy.
   *
   * @param ctx
   * @param data
   */
  async underwritePolicy (ctx, data) {

    const tx = await this.gif.contract.send('BeaconProduct', 'underwriteApplication', [data.applicationId])
    if (tx.error) {
      ctx.throw(400, tx.error)
    } else {
      const policyId = tx.events.NewPolicy.returnValues._policyId
      ctx.ok({policyId})
    }
  }

  /**
   *
   * @param ctx
   * @param createClaimCommand
   */
  async createClaim (ctx, createClaimCommand) {

    ctx.ok({claimId: 5})

  }

  /**
   *
   * @param ctx
   * @param confirmClaimCommand
   */
  async confirmClaim (ctx, confirmClaimCommand) {

    ctx.ok({payoutId: 5})

  }

}

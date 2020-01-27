
const { stringToPeril, SCALEFACTOR } = require('./constants')

module.exports = class PolicyService {
  constructor ({ config }) {

    this.gif = config.gif
    this.log = console.log

    this.normalizeParcels = this._normalizeParcels.bind(this)
    this.normalizeRisks = this._normalizeRisks.bind(this)

  }

  _normalizeRisks (parcelData) {
    return parcelData.risks.map(riskData => [
      stringToPeril(riskData.type),
      riskData.threshold1 * 100,
      riskData.amount1 * 100,
      riskData.threshold2 * 100,
      riskData.amount2 * 100
    ])
  }

  _normalizeParcels (parcelData) {
    return [
      parcelData.id,
      parcelData.crop_type.name,
      new Date(parcelData.sowing_date).getTime() / 1000,
      new Date(parcelData.harvesting_date).getTime() / 1000,
      parcelData.area * 1000,
      parcelData.county.id,
      parcelData.risks.length
    ]
  }

  normalize (bpKey, data) {

    return [
      bpKey,
      [
        data.contract_id,
        data.client.id,
        new Date(data.contract_start).getTime() / 1000,
        new Date(data.contract_end).getTime() / 1000,
        data.contract_duration,
        data.insured_value * SCALEFACTOR,
        data.insured_area * SCALEFACTOR,
        data.parcels.length
      ],
      data.parcels.map(this.normalizeParcels),
      data.parcels.map(this.normalizeRisks)
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

    const bpKey = await this.gif.bp.create({customerId: customer.customerId, data})
    const normData = this.normalize(bpKey.bpExternalKey, data)
    const tx = await this.gif.contract.send('BeaconProduct', 'applyForPolicy', normData)

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
      ctx.ok({
        policyId,
        tx
      })
    }
  }

  async getPolicyById (ctx, data) {
    try {

      const policyData = await this.gif.policy.getById(data.policyId)
      const bpData = await this.gif.bp.getById(policyData.metadataId)
      const bpKey = bpData.key
      let beaconContractData = await this.gif.contract.call('BeaconProduct', 'beaconContracts', [bpKey])

      beaconContractData.parcels = []
      for (let index = 0; index < beaconContractData.parcelCount; index++) {
        let parcelId = await this.gif.contract.call('BeaconProduct', 'beaconParcelsIds', [bpKey, index])
        parcelId = parseInt(parcelId[''])
        let parcel = await this.gif.contract.call('BeaconProduct', 'beaconParcels', [bpKey, parcelId])
        parcel.risks = []
        const riskCount = parseInt(parcel.riskCount)
        for (let index2 = 0; index2 < riskCount; index2++) {
          parcel.risks.push(await this.gif.contract.call('BeaconProduct', 'beaconRisks', [bpKey, parcelId, index2]))
        }
        beaconContractData.parcels.push(parcel)
      }

      ctx.ok({
        policyData,
        bpData,
        beaconContractData
      })
    } catch (e) {
      ctx.throw(400, e.message)
    }

  }

  async declineApplication (ctx, data) {

    try {
      const tx = await this.gif.contract.send('BeaconProduct', 'declineApplication', [data.applicationId])
      if (tx.error) {
        ctx.throw(400, tx.error)
      } else {
        ctx.ok({
          applicationId: data.applicationId,
          tx
        })
      }
    } catch (e) {
      ctx.throw(400, e.message)
    }

  }

  async expirePolicy (ctx, data) {

    try {
      const tx = await this.gif.contract.send('BeaconProduct', 'expire', [data.policyId])
      if (tx.error) {
        ctx.throw(400, tx.error)
      } else {
        ctx.ok({
          policyId: data.policyId,
          tx
        })
      }
    } catch (e) {
      ctx.throw(400, e.message)
    }

  }

}


const { stringToPeril, perilToString, SCALEFACTOR } = require('./constants')

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
      riskData.threshold1 * SCALEFACTOR,
      riskData.amount1 * SCALEFACTOR,
      riskData.threshold2 * SCALEFACTOR,
      riskData.amount2 * SCALEFACTOR
    ])
  }

  _normalizeParcels (parcelData) {
    return [
      parcelData.id,
      parcelData.crop_type.name,
      new Date(parcelData.sowing_date).getTime() / 1000,
      new Date(parcelData.harvesting_date).getTime() / 1000,
      parcelData.area * SCALEFACTOR,
      parcelData.county.id,
      parcelData.insured_value * SCALEFACTOR,
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

    let bpKey
    let normData
    try {
      bpKey = await this.gif.bp.create({customerId: customer.customerId, data})
      normData = this.normalize(bpKey.bpExternalKey, data)
    } catch (e) {
      ctx.throw(400, e.message)
    }
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
      if (policyData.error) {
        ctx.throw(400, policyData.error)
        return
      }

      const bpData = await this.gif.bp.getById(policyData.metadataId)
      const bpKey = bpData.key
      let beaconContractData = await this.gif.contract.call('BeaconProduct', 'beaconContracts', [bpKey])

      beaconContractData.parcels = []
      for (let index = 0; index < beaconContractData.parcelCount; index++) {
        let parcelId = await this.gif.contract.call('BeaconProduct', 'beaconParcelsIds', [bpKey, index])
        parcelId = parseInt(parcelId[''])
        let parcel = await this.gif.contract.call('BeaconProduct', 'beaconParcels', [bpKey, parcelId])
        parcel.risks = []
        for (let index2 = 0; index2 < 4; index2++) {
          const risk = await this.gif.contract.call('BeaconProduct', 'beaconRisks', [bpKey, parcelId, index2])
          if (risk.threshold1 > 0 || risk.threshold2 > 0) {
            parcel.risks.push(risk)
          }
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

  async debugPolicy (ctx, data) {
    try {

      const method = data.method
      const args = data.args

      const tx = await this.gif.contract.call('BeaconProduct', method, args)

      ctx.ok({tx})

    } catch (e) {
      ctx.throw(400, e.message)
    }

  }

  async getClaims (ctx, data) {
    try {

      let claims = []
      let res = await this.gif.contract.call('BeaconProduct', 'getClaimsCount', [data.policyId])
      const claimsCount = parseInt(res._claimsCount)

      for (let count = 0; count < claimsCount; count++) {
        res = await this.gif.contract.call('BeaconProduct', 'BeaconClaims', [data.policyId, count])
        const timestamp = parseInt(res.timestamp)
        const claimId = parseInt(res.claimId)
        let affectedParcels = []
        for (let pcount = 0; pcount < parseInt(res.affectedParcelsCount); pcount++) {
          let parcelData = await this.gif.contract.call('BeaconProduct', 'getAffectedParcels', [data.policyId, claimId, pcount])
          let bpKey = await this.gif.contract.call('BeaconProduct', 'policyIdToBpKey', [data.policyId])
          let monitoringData = []
          for (let typeIndex = 0; typeIndex < 4; typeIndex++) {
            monitoringData[perilToString(typeIndex)] =
              parseInt((await this.gif.contract.call(
                'BeaconProduct',
                'monitoringData',
                [timestamp, bpKey[''], parcelData._parcelId, typeIndex]
              ))['']) / SCALEFACTOR
          }
          affectedParcels.push({parcelId: parcelData._parcelId, ...monitoringData})
        }
        const claim = Object.assign({},
          await this.gif.claim.getById(claimId),
          {
            totalAmount: parseInt(res.totalAmount) / (SCALEFACTOR * SCALEFACTOR),
            payoutAmount: parseInt(res.payoutAmount),
            affectedParcels,
            affectedParcelsCount: parseInt(res.affectedParcelsCount),
            timestamp: parseInt(res.timestamp)
          }
        )

        delete claim.contractKey
        delete claim.stateMessage
        delete claim.data

        claims.push(claim)
      }

      ctx.ok({claims})

    } catch (e) {
      ctx.throw(400, e.message)
    }

  }

  async confirmClaim (ctx, data) {
    try {

      const tx = await this.gif.contract.send('BeaconProduct', 'confirmClaim', [data.claimId, data.amount])
      if (tx.error) {
        ctx.throw(400, tx.error)
      } else {
        ctx.ok({
          claimId: data.claimId,
          tx
        })
      }

    } catch (e) {
      ctx.throw(400, e.message)
    }

  }

  async declineClaim (ctx, data) {
    try {

      const tx = await this.gif.contract.send('BeaconProduct', 'declineClaim', [data.claimId])
      if (tx.error) {
        ctx.throw(400, tx.error)
      } else {
        ctx.ok({
          claimId: data.claimId,
          tx
        })
      }

    } catch (e) {
      ctx.throw(400, e.message)
    }

  }

}

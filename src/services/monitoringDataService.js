
const { perilToString, SCALEFACTOR } = require('./constants')

module.exports = class MonitoringDataService {

  constructor ({config}) {
    this.getMonitoringValue = this.getMonitoringValue.bind(this)
    this.normalizeParcelData = this.normalizeParcelData.bind(this)
    this.gif = config.gif
  }

  /**
   *
   * @param {object} data
   * @param {integer} index
   * @returns {*}
   */
  getMonitoringValue (data, index) {
    const value = data.monitoring_data[perilToString(index)]
    if (value) return (value * SCALEFACTOR).toFixed()
    return 0
  }

  /**
   *
   * @param data
   * @returns {number}
   */
  convertOrigin (data) {
    if (!data.origin || data.origin === 'system') return 0
    return 1
  }

  /**
   *
   * @param ctx
   * @param data
   * @returns {number}
   */
  convertMonitoringDate (ctx, data) {
    if (data.origin && data.origin === 'user' && !data.monitoring_date) {
      ctx.throw(404, 'monitoring_date must be given if origin == user')
    }
    if (!data.monitoring_date || data.origin === 'system') return 0
    return data.monitoring_date
  }

  /**
   *
   * @param {object} data
   * @returns {*[]}
   */
  normalizeParcelData (data) {

    return [
      data.id,
      [...Array(4).keys()].map(index => this.getMonitoringValue(data, index))
    ]

  }

  /**
   *
   * @param ctx
   * @param {object} data
   * @returns {*[]}
   */
  normalize (ctx, data) {

    return [
      data.contract_id,
      this.convertOrigin(data),
      this.convertMonitoringDate(ctx, data),
      data.parcels.map(this.normalizeParcelData)
    ]

  }

  /**
   *
   * @param ctx
   * @param data
   */
  async monitoringData (ctx, data) {

    const tx = await this.gif.contract.send('BeaconProduct', 'putMonitoringData', this.normalize(ctx, data))

    if (tx.error) {
      ctx.throw(400, tx.error)
    } else {
      ctx.ok({tx})
    }

  }

}


const { perilToString, SCALEFACTOR } = require('./constants')
const util = require('util')

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
   * @param {object} data
   * @returns {*[]}
   */
  normalize (data) {

    return [
      data.contract_id,
      data.parcels.map(this.normalizeParcelData)
    ]

  }

  /**
   *
   * @param ctx
   * @param data
   */
  async monitoringData (ctx, data) {

    console.log(util.inspect(this.normalize(data), false, null, true))

    const tx = await this.gif.contract.send('BeaconProduct', 'putMonitoringData', this.normalize(data))

    if (tx.error) {
      ctx.throw(400, tx.error)
    } else {
      ctx.ok({tx})
    }

  }

}

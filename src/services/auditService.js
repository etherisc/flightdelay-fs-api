
module.exports = class AuditService {

  constructor ({config}) {
    this.gif = config.gif
  }

  /**
   *
   * @param ctx
   * @param data
   * @returns {Promise<void>}
   */
  async getAuditTrail (ctx, data) {
    ctx.ok({auditTrail: 't.b.d'})
  }

}

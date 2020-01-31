
module.exports = ({ routerCommand, schemas, auditService }) => {

  routerCommand.get('/audit', schemas.auditSchema, auditService, 'getAuditTrail')

}

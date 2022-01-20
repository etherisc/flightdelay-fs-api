module.exports = ({ routerCommand, schemas, flightDelayService }) => {
  routerCommand.get('/policies/:address/:environment', schemas.getPoliciesSchema, flightDelayService, 'getPolicies')
  routerCommand.get('/policies/:address', schemas.getPoliciesSchema, flightDelayService, 'getPolicies')
  routerCommand.get('/claims/:address', schemas.getClaimsSchema, flightDelayService, 'getClaims')
}

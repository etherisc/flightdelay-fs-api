module.exports = ({ routerCommand, schemas, flightDelayService }) => {
  routerCommand.get('/policies/:address/:environment', schemas.getPoliciesSchema, flightDelayService, 'getPolicies')
  routerCommand.get('/policies/:address', schemas.getPoliciesSchema, flightDelayService, 'getPolicies')
  routerCommand.get('/all-policies/:environment', schemas.getAllPoliciesSchema, flightDelayService, 'getAllPolicies')
  routerCommand.get('/claims/:address', schemas.getClaimsSchema, flightDelayService, 'getClaims')
}

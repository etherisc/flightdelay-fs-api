
module.exports = ({ routerCommand, schemas, policyService }) => {

  // routerCommand.post('/policies/apply', schemas.applyForPolicySchema, policyService, 'applyForPolicy')
  routerCommand.post('/policies/contract', schemas.contractSchema, policyService, 'applyForPolicy')
  routerCommand.get('/policies/get_by_id', schemas.getPolicyByIdSchema, policyService, 'getPolicyById')
  routerCommand.get('/policies', schemas.getPolicyByIdSchema, policyService, 'getPolicyById')
  routerCommand.post('/policies/underwritePolicy', schemas.underwritePolicySchema, policyService, 'underwritePolicy')
  routerCommand.post('/policies/underwrite', schemas.underwritePolicySchema, policyService, 'underwritePolicy')
  routerCommand.post('/policies/decline', schemas.declineApplicationSchema, policyService, 'declineApplication')
  routerCommand.post('/policies/expire', schemas.expirePolicySchema, policyService, 'expirePolicy')
  routerCommand.post('/policies/create_claim', schemas.createClaimSchema, policyService, 'createClaim')
  routerCommand.post('/policies/confirm_claim', schemas.confirmClaimSchema, policyService, 'confirmClaim')
  routerCommand.get('/policies/debug', schemas.debugPolicySchema, policyService, 'debugPolicy')

}

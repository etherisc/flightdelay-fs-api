
module.exports = ({ routerCommand, schemas, policyService }) => {

  routerCommand.post('/policies/apply', schemas.applyForPolicySchema, policyService, 'applyForPolicy')
  routerCommand.post('/policies/underwritePolicy', schemas.underwritePolicySchema, policyService, 'underwritePolicy')
  routerCommand.post('/policies/create_claim', schemas.createClaimSchema, policyService, 'createClaim')
  routerCommand.post('/policies/confirm_claim', schemas.confirmClaimSchema, policyService, 'confirmClaim')

}

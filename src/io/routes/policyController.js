
module.exports = ({ routerCommand, /* router, */ config, policyService, ajv }) => {

  routerCommand.post('/policies/apply', applyForPolicySchema, policyService, 'applyForPolicy')
  routerCommand.post('/policies/underwritePolicy', underwritePolicySchema, policyService, 'underwritePolicy')
  routerCommand.post('/policies/create_claim', createClaimSchema, policyService, 'createClaim')
  routerCommand.post('/policies/confirm_claim', confirmClaimSchema, policyService, 'confirmClaim')

}

const applyForPolicySchema = {
  $id: '#applyForPolicy',
  properties: {
    client: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' }
      },
      required: ['firstName', 'lastName', 'email']
    },
    contract: {
      type: 'object'
    },
    parcels: {
      type: 'array',
      items: {
        type: 'object'
      }
    }
  },
  additionalProperties: false
}

const underwritePolicySchema = {
  $id: '#underwritePolicySchema',
  type: 'object',
  properties: {
    applicationId: {
      type: 'integer'
    } },
  required: ['applicationId'],
  additionalProperties: false
}

const createClaimSchema = {
  $id: '#createClaimSchema',
  type: 'object',
  properties: {
    policyId: {
      type: 'integer'
    } },
  required: ['policyId'],
  additionalProperties: false
}

const confirmClaimSchema = {
  $id: '#confirmClaimSchema',
  type: 'object',
  properties: {
    claimId: {
      type: 'integer'
    } },
  required: ['claimId'],
  additionalProperties: false
}

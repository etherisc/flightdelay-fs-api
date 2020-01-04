module.exports = {

  applyForPolicySchema: {
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
  },

  underwritePolicySchema: {
    $id: '#underwritePolicySchema',
    type: 'object',
    properties: {
      applicationId: {
        type: 'integer'
      } },
    required: ['applicationId'],
    additionalProperties: false
  },

  createClaimSchema: {
    $id: '#createClaimSchema',
    type: 'object',
    properties: {
      policyId: {
        type: 'integer'
      } },
    required: ['policyId'],
    additionalProperties: false
  },

  confirmClaimSchema: {
    $id: '#confirmClaimSchema',
    type: 'object',
    properties: {
      claimId: {
        type: 'integer'
      } },
    required: ['claimId'],
    additionalProperties: false
  }

}

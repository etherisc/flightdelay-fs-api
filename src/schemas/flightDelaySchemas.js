module.exports = {

  getPoliciesSchema: {
    $id: '#status',
    properties: {
      address: {
        type: 'string',
      },
      environment: {
        type: 'string',
      },
    },
    required: ['address'],
    additionalProperties: false,
  },

  getAllPoliciesSchema: {
    $id: '#all-policies',
    properties: {
      environment: {
        type: 'string',
      },
    },
    required: [],
    additionalProperties: false,
  },

  getClaimsSchema: {
    $id: '#claims',
    type: 'object',
    properties:
      {
        address: {
          type: 'string',
        },
        environment: {
          type: 'string',
        },
      },
    required: ['address'],
    additionalProperties: false,
  },
}

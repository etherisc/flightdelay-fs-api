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

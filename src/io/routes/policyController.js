
module.exports = ({ routerCommand, /* router,*/ config, policyService, ajv }) => {

  routerCommand.post('/policies/apply', applyForPolicySchema, policyService.applyForPolicy);
  routerCommand.post('/policies/underwritePolicy', underwritePolicySchema, policyService.underwritePolicy);

};

const applyForPolicySchema = {
  $id: "#applyForPolicy",
  properties: {
    client: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
      required: ['firstName', 'lastName', 'email'],
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
};

const underwritePolicySchema = {
  $id: '#underwritePolicySchema',
  type: 'object',
  properties: {
    applicationId: {
      type: 'integer'
    }  },
  required: ['applicationId'],
  additionalProperties: false
};

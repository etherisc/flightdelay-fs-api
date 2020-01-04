
const {applyForPolicySchema, underwritePolicySchema, createClaimSchema, confirmClaimSchema} = require('../schemas/policySchemas')
const {authSchema} = require('../schemas/authSchema')

module.exports = {
  applyForPolicySchema,
  underwritePolicySchema,
  createClaimSchema,
  confirmClaimSchema,
  authSchema
}

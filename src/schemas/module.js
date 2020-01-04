
const {contractSchema, applyForPolicySchema, underwritePolicySchema, createClaimSchema, confirmClaimSchema} = require('../schemas/policySchemas')
const {authSchema} = require('../schemas/authSchema')
const {monitoringSchema} = require('../schemas/monitoringSchema')

module.exports = {
  contractSchema,
  applyForPolicySchema,
  underwritePolicySchema,
  createClaimSchema,
  confirmClaimSchema,
  authSchema,
  monitoringSchema
}

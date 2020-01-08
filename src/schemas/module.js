
const {contractSchema, applyForPolicySchema, underwritePolicySchema, createClaimSchema, confirmClaimSchema} = require('../schemas/policySchemas')
const {authSchema} = require('../schemas/authSchema')
const {monitoringDataSchema} = require('./monitoringDataSchema')

module.exports = {
  contractSchema,
  applyForPolicySchema,
  underwritePolicySchema,
  createClaimSchema,
  confirmClaimSchema,
  authSchema,
  monitoringDataSchema
}

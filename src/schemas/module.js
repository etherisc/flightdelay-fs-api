
const policySchemas = require('../schemas/policySchemas')
const authSchemas = require('../schemas/authSchema')
const monitoringDataSchemas = require('./monitoringDataSchema')
const auditSchemas = require('./auditSchemas')

module.exports = {

  ...authSchemas,
  ...policySchemas,
  ...monitoringDataSchemas,
  ...auditSchemas

}

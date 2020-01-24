
const policySchemas = require('../schemas/policySchemas')
const authSchemas = require('../schemas/authSchema')
const monitoringDataSchemas = require('./monitoringDataSchema')

module.exports = {

  ...authSchemas,
  ...policySchemas,
  ...monitoringDataSchemas

}

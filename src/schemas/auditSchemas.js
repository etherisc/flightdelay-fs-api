module.exports = {

  auditSchema: {
    '$id': '#audit',
    'type': 'object',
    'required': ['contract_id'],
    'properties': {
      'contract_id': {
        '$id': '#/properties/contract_id',
        'type': 'integer'
      }
    },
    'additionalProperties': false
  }
}

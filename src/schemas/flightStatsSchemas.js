module.exports = {

  'getStatusSchema': {
    '$id': '#status',
    'properties': {
      'carrier': {
        'type': 'string'
      },
      'flightNumber': {
        'type': 'string'
      },
      'departure': {
        'type': 'string'
      }
    },
    'required': ['carrier', 'flightNumber', 'departure'],
    'additionalProperties': false
  },

  'getRatingsSchema': {
    '$id': '#ratings',
    'properties': {
      'carrier': {
        'type': 'string'
      },
      'flightNumber': {
        'type': 'string'
      }
    },
    'required': ['carrier', 'flightNumber'],
    'additionalProperties': false
  }

}

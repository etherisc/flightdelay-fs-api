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
      'year': {
        'type': 'string'
      },
      'month': {
        'type': 'string'
      },
      'day': {
        'type': 'string'
      }
    },
    'required': ['carrier', 'flightNumber', 'year', 'month', 'day'],
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
  },

  'getQuoteSchema': {
    '$id': '#quote',
    'properties': {
      'premium': {
        'type': 'integer'
      },
      'carrier': {
        'type': 'string'
      },
      'flightNumber': {
        'type': 'string'
      }
    },
    'required': ['premium', 'carrier', 'flightNumber'],
    'additionalProperties': false
  }

}

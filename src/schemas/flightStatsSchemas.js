module.exports = {

  getStatusOracleSchema: {
    $id: '#status',
    properties: {
      carrier: {
        type: 'string',
      },
      flightNumber: {
        type: 'string',
      },
      year: {
        type: 'number',
      },
      month: {
        type: 'number',
      },
      day: {
        type: 'number',
      },
    },
    required: ['carrier', 'flightNumber', 'year', 'month', 'day'],
    additionalProperties: false,
  },

  getRatingsOracleSchema: {
    $id: '#ratings',
    type: 'object',
    properties:
      {
        carrier: {
          type: 'string',
        },
        flightNumber: {
          type: 'string',
        },
      },
    required: ['carrier', 'flightNumber'],
    additionalProperties:
      false,
  },

  getStatusSchema: {
    $id: '#status',
    properties:
      {
        carrier: {
          type: 'string',
        },
        flightNumber: {
          type: 'string',
        },
        year: {
          type: 'string',
        },
        month: {
          type: 'string',
        },
        day: {
          type: 'string',
        }
        ,
      },
    required: ['carrier', 'flightNumber', 'year', 'month', 'day'],
    additionalProperties:
      false,
  },

  getRatingsSchema: {
    $id: '#ratings',
    properties:
      {
        carrier: {
          type: 'string',
        },
        flightNumber: {
          type: 'string',
        }
        ,
      },
    required: ['carrier', 'flightNumber'],
    additionalProperties:
      false,
  },

  getQuoteSchema: {
    $id: '#quote',
    properties:
      {
        premium: {
          type: 'string',
        },
        carrier: {
          type: 'string',
        },
        flightNumber: {
          type: 'string',
        }
        ,
      },
    required: ['premium', 'carrier', 'flightNumber'],
    additionalProperties:
      false,
  }
  ,

}

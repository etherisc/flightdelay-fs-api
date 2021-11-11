module.exports = {

  getStatusOracleSchema: {
    $id: '#status',
    properties: {
      id: {
        type: 'string',
      },
      data: {
        type: 'object',
        properties: {
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
          },
        },
        required: ['carrier', 'flightNumber', 'year', 'month', 'day'],
        additionalProperties: false,
      },
    },
    required: ['id', 'data'],
    additionalProperties: false,
  },

  getRatingsOracleSchema: {
    $id: '#ratings',
    properties: {
      id: {
        type: 'string',
      },
      data: {
        type: 'object',
        properties: {
          carrier: {
            type: 'string',
          },
          flightNumber: {
            type: 'string',
          },
          required: ['carrier', 'flightNumber'],
          additionalProperties: false,
        },
      },
    },
    required: ['id', 'data'],
    additionalProperties: false,
  },

  getStatusSchema: {
    $id: '#status',
    properties: {
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
      },
    },
    required: ['carrier', 'flightNumber', 'year', 'month', 'day'],
    additionalProperties: false,
  },

  getRatingsSchema: {
    $id: '#ratings',
    properties: {
      carrier: {
        type: 'string',
      },
      flightNumber: {
        type: 'string',
      },
    },
    required: ['carrier', 'flightNumber'],
    additionalProperties: false,
  },

  getQuoteSchema: {
    $id: '#quote',
    properties: {
      premium: {
        type: 'string',
      },
      carrier: {
        type: 'string',
      },
      flightNumber: {
        type: 'string',
      },
    },
    required: ['premium', 'carrier', 'flightNumber'],
    additionalProperties: false,
  },

}

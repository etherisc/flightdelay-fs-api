module.exports = {

  monitoringDataSchema: {
    '$id': '#data',
    'type': 'object',
    'required': [
      'contract_id',
      'insurer',
      'parcels'
    ],
    'properties': {
      'contract_id': {
        '$id': '#/properties/contract_id',
        'type': 'integer',
        'examples': [
          1
        ]
      },
      'insurer': {
        '$id': '#/properties/insurer',
        'type': 'object',
        'required': [
          'id'
        ],
        'properties': {
          'id': {
            '$id': '#/properties/insurer/properties/id',
            'type': 'integer',
            'examples': [
              1
            ]
          },
          'email': {
            '$id': '#/properties/insurer/properties/email',
            'type': 'string',
            'examples': [
              'jack@blackpearl'
            ],
            'pattern': '^(.*)$'
          },
          'firstname': {
            '$id': '#/properties/insurer/properties/firstname',
            'type': 'string',
            'examples': [
              'Jack'
            ],
            'pattern': '^(.*)$'
          },
          'lastname': {
            '$id': '#/properties/insurer/properties/lastname',
            'type': 'string',
            'examples': [
              'Sparrow'
            ],
            'pattern': '^(.*)$'
          },
          'blockchain_address': {
            '$id': '#/properties/insurer/properties/blockchain_address',
            'type': 'string',
            'examples': [
              '...'
            ],
            'pattern': '^(.*)$'
          }
        }
      },
      'parcels': {
        '$id': '#/properties/parcels',
        'type': 'array',
        'items': {
          '$id': '#/properties/parcels/items',
          'type': 'object',
          'required': [
            'id',
            'monitoring_data'
          ],
          'properties': {
            'id': {
              '$id': '#/properties/parcels/items/properties/id',
              'type': 'integer',
              'examples': [
                9
              ]
            },
            'monitoring_data': {
              '$id': '#/properties/parcels/items/properties/monitoring_data',
              'type': 'object',
              'additionalProperties': true,
              'required': [],
              'properties': {
                'hailstorms': {
                  '$id': '#/properties/parcels/items/properties/monitoring_data/properties/hailstorms',
                  'type': 'number',
                  'examples': [
                    0.19
                  ]
                },
                'drought': {
                  '$id': '#/properties/parcels/items/properties/monitoring_data/properties/drought',
                  'type': 'integer',
                  'examples': [
                    0
                  ]
                }
              }
            }
          }
        }
      }
    }
  }
}

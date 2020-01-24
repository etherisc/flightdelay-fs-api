module.exports = {

  contractSchema: {
    '$id': 'http://beacon-h2020.com/contractSchema.json',
    'type': 'object',
    'required': [
      'contract_id',
      'insurer',
      'client',
      'contract_number',
      'contract_start',
      'contract_end',
      'ended_at',
      'contract_duration',
      'insured_area',
      'insured_value',
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
          'id',
          'email',
          'firstname',
          'lastname',
          'blockchain_address'
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
            ]
          },
          'firstname': {
            '$id': '#/properties/insurer/properties/firstname',
            'type': 'string',
            'examples': [
              'Jack'
            ]
          },
          'lastname': {
            '$id': '#/properties/insurer/properties/lastname',
            'type': 'string',
            'examples': [
              'Sparrow'
            ]
          },
          'blockchain_address': {
            '$id': '#/properties/insurer/properties/blockchain_address',
            'type': 'string',
            'examples': [
              '...'
            ]
          }
        }
      },
      'client': {
        '$id': '#/properties/client',
        'type': 'object',
        'required': [
          'id',
          'firstname',
          'lastname',
          'contact_email'
        ],
        'properties': {
          'id': {
            '$id': '#/properties/client/properties/id',
            'type': 'integer',
            'examples': [
              1
            ]
          },
          'firstname': {
            '$id': '#/properties/client/properties/firstname',
            'type': 'string',
            'examples': [
              'Happy'
            ]
          },
          'lastname': {
            '$id': '#/properties/client/properties/lastname',
            'type': 'string',
            'examples': [
              'Farmer'
            ]
          },
          'contact_email': {
            '$id': '#/properties/client/properties/contact_email',
            'type': 'string',
            'examples': [
              'happyfarmer@beacon'
            ]
          }
        }
      },
      'contract_number': {
        '$id': '#/properties/contract_number',
        'type': 'string',
        'examples': [
          'CNT-100394'
        ]
      },
      'contract_start': {
        '$id': '#/properties/contract_start',
        'type': 'string',
        'examples': [
          '2019-11-01'
        ]
      },
      'contract_end': {
        '$id': '#/properties/contract_end',
        'type': 'string',
        'examples': [
          '2019-12-20'
        ]
      },
      'ended_at': {
        '$id': '#/properties/ended_at',
        'type': 'null',
        'examples': [
          null
        ]
      },
      'contract_duration': {
        '$id': '#/properties/contract_duration',
        'type': 'integer',
        'examples': [
          2
        ]
      },
      'insured_area': {
        '$id': '#/properties/insured_area',
        'type': 'number',
        'examples': [
          1.948
        ]
      },
      'insured_value': {
        '$id': '#/properties/insured_value',
        'type': 'integer',
        'examples': [
          5000
        ]
      },
      'parcels': {
        '$id': '#/properties/parcels',
        'type': 'array',
        'items': {
          '$id': '#/properties/parcels/items',
          'type': 'object',
          'required': [
            'id',
            'crop_type',
            'shape',
            'sowing_date',
            'harvesting_date',
            'area',
            'county',
            'insured_value',
            'risks'
          ],
          'properties': {
            'id': {
              '$id': '#/properties/parcels/items/properties/id',
              'type': 'integer',
              'examples': [
                9
              ]
            },
            'crop_type': {
              '$id': '#/properties/parcels/items/properties/crop_type',
              'type': 'object',
              'required': [
                'name',
                'caption'
              ],
              'properties': {
                'name': {
                  '$id': '#/properties/parcels/items/properties/crop_type/properties/name',
                  'type': 'string',
                  'examples': [
                    'sunflower'
                  ]
                },
                'caption': {
                  '$id': '#/properties/parcels/items/properties/crop_type/properties/caption',
                  'type': 'string',
                  'examples': [
                    'Sunflower'
                  ]
                }
              }
            },
            'shape': {
              '$id': '#/properties/parcels/items/properties/shape',
              'type': 'object',
              'required': [
                'type',
                'coordinates'
              ],
              'properties': {
                'type': {
                  '$id': '#/properties/parcels/items/properties/shape/properties/type',
                  'type': 'string',
                  'examples': [
                    'Polygon'
                  ]
                },
                'coordinates': {
                  '$id': '#/properties/parcels/items/properties/shape/properties/coordinates',
                  'type': 'array',
                  'items': {
                    '$id': '#/properties/parcels/items/properties/shape/properties/coordinates/items',
                    'type': 'array',
                    'items': {
                      '$id': '#/properties/parcels/items/properties/shape/properties/coordinates/items/items',
                      'type': 'array',
                      'items': {
                        '$id': '#/properties/parcels/items/properties/shape/properties/coordinates/items/items/items',
                        'type': 'number',
                        'examples': [
                          22.517067,
                          39.522403
                        ]
                      }
                    }
                  }
                }
              }
            },
            'sowing_date': {
              '$id': '#/properties/parcels/items/properties/sowing_date',
              'type': 'string',
              'examples': [
                '2019-09-01'
              ]
            },
            'harvesting_date': {
              '$id': '#/properties/parcels/items/properties/harvesting_date',
              'type': 'string',
              'examples': [
                '2020-02-01'
              ]
            },
            'area': {
              '$id': '#/properties/parcels/items/properties/area',
              'type': 'number',
              'examples': [
                1.948
              ]
            },
            'county': {
              '$id': '#/properties/parcels/items/properties/county',
              'type': 'object',
              'required': [
                'id',
                'name'
              ],
              'properties': {
                'id': {
                  '$id': '#/properties/parcels/items/properties/county/properties/id',
                  'type': 'integer',
                  'examples': [
                    4
                  ]
                },
                'name': {
                  '$id': '#/properties/parcels/items/properties/county/properties/name',
                  'type': 'string',
                  'examples': [
                    'Rigas Feraios Municipality'
                  ]
                }
              }
            },
            'insured_value': {
              '$id': '#/properties/parcels/items/properties/insured_value',
              'type': 'integer',
              'examples': [
                5000
              ]
            },
            'risks': {
              '$id': '#/properties/parcels/items/properties/risks',
              'type': 'array',
              'items': {
                '$id': '#/properties/parcels/items/properties/risks/items',
                'type': 'object',
                'required': [
                  'type',
                  'threshold1',
                  'amount1',
                  'threshold2',
                  'amount2',
                  'parcel_id'
                ],
                'properties': {
                  'type': {
                    '$id': '#/properties/parcels/items/properties/risks/items/properties/type',
                    'type': 'string',
                    'examples': [
                      'hailstorms'
                    ]
                  },
                  'threshold1': {
                    '$id': '#/properties/parcels/items/properties/risks/items/properties/threshold1',
                    'type': 'string',
                    'examples': [
                      '0.8'
                    ]
                  },
                  'amount1': {
                    '$id': '#/properties/parcels/items/properties/risks/items/properties/amount1',
                    'type': 'string',
                    'examples': [
                      '0.5'
                    ]
                  },
                  'threshold2': {
                    '$id': '#/properties/parcels/items/properties/risks/items/properties/threshold2',
                    'type': 'string',
                    'examples': [
                      '1.5'
                    ]
                  },
                  'amount2': {
                    '$id': '#/properties/parcels/items/properties/risks/items/properties/amount2',
                    'type': 'string',
                    'examples': [
                      '1'
                    ]
                  },
                  'parcel_id': {
                    '$id': '#/properties/parcels/items/properties/risks/items/properties/parcel_id',
                    'type': 'integer',
                    'examples': [
                      9
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  applyForPolicySchema: {
    '$id': '#applyForPolicy',
    'properties': {
      'client': {
        'type': 'object',
        'properties': {
          'firstName': { 'type': 'string' },
          'lastName': { 'type': 'string' },
          'email': { 'type': 'string', 'format': 'email' }
        },
        'required': ['firstName', 'lastName', 'email']
      },
      'contract': {
        'type': 'object'
      },
      'parcels': {
        'type': 'array',
        'items': {
          'type': 'object'
        }
      }
    },
    'additionalProperties': false
  },

  underwritePolicySchema: {
    '$id': '#underwritePolicySchema',
    'type': 'object',
    'properties': {
      'applicationId': {
        'type': 'integer'
      } },
    'required': ['applicationId'],
    'additionalProperties': false
  },

  createClaimSchema: {
    '$id': '#createClaimSchema',
    'type': 'object',
    'properties': {
      'policyId': {
        'type': 'integer'
      } },
    'required': ['policyId'],
    'additionalProperties': false
  },

  confirmClaimSchema: {
    '$id': '#confirmClaimSchema',
    'type': 'object',
    'properties': {
      'claimId': {
        'type': 'integer'
      } },
    'required': ['claimId'],
    'additionalProperties': false
  },

  getPolicyByIdSchema: {
    '$id': '#getPolicyByIdSchema',
    'type': 'object',
    'properties': {
      'policyId': {
        'type': 'integer'
      } },
    'required': ['policyId'],
    'additionalProperties': false
  }

}

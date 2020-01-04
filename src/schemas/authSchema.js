module.exports = {

  authSchema: {
    $id: '#auth',
    properties: {
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    required: ['username', 'password'],
    additionalProperties: false
  }

}

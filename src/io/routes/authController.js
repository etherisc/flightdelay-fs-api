
module.exports = ({ routerCommand, authService }) => {

  routerCommand.post('/auth', authSchema, authService, 'authenticate')

}

const authSchema = {
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

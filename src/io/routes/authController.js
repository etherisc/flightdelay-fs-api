
module.exports = ({ routerCommand, schemas, authService }) => {

  routerCommand.post('/auth', schemas.authSchema, authService, 'authenticate')

}

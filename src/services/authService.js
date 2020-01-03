const jwt = require('jsonwebtoken')

module.exports = class AuthService {

  constructor ({config}) {
    this.config = config
    this.secret = config.JWT_SECRET
    this.api_username = config.API_USERNAME
    this.api_password = config.API_PASSWORD
  }

  /**
   * Authenticate a user.
   *
   * @param ctx
   * @param credentials username and password
   */
  async authenticate (ctx, credentials) {

    if (credentials.username === this.api_username && credentials.password === this.api_password) {
      const payload = {user: this.api_username}
      const token = jwt.sign(payload, this.secret)
      ctx.ok({token})
    } else {
      ctx.throw(401, 'Invalid username/password')
    }
  }
}

const jwt = require('jsonwebtoken')

module.exports = class AuthService {

  constructor ({config}) {
    this.config = config
    this.secret = config.JWT_SECRET
  }

  /**
   * Authenticate a user.
   *
   * @param credentials username and password
   */
  async authenticate (credentials) {

    if (credentials.username === 'beacon' && credentials.password === 'horizon2020') {
      const payload = {user: 'beacon'}
      const token = jwt.sign(payload, this.secret)
      return {token}
    } else {
      return 'ok'
    }
  }
}

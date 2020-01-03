const PolicyService = require('./policyService')
const VersionService = require('./versionService')
const AuthService = require('./authService')

module.exports = ({ config, ioDeps, modelDeps }) => {

  const versionService = new VersionService({ config, ...ioDeps, ...modelDeps })
  const policyService = new PolicyService({ config, ...ioDeps, ...modelDeps })
  const authService = new AuthService({ config, ...ioDeps, ...modelDeps })

  return {
    policyService,
    versionService,
    authService
  }

}

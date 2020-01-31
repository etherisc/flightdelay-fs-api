const PolicyService = require('./policyService')
const VersionService = require('./versionService')
const AuthService = require('./authService')
const MonitoringDataService = require('./monitoringDataService')
const AuditService = require('./auditService')

module.exports = ({ config, ioDeps, modelDeps }) => {

  const versionService = new VersionService({ config, ...ioDeps, ...modelDeps })
  const policyService = new PolicyService({ config, ...ioDeps, ...modelDeps })
  const authService = new AuthService({ config, ...ioDeps, ...modelDeps })
  const monitoringDataService = new MonitoringDataService({config, ...ioDeps, ...modelDeps})
  const auditService = new AuditService({config, ...ioDeps, ...modelDeps})

  return {
    policyService,
    versionService,
    authService,
    monitoringDataService,
    auditService
  }

}

const PolicyService = require('./policyService');
const VersionService = require('./versionService');

module.exports = ({ config, ioDeps, modelDeps }) => {

  const versionService = new VersionService({ ...ioDeps, ...modelDeps });
  const policyService = new PolicyService({ ...ioDeps, ...modelDeps });

  return {
    policyService,
    versionService,
  }

};

const PolicyService = require('./policyService');
const VersionService = require('./versionService');
const CustomerService = require('./customerService');

module.exports = ({ config, ioDeps, modelDeps }) => {

  const customerService = new CustomerService({ ...ioDeps, ...modelDeps });
  const versionService = new VersionService({ ...ioDeps, ...modelDeps });
  const policyService = new PolicyService({ ...ioDeps, ...modelDeps });

  return {
    policyService,
    versionService,
    customerService,
  }
};

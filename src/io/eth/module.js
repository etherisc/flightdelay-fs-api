const Web3 = require('web3')
const ContractResolver = require('./contractResolver')
const PolicyEthRepo = require('./db/policyEthRepo')
const eventWorkerFactory = require('./eventWorker')
const EtherscanClient = require('./etherscan/etherscanClient')
const InsuranceEthAppService = require('./insuranceEthAppService')

module.exports = ({ config, db }) => {
  const web3 = new Web3(config.ETHEREUM_PROVIDER)

  const contractResolver = new ContractResolver(config, web3)
  const policyEthRepo = new PolicyEthRepo(contractResolver)
  const eventWorker = eventWorkerFactory({ contractResolver, db })
  const etherscanClient = new EtherscanClient({web3})
  const insuranceEthAppService = new InsuranceEthAppService({ etherscanClient, web3, ...config })

  return { web3, contractResolver, policyEthRepo, eventWorker, etherscanClient, insuranceEthAppService }
}

const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const GIF = require('@etherisc/gifcli')
/**
 * Adopted from Ethereum Client microservice
 */
class EthereumClient {
  /**
   * Constructor
   * @param {object} amqp
   * @param {object} log
   */
  constructor ({ log }) {

    this._log = log

    this.setSigner()
    this.setWeb3()
    this.stopProvider.bind(this)
    this.resetProvider.bind(this)
  }

  /**
   * Stop HDWallet provider engine
   * @return {void}
   */
  stopProvider () {
    if (this._provider) {
      this._provider.engine.stop()
    }
  }

  /**
   * Reset HDWalletprovider if necessary.
   * @return {void}
   */
  resetProvider () {
    if (!this._signer) return
    this.stopProvider()
    this._provider = new HDWalletProvider(process.env.MNEMONIC, process.env.WS_PROVIDER, 0, 1, false)
    this._signer.setProvider(this._provider)
  }

  /**
   * Initialize signer
   * @return {void}
   */
  setSigner () {
    this._signer = new Web3()
  }

  /**
   * Initialize web3
   * @return {void}
   */
  setWeb3 () {
    this._web3 = new Web3(new Web3.providers.HttpProvider(process.env.HTTP_PROVIDER))
  }

  /**
   * Handle call request
   * @param {{}} params
   * @param {{}} params.content
   * @param {{}} params.properties
   * @return {void}
   */
  async callRequest ({ content }) {

    if (!this.gif) {
      this.gif = await GIF.connect()
    }
    const { product, networkName, contractName, methodName, parameters } = content
    let result
    console.log(content)

    try {

      this._log.info(`Making ${methodName} call for ${contractName}@${product} on ${networkName}`)

      const { abi, address } = await this.gif.artifact.get(product, networkName, contractName)
      const abiJson = JSON.parse(JSON.parse(abi))
      const contractInterface = new (this._web3).eth.Contract(abiJson, address, {
        from: process.env.ACCOUNT
      })

      const methodDescription = abiJson.find(method => method.name === methodName)
      if (!methodDescription) {
        result = { error: `Undefined method ${methodName} in contract ${contractName}` }
      } else {
        const transformedParameters = this.transformParams(parameters, methodDescription.inputs, this._web3.utils)
        const callResult = await contractInterface.methods[methodName](...transformedParameters).call()
        result = this.transformOutput(callResult, methodDescription.outputs, this._web3.utils)
        this._log.info(`Completed ${methodName} call for ${contractName}@${product}`)
      }
    } catch (error) {
      this._log.error(error)

      if (error.code === 'INVALID_ARGUMENT') {
        const types = error.value.types.map(type => `${type.type} ${type.name}`)
        result = { error: `Expected ${error.count.types} arguments (${types.join(', ')}), but ${error.count.values} values provided (${error.value.values.join(', ')})` }
      } else {
        result = { error: error.message }
      }
    }

    return result

  }

  /**
   * Handle call request
   * @param {[]} parameters
   * @param {[]} inputs
   * @param {{}} utils
   * @return {[]} transformedparameters
   */
  transformParams (parameters, inputs, utils) {
    const transformedParameters = []

    for (let index = 0; index < parameters.length; index += 1) {
      const paramFormat = inputs[index]

      if (!paramFormat) {
        const types = inputs.map(type => `${type.type} ${type.name}`)
        throw new Error(`Unknown argument ${parameters[index]}, expected arguments: ${types.join(', ')}`)
      }
      if (/bytes/.test(paramFormat.type)) {
        const byteSize = parseInt(paramFormat.type.replace('bytes', ''), 10)
        const length = byteSize * 2 + 2
        const hexString = (parameters[index].match(/^0x/))
          ? parameters[index] : this._web3.utils.utf8ToHex(parameters[index])
        transformedParameters[index] = this._web3.utils.padRight(hexString, length).substr(0, length)
      } else if (paramFormat.type === 'tuple') {
        transformedParameters[index] = this.transformParams(parameters[index], inputs[index].components)
      } else if (paramFormat.type === 'tuple[]') {
        transformedParameters[index] = parameters[index].map(
          item => this.transformParams(item, inputs[index].components)
        )
      } else {
        transformedParameters[index] = parameters[index]
      }
    }
    return transformedParameters
  }

  /**
   * Transform contract call output
   * @param {*} data
   * @param {Object} abi
   * @param {Object} utils
   * @return {Object}
   */
  transformOutput (data, abi, utils) {
    const result = {}

    if (abi.length === 1) {
      const { name, type } = abi[0]
      result[name] = this.format(data, type, utils)
      return result
    }

    for (let i = 0; i < abi.length; i += 1) {
      const { name, type } = abi[i]
      result[name] = this.format(data[name], type, utils)
    }

    return result
  }

  /**
   * Format values
   * @param {*} value
   * @param {String} type
   * @param {Object} utils
   * @return {*}
   */
  format (value, type, utils) {
    if (/bytes/.test(type)) {
      // e.g. bytes32
      return utils.toUtf8(value)
    }

    if (type === 'address') {
      return value.toLowerCase()
    }

    if (/int[\d]+\[\]/.test(type)) {
      // e.g. uint256[], int64[]
      return value.map(el => el.toString())
    }

    if (/int/.test(type)) {
      // e.g. uint256, int256
      return value.toString()
    }

    return value
  }
}

module.exports = EthereumClient

const GIF = require('@etherisc/gifcli')

/**
 * Adopted from Ethereum Client microservice
 */
class EthereumClient {

  /**
   * Handle call request
   * @return {void}
   */

  async callRequest ({ content }) {

    const { contractName, methodName, parameters } = content

    if (!this.gif) {
      this.gif = await GIF.connect()
    }

    const result = await this.gif.contract.call(contractName, methodName, parameters)
    console.log(result)
    return result

  }

}

module.exports = EthereumClient

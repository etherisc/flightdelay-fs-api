class EtherscanClient {
  constructor ({ web3 }) {
    this.web3 = web3
  }

  getTransaction (txHash) {
    return this.web3.eth.getTransactionReceipt(txHash)
  }

  getLogs (blockNumber, databaseContractAddress) {
    return this.web3.eth.getPastLogs({fromBlock: blockNumber, address: databaseContractAddress})
  }

  async waitToBeMined (txHash, interval = 5000) {
    let result = null;

    while (result === null || !result.blockNumber) {
      try {
        result = await this.getTransaction(txHash)
      } catch (e) {
        console.log(e)
      }

      await timeout(interval)
    }

    return result
  }
}

function timeout (delay) {
  return new Promise((resolve, reject) => setTimeout(resolve, delay))
}

module.exports = EtherscanClient;

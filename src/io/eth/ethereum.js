const dotenv = require('dotenv')
const Web3 = require('web3')
const NewPolicyInterface = require('./abi/FlightDelayNewPolicyAbi.json')
const AddressResolverInterface = require('./abi/FlightDelayAddressResolverAbi.json')

const config = dotenv.load().parsed
const web3 = new Web3(config.ETHEREUM_PROVIDER)

function getFlightDelayAddress (addressResolver) {
  return new Promise((resolve, reject) => {
    const instance = new web3.eth.Contract(AddressResolverInterface, addressResolver)
    instance.methods
      .getAddress().call({}, (err, address) => {
        if (err) {
          reject(err)
        }
        resolve(address)
      })
  })
}

function waitToBeMined (txHash, interval = 500) {
  if (Array.isArray(txHash)) {
    const promises = []
    txHash.forEach(hash => promises.push(waitToBeMined(hash, interval)))
    return Promise.all(promises)
  } else {
    return web3.eth.getTransactionReceipt(txHash)
  }
}

async function newPolicy (args) {
  try {
    const NP = await getFlightDelayAddress(config.FD_ADDRESS_RESOLVER)

    const instance = new web3.eth.Contract(NewPolicyInterface, NP)
    const data = instance.methods.newPolicy(
      this.web3.utils.toHex(args.carrierFlightNumber),
      this.web3.utils.toHex(args.departureYearMonthDay),
      args.departureTime,
      args.arrivalTime,
      args.currency,
      this.web3.utils.toHex(args.customerId)
    ).encodeABI()
    const signedTransactionData = await web3.eth.accounts.signTransaction(
      {
        from: args.from,
        to: NP,
        value: args.value,
        gas: args.gas,
        gasPrice: args.gasPrice,
        data
      },
      config.FD_CUSTOMER_ADMIN_PRIVATE_KEY
    )
    const txHash = await new Promise((resolve, reject) => {
      web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction)
        .on('transactionHash', resolve)
        .on('error', reject)
    })

    return {txHash}
  } catch (error) {
    return Promise.reject(error)
  }
}

function toEth (weiValue) {
  return web3.utils.fromWei(weiValue, 'ether')
}

function getNetworkId () {
  return web3.eth.net.getId()
}

module.exports = {
  waitToBeMined,
  newPolicy,
  toEth,
  getNetworkId
}

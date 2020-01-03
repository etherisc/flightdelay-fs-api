const Coder = require('web3-eth-abi')
const databaseAbi = require('./../eth/abi/FlightDelayDatabaseAbi.json')
const newPolicyAbi = require('./../eth/abi/FlightDelayNewPolicyAbi.json')
const addressResolverAbi = require('./../eth/abi/FlightDelayAddressResolverAbi.json')
const moment = require('moment')

class InsuranceEthAppService {

  constructor ({ etherscanClient, web3, FD_DATABASE, FD_ADDRESS_RESOLVER, FD_CUSTOMER_ADMIN, FD_CUSTOMER_ADMIN_PRIVATE_KEY }) {
    this.etherscanClient = etherscanClient
    this.web3 = web3

    this.FD_DATABASE = FD_DATABASE
    this.FD_ADDRESS_RESOLVER = FD_ADDRESS_RESOLVER
    this.FD_CUSTOMER_ADMIN = FD_CUSTOMER_ADMIN
    this.FD_CUSTOMER_ADMIN_PRIVATE_KEY = FD_CUSTOMER_ADMIN_PRIVATE_KEY
  }

  async waitForOraclize (policyId, blockNumberVal, interval = 2000) {
    const databaseAddress = this.FD_DATABASE
    const blockNumber = this.web3.utils.hexToNumber(blockNumberVal)
    const blockNumberHex = this.web3.utils.numberToHex(blockNumber)

    while (true) {
      console.log('Waiting for oraclize...', blockNumber, databaseAddress)

      try {
        const result = await this.etherscanClient.getLogs(blockNumberHex, databaseAddress)

        console.log('Etherscan response processing...')
        const found = this.processPolicyEvents(policyId, result)

        if (found) {
          console.log(`Oraclize waiting job for policy [ID=${policyId}] completed!`)
          return found
        }
      } catch (e) {
        console.log(e)
        throw e
      }

      console.log('Schedule next check of oraclize response, 0 !')
      await timeout(interval)
    }
  }

  processPolicyEvents (policyId, result) {
    for (let data of result || []) {
      const curEvent = this.parseLog(data, databaseAbi)

      if (curEvent.name === 'LogSetState') {
        const found = this.processChangeStateEvent(curEvent, policyId)

        if (found !== null) {
          return found
        }
      }
    }

    return null
  }

  processChangeStateEvent (curEvent, policyId) {
    const curPolicyId = (curEvent.data.filter(evt => evt.name === '_policyId'))[0]
    console.log(`Processing of policy [ID=${curPolicyId.value.toString()}, Target=${policyId}] events...`)

    if (curPolicyId.value.toString() === policyId.toString()) {
      return this.checkPolicyState(curEvent, policyId)
    }

    return null
  }

  checkPolicyState (curEvent, policyId) {
    const state = (curEvent.data.filter(evt => evt.name === '_policyState'))[0]
    console.log(`Current state is ${state.value.toString()}`)

    if (state.value.toString() !== '0') {
      console.log(`Policy state changed! Policy=${policyId}, State=${state.value.toString()}`)
      const message = (curEvent.data.filter(evt => evt.name === '_stateMessage'))[0]

      return { message: message.value, state: state.value.toString() }
    }

    return null
  }

  parseLog (log, abi) {
    const eventsAbi = abi.filter(item => item.type === 'event').map(item => {
      item.signature = Coder.encodeEventSignature(item)
      return item
    })
    const eventAbi = eventsAbi.find(item => item.signature === log.topics[0])
    if (!eventAbi) return { error: 'unknown event' }
    const params = Coder.decodeLog(eventAbi.inputs, log.data, log.topics.slice(1))

    return {
      name: eventAbi.name,
      data: eventAbi.inputs.map((el, i) => {
        const contract = log.address
        const { name, type } = el

        let value = params[name]
        if (type === 'bytes32') {
          try {
            value = this.web3.utils.hexToUtf8(params[name])
          } catch (e) {
            // noop
          }
        }

        return { contract, name, type, value }
      })
    }
  }

  parseNewPolicyLog (log) {
    return this.parseLog(log, newPolicyAbi)
  }

  parseLogs (receipt) {
    const receiptLogs = receipt.logs || []

    const events = receiptLogs
      .map(log => this.parseNewPolicyLog(log))
      .reduce(function (result, log) {
        return { [log.name]: log.data, ...result }
      }, {})

    return new PolicyEvents(events)
  }

  getFlightDelayAddress (addressResolver) {
    return new Promise((resolve, reject) => {
      const instance = new this.web3.eth.Contract(addressResolverAbi, addressResolver)
      instance.methods
        .getAddress().call({}, (err, address) => {
          if (err) {
            reject(err)
          }

          resolve(address)
        })
    })
  }

  newPolicy ({ customerId, departsAt, arrivesAt, carrier, flightNumber }, amount, currency) {
    const { FD_CUSTOMER_ADMIN } = this

    return this.sendNewPolicyTransaction({
      carrierFlightNumber: `${carrier}/${flightNumber}`,
      departureYearMonthDay: `/dep/${moment(departsAt).utc().format('YYYY/MM/DD')}`,
      departureTime: moment(departsAt).unix(),
      arrivalTime: moment(arrivesAt).unix(),
      currency: currency,
      customerId: customerId,
      from: FD_CUSTOMER_ADMIN,
      value: amount,
      gas: 1000000,
      gasPrice: 10000000000 // todo: should be calculated from https://ethgasstation.info
    })
  }

  async sendNewPolicyTransaction (args) {
    const { FD_ADDRESS_RESOLVER, FD_CUSTOMER_ADMIN_PRIVATE_KEY, web3 } = this

    try {
      const NP = await this.getFlightDelayAddress(FD_ADDRESS_RESOLVER)

      const instance = new web3.eth.Contract(newPolicyAbi, NP)
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
        FD_CUSTOMER_ADMIN_PRIVATE_KEY
      )
      const txHash = await new Promise((resolve, reject) => {
        web3.eth.sendSignedTransaction(signedTransactionData.rawTransaction)
          .on('transactionHash', resolve)
          .on('error', reject)
      })

      return { txHash }
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

function timeout (delay) {
  return new Promise((resolve, reject) => setTimeout(resolve, delay))
}

class PolicyEvents {
  constructor (events) {
    this.events = events
  }

  hasPolicyAppliedEvent () {
    return !!this.events.LogPolicyApplied
  }

  getPolicyData () {
    const logs = this.events

    const applied = (logs.LogPolicyApplied.filter(data => data.name === '_policyId'))[0]
    const policyId = +applied.value
    const contract = applied.contract

    const fromDate = +(logs.LogSetState.filter(data => data.name === '_stateTime'))[0].value
    const status = +(logs.LogSetState.filter(data => data.name === '_policyState'))[0].value

    return { policyId, contract, fromDate, status }
  }
}

module.exports = InsuranceEthAppService

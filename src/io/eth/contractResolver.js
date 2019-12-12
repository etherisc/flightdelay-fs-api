const addressResolverAbi = require('./abi/FlightDelayAddressResolverAbi.json');
const newPolicyAbi = require('./abi/FlightDelayNewPolicyAbi.json');
const controllerAbi = require('./abi/FlightDelayControllerAbi.json');
const databaseAbi = require('./abi/FlightDelayDatabaseAbi.json');

class ContractResolver {
  constructor (config, web3) {
    this.config = config;
    this.web3 = web3;

    this.onReady = this._loadAddressResolver()
      .then(() => this._loadNewPolicy())
      .then(() => this._loadController())
      .then(() => this._loadDb())
  }

  async _loadAddressResolver () {
    const addressResolverAddress = this.config.FD_ADDRESS_RESOLVER;

    this.addressResolver = {
      name: 'FD.AddressResolver',
      address: addressResolverAddress,
      instance: new this.web3.eth.Contract(addressResolverAbi, addressResolverAddress)
    }
  }

  async _loadNewPolicy () {
    const newPolicyAddress = await this.addressResolver.instance.methods.getAddress().call();

    this.newPolicy = {
      name: 'FD.NewPolicy',
      address: newPolicyAddress,
      instance: new this.web3.eth.Contract(newPolicyAbi, newPolicyAddress)
    }
  }

  async _loadController () {
    const controllerAddress = await this.newPolicy.instance.methods.controller().call();
    this.controller = {
      name: 'FD.Controller',
      address: controllerAddress,
      instance: new this.web3.eth.Contract(controllerAbi, controllerAddress)
    }
  }

  async _loadDb () {
    const DB = (await this.controller.instance.methods.contracts(this.web3.utils.toHex('FD.Database')).call())[0];

    this.db = {
      name: 'FD.Database',
      address: DB,
      instance: new this.web3.eth.Contract(databaseAbi, DB)
    }
  }

  toEth (weiValue) {
    return this.web3.utils.fromWei(weiValue, 'ether')
  }

  getNetworkId () {
    return this.web3.eth.net.getId()
  }

  async getContractsVersion () {
    try {
      const controllerInstance = this.controller.instance;

      const major = await controllerInstance.methods.MAJOR_VERSION().call();
      const minor = await controllerInstance.methods.MINOR_VERSION().call();
      const patch = await controllerInstance.methods.PATCH_VERSION().call();

      return `${major}.${minor}.${patch}`
    } catch (error) {
      return null
    }
  }
}

module.exports = ContractResolver;

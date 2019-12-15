
module.exports = class VersionService {

  /**
   * Constructor.
   *
   * @param config Config Object, contains API_VERSION
   * @param contractResolver contractResolver, returns contract object
   */

  constructor ({ config, contractResolver }) {
    this.config = config;
    this.contractResolver = contractResolver
  }

  /**
   * Retrieve API version.
   * @returns {Promise<{version: string}>}
   */
  async retrieveVersion () {
    // TODO implement contract versions
    // const contractsVersion = (await this.contractResolver.getContractsVersion()) || 'Not Specified';
    return { version: this.config.API_VERSION };
  }

};

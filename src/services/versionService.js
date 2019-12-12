const fs = require('fs');
const path = require('path');

class VersionService {
  constructor ({ contractResolver }) {
    this.contractResolver = contractResolver
  }

  async retrieveAppVersion () {
    let appVersion;

    try {
      const appVersionJson = await this.loadVersionFrom('./../version.json');

      appVersion = JSON.parse(appVersionJson).version
    } catch (error) {
      console.log(error);

      appVersion = 'Not Specified'
    }

    const contractsVersion = (await this.contractResolver.getContractsVersion()) || 'Not Specified';
    return { appVersion, contractsVersion }
  }

  async loadVersionFrom (fileName) {
    const fullPath = path.join(__dirname, fileName);

    return new Promise((resolve, reject) => {
      fs.readFile(fullPath, 'utf8', (err, data) => !err ? resolve(data) : reject(err))
    })
  }
}

module.exports = VersionService;

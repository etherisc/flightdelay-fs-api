/* global describe, it */
const assert = require('assert');
const sinon = require('sinon');
const _ = require('lodash');
const VersionService = require('./../../src/services/versionService');

describe('VersionService', function () {

  describe('#retrieveAppVersion', function () {
    it('should retrieve app and contracts version', async function () {
      const service = buildService();

      const versions = await service.retrieveAppVersion();

      assert.strictEqual(versions.appVersion, '1.1.0');
      assert.strictEqual(versions.contractsVersion, '1.0.1')
    });

    it('should provide correct app and contracts version when version file is incorrect', async function () {
      const service = buildService({ appVersion: 'Not Valid' });

      const versions = await service.retrieveAppVersion();

      assert.strictEqual(versions.appVersion, 'Not Specified');
      assert.strictEqual(versions.contractsVersion, '1.0.1')
    });

    it('should return correct data when contract version is not possible to get', async function () {
      const service = buildService({ contractsVersion: null });

      const versions = await service.retrieveAppVersion();

      assert.strictEqual(versions.appVersion, '1.1.0');
      assert.strictEqual(versions.contractsVersion, 'Not Specified')
    })
  })

});

function buildService ({ contractsVersion, appVersion } = {}) {
  const contractsVersionVal = !_.isUndefined(contractsVersion) ? contractsVersion : '1.0.1';
  const contractResolver = { getContractsVersion: sinon.spy(() => contractsVersionVal) };

  const versionService = new VersionService({ contractResolver });

  const appVersionVal = appVersion || '{ "version": "1.1.0" }';
  versionService.loadVersionFrom = sinon.spy(() => appVersionVal);

  return versionService
}

/* global describe, it */
const CustomerService = require('../../src/services/customerService');
const assert = require('assert');
const sinon = require('sinon');
const _ = require('lodash');

describe('CustomerService', function () {

  describe('#getOrCreateCustomer', async function () {
    it('should return customer when it exists', async function () {
      const service = buildService();
      service.customerRepo.exists = () => [{ customerId: '1' }];

      const newCustomer = await service.getOrCreateCustomer({ customerId: '1' });

      assert.strictEqual(newCustomer.customerId, '1');
      assert(!service.customerRepo.create.calledOnce)
    });

    it('should return customer when it dies not exists', async function () {
      const service = buildService();

      const newCustomer = await service.getOrCreateCustomer({ customerId: '1' });

      assert.strictEqual(newCustomer.customerId, '1');
      assert(service.customerRepo.create.calledOnce)
    })
  });

  describe('#createWithSystemEthAddress', function () {
    it('should create new user with system ethereum address', async function () {
      const service = buildService();

      await service.createWithSystemEthAddress({ firstName: 'I', lastName: 'D', email: 'D' });

      assert(service.customerRepo.create.calledOnce);
      assert(service.customerRepo.create.args[0][0].ethereumAccount, '0x1234567890')
    })
  });

  describe('#create', function () {
    it('should create new user with provided ethereum address', async function () {
      const service = buildService();

      await service.create({ firstName: 'I', lastName: 'D', email: 'D', ethereumAccount: 'X' });

      const newCustomer = service.customerRepo.create.args[0][0];
      assert(newCustomer.customerId);
      assert.strictEqual(newCustomer.ethereumAccount, 'X');
      assert.strictEqual(newCustomer.firstName, 'I')
    });

    it('should create new user without provided ethereum address', async function () {
      const service = buildService();

      await service.create({ firstName: 'I', lastName: 'D', email: 'D' });

      const newCustomer = service.customerRepo.create.args[0][0];
      assert(!newCustomer.ethereumAccount);
      assert.strictEqual(newCustomer.lastName, 'D')
    })
  })

});

function buildService () {
  const customerRepo = { exists: sinon.spy(() => []), create: sinon.spy(_.noop) };

  return new CustomerService({ customerRepo, DB_SALT: '1', CUSTOMER_ADMIN_ADDRESS: '0x1234567890' })
}

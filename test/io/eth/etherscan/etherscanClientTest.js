/* global describe, it */
process.env.VCR_MODE = 'cache';
const replayer = require('replayer');

const assert = require('assert');
const path = require('path');
const EtherscanClient = require('./../../../../src/io/eth/etherscan/etherscanClient');
const Web3 = require('web3');

describe('Etherscan Client', function () {
  const web3 = new Web3('https://ropsten.infura.io/v3/199b1de9e63d43318b9453dc08099611');
  const etherscanClient = new EtherscanClient({ web3 });
  replayer.fixtureDir(path.join(__dirname, '..', '..', '..', 'fixtures'));

  it('should retrieve transaction receipt from etherscan', async function () {
    const txHash = '0x10b1cf2c8811abf8bb2ec210664abb6ef3a3604e7e650131ab584379a43f59fe';

    const receipt = await etherscanClient.getTransaction(txHash);

    assert.equal(receipt.blockNumber, '0x31b7f0')
  });

  it('should retrieve transaction logs from etherscan', async function () {
    const logs = await etherscanClient.getLogs('0x31B7F0', '0xfdf41cd93a8e9e6e75888763f73c529c15517bdc');

    assert.equal(logs.length, 6)
  })
});

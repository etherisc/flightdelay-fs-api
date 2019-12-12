
class EventWorker {
  constructor (contractResolver, db, onLogSetState) {
    this.contractResolver = contractResolver;
    this.db = db;
    this.onLogSetState = onLogSetState;
    this.isWatchingEvents = false;

    contractResolver
      .onReady
      .then(() => this._watchEvents())
      .catch(e => console.log(e))
  }

  async _watchEvents () {
    const db = this.db;
    const [block] = await db.select('blockNumber').from('events').orderBy('id', 'DESC').limit(1);
    const latestBlock = block ? block.blockNumber + 1 : 0;

    await this._listenToEvents('newPolicy', latestBlock);
    await this._listenToEvents('db', latestBlock);

    setTimeout(this._watchEvents.bind(this), 60 * 1000)
  }

  async _listenToEvents (contract, fromBlock) {
    console.log('_listenToEvents', contract, fromBlock);
    const contractResolver = this.contractResolver;
    const events = await contractResolver[contract].instance.getPastEvents('allEvents', {fromBlock});
    for (const evt of events) {
      evt.contractAddress = contractResolver[contract].name;
      await this._processEvent(evt)
    }
  }

  async _processEvent (evt) {
    console.log('_processEvent', evt);
    try {
      if (evt.event === 'LogExternal') {
        await this._onLogExternal(evt)
      }

      if (evt.event === 'LogSetState') {
        const state = evt.returnValues._policyState.toString();
        const policyId = evt.returnValues._policyId;
        let message = this.contractResolver.web3.utils.hexToUtf8(evt.returnValues._stateMessage);

        await this.db('policies')
          .where({ policyId: policyId.toString() })
          .update({ status: Number(state) });

        await this.onLogSetState(policyId, state, message)
      }
    } catch (e) {
      throw new Error(e)
    } finally {
      await this._saveProcessedEvent(evt)
    }
  }

  async _onLogExternal (evt) {
    console.log(`Verify Customer Id [State=${JSON.stringify(evt.returnValues)}]`)
  }

  async _saveProcessedEvent (evt) {
    const event = {
      contractAddress: evt.address,
      contractName: evt.contractAddress,
      blockNumber: evt.blockNumber,
      transactionHash: evt.transactionHash,
      event: evt.event,
      eventArgs: JSON.stringify(evt.returnValues)
    };

    await this.db('events').insert(event)
  }
}

module.exports = ({ contractResolver, db }) => ({ onLogSetState }) =>
  new EventWorker(contractResolver, db, onLogSetState);

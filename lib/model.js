/* global getFactory getAssetRegistry getParticipantRegistry emit */

/**
* Transfer a container
* @param {org.acme.shipping.transactions.TransferContainer} transferContainer - the TransferContainer transaction
* @transaction
*/
async function transferContainer(tx) {
    console.log('transferContainer');
  
    const factory = getFactory();
    const namespace = 'org.acme.shipping';
  
    // get container registry
    const containerRegistry = await getAssetRegistry(namespace + '.assets.Container');
  
    if(tx.owner.type == "BORDER") {
      throw new Error("Border is not allowed to own containers!");
    }
  
    const container = tx.container;
    const oldOwner = tx.container.owner;
    container.owner = tx.owner;
  
    // update the order
    await containerRegistry.update(container);
  
    // emit the event
    const transferContainerEvent = factory.newEvent('org.acme.shipping.transactions', 'TransferContainerEvent');
    transferContainerEvent.from = oldOwner;
    transferContainerEvent.to = tx.owner;
    transferContainerEvent.container = container;
    emit(transferContainerEvent);
  }
  
  /**
  * Lock a container
  * @param {org.acme.shipping.transactions.LockContainer} lockContainer - the LockContainer transaction
  * @transaction
  */
  async function lockContainer(tx) {
    console.log('lockContainer');
  
    const factory = getFactory();
    const namespace = 'org.acme.shipping';
  
    // get container registry
    const containerRegistry = await getAssetRegistry(namespace + '.assets.Container');
  
    const container = tx.container;
    container.status = "LOCKED";
  
    // update the order
    await containerRegistry.update(container);
  
    // emit the event
    const lockContainerEvent = factory.newEvent('org.acme.shipping.transactions', 'LockContainerEvent');
    lockContainerEvent.container = container;
    emit(lockContainerEvent);
  }
  
  /**
  * Free a container
  * @param {org.acme.shipping.transactions.FreeContainer} freeContainer - the FreeContainer transaction
  * @transaction
  */
  async function freeContainer(tx) {
    console.log('freeContainer');
  
    const factory = getFactory();
    const namespace = 'org.acme.shipping';
  
    // get container registry
    const containerRegistry = await getAssetRegistry(namespace + '.assets.Container');
  
    const container = tx.container;
    container.status = "FREE";
  
    // update the order
    await containerRegistry.update(container);
  
    // emit the event
    const freeContainerEvent = factory.newEvent('org.acme.shipping.transactions', 'FreeContainerEvent');
    freeContainerEvent.container = container;
    emit(freeContainerEvent);
  }
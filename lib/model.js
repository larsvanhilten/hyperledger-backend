/* global getFactory getAssetRegistry getParticipantRegistry emit */

/**
* Transfer a container
* @param {org.acme.shipping.transactions.AddContainers} addContainers - the AddContainers transaction
* @transaction
*/
async function addContainers(tx) {
    console.log('addContainers');
  
    const factory = getFactory();
    const namespace = 'org.acme.shipping';
  
    // get container registry
    const containerRegistry = await getAssetRegistry(namespace + '.assets.Container');
     
    // add containers
    await containerRegistry.addAll(tx.containers);
  
    // emit the event
    const addContainersEvent = factory.newEvent('org.acme.shipping.transactions', 'AddContainersEvent');
    addContainersEvent.containers = tx.containers;
    emit(addContainersEvent);
}

/**
* Transfer a container
* @param {org.acme.shipping.transactions.RespondToRequest} respondToRequest - the RespondToRequest transaction
* @transaction
*/
async function respondToRequest(tx) {
    console.log('respondToRequest');
  
    const factory = getFactory();
    const namespace = 'org.acme.shipping';
  
    // get container registry
    const requestRegistry = await getAssetRegistry(namespace + '.assets.Request');
    
  	const request = tx.request;
  	request.status = tx.response;
  
    // add containers
    await requestRegistry.update(request);
  
    // emit the event
    const respondToRequestEvent = factory.newEvent('org.acme.shipping.transactions', 'RespondToRequestEvent');
    respondToRequestEvent.request = request;
    emit(respondToRequestEvent);
}

/**
* Transfer a container
* @param {org.acme.shipping.transactions.RequestContainer} requestContainer - the RequestContainer transaction
* @transaction
*/
async function requestContainer(tx) {
    console.log('requestContainer');
  
    const factory = getFactory();
    const namespace = 'org.acme.shipping';
  
    // get request registry
    const requestRegistry = await getAssetRegistry(namespace + '.assets.Request');
   
    const request = factory.newResource('org.acme.shipping.assets', 'Request', tx.id);
  	
  	request.id = tx.id;
  	request.from = tx.container.owner;
  	request.to = tx.to;
  	request.timestamp = tx.timestamp;
  	request.container = tx.container;
  
    // add the request
    await requestRegistry.add(request);
  
    // emit the event
    const requestContainerEvent = factory.newEvent('org.acme.shipping.transactions', 'RequestContainerEvent');
  	requestContainerEvent.id = tx.id;
    requestContainerEvent.from = tx.container.owner;
    requestContainerEvent.to = tx.to;
    requestContainerEvent.container = tx.container;
    emit(requestContainerEvent);
}

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
	
  for(let i = 0; i < tx.containers.length; i++) {
    tx.containers[i].status = "LOCKED";
  }

  // update the order
  await containerRegistry.updateAll(tx.containers);

  // emit the event
  const lockContainerEvent = factory.newEvent('org.acme.shipping.transactions', 'LockContainerEvent');
  lockContainerEvent.containers = tx.containers;
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

  for(let i = 0; i < tx.containers.length; i++) {
    tx.containers[i].status = "FREE";
  }

  // update the order
  await containerRegistry.updateAll(tx.containers);

  // emit the event
  const freeContainerEvent = factory.newEvent('org.acme.shipping.transactions', 'FreeContainerEvent');
  freeContainerEvent.containers = tx.containers;
  emit(freeContainerEvent);
}

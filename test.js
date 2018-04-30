var { StorageProtocol, StorageType } = require('./dist');
var { ResourceManager } = require('@dlcs/core');

const manager = new ResourceManager();
manager.registerProtocol(new StorageProtocol());

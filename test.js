var { StorageProtocol, StorageType } = require('./dist');
var { ResourceManager } = require('@dlcs/core');

ResourceManager.registerProtocol(new StorageProtocol());

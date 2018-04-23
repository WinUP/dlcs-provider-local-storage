var { StorageProtocol, StorageType } = require('./dist');
var { ResourceManager } = require('@dlcs/core');

const manager = new ResourceManager();
manager.registerProtocol(new StorageProtocol());

console.log(manager.request.to('cache:///test1/test2').submit('123').requireSync().metadata);
console.log(manager.request.to('cache:///test1/test2').requireSync().metadata);
# DLCS LocalStorage Provider

![status](https://img.shields.io/travis/WinUP/dlcs-provider-local-storage.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dlcs/provider-local-storage.svg?style=flat-square)](https://www.npmjs.com/package/@dlcs/provider-local-storage)

Resource provider for localStorage and memory cache.

### Configuration

| Name | Default value | Usage |
|-|:-|:-|
| ```root.cache``` | ```'ROOT'``` | Memory cache root name |
| ```root.local``` | ```'DLCS'``` | LocalStorage root name |

```typescript
SerializableNode.set(StorageProtocol.config, StorageProtocol.configKeys.root.cache, 'ROOT');
SerializableNode.set(StorageProtocol.config, StorageProtocol.configKeys.root.local, 'DLCS');
```

### Supported protocol

* ```local```
*  ```cache```

### Parameters

No parameter.

### Supported mode

* √ Asynchronized request
* √ Synchronized request
* √ Request data
* √ Submit data
* √ Delete data

### Example

```typescript
resourceManager.registerProtocol(new StorageProtocol());
// Save value to localStorage
resourceManager.request.to(`local:///user/state/token`).submit('test').tag('user_token').send();
// Save value to memory cache
resourceManager.request.to(`cache:///user/state/token`).submit('test').tag('user_token').send();
// Read value
const value = resourceManager.request.to(`local:///user/state/token`).tag('user_token_read').requireSync<string>();
```

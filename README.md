# DLCS LocalStorage Provider

![status](https://img.shields.io/travis/WinUP/dlcs-provider-local-storage.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/@dlcs/provider-local-storage.svg?style=flat-square)](https://www.npmjs.com/package/@dlcs/provider-local-storage)

Resource provider for HTML5 localStorage.

### Configuration

| Name | Default value | Usage |
|-|:-|:-|
| ```root.local``` | ```'DLCS'``` | LocalStorage root name |

```typescript
SerializableNode.set(StorageProtocol.config, StorageProtocol.configKeys.root.name, 'DLCS');
```

### Supported protocol

* ```local``` for access localStorage.

### Request parameters

No parameter.

### Supported mode

| Protocol | Asynchronized | Synchronized | Request | Submit | Delete |
|-|:-:|:-:|:-:|:-:|:-:|
| local | √ | √ | √ | √ | √ |

### Injectors

| Timepoint | Data structure | Data description | Request method |
|-|:-|:-|:-|
| BeforeSend | ```SerializableNode<any>``` | Storage node | Request/Submit/Delete |
| AfterSent | ```SerializableNode<any>``` | Storage node | Request/Submit/Delete |

### Example

```typescript
resourceManager.registerProtocol(new StorageProtocol());
// Save value
resourceManager.request.to(`local:///user/state/token`).submit('test').tag('user_token').send();
// Read value
const value = resourceManager.request.to(`local:///user/state/token`).tag('user_token_read').requireSync<string>();
```

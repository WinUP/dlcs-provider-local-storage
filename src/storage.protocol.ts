import { ResourceProtocol, ResourceRequest, InjectorTimepoint, RequestType } from '@dlcs/core';
import { SerializableNode, autoname, toPascalCase } from '@dlcs/tools';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { StorageType } from './StorageType';

/**
 * Configuration keys for StorageProtocol
 */
export interface StorageProtocolConfigKeys {
    /**
     * Storage root name configuration
     */
    root: {
        /**
         * Memory cache root name
         * @default 'ROOT'
         */
        cache: string,
        /**
         * LocalStorage root name
         * @default 'DLCS'
         */
        local: string
    };
}

export class StorageProtocol extends ResourceProtocol {
    private memoryStorage: SerializableNode;
    private static _config: SerializableNode = SerializableNode.create('resource_manager', undefined);
    private static _configKeys: StorageProtocolConfigKeys = { root: { cache: '', local: '' } };

    public static initialize(): void {
        autoname(StorageProtocol._configKeys, '/', toPascalCase);
        SerializableNode.set(StorageProtocol.config, StorageProtocol.configKeys.root.cache, 'ROOT');
        SerializableNode.set(StorageProtocol.config, StorageProtocol.configKeys.root.local, 'DLCS');
    }

    public constructor() {
        super('local', 'cache');
        this.memoryStorage = SerializableNode.create(
            SerializableNode.get<string>(StorageProtocol.config, StorageProtocol.configKeys.root.cache)
        , undefined);
    }

    /**
     * Get configuration
     */
    public static get config(): SerializableNode {
        return StorageProtocol._config;
    }

    /**
     * Get configuration keys
     */
    public static get configKeys(): Readonly<StorageProtocolConfigKeys> {
        return StorageProtocol._configKeys;
    }

    public requestSync(request: ResourceRequest, injector?: (data: any, timepoint: InjectorTimepoint) => any): any {
        const root: SerializableNode = this.findRoot(request);
        let node = this.findNode(request.address, root);
        injector && (node = injector(node, InjectorTimepoint.BeforeSend));
        if (request.type === RequestType.Request) {
            injector && (node = injector(node, InjectorTimepoint.AfterSent));
            return {
                key: request.address,
                value: this.findNode(request.address, root).value,
                type: request.protocol === 'local' ? StorageType.Local : StorageType.Cache
            };
        } else {
            if (request.type === RequestType.Submit) {
                node.value = request.content;
            } else {
                this.removeNode(node, root);
            }
            if (root !== this.memoryStorage) {
                this.saveStorageRoot(root);
            }
            injector && (node = injector(node, InjectorTimepoint.AfterSent));
            return node.value;
        }
    }

    public request(request: ResourceRequest, injector?: (data: any, timepoint: InjectorTimepoint) => any): Observable<any> {
        return of(this.requestSync(request, injector));
    }

    private removeNode(node: SerializableNode, root: SerializableNode): void {
        if (root.children.indexOf(node) > -1) {
            root.children.splice(root.children.indexOf(node), 1);
        } else {
            root.children.forEach(parent => {
                this.removeNode(node, parent);
            });
        }
    }

    private findRoot(request: ResourceRequest): SerializableNode {
        return request.protocol === 'local' ? this.readStorageRoot() : this.memoryStorage;
    }

    private findNode(key: string, root: SerializableNode): SerializableNode {
        const hierarchy = key.split('/').slice(1);
        let pointer: SerializableNode = root;
        hierarchy.forEach(itemKey => {
            let child = pointer.children.find(v => v.key === itemKey);
            if (!child) {
                child = SerializableNode.create(itemKey, undefined);
                pointer.children.push(child);
            }
            pointer = child;
        });
        return pointer;
    }

    private readStorageRoot(): SerializableNode {
        if (!window.localStorage) {
            throw new TypeError(`Cannot create storage root: Running environment does not support localStorage.`);
        }
        const rootName = SerializableNode.get<string>(StorageProtocol.config, StorageProtocol.configKeys.root.cache);
        const localData = window.localStorage.getItem(rootName);
        let storage: SerializableNode;
        if (localData == null) {
            storage = SerializableNode.create(rootName, undefined);
        } else {
            storage = JSON.parse(localData);
        }
        return storage;
    }

    private saveStorageRoot(root: SerializableNode): void {
        if (!window.localStorage) {
            throw new TypeError(`Cannot create storage root: Running environment does not support localStorage.`);
        }
        window.localStorage.setItem(
            SerializableNode.get<string>(StorageProtocol.config, StorageProtocol.configKeys.root.cache)
        , JSON.stringify(root));
    }
}

StorageProtocol.initialize();
import { ResourceProtocol, ResourceRequest, InjectorTimepoint, RequestType } from '@dlcs/core';
import { SerializableNode, autoname, toPascalCase } from '@dlcs/tools';
import { Observable, of } from 'rxjs';

export class StorageProtocol extends ResourceProtocol {
    private rootName: string;

    /**
     * Create a new StorageProtocol
     * @param root Root name in localStorage
     */
    public constructor(root: string = 'DLCS') {
        super('local');
        this.rootName = root;
    }

    public requestSync(request: ResourceRequest, injector?: (data: any, timepoint: InjectorTimepoint) => any): any {
        const root: SerializableNode = this.readStorageRoot();
        let node = this.findNode(request.address, root);
        injector && (node = injector(node, InjectorTimepoint.BeforeSend));
        if (request.type === RequestType.Request) {
            injector && (node = injector(node, InjectorTimepoint.AfterSent));
            return this.findNode(request.address, root).value;
        } else {
            if (request.type === RequestType.Submit) {
                node.value = request.content;
            } else {
                this.removeNode(node, root);
            }
            this.saveStorageRoot(root);
            injector && (node = injector(node, InjectorTimepoint.AfterSent));
            return node.value;
        }
    }

    public request(request: ResourceRequest, injector?: (data: any, timepoint: InjectorTimepoint) => any): Observable<any> {
        return of(this.requestSync(request, injector));
    }

    private removeNode(node: SerializableNode, root: SerializableNode): void {
        root.drop(node);
    }

    private findNode(key: string, root: SerializableNode): SerializableNode {
        return root.find(key);
    }

    private readStorageRoot(): SerializableNode {
        if (!localStorage) {
            throw new TypeError(`Cannot create storage root: Running environment does not support localStorage.`);
        }
        const localData = localStorage.getItem(this.rootName);
        let storage: SerializableNode;
        if (localData == null) {
            storage = new SerializableNode(this.rootName, undefined);
        } else {
            storage = SerializableNode.deserialize(JSON.parse(localData));
        }
        return storage;
    }

    private saveStorageRoot(root: SerializableNode): void {
        if (!localStorage) {
            throw new TypeError(`Cannot create storage root: Running environment does not support localStorage.`);
        }
        localStorage.setItem(this.rootName, JSON.stringify(root.serialize()));
    }
}

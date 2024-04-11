import { Callback, MuStateIdentifier } from "../types";

export function createStore<T extends object>(object: T): T {
  const muStore = new MuStore(object);
  return muStore.store;
}

export class MuStore<T extends object = object> {
  private static stores: Map<object, MuStore> = new Map();

  private id: string;
  private observers: Map<string, Set<Callback<void>>>;
  private _store: T;

  constructor(object: T) {
    this.id = crypto.randomUUID();
    this.observers = new Map();
    this._store = this.createStore(object);
  }

  public get store() {
    return this._store;
  }

  public static getMuStore<T extends object>(store: T): MuStore<T> | null {
    if (MuStore.stores.has(store)) {
      return MuStore.stores.get(store)! as MuStore<T>;
    }

    return null;
  }

  public subscribe(property: string, callback: Callback<void>) {
    const propertyName = this.propertyName(property);

    if (!this.observers.has(propertyName)) {
      this.observers.set(propertyName, new Set<Callback<void>>());
    }
    this.observers.get(propertyName)!.add(callback);
  }

  public unsubscribe(property: string, callback: Callback<void>) {
    const propertyName = this.propertyName(property);

    if (!this.observers.has(propertyName)) {
      this.observers.set(propertyName, new Set<Callback<void>>());
    }
    this.observers.get(propertyName)!.delete(callback);
  }

  private notify(property: string) {
    const notifications = this.observers.get(this.propertyName(property));
    if (!notifications) {
      return;
    }

    for (const notification of notifications) {
      notification();
    }
  }

  private propertyName(property: string) {
    return `${this.id}-${property}`;
  }

  private createStore(object: T): T {
    const handler: ProxyHandler<object> = {
      set: (target: object, property: string, value: unknown) => {
        if (Reflect.get(target, property) != value) {
          Reflect.set(target, property, value);
          this.notify(property);
        }

        return true;
      },

      get: (target: object, property: string) => Reflect.get(target, property),
    };

    Object.defineProperty(object, MuStateIdentifier, {
      value: true,
    });
    const store = new Proxy(object, handler) as T;

    MuStore.stores.set(store, this);

    return store;
  }
}

import { Callback, MuStateIdentifier, Observable } from "../types";
import { MuStore } from "./muStore";

export class Registerer {
  public static registerObservables(
    observables: Observable[],
    callback: Callback<void>,
  ) {
    for (const observable of observables) {
      this.performOperation(observable, (muStore: MuStore, property: string) =>
        muStore.subscribe(property, callback),
      );
    }
  }

  public static unregisterObservables(
    observables: Observable[],
    callback: Callback<void>,
  ) {
    for (const observable of observables) {
      this.performOperation(observable, (muStore: MuStore, property: string) =>
        muStore.unsubscribe(property, callback),
      );
    }
  }

  private static performOperation(
    observable: Observable,
    operation: (store: MuStore, property: string) => void,
  ) {
    if (!this.isStore(observable.store)) {
      console.error(
        `${JSON.stringify(
          observable.store,
        )} is not a store and its properties will not be tracked. Please use [createStore] to convert an object into a store.`,
      );
      return;
    }

    const properties = new Set(Object.keys(observable.store));
    properties.delete(MuStateIdentifier);
    const include = new Set(observable.include ?? []);
    const exclude = new Set(observable.exclude ?? []);

    this.validateProperties(properties, include, exclude);

    const observedProperties = include.size > 0 ? include : properties;
    for (const property of exclude) {
      observedProperties.delete(property);
    }

    const store = MuStore.getMuStore(observable.store);
    if (store) {
      for (const property of observedProperties) {
        operation(store, property);
      }
    }
  }

  private static isStore(object: object) {
    return MuStateIdentifier in object;
  }

  private static validateProperties(
    properties: Set<string>,
    included: Set<string>,
    excluded: Set<string>,
  ) {
    const invalidProperties = new Set<string>();

    for (const property of included) {
      if (!properties.has(property)) {
        invalidProperties.add(property);
      }
    }

    for (const property of excluded) {
      if (!properties.has(property)) {
        invalidProperties.add(property);
      }
    }

    if (invalidProperties.size > 0) {
      console.error(
        `Properties [${[...invalidProperties].join(
          ", ",
        )}] are not available in the store.`,
      );
    }
  }
}

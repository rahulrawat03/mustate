export const MuStateIdentifier = "__mustate_store__";

export interface Observable {
  store: object;
  include?: string[];
  exclude?: string[];
}

export type Callback<T> = () => T;

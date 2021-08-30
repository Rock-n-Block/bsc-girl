import { createContext, useContext } from 'react';
import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { User } from './User';

const RootModel = types.model({
  user: User,
});

export const Store = RootModel.create({
  user: {
    address: '',
    is_verificated: false,
    name: '',
    balance: { eth: '0', bnb: '0', matic: '0' },
    follows_count: 0,
    followers_count: 0,
  },
});

export const rootStore = Store;

onSnapshot(rootStore, (snapshot) => {
  console.log('Snapshot:', snapshot);
});

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const { Provider } = RootStoreContext;

export function useMst() {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}

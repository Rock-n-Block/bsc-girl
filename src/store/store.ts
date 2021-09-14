import { createContext, useContext } from 'react';
import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { clogData } from '../utils/logger';

import { User } from './User';

const RootModel = types.model({
  user: User,
});

export const Store = RootModel.create({
  user: {
    address: '',
    is_verificated: false,
    display_name: '',
    balance: '0',
    follows_count: 0,
    followers_count: 0,
  },
});

export const rootStore = Store;

onSnapshot(rootStore, (snapshot) => {
  clogData('Snapshot:', snapshot);
});

export type RootInstance = Instance<typeof RootModel>;
const RootStoreContext = createContext<null | RootInstance>(null);

export const { Provider } = RootStoreContext;

export function useMst(): any {
  const store = useContext(RootStoreContext);
  if (store === null) {
    throw new Error('Store cannot be null, please add a context provider');
  }
  return store;
}

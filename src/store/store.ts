import { createContext, useContext } from 'react';
import { Instance, onSnapshot, types } from 'mobx-state-tree';

import { clogData } from '../utils/logger';

import { Modals } from './Modals';
import { User } from './User';

const RootModel = types.model({
  modals: Modals,
  user: User,
});

export const Store = RootModel.create({
  modals: {
    error: {
      errMsg: '',
    },
    fixedPrice: {
      isOpen: false,
      fee: 0,
      totalSupply: 1,
    },
    info: {
      msg: '',
    },
    putOnSale: {},
    checkout: {
      token: {},
    },
    multibuy: {},
    checkAvailability: {
      user: {},
    },
    createModal: {
      isOpen: false,
    },
    stakeModal: {
      isOpen: false,
    },
  },
  user: {
    address: '',
    is_verificated: false,
    display_name: '',
    balance: {
      bscgirl: '0',
      bscgirlmoon: '0',
      bnb: '0',
    },
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

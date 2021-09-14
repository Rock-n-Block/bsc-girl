import { INetwork, IProvider, ISettings } from '@amfi/connect-wallet/dist/interface';

export interface IChainConfigData {
  name: string;
  id: number;
  rpc: string;
  tx: {
    link: string;
  };
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExp: string;
  useProvider?: string;
}

export interface IConnectWallet {
  wallets?: string[];
  network: INetwork;
  provider: {
    [index: string]: IProvider;
  };
  settings: ISettings;
}

export interface IContracts {
  names: string[];
  type: string;
  contract: {
    [index: string]: {
      params?: {
        decimals?: number;
      };
      chain: {
        [index: string]: {
          address: string;
          abi: any[];
        };
      };
    };
  };
}

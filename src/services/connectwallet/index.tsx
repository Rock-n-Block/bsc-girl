import { ConnectWallet } from '@amfi/connect-wallet';
import { ContractWeb3 } from '@amfi/connect-wallet/dist/interface';
import WalletConnectProvider from '@walletconnect/web3-provider';
import BigNumber from 'bignumber.js/bignumber';
import Web3 from 'web3';

import { blockchains, chain, connectWalletInfo, contracts } from '../../config';
import { clog, clogData, clogGroup, throwError } from '../../utils/logger';

export class ConnectWalletService {
  private readonly connectWallet: ConnectWallet;

  private connector: any | undefined;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(connectName: string): Promise<boolean> {
    this.connectWallet.addChains(blockchains);

    const { provider, network, settings } = connectWalletInfo;
    clog(`${provider[connectName]}, ${network}, ${settings}`);

    const connecting = this.connectWallet
      .connect(provider[connectName], network, settings)
      .then((connected: boolean | {}) => {
        if (connected) {
          this.initContracts();
        }
        return connected;
      })
      .catch((err: any) => {
        clogData('initWalletConnect providerWallet err: ', err);
      });

    return Promise.all([connecting]).then((connect: any) => {
      return connect[0];
    });
  }

  public disconnect(): void {
    this.connectWallet.resetConect();
    if (this.connector instanceof WalletConnectProvider) this.connector.disconnect();
  }

  public Web3(): Web3 {
    return this.connectWallet.currentWeb3();
  }

  public signMsg(msg: string, providerName: string, address: string): any {
    this.connector = this.connectWallet.getConnector();
    if (providerName === 'MetaMask') {
      return this.Web3().eth.personal.sign(msg, address, '');
    }
    const msgLength = new Blob([msg]).size;
    let message = `\x19Ethereum Signed Message:\n${msgLength}${msg}`;
    clogData('message', message);
    message = Web3.utils.keccak256(message);
    clogData('message', message);
    const params = [address, message];
    return this.connector.connector.request({
      method: 'eth_sign',
      params,
    });
  }

  private initContracts(): void {
    const { type, names, contract } = contracts;

    // eslint-disable-next-line array-callback-return
    names.map((name) => {
      const { address, abi } = contract[name.toUpperCase()].chain[type];
      this.connectWallet
        .addContract({ name, address, abi })
        .then((status) => clog(`is contract ${name} with ${address} added?: ${status}`));
    });
  }

  public getContract = (name: string): ContractWeb3 => this.connectWallet.Contract(name);

  private async checkNetwork(): Promise<any> {
    const { connector, providerName, network } = this.connectWallet as any;
    const { network: nInfo } = connectWalletInfo;
    const { name, nativeCurrency, rpc, blockExp } = chain;

    if (providerName === 'MetaMask') {
      try {
        const resChain = await connector.connector.request({ method: 'eth_chainId' });

        if (network.chainID !== parseInt(resChain, 16)) {
          try {
            await connector.connector.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${network.chainID.toString(16)}` }],
            });
            return true;
          } catch (error: any) {
            if (error.code === 4902) {
              try {
                await connector.connector.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: `0x${nInfo.chainID.toString(16)}`,
                      chainName: name,
                      nativeCurrency,
                      rpcUrls: [rpc],
                      blockExplorerUrls: [blockExp],
                    },
                  ],
                });
                try {
                  const newChain = await connector.connector.request({ method: 'eth_chainId' });

                  if (nInfo.chainID !== parseInt(newChain, 16)) {
                    throwError('User reject switch network');
                  }
                } catch (err) {
                  throwError('get user chain');
                }

                return true;
              } catch (err) {
                throwError(`User reject add ${name}`);
              }
            } else {
              throwError('User reject switch network');
            }
          }
        }
      } catch (err: any) {
        clogData('getAccount wallet connect - get user account err: ', err);
        throw new Error(err);
      }
    }
    return true;
  }

  public async getAccount(account: { address?: string; balance?: string }): Promise<any> {
    clogData('start catch account', account);
    return new Promise((resolve: any, reject: any) => {
      this.checkNetwork()
        .then(() => {
          this.connectWallet.getAccounts().subscribe(
            (userAccount: any) => {
              clogData('user account: ', userAccount);
              if (!account || userAccount.address !== account.address) {
                resolve(userAccount);
                clog(
                  `account connected: ${userAccount.address.substring(
                    0,
                    4,
                  )}...${userAccount.address.slice(
                    userAccount.address.length - 4,
                    userAccount.address.length,
                  )}`,
                );
              }
            },
            (err: any) => {
              clogData('getAccount wallet connect - get user account err: ', err);
              if (err.code && err.code === 6) {
                clogData(`⚠️ User account disconnected!`, 'success');
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              } else {
                clog(`⚠️ something went wrong`);
              }
              reject(err);
            },
          );
        })
        .catch((err) => {
          clogData(`⚠️ something went wrong`, err);
        });
    });
  }

  public async getTokenBalance(address: string, tokenName: string): Promise<string | number> {
    return this.connectWallet
      .Contract(tokenName)
      .methods.balanceOf(address)
      .call()
      .then((balance: string | number) => {
        clogData('user data: ', { address, balance });
        return balance;
      });
  }

  public getAllowance(
    amount: string,
    from: string,
    address: string,
    tokenName: string,
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connectWallet
        .Contract(tokenName)
        .methods.allowance(from, address)
        .call()
        .then((allowance: string) => {
          const allow = new BigNumber(allowance);
          const allowed = allow.minus(amount);
          clogGroup(['allowance', allowance, amount, allowed.isNegative()], true);
          // eslint-disable-next-line no-unused-expressions
          allowed.isNegative() ? reject() : resolve(1);
        });
    });
  }
}

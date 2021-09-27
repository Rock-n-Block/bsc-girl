import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { ConnectWallet } from '@amfi/connect-wallet';
import { ContractWeb3 } from '@amfi/connect-wallet/dist/interface';
import WalletConnectProvider from '@walletconnect/web3-provider';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react';
import Web3 from 'web3';

import { blockchains, chain, connectWalletInfo, contracts } from '../../config';
import { rootStore } from '../../store/store';
import { clog, clogData, clogGroup, throwError } from '../../utils/logger';
import { userApi } from '../api';

const walletConnectContext = createContext<any>({
  connectorService: {},
  connect: (): void => {},
  disconnect: (): void => {},
});

@observer
class ConnectWalletService extends React.Component<any, any> {
  static calcTransactionAmount(amount: number | string, tokenDecimal: number) {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  private readonly connectWallet: ConnectWallet;

  private connector: any | undefined;

  constructor(props: any) {
    super(props);
    this.connectWallet = new ConnectWallet();
  }

  componentDidMount() {
    if (localStorage.connector && localStorage.bsc_token) {
      this.connect(localStorage.connector);
    }
  }

  public getContract = (name: string): ContractWeb3 => this.connectWallet.Contract(name);

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

  public async getAccount(account: { address?: string }): Promise<any> {
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

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  public connect = (providerName: string) => {
    try {
      this.initWalletConnect(providerName).then((isConnected: any) => {
        if (isConnected) {
          this.getAccount({
            address: rootStore.user.address,
          }).then((account: any) => {
            clogData('getAccount account:', account);
            this.getTokenBalance(account.address, 'BSCGIRL')
              .then((value: any) => {
                rootStore.user.setBalance(
                  new BigNumber(value).dividedBy(new BigNumber(10).pow(18)).toString(10),
                  'BSCGIRL',
                );
                this.getTokenBalance(account.address, 'BSCGIRLMOON').then((balance: any) => {
                  rootStore.user.setBalance(
                    new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toString(10),
                    'BSCGIRLMOON',
                  );
                });
              })
              .finally(async () => {
                if (!localStorage.bsc_token) {
                  const metMsg: any = await userApi.getMsg();

                  const signedMsg = await this.signMsg(metMsg.data, providerName, account.address);

                  const login: any = await userApi.login({
                    address: account.address,
                    msg: metMsg.data,
                    signedMsg,
                  });

                  localStorage.bsc_token = login.data.key;
                }
                localStorage.connector = providerName;
                rootStore.user.setAddress(account.address);
                await rootStore.user.getMe();
              });
          });
        } else {
          rootStore.user.disconnect();
        }
      });
    } catch (err) {
      throwError(`connect error: ${err}`);
    }
  };

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
    if (this.connector instanceof WalletConnectProvider) this.connector.disconnect();
    this.connectWallet.resetConect();
  }

  public Web3(): Web3 {
    return this.connectWallet.currentWeb3();
  }

  createTransaction(
    method: string,
    data: Array<any>,
    contract: 'BSCGIRL' | 'BSCGIRLMOON',
    tx?: any,
    tokenAddress?: string,
    walletAddress?: string,
    value?: any,
  ) {
    const transactionMethod = ConnectWalletService.getMethodInterface(
      contracts.contract[contract].chain[contracts.type].abi,
      method,
    );

    let signature;
    if (transactionMethod.inputs.length) {
      signature = this.encodeFunctionCall(transactionMethod, data);
    }

    if (tx) {
      tx.from = walletAddress || rootStore.user.address;
      tx.data = signature;

      return this.sendTransaction(tx);
    }
    return this.sendTransaction(walletAddress, {
      to: tokenAddress || contracts.contract[contract].chain[contracts.type].address,
      data: signature || '',
      value: value || '',
    });
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

  async totalSupply(tokenName: string) {
    const contract = this.getContract(tokenName);
    const totalSupply = await contract.methods.totalSupply().call();
    const decimals = contracts.contract[tokenName.toUpperCase()].params?.decimals ?? 18;

    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(decimals)).toString(10);
  }

  async checkNftTokenAllowance(tokenAddress: string, address: string) {
    const contract = new (this.Web3().eth.Contract)([], tokenAddress);

    return contract.methods
      .isApprovedForAll(address, contracts.contract.EXCHANGE.chain[contracts.type].address)
      .call();
  }

  async checkTokenAllowance(
    contractName: 'BSCGIRL' | 'BSCGIRLMOON',
    tokenDecimals: number,
    approvedAddress?: string,
    walletAddress?: string,
  ) {
    const contract = this.getContract(contractName);
    const walletAdr = walletAddress || rootStore.user.address;

    try {
      let result = await contract.methods
        .allowance(
          walletAdr,
          approvedAddress || contracts.contract[contractName].chain[contracts.type].address,
        )
        .call();

      const totalSupply = await this.totalSupply(contractName);

      result =
        result === '0'
          ? null
          : +new BigNumber(result).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
      return result && new BigNumber(result).minus(totalSupply).isPositive();
    } catch (error) {
      return false;
    }
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.Web3().eth.abi.encodeFunctionCall(abi, data);
  }

  async approveToken(
    contractName: 'BSCGIRL' | 'BSCGIRLMOON',
    tokenDecimals: number,
    approvedAddress?: string,
    walletAddress?: string,
  ) {
    try {
      const totalSupply = await this.totalSupply(contractName);

      const approveMethod = ConnectWalletService.getMethodInterface(
        contracts.contract[contractName].chain[contracts.type].abi,
        'approve',
      );

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        approvedAddress || walletAddress || rootStore.user.address,
        ConnectWalletService.calcTransactionAmount(totalSupply, tokenDecimals),
      ]);

      return this.sendTransaction(walletAddress, {
        to: contracts.contract[contractName].chain[contracts.type].address,
        data: approveSignature,
      });
    } catch (error) {
      return error;
    }
  }

  public sendTransaction(address?: string, transactionConfig?: any): Promise<any> {
    return this.Web3().eth.sendTransaction({
      ...transactionConfig,
      from: address || rootStore.user.address,
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

  render() {
    return (
      <walletConnectContext.Provider
        value={{
          connectorService: this,
          connect: this.connect,
          disconnect: this.disconnect,
        }}
      >
        {this.props.children}
      </walletConnectContext.Provider>
    );
  }
}

export default withRouter(ConnectWalletService);

export function useWalletConnectService(): any {
  return useContext(walletConnectContext);
}

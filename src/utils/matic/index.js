import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash/lang';
import config from '../../config';

export default class MetamaskService {
  constructor({ networkFrom, contractDetails }) {
    console.log('MetamaskService', contractDetails);
    this.name = 'metamask';
    this.wallet = window.ethereum;
    this.networkFrom = networkFrom;
    this.net = config.IS_PRODUCTION ? 'mainnet' : 'testnet';
    this.providers = {};
    this.Web3Provider = new Web3(this.wallet);
    this.wallet &&
      this.wallet.on('chainChanged', (newChain) => {
        localStorage.setItem('walletTypeOnReload', 'matic');
        window.location.reload();
      });
    this.wallet &&
      this.wallet.on('accountsChanged', (newAccounts) => {
        console.log('accountsChanged', newAccounts);
        localStorage.setItem('walletTypeOnReload', 'matic');
        const accounts = JSON.parse(localStorage.getItem('accounts'));
        if (!accounts || !isEqual(accounts.accounts, newAccounts)) {
          localStorage.setItem(
            'accounts',
            JSON.stringify({ accounts: newAccounts }),
          );
          window.location.reload();
        }
      });
    this.wallet &&
      this.wallet.on('disconnect', () => {
        console.log('Binance wallet disconnected');
        localStorage.setItem('walletTypeOnReload', 'matic');
        window.location.reload();
      });
    this.wallet &&
      this.wallet.on('message', (message) => {
        console.log('Metamask message', message);
      });
    this.contractAddressToken = contractDetails.ADDRESS.TOKEN[networkFrom];
    this.contractAddressSwap = contractDetails.ADDRESS.SWAP[networkFrom];
    this.contractAbiToken = contractDetails.ABI.TOKEN[networkFrom];
    this.contractAbiSwap = contractDetails.ABI.SWAP[networkFrom];
    this.contractDecimals = contractDetails.DECIMALS.TOKEN[networkFrom];
  }

  getContractAddressToken() {
    return this.contractAddressToken;
  }

  async getAccount() {
    if (!this.wallet)
      return { errorMsg: `${this.name} wallet is not injected` };
    return new Promise(async (resolve, reject) => {
      const usedNet = config.chainIds[this.net].Matic.id;
      const netVersion = await this.wallet.request({ method: 'eth_chainId' });
      const neededNetName = config.chainIds[this.net].Matic.name;
      console.log('getAccount netVersion', netVersion);
      const messagePleaseChooseNet = () =>
        reject({
          errorMsg: `Please choose ${neededNetName} network in your metamask wallet`,
        });
      const getAccounts = () =>
        this.wallet
          .request({ method: 'eth_requestAccounts' })
          .then((account) =>
            resolve({
              address: account[0],
              network: netVersion,
            }),
          )
          .catch((_) => reject({ errorMsg: 'Not authorized' }));
      if (!netVersion || netVersion === null) {
        this.wallet
          .request({ method: 'eth_chainId' })
          .then((netVersion) => {
            if (usedNet.includes(netVersion)) {
              getAccounts();
            } else {
              messagePleaseChooseNet();
            }
          })
          .catch(() => reject({ errorMsg: 'Not authorized' }));
      } else {
        if (usedNet.includes(netVersion)) {
          getAccounts();
        } else {
          messagePleaseChooseNet();
        }
      }
    });
  }

  getContract(abi, address) {
    return new this.Web3Provider.eth.Contract(abi, address);
  }

  validateAddress(address) {
    return this.Web3Provider.utils.isAddress(address);
  }

  transferToOtherBlockchain = ({
    userAddress,
    blockchain,
    amount,
    receiver,
    callback,
  }) => {
    debugger;
    const approveMethod = this.getMethodInterface(
      'transferToOtherBlockchain',
      this.contractAbiSwap,
    );
    const approveSignature = this.encodeFunctionCall(approveMethod, [
      `0x${blockchain}`,
      new BigNumber(+amount)
        .times(Math.pow(10, this.contractDecimals))
        .toString(10),
      receiver,
    ]);
    const approveTransaction = () => {
      // gasPrice: 20 * 10e8 = 20 Gwei = 20 000 000 000 wei
      const gasPrice =
        this.networkFrom === 'Binance-Smart-Chain'
          ? this.Web3Provider.utils.toHex('20000000000')
          : undefined;
      return this.sendTransaction(
        {
          from: userAddress,
          to: this.contractAddressSwap,
          data: approveSignature,
          gasPrice,
        },
        callback,
      );
    };
    const transaction = {
      title: 'transferToOtherBlockchain',
      to: this.contractAddressSwap,
      data: approveSignature,
      action: approveTransaction,
      onComplete: callback,
    };
    this.createTransactionObj(transaction, userAddress);
  };

  approveToken = (walletAddress, tokenAddress, amount, callback) => {
    const approveMethod = this.getMethodInterface(
      'approve',
      this.contractAbiToken,
    );
    const approveSignature = this.encodeFunctionCall(approveMethod, [
      tokenAddress,
      new BigNumber(amount)
        .times(Math.pow(10, this.contractDecimals))
        .toString(10),
    ]);
    const approveTransaction = () => {
      // gasPrice: 20 * 10e8 = 20 Gwei = 20 000 000 000 wei
      const gasPrice =
        this.networkFrom === 'Binance-Smart-Chain'
          ? this.Web3Provider.utils.toHex('20000000000')
          : undefined;
      return this.sendTransaction(
        {
          from: walletAddress,
          to: this.contractAddressToken,
          data: approveSignature,
          gasPrice,
        },
        callback,
      );
    };
    const transaction = {
      title: 'Authorise the contract, approving tokens',
      to: this.contractAddressToken,
      data: approveSignature,
      action: approveTransaction,
      onComplete: callback,
    };
    this.createTransactionObj(transaction, walletAddress);
  };

  sendTx = async (methodName, addressFrom, data, amount) => {
    try {
      const method = this.getMethodInterface(methodName, this.contractAbiToken);
      const signature = this.encodeFunctionCall(method, data);
      const params = {
        from: addressFrom,
        to: this.contractAddressToken,
        value: amount,
        data: signature,
      };
      const txHash = await this.wallet.request({
        method: 'eth_sendTransaction',
        params: [params],
      });
      const txReceipt = new Promise((resolve, reject) => {
        const trxSubscription = setInterval(() => {
          this.Web3Provider.eth.getTransactionReceipt(
            txHash,
            (error, transaction) => {
              if (transaction) {
                if (transaction.status) {
                  resolve(transaction);
                } else {
                  reject(error);
                }
                clearInterval(trxSubscription);
              }
              if (error) {
                clearInterval(trxSubscription);
              }
            },
          );
        }, 1000);
      });
      return await txReceipt;
    } catch (e) {
      console.error(e);
    }
  };

  encodeFunctionCall(abi, data) {
    return this.Web3Provider.eth.abi.encodeFunctionCall(abi, data);
  }

  getMethodInterface(methodName, abi) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  prepareTransaction(wallet, transaction) {
    transaction.action(wallet);
  }

  createTransactionObj(transaction, walletAddress) {
    this.prepareTransaction(
      {
        type: 'metamask',
        address: walletAddress,
      },
      transaction,
    );
  }

  sendTransaction(transactionConfig, callback, errCallback) {
    this.wallet
      .request({
        method: 'eth_sendTransaction',
        params: [transactionConfig],
      })
      .then((res) => {
        // if (callback) setTimeout(() => {
        //   callback({status:'SUCCESS',data:res})
        // }, 5000)
        callback({ status: 'SUCCESS', data: res });
      })
      .catch((error) => {
        console.log(error, 'error');
        callback({ status: 'ERROR', error });
      });
  }

  async checkPending({ hash }) {
    try {
      return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const block = await this.Web3Provider.eth.getBlock('latest');
            const transactions = block.transactions;
            if (transactions.includes(hash)) {
              console.log('checkPending', block);
              clearInterval(interval);
              resolve({ status: 'SUCCESS', data: true });
            }
          } catch (e) {
            console.error(e);
            clearInterval(interval);
            resolve({ status: 'ERROR', error: e });
          }
        }, 500);
      });
    } catch (e) {
      console.error(e);
    }
  }
}

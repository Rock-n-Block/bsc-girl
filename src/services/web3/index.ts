import BigNumber from 'bignumber.js/bignumber';
import { Observable } from 'rxjs';
import Web3 from 'web3';

// import config from './config';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface INetworks {
  [key: string]: string;
}

interface IMetamaskService {
  testnet: 'ropsten' | 'kovan' | 'rinkeby';
  isProduction?: boolean;
}

const networks: INetworks = {
  eth: '0x1',
  bnb: '0x38',
  matic: '0x89',
};

const testNetworks: INetworks = {
  kovan: '0x2a',
  bnb: '0x61',
  matic: '0x13881',
};

export default class MetamaskService {
  public wallet;

  public web3Provider;

  private testnet: string;

  private isProduction: boolean;

  public walletAddress = '';

  public chainChangedObs: any;

  public accountChangedObs: any;

  public usedNetwork: string;

  public usedChain: string;

  constructor({ testnet, isProduction = false }: IMetamaskService) {
    this.wallet = window.ethereum;
    this.web3Provider = new Web3(this.wallet);
    this.testnet = testnet;
    this.isProduction = isProduction;

    this.usedNetwork = this.isProduction ? 'mainnet' : 'testnet';
    this.usedChain = this.isProduction ? networks[this.testnet] : testNetworks[this.testnet];

    this.chainChangedObs = new Observable((subscriber) => {
      this.wallet.on('chainChanged', () => {
        const currentChain = this.wallet.chainId;

        if (currentChain !== this.usedChain) {
          subscriber.next(`Please choose ${this.usedNetwork} network in metamask wallet.`);
        } else {
          subscriber.next('');
        }
      });
    });

    this.accountChangedObs = new Observable((subscriber) => {
      this.wallet.on('accountsChanged', () => {
        subscriber.next();
      });
    });
    // this.wallet.on('connect', () => {
    //   console.log('connect');
    // });
    // this.wallet.on('disconnect', () => {
    //   console.log('disconnect');
    // });
  }

  ethRequestAccounts() {
    return this.wallet.request({ method: 'eth_requestAccounts' });
  }

  public connect() {
    const currentChain = this.wallet.chainId;

    return new Promise((resolve, reject) => {
      if (!this.wallet) {
        reject(new Error(`metamask wallet is not injected`));
      }

      if (!currentChain) {
        this.wallet
          .request({ method: 'eth_chainId' })
          .then((resChain: any) => {
            if (resChain === this.usedChain) {
              this.ethRequestAccounts()
                .then((account: any) => {
                  [this.walletAddress] = account;
                  resolve({
                    address: account[0],
                    network: resChain,
                  });
                })
                .catch(() => reject(new Error('Not authorized')));
            } else {
              reject(new Error(`Please choose ${this.usedNetwork} network in metamask wallet`));
            }
          })
          .catch(() => reject(new Error('Not authorized')));
      } else if (currentChain === this.usedChain) {
        this.ethRequestAccounts()
          .then((account: any) => {
            [this.walletAddress] = account;
            resolve({
              address: account[0],
              network: currentChain,
            });
          })
          .catch(() => reject(new Error('Not authorized')));
      } else {
        reject(new Error(`Please choose ${this.usedNetwork} network in metamask wallet.`));
      }
    });
  }

  getContract(tokenAddress: string, abi: Array<any>) {
    return new this.web3Provider.eth.Contract(abi, tokenAddress);
  }

  getEthBalance() {
    return this.web3Provider.eth.getBalance(this.walletAddress);
  }

  // getWethBalance() {
  //   const contractAbi = 'WETH';
  //   const contract = this.getContract(config[contractAbi].ADDRESS, config[contractAbi].ABI);
  //   return contract.methods.balanceOf(this.walletAddress).call();
  // }

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.web3Provider.eth.abi.encodeFunctionCall(abi, data);
  }

  async totalSupply(tokenAddress: string, abi: Array<any>, tokenDecimals: number) {
    const contract = this.getContract(tokenAddress, abi);
    const totalSupply = await contract.methods.totalSupply().call();

    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  // async checkNftTokenAllowance(tokenAddress: string) {
  //   const contract = this.getContract(tokenAddress, config.NFT.ABI);
  //
  //   const result = await contract.methods
  //     .isApprovedForAll(this.walletAddress, config.EXCHANGE.ADDRESS)
  //     .call();
  //
  //   return result;
  // }

  // async checkTokenAllowance(
  //   contractName: 'WETH',
  //   tokenDecimals: number,
  //   approvedAddress?: string,
  //   walletAddress?: string,
  // ) {
  //   const contract = this.getContract(config[contractName].ADDRESS, config[contractName].ABI);
  //   const walletAdr = walletAddress || this.walletAddress;
  //
  //   try {
  //     let result = await contract.methods
  //       .allowance(walletAdr, approvedAddress || config[contractName].ADDRESS)
  //       .call();
  //
  //     const totalSupply = await this.totalSupply(
  //       config[contractName].ADDRESS,
  //       config[contractName].ABI,
  //       tokenDecimals,
  //     );
  //
  //     result =
  //       result === '0'
  //         ? null
  //         : +new BigNumber(result).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  //     if (result && new BigNumber(result).minus(totalSupply).isPositive()) {
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     return false;
  //   }
  // }

  // async approveToken(
  //   contractName: 'WETH',
  //   tokenDecimals: number,
  //   approvedAddress?: string,
  //   walletAddress?: string,
  // ) {
  //   try {
  //     const totalSupply = await this.totalSupply(
  //       config[contractName].ADDRESS,
  //       config[contractName].ABI,
  //       tokenDecimals,
  //     );
  //
  //     const approveMethod = MetamaskService.getMethodInterface(config[contractName].ABI, 'approve');
  //
  //     const approveSignature = this.encodeFunctionCall(approveMethod, [
  //       approvedAddress || walletAddress || this.walletAddress,
  //       MetamaskService.calcTransactionAmount(totalSupply, tokenDecimals),
  //     ]);
  //
  //     return this.sendTransaction({
  //       from: walletAddress || this.walletAddress,
  //       to: config[contractName].ADDRESS,
  //       data: approveSignature,
  //     });
  //   } catch (error) {
  //     return error;
  //   }
  // }

  static calcTransactionAmount(amount: number | string, tokenDecimal: number) {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  // createTransaction(
  //   method: string,
  //   data: Array<any>,
  //   contract: 'NFT' | 'BEP20' | 'WETH',
  //   tx?: any,
  //   tokenAddress?: string,
  //   walletAddress?: string,
  //   value?: any,
  // ) {
  //   const transactionMethod = MetamaskService.getMethodInterface(config[contract].ABI, method);
  //
  //   let signature;
  //   if (transactionMethod.inputs.length) {
  //     signature = this.encodeFunctionCall(transactionMethod, data);
  //   }
  //
  //   if (tx) {
  //     tx.from = walletAddress || this.walletAddress;
  //     tx.data = signature;
  //
  //     return this.sendTransaction(tx);
  //   }
  //   return this.sendTransaction({
  //     from: walletAddress || this.walletAddress,
  //     to: tokenAddress || config[contract].ADDRESS,
  //     data: signature || '',
  //     value: value || '',
  //   });
  // }

  signMsg(msg: string) {
    return this.web3Provider.eth.personal.sign(msg, this.walletAddress, '');
  }

  sendTransaction(transactionConfig: any) {
    return this.web3Provider.eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
    });
  }
}

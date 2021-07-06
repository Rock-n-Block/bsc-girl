import React, { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  BinanceService,
  ContractService,
  MetamaskService,
  BackendService,
  MaticService,
} from '../../utils';
import { userActions, modalActions, walletActions } from '../../redux/actions';

const contractContext = createContext({
  walletService: null,
  contractService: null,
});

const backendService = new BackendService();

const ContractProvider = ({ children }) => {
  const [walletService, setWalletService] = React.useState(null);
  const [contractService, setContractService] = React.useState(null);
  const [contractDetails, setContractDetails] = React.useState(null);

  const dispatch = useDispatch();
  const setUserData = (data) => dispatch(userActions.setUserData(data));
  const toggleModal = (data) => dispatch(modalActions.toggleModal(data));
  const setWalletDex = (data) => dispatch(walletActions.setWalletDex(data));
  const { walletType, networkFrom, networkTo } = useSelector(({ wallet }) => ({
    walletType: wallet.type,
    networkFrom: wallet.networkFrom,
    networkTo: wallet.networkTo,
  }));
  const loginMatic = async () => {
    try {
      console.log('loginMetamask', networkFrom, contractDetails);
      const wallet = new MaticService({
        networkFrom,
        contractDetails,
      });
      setContractService(
        new ContractService({
          wallet,
          networkFrom,
          contractDetails,
        }),
      );
      setWalletService(wallet);
      const account = await wallet.getAccount();
      setUserData(account);
    } catch (e) {
      console.error(e);
      if (!e.errorMsg || e.errorMsg === '') {
        toggleModal({
          isOpen: true,
          text: (
            <div>
              <p>Metamask extension is not found.</p>
              <p>
                You can install it from{' '}
                <a href="https://metamask.io" target="_blank">
                  metamask.io
                </a>
              </p>
            </div>
          ),
        });
      } else {
        toggleModal({ isOpen: true, text: e.errorMsg });
      }
    }
  };

  const loginMetamask = async () => {
    try {
      console.log('loginMetamask', networkFrom, contractDetails);
      const wallet = new MetamaskService({
        networkFrom,
        contractDetails,
      });
      await window.ethereum.enable();
      setContractService(
        new ContractService({
          wallet,
          networkFrom,
          contractDetails,
        }),
      );
      setWalletService(wallet);
      const account = await wallet.getAccount();
      setUserData(account);
    } catch (e) {
      console.error(e);
      if (!e.errorMsg || e.errorMsg === '') {
        toggleModal({
          isOpen: true,
          text: (
            <div>
              <p>Metamask extension is not found.</p>
              <p>
                You can install it from{' '}
                <a href="https://metamask.io" target="_blank">
                  metamask.io
                </a>
              </p>
            </div>
          ),
        });
      } else {
        toggleModal({ isOpen: true, text: e.errorMsg });
      }
    }
  };

  const loginBinance = async (interval) => {
    try {
      console.log('loginBinance', networkFrom);
      const wallet = new BinanceService({
        networkFrom,
        contractDetails,
      });
      setContractService(
        new ContractService({
          wallet,
          networkFrom,
          contractDetails,
        }),
      );
      setWalletService(wallet);
      const account = await wallet.getAccount();
      setUserData(account);
    } catch (e) {
      console.error(e);
      if (!e.errorMsg || e.errorMsg === '') {
        toggleModal({
          isOpen: true,
          text: (
            <div>
              <p>Binance Chain Wallet is not found.</p>
              <p>
                You can install it from{' '}
                <a href="https://www.binance.org" target="_blank">
                  binance.org
                </a>
              </p>
            </div>
          ),
        });
      } else {
        toggleModal({ isOpen: true, text: e.errorMsg });
      }
    }
  };

  const getDex = async () => {
    try {
      const resultGetDex = await backendService.getDex();
      const dex = resultGetDex.data;
      setWalletDex(dex);
      console.log('resultGetDex', resultGetDex.data);
      if (!dex)
        return dispatch(
          modalActions.toggleModal({
            isOpen: true,
            text: 'Server is offline',
          }),
        );
      if (dex && !dex[0])
        return dispatch(
            modalActions.toggleModal({
              isOpen: true,
              text: 'Server is offline',
            }),
        );
      const binanceSmartChain = dex.filter(
          (item) => item.network === 'Binance-Smart-Chain',
      )[0];
      const ethereumChain = dex.filter(
          (item) => item.network === 'Ethereum',
      )[0];
      const maticChain = dex.filter((item) => item.network === 'Matic')[0];
      let contractDetails = {
        ADDRESS: {
          TOKEN: {
            Ethereum: ethereumChain.token_address,
            'Binance-Smart-Chain': binanceSmartChain.token_address,
            Matic: maticChain.token_address,
          },
          SWAP: {
            Ethereum: ethereumChain.swap_address,
            'Binance-Smart-Chain': binanceSmartChain.swap_address,
            Matic: maticChain.swap_address,
          },
          FEE: {
            Ethereum: ethereumChain.fee_address,
            'Binance-Smart-Chain': binanceSmartChain.fee_address,
            Matic: maticChain.fee_address,
          },
        },
        DECIMALS: {
          TOKEN: {
            Ethereum: ethereumChain.decimals,
            'Binance-Smart-Chain': binanceSmartChain.decimals,
            Matic: maticChain.decimals,
          },
          SWAP: {
            Ethereum: ethereumChain.decimals,
            'Binance-Smart-Chain': binanceSmartChain.decimals,
            Matic: maticChain.decimals,
          },
        },
        ABI: {
          TOKEN: {
            Ethereum: ethereumChain.token_abi,
            'Binance-Smart-Chain': binanceSmartChain.token_abi,
            Matic: maticChain.token_abi,
          },
          SWAP: {
            Ethereum: ethereumChain.swap_abi,
            'Binance-Smart-Chain': binanceSmartChain.swap_abi,
            Matic: maticChain.swap_abi,
          },
        },
      };
      setContractDetails(contractDetails);
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    console.log('ContractContext useEffect walletType', walletType);
    (async () => {
      await getDex();
    })();
  }, [walletType]);

  React.useEffect(() => {
    console.log('ContractContext useEffect contractDetails', contractDetails);
    if (!contractDetails) return;
    (async () => {
      const walletTypeOnReload = localStorage.getItem('walletTypeOnReload');
      if (walletType === 'metamask' || walletTypeOnReload === 'metamask') {
        loginMetamask();
      } else if (walletType === 'binance' || walletTypeOnReload === 'binance') {
        loginBinance();
      } else if (walletType === 'matic' || walletTypeOnReload === 'matic') {
        loginMatic();
      }
      localStorage.setItem('walletTypeOnReload', '');
    })();
  }, [contractDetails]);

  return (
    <contractContext.Provider value={{ walletService, contractService }}>
      {children}
    </contractContext.Provider>
  );
};

export default ContractProvider;

export function useContractContext() {
  return useContext(contractContext);
}

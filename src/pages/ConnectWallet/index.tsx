import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import Metamask from '../../assets/img/icons/metamask-logo.svg';
import WalletConnect from '../../assets/img/icons/wallet-connect-logo.svg';
import { userApi } from '../../services/api';
import { ConnectWalletService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';

import './ConnectWallet.scss';

const ConnectWalletPage: React.FC = observer(() => {
  const { user } = useMst();
  const walletConnector = new ConnectWalletService();

  const connectWallet = async (providerName: string): Promise<void> => {
    walletConnector.initWalletConnect(providerName).then((isConnected) => {
      if (isConnected) {
        walletConnector.getAccount(user.address).then((account: any) => {
          walletConnector
            .getTokenBalance(account.address, 'BSCGIRLToken')
            .then((value: any) => {
              account.balance = value;
            })
            .finally(async () => {
              clogData('user account: ', account);
              const metMsg: any = await userApi.getMsg();

              const signedMsg = await walletConnector.signMsg(
                metMsg.data,
                providerName,
                account.address,
              );

              const login: any = await userApi.login({
                address: account.address,
                msg: metMsg.data,
                signedMsg,
              });

              localStorage.bsc_token = login.data.key;
              user.setAddress(account.address);
              user.setBalance(account.balance, 'BSCGIRL');
              user.getMe();
            });

          // store.addContract('Staking', connect.getContract('Staking'));
          // store.addContract('Token', connect.getContract('Token'));
          // store.addContract('UsdtToken', connect.getContract('UsdtToken'));
          // store.addContract('Presale', connect.getContract('Presale'));
          // store.setWeb3(connect.Web3);
        });
      } else {
        user.disconnect();
      }
    });
  };

  return (
    <div className="container">
      <div className="connect">
        <div className="connect__title">
          <Link to="/">
            <img src={ArrowLeftRed} alt="arrow left soft-red" className="link-red" />
            <img src={ArrowLeftBlack} alt="arrow left black" className="link-black" />
          </Link>
          Connect your wallet
        </div>
        <div className="connect__description">
          Connect with one of available wallet providers or create a new wallet
          <br />
          <a href="/">What is wallet?</a>
        </div>
        <div className="connect__buttons">
          <button
            type="button"
            className="connect__buttons__item"
            onClick={() => connectWallet('MetaMask')}
          >
            <img src={Metamask} alt="Metamask logo" className="metamask" />
            Metamask
          </button>
          <button
            type="button"
            className="connect__buttons__item"
            onClick={() => connectWallet('WalletConnect')}
          >
            <img src={WalletConnect} alt="WalletConnect logo" className="connectWallet" />
            WalletConnect
          </button>
        </div>
        <div className="connect__footer">
          We do not own your private keys and cannot access your funds without your confirmation.
        </div>
      </div>
    </div>
  );
});

export default ConnectWalletPage;

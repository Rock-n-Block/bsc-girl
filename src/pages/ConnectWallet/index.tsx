import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import Metamask from '../../assets/img/icons/metamask-logo.svg';
import WalletConnect from '../../assets/img/icons/wallet-connect-logo.svg';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';

import './ConnectWallet.scss';

const ConnectWalletPage: React.FC = observer(() => {
  const walletConnector = useWalletConnectService();
  const history = useHistory();
  const { user } = useMst();

  const connectWallet = async (providerName: string): Promise<void> => {
    walletConnector.connect(providerName);
    if (user.address) history.push(`/profile/${user.id}`);
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

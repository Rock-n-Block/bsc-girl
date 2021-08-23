import React from 'react';
import { Link } from 'react-router-dom';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import Metamask from '../../assets/img/icons/metamask-logo.svg';
import WalletConnect from '../../assets/img/icons/wallet-connect-logo.svg';

import './ConnectWallet.scss';

const ConnectWalletPage: React.FC = () => {
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
          <div className="connect__buttons__item">
            <img src={Metamask} alt="Metamask logo" className="metamask" />
            Metamask
          </div>
          <div className="connect__buttons__item">
            <img src={WalletConnect} alt="WalletConnect logo" className="connectWallet" />
            WalletConnect
          </div>
        </div>
        <div className="connect__footer">
          We do not own your private keys and cannot access your funds without your confirmation.
        </div>
      </div>
    </div>
  );
};

export default ConnectWalletPage;

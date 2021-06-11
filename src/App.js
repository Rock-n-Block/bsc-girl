import React from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import Form from './components/Form';
import Modal from './components/Modal';
import bg from './assets/images/bg.svg';
import config from './config';
import { useSelector } from 'react-redux';

const App = React.memo(() => {
  const { dex } = useSelector(({ wallet }) => wallet);

  const formatTokenLink = (network) => {
    if (!dex) return '';
    const token = dex.tokens.filter((item) => item.network === network)[0];
    return network === 'Binance-Chain'
      ? 'https://explorer.binance.org/asset/WISH-2D5'
      : config.tokenLinks()[
          network === 'Ethereum'
            ? 'ethereum'
            : network === 'Binance-Smart-Chain'
            ? 'binanceSmartChain'
            : 'binanceChain'
        ] + `/token/${token.token_address}`;
  };

  return (
    <div className="App">
      <Header />
      <div className="App-container">
        <div className="body">
          <Form />
        </div>

        <Footer />
        <Modal />
      </div>
    </div>
  );
});

export default App;

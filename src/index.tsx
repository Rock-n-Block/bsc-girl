// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import ConnectWalletService from './services/connectwallet';
import { Provider, rootStore } from './store/store';
import ScrollToTop from './utils/ScrollToTop';
import { App } from './App';

ReactDOM.render(
  <Provider value={rootStore}>
    <Router>
      <ScrollToTop>
        <ConnectWalletService>
          <App />
        </ConnectWalletService>
      </ScrollToTop>
    </Router>
  </Provider>,
  document.getElementById('root'),
);

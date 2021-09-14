// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider, rootStore } from './store/store';
import ScrollToTop from './utils/ScrollToTop';
import { App } from './App';

ReactDOM.render(
  <Provider value={rootStore}>
    <Router>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </Router>
  </Provider>,
  document.getElementById('root'),
);

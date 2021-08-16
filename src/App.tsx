import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Footer, Header } from './components';
import { HomePage, TokenPage } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/home">
          <HomePage />
        </Route>
        <Route path="/token">
          <TokenPage />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

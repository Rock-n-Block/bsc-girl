import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Header } from './components';
import { HomePage } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </Router>
  );
};

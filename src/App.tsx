import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import './styles/index.scss';

import {HomePage} from './pages';
import {Header} from './components';

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

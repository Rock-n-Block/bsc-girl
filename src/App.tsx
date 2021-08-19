import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Footer, Header } from './components';
import { CreateCollectiblePage, CreatePage, HomePage, ProfilePage, TokenPage } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  const [collectible, setCollectible] = useState('');

  const chooseCollectible = (value: string) => {
    setCollectible(value);
  };

  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/token">
          <TokenPage />
        </Route>
        <Route path="/profile">
          <ProfilePage />
        </Route>
        <Route path="/create">
          <CreatePage chooseCollectible={chooseCollectible} />
        </Route>
        <Route path={`/create-${collectible}`}>
          <CreateCollectiblePage collectible={collectible} />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

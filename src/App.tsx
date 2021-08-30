import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Provider } from 'mobx-react';

import { rootStore } from './store/store';

import { Footer, Header } from './components';

import {
  ConnectWalletPage,
  CreateCollectiblePage,
  CreatePage,
  EditProfilePage,
  HomePage,
  ProfilePage,
  TokenPage,
} from './pages';

import './styles/index.scss';
import Connector from "./services/walletConnect";

export const App: React.FC = () => {
  const [collectible, setCollectible] = useState('');

  const chooseCollectible = (value: string) => {
    setCollectible(value);
  };

  return (
    <Provider value={rootStore}>
      <Router>
        <Connector>
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
            <Route path={`/create/${collectible}`}>
              <CreateCollectiblePage collectible={collectible} />
            </Route>
            <Route path="/edit-profile">
              <EditProfilePage />
            </Route>
            <Route path="/connect">
              <ConnectWalletPage />
            </Route>
          </Switch>
          <Footer />
        </Connector>
      </Router>
    </Provider>
  );
};

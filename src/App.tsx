import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';

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

export const App: React.FC = () => {
  const [collectible, setCollectible] = useState('');

  const chooseCollectible = (value: string) => {
    setCollectible(value);
  };

  return (
    <div className="bsc-girl">
      <Header />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/token/:tokenId">
          <TokenPage />
        </Route>
        <Route exact path="/profile/:userId">
          <ProfilePage />
        </Route>
        <Route exact path="/create">
          <CreatePage chooseCollectible={chooseCollectible} />
        </Route>
        <Route exact path={`/create-${collectible}`}>
          <CreateCollectiblePage collectible={collectible} />
        </Route>
        <Route exact path="/edit-profile">
          <EditProfilePage />
        </Route>
        <Route exact path="/connect">
          <ConnectWalletPage />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
};

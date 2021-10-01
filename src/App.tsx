import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ErrorModal, Footer, Header, InfoModal } from './components';
import {
  ConnectWalletPage,
  CreateCollectiblePage,
  CreatePage,
  EditProfilePage,
  HomePage,
  ProfilePage,
  SearchPage,
  StakingPage,
  TokenPage,
} from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
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
          <CreatePage />
        </Route>
        <Route exact path="/create/single">
          <CreateCollectiblePage isSingle />
        </Route>
        <Route exact path="/create/multiple">
          <CreateCollectiblePage isSingle={false} />
        </Route>
        <Route exact path="/edit-profile">
          <EditProfilePage />
        </Route>
        <Route exact path="/connect">
          <ConnectWalletPage />
        </Route>
        <Route exact path="/search">
          <SearchPage />
        </Route>
        <Route exact path="/staking">
          <StakingPage />
        </Route>
      </Switch>
      <Footer />
      <ErrorModal />
      <InfoModal />
    </div>
  );
};

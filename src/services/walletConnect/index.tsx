import React, { createContext, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { rootStore } from '../../store/store';
// import { userApi } from '../api';
import MetamaskService from '../web3';

const walletConnectorContext = createContext<any>({
  MetamaskService: {},
  connect: (): void => {},
});

@observer
class Connector extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      provider: new MetamaskService({
        testnet: 'kovan',
        isProduction: false,
      }),
    };

    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  componentDidMount() {
    const self = this;
    if (window.ethereum) {
      if (localStorage.bsc_metamask) {
        this.connect();
      }

      this.state.provider.chainChangedObs.subscribe({
        next(err: string) {
          // rootStore.modals.metamask.setErr(err);
          console.log('Chain change obs:', err);
        },
      });

      this.state.provider.accountChangedObs.subscribe({
        next() {
          self.disconnect();
        },
      });
    }
  }

  connect = async () => {
    if (window.ethereum) {
      try {
        const { address } = await this.state.provider.connect();

        rootStore.user.setAddress(address);
        localStorage.bsc_metamask = true;

        // if (!localStorage.bsc_token) {
        //   // const metMsg: any = await userApi.getMsg();
        //
        //   // const signedMsg = await this.state.provider.signMsg(metMsg.data);
        //
        //   // const login: any = await userApi.login({
        //   //   address,
        //   //   msg: metMsg.data,
        //   //   signedMsg,
        //   // });
        //
        //   // localStorage.bsc_token = login.data.key;
        //   rootStore.user.setAddress(address);
        //   localStorage.bsc_metamask = true;
        // } else {
        //   rootStore.user.setAddress(address);
        //   localStorage.bsc_metamask = true;
        // }
        // rootStore.user.getMe();
      } catch (err) {
        // rootStore.modals.metamask.setErr(err.message);
        console.log('Metamask connect error:', err);
        this.disconnect();
      }
    } else {
      // rootStore.modals.metamask.setErr('No Metamask (or other Web3 Provider) installed');
      console.log('No Metamask (or other Web3 Provider) installed');
    }
  };

  disconnect() {
    rootStore.user.disconnect();

    if (
      ['/create/single', '/create/multiple', '/profile', '/create'].includes(
        this.props.location.pathname,
      )
    ) {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <walletConnectorContext.Provider
        value={{
          metamaskService: this.state.provider,
          connect: this.connect,
          disconnect: this.disconnect,
        }}
      >
        {this.props.children}
      </walletConnectorContext.Provider>
    );
  }
}

export default withRouter(Connector);

export function useWalletConnectorContext() {
  return useContext(walletConnectorContext);
}

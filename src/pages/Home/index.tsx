import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import Loader from '../../assets/img/icons/loader.svg';
import { Explore, Popular, Preview, ProfileCollectibles } from '../../components';
import { storeApi } from '../../services/api';
import { useMst } from '../../store/store';
import { IToken } from '../../types';

import './Home.scss';

const Home: React.FC = observer(() => {
  const { user } = useMst();
  const [isLoading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [advTokens, setAdvTokens] = useState<IToken[]>([]);

  useEffect(() => {
    if (user.address) {
      setLoading(true);
      storeApi.getCollectibles(user.address, 1).then(({ data }) => {
        setTokens(data);
        setLoading(false);
      });
    }
  }, [user.address]);

  useEffect(() => {
    storeApi.getFavorites().then((res: any) => {
      setAdvTokens(res.data);
    });
  }, []);

  return (
    <div>
      <div className="gradient-bg" />
      <div className="home">
        <Preview tokens={advTokens} isLoading={isLoading} />
        <div className="container" id="my-items">
          {isLoading ? (
            <div className="loading">
              Loading&nbsp;
              <img src={Loader} alt="loader" />
            </div>
          ) : (
            <div className="cards">
              <ProfileCollectibles tokens={tokens} isLoading={isLoading} />
            </div>
          )}
        </div>
        <Popular />
        <div id="explore">
          <Explore />
        </div>
      </div>
    </div>
  );
});

export default Home;

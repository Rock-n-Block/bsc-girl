import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Explore, Preview, ProfileCollectibles } from '../../components';
// import { populars } from '../../data';
import { storeApi } from '../../services/api';
import { useMst } from '../../store/store';
import { IToken } from '../../types';

import './Home.scss';

const Home: React.FC = observer(() => {
  const { user } = useMst();
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [advTokens, setAdvTokens] = useState<IToken[]>([]);

  useEffect(() => {
    const array: IToken[] = [];
    if (user.address)
      storeApi.getCollectibles(user.address, 1).then(({ data }) => {
        // eslint-disable-next-line array-callback-return
        data.map((token: any) => {
          if (token.selling) array.push(token);
        });
        setTokens(data);
        setAdvTokens(array);
      });
  }, [user.address]);

  return (
    <div>
      <div className="gradient-bg" />
      <div className="home">
        <Preview tokens={advTokens} />
        <div className="container" id="my-items">
          <div className="cards">
            <ProfileCollectibles tokens={tokens} />
          </div>
        </div>
        {/* <Popular items={populars} /> */}
        <div id="explore">
          <Explore />
        </div>
      </div>
    </div>
  );
});

export default Home;

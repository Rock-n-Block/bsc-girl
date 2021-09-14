import React from 'react';
import { observer } from 'mobx-react-lite';

import { Collections, Popular, Preview } from '../../components';
import { collections, populars, users } from '../../data';

import './Home.scss';

const Home: React.FC = observer(() => {
  return (
    <div>
      <div className="gradient-bg" />
      <div className="home">
        <Preview users={users} />
        {/* <div className="container"> */}
        {/*   <div className="cards"> */}
        {/*     <ProfileCollectibles cards={tokens} /> */}
        {/*   </div> */}
        {/* </div> */}
        <Popular items={populars} />
        <div className="gradient-bg-2" />
        <Collections items={collections} />
        {/* <Explore /> */}
      </div>
    </div>
  );
});

export default Home;

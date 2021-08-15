import React from 'react';

import { Collections, HomeCard, Popular, Preview } from '../../components';
import { cards, collections, populars, users } from '../../data';

import './Home.scss';

const Home: React.FC = () => {
  return (
    <div>
      <div className="gradient-bg" />
      <div className="home">
        <Preview users={users} />
        <div className="container">
          <div className="cards">
            {cards.map((card) => (
              <HomeCard users={users} img={card.img} title={card.title} price={card.price} />
            ))}
          </div>
        </div>
        <Popular items={populars} />
        <div className="gradient-bg-2" />
        <Collections items={collections} />
      </div>
    </div>
  );
};

export default Home;

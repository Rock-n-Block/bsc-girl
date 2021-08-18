import React from 'react';

import { Collections, Explore, TokenCard, Popular, Preview } from '../../components';
import { cards, collections, exploreItems, populars, sortItems, users } from '../../data';

import './Home.scss';

const Home: React.FC = () => {
  return (
    <div>
      <div className="gradient-bg" />
      <div className="home">
        <Preview users={users} />
        <div className="container">
          <div className="cards">
            <div className="scroll">
              {cards.map((card) => (
                <TokenCard users={users} img={card.img} title={card.title} price={card.price} />
              ))}
            </div>
          </div>
        </div>
        <Popular items={populars} />
        <div className="gradient-bg-2" />
        <Collections items={collections} />
        <Explore exploreItems={exploreItems} sortItems={sortItems} cards={cards} users={users} />
      </div>
    </div>
  );
};

export default Home;

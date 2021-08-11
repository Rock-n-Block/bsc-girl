import React from 'react';

import './Home.scss';

import {Preview, HomeCard, Popular} from '../../components';

import User1 from '../../assets/img/icons/mini-icon-1.svg';
import User2 from '../../assets/img/icons/mini-icon-2.svg';
import User3 from '../../assets/img/icons/mini-icon-3.svg';
import Other from '../../assets/img/icons/mini-icon-other.svg';
import Card1 from '../../assets/img/card-1.png';
import Card2 from '../../assets/img/card-2.png';
import Card3 from '../../assets/img/card-3.png';
import Card4 from '../../assets/img/card-4.png';
import Card5 from '../../assets/img/card-5.png';
import Card6 from '../../assets/img/card-6.png';
import Card7 from '../../assets/img/card-7.png';
import Card8 from '../../assets/img/card-8.png';
import Ava1 from '../../assets/img/populars-1.png';
import Ava2 from '../../assets/img/populars-2.png';
import Ava3 from '../../assets/img/populars-3.png';
import Ava4 from '../../assets/img/populars-4.png';
import Ava5 from '../../assets/img/populars-5.png';
import Ava6 from '../../assets/img/populars-6.png';
import Ava7 from '../../assets/img/populars-7.png';
import Ava8 from '../../assets/img/populars-8.png';
import Ava9 from '../../assets/img/populars-9.png';
import Ava10 from '../../assets/img/populars-10.png';

const users = [
  {
    name: 'user-1',
    img: User1,
  },
  {
    name: 'user-2',
    img: User2
  },
  {
    name: 'user-3',
    img: User3,
  },
  {
    name: 'user-other',
    img: Other,
  }
];

const cards = [
  {
    img: Card1,
    title: 'Cyber Head - Human Ins...',
    price: 0.5
  },
  {
    img: Card2,
    title: 'Cyber Head - Human Ins...',
    price: 0.5
  },
  {
    img: Card3,
    title: 'Cyber Head - Human Ins...',
    price: 0.5
  },
  {
    img: Card4,
    title: 'Cyber Head - Human Ins...',
    price: 0.5
  },
  {
    img: Card5,
    title: 'Cyber Head - Human Ins...',
    price: 0.5
  },
  {
    img: Card6,
    title: 'Cyber Head - Human Ins...',
    price: 0.5
  },
  {
    img: Card7,
    title: 'Cyber Head - Human Ins...',
    price: 0.5
  },
  {
    img: Card8,
    title: 'Cyber Head - Human Ins...',
    price: 0.5
  },
];

const populars = [
  {
    img: Ava1,
    name: 'Bankless DAODDT...',
    amount: '355 ETH'
  },
  {
    img: Ava2,
    name: '4BULLS (Staking)',
    amount: '355 ETH'
  },
  {
    img: Ava3,
    name: 'Digital Sailor',
    amount: '355 ETH'
  },
  {
    img: Ava4,
    name: 'Diamond HODLR Coll...',
    amount: '355 ETH'
  },
  {
    img: Ava5,
    name: 'Mazanovsky',
    amount: '355 ETH'
  },
  {
    img: Ava6,
    name: 'Bankless DAODDT...',
    amount: '355 ETH'
  },
  {
    img: Ava7,
    name: 'Digital Sailor',
    amount: '355 ETH'
  },
  {
    img: Ava8,
    name: 'Mazanovsky',
    amount: '355 ETH'
  },
  {
    img: Ava9,
    name: 'Diamond HODLR Coll...',
    amount: '355 ETH'
  },
  {
    img: Ava10,
    name: 'Bankless DAODDT...',
    amount: '355 ETH'
  },
  {
    img: Ava2,
    name: '4BULLS (Staking)',
    amount: '355 ETH'
  },
  {
    img: Ava3,
    name: 'satman',
    amount: '355 ETH'
  },
];

const Home: React.FC = () => {
  return (
    <div>
      <div className="gradient-bg"/>
      <div className="home">
        <Preview users={users}/>
        <div className="cards">
          {cards.map(card => (
            <HomeCard users={users} img={card.img} title={card.title} price={card.price} />
          ))}
        </div>
        <Popular items={populars}/>
      </div>
    </div>
  );
}

export default Home;

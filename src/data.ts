import Card1 from './assets/img/card-1.png';
import Card2 from './assets/img/card-2.png';
import Card3 from './assets/img/card-3.png';
import Card4 from './assets/img/card-4.png';
import Card5 from './assets/img/card-5.png';
import Card6 from './assets/img/card-6.png';
import Card7 from './assets/img/card-7.png';
import Card8 from './assets/img/card-8.png';
import ColAva1 from './assets/img/collections-avatar-1.png';
import User1 from './assets/img/icons/mini-icon-1.svg';
import User2 from './assets/img/icons/mini-icon-2.svg';
import User3 from './assets/img/icons/mini-icon-3.svg';
import Other from './assets/img/icons/mini-icon-other.svg';
import Ava1 from './assets/img/populars-1.png';
import Ava2 from './assets/img/populars-2.png';
import Ava3 from './assets/img/populars-3.png';
import Ava4 from './assets/img/populars-4.png';
import Ava5 from './assets/img/populars-5.png';
import Ava6 from './assets/img/populars-6.png';
import Ava7 from './assets/img/populars-7.png';
import Ava8 from './assets/img/populars-8.png';
import Ava9 from './assets/img/populars-9.png';
import Ava10 from './assets/img/populars-10.png';
import ImgDefault from './assets/img/collection-img-default.png';

export type TypeUser = {
  name: string;
  img: string;
};

export type TypeCard = {
  img: string;
  title: string;
  price: number;
};

export type TypePopular = {
  img: string;
  name: string;
  amount: string;
};

export type TypeCollection = {
  images: string[] | [];
  avatar: string;
  name: string;
};

export const users: TypeUser[] = [
  {
    name: 'user-1',
    img: User1,
  },
  {
    name: 'user-2',
    img: User2,
  },
  {
    name: 'user-3',
    img: User3,
  },
  {
    name: 'user-other',
    img: Other,
  },
];

export const cards: TypeCard[] = [
  {
    img: Card1,
    title: 'Cyber Head - Human Ins...',
    price: 0.5,
  },
  {
    img: Card2,
    title: 'Cyber Head - Human Ins...',
    price: 0.5,
  },
  {
    img: Card3,
    title: 'Cyber Head - Human Ins...',
    price: 0.5,
  },
  {
    img: Card4,
    title: 'Cyber Head - Human Ins...',
    price: 0.5,
  },
  {
    img: Card5,
    title: 'Cyber Head - Human Ins...',
    price: 0.5,
  },
  {
    img: Card6,
    title: 'Cyber Head - Human Ins...',
    price: 0.5,
  },
  {
    img: Card7,
    title: 'Cyber Head - Human Ins...',
    price: 0.5,
  },
  {
    img: Card8,
    title: 'Cyber Head - Human Ins...',
    price: 0.5,
  },
];

export const populars: TypePopular[] = [
  {
    img: Ava1,
    name: 'Bankless DAODDT...',
    amount: '355 ETH',
  },
  {
    img: Ava2,
    name: '4BULLS (Staking)',
    amount: '355 ETH',
  },
  {
    img: Ava3,
    name: 'Digital Sailor',
    amount: '355 ETH',
  },
  {
    img: Ava4,
    name: 'Diamond HODLR Coll...',
    amount: '355 ETH',
  },
  {
    img: Ava5,
    name: 'Mazanovsky',
    amount: '355 ETH',
  },
  {
    img: Ava6,
    name: 'Bankless DAODDT...',
    amount: '355 ETH',
  },
  {
    img: Ava7,
    name: 'Digital Sailor',
    amount: '355 ETH',
  },
  {
    img: Ava8,
    name: 'Mazanovsky',
    amount: '355 ETH',
  },
  {
    img: Ava9,
    name: 'Diamond HODLR Coll...',
    amount: '355 ETH',
  },
  {
    img: Ava10,
    name: 'Bankless DAODDT...',
    amount: '355 ETH',
  },
  {
    img: Ava2,
    name: '4BULLS (Staking)',
    amount: '355 ETH',
  },
  {
    img: Ava3,
    name: 'satman',
    amount: '355 ETH',
  },
];

export const collections: TypeCollection[] = [
  {
    images: [Card5, Card1, Card7, Card3],
    avatar: ColAva1,
    name: 'DicraKiller',
  },
  {
    images: [Card6, Card8, Card7, Card3],
    avatar: ColAva1,
    name: 'DicraKiller',
  },
  {
    images: [ImgDefault, ImgDefault, ImgDefault, ImgDefault],
    avatar: ColAva1,
    name: 'DicraKiller',
  },
  {
    images: [Card4, Card7, Card3, ImgDefault],
    avatar: ColAva1,
    name: 'DicraKiller',
  },
  {
    images: [Card5, Card1, Card7, Card3],
    avatar: ColAva1,
    name: 'DicraKiller',
  },
];

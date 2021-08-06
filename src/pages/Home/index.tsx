import React from 'react';

import './index.scss';

import User1 from '../../assets/img/icons/mini-icon-1.svg';
import User2 from '../../assets/img/icons/mini-icon-2.svg';
import User3 from '../../assets/img/icons/mini-icon-3.svg';
import Other from '../../assets/img/icons/mini-icon-other.svg';

import {Preview} from '../../components';

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

const Home: React.FC = () => {
  return (
    <div>
      <div className="gradient-bg"/>
      <div className="container">
        <Preview users={users}/>
      </div>
    </div>
  );
}

export default Home;

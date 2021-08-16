import React, { useState } from 'react';

import ArrowDown from '../../assets/img/icons/arrow-down.svg';
import Verified from '../../assets/img/icons/verification.svg';

import './Popular.scss';

type TypePopularsProps = {
  items: Array<{ img: any; name: string; amount: string }>;
};

const Popular: React.FC<TypePopularsProps> = ({ items }) => {
  const [isFirstOpen, setFirstOpen] = useState(false);
  const [isSecondOpen, setSecondOpen] = useState(false);
  const [topType, setTopType] = useState('Sellers');
  const [topTime, setTopTime] = useState('1 day');

  const setType = (type: string): void => {
    setTopType(type);
    setFirstOpen(false);
  };

  const setTime = (time: string): void => {
    setTopTime(time);
    setSecondOpen(false);
  };

  return (
    <div className="container">
      <div className="popular">
        <div className="popular__header">
          <h2>Popular</h2>
          <div
            className="popular__header__select"
            role="button"
            tabIndex={0}
            onClick={() => setFirstOpen(!isFirstOpen)}
            onKeyPress={() => {}}
          >
            {topType}
            <img src={ArrowDown} alt="arrow down" />
            <div className={isFirstOpen ? 'open' : 'close'}>
              <div className="open__item" role="button" tabIndex={0} onClick={() => setType('Sellers')} onKeyPress={() => {}}>Sellers</div>
              <div className="open__item" role="button" tabIndex={0} onClick={() => setType('Other')} onKeyPress={() => {}}>Other</div>
            </div>
          </div>
          <h2>in</h2>
          <div
            className="popular__header__select"
            role="button"
            tabIndex={0}
            onClick={() => setSecondOpen(!isSecondOpen)}
            onKeyPress={() => {}}
          >
            {topTime}
            <img src={ArrowDown} alt="arrow down" />
            <div className={isSecondOpen ? 'open' : 'close'}>
              <div className="open__item" role="button" tabIndex={0} onClick={() => setTime('1 day')} onKeyPress={() => {}}>1 day</div>
              <div className="open__item" role="button" tabIndex={0} onClick={() => setTime('1 week')} onKeyPress={() => {}}>1 week</div>
              <div className="open__item" role="button" tabIndex={0} onClick={() => setTime('1 month')} onKeyPress={() => {}}>1 month</div>
            </div>
          </div>
        </div>
        <div className="popular__items">
          {items.map((item, index) => (
            <div key={item.name} className="item">
              <div className="item__number">{index + 1}.</div>
              <div className="item__img">
                <img className="item__img__avatar" src={item.img} alt={`avatar ${item.name}`} />
                <img className="item__img__verified" src={Verified} alt="verified icon" />
              </div>
              <div className="item__info">
                <div className="item__info__name">{item.name}</div>
                <div className="item__info__amount">{item.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Popular;

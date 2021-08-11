import React from 'react';

import './Popular.scss';

import Verified from '../../assets/img/icons/verification.svg';

type TypePopularsProps = {
  items: Array<{img: any, name: string, amount: string}>
};

const Popular: React.FC<TypePopularsProps> = ({items}) => {
  return (
    <div className="popular">
      <div className="popular__header">
        <h2>Popular</h2>
        <select id="type" className="popular__header__select">
          <option value="Sellers">Sellers</option>
        </select>
        <h2>in</h2>
        <select id="days" className="popular__header__select">
          <option value="1">1 day</option>
        </select>
      </div>
      <div className="popular__items">
        {items.map((item, index) => (
          <div key={item.name} className="item">
            <div className="item__number">{index + 1}.</div>
            <div className="item__img">
              <img className="item__img__avatar" src={item.img} alt={`avatar ${item.name}`}/>
              <img className="item__img__verified" src={Verified} alt="verified icon"/>
            </div>
            <div className="item__info">
              <div className="item__info__name">{item.name}</div>
              <div className="item__info__amount">{item.amount}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Popular;

import React from 'react';
import { Link } from 'react-router-dom';

import { TypeUser } from '../../data';

import './TokenCard.scss';

type TypeTokenCardProps = {
  users: Array<TypeUser>;
  img: any;
  title: string;
  price: number;
};

const TokenCard: React.FC<TypeTokenCardProps> = ({ users, img, title, price }) => {
  return (
    <div className="card">
      <div className="card__users">
        {users.map((user) => (
          <div className={`card__users__${user.name}`}>
            <img src={user.img} alt={user.name} />
          </div>
        ))}
      </div>
      <Link to="/token">
        <div className="card__img">
          <img src={img} alt={img} />
        </div>
      </Link>
      <div className="card__title">{title}</div>
      <div className="card__price">
        <div className="card__price__value">{price} BSCGIRL</div>
        <div className="card__price__count">1 of 3</div>
      </div>
    </div>
  );
};

export default TokenCard;

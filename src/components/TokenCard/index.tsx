import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import LikeActive from '../../assets/img/icons/like-active.svg';
import Like from '../../assets/img/icons/like.svg';
import { TypeUser } from '../../data';

import './TokenCard.scss';

type TypeTokenCardProps = {
  // eslint-disable-next-line react/require-default-props
  disableLinks?: boolean;
  // eslint-disable-next-line react/require-default-props
  id?: string;
  owners: Array<TypeUser>;
  img: any;
  title: string;
  price: string | number;
  numberOfCopies: number;
};

const TokenCard: React.FC<TypeTokenCardProps> = ({
  disableLinks = false,
  id,
  owners,
  img,
  title,
  price,
  numberOfCopies,
}) => {
  const [isLiked, setLiked] = useState(false);

  return (
    <div className="card">
      {owners.length ? (
        <div className="card__users">
          <div className="card__users__user-1">
            <img src={owners[0].img} alt={owners[0].name} />
          </div>
          {owners[1] ? (
            <div className="card__users__user-2">
              <img src={owners[1].img} alt={owners[1].name} />
            </div>
          ) : (
            React.Fragment
          )}
          {owners[2] ? (
            <div className="card__users__user-3">
              <img src={owners[2].img} alt={owners[2].name} />
            </div>
          ) : (
            React.Fragment
          )}
        </div>
      ) : (
        React.Fragment
      )}
      {!disableLinks ? (
        <Link to={`/token/${id}`}>
          <div className="card__img">
            <img src={img} alt={img} />
          </div>
        </Link>
      ) : (
        <div className="card__img">
          <img src={img} alt={img} />
        </div>
      )}
      <div className="card__title">{title}</div>
      <div className="card__info">
        <div className="card__info__price">
          <div className="card__price__value">{price} BSCGIRL</div>
          <div className="card__price__count">1 of {numberOfCopies}</div>
        </div>
        <div
          className="card__info__like"
          role="button"
          tabIndex={0}
          onClick={() => setLiked(!isLiked)}
          onKeyPress={() => {}}
        >
          <img src={isLiked ? LikeActive : Like} alt="like" />
        </div>
      </div>
    </div>
  );
};

export default TokenCard;

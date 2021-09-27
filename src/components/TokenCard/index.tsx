import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';

import LikeActive from '../../assets/img/icons/like-active.svg';
import Like from '../../assets/img/icons/like.svg';
import { userApi } from '../../services/api';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';

import './TokenCard.scss';

type TypeTokenCardProps = {
  disableLinks: boolean;
  id: string;
  owners: any;
  img: string;
  name: string;
  price: string | number;
  currency: string;
  total_supply: number;
  available: number;
  is_liked: boolean;
};

const TokenCard: React.FC<TypeTokenCardProps> = ({
  disableLinks = false,
  id,
  owners,
  img,
  name,
  price,
  currency,
  total_supply,
  available,
  is_liked,
}) => {
  const [isLiked, setLiked] = useState(is_liked);
  // const [isMyToken, setMyToken] = useState(false);
  const { user } = useMst();

  const handleLike = (): void => {
    userApi
      .like({ id })
      .then(({ data }) => {
        if (data === 'liked') {
          setLiked(true);
          user.addLike();
        } else {
          setLiked(false);
          user.removeLike();
        }
      })
      .catch((err) => {
        clogData('handle like error:', err);
      });
  };

  useEffect(() => {
    if (user.likes.length && id) {
      setLiked(user.isLiked());
    }
  }, [id, user, user.id]);

  return (
    <div className="card">
      {owners.length ? (
        <div className="card__users">
          <Link to={`/profile/${owners[0].id ?? ''}`}>
            <div className="card__users__user-1">
              <img src={owners[0].avatar || ''} alt={owners[0].name} />
            </div>
          </Link>
          {owners[1] ? (
            <Link to={`/profile/${owners[1].id ?? ''}`}>
              <div className="card__users__user-2">
                <img src={owners[1].avatar} alt={owners[1].name} />
              </div>
            </Link>
          ) : (
            React.Fragment
          )}
          {owners[2] ? (
            <Link to={`/profile/${owners[2].id ?? ''}`}>
              <div className="card__users__user-3">
                <img src={owners[2].avatar} alt={owners[2].name} />
              </div>
            </Link>
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
      <div className="card__content">
        <div className="card__title">{name}</div>
        <div className="card__info">
          <div className="card__info__price">
            <div className="card__info__price__value">
              {new BigNumber(price).toFixed(3)} {currency.toUpperCase()}
            </div>
            {total_supply && total_supply > 1 ? (
              <div className="card__info__price__count">
                {available} of {total_supply}
              </div>
            ) : (
              React.Fragment
            )}
          </div>
          <div
            className="card__info__like"
            role="button"
            tabIndex={0}
            onClick={handleLike}
            onKeyPress={() => {}}
          >
            <img src={isLiked ? LikeActive : Like} alt="like" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;

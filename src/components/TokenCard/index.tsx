import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';

import LikeActive from '../../assets/img/icons/like-active.svg';
import Like from '../../assets/img/icons/like.svg';
import Loader from '../../assets/img/icons/loader.svg';
import { userApi } from '../../services/api';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';

import './TokenCard.scss';

type TypeTokenCardProps = {
  disableLinks: boolean;
  id: string;
  owners: any;
  img: string;
  format: string;
  name: string;
  price: string | number;
  currency: string;
  total_supply: number;
  available: number;
  is_liked: boolean;
  onSale: boolean;
};

const TokenCard: React.FC<TypeTokenCardProps> = ({
  disableLinks = false,
  id,
  owners,
  img,
  format,
  name,
  price,
  currency,
  total_supply,
  available,
  is_liked,
  onSale,
}) => {
  const [isLiked, setLiked] = useState(is_liked);
  const [isLoading, setLoading] = useState(true);
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

  useEffect(() => {
    if (img) setLoading(false);
  }, [img]);

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
          {isLoading ? (
            <div className="loading">
              <img src={Loader} alt="loader" />
            </div>
          ) : (
            <div className="card__img">
              {format === 'video' ? (
                <video controls>
                  <source src={img} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                  <track kind="captions" />
                </video>
              ) : (
                ''
              )}
              {format === 'audio' ? (
                <audio controls>
                  <source src={img} />
                  <track kind="captions" />
                </audio>
              ) : (
                ''
              )}
              {format === 'gif' || format === 'image' || format === 'img' ? (
                <img src={img} alt="token preview" />
              ) : (
                ''
              )}
            </div>
          )}
        </Link>
      ) : (
        <div className="card__img">
          {format === 'video' ? (
            <video controls>
              <source src={img} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
              <track kind="captions" />
            </video>
          ) : (
            ''
          )}
          {format === 'audio' ? (
            <audio controls>
              <source src={img} />
              <track kind="captions" />
            </audio>
          ) : (
            ''
          )}
          {format === 'gif' || format === 'image' || format === 'img' ? (
            <img src={img} alt="token preview" />
          ) : (
            ''
          )}
        </div>
      )}
      <div className="card__content">
        <Link to={`/token/${id}`}>
          <div className="card__title">{name}</div>
        </Link>
        <div className="card__info">
          <div className="card__info__price">
            <Link to={`/token/${id}`}>
              <div className="card__info__price__value">
                {onSale
                  ? `${new BigNumber(price).toFixed(3)} ${currency ? currency.toUpperCase() : ''}`
                  : 'Not for sale'}
              </div>
            </Link>
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

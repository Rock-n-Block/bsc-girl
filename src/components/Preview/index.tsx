import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import DefaultImg from '../../assets/img/card-default.png';
import ArrowLeft from '../../assets/img/icons/arrow-left.svg';
import ArrowRight from '../../assets/img/icons/arrow-right.svg';
import { IToken } from '../../types';
import { clogData } from '../../utils/logger';

import './Preview.scss';

type TypePreviewProps = {
  tokens: IToken[];
};

const Preview: React.FC<TypePreviewProps> = observer(({ tokens }) => {
  const [token, setToken] = useState<IToken>({
    media: DefaultImg,
    name: '',
    description: '',
    standart: '',
    currency: '',
    id: 0,
    owners: [],
    available: 0,
    total_supply: 0,
    price: 0,
    is_liked: false,
  });
  const [query, setQuery] = useState<number>(0);

  const onHandleNext = () => {
    setQuery(query === tokens.length - 1 ? 0 : query + 1);
  };

  const onHandlePrev = () => {
    setQuery(query === 0 ? tokens.length - 1 : query - 1);
  };

  useEffect(() => {
    let owners = [];
    if (tokens.length) {
      if (tokens[query].owners.length) {
        owners = tokens[query].owners;
      } else owners.push(tokens[query].owners);
      setToken({
        standart: tokens[query].standart,
        media: tokens[query].media,
        name: tokens[query].name,
        description: tokens[query].description,
        id: tokens[query].id,
        owners,
        available: tokens[query].available,
        total_supply: tokens[query].total_supply,
        price: tokens[query].price,
        currency: tokens[query].currency.symbol.toUpperCase(),
        is_liked: tokens[query].is_liked,
      });
    }
  }, [tokens, query]);

  clogData('token:', token);

  return (
    <div className="container">
      <div className="preview">
        <div className="preview__img">
          <img src={token.media} alt="preview art" />
        </div>
        <div className="preview__content">
          <h2>Featured Art</h2>
          {token.owners.length ? (
            <div className="preview__content__users">
              {Object.keys(token.owners[0] ?? '').length ? (
                <Link to={`/profile/${token.owners[0].id ?? ''}`}>
                  <div className="preview__content__users__1">
                    <img src={token.owners[0].avatar} alt={token.owners[0].name} />
                  </div>
                </Link>
              ) : (
                ''
              )}
              {Object.keys(token.owners[1] ?? '').length ? (
                <Link to={`/profile/${token.owners[1].id ?? ''}`}>
                  <div className="preview__content__users__2">
                    <img src={token.owners[1].avatar} alt={token.owners[1].name} />
                  </div>
                </Link>
              ) : (
                ''
              )}
              {Object.keys(token.owners[2] ?? '').length ? (
                <Link to={`/profile/${token.owners[2].id ?? ''}`}>
                  <div className="preview__content__users__3">
                    <img src={token.owners[2].avatar} alt={token.owners[2].name} />
                  </div>
                </Link>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
          <h3 className="preview__content__second-title">{token.name}</h3>
          <div className="preview__content__text">{token.description}</div>
          <div className="preview__content__buttons">
            <button type="button" className="gradient-button">
              <Link to={`/token/${token.id ?? ''}`}>
                Buy for {token.price} {token.currency ?? 'BSCGIRL'}
              </Link>
            </button>
            {token.standart === 'ERC1155' ? (
              <div className="preview__content__buttons__text">
                {token.available} of {token.total_supply}
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="preview__content__nav-buttons">
            {query === 0 ? (
              ''
            ) : (
              <div
                className="preview__content__nav-buttons__button left"
                role="button"
                tabIndex={0}
                onClick={onHandlePrev}
                onKeyPress={() => {}}
              >
                <img src={ArrowLeft} alt="arrow left right" />
              </div>
            )}
            {query + 1 === tokens.length ? (
              ''
            ) : (
              <div
                className="preview__content__nav-buttons__button right"
                role="button"
                tabIndex={0}
                onClick={onHandleNext}
                onKeyPress={() => {}}
              >
                <img src={ArrowRight} alt="arrow right" />
              </div>
            )}
          </div>
        </div>
        <div className="preview__buttons">
          <div
            className="preview__buttons__button left"
            role="button"
            tabIndex={0}
            onClick={onHandlePrev}
            onKeyPress={() => {}}
          >
            <img src={ArrowLeft} alt="arrow left right" />
          </div>
          <div
            className="preview__buttons__button right"
            role="button"
            tabIndex={0}
            onClick={onHandleNext}
            onKeyPress={() => {}}
          >
            <img src={ArrowRight} alt="arrow right" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Preview;

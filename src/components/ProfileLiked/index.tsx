import React, { useCallback, useEffect, useState } from 'react';

import DefaultImg from '../../assets/img/card-default.png';
import Loader from '../../assets/img/icons/loader.svg';
import { storeApi } from '../../services/api';
import { clogData } from '../../utils/logger';
import { NoItemsFound, TokenCard } from '../index';

interface ProfileLikedProps {
  address: string;
}

const ProfileLiked: React.FC<ProfileLikedProps> = ({ address }) => {
  const [isLoading, setLoading] = useState(true);
  const [likedCards, setLikedCards] = useState<any>({});

  const loadUserLiked = useCallback(
    async (page = 1) => {
      return storeApi
        .getLiked(address, page)
        .then(({ data }) => {
          setLikedCards((prevCreated: any) => {
            if (prevCreated.tokens) {
              return {
                ...prevCreated,
                tokens: [...prevCreated.tokens, ...data],
                length: data.length,
              };
            }
            return {
              tokens: [...data],
              length: data.length,
            };
          });
          setLoading(false);
        })
        .catch((err: any) => {
          clogData('get liked error', err);
        });
    },
    [address],
  );

  useEffect(() => {
    loadUserLiked();
  }, [loadUserLiked]);

  return (
    <div className="profile__content">
      {likedCards.tokens && likedCards.tokens.length ? (
        <div className="scroll">
          {isLoading ? (
            <div className="loading">
              <img src={Loader} alt="loader" />
            </div>
          ) : (
            <div className="profile__content__items">
              {likedCards.tokens.map((token: any) => (
                <TokenCard
                  key={token.id}
                  id={token.id}
                  owners={token.standart === 'ERC1155' ? token.owners : [token.owners]}
                  img={token.media ? token.media : DefaultImg}
                  format={token.format}
                  name={token.name}
                  price={token.price}
                  currency={token.currency?.symbol ?? token.currency.toUpperCase()}
                  total_supply={token.total_supply}
                  available={token.available}
                  is_liked={token.is_liked}
                  disableLinks={false}
                  onSale={token.selling}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <NoItemsFound />
      )}
    </div>
  );
};

export default ProfileLiked;

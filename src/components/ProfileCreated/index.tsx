import React, { useCallback, useEffect, useState } from 'react';

import DefaultImg from '../../assets/img/card-default.png';
import Loader from '../../assets/img/icons/loader.svg';
import { storeApi } from '../../services/api';
import { clogData } from '../../utils/logger';
import { NoItemsFound, TokenCard } from '../index';

interface ProfileCreatedProps {
  address: string;
}

const ProfileCreated: React.FC<ProfileCreatedProps> = ({ address }) => {
  const [isLoading, setLoading] = useState(true);
  const [createdCards, setCreatedCards] = useState<any>({});

  const loadUserCreated = useCallback(
    async (page = 1) => {
      return storeApi
        .getCreated(address, page)
        .then(({ data }) => {
          setCreatedCards((prevCreated: any) => {
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
          clogData('get created error', err);
        });
    },
    [address],
  );

  useEffect(() => {
    loadUserCreated();
  }, [loadUserCreated]);

  return (
    <div className="profile__content">
      {createdCards.tokens && createdCards.tokens.length ? (
        <div className="scroll">
          {isLoading ? (
            <div className="loading">
              <img src={Loader} alt="loader" />
            </div>
          ) : (
            <div className="profile__content__items">
              {createdCards.tokens.map((token: any) => (
                <TokenCard
                  key={token.id}
                  id={token.id}
                  owners={token.standart === 'ERC1155' ? token.owners : [token.owners]}
                  img={token.media ? token.media : DefaultImg}
                  format={token.format}
                  name={token.name}
                  price={token.price}
                  currency={token.currency?.symbol ?? token.currency}
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

export default ProfileCreated;

import React, { useCallback, useEffect, useState } from 'react';

import DefaultImg from '../../assets/img/card-default.png';
import { storeApi } from '../../services/api';
import { clogData } from '../../utils/logger';
import { NoItemsFound, TokenCard } from '../index';

interface ProfileCreatedProps {
  address: string;
}

const ProfileCreated: React.FC<ProfileCreatedProps> = ({ address }) => {
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
          <div className="profile__content__items">
            {createdCards.tokens.map((token: any) => (
              <TokenCard
                key={token.id}
                id={token.id}
                owners={token.owners}
                img={token.media ? token.media : DefaultImg}
                name={token.name}
                price={token.price}
                currency={token.currency.symbol}
                total_supply={token.total_supply}
                available={token.available}
                is_liked={token.is_liked}
                disableLinks={false}
              />
            ))}
          </div>
        </div>
      ) : (
        <NoItemsFound />
      )}
    </div>
  );
};

export default ProfileCreated;

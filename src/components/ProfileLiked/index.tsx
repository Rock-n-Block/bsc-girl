import React, { useCallback, useEffect, useState } from 'react';

import DefaultImg from '../../assets/img/card-default.png';
import { storeApi } from '../../services/api';
import { clogData } from '../../utils/logger';
import { NoItemsFound, TokenCard } from '../index';

interface ProfileLikedProps {
  address: string;
}

const ProfileLiked: React.FC<ProfileLikedProps> = ({ address }) => {
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
          <div className="profile__content__items">
            {likedCards.tokens.map((token: any) => (
              <TokenCard
                id={token.id}
                owners={token.owners}
                img={token.media ? `https://${token.media}` : DefaultImg}
                title={token.name}
                price={token.price}
                numberOfCopies={token.numberOfCopies}
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

export default ProfileLiked;

import React from 'react';
import { observer } from 'mobx-react-lite';

import DefaultImg from '../../assets/img/card-default.png';
import { NoItemsFound, TokenCard } from '../index';

interface ProfileCollectiblesProps {
  cards: any;
}

const ProfileCollectibles: React.FC<ProfileCollectiblesProps> = observer(({ cards }) => {
  return (
    <div className="profile__content">
      {cards.tokens && cards.tokens.length ? (
        <div className="scroll">
          <div className="profile__content__items">
            {cards.tokens.map((token: any) => (
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
});

export default ProfileCollectibles;

import React from 'react';
import { observer } from 'mobx-react-lite';

import DefaultImg from '../../assets/img/card-default.png';
import { NoItemsFound, TokenCard } from '../index';

interface ProfileCollectiblesProps {
  tokens: any;
}

const ProfileCollectibles: React.FC<ProfileCollectiblesProps> = observer(({ tokens }) => {
  return (
    <div className="profile__content">
      {tokens && tokens.length ? (
        <div className="scroll">
          <div className="profile__content__items">
            {tokens.map((token: any) => (
              <TokenCard
                key={token.id}
                id={token.id}
                owners={token.standart === 'ERC1155' ? token.owners : [token.owners]}
                img={token.media ? token.media : DefaultImg}
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
        </div>
      ) : (
        <NoItemsFound />
      )}
    </div>
  );
});

export default ProfileCollectibles;

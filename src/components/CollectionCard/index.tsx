import React from 'react';

import './CollectionCard.scss';

type TypeCollectionCardProps = {
  images: string[];
  avatar: string;
  name: string;
};

const CollectionCard: React.FC<TypeCollectionCardProps> = ({images, avatar, name}) => {
  return (
    <div className="collection">
      <div className="collection__images">
        {images.map((image: string | undefined, index: any) => (
          <img src={image} alt={`collection item ${index + 1}`} />
        ))}
      </div>
      <div className="collection__author">
        <img className="collection__author__avatar" src={avatar} alt={name} />
        <div className="collection__author__name">
          <div className="collection__author__name__title">BY</div>
          <div className="collection__author__name__text">{name}</div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;

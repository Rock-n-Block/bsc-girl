import React from 'react';

import BtnLeft from '../../assets/img/icons/arrow-left.svg';
import BtnRight from '../../assets/img/icons/arrow-right.svg';
import { TypeCollection } from '../../data';

import './Collections.scss';

type TypeCollectionsProps = {
  items: TypeCollection[];
};

const Collections: React.FC<TypeCollectionsProps> = ({ items }) => {
  return (
    <div className="container">
      <div className="collections">
        <h2>Hot collections</h2>
        <div className="collections__list">
          <div className="btn btn-left">
            <img src={BtnLeft} alt="button left" />
          </div>
          <div className="collections__list__scroll">
            {items.map((item, index) => (
              <div key={`collection ${index + 1}`} className="collection">
                <div className="collection__images">
                  {item.images.map((image: string | undefined, i: any) => (
                    <img src={image} alt={`collection item ${i + 1}`} />
                  ))}
                </div>
                <div className="collection__author">
                  <img className="collection__author__avatar" src={item.avatar} alt={item.name} />
                  <div className="collection__author__name">
                    <div className="collection__author__name__title">BY</div>
                    <div className="collection__author__name__text">{item.name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="btn btn-right">
            <img src={BtnRight} alt="button right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;

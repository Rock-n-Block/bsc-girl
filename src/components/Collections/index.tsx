import React from 'react';

import BtnLeft from '../../assets/img/icons/arrow-left.svg';
import BtnRight from '../../assets/img/icons/arrow-right.svg';
import { TypeCollection } from '../../data';

import './Collections.scss';
import {CollectionCard} from "../index";

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
            {items.map((item) => (
              <CollectionCard images={item.images} avatar={item.avatar} name={item.name} />
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

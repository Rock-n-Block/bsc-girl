import React, { useRef } from 'react';

import BtnLeft from '../../assets/img/icons/arrow-left.svg';
import BtnRight from '../../assets/img/icons/arrow-right.svg';
import { TypeCollection } from '../../data';
import { CollectionCard } from '../index';

import './Collections.scss';

type TypeCollectionsProps = {
  items: TypeCollection[];
};

const Collections: React.FC<TypeCollectionsProps> = ({ items }) => {
  const scrollRef = useRef(null);

  const scroll = (element: HTMLDivElement, scrollOffset: number): void => {
    element.scrollLeft += scrollOffset;
    console.log('Width', element);
    console.log('Scroll left:', element.scrollLeft);
  };

  return (
    <div className="container">
      <div className="collections">
        <h2>Hot collections</h2>
        <div className="collections__list">
          <div className="collections__list__scroll" ref={scrollRef}>
            <button
              type="button"
              className="btn btn-left" onClick={() => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                scroll(scrollRef.current, -295);
              }}
            >
              <img src={BtnLeft} alt="button left" />
            </button>
            {items.map((item) => (
              <CollectionCard images={item.images} avatar={item.avatar} name={item.name} />
            ))}
            <button
              type="button"
              className="btn btn-right"
              onClick={() => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              scroll(scrollRef.current, 295);
              }}
            >
              <img src={BtnRight} alt="button right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;

import React, { useState } from 'react';

import ArrowUp from '../../assets/img/icons/arrow-up.svg';
import CheckMark from '../../assets/img/icons/check-mark.svg';
import { TypeCard, TypeUser } from '../../data';
import { TokenCard } from '../index';

import './Explore.scss';

type TypeExploreProps = {
  exploreItems: string[];
  sortItems: string[];
  cards: TypeCard[];
  users: TypeUser[];
};

const Explore: React.FC<TypeExploreProps> = ({ exploreItems, sortItems, cards, users }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exploreValue, setExploreValue] = useState('All');
  const [sortValue, setSortValue] = useState('');
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="container">
      <div className="explore">
        <h2>Explore</h2>
        <div className="explore__nav">
          {exploreItems.map((item) => (
            <div
              key={item}
              className={`explore__nav__item ${exploreValue === item ? 'red' : null}`}
              role="button"
              tabIndex={0}
              onClick={() => setExploreValue(item)}
              onKeyPress={() => {}}
            >
              {item}
            </div>
          ))}
          <div className="explore__nav__sort">
            <div
              className="btn"
              role="button"
              tabIndex={0}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              onKeyPress={() => {}}
            >
              Sort
              <img className={`arrow ${isOpen ? 'up' : 'down'}`} src={ArrowUp} alt="arrow down" />
            </div>
            <div className={isOpen ? 'open' : 'close'}>
              {sortItems.map((item) => (
                <div
                  key={item}
                  className={`open__item ${sortValue === item ? 'red' : undefined}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSortValue(item)}
                  onKeyPress={() => {}}
                >
                  {item}
                  <img
                    className={sortValue === item ? 'checked' : 'non-checked'}
                    src={CheckMark}
                    alt="check mark"
                  />
                </div>
              ))}
              <div className="switch">
                text
                <div
                  className={`switch__btn ${isActive ? 'active' : undefined}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsActive(!isActive)}
                  onKeyPress={() => {}}
                >
                  <div className={`switch__btn__circle ${isActive ? 'colored' : undefined}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="explore__cards">
          <div className="scroll">
            {cards.map((card) => (
              <TokenCard users={users} img={card.img} title={card.title} price={card.price} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;

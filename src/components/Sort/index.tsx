import React, { useState } from 'react';

import ArrowUp from '../../assets/img/icons/arrow-up.svg';
import CheckMark from '../../assets/img/icons/check-mark.svg';

interface ISort {
  items: Array<ISortItem>;
  onChange: (sort: ISortItem) => void;
}

export interface ISortItem {
  key: string;
  value: string;
}

const Sort: React.FC<ISort> = ({ items, onChange }) => {
  const [isOpen, setOpen] = useState(false);
  const [activeSort, setActiveSort] = useState<ISortItem>(items[0]);

  const handleChangeSort = (sort: ISortItem): void => {
    if (sort !== activeSort) {
      onChange(sort);
      setActiveSort(sort);
      setOpen(false);
    }
  };
  return (
    <div>
      <div className="explore__nav__sort">
        <div
          className="btn"
          role="button"
          tabIndex={0}
          onClick={() => {
            setOpen(!isOpen);
          }}
          onKeyPress={() => {}}
        >
          Sort
          <img className={`arrow ${isOpen ? 'up' : 'down'}`} src={ArrowUp} alt="arrow down" />
        </div>
      </div>
      <div className={isOpen ? 'open' : 'close'}>
        {items.map((item) => (
          <div
            key={item.key}
            className={`open__item ${activeSort.key === item.key ? 'red' : undefined}`}
            role="button"
            tabIndex={0}
            onClick={() => handleChangeSort(item)}
            onKeyPress={() => {}}
          >
            {item.value}
            <img
              className={activeSort.key === item.key ? 'checked' : 'non-checked'}
              src={CheckMark}
              alt="check mark"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sort;

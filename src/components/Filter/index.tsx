import React from 'react';

import Sort, { ISortItem } from '../Sort';

interface IFilter {
  filters: string[];
  // eslint-disable-next-line react/require-default-props
  isAllFilterItem?: boolean;
  // eslint-disable-next-line react/require-default-props
  isMultipleValues?: boolean;
  onChange: (activeFilters: string[]) => void;
  // eslint-disable-next-line react/no-unused-prop-types,react/require-default-props
  showPickedSort?: boolean;
  // eslint-disable-next-line react/require-default-props
  sortItems?: ISortItem[];
  // eslint-disable-next-line react/require-default-props
  onChangeSort?: (sort: ISortItem) => void;
}

const Filter: React.FC<IFilter> = ({
  filters,
  isAllFilterItem = false,
  isMultipleValues = false,
  onChange,
  sortItems,
  onChangeSort,
}) => {
  const [activeFilter, setActiveFilter] = React.useState<string[]>(
    isAllFilterItem ? ['All'] : [filters[0]],
  );

  const handleFilterItemClick = (filter: string) => {
    let newFilters = [...activeFilter];
    if (isMultipleValues) {
      if (activeFilter.includes(filter)) {
        newFilters = activeFilter.filter((item) => item !== filter);
        if (!newFilters.length && isAllFilterItem) {
          newFilters = ['All'];
          setActiveFilter(['All']);
        } else {
          setActiveFilter(newFilters);
        }
      } else {
        newFilters.push(filter);
        if (newFilters.length > 1 && newFilters.includes('All') && filter !== 'All') {
          newFilters = newFilters.filter((filterString) => filterString !== 'All');
          setActiveFilter([...newFilters]);
        } else if (filter === 'All') {
          newFilters = ['All'];
          setActiveFilter(['All']);
        } else setActiveFilter([...newFilters]);
      }
    } else {
      newFilters = [filter];
      setActiveFilter([filter]);
    }
    onChange(newFilters);
  };
  return (
    <div className="explore__nav">
      <div className="items">
        {filters.map((item) => (
          <div
            key={item}
            role="button"
            onClick={() => handleFilterItemClick(item)}
            onKeyDown={() => handleFilterItemClick(item)}
            tabIndex={0}
            className={`explore__nav__item ${activeFilter.includes(item) ? 'red' : null}`}
          >
            {item}
          </div>
        ))}
      </div>
      {sortItems && onChangeSort ? <Sort items={sortItems} onChange={onChangeSort} /> : <></>}
    </div>
  );
};

export default Filter;

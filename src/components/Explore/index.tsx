import React, { useCallback, useEffect, useState } from 'react';

import DefaultImg from '../../assets/img/card-default.png';
import Loader from '../../assets/img/icons/loader.svg';
import { storeApi } from '../../services/api';
import { clogData } from '../../utils/logger';
import { Filter, NoItemsFound, TokenCard } from '../index';

import './Explore.scss';

interface ISortItem {
  key: string;
  value: string;
}

const Explore: React.FC = () => {
  const [isLoading, setLoading] = useState(true);
  const [explore, setExplore] = useState<any>({});
  const [tags, setTags] = useState<Array<string>>(['All']);
  const sortItems: Array<ISortItem> = [
    { key: '-price', value: 'Price High' },
    { key: 'price', value: 'Price Low' },
  ];
  const [activeSort, setActiveSort] = useState<ISortItem>(sortItems[0]);
  const [activeFilter, setActiveFilter] = useState(tags[0]);

  const loadTags = useCallback(() => {
    storeApi
      .getTags()
      .then(({ data }) => {
        setTags(['All', ...data.tags]);
      })
      .catch((err: any) => {
        clogData('get tags error', err);
      });
  }, []);

  const loadExplore = useCallback(
    async (page = 1) => {
      storeApi
        .getExplore(page, activeFilter, activeSort.key)
        .then(({ data }) => {
          clogData('explore data:', data);
          if (page !== 1) {
            setExplore((prevExplore: any) => {
              if (prevExplore.tokens) {
                return {
                  ...prevExplore,
                  tokens: [...prevExplore.tokens, ...data.tokens],
                  length: data.length,
                };
              }
              return { ...prevExplore, ...data };
            });
          } else setExplore(data);
          setLoading(false);
        })
        .catch((err: any) => {
          clogData('get tokens error', err);
        });
    },
    [activeFilter, activeSort.key],
  );

  const handleFilterChange = (value: string[]): void => {
    setActiveFilter(value[0]);
  };
  const handleSortChange = (value: ISortItem): void => {
    setActiveSort(value);
  };

  useEffect(() => {
    loadTags();
  }, [loadTags]);
  useEffect(() => {
    loadExplore();
  }, [loadExplore]);

  return (
    <div className="container">
      <div className="explore">
        <h2>Explore</h2>
        <Filter
          filters={tags}
          onChange={handleFilterChange}
          onChangeSort={handleSortChange}
          sortItems={sortItems}
        />
        {isLoading ? (
          <div className="loading">
            Loading&nbsp;
            <img src={Loader} alt="loader" />
          </div>
        ) : (
          <div className="explore__cards">
            {explore && explore.length ? (
              <div className="scroll">
                {explore.map((token: any) => (
                  <TokenCard
                    key={token.id}
                    id={token.id}
                    owners={token.standart === 'ERC1155' ? token.owners : [token.owners]}
                    img={token.media ? token.media : DefaultImg}
                    format={token.format}
                    name={token.name}
                    price={token.price}
                    currency={token.currency?.symbol ?? token.currency}
                    total_supply={token.total_supply}
                    available={token.available}
                    is_liked={token.is_liked}
                    onSale={token.selling}
                    disableLinks={false}
                  />
                ))}
              </div>
            ) : (
              <NoItemsFound />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;

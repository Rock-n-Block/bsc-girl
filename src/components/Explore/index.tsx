import React, { useCallback, useEffect, useState } from 'react';

import DefaultImg from '../../assets/img/card-default.png';
import { storeApi } from '../../services/api';
import { clogData } from '../../utils/logger';
import { Filter, NoItemsFound, TokenCard } from '../index';

import './Explore.scss';

interface ISortItem {
  key: string;
  value: string;
}

const Explore: React.FC = () => {
  const [explore, setExplore] = useState<any>({});
  const [tags, setTags] = useState<Array<string>>(['all']);
  const sortItems: Array<ISortItem> = [
    { key: 'recommend', value: 'Recommended' },
    { key: 'recent', value: 'Most Recent' },
    { key: 'popular', value: 'Popular' },
    { key: 'highest', value: 'Price High' },
    { key: 'cheapest', value: 'Price Low' },
  ];
  const [activeSort, setActiveSort] = useState<ISortItem>(sortItems[0]);
  const [activeFilter, setActiveFilter] = useState(tags[0]);

  const loadTags = useCallback(() => {
    storeApi
      .getTags()
      .then(({ data }) => {
        setTags(data.tags);
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
          } else
            setExplore({
              ...data,
            });
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
        <div className="explore__cards">
          {explore.tokens && explore.tokens.length ? (
            <div className="scroll">
              {explore.tokens.map((token: any) => (
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
          ) : (
            <NoItemsFound />
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;

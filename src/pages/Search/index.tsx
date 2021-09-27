import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { NoItemsFound, TokenCard } from '../../components';
import { storeApi } from '../../services/api';
import { clogData } from '../../utils/logger';

import './Search.scss';

const SearchPage: React.FC = observer(() => {
  const params = new URLSearchParams(useLocation().search);
  const searchQuery: string = params.get('to_search') ?? '';

  const [searchResults, setSearchResults] = useState<any>({
    tokens: [],
  });

  const loadSearchResults = useCallback(
    async (page = 1) => {
      return storeApi
        .getSearchResults({ text: searchQuery, page })
        .then(({ data }) => {
          setSearchResults(() => {
            const tokenItems: Array<any> = data;
            return {
              tokens: tokenItems,
            };
          });
        })
        .catch((err: any) => {
          clogData('get search results', err);
        });
    },
    [searchQuery],
  );

  useEffect(() => {
    loadSearchResults();
  }, [loadSearchResults]);

  return (
    <div className="container">
      <div className="search-page">
        <h2 className="search-page__text">
          Search results for{' '}
          <span className="search-page__text__result">&quot;{searchQuery}&quot;</span>
        </h2>
        <div className="search-page__content">
          <div className="search-page__content__scroll">
            {searchResults.tokens && Object.keys(searchResults.tokens).length ? (
              searchResults.tokens.map((token: any) => (
                <TokenCard
                  disableLinks={false}
                  id={token.id}
                  owners={token.owners}
                  img={token.media}
                  name={token.name}
                  price={token.price}
                  currency={token.currency.symbol}
                  total_supply={token.total_supply}
                  available={token.available}
                  is_liked={token.is_liked}
                />
              ))
            ) : (
              <NoItemsFound />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
export default SearchPage;

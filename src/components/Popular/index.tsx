import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import ArrowDown from '../../assets/img/icons/arrow-down.svg';
import Verified from '../../assets/img/icons/verification.svg';
import { activityApi } from '../../services/api';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';
import { NoItemsFound } from '../index';

import './Popular.scss';

type TypeTopUser = {
  id: number;
  user: {
    avatar: string;
    id: string;
    display_name: string;
    is_verificated: boolean;
  };
  price: number;
};

const Popular: React.FC = observer(() => {
  const [isFirstOpen, setFirstOpen] = useState(false);
  const [isSecondOpen, setSecondOpen] = useState(false);
  const [topType, setTopType] = useState('Sellers');
  const [topTime, setTopTime] = useState('day');
  const [users, setUsers] = useState<TypeTopUser[]>([]);
  const { user } = useMst();

  document.addEventListener('mousedown', (event) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (event.target?.className !== 'open__item') {
      setFirstOpen(false);
      setSecondOpen(false);
    }
  });

  const setType = (type: string): void => {
    setTopType(type);
    setFirstOpen(false);
  };

  const setTime = (time: string): void => {
    setTopTime(time);
    setSecondOpen(false);
  };

  useEffect(() => {
    const type = topType === 'Sellers' ? 'seller' : 'buyer';
    activityApi.getTopUsers(type, topTime).then((data: any) => {
      clogData('topusers data:', data);
      const items: any[] = [];
      data.data.map((item: any) => items.unshift(item));
      setUsers(items);
    });
  }, [topTime, topType, user.address]);

  return (
    <div className="container">
      <div className="popular">
        <div className="popular__header">
          <h2>Popular</h2>
          <div
            className="popular__header__select"
            role="button"
            tabIndex={0}
            onClick={() => setFirstOpen(!isFirstOpen)}
            onKeyPress={() => {}}
          >
            {topType}
            <img src={ArrowDown} alt="arrow down" />
            <div className={isFirstOpen ? 'open' : 'close'}>
              <div
                className="open__item"
                role="button"
                tabIndex={0}
                onClick={() => setType('Sellers')}
                onKeyPress={() => {}}
              >
                Sellers
              </div>
              <div
                className="open__item"
                role="button"
                tabIndex={0}
                onClick={() => setType('Buyers')}
                onKeyPress={() => {}}
              >
                Buyers
              </div>
            </div>
          </div>
          <h2>in</h2>
          <div
            className="popular__header__select"
            role="button"
            tabIndex={0}
            onClick={() => setSecondOpen(!isSecondOpen)}
            onKeyPress={() => {}}
          >
            {topTime}
            <img src={ArrowDown} alt="arrow down" />
            <div className={isSecondOpen ? 'open' : 'close'}>
              <div
                className="open__item"
                role="button"
                tabIndex={0}
                onClick={() => setTime('day')}
                onKeyPress={() => {}}
              >
                day
              </div>
              <div
                className="open__item"
                role="button"
                tabIndex={0}
                onClick={() => setTime('week')}
                onKeyPress={() => {}}
              >
                week
              </div>
              <div
                className="open__item"
                role="button"
                tabIndex={0}
                onClick={() => setTime('month')}
                onKeyPress={() => {}}
              >
                month
              </div>
            </div>
          </div>
        </div>
        <div className="popular__items">
          {users.length ? (
            users.map((item, index) => (
              <div key={item.id} className="item">
                <div className="item__number">{index + 1}.</div>
                <div className="item__img">
                  <img
                    className="item__img__avatar"
                    src={item.user.avatar}
                    alt={`avatar ${
                      item.user.display_name.length > 10
                        ? item.user.display_name.substr(0, 9)
                        : item.user.display_name
                    }`}
                  />
                  {item.user.is_verificated ? (
                    <img className="item__img__verified" src={Verified} alt="verified icon" />
                  ) : (
                    ''
                  )}
                </div>
                <div className="item__info">
                  <div className="item__info__name">
                    {item.user.display_name.length > 15
                      ? `${item.user.display_name.substr(0, 14)}...`
                      : item.user.display_name}
                  </div>
                  <div className="item__info__amount">${item.price}</div>
                </div>
              </div>
            ))
          ) : (
            <NoItemsFound />
          )}
        </div>
      </div>
    </div>
  );
});

export default Popular;

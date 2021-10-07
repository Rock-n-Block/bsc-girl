import React, { useCallback, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import BlueHeart from '../../assets/img/blue-heart.svg';
import BSCCZ from '../../assets/img/bsccz-logo.png';
import BSCGIRL from '../../assets/img/bscgirl-logo.png';
import BSCGIRLMOON from '../../assets/img/bscgirlmoon-logo.png';
import BUSD from '../../assets/img/busd-logo.png';
import CAKE from '../../assets/img/cake-logo.png';
import Cloud from '../../assets/img/cloud.svg';
import Crown from '../../assets/img/crown.svg';
import ArrowDownGradient from '../../assets/img/icons/arrow-gradient.svg';
import BNB from '../../assets/img/icons/logo-bnb.svg';
import MenuCardsActive from '../../assets/img/icons/menu-cards-active.svg';
import MenuCards from '../../assets/img/icons/menu-cards.svg';
import MenuRowsActive from '../../assets/img/icons/menu-rows-active.svg';
import MenuRows from '../../assets/img/icons/menu-rows.svg';
import PinkHeart from '../../assets/img/pink-heart.svg';
import Girl from '../../assets/img/staking-girl.svg';
import PreviewBg from '../../assets/img/staking-preview-bg.png';
import { NoItemsFound, StakeModal, StakingCard, StakingRow } from '../../components';
import { contracts } from '../../config';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { IPoolInfo } from '../../types';
import { clog, clogData } from '../../utils/logger';

import './Staking.scss';

const StakingPage: React.FC = observer(() => {
  const [sort, setSort] = useState('Hot');
  const [isSortOpen, setSortOpen] = useState(false);
  const [poolsData, setPoolsData] = useState([] as IPoolInfo[]);
  const [currentView, setCurrentView] = useState('cards');
  const [isStakedOnly, setStakedOnly] = useState(false);
  const { user } = useMst();
  const { contract, type } = contracts;
  const connector = useWalletConnectService();

  const tokenInfo = useRef({
    [contract.BSCGIRL.chain[type].address.toLowerCase()]: {
      name: 'BSCGIRL',
      logo: BSCGIRL,
    },
    [contract.BSCGIRLMOON.chain[type].address.toLowerCase()]: {
      name: 'BSCGIRLMOON',
      logo: BSCGIRLMOON,
    },
    [contract.BSCCZ.chain[type].address.toLowerCase()]: {
      name: 'BSCCZ',
      logo: BSCCZ,
    },
    [contract.BUSD.chain[type].address.toLowerCase()]: {
      name: 'BUSD',
      logo: BUSD,
    },
    [contract.CAKE.chain[type].address.toLowerCase()]: {
      name: 'CAKE',
      logo: CAKE,
    },
    [contract.BSCGIRL_BSCGIRLMOON_LP.chain[type].address.toLowerCase()]: {
      name: 'BSCGIRL_BSCGIRLMOON_LP',
      logo: BSCGIRL,
    },
    [contract.BSCGIRL_BSCCZ_LP.chain[type].address.toLowerCase()]: {
      name: 'BSCGIRL_BSCCZ_LP',
      logo: BSCGIRL,
    },
    [contract.BSCGIRLMOON_BSCCZ_LP.chain[type].address.toLowerCase()]: {
      name: 'BSCGIRLMOON_BSCCZ_LP',
      logo: BSCGIRLMOON,
    },
    '0x0000000000000000000000000000000000000000': {
      name: 'BNB',
      logo: BNB,
    },
  });

  const handleSort = (typeOfSort: string) => {
    const sortedArray = poolsData.sort((a, b) => {
      if (typeOfSort === 'Hot') {
        return a.amountStaked - b.amountStaked;
      }
      return a.APY - b.APY;
    });
    if (typeOfSort === 'APY High') {
      setPoolsData(sortedArray.reverse());
    } else {
      setPoolsData(sortedArray);
    }
    setSort(typeOfSort);
    setSortOpen(false);
  };

  const getPoolsData = useCallback((): void => {
    const data: IPoolInfo[] = [];
    for (let i = 0; i < 12; i += 1) {
      connector.connectorService
        .getContract('Staking')
        .methods.getPoolInfo(i)
        .call()
        .then((res: any) => {
          clogData('poolInfo:', res);
          data.push({
            poolId: i,
            // eslint-disable-next-line no-underscore-dangle
            rewardsToken: res.rewardsToken_.toLowerCase(),
            // eslint-disable-next-line no-underscore-dangle
            stakingToken: res.stakingToken_.toLowerCase(),
            // eslint-disable-next-line no-underscore-dangle
            amountStaked: +res.amountStaked_,
            // eslint-disable-next-line no-underscore-dangle
            stakeholders: res.stakeholders_,
            // eslint-disable-next-line no-underscore-dangle
            timeLockUp: +res.timeLockUp_,
            // eslint-disable-next-line no-underscore-dangle
            APY: +res.APY_,
            // eslint-disable-next-line no-underscore-dangle
            fee: +res.fee_,
          } as IPoolInfo);
        });
    }
    clogData('poolsData:', data);
    setPoolsData(data);
  }, [connector.connectorService]);

  const handleOnlyStaked = () => {
    const filteredData = poolsData.filter((pool) =>
      pool.stakeholders.find((holder) => holder.toLowerCase() === user.address),
    );
    if (!isStakedOnly) setPoolsData(filteredData);
    getPoolsData();
    setStakedOnly(!isStakedOnly);
  };

  useEffect(() => {
    getPoolsData();
  }, [getPoolsData]);

  clog('render stake');

  return (
    <div className="container">
      <div className="staking">
        <div className="staking__preview">
          <img src={PreviewBg} className="staking__preview__bg" alt="preview background" />
          <div className="staking__preview__content">
            <div className="staking__preview__content__title">Pools</div>
            <div className="staking__preview__content__text">
              Simply stake tokens to earn. High APR, low risk.
            </div>
          </div>
          <img src={BlueHeart} className="staking__preview__picture blue-heart" alt="blue heart" />
          <img src={PinkHeart} className="staking__preview__picture pink-heart" alt="pink heart" />
          <img src={Cloud} className="staking__preview__picture cloud" alt="cloud" />
          <img src={Crown} className="staking__preview__picture crown" alt="crown" />
          <img src={Girl} className="staking__preview__picture girl" alt="girl" />
        </div>
        <div className="staking__nav">
          <div className="staking__nav__switchers">
            <div
              className="staking__nav__switchers__rows"
              role="button"
              tabIndex={0}
              onKeyPress={() => {}}
              onClick={() => setCurrentView('rows')}
            >
              <img src={currentView === 'rows' ? MenuRowsActive : MenuRows} alt="menu rows" />
            </div>
            <div
              className="staking__nav__switchers__cards"
              role="button"
              tabIndex={0}
              onKeyPress={() => {}}
              onClick={() => setCurrentView('cards')}
            >
              <img src={currentView === 'cards' ? MenuCardsActive : MenuCards} alt="menu cards" />
            </div>
            <div className="switcher">
              <div
                className={`staking__nav__switchers__staked-only ${isStakedOnly ? 'active' : ''}`}
                role="button"
                tabIndex={0}
                onKeyPress={() => {}}
                onClick={handleOnlyStaked}
              >
                <div className={`switch-dot ${isStakedOnly ? 'on' : 'off'}`} />
              </div>
            </div>
            <span>Staked only</span>
          </div>
          <div className="staking__nav__items">
            <button
              type="button"
              className="staking__nav__items__sort grey-box"
              onClick={() => setSortOpen(!isSortOpen)}
            >
              Sort by {sort}
              <img
                className={isSortOpen ? 'up' : 'down'}
                src={ArrowDownGradient}
                alt="arrow down gradient"
              />
            </button>
            <div className={`staking__nav__items__sort grey-box ${isSortOpen ? 'open' : 'close'}`}>
              <button
                type="button"
                className="grey-box open__btn"
                onClick={() => handleSort('Hot')}
              >
                Hot
              </button>
              <button
                type="button"
                className="grey-box open__btn"
                onClick={() => handleSort('APY High')}
              >
                APY High
              </button>
              <button
                type="button"
                className="grey-box open__btn"
                onClick={() => handleSort('APY Low')}
              >
                APY Low
              </button>
            </div>
          </div>
        </div>
        <div className="staking__content" id="content">
          {poolsData.length ? (
            <div className={`staking__content__${currentView}`}>
              {poolsData.map((poolData) => {
                return currentView === 'cards' ? (
                  <StakingCard poolInfo={poolData} tokenInfo={tokenInfo.current} />
                ) : (
                  <StakingRow poolInfo={poolData} tokenInfo={tokenInfo.current} />
                );
              })}
            </div>
          ) : (
            <NoItemsFound />
          )}
        </div>
      </div>
      <StakeModal />
    </div>
  );
});

export default StakingPage;

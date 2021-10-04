import React, { useState } from 'react';
import { observer } from 'mobx-react';

import BlueHeart from '../../assets/img/blue-heart.svg';
import Cloud from '../../assets/img/cloud.svg';
import Crown from '../../assets/img/crown.svg';
import ArrowDownGradient from '../../assets/img/icons/arrow-gradient.svg';
import MenuCardsActive from '../../assets/img/icons/menu-cards-active.svg';
import MenuCards from '../../assets/img/icons/menu-cards.svg';
import MenuRowsActive from '../../assets/img/icons/menu-rows-active.svg';
import MenuRows from '../../assets/img/icons/menu-rows.svg';
import Search from '../../assets/img/icons/staking-search.svg';
import PinkHeart from '../../assets/img/pink-heart.svg';
import Girl from '../../assets/img/staking-girl.svg';
import PreviewBg from '../../assets/img/staking-preview-bg.png';
import { StakingCard } from '../../components';

import './Staking.scss';

const StakingPage: React.FC = observer(() => {
  const [currentView, setCurrentView] = useState('cards');
  const [isStakedOnly, setStakedOnly] = useState(false);
  const [isLive, setIsLive] = useState(true);

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
            <div
              className={`staking__nav__switchers__staked-only ${isStakedOnly ? 'active' : ''}`}
              role="button"
              tabIndex={0}
              onKeyPress={() => {}}
              onClick={() => setStakedOnly(!isStakedOnly)}
            >
              <div className={`switch-dot ${isStakedOnly ? 'on' : 'off'}`} />
            </div>
            <span>Staked only</span>
            <div
              className="staking__nav__switchers__activity"
              role="button"
              tabIndex={0}
              onKeyPress={() => {}}
              onClick={() => setIsLive(!isLive)}
            >
              <div className={`staking__nav__switchers__activity-item ${isLive ? 'active' : ''}`}>
                Live
              </div>
              <div className={`staking__nav__switchers__activity-item ${!isLive ? 'active' : ''}`}>
                Finished
              </div>
            </div>
          </div>
          <div className="staking__nav__items">
            <div className="staking__nav__items__sort grey-box">
              Sort by Hot
              <img src={ArrowDownGradient} alt="arrow down gradient" />
            </div>
            <div className="staking__nav__items__search grey-box">
              <img src={Search} alt="search" />
              Search pools
            </div>
          </div>
        </div>
        <div className="staking__content">
          {currentView === 'cards' ? (
            <div className="staking__content__cards">
              <StakingCard poolId={1} />
            </div>
          ) : (
            <div className="staking__content__rows">Rows</div>
          )}
        </div>
      </div>
    </div>
  );
});

export default StakingPage;

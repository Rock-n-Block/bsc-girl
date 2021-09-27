import React from 'react';

import BlueHeart from '../../assets/img/blue-heart.svg';
import Cloud from '../../assets/img/cloud.svg';
import Crown from '../../assets/img/crown.svg';
import PinkHeart from '../../assets/img/pink-heart.svg';
import Girl from '../../assets/img/staking-girl.svg';
import PreviewBg from '../../assets/img/staking-preview-bg.png';
import './Staking.scss';

const StakingPage: React.FC = () => {
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
      </div>
    </div>
  );
};

export default StakingPage;

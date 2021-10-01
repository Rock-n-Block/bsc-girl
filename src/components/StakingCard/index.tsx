import React from 'react';

import { IStakingItem } from '../../types';

import './StakingCard.scss';

const StakingCard: React.FC<IStakingItem> = () => {
  return (
    <div className="staking-card">
      <div className="staking-card__header">
        <div className="staking-card__header__info">
          <div className="title">Earn</div>
          <div className="currency">Stake</div>
        </div>
      </div>
    </div>
  );
};

export default StakingCard;

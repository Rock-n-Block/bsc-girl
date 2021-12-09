import React, { useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import Calculator from '../../assets/img/icons/calculator-pink.svg';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { IPoolInfo } from '../../types';
import { clogData } from '../../utils/logger';

import './StakingCard.scss';

type TypeStakingCardProps = {
  poolInfo: IPoolInfo;
  tokenInfo: { [key: string]: { name: string; logo: string } };
};

const StakingCard: React.FC<TypeStakingCardProps> = observer(({ poolInfo, tokenInfo }) => {
  const [isLoading, setLoading] = useState(false);
  const { user, modals } = useMst();
  const connector = useWalletConnectService();

  const handleUnlock = () => {
    modals.stakeModal.setPool(
      'Stake in pool',
      tokenInfo[poolInfo.stakingToken].name,
      tokenInfo[poolInfo.stakingToken].logo,
      poolInfo.poolId,
      poolInfo.fee,
    );
  };

  const handleIncrease = () => {
    modals.stakeModal.setPool(
      'Increase stake',
      tokenInfo[poolInfo.stakingToken].name,
      tokenInfo[poolInfo.stakingToken].logo,
      poolInfo.poolId,
      poolInfo.fee,
    );
  };

  const handleRemovePart = () => {
    modals.stakeModal.setPool(
      'Remove part of stake',
      tokenInfo[poolInfo.stakingToken].name,
      tokenInfo[poolInfo.stakingToken].logo,
      poolInfo.poolId,
      poolInfo.fee,
      poolInfo.infoForUser.amount,
    );
  };

  const handleWithdraw = () => {
    setLoading(true);
    connector.connectorService
      .getContract('Staking')
      .methods.withdrawReward(poolInfo.poolId, user.address)
      .send({
        from: user.address,
      })
      .then(() => {
        modals.info.setMsg('You have successfully withdrew reward!', 'success');
        setTimeout(() => document.location.reload(), 2000);
      })
      .catch((err: any) => {
        modals.error.setErr('Something went wrong');
        clogData('withdraw error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div key={poolInfo.poolId} className="staking-card">
      <div className="staking-card__header">
        <div className="staking-card__header__info">
          <div className="title">Earn {tokenInfo[poolInfo.rewardsToken]?.name}</div>
          <div className="currency">Stake {tokenInfo[poolInfo.stakingToken]?.name}</div>
        </div>
        <img src={tokenInfo[poolInfo.rewardsToken]?.logo} alt="token logo" />
      </div>
      <div className="staking-card__content">
        <div className="apy">
          APY:
          <div className="apy__value">
            {poolInfo.APY}%
            <img src={Calculator} alt="calculator icon" />
          </div>
        </div>
        <div className="profit">
          <div className="profit__title">
            Recent {tokenInfo[poolInfo.rewardsToken]?.name} profit:
          </div>
        </div>
        <div className="withdraw-fee">
          <div className="withdraw-fee__info">
            {poolInfo.infoForUser.reward
              ? new BigNumber(poolInfo.infoForUser.reward)
                  .dividedBy(new BigNumber(10).pow(poolInfo.infoForUser.rewardDecimals))
                  .toFixed(5, 1)
              : 0}
          </div>
          {poolInfo.infoForUser.isUnlocked && poolInfo.infoForUser.reward ? (
            <div className="withdraw-fee__date">
              {poolInfo.infoForUser.reward > 0 ? (
                <button type="button" className="gradient-button" onClick={() => handleWithdraw()}>
                  <span>{isLoading ? 'Wait...' : 'Collect'}</span>
                </button>
              ) : (
                ''
              )}
            </div>
          ) : (
            ''
          )}
        </div>
        {poolInfo.infoForUser.isUnlocked ? (
          <div className="staked">
            <div className="staked__title">{tokenInfo[poolInfo.stakingToken]?.name} Staked</div>
            <div className="staked__amount">
              <div className="staked__amount__value">
                {new BigNumber(poolInfo.infoForUser.amount)
                  .dividedBy(new BigNumber(10).pow(poolInfo.infoForUser.stakedDecimals))
                  .toFixed(5, 1)}
              </div>
              <div className="staked__amount__edit">
                <button
                  type="button"
                  className="staked__amount__edit-btn"
                  onClick={handleRemovePart}
                >
                  -
                </button>
                <button type="button" className="staked__amount__edit-btn" onClick={handleIncrease}>
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="unlock-wallet">
            Start farming
            <button type="button" onClick={handleUnlock} className="gradient-button">
              Unlock wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default StakingCard;

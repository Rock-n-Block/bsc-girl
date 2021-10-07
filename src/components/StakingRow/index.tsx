import React, { useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import ArrowDown from '../../assets/img/icons/arrow-down-gradient.svg';
import ArrowUp from '../../assets/img/icons/arrow-up-white.svg';
import Calculator from '../../assets/img/icons/calculator-pink.svg';
import Timer from '../../assets/img/icons/timer-icon.svg';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { IPoolInfo } from '../../types';
import { clogData } from '../../utils/logger';

import './StakingRow.scss';

type TypeStakingRowProps = {
  poolInfo: IPoolInfo;
  tokenInfo: { [key: string]: { name: string; logo: string } };
};

const StakingRow: React.FC<TypeStakingRowProps> = observer(({ poolInfo, tokenInfo }) => {
  const [isDetailsOpen, setDetailsOpen] = useState(false);
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
        modals.info.setMsg('You have successfully withdraw reward!', 'success');
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
    <div key={poolInfo.poolId} className="stake-row">
      <div className="stake-row__content">
        <div className="stake-row__info">
          <img src={tokenInfo[poolInfo.rewardsToken]?.logo} alt="rewards token logo" />
          <div className="stake-row__info__text">
            <div className="earned">Earn {tokenInfo[poolInfo.rewardsToken]?.name}</div>
            <div className="staked">Stake {tokenInfo[poolInfo.stakingToken]?.name}</div>
          </div>
        </div>
        <div className="stake-row__profit">
          <div className="title">Recent {tokenInfo[poolInfo.rewardsToken]?.name} profit</div>
          {new BigNumber(poolInfo.infoForUser.reward)
            .dividedBy(new BigNumber(10).pow(poolInfo.infoForUser.rewardDecimals))
            .toFixed(2, 1)}
        </div>
        <div className="stake-row__apy">
          <div className="title">APY</div>
          <div className="stake-row__apy__value">
            {poolInfo.APY}%
            <img src={Calculator} alt="calculator pink icon" />
          </div>
        </div>
        <div className="stake-row__total">
          <div className="title">Total staked</div>
          {new BigNumber(+poolInfo.amountStaked)
            .dividedBy(new BigNumber(10).pow(poolInfo.infoForUser.stakedDecimals))
            .toFixed(2, 1)}
        </div>
        {poolInfo.infoForUser.isUnlocked ? (
          <div className="stake-row__block">
            <div className="title">Ends in</div>
            {poolInfo.infoForUser.endsIn} blocks
            <img src={Timer} alt="timer icon" />
          </div>
        ) : (
          ''
        )}
        {poolInfo.infoForUser.isUnlocked ? (
          <button
            type="button"
            className="gradient-button"
            onClick={() => setDetailsOpen(!isDetailsOpen)}
          >
            <div className={isDetailsOpen ? `open` : 'close'}>
              <span className={!isDetailsOpen ? `gradient-text` : undefined}>Details</span>
              <img src={isDetailsOpen ? ArrowUp : ArrowDown} alt="arrow icon" />
            </div>
          </button>
        ) : (
          <button type="button" className="gradient-button" onClick={handleUnlock}>
            Unlock
          </button>
        )}
      </div>
      <div className={isDetailsOpen ? `stake-row__content pink` : 'hide'}>
        <div className="stake-row__get-profit">
          RECENT {tokenInfo[poolInfo.rewardsToken].name} profit
          <div className="stake-row__get-profit__content">
            {new BigNumber(poolInfo.infoForUser.reward)
              .dividedBy(new BigNumber(10).pow(poolInfo.infoForUser.rewardDecimals))
              .toFixed(2, 1)}
            <button type="button" className="gradient-button" onClick={handleWithdraw}>
              {isLoading ? 'Wait...' : 'Collect'}
            </button>
          </div>
        </div>
        <div className="stake-row__get-profit">
          STAKED {tokenInfo[poolInfo.stakingToken].name} tokens
          <div className="stake-row__get-profit__content">
            {new BigNumber(poolInfo.infoForUser.amount)
              .dividedBy(new BigNumber(10).pow(poolInfo.infoForUser.stakedDecimals))
              .toFixed(2, 1)}
            <div>
              <button type="button" className="gradient-button" onClick={handleRemovePart}>
                -
              </button>
              <button type="button" className="gradient-button" onClick={handleIncrease}>
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StakingRow;

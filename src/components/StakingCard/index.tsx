import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import BSCCZ from '../../assets/img/bsccz-logo.png';
import BSCGIRL from '../../assets/img/bscgirl-logo.png';
import BSCGIRLMOON from '../../assets/img/bscgirlmoon-logo.png';
import BUSD from '../../assets/img/busd-logo.png';
import CAKE from '../../assets/img/cake-logo.png';
import ArrowDownGradient from '../../assets/img/icons/arrow-down-gradient.svg';
import Calculator from '../../assets/img/icons/calculator-pink.svg';
import BNB from '../../assets/img/icons/logo-bnb.svg';
import Refresh from '../../assets/img/icons/refresh-icon.svg';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { IPoolInfo, IUserInfo } from '../../types';
import { clogData } from '../../utils/logger';

import './StakingCard.scss';

const tokenInfo: { [key: string]: { name: string; logo: string } } = {
  '0xfa7b244be4c24c091d3c949c61722c34c75e53ab': {
    name: 'BSCGIRL',
    logo: BSCGIRL,
  },
  '0x9014089e1ff54fa236485d349e5ddbe91b7063b2': {
    name: 'BSCGIRLMOON',
    logo: BSCGIRLMOON,
  },
  '0x9b91236f0d01674b145f9cfbb88237eb8c01fa42': {
    name: 'BSCCZ',
    logo: BSCCZ,
  },
  '0x00cdc2309f483fdba11cb63f89f5bccc0d365b3d': {
    name: 'BUSD',
    logo: BUSD,
  },
  '0x4ecb0b3af3b14c5db6053095bb5a9cc0d3eb702b': {
    name: 'CAKE',
    logo: CAKE,
  },
  '0x0000000000000000000000000000000000000000': {
    name: 'BNB',
    logo: BNB,
  },
};

type TypeStakingCardProps = {
  poolId: number;
};

const StakingCard: React.FC<TypeStakingCardProps> = observer(({ poolId }) => {
  const [isUnlocked, setUnlocked] = useState(false);
  const [poolInfo, setPoolInfo] = useState({} as IPoolInfo);
  const [infoForUser, setInfoForUser] = useState({} as IUserInfo);
  const { user } = useMst();
  const connector = useWalletConnectService();

  clogData('poolInfo:', poolInfo);
  clogData('infoForUser:', infoForUser);

  // const getPoolInfo = useCallback(() => {
  //
  // }, [connector.connectorService, poolId, user.address]);

  useEffect(() => {
    connector.connectorService
      .getContract('Staking')
      .methods.getPoolInfo(poolId)
      .call()
      .then((data: any) => {
        clogData('data:', data);
        setPoolInfo({
          // eslint-disable-next-line no-underscore-dangle
          rewardsToken: data.rewardsToken_.toLowerCase(),
          // eslint-disable-next-line no-underscore-dangle
          stakingToken: data.stakingToken_.toLowerCase(),
          // eslint-disable-next-line no-underscore-dangle
          amountStaked: data.amountStaked_,
          // eslint-disable-next-line no-underscore-dangle
          timeLockUp: data.timeLockUp_,
          // eslint-disable-next-line no-underscore-dangle
          fee: data.fee_,
          // eslint-disable-next-line no-underscore-dangle
          APY: data.APY_,
          // eslint-disable-next-line no-underscore-dangle
          stakeholders: data.stakeholders_,
        });
        // eslint-disable-next-line no-underscore-dangle
        if (data.stakeholders_.find((holder: string) => holder === user.address))
          connector.connectorService
            .getContract('Staking')
            .methods.getProcessInfoForUser(user.address, poolId)
            .then((info: any) => {
              clogData('info:', info);
              setInfoForUser({
                amount: info.amount,
                rewardGot: info.rewardGot,
                start: info.start,
              });
            });
        else
          setInfoForUser({
            amount: 0,
            rewardGot: 0,
            start: 0,
          });
      });
  }, [connector.connectorService, poolId, user.address]);

  return (
    <div className="staking-card">
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
          <div className="profit__value">{isUnlocked ? infoForUser.rewardGot : ''}</div>
        </div>
        <div className="withdraw-fee">
          <div className="withdraw-fee__info">
            {poolInfo.fee}% unstaking fee if withdrawn within 72h
          </div>
          <div className="withdraw-fee__date">
            {isUnlocked ? new Date(infoForUser.start)?.toDateString() : ''}
          </div>
        </div>
        {isUnlocked ? (
          <div className="staked">
            <div className="staked__title">
              {tokenInfo[poolInfo.stakingToken]?.name} Staked (compounding)
            </div>
            <div className="staked__amount">
              <div className="staked__amount__value">
                {infoForUser?.amount?.toFixed(3)}
                <div className="usd">~{1} USD</div>
              </div>
              <div className="staked__amount__edit">
                <button type="button" className="staked__amount__edit-btn">
                  -
                </button>
                <button type="button" className="staked__amount__edit-btn">
                  +
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="unlock-wallet">
            Start farming
            <button type="button" onClick={() => setUnlocked(true)} className="gradient-button">
              Unlock wallet
            </button>
          </div>
        )}
      </div>
      <div className={`staking-card__footer ${isUnlocked ? 'unlocked' : 'locked'}`}>
        {isUnlocked ? (
          <button type="button" className="gradient-button" onClick={() => {}}>
            <div className="auto">
              <img className="auto__refresh" src={Refresh} alt="refresh icon" />
              <div className="gradient-text">Auto</div>
              <img className="auto__arrow" src={ArrowDownGradient} alt="arrow down gradient" />
            </div>
          </button>
        ) : (
          ''
        )}
        <button type="button" className="gradient-button">
          <span className="details">
            <div className="gradient-text">Details</div>
            <img src={ArrowDownGradient} alt="arrow down gradient" />
          </span>
        </button>
      </div>
    </div>
  );
});

export default StakingCard;

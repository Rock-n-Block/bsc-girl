import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react';

import BSCCZ from '../../assets/img/bsccz-logo.png';
import BSCGIRL from '../../assets/img/bscgirl-logo.png';
import BSCGIRLMOON from '../../assets/img/bscgirlmoon-logo.png';
import BUSD from '../../assets/img/busd-logo.png';
import CAKE from '../../assets/img/cake-logo.png';
import Calculator from '../../assets/img/icons/calculator-pink.svg';
import BNB from '../../assets/img/icons/logo-bnb.svg';
import { contracts } from '../../config';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { IPoolInfo, IUserInfo } from '../../types';
import { clog, clogData } from '../../utils/logger';

import './StakingCard.scss';

const tokenInfo: { [key: string]: { name: string; logo: string } } = {
  '0x2442317d7d0b526a5238b5707fde9e593cd9e3df': {
    name: 'BSCGIRL',
    logo: BSCGIRL,
  },
  '0x164fa2edc4dd0e486b426d716ca38361a3e78735': {
    name: 'BSCGIRLMOON',
    logo: BSCGIRLMOON,
  },
  '0x9b91236f0d01674b145f9cfbb88237eb8c01fa42': {
    name: 'BSCCZ',
    logo: BSCCZ,
  },
  '0x8301f2213c0eed49a7e28ae4c3e91722919b8b47': {
    name: 'BUSD',
    logo: BUSD,
  },
  '0x4ecb0b3af3b14c5db6053095bb5a9cc0d3eb702b': {
    name: 'CAKE',
    logo: CAKE,
  },
  '0xab7f509424133b9fe8f07248dd7e084934cee390': {
    name: 'BSCGIRL_BSCGIRLMOON_LP',
    logo: BSCGIRL,
  },
  '0x53fc2fbd371c15bc07c2c090bbedd1e6e65d2c35': {
    name: 'BSCGIRL_BSCCZ_LP',
    logo: BSCGIRL,
  },
  '0x28315aff0850d46e2c21e33de8688233e555ad5f': {
    name: 'BSCGIRLMOON_BSCCZ_LP',
    logo: BSCGIRLMOON,
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
  const { user, modals } = useMst();
  const { contract } = contracts;
  const connector = useWalletConnectService();

  const endTime = infoForUser.start * 1000 + 259200000 - new Date().getTime();
  const days = endTime / 86400000;
  const hours = (endTime - days * 86400000) / 3600000;
  const minutes = (endTime - days * 86400000 - hours * 3600000) / 60000;

  const handleUnlock = () => {
    modals.stakeModal.setPool(
      'Stake in pool',
      tokenInfo[poolInfo.stakingToken].name,
      tokenInfo[poolInfo.stakingToken].logo,
      poolId,
    );
  };

  const handleIncrease = () => {
    modals.stakeModal.setPool(
      'Increase stake',
      tokenInfo[poolInfo.stakingToken].name,
      tokenInfo[poolInfo.stakingToken].logo,
      poolId,
    );
  };

  const handleRemovePart = () => {
    modals.stakeModal.setPool(
      'Remove part of stake',
      tokenInfo[poolInfo.stakingToken].name,
      tokenInfo[poolInfo.stakingToken].logo,
      poolId,
      infoForUser.amount,
    );
  };

  const handleWithdraw = () => {
    connector.connectorService
      .getContract('Staking')
      .methods.withdrawReward(modals.stakeModal.poolId, user.address)
      .send({
        from: user.address,
      })
      .then(() => {
        clog('successful withdraw');
      });
  };

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
        if (data.stakeholders_.find((holder: string) => holder.toLowerCase() === user.address)) {
          setUnlocked(true);
          connector.connectorService
            .getContract('Staking')
            .methods.getProcessInfoForUser(user.address, poolId)
            .call()
            .then((processData: any) => {
              setInfoForUser({
                amount: processData[0],
                rewardGot: processData[1],
                start: processData[2],
                decimals: contract[tokenInfo[poolInfo.rewardsToken].name]?.params?.decimals ?? 18,
              });
            });
        } else
          setInfoForUser({
            amount: 0,
            rewardGot: 0,
            start: 0,
            decimals: 18,
          });
      });
  }, [connector.connectorService, contract, poolId, poolInfo.rewardsToken, user.address]);

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
          <div className="profit__value">
            {isUnlocked
              ? new BigNumber(infoForUser.rewardGot)
                  .dividedBy(new BigNumber(10).pow(infoForUser.decimals))
                  .toFixed(3)
              : ''}
            {+infoForUser.rewardGot ? (
              <button type="button" className="gradient-button" onClick={() => handleWithdraw()}>
                Collect
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
        <div className="withdraw-fee">
          <div className="withdraw-fee__info">
            {poolInfo.fee}% unstaking fee if withdrawn within 72h
          </div>
          <div className="withdraw-fee__date">
            {isUnlocked ? `${days.toFixed(0)}d:${hours.toFixed(0)}h:${minutes.toFixed(0)}m` : ''}
          </div>
        </div>
        {isUnlocked ? (
          <div className="staked">
            <div className="staked__title">
              {tokenInfo[poolInfo.stakingToken]?.name} Staked (compounding)
            </div>
            <div className="staked__amount">
              <div className="staked__amount__value">
                {new BigNumber(infoForUser.amount)
                  .dividedBy(
                    new BigNumber(10).pow(
                      contract[tokenInfo[poolInfo.stakingToken].name]?.params?.decimals ?? 18
                    )
                  )
                  .toFixed(2)}
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

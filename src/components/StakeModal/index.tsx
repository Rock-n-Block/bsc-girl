import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react';

import Close from '../../assets/img/icons/close-icon-grey.svg';
import { contracts } from '../../config';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { clog, clogData } from '../../utils/logger';
import { InputNumber } from '../index';

import './StakeModal.scss';

const StakeModal: React.FC = observer(() => {
  const [staked, setStaked] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [balance, setBalance] = useState<BigNumber>(new BigNumber(0));
  const { modals, user } = useMst();
  const connector = useWalletConnectService();
  const { contract, type } = contracts;

  const closeModal = () => {
    modals.stakeModal.close();
    setBalance(new BigNumber(0));
    setStaked(0);
  };

  const handleStake = () => {
    const decimals = contract[modals.stakeModal.name]?.params?.decimals || 18;
    const amount = new BigNumber(staked).times(new BigNumber(10).pow(decimals)).toFixed(0, 1);
    if (modals.stakeModal.operation === 'Remove part of stake') {
      clog(amount);
      connector.connectorService
        .getContract('Staking')
        .methods.removePartOfStake(user.address, modals.createModal.poolId, amount)
        .send({
          from: user.address,
        })
        .then((tx: any) => {
          clogData('tx:', tx);
          setLoading(false);
          modals.closeAll();
          modals.info.setMsg('You have successfully remove part of stake', 'success');
          setTimeout(() => document.location.reload(), 2000);
        })
        .catch((err: any) => {
          clogData('remove part', err);
        });
    } else if (modals.stakeModal.name === 'BNB') {
      if (modals.stakeModal.operation === 'Stake in pool') {
        connector.connectorService
          .getContract('Staking')
          .methods.createStake(
            modals.stakeModal.poolId,
            new BigNumber(amount).dividedBy(10).pow(18),
          )
          .send({
            from: user.address,
            value: amount,
          })
          .then(() => {
            modals.info.setMsg('You have successfully staked BNB!', 'success');
          });
      } else if (modals.stakeModal.operation === 'Increase stake') {
        connector.connectorService
          .getContract('Staking')
          .methods.increaseStake(
            modals.stakeModal.poolId,
            new BigNumber(amount).dividedBy(10).pow(18),
          )
          .send({
            from: user.address,
            value: amount,
          })
          .then(() => {
            modals.info.setMsg('You have successfully staked BNB!', 'success');
          });
      } else {
        connector.connectorService
          .getContract('Staking')
          .methods.removePartOfStake(
            user.address,
            modals.stakeModal.poolId,
            new BigNumber(amount).dividedBy(10).pow(18),
          )
          .send({
            from: user.address,
            value: amount,
          })
          .then(() => {
            modals.info.setMsg('You have successfully staked BNB!', 'success');
          });
      }
    } else {
      setLoading(true);
      try {
        connector.connectorService
          .approveToken(
            modals.stakeModal.name,
            decimals,
            contract.STAKING.chain[type].address,
            user.address,
          )
          .then(() => {
            connector.connectorService
              .getAllowance(
                amount,
                user.address,
                contract.STAKING.chain[type].address,
                modals.stakeModal.name,
              )
              .then(() => {
                connector.connectorService
                  .getContract(modals.stakeModal.name)
                  .methods.approve(contract.STAKING.chain[type].address, amount)
                  .send({
                    from: user.address,
                  })
                  .then(() => {
                    clog('approved');
                    if (modals.stakeModal.operation === 'Stake in pool') {
                      connector.connectorService
                        .getContract('Staking')
                        .methods.createStake(amount, modals.stakeModal.poolId)
                        .send({
                          from: user.address,
                        })
                        .then((tx: any) => {
                          clogData('tx:', tx);
                          setLoading(false);
                          modals.closeAll();
                          modals.info.setMsg('You have successfully staked tokens!', 'success');
                          setTimeout(() => document.location.reload(), 2000);
                        })
                        .catch((err: any) => {
                          clogData('createStake', err);
                        });
                    } else {
                      connector.connectorService
                        .getContract('Staking')
                        .methods.increaseStake(modals.stakeModal.poolId, amount)
                        .send({
                          from: user.address,
                        })
                        .then((tx: any) => {
                          clogData('tx:', tx);
                          setLoading(false);
                          modals.closeAll();
                          modals.info.setMsg('You have successfully increase stake', 'success');
                          setTimeout(() => document.location.reload(), 2000);
                        })
                        .catch((err: any) => {
                          clogData('increaseStake', err);
                        });
                    }
                  })
                  .catch((err: any) => {
                    clogData('approve', err);
                  });
              })
              .catch((err: any) => {
                clogData('get allowance', err);
              });
          })
          .catch((err: any) => {
            clogData('approveToken', err);
          });
      } catch (err: any) {
        modals.closeAll();
        modals.error.setErr(err.message);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (modals.stakeModal.operation !== 'Remove part of stake') {
      if (modals.stakeModal.name && modals.stakeModal.name !== 'BNB' && user.address) {
        const decimals = contract[modals.stakeModal.name]?.params?.decimals || 18;
        connector.connectorService
          .getTokenBalance(user.address, modals.stakeModal.name)
          .then((value: any) => {
            setBalance(new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals)));
          });
      } else if (modals.stakeModal.name && user.address) setBalance(user.balance.bnb);
    } else if (modals.stakeModal.stakedAmount) {
      const decimals = contract[modals.stakeModal.name]?.params?.decimals || 18;
      setBalance(
        new BigNumber(modals.stakeModal.stakedAmount).dividedBy(new BigNumber(10).pow(decimals)),
      );
    }
  }, [
    connector.connectorService,
    contract,
    modals.stakeModal.name,
    modals.stakeModal.operation,
    modals.stakeModal.stakedAmount,
    user,
  ]);

  return (
    <Modal
      className="stake-modal"
      isOpen={modals.stakeModal.isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      shouldCloseOnOverlayClick
    >
      <div className="stake-modal__header">
        <div className="stake-modal__header__title">{modals.stakeModal.operation}</div>
        <button type="button" className="stake-modal__header__close" onClick={closeModal}>
          <img src={Close} alt="close icon" />
        </button>
      </div>
      <div className="stake-modal__form">
        <div className="stake-modal__form__label">
          <div className="title">
            {modals.stakeModal.operation === 'Stake in pool' ? 'Stake' : ''}
            {modals.stakeModal.operation === 'Increase stake' ? 'Increase' : ''}
            {modals.stakeModal.operation === 'Remove part of stake' ? 'Remove' : ''}
          </div>
          <div className="currency">
            <img src={modals.stakeModal.logo} alt="currency logo" />
            {modals.stakeModal.name}
          </div>
        </div>
        <div className="stake-modal__form__input">
          <InputNumber
            max={+balance}
            value={staked}
            positiveOnly
            id="set staked"
            onChange={(e: any) => setStaked(e.target.value)}
          />
        </div>
        <div className="stake-modal__form__footer">
          <div className="stake-modal__form__fee">Fee {modals.stakeModal.fee}%</div>
          <div className="stake-modal__form__balance">{`Balance: ${+balance}`}</div>
        </div>
        <div className="stake-modal__form__range">
          <input
            type="range"
            min={1}
            max={100}
            className="slider"
            onChange={(e: any) => setStaked((e.target.value / 100) * +balance)}
          />
        </div>
        <div className="stake-modal__form__buttons">
          <button type="button" className="btn-item" onClick={() => setStaked(+balance * 0.25)}>
            <span>25%</span>
          </button>
          <button type="button" className="btn-item" onClick={() => setStaked(+balance * 0.5)}>
            <span>50%</span>
          </button>
          <button type="button" className="btn-item" onClick={() => setStaked(+balance * 0.75)}>
            <span>75%</span>
          </button>
          <button type="button" className="btn-item" onClick={() => setStaked(+balance)}>
            <span>Max</span>
          </button>
        </div>
        <button type="button" className="gradient-button confirm" onClick={handleStake}>
          {isLoading ? 'In progress...' : 'Confirm'}
        </button>
        {modals.stakeModal.operation !== 'Remove part of stake' ? (
          <button type="button" className="gradient-button get-currency">
            <div className="white-area">
              <span className="gradient-text">Get {modals.stakeModal.name}</span>
            </div>
          </button>
        ) : (
          ''
        )}
      </div>
    </Modal>
  );
});

export default StakeModal;

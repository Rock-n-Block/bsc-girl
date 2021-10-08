import React, { useEffect, useRef, useState } from 'react';
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
  const [balance, setBalance] = useState(new BigNumber(0));
  const { modals, user } = useMst();
  const connector = useWalletConnectService();
  const { contract, type } = contracts;
  const contractRef = useRef(contract);

  const closeModal = () => {
    modals.stakeModal.close();
    setBalance(new BigNumber(0));
    setStaked(0);
  };

  const handleStake = () => {
    setLoading(true);
    const decimals = contract[modals.stakeModal.name]?.params?.decimals || 18;
    const amount = new BigNumber(staked).times(new BigNumber(10).pow(decimals)).toFixed(0, 1);
    try {
      if (modals.stakeModal.operation === 'Remove part of stake') {
        connector.connectorService
          .getContract('Staking')
          .methods.removePartOfStake(user.address, modals.stakeModal.poolId, amount)
          .send({
            from: user.address,
          })
          .then((tx: any) => {
            clogData('tx:', tx);
            setLoading(false);
            modals.closeAll();
            modals.info.setMsg('You have successfully removed part of stake', 'success');
            setTimeout(() => document.location.reload(), 2000);
          })
          .catch((err: any) => {
            clogData('remove part', err);
          });
      } else if (modals.stakeModal.name === 'BNB') {
        if (modals.stakeModal.operation === 'Stake in pool') {
          connector.connectorService
            .getContract('Staking')
            .methods.createStake(amount, modals.stakeModal.poolId)
            .send({
              from: user.address,
              value: amount,
            })
            .then(() => {
              modals.info.setMsg('You have successfully staked BNB!', 'success');
              setTimeout(() => document.location.reload(), 2000);
            });
        } else {
          connector.connectorService
            .getContract('Staking')
            .methods.increaseStake(modals.stakeModal.poolId, amount)
            .send({
              from: user.address,
              value: amount,
            })
            .then(() => {
              modals.info.setMsg('You have successfully staked BNB!', 'success');
              setTimeout(() => document.location.reload(), 2000);
            });
        }
      } else {
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
      }
    } catch (err: any) {
      modals.closeAll();
      modals.error.setErr(err.message);
      clogData('staking', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.address) {
      const decimals = contractRef.current[modals.stakeModal.name]?.params?.decimals || 18;
      let value: any;
      if (modals.stakeModal.operation !== 'Remove part of stake') {
        if (modals.stakeModal.name !== 'BNB' && user.address) {
          connector.connectorService
            .getTokenBalance(user.address, modals.stakeModal.name)
            .then((res: any) => {
              value = new BigNumber(res).dividedBy(new BigNumber(10).pow(decimals));
              setBalance(value);
              setStaked(value * 0.5);
            });
        } else if (user.address) {
          setBalance(user.balance.bnb);
          setStaked(user.balance.bnb * 0.5);
        }
      } else if (modals.stakeModal.stakedAmount) {
        value = new BigNumber(modals.stakeModal.stakedAmount).dividedBy(
          new BigNumber(10).pow(decimals),
        );
        setBalance(value);
        setStaked(value * 0.5);
      }
    }
  }, [
    connector.connectorService,
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
          <div className="stake-modal__form__fee">
            {modals.stakeModal.fee ? `Fee ${modals.stakeModal.fee}%` : ''}
          </div>
          <div className="stake-modal__form__balance">
            {`${
              modals.stakeModal.operation === 'Remove part of stake' ? 'Staked' : 'Balance'
            }: ${+balance}`}
          </div>
        </div>
        <div className="stake-modal__form__range">
          <input
            type="range"
            min={1}
            max={100}
            className="slider"
            onChange={(e: any) => setStaked((+balance / 100) * e.target.value)}
          />
        </div>
        <div className="stake-modal__form__buttons">
          <button type="button" className="btn-item" onClick={() => setStaked(+balance / 4)}>
            <span>25%</span>
          </button>
          <button type="button" className="btn-item" onClick={() => setStaked(+balance / 2)}>
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

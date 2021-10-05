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
  const [balance, setBalance] = useState<BigNumber>();
  const { modals, user } = useMst();
  const connector = useWalletConnectService();
  const { contract, type } = contracts;

  const closeModal = () => {
    modals.stakeModal.close();
  };

  const handleStake = () => {
    setLoading(true);
    try {
      const decimals = contract[modals.stakeModal.name]?.params?.decimals || 18;
      const amount = new BigNumber(staked).times(new BigNumber(10).pow(decimals)).toFixed(0, 1);
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
                    })
                    .catch((err: any) => {
                      clogData('createStake', err);
                    });
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
  };

  useEffect(() => {
    if (modals.stakeModal.name && modals.stakeModal.name !== 'BNB' && user.address) {
      const decimals = contract[modals.stakeModal.name]?.params?.decimals || 18;
      connector.connectorService
        .getTokenBalance(user.address, modals.stakeModal.name)
        .then((value: any) => {
          return setBalance(new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals)));
        });
    } else if (modals.stakeModal.name && user.address) setBalance(user.balance.bnb);
  }, [connector.connectorService, contract, modals.stakeModal.name, user]);

  return (
    <Modal
      className="stake-modal"
      isOpen={modals.stakeModal.isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      shouldCloseOnOverlayClick
    >
      <div className="stake-modal__header">
        <div className="stake-modal__header__title">Stake in pool</div>
        <button type="button" className="stake-modal__header__close" onClick={closeModal}>
          <img src={Close} alt="close icon" />
        </button>
      </div>
      <div className="stake-modal__form">
        <div className="stake-modal__form__label">
          <div className="title">Stake</div>
          <div className="currency">
            <img src={modals.stakeModal.logo} alt="currency logo" />
            {modals.stakeModal.name}
          </div>
        </div>
        <div className="stake-modal__form__input">
          <InputNumber
            max={Number(balance)}
            value={staked}
            positiveOnly
            id="set staked"
            onChange={(e: any) => setStaked(e.target.value)}
          />
        </div>
        <div className="stake-modal__form__balance">{`Balance: ${balance}`}</div>
        <div className="stake-modal__form__range">
          <input
            type="range"
            min={1}
            max={100}
            className="slider"
            onChange={(e: any) => setStaked((e.target.value / 100) * Number(balance))}
          />
        </div>
        <div className="stake-modal__form__buttons">
          <button
            type="button"
            className="btn-item"
            onClick={() => setStaked(Number(balance) * 0.25)}
          >
            <span>25%</span>
          </button>
          <button
            type="button"
            className="btn-item"
            onClick={() => setStaked(Number(balance) * 0.5)}
          >
            <span>50%</span>
          </button>
          <button
            type="button"
            className="btn-item"
            onClick={() => setStaked(Number(balance) * 0.75)}
          >
            <span>75%</span>
          </button>
          <button type="button" className="btn-item" onClick={() => setStaked(Number(balance))}>
            <span>Max</span>
          </button>
        </div>
        <button type="button" className="gradient-button confirm" onClick={handleStake}>
          {isLoading ? 'In progress...' : 'Confirm'}
        </button>
        <button type="button" className="gradient-button get-currency">
          <div className="white-area">
            <span className="gradient-text">Get {modals.stakeModal.name}</span>
          </div>
        </button>
      </div>
    </Modal>
  );
});

export default StakeModal;

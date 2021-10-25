import React, { useState } from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';

import Close from '../../assets/img/icons/close-icon.svg';
import { storeApi } from '../../services/api';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';
import { InputNumber } from '../index';

import './TransferModal.scss';

type TypeTransferModalProps = {
  tokenId: number;
  available: number;
};

const TransferModal: React.FC<TypeTransferModalProps> = observer(({ tokenId, available }) => {
  const { modals, user } = useMst();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [amountError, setAmountError] = useState('');
  const connector = useWalletConnectService();

  const closeModal = () => {
    modals.transferModal.close();
  };

  const handleChangeAmount = (e: any) => {
    setAmount(e.target.value);
    if (e.target.value > available) {
      setAmountError("amount can't be more then available");
    } else {
      setAmountError('');
    }
  };

  const handleConfirm = async () => {
    if (!amountError) {
      try {
        setLoading(true);
        const res = await storeApi.transfer(tokenId, address, amount);
        connector.connectorService
          .sendTransaction(user.address, res.data.initial_tx)
          .then(() => {
            modals.info.setMsg('You have successfully transferred token', 'success');
          })
          .catch((err: any) => {
            clogData('send transaction', err);
          })
          .finally(() => {
            setLoading(false);
            closeModal();
          });
      } catch (err: any) {
        clogData('transfer', err);
      }
    }
  };

  return (
    <Modal
      isOpen={modals.transferModal.isOpen}
      className="transfer-modal"
      onRequestClose={closeModal}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
    >
      <div className="transfer-modal__header">
        Transfer token
        <button type="button" className="transfer-modal__header__close" onClick={closeModal}>
          <img src={Close} alt="close icon" />
        </button>
      </div>
      <div className="transfer-modal__description">
        You can transfer tokens from your address to another
      </div>
      <div className="transfer-modal__input">
        <div className="transfer-modal__input__label">Receiver address</div>
        <div className="transfer-modal__input__field">
          <div className="input-address">
            <input
              type="text"
              value={address}
              placeholder="Paste address"
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="transfer-modal__input">
        <div className="transfer-modal__input__label">Amount of tokens</div>
        <div className="transfer-modal__input__field">
          <div className="input-address">
            <InputNumber
              value={amount}
              placeholder="Paste address"
              onChange={handleChangeAmount}
              id="amount"
              positiveOnly
            />
          </div>
        </div>
      </div>
      {amountError ? <div className="error-message">{amountError}</div> : ''}
      <button type="button" className="transfer-modal__confirm" onClick={handleConfirm}>
        {isLoading ? 'In process...' : 'Continue'}
      </button>
      <button type="button" className="transfer-modal__cancel" onClick={closeModal}>
        Cancel
      </button>
    </Modal>
  );
});

export default TransferModal;

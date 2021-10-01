import React from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';

import { CheckoutForm } from '../../forms';
import { useMst } from '../../store/store';

import './CheckoutModal.scss';

interface ICheckoutModal {
  handleBuy: (quantity: number) => {};
  isLoading: boolean;
}

const CheckoutModal: React.FC<ICheckoutModal> = observer(({ handleBuy, isLoading }) => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.checkout.close();
  };

  return (
    <Modal
      isOpen={modals.checkout.getIsOpen}
      className="checkout"
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
    >
      <div className="checkout__title">Checkout</div>
      <div className="checkout__subtitle">
        You are about to purchase{' '}
        <span className="checkout__subtitle__token">{modals.checkout.token.name}</span>
      </div>
      <CheckoutForm
        available={modals.checkout.token.available}
        handleBuy={handleBuy}
        isLoading={isLoading}
      />
    </Modal>
  );
});

export default CheckoutModal;

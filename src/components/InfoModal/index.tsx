import React from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../store/store';

import './InfoModal.scss';

const InfoModal: React.FC = observer(() => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.info.close();
  };

  return (
    <Modal
      isOpen={!!modals.info.msg}
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick
      className="gradient-box info-modal"
      ariaHideApp={false}
    >
      <div className="info-modal__content">
        <p className="info-modal__content__text">{modals.info.msg}</p>
        <button type="button" className="info-modal__content__btn" onClick={handleClose}>
          {modals.info.type === 'error' ? 'Ok' : 'Awesome'}
        </button>
      </div>
    </Modal>
  );
});

export default InfoModal;

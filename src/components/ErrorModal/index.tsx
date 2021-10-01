import React from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../store/store';

import './ErrorModal.scss';

const ErrorModal: React.FC = observer(() => {
  const { modals } = useMst();
  const handleClose = (): void => {
    modals.error.setErr('');
  };
  return (
    <Modal
      isOpen={!!modals.error.errMsg}
      className="error"
      shouldCloseOnOverlayClick
      onRequestClose={handleClose}
      ariaHideApp={false}
    >
      <div className="error__content">
        <p className="error__content__text">{`⚠️${modals.error.errMsg}`}</p>
      </div>
    </Modal>
  );
});

export default ErrorModal;

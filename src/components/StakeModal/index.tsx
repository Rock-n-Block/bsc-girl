import React from 'react';
import Modal from 'react-modal';

import Close from '../../assets/img/icons/close-icon-grey.svg';
import { useMst } from '../../store/store';

import './StakeModal.scss';

type TypeStakeModalProps = {
  img: string;
  currencyAddress: string;
};

const StakeModal: React.FC<TypeStakeModalProps> = ({ img, currencyAddress }) => {
  // const [staked, setStaked] = useState(0.5);
  const { modals } = useMst();

  const closeModal = () => {
    modals.stakeModal.close();
  };

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
            <img src={img} alt="currency logo" />
            {currencyAddress}
          </div>
        </div>
        <div className="stake-modal__form__input">
          <input type="number" value={1} />
        </div>
      </div>
    </Modal>
  );
};

export default StakeModal;

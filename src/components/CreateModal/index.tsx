import React from 'react';
import Modal from 'react-modal';

import Close from '../../assets/img/icons/close-icon.svg';
import { useMst } from '../../store/store';

import './CreateModal.scss';

type TypeCreateModalProps = {
  closeModal: () => void;
  approveStatus: { text: string; img: string };
  uploadStatus: { text: string; img: string };
  signStatus: { text: string; img: string };
};

const CreateModal: React.FC<TypeCreateModalProps> = ({
  closeModal,
  approveStatus,
  uploadStatus,
  signStatus,
}) => {
  const { modals } = useMst();
  const steps = [
    {
      title: 'Approve',
      text: 'Approve performing transactions with your wallet',
      img: approveStatus.img || '',
      status: approveStatus.text || '',
    },
    {
      title: 'Upload files & Mint token',
      text: 'Call contract method',
      img: uploadStatus.img || '',
      status: uploadStatus.text || '',
    },
    {
      title: 'Sign lock order',
      text: 'Sign sell order using your wallet',
      img: signStatus.img || '',
      status: signStatus.text || '',
    },
  ];

  const switchStatusBg = (status: string): string => {
    if (status === 'Start now') return 'soft-red-bg';
    if (status === 'In progress...') return 'soft-red-bg-active';
    return 'light-grey-bg';
  };

  const switchProgressBg = (status: string): string => {
    if (status === 'Start now') return 'grey-bg';
    if (status === 'In progress...') return 'loader';
    return 'green-bg';
  };

  const afterOpen = () => {};

  return (
    <Modal
      isOpen={modals.createModal.isOpen}
      onAfterOpen={afterOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      contentLabel="Follow steps"
      className="modal"
    >
      <div className="modal__header">
        <div className="modal__header__title">Follow steps</div>
        <button type="button" className="modal__header__close" onClick={() => closeModal()}>
          <img src={Close} alt="close icon" />
        </button>
      </div>
      <div className="modal__steps">
        {steps.map((step) => (
          <div key={step.title} className="step">
            <div className="step__info">
              <div className={`step__info__progress ${switchProgressBg(step.status)}`}>
                <img src={step.img} alt="progress icon" />
              </div>
              <div className="step__info__description">
                <div className="step__info__description__title">{step.title}</div>
                <div className="step__info__description__text">{step.text}</div>
              </div>
            </div>
            <div className={`step__status ${switchStatusBg(step.status)}`}>{step.status}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default CreateModal;

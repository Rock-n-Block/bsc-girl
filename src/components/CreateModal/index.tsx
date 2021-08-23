import React, { useState } from 'react';
import Modal from 'react-modal';

import Bag from '../../assets/img/icons/bag.svg';
import CheckMarkWhite from '../../assets/img/icons/check-mark-white.svg';
import Close from '../../assets/img/icons/close-icon.svg';
import Loader from '../../assets/img/icons/loader.svg';
import Pencil from '../../assets/img/icons/pencil.svg';

import './CreateModal.scss';

type TypeCreateModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

const CreateModal: React.FC<TypeCreateModalProps> = ({ isOpen, closeModal }) => {
  const [approveStatus, setApproveStatus] = useState({ text: 'In progress...', img: Loader });
  const [uploadStatus, setUploadStatus] = useState({ text: 'Start now', img: Pencil });
  const [signStatus, setSignStatus] = useState({ text: 'Start now', img: Bag });

  const steps = [
    {
      title: 'Approve',
      text: 'Approve performing transactions with your wallet',
      img: approveStatus.img,
      status: approveStatus.text,
    },
    {
      title: 'Upload files & Mint token',
      text: 'Call contract method',
      img: uploadStatus.img,
      status: uploadStatus.text,
    },
    {
      title: 'Sign lock order',
      text: 'Sign sell order using your wallet',
      img: signStatus.img,
      status: signStatus.text,
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

  const afterOpen = () => {
    setTimeout(() => {
      setApproveStatus({ text: 'Done', img: CheckMarkWhite });
      setUploadStatus({ text: 'In progress...', img: Loader });
    }, 1500);

    setTimeout(() => {
      setUploadStatus({ text: 'Done', img: CheckMarkWhite });
      setSignStatus({ text: 'In progress...', img: Loader });
    }, 3000);

    setTimeout(() => {
      setSignStatus({ text: 'Done', img: CheckMarkWhite });
    }, 4500);

    setTimeout(() => {
      closeModal();
    }, 5500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={afterOpen}
      onRequestClose={closeModal}
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

import React, { useState } from 'react';
import Modal from 'react-modal';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import Bag from '../../assets/img/icons/bag.svg';
import CheckMarkWhite from '../../assets/img/icons/check-mark-white.svg';
import Close from '../../assets/img/icons/close-icon.svg';
import Loader from '../../assets/img/icons/loader.svg';
import Pencil from '../../assets/img/icons/pencil.svg';
import { storeApi } from '../../services/api';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';

import './CreateModal.scss';

type TypeCreateModalProps = {
  values: any;
  isSingle: boolean;
};

const CreateModal: React.FC<TypeCreateModalProps> = observer(({ values, isSingle }) => {
  const [approveStatus, setApproveStatus] = useState({ text: 'In progress...', img: Loader });
  const [uploadStatus, setUploadStatus] = useState({ text: 'Start now', img: Pencil });
  const [signStatus, setSignStatus] = useState({ text: 'Start now', img: Bag });
  const history = useHistory();
  const { modals, user } = useMst();
  const connector = useWalletConnectService();

  let step = 'approve';

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

  const closeModal = () => {
    modals.createModal.close();
  };

  const goToNextStep = () => {
    if (step === 'approve') {
      setApproveStatus({ text: 'Done', img: CheckMarkWhite });
      setUploadStatus({ text: 'In progress...', img: Loader });
      step = 'upload';
    } else if (step === 'upload') {
      setUploadStatus({ text: 'Done', img: CheckMarkWhite });
      setSignStatus({ text: 'In progress...', img: Loader });
      step = 'sign';
    } else {
      setSignStatus({ text: 'Done', img: CheckMarkWhite });
      setTimeout(() => {
        closeModal();
      }, 500);
    }
  };

  const createToken = () => {
    const formData = new FormData();
    formData.append('media', values.img);
    formData.append('format', values.format);
    formData.append('name', values.tokenName);
    formData.append('total_supply', isSingle ? '1' : values.numberOfCopies.toString());
    formData.append('description', values.tokenDescription);
    formData.append('price', values.price.toString() === '' ? '0' : values.price.toString());
    formData.append('creator_royalty', values.tokenRoyalties.toString());
    formData.append('standart', isSingle ? 'ERC721' : 'ERC1155');
    formData.append('currency', values.currency);
    formData.append('collection', isSingle ? '3' : '4');
    formData.append('selling', values.selling.toString());

    goToNextStep();

    storeApi
      .createToken(formData)
      .then(({ data }) => {
        goToNextStep();
        clogData('data', data.initial_tx);
        connector.connectorService
          .sendTransaction(user.address, data.initial_tx)
          .then(() => {
            history.push(data.id ? `/token/${data.id}` : '/');
            modals.createModal.close();
            modals.info.setMsg(
              'Congrats you create your own NFT! Please wait while your token is minted',
              'success',
            );
            goToNextStep();
          })
          .catch((err: any) => {
            modals.createModal.close();
            modals.error.setErr('Something went wrong with send transaction');
            clogData('sendTransaction', err);
          });
      })
      .catch((err) => {
        modals.createModal.close();
        modals.info.setMsg(
          `${Object.keys(err.response.data)[0]}: ${Object.values(err.response.data)[0]}`,
          'error',
        );
        clogData('createToken', err.response);
      });
  };

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

  return (
    <Modal
      isOpen={modals.createModal.isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      onAfterOpen={createToken}
      contentLabel="Follow steps"
      className="modal"
    >
      <div className="modal__header">
        <div className="modal__header__title">Follow steps</div>
        <button type="button" className="modal__header__close" onClick={closeModal}>
          <img src={Close} alt="close icon" />
        </button>
      </div>
      <div className="modal__steps">
        {steps.map((item) => (
          <div key={item.title} className="step">
            <div className="step__info">
              <div className={`step__info__progress ${switchProgressBg(item.status)}`}>
                <img src={item.img} alt="progress icon" />
              </div>
              <div className="step__info__description">
                <div className="step__info__description__title">{item.title}</div>
                <div className="step__info__description__text">{item.text}</div>
              </div>
            </div>
            <div className={`step__status ${switchStatusBg(item.status)}`}>{item.status}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
});

export default CreateModal;

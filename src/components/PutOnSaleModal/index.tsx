import React from 'react';
import Modal from 'react-modal';

import CloseImg from '../../assets/img/icons/close-icon.svg';
import { PutOnSaleForm } from '../../forms';
import { useMst } from '../../store/store';

import './PutOnSaleModal.scss';

interface IPutOnSaleModal {
  tokenData: any;
  handleSetTokenData: (data: any) => void;
  handleApproveNft: () => Promise<void>;
}

const PutOnSaleModal: React.FC<IPutOnSaleModal> = ({
  tokenData,
  handleSetTokenData,
  handleApproveNft,
}) => {
  const { modals } = useMst();
  const closePutOnSale = () => {
    modals.putOnSale.close();
  };
  return (
    <Modal
      className="put-on-sale"
      isOpen={!!modals.putOnSale.isOpen}
      onRequestClose={closePutOnSale}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
    >
      <div className="put-on-sale__header">
        <div className="put-on-sale__header__title">Put on sale</div>
        <button type="button" onClick={closePutOnSale} className="put-on-sale__header__close">
          <img src={CloseImg} alt="close" />
        </button>
      </div>
      <PutOnSaleForm
        handleApproveNft={handleApproveNft}
        totalSupply={0}
        tokenData={tokenData}
        handleSetTokenData={handleSetTokenData}
        closeModal={closePutOnSale}
      />
    </Modal>
  );
};

export default PutOnSaleModal;

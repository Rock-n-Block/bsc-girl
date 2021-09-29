import React from 'react';
import Modal from 'react-modal';

import CloseImg from '../../assets/img/icons/close-icon.svg';
import PutOnSaleForm from '../../forms/PutOnSaleForm/container';

import './PutOnSaleModal.scss';

interface IPutOnSaleModal {
  tokenId: number;
  handleSetTokenData: (data: any) => void;
  handleApproveNft: () => Promise<void>;
  closePutOnSale: () => void;
}

const PutOnSaleModal: React.FC<IPutOnSaleModal> = ({
  tokenId,
  handleSetTokenData,
  handleApproveNft,
  closePutOnSale,
}) => {
  return (
    <Modal className="put-on-sale" isOpen onRequestClose={closePutOnSale} shouldCloseOnOverlayClick>
      <div className="put-on-sale__header">
        <div className="put-on-sale__header__title">Put on sale</div>
        <button type="button" onClick={closePutOnSale} className="put-on-sale__header__close">
          <img src={CloseImg} alt="close" />
        </button>
      </div>
      <PutOnSaleForm
        handleApproveNft={handleApproveNft}
        totalSupply={0}
        tokenId={tokenId}
        handleSetTokenData={handleSetTokenData}
        closeModal={closePutOnSale}
      />
    </Modal>
  );
};

export default PutOnSaleModal;

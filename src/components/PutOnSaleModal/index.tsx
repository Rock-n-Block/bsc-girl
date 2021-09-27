import React from 'react';
import Modal from 'react-modal';

import PutOnSaleForm from '../../forms/PutOnSaleForm/container';

import './PutOnSaleModal.scss';

interface IPutOnSaleModal {
  tokenId: number;
  handleSetTokenData: (data: any) => void;
  handleApproveNft: () => Promise<void>;
}

const PutOnSaleModal: React.FC<IPutOnSaleModal> = ({
  tokenId,
  handleSetTokenData,
  handleApproveNft,
}) => {
  return (
    <Modal className="put-on-sale" isOpen>
      <PutOnSaleForm
        handleApproveNft={handleApproveNft}
        totalSupply={0}
        tokenId={tokenId}
        handleSetTokenData={handleSetTokenData}
      />
    </Modal>
  );
};

export default PutOnSaleModal;

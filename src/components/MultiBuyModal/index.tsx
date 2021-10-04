import React from 'react';
import Modal from 'react-modal';
// import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { ISeller } from '../../pages/Token';
import { useMst } from '../../store/store';

import './MultiBuyModal.scss';

interface IMultiBuyModal {
  sellers: ISeller[];
  token: {
    name: string;
    available: number;
    currency: string;
  };
  collection: {
    name: string;
  };
}

const MultiBuyModal: React.FC<IMultiBuyModal> = observer(({ sellers, token, collection }) => {
  const { modals, user } = useMst();

  const handleClose = (): void => {
    modals.multibuy.close();
  };

  const handleBuy = (sellerId: number | string, quantity: number): void => {
    modals.multibuy.close();
    modals.checkout.open({
      token: {
        name: token.name,
        available: quantity,
      },
      collectionName: collection.name,
      sellerId,
    });
  };

  return (
    <Modal
      isOpen={modals.multibuy.isOpen}
      className="multibuy"
      onRequestClose={handleClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
    >
      <div className="multibuy__content">
        <div className="multibuy__content__title">Owners</div>
        <div className="multibuy__content__box">
          {sellers && sellers.length
            ? sellers
                .filter((seller: ISeller) => seller.id !== user.id)
                .map((seller) => (
                  <div className="seller">
                    <div className="seller__info">
                      <img
                        className="seller__info__avatar"
                        src={seller.avatar}
                        alt="seller avatar"
                      />
                      <div className="seller__info__content">
                        <span className="seller__info__name">{seller.name}</span>
                        <span className="seller__info__quantity">
                          {seller.quantity} {seller.quantity > 1 ? 'Tokens' : 'Token'}
                        </span>
                      </div>
                    </div>
                    <div className="seller__item">
                      <div className="seller__item__price">
                        <div className="seller__item__price__value">{seller.price}</div>
                        <div className="seller__item__price__currency">{token.currency}</div>
                      </div>
                      <button
                        className="gradient-button"
                        type="button"
                        onClick={() => handleBuy(seller.id, seller.quantity)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))
            : ''}
        </div>
      </div>
    </Modal>
  );
});

export default MultiBuyModal;

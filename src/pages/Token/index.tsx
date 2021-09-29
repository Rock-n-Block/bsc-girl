import React, { useCallback, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import LikeActive from '../../assets/img/icons/like-active.svg';
import Like from '../../assets/img/icons/like.svg';
import Verified from '../../assets/img/icons/verification.svg';
import { PutOnSaleModal } from '../../components';
import { contracts } from '../../config';
import { storeApi, userApi } from '../../services/api';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
// import { weiToEth } from '../../utils/ethOperations';
import { clog, clogData } from '../../utils/logger';

import './Token.scss';

interface ITokenId {
  tokenId: string;
}

interface IToken {
  USDPrice: number;
  available: number;
  collection: ICollection;
  creator: IUser;
  currency: string;
  description?: string;
  details?: any;
  id: number;
  media: string;
  name: string;
  updated_at: string;
  owners: IOwner[];
  tags: Array<string>;
  price: number;
  royalty: number;
  selling: true;
  standart: 'ERC721' | 'ERC1155';
  totalSupply: number;
  serviceFee: number;
  sellers: ISeller[];
  history: any[];
  is_liked: boolean;
}
interface IUser {
  is_verificated: boolean | undefined;
  id: number;
  avatar: string;
  name: string;
}
export interface ICollection extends IUser {
  address: string;
}
export interface ISeller extends IUser {
  quantity: number;
  price: number;
}
export interface IAucOwner extends IUser {
  address: string;
}
export interface IOwner extends IUser {
  quantity: number;
  price?: number;
  auction?: boolean;
  is_verificated: boolean;
}

const TokenPage: React.FC = () => {
  const history = useHistory();
  const connector = useWalletConnectService();
  const { user } = useMst();
  const { tokenId } = useParams<ITokenId>();
  const { contract, type } = contracts;

  const [activeTab, setActiveTab] = useState<string>('Info');
  const [tokenData, setTokenData] = useState<IToken>({} as IToken);
  const [isApproved, setApproved] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isMyToken, setMyToken] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isPutOnSaleModalOpen, setPutOnSaleModal] = useState<boolean>(false);

  const createBuyTransaction = async (buyTokenData: any) => {
    try {
      await connector.connectorService.createTransaction(
        buyTokenData.initial_tx.method,
        [
          buyTokenData.initial_tx.data.idOrder,
          buyTokenData.initial_tx.data.SellerBuyer,
          buyTokenData.initial_tx.data.tokenToBuy,
          buyTokenData.initial_tx.data.tokenToSell,
          buyTokenData.initial_tx.data.fee.feeAddresses,
          [
            buyTokenData.initial_tx.data.fee.feeAmounts[0].toString(),
            buyTokenData.initial_tx.data.fee.feeAmounts[1].toString(),
          ],
          buyTokenData.initial_tx.data.signature,
        ],
        tokenData.currency,
        {
          gas: buyTokenData.initial_tx.gas,
          gasPrice: buyTokenData.initial_tx.gasPrice,
          nonce: buyTokenData.initial_tx.nonce,
          to: buyTokenData.initial_tx.to,
          value: buyTokenData.initial_tx.value,
        },
      );
      setLoading(false);
      clog('Congratulations');
    } catch (err) {
      clogData('createTransaction error:', err);
      setLoading(false);
      clog('Something went wrong');
    }
  };

  const handleBuy = async (quantity = 1) => {
    if (+user.balance[tokenData.currency.toLowerCase()] < +tokenData.price) {
      clog(`You don't have enough ${tokenData.currency}`);
      return;
    }
    setLoading(true);

    try {
      const { data: buyTokenData }: any = await storeApi.buyToken(
        tokenId,
        tokenData.standart === 'ERC721' ? 0 : quantity,
        contract[tokenData.currency].chain[type].address,
        tokenData.creator.id,
      );

      await createBuyTransaction(buyTokenData);
      setLoading(false);
    } catch (err: any) {
      clogData('Something went wrong: ', err);
      setLoading(false);
    }
  };

  const handlePutOnSale = (): void => {
    setPutOnSaleModal(true);
  };

  const handleApprove = (): void => {
    setLoading(true);
    connector.connectorService
      .approveToken(
        tokenData.currency,
        contract[tokenData.currency].params?.decimals || 18,
        contract.EXCHANGE.chain[type].address,
      )
      .then(() => {
        setLoading(false);
        setApproved(true);
      })
      .catch((err: any) => {
        clogData('approve', err);
        setLoading(false);
        setApproved(false);
        clog('Something went wrong');
      });
  };

  const handleLike = (): void => {
    userApi
      .like({ id: tokenData.id.toString() })
      .then(({ data }) => {
        if (data === 'liked') {
          setIsLiked(true);
          user.addLike();
        } else {
          setIsLiked(false);
          user.removeLike();
        }
      })
      .catch((err: any) => {
        clogData('handle like', err);
        clog('Something went wrong');
      });
  };

  const handleSetTokenData = useCallback((data: any): void => {
    let owners = [];
    if (data.standart === 'ERC1155') {
      owners = data.owners;
    } else {
      owners.push(data.owners);
    }
    setTokenData({
      USDPrice: data.USD_price,
      available: data.available,
      collection: data.collection,
      creator: data.creator,
      currency: data.currency.symbol.toUpperCase(),
      description: data.description,
      details: data.details,
      id: data.id,
      media: data.media,
      name: data.name,
      updated_at: data.updated_at,
      tags: data.tags,
      owners,
      price: data.price,
      royalty: data.royalty,
      selling: data.selling,
      standart: data.standart,
      totalSupply: data.total_supply,
      serviceFee: data.service_fee,
      sellers: data.sellers,
      history: data.history,
      is_liked: data.is_liked,
    });
  }, []);

  clogData('tokenData:', tokenData);

  const handleRemoveFromSale = (): void => {
    setLoading(true);
    storeApi
      .putOnSale(+tokenId, null, '', true)
      .then(({ data }) => {
        handleSetTokenData(data);
        clog('Congratulations you successfully removed token from sale');
      })
      .catch((err) => {
        clogData('Put on sale fixed price', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenCheckout = (): void => {
    // modals.multibuy.open();
  };

  const handleCheckApproveNft = async () => {
    try {
      return await connector.connectorService.checkNftTokenAllowance(
        tokenData.collection.address,
        user.address,
      );
    } catch (err) {
      clogData('checkApprove', err);
      return false;
    }
  };

  const handleApproveNft = async (): Promise<void> => {
    try {
      const isAppr: boolean = await handleCheckApproveNft();
      if (!isAppr) {
        await connector.connectorService.createTransaction(
          'setApprovalForAll',
          [contract.EXCHANGE.chain[type].address, true],
          'COLLECTION',
          false,
          tokenData.collection.address,
        );
      }
    } catch (err: any) {
      clogData('handleApproveNft', err);
    }
  };

  const handleGetTokenData = React.useCallback((): void => {
    storeApi
      .getToken(tokenId)
      .then(({ data: tokendata }: any) => {
        handleSetTokenData(tokendata);
      })
      .catch((err: any) => {
        clogData('get token', err);
        history.push('/');
      });
  }, [tokenId, handleSetTokenData, history]);

  useEffect(() => {
    handleGetTokenData();
  }, [handleGetTokenData, user.address]);

  useEffect(() => {
    if (Object.keys(tokenData).length && user.id) {
      if (tokenData.owners.find((owner: IUser) => owner.id === user.id)) {
        setMyToken(true);
      }
    } else {
      setMyToken(false);
    }
  }, [tokenData, user.id, user.address, user]);

  useEffect(() => {
    if (user.address && tokenData.currency) {
      connector.connectorService
        .checkTokenAllowance(
          tokenData.currency,
          contract[tokenData.currency].params?.decimals || 18,
          contract.EXCHANGE.chain[type].address,
        )
        .then((res: boolean | ((prevState: boolean) => boolean)) => {
          setApproved(res);
        })
        .catch((err: any) => {
          setApproved(false);
          clogData('checkTokenAllowance', err);
        });
    }
  }, [connector.connectorService, contract, tokenData.currency, type, user.address]);

  useEffect(() => {
    if (Object.keys(tokenData).length) {
      setIsLiked(tokenData.is_liked);
    }
  }, [tokenData, tokenData.id, user, user.id]);

  const getDetails = () => {
    if (Object.keys(tokenData).length) {
      if (activeTab === 'Info')
        return (
          <div className="token__content__details__data">
            <div className="person">
              <Link to={`profile/${tokenData.owners[0].id}`}>
                <div className="person__img">
                  <img className="avatar" src={tokenData.owners[0].avatar} alt="person avatar" />
                  {tokenData.owners[0].is_verificated ? (
                    <img className="verified" src={Verified} alt="verified" />
                  ) : (
                    ''
                  )}
                </div>
              </Link>
              <div className="info">
                Owner
                <div className="info__position">{tokenData.owners[0].name}</div>
              </div>
            </div>
            <div className="person">
              <div className="person__img">
                <img className="avatar" src={tokenData.creator.avatar} alt="person avatar" />
                {tokenData.creator.is_verificated ? (
                  <img className="verified" src={Verified} alt="verified" />
                ) : (
                  ''
                )}
              </div>
              <div className="info">
                Artist
                <div className="info__position">{tokenData.creator.name}</div>
              </div>
            </div>
            <div className="warning">{tokenData.royalty}% of sales will go to creator</div>
          </div>
        );
      if (activeTab === 'Owners')
        return (
          <div className="token__content__details__data">
            {tokenData.owners.map((owner) => (
              <div className="person">
                <Link id={`${owner.id}`} to={`profile/${owner.id}`}>
                  <div className="person__img">
                    <img className="avatar" src={owner.avatar} alt="person avatar" />
                    {owner.is_verificated ? (
                      <img className="verified" src={Verified} alt="verified" />
                    ) : (
                      ''
                    )}
                  </div>
                </Link>
                <div className="info">
                  Owner
                  <div className="info__position">{owner.name}</div>
                </div>
              </div>
            ))}
          </div>
        );
      if (activeTab === 'History')
        return (
          <div className="token__content__details__data">
            {tokenData.history.map((item: any) => (
              <div className="person">
                <div className="person__img">
                  <img className="avatar" src={item.avatar} alt="person avatar" />
                </div>
                <div className="info">
                  {item.method}
                  <div className="info__position">{item.name}</div>
                </div>
              </div>
            ))}
          </div>
        );
    }
    return <div className="grey-text">No info</div>;
  };

  return (
    <div className="container">
      <div className="token">
        <div className="token__image">
          <img src={tokenData.media} alt="token" />
        </div>
        <div className="token__content">
          <div className="token__content__card">
            <div className="token__content__card__header">
              {tokenData.tags?.map((tag) => (
                <Link to="/">
                  <div className="shadow-block type">{tag}</div>
                </Link>
              ))}
            </div>
            <div className="token__content__card__title">{tokenData.name}</div>
            <div className="token__content__card__price">
              <div className="value">
                {!tokenData.price || !tokenData.selling
                  ? 'Not for sale'
                  : `${tokenData.price} ${tokenData.currency || 'BSCGIRL'}`}
                {tokenData.standart === 'ERC1155' ? (
                  <div className="value__count">
                    {tokenData.available} of {tokenData.totalSupply}
                  </div>
                ) : (
                  ''
                )}
              </div>
              {tokenData.price && tokenData.selling ? (
                <div className="converted">${tokenData.USDPrice}</div>
              ) : (
                ''
              )}
            </div>
            {(tokenData.standart === 'ERC721' && !tokenData.selling && isMyToken) ||
            (tokenData.standart === 'ERC1155' &&
              !tokenData.sellers.find((seller) => seller.id === user.id) &&
              isMyToken) ? (
              <button
                type="button"
                className="token__content__card__btn gradient-button"
                onClick={handlePutOnSale}
              >
                {isLoading ? 'In progress...' : 'Put on sale'}
              </button>
            ) : (
              ''
            )}
            {(tokenData.standart === 'ERC721' &&
              tokenData.price &&
              tokenData.selling &&
              isMyToken) ||
            (tokenData.standart === 'ERC1155' &&
              tokenData.sellers.find((seller) => seller.id === user.id) &&
              isMyToken) ? (
              <button
                type="button"
                className="token__content__card__btn gradient-button"
                onClick={handleRemoveFromSale}
              >
                {isLoading ? 'In progress...' : 'Remove from sale'}
              </button>
            ) : (
              ''
            )}
            {user.address ? (
              <>
                {(tokenData.standart === 'ERC721' && !isMyToken) ||
                (tokenData.standart === 'ERC1155' && !isMyToken) ||
                (tokenData.standart === 'ERC1155' &&
                  isMyToken &&
                  (tokenData.selling ? tokenData.available !== 0 : true) &&
                  (tokenData.selling
                    ? (tokenData.sellers.length === 1 && tokenData.sellers[0].id !== user.id) ||
                      tokenData.sellers.length > 1 ||
                      tokenData.owners.length > 1
                    : tokenData.owners.length > 1)) ? (
                  <>
                    {isApproved ? (
                      <>
                        {(tokenData.standart === 'ERC721' &&
                          tokenData.price &&
                          tokenData.selling) ||
                        (tokenData.standart === 'ERC1155' &&
                          tokenData.sellers.length === 1 &&
                          tokenData.sellers[0].id !== user.id) ||
                        tokenData.sellers.length > 1 ? (
                          <button
                            type="button"
                            className="token__content__card__btn gradient-button"
                            onClick={() => {
                              return tokenData.standart === 'ERC721'
                                ? handleBuy()
                                : handleOpenCheckout();
                            }}
                          >
                            {isLoading ? 'In progress...' : 'Buy now'}
                          </button>
                        ) : (
                          ''
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        className="token__content__card__btn gradient-button"
                        onClick={handleApprove}
                      >
                        {isLoading ? 'In progress...' : 'Approve Token'}
                      </button>
                    )}
                  </>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
            <div className="token__content__card__description">
              Name: {tokenData.name}
              <br />
              Standart: {tokenData.standart}
              <br />
              Update at: {tokenData.updated_at}
            </div>
            <div className="token__content__card__btns">
              <div
                className="token__content__card__like"
                role="button"
                tabIndex={0}
                onClick={handleLike}
                onKeyPress={() => {}}
              >
                <img src={isLiked ? LikeActive : Like} alt="like" />
              </div>
            </div>
          </div>
          <div className="token__content__details">
            <div className="token__content__details__navbar">
              <div
                className={`token__content__details__navbar__link ${
                  activeTab === 'Info' ? 'active' : undefined
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('Info')}
                onKeyPress={() => {}}
              >
                Info
              </div>
              <div
                className={`token__content__details__navbar__link ${
                  activeTab === 'Owners' ? 'active' : undefined
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('Owners')}
                onKeyPress={() => {}}
              >
                Owners
              </div>
              <div
                className={`token__content__details__navbar__link ${
                  activeTab === 'History' ? 'active' : undefined
                }`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('History')}
                onKeyPress={() => {}}
              >
                History
              </div>
              {/* <div */}
              {/*   className={`token__content__details__navbar__link ${ */}
              {/*     activeTab === 'Details' ? 'active' : undefined */}
              {/*   }`} */}
              {/*   role="button" */}
              {/*   tabIndex={0} */}
              {/*   onClick={() => setActiveTab('Details')} */}
              {/*   onKeyPress={() => {}} */}
              {/* > */}
              {/*   Details */}
              {/* </div> */}
            </div>
            {getDetails()}
          </div>
          {isPutOnSaleModalOpen ? (
            <PutOnSaleModal
              tokenId={tokenData.id}
              handleSetTokenData={handleSetTokenData}
              handleApproveNft={handleApproveNft}
              closePutOnSale={() => setPutOnSaleModal(false)}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenPage;

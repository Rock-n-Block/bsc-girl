import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { observer } from 'mobx-react';

import LikeActive from '../../assets/img/icons/like-active.svg';
import LikeHover from '../../assets/img/icons/like-hover.svg';
import Like from '../../assets/img/icons/like.svg';
import Loader from '../../assets/img/icons/loader.svg';
import More from '../../assets/img/icons/more.svg';
import Transfer from '../../assets/img/icons/transfer.svg';
import Verified from '../../assets/img/icons/verification.svg';
import { CheckoutModal, MultiBuyModal, PutOnSaleModal, TransferModal } from '../../components';
import { contracts } from '../../config';
import { storeApi, userApi } from '../../services/api';
import { useWalletConnectService } from '../../services/connectwallet';
import { useMst } from '../../store/store';
import { clogData } from '../../utils/logger';

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
  id: number;
  media: string;
  format: string;
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
  id: number | string;
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
}

const TokenPage: React.FC = observer(() => {
  const history = useHistory();
  const connector = useWalletConnectService();
  const { modals, user } = useMst();
  const { tokenId } = useParams<ITokenId>();
  const { contract, type } = contracts;

  const [activeTab, setActiveTab] = useState<string>('Info');
  const [tokenData, setTokenData] = useState<IToken>({} as IToken);
  const [isApproved, setApproved] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isTokenLoading, setTokenLoading] = useState<boolean>(true);
  const [isMyToken, setMyToken] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isMouseOver, setMouseOver] = useState<boolean>(false);
  const [isMoreOpen, setMoreOpen] = useState<boolean>(false);
  const [available, setAvailable] = useState<number>(0);

  clogData('tokenData:', tokenData);

  const createBuyTransaction = async (tx: any) => {
    clogData('initial_tx:', tx);
    try {
      await connector.connectorService.createTransaction(
        tx.method,
        [
          tx.data.idOrder,
          tx.data.SellerBuyer,
          tx.data.tokenToBuy,
          {
            tokenAddress: tx.data.tokenToSell.tokenAddress,
            id: tx.data.tokenToSell.id,
            amount:
              tx.data.tokenToSell.tokenAddress === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
                ? tx.data.tokenToSell.amount.toString()
                : tx.data.tokenToSell.amount,
          },
          tx.data.fee.feeAddresses,
          [tx.data.fee.feeAmounts[0].toString(), tx.data.fee.feeAmounts[1].toString()],
          tx.data.signature,
        ],
        'BEP20',
        {
          gas: tx.gas,
          gasPrice: tx.gasPrice,
          nonce: tx.nonce,
          to: tx.to,
          value: tx.value,
        },
      );
      setLoading(false);
      modals.closeAll();
      modals.info.setMsg('Congrats you have buy token', 'success');
    } catch (err: any) {
      modals.closeAll();
      modals.error.setErr('Something went wrong');
      clogData('create transaction', err);
      setLoading(false);
    }
  };

  const handleBuy = async (quantity = 1) => {
    if (+user.balance[tokenData.currency.toLowerCase()] < +tokenData.price) {
      modals.closeAll();
      modals.info.setMsg(`You don't have enough ${tokenData.currency}`, 'error');
      return;
    }
    setLoading(true);

    try {
      const { data: buyTokenData }: any = await storeApi.buyToken(
        tokenId,
        tokenData.standart === 'ERC721' ? 0 : quantity,
        contract[tokenData.currency]?.chain[type]?.address ??
          '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        tokenData.owners[0].id.toString(),
      );

      await createBuyTransaction(buyTokenData.initial_tx);
      setLoading(false);
    } catch (err: any) {
      modals.closeAll();
      modals.error.setErr(err.message);
      clogData('buy token', err);
      setLoading(false);
    }
  };

  const handlePutOnSale = (): void => {
    modals.putOnSale.open();
  };

  const handleApprove = (): void => {
    setLoading(true);
    connector.connectorService
      .approveToken(
        tokenData.currency,
        tokenData.currency !== 'BNB' ? contract[tokenData.currency].params?.decimals || 8 : 18,
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
        modals.error.setErr('Something went wrong');
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
        modals.error.setErr('Something went wrong');
      });
  };

  const handleSetTokenData = (data: any): void => {
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
      currency: (data.currency?.symbol ?? data.currency).toUpperCase(),
      description: data.description,
      id: data.id,
      media: data.media,
      format: data.format,
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
  };

  const handleRemoveFromSale = (): void => {
    setLoading(true);
    storeApi
      .putOnSale(+tokenId, null, '', true)
      .then(({ data }) => {
        handleSetTokenData(data);
        modals.info.setMsg('Congratulations you successfully removed token from sale', 'success');
      })
      .catch((err) => {
        clogData('Remove from sale fixed price', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenCheckout = (): void => {
    modals.multibuy.open();
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

  useEffect(() => {
    if (tokenData.format === ('img' || 'gif' || 'image')) {
      const img = new Image();
      img.onload = () => setTokenLoading(false);
    } else if (tokenData.media) setTokenLoading(false);
  }, [tokenData.format, tokenData.media]);

  useEffect(() => {
    storeApi
      .getToken(tokenId)
      .then(({ data: tokendata }: any) => {
        handleSetTokenData(tokendata);
      })
      .catch((err: any) => {
        if (err.response.data === 'token not found') {
          history.push('/error');
        } else {
          history.push('/');
          modals.error.setErr('Something went wrong');
        }
      });
  }, [history, modals.error, tokenId]);

  useEffect(() => {
    if (Object.keys(tokenData).length && user.id) {
      if (tokenData.owners.find((owner) => owner.id === user.id)) {
        setMyToken(true);
      }
    } else {
      setMyToken(false);
    }
  }, [tokenData, user.id]);

  useEffect(() => {
    if (tokenData?.owners?.length) {
      for (let i = 0; i < tokenData.owners.length; i += 1) {
        if (tokenData.owners[i].id === user.id) setAvailable(tokenData.owners[i].quantity);
      }
    }
  }, [tokenData.owners, user.id]);

  useEffect(() => {
    if (user.address && tokenData.currency) {
      connector.connectorService
        .checkTokenAllowance(
          tokenData.currency,
          tokenData.currency !== 'BNB' ? contract[tokenData.currency].params?.decimals || 8 : 18,
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
  }, [tokenData, user]);

  clogData('my token?', isMyToken);

  return (
    <div className="container">
      <div className="token">
        {isTokenLoading ? (
          <div className="loading">
            Loading <img src={Loader} alt="loader" />
          </div>
        ) : (
          <div className="token__image">
            {tokenData.format === 'video' ? (
              <video controls>
                <source src={tokenData.media} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                <track kind="captions" />
              </video>
            ) : (
              ''
            )}
            {tokenData.format === 'audio' ? (
              <audio controls>
                <source src={tokenData.media} />
                <track kind="captions" />
              </audio>
            ) : (
              ''
            )}
            {tokenData.format === 'gif' ||
            tokenData.format === 'image' ||
            tokenData.format === 'img' ? (
              <img src={tokenData.media} alt="token" />
            ) : (
              ''
            )}
          </div>
        )}
        <div className="token__content">
          <div className="token__content__card">
            <div className="token__content__card__header">
              <div
                className="shadow-block token__content__card__header__nav"
                role="button"
                tabIndex={0}
                onKeyPress={() => {}}
                onClick={handleLike}
                onBlur={() => {}}
                onFocus={() => {}}
                onMouseOver={() => setMouseOver(true)}
                onMouseOut={() => setMouseOver(false)}
              >
                {isMouseOver && !isLiked ? (
                  <img src={LikeHover} alt="like hover icon" />
                ) : (
                  <img src={isLiked ? LikeActive : Like} alt="like" />
                )}
              </div>
              {isMyToken ? (
                <div
                  className="shadow-block token__content__card__header__nav"
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => {}}
                  onClick={() => {
                    setMoreOpen(!isMoreOpen);
                  }}
                >
                  <img src={More} alt="more icon" />
                </div>
              ) : (
                ''
              )}
              {isMoreOpen ? (
                <div className="more">
                  <div
                    className="more__transfer"
                    role="button"
                    tabIndex={0}
                    onKeyPress={() => {}}
                    onClick={() => {
                      modals.transferModal.open();
                      setMoreOpen(false);
                    }}
                  >
                    <img src={Transfer} alt="transfer icon" />
                    Transfer token
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
            <div className="token__content__card__tags">
              {tokenData.tags?.map((tag) => (
                <div className="shadow-block type">{tag}</div>
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
                onClick={() => handleRemoveFromSale()}
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
                    {isApproved || tokenData.currency === 'BNB' ? (
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
                        onClick={() => handleApprove()}
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
              Description: {tokenData.description}
              <br />
              Standart: {tokenData.standart}
              <br />
              Update at:{' '}
              {tokenData.updated_at
                ? `${tokenData.updated_at.substr(0, 10)} ${tokenData.updated_at.substr(11, 8)}`
                : ''}
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
            </div>
            {tokenData.owners && tokenData.owners.length ? (
              <div className="token__content__details__data">
                {activeTab === 'Info' ? (
                  <>
                    <div className="person">
                      <Link to={`/profile/${tokenData.owners[0].id}`}>
                        <div className="person__img">
                          <img
                            className="avatar"
                            src={tokenData.owners[0].avatar}
                            alt="person avatar"
                          />
                          {tokenData.owners[0].is_verificated ? (
                            <img className="verified" src={Verified} alt="verified" />
                          ) : (
                            ''
                          )}
                        </div>
                      </Link>
                      <div className="info">
                        Owner
                        <div className="info__position">
                          {tokenData.owners[0].name.length > 16
                            ? `${tokenData.owners[0].name.substr(0, 15)}...`
                            : tokenData.owners[0].name}
                        </div>
                      </div>
                    </div>
                    <div className="person">
                      <Link to={`/profile/${tokenData.creator.id}`}>
                        <div className="person__img">
                          <img
                            className="avatar"
                            src={tokenData.creator.avatar}
                            alt="person avatar"
                          />
                          {tokenData.creator.is_verificated ? (
                            <img className="verified" src={Verified} alt="verified" />
                          ) : (
                            ''
                          )}
                        </div>
                      </Link>
                      <div className="info">
                        Artist
                        <div className="info__position">
                          {tokenData.creator.name.length > 16
                            ? `${tokenData.creator.name.substr(0, 15)}...`
                            : tokenData.creator.name}
                        </div>
                      </div>
                    </div>
                    <div className="warning">{tokenData.royalty}% of sales will go to creator</div>
                  </>
                ) : (
                  ''
                )}
                {activeTab === 'Owners' ? (
                  <div className="token__content__details__data">
                    {tokenData.owners.map((owner) => (
                      <div className="person">
                        <Link id={`${owner.id}`} to={`/profile/${owner.id}`}>
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
                          <div className="info__position">
                            {owner.name.length > 16 ? `${owner.name.substr(0, 15)}...` : owner.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ''
                )}
                {activeTab === 'History' ? (
                  <div className="token__content__details__data">
                    {tokenData.history.map((item: any) => (
                      <div className="person">
                        <Link to={`/profile/${item.id}`}>
                          <div className="person__img">
                            <img className="avatar" src={item.avatar} alt="person avatar" />
                          </div>
                        </Link>
                        <div className="info">
                          {item.method}
                          <div className="info__position">
                            {item.name.length > 16 ? `${item.name.substr(0, 15)}...` : item.name}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  ''
                )}
              </div>
            ) : (
              ''
            )}
          </div>
          {(tokenData.standart === 'ERC721' && isMyToken && !tokenData.selling) ||
          (tokenData.standart === 'ERC1155' &&
            !tokenData.sellers.find((seller) => seller.id === user.id) &&
            isMyToken) ? (
            <>
              <PutOnSaleModal
                tokenData={tokenData}
                handleSetTokenData={handleSetTokenData}
                handleApproveNft={handleApproveNft}
              />
            </>
          ) : (
            ''
          )}
          <CheckoutModal handleBuy={handleBuy} isLoading={isLoading} />
          {tokenData.standart === 'ERC1155' ? (
            <MultiBuyModal
              sellers={tokenData.sellers}
              token={tokenData}
              collection={tokenData.collection}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      <TransferModal tokenId={tokenData.id} available={available} />
    </div>
  );
});

export default TokenPage;

import React, {useState} from 'react';

import {tokenInfo} from '../../data';

import TokenImg from '../../assets/img/img-token.png';
import ShareIcon from '../../assets/img/icons/share-icon.svg';
import OwnerAva from '../../assets/img/populars-1.png';
import ArtistAva from '../../assets/img/populars-7.png';
import CollectionAva from '../../assets/img/populars-4.png';
import Verified from '../../assets/img/icons/verification.svg';

import './Token.scss';

const TokenPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Info');

  const getDetails = () => {
    if (activeTab === 'Info') return (
      <div className="token__content__details__data">
        <div className="person">
          <div className="person__img">
            <img className="avatar" src={OwnerAva} alt="person avatar" />
            <img className="verified" src={Verified} alt="verified" />
          </div>
          Owner
        </div>
        <div className="person">
          <div className="person__img">
            <img src={ArtistAva} alt="person avatar" />
          </div>
          <div className="info">
            Artist
            <div className="info__position">Digital Sailor</div>
          </div>
        </div>
        <div className="warning">15% of sales will go to creator</div>
        <div className="person">
          <div className="person__img">
            <img className="avatar" src={CollectionAva} alt="person avatar" />
            <img className="verified" src={Verified} alt="verified" />
          </div>
          <div className="info">
            COLLECTION (ERC1155)
            <div className="info__position">Diamond HODLR Collecto...</div>
          </div>
        </div>
      </div>
    );
    if (activeTab === 'Owners') return <div className="grey-text">1 owner</div>
    if (activeTab === 'History') return <div className="grey-text">No history yet</div>
    return <div className="grey-text">No details yet</div>
  };

  return (
    <div className="container">
      <div className="token">
        <img className="token__image" src={TokenImg} alt="token" />
        <div className="token__content">
          <div className="token__content__card">
            <div className="token__content__card__header">
              <div className="shadow-block type">Art</div>
              <div className="shadow-block share">
                <img src={ShareIcon} alt="share" />
              </div>
            </div>
            <div className="token__content__card__title">
              CryptoCrawlerz - Series 01 - #002 - Skweebo
            </div>
            <div className="token__content__card__price">
              <div className="value">
                0.4 BSCGIRL
                <div className="value__count">1 of 30</div>
              </div>
              <div className="converted">$713.60</div>
            </div>
            <button type="button" className="token__content__card__btn gradient-button">Buy now</button>
            <div className="token__content__card__description">
              Name: {tokenInfo.name}
              <br/>
              Series: {tokenInfo.series}
              <br/>
              Number: {tokenInfo.number}
              <br/>
              Strengths: {tokenInfo.strengths}
            </div>
            <button type="button" className="token__content__card__read-more">Read more</button>
          </div>
          <div className="token__content__details">
            <div className="token__content__details__navbar">
              <div
                className={`token__content__details__navbar__link ${activeTab === 'Info' ? 'active' : undefined}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('Info')}
                onKeyPress={() => {}}
              >Info</div>
              <div
                className={`token__content__details__navbar__link ${activeTab === 'Owners' ? 'active' : undefined}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('Owners')}
                onKeyPress={() => {}}
              >Owners</div>
              <div
                className={`token__content__details__navbar__link ${activeTab === 'History' ? 'active' : undefined}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('History')}
                onKeyPress={() => {}}
              >History</div>
              <div
                className={`token__content__details__navbar__link ${activeTab === 'Details' ? 'active' : undefined}`}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTab('Details')}
                onKeyPress={() => {}}
              >Details</div>
            </div>
            {getDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Default from '../../assets/img/card-default.png';
import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftGradient from '../../assets/img/icons/arrow-left-gradient.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import ArrowRightGradient from '../../assets/img/icons/arrow-right-gradient-active.svg';
import Close from '../../assets/img/icons/close-icon.svg';
import Inst from '../../assets/img/icons/logo-inst.svg';
import Twitter from '../../assets/img/icons/logo-tw.svg';
import PlusWhite from '../../assets/img/icons/plus-icon-white.svg';
import Refresh from '../../assets/img/icons/refresh-icon.svg';
import { CreateModal, TokenCard } from '../../components';

import './CreateCollectible.scss';

type TypeCreateCollectibleProps = {
  collectible: string;
};

const CreateCollectiblePage: React.FC<TypeCreateCollectibleProps> = ({ collectible }) => {
  const [price, setPrice] = useState('10');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [royalties, setRoyalties] = useState('');
  const [numOfCopies, setNumOfCopies] = useState('');
  const [propName, setPropName] = useState('');
  const [propValue, setPropValue] = useState('');
  const [twitter, setTwitter] = useState('');
  const [inst, setInst] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);

  const formData = {
    name,
    price,
    description,
    royalties,
    numOfCopies,
    [propName]: propValue,
    twitter,
    inst,
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleClickCreate = () => {
    let isOk = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key] && (key !== 'twitter' || 'inst')) isOk = false;
    });

    if (isOk) openModal();
    else alert('Please, enter all required inputs');
  };

  return (
    <div className="container">
      <div className="create-collectible">
        <div className="create-collectible__title">
          <Link to="/create">
            <img src={ArrowLeftRed} alt="arrow left soft-red" className="link-red" />
            <img src={ArrowLeftBlack} alt="arrow left black" className="link-black" />
          </Link>
          Create&nbsp;
          <div className="red">{collectible}</div>
          &nbsp;collectible
        </div>
        <div className="create-collectible__main">
          <div className="create-form">
            <div className="create-form__title">Upload file</div>
            <div className="create-form__upload">
              <button type="button">
                <img src={Close} alt="close icon" />
              </button>
              PNG, GIF, WEBP, MP4 or MP3. Max 30mb.
            </div>
            <div className="create-form__enter-price">
              <div className="create-form__enter-price__title">Enter price for one piece</div>
              <div className="gradient">
                <div className="create-form__enter-price__input">
                  <input
                    type="text"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                  />
                  <div className="currency">BSCGIRL</div>
                </div>
              </div>
              <div className="fee">Service fee 25%</div>
              <div className="result">
                <div className="result__receive">You will receive</div>
                <div className="result__value">{Number(price) * 0.75} BSCGIRL</div>
                <div className="result__usd">$0.00</div>
              </div>
            </div>
            <div className="create-form__collection">
              <div className="create-form__collection__nav">
                <div className="gradient-text create-form__collection__nav__title">
                  Choose collection
                </div>
                <div className="create-form__collection__nav__arrows">
                  <img src={ArrowLeftGradient} alt="arrow left gradient" />
                  <img src={ArrowRightGradient} alt="arrow right gradient" />
                </div>
                <div className="create-form__collection__nav__refresh">
                  <img src={Refresh} alt="refresh icon" />
                </div>
              </div>
              <div className="create-form__collection__items hide-scroll">
                <div className="item">
                  <div className="content">
                    <div className="gradient-button content__btn">
                      <img src={PlusWhite} alt="plus icon white" />
                    </div>
                    <div className="content__title">Create</div>
                    <div className="content__text">ERC-1185</div>
                  </div>
                </div>
                <div className="item">
                  <div className="content">
                    <div className="content__title">Name</div>
                    <div className="content__text">Name</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="create-form__fields">
              <div className="field">
                <div className="field__title">Name</div>
                <div className="field__input">
                  <input
                    type="text"
                    placeholder='e. g. "Redeemable T-Shirt with logo"'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <div className="field__title">Description</div>
                <div className="field__input">
                  <input
                    type="text"
                    placeholder='e. g. "After purchasing you’ll be able to get the real T-Shirt"'
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
              </div>
              <div className="create-form__fields__group">
                <div className="field">
                  <div className="field__title">Royalties</div>
                  <div className="field__input">
                    <input
                      type="text"
                      placeholder="10"
                      value={royalties}
                      onChange={(event) => setRoyalties(event.target.value)}
                    />
                    <div className="unit">%</div>
                  </div>
                  <div className="field__description">Suggested: 10%, 20%, 30%</div>
                </div>
                <div className="field">
                  <div className="field__title">Number of copies</div>
                  <div className="field__input">
                    <input
                      type="text"
                      placeholder="e. g. 10"
                      value={numOfCopies}
                      onChange={(event) => setNumOfCopies(event.target.value)}
                    />
                  </div>
                  <div className="field__description">Amount of tokens</div>
                </div>
                <div className="field">
                  <div className="field__title">Properties</div>
                  <div className="field__input">
                    <input
                      type="text"
                      placeholder="e. g. Size"
                      value={propName}
                      onChange={(event) => setPropName(event.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <div className="field__input">
                    <input
                      type="text"
                      placeholder="e. g. M"
                      value={propValue}
                      onChange={(event) => setPropValue(event.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="field__title">
                  <img src={Twitter} alt="twitter logo" />
                  Twitter Username
                </div>
                <div className="field__input">
                  <input
                    type="text"
                    placeholder="@"
                    value={twitter}
                    onChange={(event) => setTwitter(event.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <div className="field__title">
                  <img src={Inst} alt="instagram logo" />
                  Instagram Username
                </div>
                <div className="field__input">
                  <input
                    type="text"
                    placeholder="@"
                    value={inst}
                    onChange={(event) => setInst(event.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleClickCreate()}
                className="gradient-button btn"
              >
                Create item
              </button>
            </div>
          </div>
          <div className="preview">
            <div className="preview__title">Preview</div>
            <div className="preview__card">
              <TokenCard users={[]} img={Default} title={name} price={Number(price)} />
            </div>
          </div>
        </div>
      </div>
      <CreateModal isOpen={modalIsOpen} closeModal={closeModal} />
    </div>
  );
};

export default CreateCollectiblePage;

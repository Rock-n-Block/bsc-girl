import React from 'react';
import { Link } from 'react-router-dom';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import MultipleImg from '../../assets/img/multiple.svg';
import SingleImg from '../../assets/img/single.svg';

import './Create.scss';

type TypeCreatePageProps = {
  chooseCollectible: (value: string) => void;
};

const CreatePage: React.FC<TypeCreatePageProps> = ({ chooseCollectible }) => {
  return (
    <div className="container">
      <div className="create">
        <div className="create__title">
          <Link to="/">
            <img src={ArrowLeftRed} alt="arrow left soft-red" className="link-red" />
            <img src={ArrowLeftBlack} alt="arrow left black" className="link-black" />
          </Link>
          Create collectible
        </div>
        <div className="create__text">
          Choose “Single” if you want your collectible to be one of a kind or “Multiple” if you want
          to sell one collectible multiple times
        </div>
        <div className="create__items">
          <Link to="/create-single">
            <div
              className="item"
              role="button"
              tabIndex={0}
              onClick={() => chooseCollectible('single')}
              onKeyPress={() => {}}
            >
              <div className="item__content">
                <img src={SingleImg} alt="single collectible" />
                <div className="item__content__text">Single</div>
              </div>
            </div>
          </Link>
          <Link to="/create-multiple">
            <div
              className="item"
              role="button"
              tabIndex={0}
              onClick={() => chooseCollectible('multiple')}
              onKeyPress={() => {}}
            >
              <div className="item__content">
                <img src={MultipleImg} alt="multiple collectible" />
                <div className="item__content__text">Multiple</div>
              </div>
            </div>
          </Link>
        </div>
        <div className="create__footer">
          We do not own your private keys and cannot access your funds without your confirmation
        </div>
      </div>
    </div>
  );
};

export default CreatePage;

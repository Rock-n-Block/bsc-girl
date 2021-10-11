import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import ArrowLeftBlack from '../../assets/img/icons/arrow-left-black.svg';
import ArrowLeftRed from '../../assets/img/icons/arrow-left-red.svg';
import { CreateForm } from '../../forms';

import './CreateCollectible.scss';

type TypeCreateProps = {
  isSingle: boolean;
};

const CreateCollectiblePage: React.FC<TypeCreateProps> = observer(({ isSingle }) => {
  return (
    <div className="container">
      <div className="create-collectible">
        <div className="create-collectible__title">
          <Link to="/create">
            <img src={ArrowLeftRed} alt="arrow left soft-red" className="link-red" />
            <img src={ArrowLeftBlack} alt="arrow left black" className="link-black" />
          </Link>
          Create&nbsp;
          <div className="red">{isSingle ? 'single' : 'multiple'}</div>
          &nbsp;collectible
        </div>
        <CreateForm isSingle={isSingle} />
      </div>
    </div>
  );
});

export default CreateCollectiblePage;
